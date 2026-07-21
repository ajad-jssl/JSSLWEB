
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

			$.each(data, function(index, item) {

				tbody.append(`
                    <tr>
                        <td>${index + 1}</td>
                        <td>${item.moduleName}</td>
                        <td>
                            <i class="fa fa-pen text-muted cursor-pointer"
                               title="Edit"
                               onclick="editModule(${item.moduleID})"></i>
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



// ================= OPEN CREATE MODAL =================

$("#modaltype").click(function () {

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

/*	const allowed = allowedActions || [];

	if (!allowed.includes("Edit")) {

		alert("You do not have permission to Edit.");

		return;
	}*/

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

$(document).ready(function () {

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

            $.each(data, function(index, item) {

                tbody.append(`
                    <tr>
                        <td>${index + 1}</td>
                        <td>${item[1]}</td>
                        <td>${item[2]}</td>
                        <td>${item[3]}</td>
                        <td>
                            <i class="fa fa-pen text-muted cursor-pointer"
                               title="Edit" onclick="editpage(${item[0]})"></i>
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

                tbody.append(`
                    <tr>
                        <td>${index + 1}</td>
                        <td>${item[1]}</td>
                        <td>${item[2]}</td>
                        <td>
                            <i class="fa fa-pen text-muted cursor-pointer"
                               title="Edit"
                               onclick="editPageAction(${item[0]})">
                            </i>
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