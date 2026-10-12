




const MainPage = 'GlobalMasterRegisters.jsp';
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



/*$("#modaltype").click(function (){
	$("#exampleModalScrollablestype1").modal("show");
})*/

// ================= FETCH MODULES =================

function fetchModules() {

	$.ajax({
		url: new URL("/api/modules/getAll", baseUrl).toString(),
		type: "GET",
		xhrFields: { withCredentials: true },

		success: function(data) {

			let tbody = $("#typeSelectionTableBody");
			tbody.empty();

			if (!data || data.length === 0) {
				tbody.append(`
                    <tr>
                        <td colspan="3" class="text-center text-muted">
                            No records found
                        </td>
                    </tr>
                `);
				return;
			}

	/*		$.each(data, function(index, item) {

			
				
				tbody.append(`
				    <tr>
				        <td>${index + 1}</td>
				        <td>${item.moduleName}</td>
				        <td class="text-center">
				            <input type="checkbox" class="status-checkbox"
				                ${item.status == 1 ? 'checked' : ''}
				                onchange="confirmStatusChange('module', ${item.moduleID}, this)">
				        </td>
				        <td>
				            <i class="fa fa-pen text-muted cursor-pointer"
				               title="Edit" onclick="editModule(${item.moduleID})"></i>
				        </td>
				    </tr>
				`);
			});*/
			
			$.each(data, function(index, item) {

			    let isActive = item.status == 1;

			    tbody.append(`
			        <tr>
			            <td>${index + 1}</td>
			            <td>${item.moduleName}</td>
			            <td class="text-center">
			                <input type="checkbox" class="status-checkbox"
			                    ${isActive ? 'checked' : ''}
			                    onchange="confirmStatusChange('module', ${item.moduleID}, this)">
			            </td>
			            <td>
			                <i class="fa fa-pen ${isActive ? 'text-muted disabled-icon' : 'text-primary cursor-pointer'}"
			                   title="${isActive ? 'Disable module to edit' : 'Edit'}"
			                   ${isActive ? '' : `onclick="editModule(${item.moduleID})"`}
			                   style="${isActive ? 'pointer-events: none; opacity: 0.5;' : ''}"></i>
			            </td>
			        </tr>
			    `);
			});

			// Destroy existing DataTable
			if ($.fn.DataTable.isDataTable('#TypeSelectiontableID')) {
				$('#TypeSelectiontableID').DataTable().destroy();
			}

			$('#TypeSelectiontableID').DataTable({
				dom: '<"d-flex justify-content-between mb-2"Bf>rtip',

				buttons: [
					{
						extend: 'excelHtml5',
						text: 'Export to Excel',
						className: 'btn btn-primary btn-sm',
						filename: 'Modules_Report',
						title: 'Modules Report'
					}
				],

				paging: true,
				pageLength: 10,
				info: true,
				searching: true,
				ordering: true
			});
		},

		error: function(xhr, status, error) {
			console.error("Fetch Module Error:", error);
			alert("Failed to load Modules");
		}
	});
}





function fetchAllDepartment() {

	$.ajax({
		url: new URL("/api/modules/getAlldept", baseUrl).toString(),
		type: "GET",
		xhrFields: { withCredentials: true },

		success: function(data) {

			let tbody = $("#DepartmentTableBody");
			tbody.empty();

			if (!data || data.length === 0) {
				tbody.append(`
                    <tr>
                        <td colspan="3" class="text-center text-muted">
                            No records found
                        </td>
                    </tr>
                `);
				return;
			}

			$.each(data, function(index, item) {

			    let isActive = item.status == 1;

			    tbody.append(`
			        <tr>
			            <td>${index + 1}</td>
			            <td>${item.deptName}</td>
			            <td class="text-center">
			                <input type="checkbox" class="status-checkbox"
			                    ${isActive ? 'checked' : ''}
			                    onchange="confirmStatusChange('department', ${item.deptId}, this)">
			            </td>
			            <td>
			                <i class="fa fa-pen ${isActive ? 'text-muted disabled-icon' : 'text-primary cursor-pointer'}"
			                   title="${isActive ? 'Disable to edit' : 'Edit'}"
			                   ${isActive ? '' : `onclick="editDept(${item.deptId})"`}
			                   style="${isActive ? 'pointer-events: none; opacity: 0.5;' : ''}"></i>
			            </td>
			        </tr>
			    `);
			});

			// Destroy existing DataTable
			if ($.fn.DataTable.isDataTable('#DeptSelectionID')) {
				$('#DeptSelectionID').DataTable().destroy();
			}

			$('#DeptSelectionID').DataTable({
				dom: '<"d-flex justify-content-between mb-2"Bf>rtip',

				buttons: [
					{
						extend: 'excelHtml5',
						text: 'Export to Excel',
						className: 'btn btn-primary btn-sm',
						filename: 'Department_Report',
						title: 'Department Report'
					}
				],

				paging: true,
				pageLength: 10,
				info: true,
				searching: true,
				ordering: true
			});
		},

		error: function(xhr, status, error) {
			console.error("Fetch Module Error:", error);
			alert("Failed to load Modules");
		}
	});
}


// ================= OPEN CREATE MODAL =================

$("#modaltype").click(function () {

	const allowed = allowedActions || [];

	if (!allowed.includes("Insert")) {
	  alert(" You do not have permission to Insert");
	  return;
	}
	
	
	$("#module").val("");
	$("#moduleError").hide();

	$("#exampleModalScrollablestype1").modal("show");
});






// ================= CREATE VALIDATION =================

$("#createModule").click(function() {

	let moduleName = $("#module").val().trim();

	if (!moduleName) {
		$("#moduleError").show();
		return;
	} else {
		$("#moduleError").hide();
	}

	$("#confimationtypemodal").modal("show");
});



// ================= CREATE CONFIRM =================

$("#confirmtype").click(function() {

	$("#confimationtypemodal").modal("hide");

	handleModuleCreation();
});




$("#modaldept").click(function () {

	
	const allowed = allowedActions || [];

	if (!allowed.includes("Insert")) {
	  alert(" You do not have permission to Insert");
	  return;
	}
	
	$("#deptval").val("");
	$("#deptvalError").hide();

	$("#Departmenttype").modal("show");
});


// ================= CHECK DUPLICATE =================

function handleModuleCreation() {

	let moduleName = $("#module").val().trim();

	$.ajax({
		url: new URL(
			`/api/modules/check/module?moduleName=${encodeURIComponent(moduleName)}`,
			baseUrl
		).toString(),

		type: "GET",

		xhrFields: {
			withCredentials: true
		},

		success: function(response) {

			if (response.exists === true) {

				$("#duplicateTypeMessage")
					.text("Module already exists.");

				$("#duplicateTypeModal").modal("show");

			} else {

				insertModule(moduleName);
			}
		},

		error: function(xhr, status, error) {

			console.error("Module check API Error:", error);

			alert("An error occurred while checking Module");
		}
	});
}



// ================= INSERT MODULE =================

function insertModule(moduleName) {

	let currentDateTimeString = getIndianDateTimeFormat(new Date());

	let requestData = {

		moduleName: moduleName,
		createdBy: sessionStorage.getItem('id'),
		createdDate: currentDateTimeString,
		status: 0
	};

	$.ajax({

		url: new URL("/api/modules", baseUrl).toString(),

		type: "POST",

		contentType: "application/json",

		data: JSON.stringify(requestData),

		xhrFields: {
			withCredentials: true
		},

		success: function() {

			showPopup("Module created successfully", "GlobalMasterRegisters.jsp");
		},

		error: function(xhr, status, error) {

			console.error("Insert Module Error:", error);

			alert("Failed to insert Module");
		}
	});
}



// ================= EDIT MODULE =================

let originalModuleName = "";
let selectedModuleId = null;

function editModule(moduleId) {
 
	
	  const allowed = allowedActions || [];

	if (!allowed.includes("Edit")) {
	  alert(" You do not have permission to edit.");
	  return;
	}

	selectedModuleId = moduleId;

	$.ajax({

		url: new URL("/api/modules/get/" + moduleId, baseUrl).toString(),

		type: "GET",

		xhrFields: {
			withCredentials: true
		},

		success: function(response) {

			$("#typeUp").val(response.moduleName);

			originalModuleName = response.moduleName;

			$("#exampleModalScrollablestypeUp").modal("show");
		},

		error: function(xhr, status, error) {

			console.error("Fetch Module Error:", error);

			alert("Failed to load Module data");
		}
	});
}



// ================= UPDATE VALIDATION =================

$("#createtypeUp").click(function() {

	let moduleName = $("#typeUp").val().trim();

	if (moduleName === "") {

		$("#typeUpError").show();

		return;

	} else {

		$("#typeUpError").hide();
	}

	$("#confimationupdatetypemodal").modal("show");
});



// ================= UPDATE CONFIRM =================

$("#confirmtypeUp").click(function() {

	let newModuleName = $("#typeUp").val().trim();

	$("#confimationupdatetypemodal").modal("hide");

	if (newModuleName === originalModuleName) {

		showPopup("No Fields Changed", "GlobalMasterRegisters.jsp");

		return;
	}

	checkDuplicateModuleForUpdate(newModuleName);
});



// ================= CHECK DUPLICATE FOR UPDATE =================

function checkDuplicateModuleForUpdate(moduleName) {

	$.ajax({

		url: new URL(
			`/api/modules/check/module?moduleName=${encodeURIComponent(moduleName)}`,
			baseUrl
		).toString(),

		type: "GET",

		xhrFields: {
			withCredentials: true
		},

		success: function(response) {

			if (response.exists) {

				$("#duplicateTypeMessage")
					.text("Module already exists.");

				$("#duplicateTypeModal").modal("show");

			} else {

				updateModule(moduleName);
			}
		},

		error: function() {

			alert("Error while checking duplicate Module");
		}
	});
}



// ================= UPDATE MODULE =================

function updateModule(moduleName) {

	let requestData = {

		moduleName: moduleName,

		modifiedBy: sessionStorage.getItem("id"),

		modifiedDate: getIndianDateTimeFormat(new Date())
	};

	$.ajax({

		url: new URL(`/api/modules/modified/${selectedModuleId}`, baseUrl).toString(),

		type: "PUT",

		contentType: "application/json",

		xhrFields: {
			withCredentials: true
		},

		data: JSON.stringify(requestData),

		success: function() {

			showPopup("Module updated successfully", "GlobalMasterRegisters.jsp");
		},

		error: function(xhr) {

			if (xhr.status === 409) {

				$("#duplicateTypeMessage")
					.text(xhr.responseText || "Module already exists");

				$("#duplicateTypeModal").modal("show");

			} else {

				alert("Failed to update Module");
			}
		}
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
	setTimeout(function() {
		popup.fadeOut(400, function() {
			$(this).remove();
			window.location = redirectUrl;
		});
	}, 2000);
}


// ================= INITIAL LOAD =================

$(document).ready( async function () {

	await  loadActions();
	fetchModules();
});


function fetchPages() {

    $.ajax({
        url: new URL("/api/modules/getAllPages", baseUrl).toString(),
        type: "GET",
        xhrFields: { withCredentials: true },

        success: function(data) {

            let tbody = $("#pageSelctionOuterbody");
            tbody.empty();

            if (!data || data.length === 0) {

                tbody.append(`
                    <tr>
                        <td colspan="5" class="text-center text-muted">
                            No records found
                        </td>
                    </tr>
                `);

                return;
            }

       /*     $.each(data, function(index, item) {

      
				
				tbody.append(`
				    <tr>
				        <td>${index + 1}</td>
				        <td>${item[1]}</td>
				        <td>${item[2]}</td>
				        <td>${item[3]}</td>
				        <td class="text-center">
				            <input type="checkbox" class="status-checkbox"
				                ${item[4] == 1 ? 'checked' : ''}
				                onchange="confirmStatusChange('page', ${item[0]}, this)">
				        </td>
				        <td>
				            <i class="fa fa-pen text-muted cursor-pointer"
				               title="Edit" onclick="editpage(${item[0]})"></i>
				        </td>
				    </tr>
				`);

            });*/
			
			
			$.each(data, function(index, item) {

			    let isActive = item[4] == 1;

			    tbody.append(`
			        <tr>
			            <td>${index + 1}</td>
			            <td>${item[1]}</td>
			            <td>${item[2]}</td>
			            <td>${item[3]}</td>
			            <td class="text-center">
			                <input type="checkbox" class="status-checkbox"
			                    ${isActive ? 'checked' : ''}
			                    onchange="confirmStatusChange('page', ${item[0]}, this)">
			            </td>
			            <td>
			                <i class="fa fa-pen ${isActive ? 'text-muted disabled-icon' : 'text-primary cursor-pointer'}"
			                   title="${isActive ? 'Disable page to edit' : 'Edit'}"
			                   ${isActive ? '' : `onclick="editpage(${item[0]})"`}
			                   style="${isActive ? 'pointer-events: none; opacity: 0.5;' : ''}"></i>
			            </td>
			        </tr>
			    `);

			});

            // Destroy existing DataTable
            if ($.fn.DataTable.isDataTable('#pageSelectionOuterTable')) {
                $('#pageSelectionOuterTable').DataTable().destroy();
            }

            $('#pageSelectionOuterTable').DataTable({

                dom: '<"d-flex justify-content-between mb-2"Bf>rtip',

                buttons: [
                    {
                        extend: 'excelHtml5',
                        text: 'Export to Excel',
                        className: 'btn btn-primary btn-sm',
                        filename: 'Pages_Report',
                        title: 'Pages Report'
                    }
                ],

                paging: true,
                pageLength: 10,
                info: true,
                searching: true,
                ordering: true
            });

        },

        error: function(xhr, status, error) {

            console.error("Fetch Pages Error:", error);
            alert("Failed to load Pages");

        }
    });
}


function loadModules() {

    $.ajax({

        url: new URL("/api/modules/getAllModules", baseUrl).toString(),

        type: "GET",

        xhrFields: { withCredentials: true },

        success: function(response) {

            // Clear both dropdowns
            $("#pagemodule").empty();
            $("#pagemoduleUp").empty();

            // Default option
            $("#pagemodule").append(
                `<option value="">Select Module</option>`
            );

            $("#pagemoduleUp").append(
                `<option value="">Select Module</option>`
            );

            // Append modules
            $.each(response, function(index, item) {

                let option = `
                    <option value="${item.moduleID}">
                        ${item.moduleName}
                    </option>
                `;

                $("#pagemodule").append(option);

                $("#pagemoduleUp").append(option);

            });

        },

        error: function(xhr, status, error) {

            console.log("Error :", error);

        }

    });

}










$("#modalpage").click(function () {
	
	const allowed = allowedActions || [];

	if (!allowed.includes("Insert")) {
	  alert(" You do not have permission to Insert");
	  return;
	}
	

/*	$("#pagemodule").val("");	*/
	$("#moduleErrorpage").hide();
	
/*	$("#pageUrl").val("");*/
	$("#pageUrlError").hide();
	
/*	$("#pagediplay").val("");*/
	$("#pageDisplayError").hide();
	

	$("#exampleModalScrollablePages").modal("show");
});



$("#createPage").click(function () {

    let Module = $("#pagemodule").val();

    let pageUrl = $("#pageUrl").val().trim();

    let pageDisplayName = $("#pagediplay").val().trim();

    $(".error-message").hide();

    if (Module === '') {
        $("#moduleErrorpage").show();
        return;
    }

    if (!pageUrl) {
        $("#pageUrlError").show();
        return;
    }

    if (!pageDisplayName) {
        $("#pageDisplayError").show();
        return;
    }

    // Open confirmation modal
    $("#confimationpage").modal("show");

});






$("#createdept").click(function () {

    let deptval = $("#deptval").val().trim();

  

    $(".error-message").hide();

    if (deptval === '') {
        $("#deptvalError").show();
        return;
    }

  

    // Open confirmation modal
    $("#confimationDeptmodal").modal("show");

});


// ================= CREATE DEPARTMENT =================

$("#confirmdept").click(function () {

	$("#confimationDeptmodal").modal("hide");

	let deptName = $("#deptval").val().trim();

	checkDuplicateDepartment(deptName);
});

function checkDuplicateDepartment(deptName) {

	$.ajax({
		url: new URL(
			`/api/modules/check/department?deptName=${encodeURIComponent(deptName)}`,
			baseUrl
		).toString(),

		type: "GET",
		xhrFields: { withCredentials: true },

		success: function(response) {

			if (response.exists === true) {

				$("#duplicateTypeMessage").text("Department Name is Already Exists");
				$("#duplicateDeptModal").modal("show");

			} else {

				insertDepartment(deptName);
			}
		},

		error: function(xhr, status, error) {
			console.error("Department check API Error:", error);
			alert("An error occurred while checking Department");
		}
	});
}

function insertDepartment(deptName) {

	let payload = {
		deptName: deptName,
		createdBy: sessionStorage.getItem("id")
	};

	$.ajax({
		url: new URL("/api/modules/insertDept", baseUrl).toString(),
		type: "POST",
		contentType: "application/json",
		data: JSON.stringify(payload),
		xhrFields: { withCredentials: true },

		success: function(response) {

			if (response.status === "duplicate") {

				$("#duplicateTypeMessage").text(response.message);
				$("#duplicateDeptModal").modal("show");
				return;
			}

			$("#Departmenttype").modal("hide");
			showPopup("Department created successfully", "GlobalMasterRegisters.jsp");
		},

		error: function(xhr, status, error) {
			console.error("Insert Department Error:", error);
			alert("Failed to insert Department");
		}
	});
}


// ================= EDIT DEPARTMENT =================

let originalDeptName = "";
let selectedDeptId = null;

function editDept(deptId) {
	
	
	  const allowed = allowedActions || [];

	if (!allowed.includes("Edit")) {
	  alert(" You do not have permission to edit.");
	  return;
	}

	selectedDeptId = deptId;

	$.ajax({
		url: new URL("/api/modules/getDeptById/" + deptId, baseUrl).toString(),
		type: "GET",
		xhrFields: { withCredentials: true },

		success: function(response) {

			$("#deptvalUp").val(response.deptName);
			originalDeptName = response.deptName;

			$("#DepartmenttypeUp").modal("show");
		},

		error: function(xhr, status, error) {
			console.error("Fetch Department Error:", error);
			alert("Failed to load Department data");
		}
	});
}


// ================= UPDATE VALIDATION =================

$("#createdeptUp").click(function() {

	let deptName = $("#deptvalUp").val().trim();

	if (deptName === "") {

		$("#deptvalErrorUp").show();
		return;

	} else {

		$("#deptvalErrorUp").hide();
	}

	$("#confimationupdatedeptmodal").modal("show");
});


// ================= UPDATE CONFIRM =================

$("#confirmdeptUp").click(function() {

	let newDeptName = $("#deptvalUp").val().trim();

	$("#confimationupdatedeptmodal").modal("hide");

	if (newDeptName === originalDeptName) {

		showPopup("No Fields Changed", "GlobalMasterRegisters.jsp");
		return;
	}

	checkDuplicateDeptForUpdate(newDeptName);
});

function checkDuplicateDeptForUpdate(deptName) {

	$.ajax({
		url: new URL(
			`/api/modules/check/department?deptName=${encodeURIComponent(deptName)}`,
			baseUrl
		).toString(),

		type: "GET",
		xhrFields: { withCredentials: true },

		success: function(response) {

			if (response.exists) {

				$("#duplicateTypeMessage").text("Department Name is Already Exists");
				$("#duplicateDeptModal").modal("show");

			} else {

				updateDepartment(deptName);
			}
		},

		error: function() {
			alert("Error while checking duplicate Department");
		}
	});
}

function updateDepartment(deptName) {

	let payload = {
		deptName: deptName,
		modifiedBy: sessionStorage.getItem("id")
	};

	$.ajax({
		url: new URL(`/api/modules/updateDept/${selectedDeptId}`, baseUrl).toString(),
		type: "PUT",
		contentType: "application/json",
		xhrFields: { withCredentials: true },
		data: JSON.stringify(payload),

		success: function() {
			$("#DepartmenttypeUp").modal("hide");
			showPopup("Department updated successfully", "GlobalMasterRegisters.jsp");
		},

		error: function(xhr) {

			if (xhr.status === 409) {

				$("#duplicateTypeMessage").text(xhr.responseText || "Department already exists");
				$("#duplicateDeptModal").modal("show");

			} else {

				alert("Failed to update Department");
			}
		}
	});
}


$("#confirmpage").click(function () {

	let payload = {

	    moduleID: $("#pagemodule").val(),

	    pageName: $("#pageUrl").val().trim(),

	    displayName: $("#pagediplay").val().trim(),

	  created_by: sessionStorage.getItem("id")

	};

    $.ajax({

        
		url: new URL("/api/modules/insertPage", baseUrl).toString(),

        type: "POST",

        contentType: "application/json",
		xhrFields: { withCredentials: true },
        data: JSON.stringify(payload),

        success: function (response) {

            $("#confimationpage").modal("hide");

            if (response.status === "duplicate") {

                $("#duplicateTypeMessage")
                    .text(response.message);

                $("#duplicateTypeModal").modal("show");

                return;
            }

            if (response.status === "success") {

                $("#exampleModalScrollablePages").modal("hide");

              showPopup("Page is Successfully Created", "GlobalMasterRegisters.jsp");

                $("#pageUrl").val('');
                $("#pagediplay").val('');
                $("#pagemodule").val('');

            }

        },

        error: function () {

            alert("Error while saving page");

        }

    });

});



let originalPageData = {};

function editpage(id){
	
	
	  const allowed = allowedActions || [];

	if (!allowed.includes("Edit")) {
	  alert(" You do not have permission to edit.");
	  return;
	}

    $.ajax({

        url: new URL(`/api/modules/getPageById/${id}`, baseUrl).toString(),

        type: "GET",

        xhrFields: { withCredentials: true },

        success: function(response){

            originalPageData = response;

            originalPageData.pageID = id;

            $("#pagemoduleUp").val(response.moduleID);

            $("#pageUrlUp").val(response.pageName);

            $("#pagediplayUp").val(response.displayName);

            $("#exampleModalScrollablePagesUp").modal("show");
        },

        error: function(){

            alert("Error fetching page details");
        }
    });
}

$("#createPageUp").click(function () {

    let moduleID = $("#pagemoduleUp").val();

    let pageName = $("#pageUrlUp").val().trim();

    let displayName = $("#pagediplayUp").val().trim();

    if (moduleID === "") {

        $("#moduleErrorpageUp").show();

        return;
    }

    if (pageName === "") {

        $("#pageUrlErrorUp").show();

        return;
    }

    if (displayName === "") {

        $("#pageDisplayErrorUp").show();

        return;
    }

    // No changes check
    if (
        moduleID == originalPageData.moduleID &&
        pageName == originalPageData.pageName &&
        displayName == originalPageData.displayName
    ) {

        showPopup("No Fields Changed", "GlobalMasterRegisters.jsp");

        return;
    }

    $("#confimationupdatepage").modal("show");
});

$("#confirmpageUp").click(function () {

    let payload = {

        moduleID: $("#pagemoduleUp").val(),

        pageName: $("#pageUrlUp").val().trim(),

        displayName: $("#pagediplayUp").val().trim(),

       modified_by: sessionStorage.getItem("id")
    };

    $.ajax({

        url: new URL(
            `/api/modules/updatePage/${originalPageData.pageID}`,
            baseUrl
        ).toString(),

        type: "PUT",

        contentType: "application/json",

        xhrFields: { withCredentials: true },

        data: JSON.stringify(payload),

        success: function(response){

            $("#confimationupdatepage").modal("hide");

            if(response.status === "duplicate"){

                $("#duplicateTypeMessage")
                    .text(response.message);

                $("#duplicateTypeModal").modal("show");

                return;
            }

            if(response.status === "success"){

                $("#exampleModalScrollablePagesUp").modal("hide");

               showPopup(
                    "Page updated successfully",
                    "GlobalMasterRegisters.jsp"
                );
            }
        },

        error: function(){

            alert("Error while updating page");
        }
    });
});








function fetchPageActions() {

    $.ajax({

        url: new URL(
            "/api/modules/getAllPageActionsTable",
            baseUrl
        ).toString(),

        type: "GET",

        xhrFields: { withCredentials: true },

        success: function(data) {

            let tbody = $("#pageActionOuterbody");

            tbody.empty();

            if (!data || data.length === 0) {

                tbody.append(`
                    <tr>
                        <td colspan="4" class="text-center text-muted">
                            No records found
                        </td>
                    </tr>
                `);

                return;
            }

            $.each(data, function(index, item) {

        
				
		/*		tbody.append(`
				    <tr>
				        <td>${index + 1}</td>
				        <td>${item[1]}</td>
				        <td>${item[2]}</td>
				        <td class="text-center">
				            <input type="checkbox" class="status-checkbox"
				                ${item[3] == 1 ? 'checked' : ''}
				                onchange="confirmStatusChange('pageAction', ${item[0]}, this)">
				        </td>
				        <td>
				            <i class="fa fa-pen text-muted cursor-pointer"
				               title="Edit" onclick="editPageAction(${item[0]})"></i>
				        </td>
				    </tr>
				`);*/
				
				let isActive = item[3] == 1;

				tbody.append(`
				    <tr>
				        <td>${index + 1}</td>
				        <td>${item[1]}</td>
				        <td>${item[2]}</td>
				        <td class="text-center">
				            <input type="checkbox" class="status-checkbox"
				                ${isActive ? 'checked' : ''}
				                onchange="confirmStatusChange('pageAction', ${item[0]}, this)">
				        </td>
				        <td>
				            <i class="fa fa-pen ${isActive ? 'text-muted disabled-icon' : 'text-primary cursor-pointer'}"
				               title="${isActive ? 'Disable to edit' : 'Edit'}"
				               ${isActive ? '' : `onclick="editPageAction(${item[0]})"`}
				               style="${isActive ? 'pointer-events: none; opacity: 0.5;' : ''}"></i>
				        </td>
				    </tr>
				`);

            });

            // Destroy existing DataTable
            if ($.fn.DataTable.isDataTable('#pageActionOuterTable')) {

                $('#pageActionOuterTable')
                    .DataTable()
                    .destroy();
            }

            $('#pageActionOuterTable').DataTable({

                dom: '<"d-flex justify-content-between mb-2"Bf>rtip',

                buttons: [
                    {
                        extend: 'excelHtml5',

                        text: 'Export to Excel',

                        className: 'btn btn-primary btn-sm',

                        filename: 'PageActions_Report',

                        title: 'Page Actions Report'
                    }
                ],

                paging: true,

                pageLength: 10,

                info: true,

                searching: true,

                ordering: true
            });

        },

        error: function(xhr, status, error) {

            console.error(
                "Fetch Page Actions Error:",
                error
            );

            alert("Failed to load Page Actions");
        }

    });
}



$("#modalpageAction").click(function () {
	const allowed = allowedActions || [];

	if (!allowed.includes("Insert")) {
	  alert(" You do not have permission to Insert");
	  return;
	}

	$("#moduleErrorpageac").hide();
	

	$("#moduleErrorpageacname").hide();
	

	

	$("#exampleModalScrollablePagesAction").modal("show");
});



$("#createPageAction").click(function () {

    let pageName = $("#pageNameac").val();

    let pageAction = $("#pageActionname").val();

  
    $(".error-message").hide();

    if (pageName === '') {
        $("#moduleErrorpageac").show();
        return;
    }

	if (pageAction === '') {
	       $("#moduleErrorpageacname").show();
	       return;
	   }

   

    // Open confirmation modal
    $("#confimationpageAction").modal("show");

});

$("#confirmpageAction").click(function () {
	$("#confimationpageAction").modal("hide");

    let pageID = $("#pageNameac").val();

    let actionID = $("#pageActionname").val();

    if (pageID === "") {

        $("#moduleErrorpageac").show();

        return;
    }

    if (actionID === "") {

        $("#moduleErrorpageacname").show();

        return;
    }

    let payload = {

        pageID: pageID,

        actionID: actionID,

        created_by: sessionStorage.getItem("id")
    };

    $.ajax({

        url: new URL(
            "/api/modules/insertPageAction",
            baseUrl
        ).toString(),

        type: "POST",

        contentType: "application/json",

        xhrFields: {
            withCredentials: true
        },

        data: JSON.stringify(payload),

        success: function(response){

            if(response.status === "duplicate"){

                $("#duplicateTypeMessage")
                    .text(response.message);

                $("#duplicateTypeModal")
                    .modal("show");

                return;
            }

            if(response.status === "success"){

                showPopup(
                    "Page Action Created Successfully",
                    "GlobalMasterRegisters.jsp"
                );
            }

        },

        error: function(){

            alert("Error while saving Page Action");
        }

    });

});


function loadPageAndActions() {

    // ================= LOAD PAGES =================

    $.ajax({

        url: new URL("/api/modules/getAllpageAction", baseUrl).toString(),

        type: "GET",

        xhrFields: { withCredentials: true },

        success: function(response) {

            // Clear both dropdowns
            $("#pageNameac").empty();
            $("#pageNameacUp").empty();

            // Default option
            $("#pageNameac").append(`
                <option value="">Select pageName</option>
            `);

            $("#pageNameacUp").append(`
                <option value="">Select pageName</option>
            `);

            $.each(response, function(index, item) {

                let option = `
                    <option value="${item.pageID}">
                        ${item.pagNameName}
                    </option>
                `;

                $("#pageNameac").append(option);

                $("#pageNameacUp").append(option);

            });

        },

        error: function(xhr, status, error) {

            console.log("Page Load Error :", error);

        }

    });


    // ================= LOAD ACTIONS =================

    $.ajax({

        url: new URL("/api/modules/getAllAction", baseUrl).toString(),

        type: "GET",

        xhrFields: { withCredentials: true },

        success: function(response) {

            // Clear both dropdowns
            $("#pageActionname").empty();
            $("#pageActionnameUp").empty();

            // Default option
            $("#pageActionname").append(`
                <option value="">Select pageAction</option>
            `);

            $("#pageActionnameUp").append(`
                <option value="">Select pageAction</option>
            `);

            $.each(response, function(index, item) {

                let option = `
                    <option value="${item.actionId}">
                        ${item.actionName}
                    </option>
                `;

                $("#pageActionname").append(option);

                $("#pageActionnameUp").append(option);

            });

        },

        error: function(xhr, status, error) {

            console.log("Action Load Error :", error);

        }

    });

}

let originalPageActionData = {};
function editPageAction(id){

	
	  const allowed = allowedActions || [];

	if (!allowed.includes("Edit")) {
	  alert(" You do not have permission to edit.");
	  return;
	}
	
    $.ajax({

        url: new URL(
            `/api/modules/getPageActionById/${id}`,
            baseUrl
        ).toString(),

        type: "GET",

        xhrFields: {
            withCredentials: true
        },

        success: function(response){

            originalPageActionData = response;

            originalPageActionData.id = id;

            $("#pageNameacUp")
                .val(response.pageID);

            $("#pageActionnameUp")
                .val(response.actionID);

            $("#exampleModalScrollablePagesActionUp")
                .modal("show");
        },

        error: function(){

            alert("Error fetching details");
        }

    });
}


$("#createPageActionUp").click(function () {

    let pageID =
        $("#pageNameacUp").val();

    let actionID =
        $("#pageActionnameUp").val();

    if(pageID === ""){

        $("#moduleErrorpageacUp").show();

        return;
    }

    if(actionID === ""){

        $("#moduleErrorpageacnameUp").show();

        return;
    }

    // ================= NO CHANGES =================

    if(
        pageID == originalPageActionData.pageID &&
        actionID == originalPageActionData.actionID
    ){

        showPopup(
            "No Fields Changed",
            "GlobalMasterRegisters.jsp"
        );

        return;
    }

    $("#confimationupdatepageAction")
        .modal("show");

});



$("#confirmpageactionUp").click(function () {

    let payload = {

        pageID:
            $("#pageNameacUp").val(),

        actionID:
            $("#pageActionnameUp").val(),

        modifiedBy:
            sessionStorage.getItem("id")
    };

    $.ajax({

        url: new URL(
            `/api/modules/updatePageAction/${originalPageActionData.id}`,
            baseUrl
        ).toString(),

        type: "PUT",

        contentType: "application/json",

        xhrFields: {
            withCredentials: true
        },

        data: JSON.stringify(payload),

        success: function(response){

            $("#confimationupdatepageAction")
                .modal("hide");

            if(response.status === "duplicate"){

                $("#duplicateTypeMessage")
                    .text(response.message);

                $("#duplicateTypeModal")
                    .modal("show");

                return;
            }

            if(response.status === "success"){

                $("#exampleModalScrollablePagesActionUp")
                    .modal("hide");

                showPopup(
                    "Updated Successfully",
                    "GlobalMasterRegisters.jsp"
                );
            }
        },

        error: function(){

            alert("Error while updating");
        }

    });

});




// ================= FETCH INVOICE TABS =================

function fetchAllInvoiceTabs() {

	$.ajax({
		url: new URL("/api/modules/getAllTabstable", baseUrl).toString(),
		type: "GET",
		xhrFields: { withCredentials: true },

		success: function(data) {

			let tbody = $("#InvoiceTabTableBody");
			tbody.empty();

			if (!data || data.length === 0) {
				tbody.append(`
                    <tr>
                        <td colspan="3" class="text-center text-muted">
                            No records found
                        </td>
                    </tr>
                `);
				return;
			}

	/*		$.each(data, function(index, item) {

				tbody.append(`
				    <tr>
				        <td>${index + 1}</td>
				        <td>${item.tabName}</td>
				        <td class="text-center">
				            <input type="checkbox" class="status-checkbox"
				                ${item.status == 1 ? 'checked' : ''}
				                onchange="confirmStatusChange('invoiceTab', ${item.tabId}, this)">
				        </td>
				        <td>
				            <i class="fa fa-pen text-muted cursor-pointer"
				               title="Edit" onclick="editInvoiceTab(${item.tabId})"></i>
				        </td>
				    </tr>
				`);
			});*/
			
			
			$.each(data, function(index, item) {

							let isActive = item.status == 1;

							tbody.append(`
							    <tr>
							        <td>${index + 1}</td>
							        <td>${item.tabName}</td>
							        <td class="text-center">
							            <input type="checkbox" class="status-checkbox"
							                ${isActive ? 'checked' : ''}
							                onchange="confirmStatusChange('invoiceTab', ${item.tabId}, this)">
							        </td>
							        <td>
							            <i class="fa fa-pen ${isActive ? 'text-muted disabled-icon' : 'text-primary cursor-pointer'}"
							               title="${isActive ? 'Disable to edit' : 'Edit'}"
							               ${isActive ? '' : `onclick="editInvoiceTab(${item.tabId})"`}
							               style="${isActive ? 'pointer-events: none; opacity: 0.5;' : ''}"></i>
							        </td>
							    </tr>
							`);
						});

			if ($.fn.DataTable.isDataTable('#InvoiceTabSelectionID')) {
				$('#InvoiceTabSelectionID').DataTable().destroy();
			}

			$('#InvoiceTabSelectionID').DataTable({
				dom: '<"d-flex justify-content-between mb-2"Bf>rtip',

				buttons: [
					{
						extend: 'excelHtml5',
						text: 'Export to Excel',
						className: 'btn btn-primary btn-sm',
						filename: 'InvoiceTabs_Report',
						title: 'Invoice Tabs Report'
					}
				],

				paging: true,
				pageLength: 10,
				info: true,
				searching: true,
				ordering: true
			});
		},

		error: function(xhr, status, error) {
			console.error("Fetch Invoice Tab Error:", error);
			alert("Failed to load Invoice Tabs");
		}
	});
}


// ================= OPEN CREATE MODAL =================

$("#modalinvoicetab").click(function () {
	
	
	const allowed = allowedActions || [];

	if (!allowed.includes("Insert")) {
	  alert(" You do not have permission to Insert");
	  return;
	}

	$("#invoicetabval").val("");
	$("#invoicetabvalError").hide();

	$("#Invoicetabtype").modal("show");
});


// ================= CREATE VALIDATION =================

$("#createinvoicetab").click(function() {

	let tabName = $("#invoicetabval").val().trim();

	if (!tabName) {
		$("#invoicetabvalError").show();
		return;
	} else {
		$("#invoicetabvalError").hide();
	}

	$("#confimationInvoiceTabmodal").modal("show");
});


// ================= CREATE CONFIRM =================

$("#confirminvoicetab").click(function() {

	$("#confimationInvoiceTabmodal").modal("hide");

	let tabName = $("#invoicetabval").val().trim();

	checkDuplicateInvoiceTab(tabName);
});

function checkDuplicateInvoiceTab(tabName) {

	$.ajax({
		url: new URL(
			`/api/modules/check/tab?tabName=${encodeURIComponent(tabName)}`,
			baseUrl
		).toString(),

		type: "GET",
		xhrFields: { withCredentials: true },

		success: function(response) {

			if (response.exists === true) {

				$("#duplicateInvoiceTabMessage").text("Tab Name is Already Exists");
				$("#duplicateInvoiceTabModal").modal("show");

			} else {

				insertInvoiceTab(tabName);
			}
		},

		error: function(xhr, status, error) {
			console.error("Invoice Tab check API Error:", error);
			alert("An error occurred while checking Invoice Tab");
		}
	});
}

function insertInvoiceTab(tabName) {

	let payload = {
		tabName: tabName,
		createdBy: sessionStorage.getItem("id")
	};

	$.ajax({
		url: new URL("/api/modules/insertTab", baseUrl).toString(),
		type: "POST",
		contentType: "application/json",
		data: JSON.stringify(payload),
		xhrFields: { withCredentials: true },

		success: function(response) {

			if (response.status === "duplicate") {

				$("#duplicateInvoiceTabMessage").text(response.message);
				$("#duplicateInvoiceTabModal").modal("show");
				return;
			}

			$("#Invoicetabtype").modal("hide");
			showPopup("Invoice Tab created successfully", "GlobalMasterRegisters.jsp");
		},

		error: function(xhr, status, error) {
			console.error("Insert Invoice Tab Error:", error);
			alert("Failed to insert Invoice Tab");
		}
	});
}


// ================= EDIT INVOICE TAB =================

let originalInvoiceTabName = "";
let selectedInvoiceTabId = null;

function editInvoiceTab(tabId) {
	
	  const allowed = allowedActions || [];

	if (!allowed.includes("Edit")) {
	  alert(" You do not have permission to edit.");
	  return;
	}

	selectedInvoiceTabId = tabId;

	$.ajax({
		url: new URL("/api/modules/getTabById/" + tabId, baseUrl).toString(),
		type: "GET",
		xhrFields: { withCredentials: true },

		success: function(response) {

			$("#invoicetabvalUp").val(response.tabName);
			originalInvoiceTabName = response.tabName;

			$("#InvoicetabtypeUp").modal("show");
		},

		error: function(xhr, status, error) {
			console.error("Fetch Invoice Tab Error:", error);
			alert("Failed to load Invoice Tab data");
		}
	});
}


// ================= UPDATE VALIDATION =================

$("#createinvoicetabUp").click(function() {

	let tabName = $("#invoicetabvalUp").val().trim();

	if (tabName === "") {

		$("#invoicetabvalErrorUp").show();
		return;

	} else {

		$("#invoicetabvalErrorUp").hide();
	}

	$("#confimationupdateinvoicetabmodal").modal("show");
});


// ================= UPDATE CONFIRM =================

$("#confirminvoicetabUp").click(function() {

	let newTabName = $("#invoicetabvalUp").val().trim();

	$("#confimationupdateinvoicetabmodal").modal("hide");

	if (newTabName === originalInvoiceTabName) {

		showPopup("No Fields Changed", "GlobalMasterRegisters.jsp");
		return;
	}

	checkDuplicateInvoiceTabForUpdate(newTabName);
});

function checkDuplicateInvoiceTabForUpdate(tabName) {

	$.ajax({
		url: new URL(
			`/api/modules/check/tab?tabName=${encodeURIComponent(tabName)}`,
			baseUrl
		).toString(),

		type: "GET",
		xhrFields: { withCredentials: true },

		success: function(response) {

			if (response.exists) {

				$("#duplicateInvoiceTabMessage").text("Tab Name is Already Exists");
				$("#duplicateInvoiceTabModal").modal("show");

			} else {

				updateInvoiceTab(tabName);
			}
		},

		error: function() {
			alert("Error while checking duplicate Invoice Tab");
		}
	});
}

function updateInvoiceTab(tabName) {

	let payload = {
		tabName: tabName,
		modifiedBy: sessionStorage.getItem("id")
	};

	$.ajax({
		url: new URL(`/api/modules/updateTab/${selectedInvoiceTabId}`, baseUrl).toString(),
		type: "PUT",
		contentType: "application/json",
		xhrFields: { withCredentials: true },
		data: JSON.stringify(payload),

		success: function() {
			$("#InvoicetabtypeUp").modal("hide");
			showPopup("Invoice Tab updated successfully", "GlobalMasterRegisters.jsp");
		},

		error: function(xhr) {

			if (xhr.status === 409) {

				$("#duplicateInvoiceTabMessage").text(xhr.responseText || "Invoice Tab already exists");
				$("#duplicateInvoiceTabModal").modal("show");

			} else {

				alert("Failed to update Invoice Tab");
			}
		}
	});
}


// ================= FETCH TAB PAGES =================

function fetchAllTabPages() {

	$.ajax({
		url: new URL("/api/modules/getAllTabPagestable", baseUrl).toString(),
		type: "GET",
		xhrFields: { withCredentials: true },

		success: function(data) {

			let tbody = $("#TabPageTableBody");
			tbody.empty();

			if (!data || data.length === 0) {
				tbody.append(`
                    <tr>
                        <td colspan="4" class="text-center text-muted">
                            No records found
                        </td>
                    </tr>
                `);
				return;
			}

	/*		$.each(data, function(index, item) {

		
				
				tbody.append(`
				    <tr>
				        <td>${index + 1}</td>
				        <td>${item.tabName}</td>
				        <td>${item.pageName}</td>
				        <td class="text-center">
				            <input type="checkbox" class="status-checkbox"
				                ${item.status == 1 ? 'checked' : ''}
				                onchange="confirmStatusChange('tabPage', ${item.pageId}, this)">
				        </td>
				        <td>
				            <i class="fa fa-pen text-muted cursor-pointer"
				               title="Edit" onclick="editTabPage(${item.pageId})"></i>
				        </td>
				    </tr>
				`);
			});*/
			
			$.each(data, function(index, item) {

			    let isActive = item.status == 1;

			    tbody.append(`
			        <tr>
			            <td>${index + 1}</td>
			            <td>${item.tabName}</td>
			            <td>${item.pageName}</td>
			            <td class="text-center">
			                <input type="checkbox" class="status-checkbox"
			                    ${isActive ? 'checked' : ''}
			                    onchange="confirmStatusChange('tabPage', ${item.pageId}, this)">
			            </td>
			            <td>
			                <i class="fa fa-pen ${isActive ? 'text-muted disabled-icon' : 'text-primary cursor-pointer'}"
			                   title="${isActive ? 'Disable to edit' : 'Edit'}"
			                   ${isActive ? '' : `onclick="editTabPage(${item.pageId})"`}
			                   style="${isActive ? 'pointer-events: none; opacity: 0.5;' : ''}"></i>
			            </td>
			        </tr>
			    `);
			});

			if ($.fn.DataTable.isDataTable('#TabPageSelectionID')) {
				$('#TabPageSelectionID').DataTable().destroy();
			}

			$('#TabPageSelectionID').DataTable({
				dom: '<"d-flex justify-content-between mb-2"Bf>rtip',
				buttons: [
					{
						extend: 'excelHtml5',
						text: 'Export to Excel',
						className: 'btn btn-primary btn-sm',
						filename: 'TabPages_Report',
						title: 'Tab Pages Report'
					}
				],
				paging: true,
				pageLength: 10,
				info: true,
				searching: true,
				ordering: true
			});
		},

		error: function(xhr, status, error) {
			console.error("Fetch Tab Page Error:", error);
			alert("Failed to load Tab Pages");
		}
	});
}


// ================= LOAD TAB DROPDOWN =================

function loadTabsForDropdown() {

	$.ajax({
		url: new URL("/api/modules/getAllTabs", baseUrl).toString(),
		type: "GET",
		xhrFields: { withCredentials: true },

		success: function(response) {

			$("#tabpageTabSelect").empty();
			$("#tabpageTabSelectUp").empty();

			$("#tabpageTabSelect").append(`<option value="">Select Tab</option>`);
			$("#tabpageTabSelectUp").append(`<option value="">Select Tab</option>`);

			$.each(response, function(index, item) {

				let option = `<option value="${item.tabId}">${item.tabName}</option>`;

				$("#tabpageTabSelect").append(option);
				$("#tabpageTabSelectUp").append(option);
			});
		},

		error: function(xhr, status, error) {
			console.log("Tab dropdown load error:", error);
		}
	});
}


// ================= OPEN CREATE MODAL =================

$("#modaltabpage").click(function () {
	
	
	const allowed = allowedActions || [];

	if (!allowed.includes("Insert")) {
	  alert(" You do not have permission to Insert");
	  return;
	}

	$("#tabpageTabSelect").val("");
	$("#tabpagePageName").val("");
	$("#tabpageTabError").hide();
	$("#tabpagePageNameError").hide();

	$("#TabPageCreateModal").modal("show");
});


// ================= CREATE VALIDATION =================

$("#createtabpage").click(function() {

	let tabId = $("#tabpageTabSelect").val();
	let pageName = $("#tabpagePageName").val().trim();

	$(".error-message").hide();

	if (!tabId) {
		$("#tabpageTabError").show();
		return;
	}

	if (!pageName) {
		$("#tabpagePageNameError").show();
		return;
	}

	$("#confimationtabpagemodal").modal("show");
});


// ================= CREATE CONFIRM =================

$("#confirmtabpage").click(function() {

	$("#confimationtabpagemodal").modal("hide");

	let tabId = $("#tabpageTabSelect").val();
	let pageName = $("#tabpagePageName").val().trim();

	checkDuplicateTabPage(tabId, pageName);
});

/*function checkDuplicateTabPage(tabId, pageName) {

	$.ajax({
		url: new URL(
			`/api/modules/check/tabpage?tabId=${tabId}`,
			baseUrl
		).toString(),

		type: "GET",
		xhrFields: { withCredentials: true },

		success: function(response) {

			if (response.exists === true) {

				$("#duplicateTabPageMessage").text("A page already exists for this Tab");
				$("#duplicateTabPageModal").modal("show");

			} else {

				insertTabPage(tabId, pageName);
			}
		},

		error: function(xhr, status, error) {
			console.error("Tab Page check API Error:", error);
			alert("An error occurred while checking Tab Page");
		}
	});
}*/



function checkDuplicateTabPage(tabId, pageName) {

	$.ajax({
		url: new URL(
			`/api/modules/check/tabpage?tabId=${tabId}&pageName=${encodeURIComponent(pageName)}`,
			baseUrl
		).toString(),

		type: "GET",
		xhrFields: { withCredentials: true },

		success: function(response) {

			if (response.exists === true) {

				$("#duplicateTabPageMessage").text("This Page already exists for the selected Tab");
				$("#duplicateTabPageModal").modal("show");

			} else {

				insertTabPage(tabId, pageName);
			}
		},

		error: function(xhr, status, error) {
			console.error("Tab Page check API Error:", error);
			alert("An error occurred while checking Tab Page");
		}
	});
}

function insertTabPage(tabId, pageName) {

	let payload = {
		tabId: tabId,
		pageName: pageName,
		createdBy: sessionStorage.getItem("id")
	};

	$.ajax({
		url: new URL("/api/modules/insertTabPage", baseUrl).toString(),
		type: "POST",
		contentType: "application/json",
		data: JSON.stringify(payload),
		xhrFields: { withCredentials: true },

		success: function(response) {

			if (response.status === "duplicate") {

				$("#duplicateTabPageMessage").text(response.message);
				$("#duplicateTabPageModal").modal("show");
				return;
			}

			$("#TabPageCreateModal").modal("hide");
			showPopup("Tab Page created successfully", "GlobalMasterRegisters.jsp");
		},

		error: function(xhr, status, error) {
			console.error("Insert Tab Page Error:", error);
			alert("Failed to insert Tab Page");
		}
	});
}


// ================= EDIT TAB PAGE =================

let originalTabPageData = {};
let selectedTabPageId = null;

function editTabPage(pageId) {
	
	  const allowed = allowedActions || [];

	if (!allowed.includes("Edit")) {
	  alert(" You do not have permission to edit.");
	  return;
	}

	selectedTabPageId = pageId;

	$.ajax({
		url: new URL("/api/modules/getTabPageById/" + pageId, baseUrl).toString(),
		type: "GET",
		xhrFields: { withCredentials: true },

		success: function(response) {

			originalTabPageData = response;

			$("#tabpageTabSelectUp").val(response.tabId);
			$("#tabpagePageNameUp").val(response.pageName);

			$("#TabPageUpdateModal").modal("show");
		},

		error: function(xhr, status, error) {
			console.error("Fetch Tab Page Error:", error);
			alert("Failed to load Tab Page data");
		}
	});
}


// ================= UPDATE VALIDATION =================

$("#createtabpageUp").click(function() {

	let tabId = $("#tabpageTabSelectUp").val();
	let pageName = $("#tabpagePageNameUp").val().trim();

	$(".error-message").hide();

	if (!tabId) {
		$("#tabpageTabErrorUp").show();
		return;
	}

	if (!pageName) {
		$("#tabpagePageNameErrorUp").show();
		return;
	}

	if (tabId == originalTabPageData.tabId && pageName === originalTabPageData.pageName) {
		showPopup("No Fields Changed", "GlobalMasterRegisters.jsp");
		return;
	}

	$("#confimationupdatetabpagemodal").modal("show");
});


// ================= UPDATE CONFIRM =================

$("#confirmtabpageUp").click(function() {

	$("#confimationupdatetabpagemodal").modal("hide");

	let tabId = $("#tabpageTabSelectUp").val();
	let pageName = $("#tabpagePageNameUp").val().trim();

	checkDuplicateTabPageForUpdate(tabId, pageName);
});

/*function checkDuplicateTabPageForUpdate(tabId, pageName) {

	$.ajax({
		url: new URL(
			`/api/modules/check/tabpage?tabId=${tabId}`,
			baseUrl
		).toString(),

		type: "GET",
		xhrFields: { withCredentials: true },

		success: function(response) {

			// only flag duplicate if switching to a DIFFERENT tab that's already used
			if (response.exists === true && tabId != originalTabPageData.tabId) {

				$("#duplicateTabPageMessage").text("A page already exists for this Tab");
				$("#duplicateTabPageModal").modal("show");

			} else {

				updateTabPage(tabId, pageName);
			}
		},

		error: function() {
			alert("Error while checking duplicate Tab Page");
		}
	});
}*/



function checkDuplicateTabPageForUpdate(tabId, pageName) {

	$.ajax({
		url: new URL(
			`/api/modules/check/tabpage?tabId=${tabId}&pageName=${encodeURIComponent(pageName)}`,
			baseUrl
		).toString(),

		type: "GET",
		xhrFields: { withCredentials: true },

		success: function(response) {

			// only flag duplicate if it's not the same record we're editing
			if (response.exists === true &&
				!(tabId == originalTabPageData.tabId && pageName === originalTabPageData.pageName)) {

				$("#duplicateTabPageMessage").text("This Page already exists for the selected Tab");
				$("#duplicateTabPageModal").modal("show");

			} else {

				updateTabPage(tabId, pageName);
			}
		},

		error: function() {
			alert("Error while checking duplicate Tab Page");
		}
	});
}

function updateTabPage(tabId, pageName) {

	let payload = {
		tabId: tabId,
		pageName: pageName,
		modifiedBy: sessionStorage.getItem("id")
	};

	$.ajax({
		url: new URL(`/api/modules/updateTabPage/${selectedTabPageId}`, baseUrl).toString(),
		type: "PUT",
		contentType: "application/json",
		xhrFields: { withCredentials: true },
		data: JSON.stringify(payload),

		success: function() {
			$("#TabPageUpdateModal").modal("hide");
			showPopup("Tab Page updated successfully", "GlobalMasterRegisters.jsp");
		},

		error: function(xhr) {
			alert("Failed to update Tab Page");
		}
	});
}



// ================= FETCH TAB PAGE ACTIONS =================

function fetchAllTabPageActions() {

	$.ajax({
		url: new URL("/api/modules/getAllTabPageActionsTable", baseUrl).toString(),
		type: "GET",
		xhrFields: { withCredentials: true },

		success: function(data) {

			let tbody = $("#TabPageActionTableBody");
			tbody.empty();

			if (!data || data.length === 0) {
				tbody.append(`
                    <tr>
                        <td colspan="4" class="text-center text-muted">
                            No records found
                        </td>
                    </tr>
                `);
				return;
			}

			$.each(data, function(index, item) {

			    let isActive = item.status == 1;

			    tbody.append(`
			        <tr>
			            <td>${index + 1}</td>
			            <td>${item.pageName}</td>
			            <td>${item.actionName}</td>
			            <td class="text-center">
			                <input type="checkbox" class="status-checkbox"
			                    ${isActive ? 'checked' : ''}
			                    onchange="confirmStatusChange('tabPageAction', ${item.id}, this)">
			            </td>
			            <td>
			                <i class="fa fa-pen ${isActive ? 'text-muted disabled-icon' : 'text-primary cursor-pointer'}"
			                   title="${isActive ? 'Disable to edit' : 'Edit'}"
			                   ${isActive ? '' : `onclick="editTabPageAction(${item.id})"`}
			                   style="${isActive ? 'pointer-events: none; opacity: 0.5;' : ''}"></i>
			            </td>
			        </tr>
			    `);
			});

			if ($.fn.DataTable.isDataTable('#TabPageActionSelectionID')) {
				$('#TabPageActionSelectionID').DataTable().destroy();
			}

			$('#TabPageActionSelectionID').DataTable({
				dom: '<"d-flex justify-content-between mb-2"Bf>rtip',
				buttons: [
					{
						extend: 'excelHtml5',
						text: 'Export to Excel',
						className: 'btn btn-primary btn-sm',
						filename: 'TabPageActions_Report',
						title: 'Tab Page Actions Report'
					}
				],
				paging: true,
				pageLength: 10,
				info: true,
				searching: true,
				ordering: true
			});
		},

		error: function(xhr, status, error) {
			console.error("Fetch Tab Page Action Error:", error);
			alert("Failed to load Tab Page Actions");
		}
	});
}


// ================= LOAD DROPDOWNS (Page + Action) =================

function loadTabPagesAndActionsForDropdown() {

	// Load Pages (from TabsMasterPages)
	$.ajax({
		url: new URL("/api/modules/getAllTabPages", baseUrl).toString(),
		type: "GET",
		xhrFields: { withCredentials: true },

		success: function(response) {

			$("#tpaPageSelect").empty();
			$("#tpaPageSelectUp").empty();

			$("#tpaPageSelect").append(`<option value="">Select Page</option>`);
			$("#tpaPageSelectUp").append(`<option value="">Select Page</option>`);

			$.each(response, function(index, item) {

				let option = `<option value="${item.pageId}">${item.pageName}</option>`;

				$("#tpaPageSelect").append(option);
				$("#tpaPageSelectUp").append(option);
			});
		},

		error: function(xhr, status, error) {
			console.log("Page dropdown load error:", error);
		}
	});

	// Load Actions (reusing existing endpoint already in the codebase)
	$.ajax({
		url: new URL("/api/modules/getAllAction", baseUrl).toString(),
		type: "GET",
		xhrFields: { withCredentials: true },

		success: function(response) {

			$("#tpaActionSelect").empty();
			$("#tpaActionSelectUp").empty();

			$("#tpaActionSelect").append(`<option value="">Select Action</option>`);
			$("#tpaActionSelectUp").append(`<option value="">Select Action</option>`);

			$.each(response, function(index, item) {

				let option = `<option value="${item.actionId}">${item.actionName}</option>`;

				$("#tpaActionSelect").append(option);
				$("#tpaActionSelectUp").append(option);
			});
		},

		error: function(xhr, status, error) {
			console.log("Action dropdown load error:", error);
		}
	});
}


// ================= OPEN CREATE MODAL =================

$("#modaltabpageaction").click(function () {
	
	
	const allowed = allowedActions || [];

	if (!allowed.includes("Insert")) {
	  alert(" You do not have permission to Insert");
	  return;
	}

	$("#tpaPageSelect").val("");
	$("#tpaActionSelect").val("");
	$("#tpaPageError").hide();
	$("#tpaActionError").hide();

	$("#TabPageActionCreateModal").modal("show");
});


// ================= CREATE VALIDATION =================

$("#createtabpageaction").click(function() {

	let pageId = $("#tpaPageSelect").val();
	let actionId = $("#tpaActionSelect").val();

	$(".error-message").hide();

	if (!pageId) {
		$("#tpaPageError").show();
		return;
	}

	if (!actionId) {
		$("#tpaActionError").show();
		return;
	}

	$("#confimationtabpageactionmodal").modal("show");
});


// ================= CREATE CONFIRM =================

$("#confirmtabpageaction").click(function() {

	$("#confimationtabpageactionmodal").modal("hide");

	let pageId = $("#tpaPageSelect").val();
	let actionId = $("#tpaActionSelect").val();

	checkDuplicateTabPageAction(pageId, actionId);
});

function checkDuplicateTabPageAction(pageId, actionId) {

	$.ajax({
		url: new URL(
			`/api/modules/check/tabpageaction?pageId=${pageId}&actionId=${actionId}`,
			baseUrl
		).toString(),

		type: "GET",
		xhrFields: { withCredentials: true },

		success: function(response) {

			if (response.exists === true) {

				$("#duplicateTabPageActionMessage").text("This Action already exists for the selected Page");
				$("#duplicateTabPageActionModal").modal("show");

			} else {

				insertTabPageAction(pageId, actionId);
			}
		},

		error: function(xhr, status, error) {
			console.error("Tab Page Action check API Error:", error);
			alert("An error occurred while checking Tab Page Action");
		}
	});
}

function insertTabPageAction(pageId, actionId) {

	let payload = {
		pageId: pageId,
		actionId: actionId,
		createdBy: sessionStorage.getItem("id")
	};

	$.ajax({
		url: new URL("/api/modules/insertTabPageAction", baseUrl).toString(),
		type: "POST",
		contentType: "application/json",
		data: JSON.stringify(payload),
		xhrFields: { withCredentials: true },

		success: function(response) {

			if (response.status === "duplicate") {

				$("#duplicateTabPageActionMessage").text(response.message);
				$("#duplicateTabPageActionModal").modal("show");
				return;
			}

			$("#TabPageActionCreateModal").modal("hide");
			showPopup("Tab Page Action created successfully", "GlobalMasterRegisters.jsp");
		},

		error: function(xhr, status, error) {
			console.error("Insert Tab Page Action Error:", error);
			alert("Failed to insert Tab Page Action");
		}
	});
}


// ================= EDIT TAB PAGE ACTION =================

let originalTabPageActionData = {};
let selectedTabPageActionId = null;

function editTabPageAction(id) {
	
	  const allowed = allowedActions || [];

	if (!allowed.includes("Edit")) {
	  alert(" You do not have permission to edit.");
	  return;
	}

	selectedTabPageActionId = id;

	$.ajax({
		url: new URL("/api/modules/getTabPageActionById/" + id, baseUrl).toString(),
		type: "GET",
		xhrFields: { withCredentials: true },

		success: function(response) {

			originalTabPageActionData = response;

			$("#tpaPageSelectUp").val(response.pageId);
			$("#tpaActionSelectUp").val(response.actionId);

			$("#TabPageActionUpdateModal").modal("show");
		},

		error: function(xhr, status, error) {
			console.error("Fetch Tab Page Action Error:", error);
			alert("Failed to load Tab Page Action data");
		}
	});
}


// ================= UPDATE VALIDATION =================

$("#createtabpageactionUp").click(function() {

	let pageId = $("#tpaPageSelectUp").val();
	let actionId = $("#tpaActionSelectUp").val();

	$(".error-message").hide();

	if (!pageId) {
		$("#tpaPageErrorUp").show();
		return;
	}

	if (!actionId) {
		$("#tpaActionErrorUp").show();
		return;
	}

	if (pageId == originalTabPageActionData.pageId && actionId == originalTabPageActionData.actionId) {
		showPopup("No Fields Changed", "GlobalMasterRegisters.jsp");
		return;
	}

	$("#confimationupdatetabpageactionmodal").modal("show");
});


// ================= UPDATE CONFIRM =================

$("#confirmtabpageactionUp").click(function() {

	$("#confimationupdatetabpageactionmodal").modal("hide");

	let pageId = $("#tpaPageSelectUp").val();
	let actionId = $("#tpaActionSelectUp").val();

	checkDuplicateTabPageActionForUpdate(pageId, actionId);
});

function checkDuplicateTabPageActionForUpdate(pageId, actionId) {

	$.ajax({
		url: new URL(
			`/api/modules/check/tabpageaction?pageId=${pageId}&actionId=${actionId}`,
			baseUrl
		).toString(),

		type: "GET",
		xhrFields: { withCredentials: true },

		success: function(response) {

			let isSameAsOriginal =
				(pageId == originalTabPageActionData.pageId &&
				 actionId == originalTabPageActionData.actionId);

			if (response.exists === true && !isSameAsOriginal) {

				$("#duplicateTabPageActionMessage").text("This Action already exists for the selected Page");
				$("#duplicateTabPageActionModal").modal("show");

			} else {

				updateTabPageAction(pageId, actionId);
			}
		},

		error: function() {
			alert("Error while checking duplicate Tab Page Action");
		}
	});
}

function updateTabPageAction(pageId, actionId) {

	let payload = {
		pageId: pageId,
		actionId: actionId,
		modifiedBy: sessionStorage.getItem("id")
	};

	$.ajax({
		url: new URL(`/api/modules/updateTabPageAction/${selectedTabPageActionId}`, baseUrl).toString(),
		type: "PUT",
		contentType: "application/json",
		xhrFields: { withCredentials: true },
		data: JSON.stringify(payload),

		success: function() {
			$("#TabPageActionUpdateModal").modal("hide");
			showPopup("Tab Page Action updated successfully", "GlobalMasterRegisters.jsp");
		},

		error: function(xhr) {
			alert("Failed to update Tab Page Action");
		}
	});
}



let pendingStatusChange = null;

// type = 'module' | 'page' | 'pageAction' | 'department' | 'invoiceTab' | 'tabPage' | 'tabPageAction'
function confirmStatusChange(type, id, checkboxEl) {

	const allowed = allowedActions || [];
	if (!allowed.includes("Edit")) {
		alert(" You do not have permission to edit.");
		checkboxEl.checked = !checkboxEl.checked; // revert toggle
		return;
	}

	pendingStatusChange = {
		type: type,
		id: id,
		newStatus: checkboxEl.checked ? 1 : 0,
		checkboxEl: checkboxEl
	};

	$("#statusConfirmModal").modal("show");
}

$("#statusNoBtn").click(function () {
	if (pendingStatusChange) {
		pendingStatusChange.checkboxEl.checked = !pendingStatusChange.checkboxEl.checked;
	}
	pendingStatusChange = null;
	$("#statusConfirmModal").modal("hide");
});

$("#statusYesBtn").click(function () {

	if (!pendingStatusChange) return;

	const { type, id, newStatus } = pendingStatusChange;

	const modifiedBy = sessionStorage.getItem("id");

	// Map each table type to its own status update endpoint
	const endpointMap = {
		module:        `/api/modules/updateStatus/${id}?status=${newStatus}&modifiedBy=${modifiedBy}`,
		page:          `/api/modules/updatePageStatus/${id}?status=${newStatus}&modifiedBy=${modifiedBy}`,
		pageAction:    `/api/modules/updatePageActionStatus/${id}?status=${newStatus}&modifiedBy=${modifiedBy}`,
		department:    `/api/modules/updateDeptStatus/${id}?status=${newStatus}&modifiedBy=${modifiedBy}`,
		invoiceTab:    `/api/modules/updateTabStatus/${id}?status=${newStatus}&modifiedBy=${modifiedBy}`,
		tabPage:       `/api/modules/updateTabPageStatus/${id}?status=${newStatus}&modifiedBy=${modifiedBy}`,
		tabPageAction: `/api/modules/updateTabPageActionStatus/${id}?status=${newStatus}&modifiedBy=${modifiedBy}`
	};

	$.ajax({
		url: new URL(endpointMap[type], baseUrl).toString(),
		type: "PUT",
		xhrFields: { withCredentials: true },

		success: function () {
			$("#statusConfirmModal").modal("hide");
			showPopup("Status updated successfully", "GlobalMasterRegisters.jsp");
		},

		error: function () {
			alert("Failed to update status");
			pendingStatusChange.checkboxEl.checked = !pendingStatusChange.checkboxEl.checked;
			$("#statusConfirmModal").modal("hide");
		}
	});

	pendingStatusChange = null;
});