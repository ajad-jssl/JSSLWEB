





document.addEventListener("DOMContentLoaded", async function () {
    await loadActions();
    
});


const MainPage =   'DrawingMaster.jsp';
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

document.getElementById("modalshift").addEventListener("click", function () {
    // show custom message instead of opening modal
	  const allowed = allowedActions || [];

	if (!allowed.includes("Insert")) {
	  alert(" You do not have permission to Insert.");
	  $('#exampleModalScrollableshift').modal('hide');
	  return;
	}
	$('#exampleModalScrollableshift').modal('show');
});


document.getElementById("modaltype").addEventListener("click", function () {
    // show custom message instead of opening modal
	  const allowed = allowedActions || [];

	if (!allowed.includes("Insert")) {
	  alert(" You do not have permission to Insert.");
	  $('#exampleModalScrollablestype1').modal('hide');
	  return;
	}
	$('#exampleModalScrollablestype1').modal('show');
});
document.getElementById("modalactivity").addEventListener("click", function () {
    // show custom message instead of opening modal
	  const allowed = allowedActions || [];

	if (!allowed.includes("Insert")) {
	  alert(" You do not have permission to Insert.");
	  $('#exampleModalScrollablesactivity').modal('hide');
	  return;
	}
	$('#exampleModalScrollablesactivity').modal('show');
});


document.getElementById("modalassing").addEventListener("click", function () {
    // show custom message instead of opening modal
	  const allowed = allowedActions || [];

	if (!allowed.includes("Insert")) {
	  alert(" You do not have permission to Insert.");
	  $('#exampleModalScrollablemodalAssign').modal('hide');
	  return;
	}
	$('#exampleModalScrollablemodalAssign').modal('show');
});


document.getElementById("modalreason").addEventListener("click", function () {
    // show custom message instead of opening modal
	  const allowed = allowedActions || [];

	if (!allowed.includes("Insert")) {
	  alert(" You do not have permission to Insert.");
	  $('#exampleModalScrollablesreason').modal('hide');
	  return;
	}
	$('#exampleModalScrollablesreason').modal('show');
});

$(document).ready(function() {


	loadShiftRules();


	/*fetchShiftType();*/
	fetchTypeSelection();
	fetchReason();
	fetchStage();
	fetchTypeStage();
	loadLocations();

	populateTypeSelectionDropdown()
		.then(fetchActivityCategory)
		.catch(err => console.error(err));

	$.when(
		loadEmployees(),
		//loadEmployeeCode(),
		loadModalTypes()
	).done(function() {
		fetchModalAssign();
	});


});




const shiftRulesByLocation = {

	// Bellary (Loc_id = 3)
/*	3: {
		"A": 7.5,
		"B": 7.5,
		"C": 7.5,
		"G": 8.5,
		"A+G": 12,
		"G+B": 12
	},

	// Mumbai (Loc_id = 2)
	2: {
		"A": 8,
		"B": 8,
		"C": 8
	}*/
};

const locationMap = {};

function loadLocations() {

	const url = new URL('/api/location/getAll', baseUrl);

	fetch(url, {
		method: 'GET',
		credentials: 'include'
	})
		.then(response => response.json())
		.then(data => {

			if (!data || !data.Data || data.Data.length === 0) return;

			// Clear map
			Object.keys(locationMap).forEach(k => delete locationMap[k]);

			// Map Loc_id → Location
			data.Data.forEach(loc => {
				locationMap[String(loc.Loc_id)] = loc.Location; // 👈 force string
			});

			populateLocationDropdowns();

			// ✅ CALL SHIFT API ONLY AFTER LOCATION MAP IS READY
			fetchShiftType();
		})
		.catch(error => {
			console.error('Error loading locations:', error);
		});
}


function loadShiftRules() {

    let modal_id = localStorage.getItem('selectedModuleId');

    fetch(new URL(`/api/global/shift-rules?modal_id=${modal_id}`, baseUrl), {
        method: "GET",
        credentials: "include"
    })
    .then(response => response.json())
    .then(data => {

        if (!data || !data.Data) return;

        data.Data.forEach(item => {

            let locationId = item.location_id;
            let key = item.config_key;
            let value = parseFloat(item.config_value);

            if (!shiftRulesByLocation[locationId]) {
                shiftRulesByLocation[locationId] = {};
            }

            shiftRulesByLocation[locationId][key] = value;

        });

        console.log("Shift Rules Loaded:", shiftRulesByLocation);

    })
    .catch(error => console.error("Error loading shift rules:", error));
}


function populateLocationDropdowns() {

	const selects = [
		document.getElementById('loactionselect'),
		document.getElementById('loactionselectUp')
	];

	selects.forEach(select => {
		if (!select) return;

		select.innerHTML = `<option value="">Select the Location</option>`;

		for (const locId in locationMap) {
			const option = document.createElement('option');
			option.value = locId;                 // ID
			option.textContent = locationMap[locId]; // Name
			select.appendChild(option);
		}
	});
}


function fetchShiftType() {

	$.ajax({
		url: new URL("/api/shift/getAll", baseUrl).toString(),
		type: "GET",
		xhrFields: { withCredentials: true },

		success: function(response) {

			let tbody = $("#shiftTableBody");
			tbody.empty();

			if (!response || response.length === 0) {
				tbody.append(`
                    <tr>
                        <td colspan="4" class="text-center text-muted">
                            No Shift Types Found
                        </td>
                    </tr>
                `);
				return;
			}

			$.each(response, function(index, shift) {
				tbody.append(`
                    <tr>
                        <td>${index + 1}</td>
                        <td>${shift.shiftCode}</td>
						<td>${shift.shiftHours}</td>
						<td>${locationMap[shift.location_id] || '-'}</td>
                        <td>${shift.shift_description}</td>
                        <td>
                            <i class="fa fa-pen text-muted cursor-pointer"
                               title="Edit"
                               onclick="editshiftType(${shift.shift_id})"></i>
                        </td>
                    </tr>
                `);
			});

			// 🔁 Safely reinitialize DataTable
			if ($.fn.DataTable.isDataTable('#shiftTableID')) {
				$('#shiftTableID').DataTable().destroy();
			}

			$('#shiftTableID').DataTable({
				dom: '<"d-flex justify-content-between mb-2"Bf>rtip',
				buttons: [
					{
						extend: 'excelHtml5',
						text: 'Export to Excel',
						className: 'btn btn-primary btn-sm',
						filename: 'Shift_Master_Report',
						title: 'Shift Master Report'
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
			console.error("Error fetching shift types:", error);
			alert("Failed to load Shift Types");
		}
	});
}



$("#createshifttype").click(function() {
	console.log(shiftRulesByLocation);

	let shifttype = $("#shifttype").val().trim();
	let shifttypeDescription = $("#shifttypeDescription").val().trim();
	let shifttypeHours = $("#shifttypehours").val().trim();
	let shiftLocationId = $("#loactionselect").val().trim();

	let hasError = false;

	/* =========================
	   Location validation
	========================= */
	if (!shiftLocationId) {
		$("#loactionselectError").show();
		hasError = true;
	} else {
		$("#loactionselectError").hide();
	}

	/* =========================
	   Shift code validation
	========================= */
	if (!shifttype) {
		$("#shifttypeError").show();
		hasError = true;
	} else {
		$("#shifttypeError").hide();
	}

	/* =========================
	   Shift description validation
	========================= */
	if (!shifttypeDescription) {
		$("#shifttypeDescriptionError").show();
		hasError = true;
	} else {
		$("#shifttypeDescriptionError").hide();
	}

	/* =========================
	   Shift hours validation
	========================= */
	if (!shifttypeHours) {
		$("#shifttypehoursError")
			.text("Shift Hours is required")
			.show();
		hasError = true;
	} else {
		$("#shifttypehoursError").hide();
	}

	if (hasError) return;

	/* =========================
	   Numeric validation
	========================= */
	let hours = parseFloat(shifttypeHours);

	if (isNaN(hours)) {
		$("#shifttypehoursError")
			.text("Shift Hours must be a valid number")
			.show();
		return;
	}

	/* =========================
	   Location-based validation
	========================= */
	if (!validateShiftHoursByLocation(
		shifttype,
		hours,
		shiftLocationId,
		"#shifttypehoursError"
	)) {
		return;
	}

	/* =========================
	   SUCCESS → show confirmation modal
	========================= */
	$("#confimationshiftmodal").modal("show");
});


function validateShiftHoursByLocation(shiftCode, hours, locId, errorSelector) {



	let code = shiftCode.toUpperCase().replace(/\s+/g, "");
	let locationId = parseInt(locId);


	let rules = shiftRulesByLocation[locationId];



	if (!rules) {
		console.error("❌ No rules configured for this location");
		$(errorSelector)
			.text("No shift rules configured for selected location")
			.show();
		return false;
	}



	if (rules[code] === undefined) {
		console.error("❌ Invalid shift code for location");
		$(errorSelector)
			.text("Invalid shift code for this location")
			.show();
		return false;
	}

	if (parseFloat(hours) !== rules[code]) {

		$(errorSelector)
			.text(`For this location, ${code} shift must be ${rules[code]} hours`)
			.show();
		return false;
	}


	$(errorSelector).hide();
	return true;
}



$("#confirmshifttype").click(function() {
	$("#confimationshiftmodal").modal("hide");

	insertShiftType();
});

/*function handleshifttypecreation() {

	let shifttype = $("#shifttype").val().trim();

	// Check for duplicate Shift Type
	$.ajax({
		url: new URL(`/api/shift/check/shift?code=${encodeURIComponent(shifttype)}`, baseUrl).toString(),
		type: 'GET',
		xhrFields: {
			withCredentials: true
		},
		success: function(response) {
			if (response.exists) {
				$("#duplicateShiftModal").modal("show");
			} else {
				insertShiftType(); // call your insert API
			}
		},
		error: function(xhr, status, error) {
			console.error("Shift check API Error:", error);
			alert("An error occurred while checking shift type: " + error);
		}
	});
}*/


/*function insertShiftType() {

	let shiftCode = $("#shifttype").val().trim();
	let shiftDescription = $("#shifttypeDescription").val().trim();

	let currentDateTimeString = getIndianDateTimeFormat(new Date());
	let shiftHours = parseFloat($("#shifttypehours").val().trim());
let shiftLocation = $("#loactionselect").val().trim();
	
	
	let requestData = {
		"shiftCode": shiftCode,
		"shift_description": shiftDescription,
		"shiftHours": shiftHours,   // ✅ ADDED
		"createdBy": sessionStorage.getItem('id'),
		"createdDate": currentDateTimeString,
		"location_id": parseInt(shiftLocation),
		"status": 0
	};

	

	$.ajax({
		url: new URL("/api/shift", baseUrl).toString(), // Use baseUrl dynamically
		type: "POST",
		contentType: "application/json",
		data: JSON.stringify(requestData),
		xhrFields: {
			withCredentials: true
		},
		success: function() {
			showPopup("Shift created successfully", "DrawingMasterRegister.jsp");
		},
		error: function(xhr, status, error) {
			console.error("Insert Shift Error:", error);
			alert("Failed to insert Shift");
		}
	});

}*/




function insertShiftType() {

	let shiftCode = $("#shifttype").val().trim();
	let shiftDescription = $("#shifttypeDescription").val().trim();
	let shiftHours = parseFloat($("#shifttypehours").val().trim());
	let shiftLocation = $("#loactionselect").val().trim();

	let currentDateTimeString = getIndianDateTimeFormat(new Date());

	let requestData = {
		shiftCode: shiftCode,
		shift_description: shiftDescription,
		shiftHours: shiftHours,
		createdBy: sessionStorage.getItem('id'),
		createdDate: currentDateTimeString,
		location_id: parseInt(shiftLocation),
		status: 0
	};

	$.ajax({
		url: new URL("/api/shift", baseUrl).toString(),
		type: "POST",
		contentType: "application/json",
		data: JSON.stringify(requestData),
		xhrFields: {
			withCredentials: true
		},

		success: function(response, textStatus, xhr) {

			// ✅ Shift inserted successfully
			if (xhr.status === 200) {
				showPopup("Shift created successfully", "DrawingMasterRegister.jsp");
			}
		},

		error: function(xhr) {

			// ⚠️ Duplicate shift for same location
			if (xhr.status === 409) {
				$("#duplicateShiftMessage")
					.text(xhr.responseText || "This shift already exists for this location");
				$("#duplicateShiftModal").modal("show");
			}
			else {
				console.error("Insert Shift Error:", xhr.responseText);
				alert("Failed to insert Shift");
			}
		}
	});
}





let originalShiftCode = "";
let originalShiftDesc = "";
let originalShiftHours = "";
let originalshiftlocation = "";
let selectedShiftId = null;


function editshiftType(shiftId) {
	
	
	const allowed = allowedActions || [];

	if (!allowed.includes("Edit")) {
	  alert(" You do not have permission to Edit.");
	  
	  return;
	}
	
	
	selectedShiftId = shiftId;

	$.ajax({
		url: new URL("/api/shift/get/" + shiftId, baseUrl).toString(), // Use baseUrl dynamically
		type: "GET",
		xhrFields: {
			withCredentials: true
		},
		success: function(response) {
			$("#shifttypecodeUp").val(response.shiftCode);
			$("#shifttypeDescriptionUp").val(response.shift_description);
			$("#shifttypehourUp").val(response.shiftHours);
			  $("#loactionselectUp").val(response.location_id);

			originalShiftCode = response.shiftCode;
			originalShiftDesc = response.shift_description;
			originalShiftHours = response.shiftHours;
			originalshiftlocation = response.location_id;

			$("#updateShiftBtn").data("shift-id", response.shift_id);

			$("#exampleModalScrollableshiftUp").modal("show");
		},
		error: function(xhr, status, error) {
			console.error("Fetch Shift Error:", error);
			alert("Failed to load shift data");
		}
	});

}

$("#createshifttypeUp").click(function() {

	let shiftCode = $("#shifttypecodeUp").val().trim();
	let shiftDesc = $("#shifttypeDescriptionUp").val().trim();
	let shiftHours = $("#shifttypehourUp").val().trim();
	let shiftLocationId = $("#loactionselectUp").val().trim();

	let hasError = false;

	/* =========================
	   Location validation
	========================= */
	if (!shiftLocationId) {
		$("#loactionselectUpError").show();
		hasError = true;
	} else {
		$("#loactionselectUpError").hide();
	}

	/* =========================
	   Shift code validation
	========================= */
	if (!shiftCode) {
		$("#shifttypeUpError").show();
		hasError = true;
	} else {
		$("#shifttypeUpError").hide();
	}

	/* =========================
	   Shift description validation
	========================= */
	if (!shiftDesc) {
		$("#shifttypeDescriptionErrorUp").show();
		hasError = true;
	} else {
		$("#shifttypeDescriptionErrorUp").hide();
	}

	/* =========================
	   Shift hours validation
	========================= */
	if (!shiftHours) {
		$("#shifttypehourUpError")
			.text("Shift Hours is required")
			.show();
		hasError = true;
	} else {
		$("#shifttypehourUpError").hide();
	}

	if (hasError) return;

	/* =========================
	   Numeric validation
	========================= */
	let hours = parseFloat(shiftHours);

	if (isNaN(hours)) {
		$("#shifttypehourUpError")
			.text("Shift Hours must be a valid number")
			.show();
		return;
	}

	/* =========================
	   Location-based validation
	========================= */
	if (!validateShiftHoursByLocation(
		shiftCode,
		hours,
		shiftLocationId,
		"#shifttypehourUpError"
	)) {
		return;
	}

	/* =========================
	   SUCCESS → show confirmation modal
	========================= */
	$("#confimationupdateshiftmodal").modal("show");
});



$("#confirmupdateshifttype").click(function() {

	$("#confimationupdateshiftmodal").modal("hide");

	let shiftCode = $("#shifttypecodeUp").val().trim();
	let shiftDesc = $("#shifttypeDescriptionUp").val().trim();
	let shiftHours = parseFloat($("#shifttypehourUp").val().trim());
	let shiftLocation = $("#loactionselectUp").val().trim();

	/* =========================
	   No-change detection
	========================= */
	if (
		shiftCode === originalShiftCode &&
		shiftDesc === originalShiftDesc &&
		shiftHours === parseFloat(originalShiftHours) &&
		shiftLocation == originalshiftlocation
	) {
		showPopup("No Feilds Changes", "DrawingMasterRegister.jsp");
		return;
	}

	/* =========================
	   Duplicate check only if code changed
	========================= */
	if (shiftCode !== originalShiftCode || shiftLocation !== originalshiftlocation) {
		checkDuplicateShiftForUpdate(shiftCode, shiftDesc, shiftHours, shiftLocation);
	} else {
		updateShiftType(shiftCode, shiftDesc, shiftHours, shiftLocation);
	}
});

function checkDuplicateShiftForUpdate(shiftCode, shiftDesc, shiftHours, shiftLocation) {





	let requestData = {
		shiftCode: shiftCode,
		location_id: parseInt(shiftLocation),
	};

	$.ajax({
		url: new URL("api/shift/check-duplicate", baseUrl).toString(),
		type: "POST",
		contentType: "application/json",
		data: JSON.stringify(requestData),
		xhrFields: { withCredentials: true },

		success: function() {
			// ✅ No duplicate → proceed with update
			updateShiftType(shiftCode, shiftDesc, shiftHours, shiftLocation);
		},

		error: function(xhr) {
			if (xhr.status === 409) {
				$("#duplicateShiftMessage")
					.text(xhr.responseText || "This shift already exists for this location");
				$("#duplicateShiftModal").modal("show");
			} else {
				alert("Error while checking duplicate shift code.");
			}
		}
	});
}



function updateShiftType(shiftCode, shiftDesc, shiftHours, shiftLocation) {

	console.log(shiftLocation);

	let requestData = {
		shiftCode: shiftCode,
		shift_description: shiftDesc,
		shiftHours: shiftHours,
		location_id: parseInt(shiftLocation),
		modifiedBy: sessionStorage.getItem("id"),
		modifiedDate: getIndianDateTimeFormat(new Date())
	};

	console.log(requestData.shiftHours);

	$.ajax({
		url: new URL(`/api/shift/modified/${selectedShiftId}`, baseUrl).toString(),
		type: "PUT",
		contentType: "application/json",
		xhrFields: { withCredentials: true },
		data: JSON.stringify(requestData),

		success: function() {

			showPopup(
				"Shift is Updated Successfully..!",
				"DrawingMasterRegister.jsp"
			);
		},

		error: function(xhr) {

			console.log(xhr);

			//alert(xhr.responseText);
			$("#duplicateShiftMessage")
								.text(xhr.responseText || "The Transcation is Alredy Exists For Shift");
							$("#duplicateShiftModal").modal("show");
		}
	});
	
}



$("#exampleModalScrollableshiftUp").on("shown.bs.modal", function() {


	$("#shifttypeUpError").hide();
	$("#shifttypeDescriptionErrorUp").hide();
});



function fetchTypeSelection() {

	$.ajax({
		url: new URL("/api/type_selection/getAll", baseUrl).toString(),
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
                        <td>${item.typeName}</td>
                        <td>
                            <i class="fa fa-pen text-muted cursor-pointer"
                               title="Edit"
                               onclick="editType(${item.typeId})"></i>
                        </td>
                    </tr>
                `);
			});

			// 🔁 Reinitialize DataTable safely
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
						filename: 'Type_Selection_Report',
						title: 'Type Selection Report',
						customize: function(xlsx) {
							var sheet = xlsx.xl.worksheets['sheet1.xml'];
							var sheetData = sheet.getElementsByTagName('sheetData')[0];

							var heading =
								'<row r="1">' +
								'<c t="inlineStr" r="A1">' +
								'<is><t><b>Type Selection Report</b></t></is>' +
								'</c>' +
								'</row>';

							sheetData.innerHTML = heading + sheetData.innerHTML;
						}
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
			console.error("Fetch Type Selection Error:", error);
			alert("Failed to load Type Selection data");
		}
	});
}





$("#createtype").click(function() {
	let typename = $("#type").val().trim();

	if (!typename) {
		$("#typeError").show();
		return;
	}
	else {
		$("#typeError").hide();
	}
	$("#confimationtypemodal").modal("show");
});


$("#confirmtype").click(function() {

	$("#confimationtypemodal").modal("hide");
	handlestypecreation();
})


function handlestypecreation() {

	let typeName = $("#type").val().trim();




	$.ajax({
		url: new URL(
			`/api/type_selection/check/type?typeName=${encodeURIComponent(typeName)}`,
			baseUrl
		).toString(),
		type: "GET",
		xhrFields: {
			withCredentials: true
		},

		success: function(response) {
			if (response.exists === true) {

				$("#duplicateTypeModal").modal("show");
			} else {
				insertTypeSelection(typeName);
			}
		},

		error: function(xhr, status, error) {
			console.error("Type check API Error:", error);
			alert("An error occurred while checking Type Name");
		}
	});
}


function insertTypeSelection(typeName) {

	//let typeName = $("#typeSelection").val().trim();

	let currentDateTimeString = getIndianDateTimeFormat(new Date());

	let requestData = {
		"typeName": typeName,
		"createdBy": sessionStorage.getItem('id'),
		"createdDate": currentDateTimeString,
		"status": 0
	};
	$.ajax({
		url: new URL("/api/type_selection", baseUrl).toString(), // Dynamic baseUrl
		type: "POST",
		contentType: "application/json",
		data: JSON.stringify(requestData),
		xhrFields: {
			withCredentials: true
		},
		success: function() {
			showPopup("Type Selection created successfully", "DrawingMasterRegister.jsp");
		},
		error: function(xhr, status, error) {
			console.error("Insert Type Selection Error:", error);
			alert("Failed to insert Type Selection");
		}
	});

}


let originalTypeName = "";
let selectedTypeId = null;
function editType(typeId) {
	

	const allowed = allowedActions || [];

	if (!allowed.includes("Edit")) {
	  alert(" You do not have permission to Edit.");
	  
	  return;
	}


	selectedTypeId = typeId;

	$.ajax({
		url: new URL("/api/type_selection/get/" + typeId, baseUrl).toString(), // Dynamic baseUrl
		type: "GET",
		xhrFields: {
			withCredentials: true
		},
		success: function(response) {
			// Set values in update modal
			$("#typeUp").val(response.typeName);

			// Store original value for comparison
			originalTypeName = response.typeName;

			// Store id on update button
			$("#updateTypeBtn").data("type-id", response.typeId);

			// Show modal
			$("#exampleModalScrollablestypeUp").modal("show");
		},
		error: function(xhr, status, error) {
			console.error("Fetch Type Error:", error);
			alert("Failed to load Type Selection data");
		}
	});

}

$("#exampleModalScrollablestypeUp").on("shown.bs.modal", function() {

	$("#typeUpError").hide();
});



$("#createtypeUp").click(function() {

	let typenameup = $("#typeUp").val().trim();


	if (typenameup === "") {
		$("#typeUpError").show();
		return;
	} else {
		$("#typeUpError").hide();
	}



	$("#confimationupdatetypemodal").modal("show");
});

$("#confirmtypeUp").click(function() {

	let newTypeName = $("#typeUp").val().trim();

	$("#confimationupdatetypemodal").modal("hide");


	if (newTypeName === originalTypeName) {
		showPopup("No Feilds Changes ", "DrawingMasterRegister.jsp");
		return;
	}


	checkDuplicateTypeForUpdate(newTypeName);
});


function checkDuplicateTypeForUpdate(typeName) {

	$.ajax({
		url: new URL(
			`/api/type_selection/check/type?typeName=${encodeURIComponent(typeName)}`,
			baseUrl
		).toString(),
		type: "GET",
		xhrFields: { withCredentials: true },

		success: function(response) {
			if (response.exists) {
				$("#duplicateTypeModal").modal("show");
			} else {
				updateTypeSelection(typeName);
			}
		},
		error: function() {
			alert("Error while checking duplicate type");
		}
	});
}

function updateTypeSelection(typeName) {

	let requestData = {
		typeName: typeName,
		modifiedBy: sessionStorage.getItem("id"),
		modifiedDate: getIndianDateTimeFormat(new Date())
	};

	$.ajax({
		url: new URL(`/api/type_selection/modified/${selectedTypeId}`, baseUrl).toString(),
		type: "PUT",
		contentType: "application/json",
		xhrFields: { withCredentials: true },
		data: JSON.stringify(requestData),

		success: function() {
			showPopup("Type updated successfully", "DrawingMasterRegister.jsp");
		},

		error: function(xhr) {

			if (xhr.status === 409) {
				/*alert(xhr.responseText);*/
				
				$("#duplicateTypeMessage")
									.text(xhr.responseText || "The Transcation is Already Exists For this Type ");
								$("#duplicateTypeModal").modal("show");
			} else {
				alert("Failed to update type");
			}
		}
	});
}






// Activity Js Starts from here



let typeSelectionDataMap = {};

function populateTypeSelectionDropdown() {
	return new Promise((resolve, reject) => {

		const dropdown = $("#typeSelection");
		dropdown.empty();
		dropdown.append('<option value="">-- Select Type --</option>');

		$.ajax({
			url: new URL("/api/type_selection/mapping", baseUrl).toString(),
			type: "GET",
			xhrFields: { withCredentials: true },

			success: function(response) {
				typeSelectionDataMap = {};

				if (response && response.length > 0) {
					$.each(response, function(index, type) {
						typeSelectionDataMap[type.typeId] = type;

						dropdown.append(
							`<option value="${type.typeId}">${type.typeName}</option>`
						);
					});
				}
				resolve(); // ✅ IMPORTANT
			},

			error: function(err) {
				reject(err);
			}
		});
	});
}


$("#createactivity").click(function() {

	let selectType = $("#typeSelection").val().trim();
	let activityName = $("#activity").val().trim();

	let isValid = true;


	if (!selectType) {
		$("#TypeSelectionError").show();
		isValid = false;
	} else {
		$("#TypeSelectionError").hide();
	}


	if (!activityName) {
		$("#ActivityError").show();
		isValid = false;
	} else {
		$("#ActivityError").hide();
	}


	if (!isValid) {
		return;
	}


	$("#confimationactivitymodal").modal("show");
});


$("#confirmactivity").click(function() {
	$("#confimationactivitymodal").modal("hide");
	handleActivityCreation();
});


function handleActivityCreation() {

	let activityName = $("#activity").val().trim();
	let typeSelection  = $("#typeSelection").val().trim();

	let url = new URL("/api/activity_category/check/activity", baseUrl);

	url.searchParams.append("activityName", activityName);
	url.searchParams.append("typeId", typeSelection);

	$.ajax({
	    url: url.toString(),
	    type: "GET",
	    xhrFields: {
	        withCredentials: true
	    },
	    success: function(response) {
	        if (response.exists) {
	            $("#duplicateActivityModal").modal("show");
	        } else {
	            insertActivity();
	        }
	    }
	});
}
function insertActivity() {

	let currentDateTimeString = getIndianDateTimeFormat(new Date());

	let requestData = {
		"typeId": $("#typeSelection").val(),
		"activityName": $("#activity").val().trim(),
		"createdBy": sessionStorage.getItem("id"),
		"createdDate": currentDateTimeString,
		"status": 0
	};

	$.ajax({
		url: new URL("/api/activity_category", baseUrl).toString(),
		type: "POST",
		contentType: "application/json",
		data: JSON.stringify(requestData),
		xhrFields: {
			withCredentials: true
		},
		success: function() {
			showPopup("Activity created successfully", "DrawingMasterRegister.jsp");
		},
		error: function(xhr, status, error) {
			console.error("Insert Activity Error:", error);
			alert("Failed to insert Activity");
		}
	});
}

function fetchActivityCategory() {

	$.ajax({
		url: new URL("/api/activity_category/getAll", baseUrl).toString(),
		type: "GET",
		xhrFields: { withCredentials: true },

		success: function(data) {

			let tbody = $("#ActivitytableID tbody");
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

				let typeName = typeSelectionDataMap[item.typeId]
					? typeSelectionDataMap[item.typeId].typeName
					: "N/A";

				tbody.append(`
	                    <tr>
	                        <td>${index + 1}</td>
	                        <td>${typeName}</td>
	                        <td>${item.activityName}</td>
	                        <td>
	                            <i class="fa fa-pen text-muted cursor-pointer"
	                               title="Edit"
	                               onclick="editActivity(${item.activityId})"></i>
	                        </td>
	                    </tr>
	                `);
			});

			// 🔁 DataTable reinit
			if ($.fn.DataTable.isDataTable('#ActivitytableID')) {
				$('#ActivitytableID').DataTable().destroy();
			}

			$('#ActivitytableID').DataTable({
				dom: '<"d-flex justify-content-between mb-2"Bf>rtip',
				buttons: [
					{
						extend: 'excelHtml5',
						text: 'Export to Excel',
						className: 'btn btn-primary btn-sm',
						filename: 'Activity_Category_Report',
						title: 'Activity Category Report'
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
			console.error("Fetch Activity Category Error:", error);
			alert("Failed to load Activity Category data");
		}
	});
}

function populateTypeSelectionDropdownUp(selectedTypeId) {
	const dropdown = $("#typeSelectionUp");
	dropdown.empty();
	dropdown.append('<option value="">-- Select Type --</option>');

	$.each(typeSelectionDataMap, function(typeId, typeObj) {
		dropdown.append(
			`<option value="${typeId}">${typeObj.typeName}</option>`
		);
	});

	if (selectedTypeId) {
		dropdown.val(selectedTypeId);
	}
}
let orginalactivityid = null;
let orginalactivityname = null;

function editActivity(activityId) {
	const allowed = allowedActions || [];

	if (!allowed.includes("Insert")) {
	  alert(" You do not have permission to Insert.");
	  $('#exampleModalScrollable123').modal('hide');
	  return;
	}

	$.ajax({
		url: new URL(`/api/activity_category/get/${activityId}`, baseUrl).toString(),
		type: "GET",
		xhrFields: { withCredentials: true },

		success: function(response) {

			// Store activityId for update call later
			$("#createactivityUp").data("activityId", response.activityId);

			orginalactivityid = response.typeId;

			orginalactivityname = response.activityName;
			// Fill activity name
			$("#activityUp").val(response.activityName);

			// Populate dropdown and select type
			populateTypeSelectionDropdownUp(response.typeId);

			// Hide errors
			$("#TypeSelectionUpError").hide();
			$("#ActivityUpError").hide();

			// Open modal
			$("#exampleModalScrollablesactivityUp").modal("show");
		},

		error: function(xhr, status, error) {
			console.error("Fetch Activity Error:", error);
			alert("Failed to fetch Activity details");
		}
	});
}
$("#createactivityUp").click(function() {

	let typeId = $("#typeSelectionUp").val().trim();
	let activityName = $("#activityUp").val().trim();

	let isValid = true;

	if (!typeId) {
		$("#TypeSelectionUpError").show();
		isValid = false;
	} else {
		$("#TypeSelectionUpError").hide();
	}

	if (!activityName) {
		$("#ActivityUpError").show();
		isValid = false;
	} else {
		$("#ActivityUpError").hide();
	}

	if (!isValid) return;

	$("#confimationupdateactivitymodal").modal("show");
});



$("#confirmactivityUp").click(function () {

    $("#confimationupdateactivitymodal").modal("hide");

    let typeId = $("#typeSelectionUp").val().trim();
    let activityName = $("#activityUp").val().trim();

    if (activityName === orginalactivityname &&
        typeId == orginalactivityid) {

        showPopup("No Fields Changed", "DrawingMasterRegister.jsp");
        return;
    }

    $.ajax({

        url: new URL(
            `/api/activity_category/check/activity?activityName=${encodeURIComponent(activityName)}&typeId=${typeId}`,
            baseUrl
        ).toString(),

        type: "GET",

        xhrFields: {
            withCredentials: true
        },

        success: function (response) {

            if (response.exists) {

                $("#duplicateActivityModal").modal("show");

            } else {

                updateActivityCategory();

            }

        },

        error: function (xhr, status, error) {

            console.error("Activity check API Error:", error);

            alert("An error occurred while checking Activity Name");

        }

    });

});



function updateActivityCategory() {

	let activityId = $("#createactivityUp").data("activityId");

	let requestData = {
		typeId: $("#typeSelectionUp").val(),
		activityName: $("#activityUp").val().trim(),
		modifiedBy: sessionStorage.getItem("id"),
		modifiedDate: getIndianDateTimeFormat(new Date())
	};

	$.ajax({
		url: new URL(`/api/activity_category/modified/${activityId}`, baseUrl).toString(),
		type: "PUT",
		contentType: "application/json",
		data: JSON.stringify(requestData),
		xhrFields: { withCredentials: true },

		success: function() {
			$("#exampleModalScrollablesactivityUp").modal("hide");
			fetchActivityCategory();
			showPopup("Activity updated successfully", "DrawingMasterRegister.jsp");
		},

		error: function(xhr) {

			console.error("Update Activity Error:", xhr);

			if (xhr.status === 409) {

				$("#duplicateActivityMessage")
					.text(xhr.responseText || "The Transaction already exists for this Activity");

				$("#duplicateActivityModal").modal("show");

			} else {

				alert(xhr.responseText || "Failed to update activity");
			}
		}
	});
}




/*  the Drawing modal Assign Master*/


let employeeMap = {};
let typeMap = {};


function loadEmployees() {

	return $.ajax({
		url: new URL("/api/modalassign/department18", baseUrl).toString(),
		type: "GET",
		contentType: "application/json",
		xhrFields: { withCredentials: true },

		success: function(data) {

			let employeeSelect = $("#employeeSelection");
			employeeSelect.empty();

			employeeSelect.append(`<option value="">-- Select Employee --</option>`);

			employeeMap = {}; // ✅ build map here

			$.each(data, function(index, emp) {
				employeeMap[emp.id] = emp.username;

				employeeSelect.append(
					`<option value="${emp.id}">${emp.username}</option>`
				);
			});
		},

		error: function(xhr, status, error) {
			console.error("Load Employees Error:", error);
			alert("Failed to load employees");
		}
	});
}

function loadEmployeeCode() {

	return $.ajax({
		url: new URL("/api/websmartuser/getAllEmpCode", baseUrl).toString(),
		type: "GET",
		contentType: "application/json",
		xhrFields: { withCredentials: true },

		success: function(data) {

			let employeeSelect = $("#employeeCodeSelection");
			employeeSelect.empty();

			employeeSelect.append(`<option value="">-- Select Employee --</option>`);

		//	employeeMap = {}; // ✅ build map here

			$.each(data, function(index, emp) {
				//employeeMap[emp.id] = emp.username;

				employeeSelect.append(
					`<option value="${emp.EmpId}">${emp.EmpCode}</option>`
				);
			});
		},

		error: function(xhr, status, error) {
			console.error("Load Employees Error:", error);
			alert("Failed to load employees");
		}
	});
}



function loadModalTypes() {

	return $.ajax({
		url: new URL("/api/type_selection/mapping", baseUrl).toString(),
		type: "GET",
		contentType: "application/json",
		xhrFields: { withCredentials: true },

		success: function(data) {

			let modalSelect = $("#modalSelection");
			modalSelect.empty();

			modalSelect.append(`<option value="">-- Select Modal --</option>`);

			typeMap = {}; // ✅ build map here

			$.each(data, function(index, type) {
				typeMap[type.typeId] = type.typeName;

				modalSelect.append(
					`<option value="${type.typeId}">${type.typeName}</option>`
				);
			});
		},

		error: function(xhr, status, error) {
			console.error("Load Modal Types Error:", error);
			alert("Failed to load modal types");
		}
	});
}


let pendingStatusChange = {
    id: null,
    checkbox: null,
    newStatus: null,
    oldStatus: null
};


$(document).on("change", ".status-checkbox", function () {

    const checkbox = $(this);
    const id = checkbox.data("id");

    const oldStatus = checkbox.data("status"); // 0 or 1 (saved state)
    const newStatus = checkbox.is(":checked") ? 1 : 0;

    // Store change
    pendingStatusChange = {
        id: id,
        checkbox: checkbox,
        newStatus: newStatus,
        oldStatus: oldStatus
    };

	
	
	const allowed = allowedActions || [];

	if (!allowed.includes("Status")) {
	  alert(" You do not have permission to Status.");
	  $('#exampleModalScrollable123').modal('hide');
	  return;
	}
	
	
    // Show confirmation modal
    $("#confirmStatusModal").modal({
        backdrop: "static", // prevent outside click
        keyboard: false     // prevent ESC close
    });
});

$("#confirmStatus").click(function () {

    $("#confirmStatusModal").modal("hide");

    // Call backend
    updateModalAssignStatus(
        pendingStatusChange.id,
        pendingStatusChange.newStatus
    );

    // Update stored status AFTER confirmation
    pendingStatusChange.checkbox.data(
        "status",
        pendingStatusChange.newStatus
    );

    // Clear pending
    resetPendingStatus();
});




$("#confirmStatusModal").on("hidden.bs.modal", function () {

    if (pendingStatusChange.checkbox) {

        // Revert checkbox to original state
        const shouldBeChecked = pendingStatusChange.oldStatus === 1;

        pendingStatusChange.checkbox
            .prop("checked", shouldBeChecked);
    }

    resetPendingStatus();
});


function resetPendingStatus() {
    pendingStatusChange = {
        id: null,
        checkbox: null,
        newStatus: null,
        oldStatus: null
    };
}


function fetchModalAssign() {

	$.ajax({
		url: new URL("/api/modalassign/getAll", baseUrl).toString(),
		type: "GET",
		xhrFields: { withCredentials: true },

		success: function(data) {

			let tbody = $("#modalassignTableID tbody");
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

				let employeeName = employeeMap[item.userId]
					? employeeMap[item.userId]
					: "N/A";

				let typeName = typeMap[item.typeId]
					? typeMap[item.typeId]
					: "N/A";

					
					
					const isChecked = item.status === 1 ? "checked" : "";
				//	const isChecked = item.status === 1 ? "checked" : "";

					const editDisabled = item.status === 1;

					const editIcon = editDisabled
					    ? `<i class="fa fa-pen text-muted"
					           title="Status is InActivated ,Edit it disable"
					           style="cursor:not-allowed; opacity:0.5;"></i>`
					    : `<i class="fa fa-pen text-muted cursor-pointer"
					           title="Edit"
					           onclick="editModalAssign(${item.id})"></i>`;

					
				tbody.append(`
	                    <tr>
	                        <td>${index + 1}</td>
	                        <td>${employeeName}</td>
	                        <td>${typeName}</td>
							<td>
							    ${editIcon}
							</td>
							<td class="text-center">
							<input type="checkbox"
												       class="status-checkbox"
												       data-id="${item.id}"
												       data-status="${item.status}"
												       ${isChecked}>

							    </td>
	                    </tr>
	                `);
			});

			// 🔁 DataTable reinitialization (EXACT MATCH)
			if ($.fn.DataTable.isDataTable('#modalassignTableID')) {
				$('#modalassignTableID').DataTable().destroy();
			}

			$('#modalassignTableID').DataTable({
				dom: '<"d-flex justify-content-between mb-2"Bf>rtip',
				buttons: [
					{
						extend: 'excelHtml5',
						text: 'Export to Excel',
						className: 'btn btn-primary btn-sm',
						filename: 'Modal_Assign_Report',
						title: 'Modal Assignment Report'
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
			console.error("Fetch Modal Assign Error:", error);
			alert("Failed to load Modal Assignment data");
		}
	});
}



$("#createmodalassign").click(function() {

	let employeeId = $("#employeeSelection").val();
	//let employe_code = $("#employeeCodeSelection").val();
	let typeId = $("#modalSelection").val();

	let isValid = true;

	if (!employeeId) {
		$("#employeeSelectionError").show();
		isValid = false;
	} else {
		$("#employeeSelectionError").hide();
	}

	if (!typeId) {
		$("#modalSelectionError").show();
		isValid = false;
	} else {
		$("#modalSelectionError").hide();
	}

/*	if (!employe_code) {
			$("#employeeCodeSelectionError").show();
			isValid = false;
		}
		else {
			$("#employeeCodeSelectionError").hide();
		}*/

	if (!isValid) {
		return;
	}

	$("#confimationassignmodal").modal("show");
});

$("#confirmmodalassign").click(function() {
	$("#confimationassignmodal").modal("hide");
	handleModalAssignCreation();
});
function handleModalAssignCreation() {

	let userId = $("#employeeSelection").val();
	let typeId = $("#modalSelection").val();

	$.ajax({
		url: new URL(
			`/api/modalassign/check/user-type?userId=${encodeURIComponent(userId)}&typeId=${encodeURIComponent(typeId)}`,
			baseUrl
		).toString(),
		type: "GET",
		xhrFields: { withCredentials: true },

		success: function(response) {

			// expecting: { exists : true/false }
			if (response.exists === true) {
				$("#duplicateModalAssign").modal("show");
			} else {
				insertModalAssign();
			}
		},

		error: function(xhr, status, error) {
			console.error("Modal Assign Duplicate Check Error:", error);
			alert("Error while checking user assignment");
		}
	});
}
function insertModalAssign() {

	let currentDateTime = getIndianDateTimeFormat(new Date());
	//let emp_code = $("#employeeCodeSelection").val();
	
	//console.log("this is modal assign what ths employee code is this ",emp_code);

	let requestData = {
		userId: $("#employeeSelection").val(),
		typeId: $("#modalSelection").val(),
		status: 0,
		
		createdBy: sessionStorage.getItem("id"),
		createdDate: currentDateTime
		
	};

	$.ajax({
		url: new URL("/api/modalassign", baseUrl).toString(),
		type: "POST",
		contentType: "application/json",
		data: JSON.stringify(requestData),
		xhrFields: { withCredentials: true },

		success: function() {
			$("#exampleModalScrollablemodalAssign").modal("hide");
			//alert("insertedss")
		showPopup("Modal Assigned Successfully", "DrawingMasterRegister.jsp");
		},

		error: function(xhr, status, error) {
			console.error("Insert Modal Assign Error:", error);
			alert("Failed to assign modal");
		}
	});
}




let originalAssignUserId = null;
let originalAssignTypeId = null;


function editModalAssign(id) {
	
	

	const allowed = allowedActions || [];

	if (!allowed.includes("Edit")) {
	  alert(" You do not have permission to Edit.");
	  
	  return;
	}


	$.ajax({
		url: new URL(`/api/modalassign/get/${id}`, baseUrl).toString(),
		type: "GET",
		xhrFields: { withCredentials: true },

		success: function(response) {

			// store id for update
			$("#updatemodalassign").data("assignId", response.id);

			// store originals for no-change check
			originalAssignUserId = response.userId;
			originalAssignTypeId = response.typeId;

			// populate employee dropdown (readonly)
			populateEmployeeDropdownUp(response.userId);

			// populate modal type dropdown
			populateModalTypeDropdownUp(response.typeId);

			// hide errors
			$("#employeeSelectionUpError").hide();
			$("#modalSelectionUpError").hide();

			// open modal
			$("#exampleModalScrollablemodalAssignUp").modal("show");
		},

		error: function(xhr, status, error) {
			console.error("Fetch Modal Assign Error:", error);
			alert("Failed to fetch Modal Assignment details");
		}
	});
}


function populateEmployeeDropdownUp(selectedUserId) {

	let select = $("#employeeSelectionUp");
	select.empty();

	$.each(employeeMap, function(id, name) {
		select.append(
			`<option value="${id}">${name}</option>`
		);
	});

	select.val(selectedUserId);

	// make readonly
	select.prop("disabled", true);
}


function populateModalTypeDropdownUp(selectedTypeId) {

	let select = $("#modalSelectionUp");
	select.empty();

	select.append(`<option value="">-- Select Modal --</option>`);

	$.each(typeMap, function(id, name) {
		select.append(
			`<option value="${id}">${name}</option>`
		);
	});

	select.val(selectedTypeId);
}
$("#updatemodalassign").click(function() {

	let typeId = $("#modalSelectionUp").val();
	let employee_code_up = $("#employeeCodeSelectionUp").val();

	let isValid = true;

	if (!typeId) {
		$("#modalSelectionUpError").show();
		isValid = false;
	} else {
		$("#modalSelectionUpError").hide();
	}

	/*	if(!employee_code_up){
			$("#employeeCodeSelectionUpError").show();
			isValid = false;
			
		}
		else {
			$("#employeeCodeSelectionUpError").hide();
		}*/


	if (!isValid) return;

	$("#confimationupdatemodalassign").modal("show");
});

$("#confirmmodalUp").click(function() {

	$("#confimationupdatemodalassign").modal("hide");

	let userId = originalAssignUserId; // employee is readonly
	let newTypeId = $("#modalSelectionUp").val();

	// 1️⃣ No change check
	if (newTypeId == originalAssignTypeId) {
		showPopup("No Feilds Changes ", "DrawingMasterRegister.jsp");
		return;
	}

	// 2️⃣ Duplicate check (same as INSERT)
	$.ajax({
		url: new URL(
			`/api/modalassign/check/user-type?userId=${encodeURIComponent(userId)}&typeId=${encodeURIComponent(newTypeId)}`,
			baseUrl
		).toString(),
		type: "GET",
		xhrFields: { withCredentials: true },

		success: function(response) {
			if (response.exists === true) {
				// user already assigned to this modal
				$("#duplicateModalAssign").modal("show");
			} else {
				// safe to update
				updateModalAssign();
			}
		},

		error: function() {
			alert("Error while checking duplicate assignment");
		}
	});
});

function updateModalAssign() {

	let assignId = $("#updatemodalassign").data("assignId");
	let userId = originalAssignUserId;
	let requestData = {
		typeId: $("#modalSelectionUp").val(),
		userId:userId,
		modifiedBy: sessionStorage.getItem("id"),
		modifiedDate: getIndianDateTimeFormat(new Date())
	};

	$.ajax({
		url: new URL(`/api/modalassign/modify/${assignId}`, baseUrl).toString(),
		type: "PUT",
		contentType: "application/json",
		data: JSON.stringify(requestData),
		xhrFields: { withCredentials: true },

		success: function() {
			$("#exampleModalScrollablemodalAssignUp").modal("hide");
			fetchModalAssign();
		showPopup("Modal Assignment updated successfully", "DrawingMasterRegister.jsp");
			
			//alert("the modal Assign is successfully Updated");
		},

		error: function(xhr) {

			console.error("Update Modal Assign Error:", xhr);

			if (xhr.status === 409) {

				$("#duplicateActivityMessage1")
					.text(xhr.responseText || "The Transaction already exists for this User");

				$("#duplicateModalAssign").modal("show");

			} else {

				alert(xhr.responseText || "Failed to update Modal Assignment");
			}
		}
	});
}

// This update method only handled the the status Updated

function updateModalAssignStatus(id, status) {

    let requestData = {
        status: status,
        modifiedBy: sessionStorage.getItem("id"),
        modifiedDate: getIndianDateTimeFormat(new Date())
    };

    $.ajax({
        url: new URL(`/api/modalassign/modify/${id}`, baseUrl).toString(),
        type: "PUT",
        contentType: "application/json",
        xhrFields: { withCredentials: true },
        data: JSON.stringify(requestData),

        success: function () {
           showPopup("Modal Assign Status is Changed","DrawingMasterRegister.jsp");
        },

        error: function (xhr) {
            console.error(" Status update failed", xhr);
            alert("Failed to update status");
        }
    });
}




/* From here Reason Master Will Begin*/

$("#createreason").click(function() {

	let reasonName = $("#reason").val().trim();

	if (!reasonName) {
		$("#reasonError").show();
		return;
	} else {
		$("#reasonError").hide();
	}

	$("#confimationreasonmodal").modal("show");
});

$("#confirmreason").click(function() {
	$("#confimationreasonmodal").modal("hide");
	handleReasonCreation();
});


function handleReasonCreation() {

	let reasonName = $("#reason").val().trim();

	$.ajax({
		url: new URL(
			`/api/reason_selection/check/reason?reasonName=${encodeURIComponent(reasonName)}`,
			baseUrl
		).toString(),
		type: "GET",
		xhrFields: { withCredentials: true },

		success: function(response) {
			if (response.exists === true) {
				$("#duplicateReasonModal").modal("show");
			} else {
				insertReasonSelection(reasonName);
			}
		},

		error: function() {
			alert("Error while checking Reason");
		}
	});
}

function insertReasonSelection(reasonName) {

	let requestData = {
		reasonName: reasonName,
		createdBy: sessionStorage.getItem("id"),
		createdDate: getIndianDateTimeFormat(new Date()),
		status: 0
	};

	$.ajax({
		url: new URL("/api/reason_selection", baseUrl).toString(),
		type: "POST",
		contentType: "application/json",
		data: JSON.stringify(requestData),
		xhrFields: { withCredentials: true },

		success: function() {
			showPopup("Reason created successfully", "DrawingMasterRegister.jsp");
		},

		error: function() {
			alert("Failed to insert Reason");
		}
	});
}


let originalReasonName = "";
let selectedReasonId = null;

function editReason(reasonId) {
	

	const allowed = allowedActions || [];

	if (!allowed.includes("Edit")) {
	  alert(" You do not have permission to Edit.");
	  
	  return;
	}


	selectedReasonId = reasonId;

	$.ajax({
		url: new URL(`/api/reason_selection/get/${reasonId}`, baseUrl).toString(),
		type: "GET",
		xhrFields: { withCredentials: true },

		success: function(response) {
			$("#reasonUp").val(response.reasonName);
			originalReasonName = response.reasonName;

			$("#exampleModalScrollablesreasonUp").modal("show");
		},

		error: function() {
			alert("Failed to load Reason");
		}
	});
}
$("#exampleModalScrollablesreasonUp").on("shown.bs.modal", function() {
	$("#reasonUpError").hide();
});

$("#createreasonUp").click(function() {

	let reasonUp = $("#reasonUp").val().trim();

	if (!reasonUp) {
		$("#reasonUpError").show();
		return;
	} else {
		$("#reasonUpError").hide();
	}

	$("#confimationupdatereasonmodal").modal("show");
});

$("#confirmreasonUp").click(function() {

	let newReasonName = $("#reasonUp").val().trim();

	$("#confimationupdatereasonmodal").modal("hide");

	if (newReasonName === originalReasonName) {
		showPopup("No Feilds Changes ", "DrawingMasterRegister.jsp");
		return;
	}

	checkDuplicateReasonForUpdate(newReasonName);
});

function checkDuplicateReasonForUpdate(reasonName) {

	$.ajax({
		url: new URL(
			`/api/reason_selection/check/reason?reasonName=${encodeURIComponent(reasonName)}`,
			baseUrl
		).toString(),
		type: "GET",
		xhrFields: { withCredentials: true },

		success: function(response) {
			if (response.exists) {
				$("#duplicateReasonModal").modal("show");
			} else {
				updateReasonSelection(reasonName);
			}
		},

		error: function() {
			alert("Error while checking duplicate Reason");
		}
	});
}

function updateReasonSelection(reasonName) {

	let requestData = {
		reasonName: reasonName,
		modifiedBy: sessionStorage.getItem("id"),
		modifiedDate: getIndianDateTimeFormat(new Date())
	};

	$.ajax({
		url: new URL(
			`/api/reason_selection/modified/${selectedReasonId}`,
			baseUrl
		).toString(),
		type: "PUT",
		contentType: "application/json",
		data: JSON.stringify(requestData),
		xhrFields: { withCredentials: true },

		success: function() {
			showPopup("Reason updated successfully", "DrawingMasterRegister.jsp");
		},

		error: function(xhr) {

			if (xhr.status === 409) {

				$("#duplicateReasonMessage")
					.text(xhr.responseText || "The Transaction already exists for this Reason");

				$("#duplicateReasonModal").modal("show");

			} else {

				alert(xhr.responseText || "Failed to update Reason");
			}
		}
	});
}

function fetchReason() {

	$.ajax({
		url: new URL("/api/reason_selection/getAll", baseUrl).toString(),
		type: "GET",
		xhrFields: { withCredentials: true },

		success: function(data) {

			let tbody = $("#reasonselectiontableID tbody");
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
	                        <td>${item.reasonName}</td>
	                        <td class="text-center">
	                            <i class="fa fa-pen text-muted cursor-pointer"
	                               title="Edit"
	                               onclick="editReason(${item.reasonId})"></i>
	                        </td>
	                    </tr>
	                `);
			});

			// 🔁 DataTable reinitialization (same pattern)
			if ($.fn.DataTable.isDataTable('#reasonselectiontableID')) {
				$('#reasonselectiontableID').DataTable().destroy();
			}

			$('#reasonselectiontableID').DataTable({
				dom: '<"d-flex justify-content-between mb-2"Bf>rtip',
				buttons: [
					{
						extend: 'excelHtml5',
						text: 'Export to Excel',
						className: 'btn btn-primary btn-sm',
						filename: 'Reason_Master_Report',
						title: 'Reason Master Report'
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
			console.error("Fetch Reason Error:", error);
			alert("Failed to load Reason data");
		}
	});
}




/* From here Drawing Stage Master Will Begin */
// clear the create modal every time it opens
$("#exampleModalScrollableStage").on("shown.bs.modal", function() {
	$("#stage").val("").focus();
	$("#stageError").hide();
});

$("#createstage").click(function() {

	let stageName = $("#stage").val().trim();

	if (!stageName) {
		$("#stageError").show();
		return;
	} else {
		$("#stageError").hide();
	}

	$("#confimationstagemodal").modal("show");
});

$("#confirmstage").click(function() {
	$("#confimationstagemodal").modal("hide");
	handleStageCreation();
});


function handleStageCreation() {

	let stageName = $("#stage").val().trim();

	$.ajax({
		url: new URL(
			`/api/drawing_stage/check/stage?stageName=${encodeURIComponent(stageName)}`,
			baseUrl
		).toString(),
		type: "GET",
		xhrFields: { withCredentials: true },

		success: function(response) {
			if (response.exists === true) {
				$("#duplicateStageMessage").text("Stage already exists.");
				$("#duplicateStageModal").modal("show");
			} else {
				insertStage(stageName);
			}
		},

		error: function() {
			alert("Error while checking Stage");
		}
	});
}

function insertStage(stageName) {

	let requestData = {
		stageName: stageName,
		createdBy: sessionStorage.getItem("id"),
		createdDate: getIndianDateTimeFormat(new Date())
	};

	$.ajax({
		url: new URL("/api/drawing_stage", baseUrl).toString(),
		type: "POST",
		contentType: "application/json",
		data: JSON.stringify(requestData),
		xhrFields: { withCredentials: true },

		success: function() {
			// so the page reopens on the Drawing Stages radio after reload
			localStorage.setItem("selectedAssetRadio", "DrawingStagesRadio");
			showPopup("Stage created successfully", "DrawingMasterRegister.jsp");
		},

		error: function(xhr) {
			if (xhr.status === 409) {
				$("#duplicateStageMessage").text(xhr.responseText || "Stage already exists.");
				$("#duplicateStageModal").modal("show");
			} else {
				alert(xhr.responseText || "Failed to insert Stage");
			}
		}
	});
}


let originalStageName = "";
let selectedStageId = null;

function editStage(stageId) {

	const allowed = allowedActions || [];

	if (!allowed.includes("Edit")) {
		alert(" You do not have permission to Edit.");
		return;
	}

	selectedStageId = stageId;

	$.ajax({
		url: new URL(`/api/drawing_stage/get/${stageId}`, baseUrl).toString(),
		type: "GET",
		xhrFields: { withCredentials: true },

		success: function(response) {
			$("#stageUp").val(response.stageName);
			originalStageName = response.stageName;

			$("#exampleModalScrollableStageUp").modal("show");
		},

		error: function() {
			alert("Failed to load Stage");
		}
	});
}

$("#exampleModalScrollableStageUp").on("shown.bs.modal", function() {
	$("#stageUpError").hide();
});

$("#createstageUp").click(function() {

	let stageUp = $("#stageUp").val().trim();

	if (!stageUp) {
		$("#stageUpError").show();
		return;
	} else {
		$("#stageUpError").hide();
	}

	$("#confimationupdatestagemodal").modal("show");
});

$("#confirmstageUp").click(function() {

	let newStageName = $("#stageUp").val().trim();

	$("#confimationupdatestagemodal").modal("hide");

	if (newStageName === originalStageName) {
		localStorage.setItem("selectedAssetRadio", "DrawingStagesRadio");
		showPopup("No Fields Changed", "DrawingMasterRegister.jsp");
		return;
	}

	checkDuplicateStageForUpdate(newStageName);
});

function checkDuplicateStageForUpdate(stageName) {

	$.ajax({
		url: new URL(
			`/api/drawing_stage/check/stage?stageName=${encodeURIComponent(stageName)}`,
			baseUrl
		).toString(),
		type: "GET",
		xhrFields: { withCredentials: true },

		success: function(response) {
			if (response.exists) {
				$("#duplicateStageMessage").text("Stage already exists.");
				$("#duplicateStageModal").modal("show");
			} else {
				updateStage(stageName);
			}
		},

		error: function() {
			alert("Error while checking duplicate Stage");
		}
	});
}

function updateStage(stageName) {

	let requestData = {
		stageName: stageName,
		modifiedBy: sessionStorage.getItem("id"),
		modifiedDate: getIndianDateTimeFormat(new Date())
	};

	$.ajax({
		url: new URL(`/api/drawing_stage/modified/${selectedStageId}`, baseUrl).toString(),
		type: "PUT",
		contentType: "application/json",
		data: JSON.stringify(requestData),
		xhrFields: { withCredentials: true },

		success: function() {
			localStorage.setItem("selectedAssetRadio", "DrawingStagesRadio");
			showPopup("Stage updated successfully", "DrawingMasterRegister.jsp");
		},

		error: function(xhr) {
			if (xhr.status === 409) {
				$("#duplicateStageMessage").text(xhr.responseText || "Stage already exists.");
				$("#duplicateStageModal").modal("show");
			} else {
				alert(xhr.responseText || "Failed to update Stage");
			}
		}
	});
}

function escapeStageHtml(text) {
	return $("<div>").text(text == null ? "" : text).html();
}

function fetchStage() {

	$.ajax({
		url: new URL("/api/drawing_stage/getAll", baseUrl).toString(),
		type: "GET",
		xhrFields: { withCredentials: true },

		success: function(data) {

			if ($.fn.DataTable.isDataTable('#modalstageTableID')) {
				$('#modalstageTableID').DataTable().destroy();
			}

			let tbody = $("#modalStagesBody");
			tbody.empty();

			// 204 No Content -> data is undefined
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
						<td>${escapeStageHtml(item.stageName)}</td>
						<td class="text-center">
							<i class="fa fa-pen text-muted cursor-pointer"
							   title="Edit"
							   onclick="editStage(${item.stageId})"></i>
						</td>
					</tr>
				`);
			});

			$('#modalstageTableID').DataTable({
				dom: '<"d-flex justify-content-between mb-2"Bf>rtip',
				buttons: [
					{
						extend: 'excelHtml5',
						text: 'Export to Excel',
						className: 'btn btn-primary btn-sm',
						filename: 'Drawing_Stage_Report',
						title: 'Drawing Stage Report'
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
			console.error("Fetch Stage Error:", error);
			alert("Failed to load Stage data");
		}
	});
}

//Type Selection Stage Type Starts form here

let typeStageTypeMap = {};
let typeStageStageMap = {};
let typeStageStageList = [];
let typeStageRecords = [];                       // all rows from /api/selection_stage/getAll
const TYPE_STAGE_ALLOWED_TYPES = [1, 2, 3];      // only Modular, Editor, Checker
const TYPE_STAGE_RADIO = "TypeSelectionStageRadio"; // <-- put your radio id here

function escapeTypeStageHtml(text) {
	return $("<div>").text(text == null ? "" : text).html();
}

function fillTypeStageSelect(selector, items, valueKey, textKey) {
	let select = $(selector);
	select.empty().append('<option value="">-- Select --</option>');
	$.each(items, function(i, item) {
		select.append($("<option>").val(item[valueKey]).text(item[textKey]));
	});
}

// ---------- checkbox helpers ----------
// lockAssigned = true  -> assigned stages ticked + disabled (create modal)
// lockAssigned = false -> assigned stages ticked but editable (update modal)
function renderTypeStageChecks(container, cls, assignedIds, lockAssigned = true) {

	let box = $(container).empty();

	if (!typeStageStageList.length) {
		box.append('<span class="text-muted">No stages available</span>');
		return;
	}

	$.each(typeStageStageList, function(i, s) {
		let assigned = assignedIds.includes(s.stageId);
		let locked = assigned && lockAssigned;
		box.append(`
			<div class="form-check">
				<input class="form-check-input ${cls}" type="checkbox"
					id="${cls}_${s.stageId}" value="${s.stageId}"
					${assigned ? "checked" : ""} ${locked ? "disabled" : ""}>
				<label class="form-check-label" for="${cls}_${s.stageId}">
					${escapeTypeStageHtml(s.stageName)}
					${locked ? '<small class="text-muted">(assigned)</small>' : ""}
				</label>
			</div>
		`);
	});
}

// only the newly ticked ones (disabled = already saved)
function getSelectedTypeStageIds(cls) {
	return $("." + cls + ":checked:not(:disabled)").map(function() {
		return parseInt($(this).val());
	}).get();
}

// every ticked box (update modal, nothing is disabled there)
function getAllCheckedTypeStageIds(cls) {
	return $("." + cls + ":checked").map(function() {
		return parseInt($(this).val());
	}).get();
}

function getAssignedStageIds(typeId) {
	return typeStageRecords
		.filter(function(r) { return r.typeId === typeId; })
		.map(function(r) { return r.stageId; });
}

// ---------- lookups (Type dropdown + Stage checkboxes) ----------
function loadTypeStageLookups() {

	let typeReq = $.ajax({
		url: new URL("/api/type_selection/getAll", baseUrl).toString(),
		type: "GET",
		xhrFields: { withCredentials: true }
	});

	let stageReq = $.ajax({
		url: new URL("/api/drawing_stage/getAll", baseUrl).toString(),
		type: "GET",
		xhrFields: { withCredentials: true }
	});

	return $.when(typeReq, stageReq).done(function(typeRes, stageRes) {

		let types = typeRes[0] || [];
		let stages = stageRes[0] || [];

		typeStageTypeMap = {};
		$.each(types, function(i, t) { typeStageTypeMap[t.typeId] = t.typeName; });

		typeStageStageMap = {};
		$.each(stages, function(i, s) { typeStageStageMap[s.stageId] = s.stageName; });
		typeStageStageList = stages;

		// dropdown shows only typeId 1, 2, 3
		let allowedTypes = types.filter(function(t) {
			return TYPE_STAGE_ALLOWED_TYPES.includes(t.typeId);
		});

		fillTypeStageSelect("#typeStageCreateType", allowedTypes, "typeId", "typeName");
		fillTypeStageSelect("#typeStageUpdateType", allowedTypes, "typeId", "typeName");

		renderTypeStageChecks("#typeStageCreateStageList", "typeStageCreateChk", []);
		renderTypeStageChecks("#typeStageUpdateStageList", "typeStageUpdateChk", []);

	}).fail(function() {
		alert("Failed to load Type / Stage data");
	});
}

// ---------- create ----------
$("#btnCreateTypeStage").click(function() {
	$("#typeStageCreateModal").modal("show");
});

// clear the create modal every time it opens
$("#typeStageCreateModal").on("shown.bs.modal", function() {
	$("#typeStageCreateType").val("").focus();
	renderTypeStageChecks("#typeStageCreateStageList", "typeStageCreateChk", []);
	$("#typeStageCreateTypeError").hide();
	$("#typeStageCreateStageError").hide();
});

// when a type is picked, stages it already has are shown ticked + disabled
$("#typeStageCreateType").on("change", function() {
	let typeId = parseInt($(this).val());
	let assigned = isNaN(typeId) ? [] : getAssignedStageIds(typeId);
	renderTypeStageChecks("#typeStageCreateStageList", "typeStageCreateChk", assigned);
});

$("#btnSaveTypeStage").click(function() {

	let typeId = $("#typeStageCreateType").val();
	let stageIds = getSelectedTypeStageIds("typeStageCreateChk");
	let valid = true;

	if (!typeId) {
		$("#typeStageCreateTypeError").show();
		valid = false;
	} else {
		$("#typeStageCreateTypeError").hide();
	}

	if (stageIds.length === 0) {
		$("#typeStageCreateStageError").show();
		valid = false;
	} else {
		$("#typeStageCreateStageError").hide();
	}

	if (!valid) return;

	$("#typeStageCreateConfirmModal").modal("show");
});

$("#btnConfirmTypeStageCreate").click(function() {

	$("#typeStageCreateConfirmModal").modal("hide");

	let typeId = parseInt($("#typeStageCreateType").val());
	let stageIds = getSelectedTypeStageIds("typeStageCreateChk");

	insertTypeStages(typeId, stageIds, "Type Selection for Stage created successfully");
});

// one POST per ticked stage (backend still stores one record per type + stage)
function insertTypeStages(typeId, stageIds, successMessage) {

	let createdBy = sessionStorage.getItem("id");
	let createdDate = getIndianDateTimeFormat(new Date());

	let requests = stageIds.map(function(stageId) {
		return $.ajax({
			url: new URL("/api/selection_stage", baseUrl).toString(),
			type: "POST",
			contentType: "application/json",
			data: JSON.stringify({
				typeId: typeId,
				stageId: stageId,
				createdBy: createdBy,
				createdDate: createdDate
			}),
			xhrFields: { withCredentials: true }
		});
	});

	$.when.apply($, requests)
		.done(function() {
			// so the page reopens on this radio after reload
			localStorage.setItem("selectedAssetRadio", TYPE_STAGE_RADIO);
			showPopup(successMessage, "DrawingMasterRegister.jsp");
		})
		.fail(function(xhr) {
			if (xhr.status === 409) {
				$("#typeStageDuplicateMessage").text("This Type-Selection for Stage already exists.");
				$("#typeStageDuplicateModal").modal("show");
			} else {
				alert(xhr.responseText || "Failed to save Type Selection for Stage");
			}
		});
}

// ---------- update (add / remove stages for a type) ----------
let selectedTypeStageTypeId = null;
let originalTypeStageIds = [];

// ---------- locking helpers ----------

// stageIds already used in phase entries
function fetchUsedStageIds(contractId) {
	return $.ajax({
		url: "http://localhost:8004/api/contracts/getPhaseEntries?contractId=" + contractId,
		type: "GET"
	}).then(function (entries) {
		return new Set((entries || []).map(e => Number(e.stageId)));
	});
}

// master rows: [{selectionStageId, typeId, stageId, ...}]
function fetchSelectionStageMaster() {
	return $.ajax({
		url: "http://localhost:8004/api/selection_stage/getAll",
		type: "GET"
	});
}

// Returns { lockedStageIds:Set, lockedTypeIds:Set }
async function computeLocks(contractId) {
	const [usedStageIds, master] = await Promise.all([
		fetchUsedStageIds(contractId),
		fetchSelectionStageMaster()
	]);

	const lockedStageIds = new Set();
	const lockedTypeIds = new Set();

	(master || []).forEach(m => {
		if (usedStageIds.has(Number(m.stageId))) {
			lockedStageIds.add(Number(m.stageId));
			lockedTypeIds.add(Number(m.typeId));   // type assigned to a locked stage is locked too
		}
	});

	return { lockedStageIds, lockedTypeIds };
}

// ---------- edit ----------

async function editTypeStage(typeId) {

	const allowed = allowedActions || [];
	if (!allowed.includes("Edit")) {
		alert(" You do not have permission to Edit.");
		return;
	}

	selectedTypeStageTypeId = typeId;
	originalTypeStageIds = getAssignedStageIds(typeId);

	$("#typeStageUpdateType").val(String(typeId)).prop("disabled", true);
	renderTypeStageChecks("#typeStageUpdateStageList", "typeStageUpdateChk", originalTypeStageIds, false);

	try {
		// contractId: use whatever your page holds (e.g. selected contract)
		const contractId = $("#contractSelect").val() || 80;
		const { lockedStageIds, lockedTypeIds } = await computeLocks(contractId);

		// lock stage checkboxes that are used in entries
		$("#typeStageUpdateStageList input[type='checkbox']").each(function () {
			const stageId = Number($(this).val());
			if (lockedStageIds.has(stageId) && originalTypeStageIds.map(Number).includes(stageId)) {
				$(this).prop("checked", true)      // stays assigned
				       .prop("disabled", true)     // cannot be unticked
				       .attr("title", "Locked: already used in phase entries")
				       .closest("label, div").addClass("text-muted");
			} else {
				$(this).prop("disabled", false);   // free to edit
			}
		});

		// lock the type itself if it has any locked stage
		const typeLocked = lockedTypeIds.has(Number(typeId));
		$("#typeStageUpdateType").prop("disabled", true);          // already fixed in edit
		$("#typeStageUpdateModal").data("typeLocked", typeLocked);
		$("#typeStageTypeLockMsg").toggle(typeLocked);             // optional <small id="typeStageTypeLockMsg">
	} catch (err) {
		console.error("Lock check failed", err);
	}

	$("#typeStageUpdateModal").modal("show");
}

// ---------- delete guard (lock the type in the master) ----------

async function deleteTypeStage(typeId) {
	const contractId = $("#contractSelect").val() || 80;
	const { lockedTypeIds } = await computeLocks(contractId);

	if (lockedTypeIds.has(Number(typeId))) {
		alert("This type is locked because one of its stages is used in phase entries.");
		return;
	}
	// ...your existing delete logic
}

$("#typeStageUpdateModal").on("shown.bs.modal", function() {
	$("#typeStageUpdateTypeError").hide();
	$("#typeStageUpdateStageError").hide();
});

$("#btnUpdateTypeStage").click(function() {
	$("#typeStageUpdateConfirmModal").modal("show");
});

$("#btnConfirmTypeStageUpdate").click(function() {

	$("#typeStageUpdateConfirmModal").modal("hide");

	let current = getAllCheckedTypeStageIds("typeStageUpdateChk");
	let toAdd = current.filter(function(id) { return !originalTypeStageIds.includes(id); });
	let toRemove = originalTypeStageIds.filter(function(id) { return !current.includes(id); });

	if (toAdd.length === 0 && toRemove.length === 0) {
		localStorage.setItem("selectedAssetRadio", TYPE_STAGE_RADIO);
		showPopup("No Fields Changed", "DrawingMasterRegister.jsp");
		return;
	}

	if (current.length === 0) {
		alert("A type must have at least one stage.");
		return;
	}

	syncTypeStages(selectedTypeStageTypeId, toAdd, toRemove);
});

function syncTypeStages(typeId, toAdd, toRemove) {

	let userId = sessionStorage.getItem("id");
	let now = getIndianDateTimeFormat(new Date());
	let requests = [];

	toAdd.forEach(function(stageId) {
		requests.push($.ajax({
			url: new URL("/api/selection_stage", baseUrl).toString(),
			type: "POST",
			contentType: "application/json",
			data: JSON.stringify({ typeId: typeId, stageId: stageId, createdBy: userId, createdDate: now }),
			xhrFields: { withCredentials: true }
		}));
	});

	toRemove.forEach(function(stageId) {
		requests.push($.ajax({
			url: new URL(`/api/selection_stage/delete?typeId=${typeId}&stageId=${stageId}`, baseUrl).toString(),
			type: "DELETE",
			xhrFields: { withCredentials: true }
		}));
	});

	$.when.apply($, requests)
		.done(function() {
			localStorage.setItem("selectedAssetRadio", TYPE_STAGE_RADIO);
			showPopup("Type Selection for Stage updated successfully", "DrawingMasterRegister.jsp");
		})
		.fail(function(xhr) {
			alert(xhr.responseText || "Failed to update Type Selection for Stage");
		});
}
// ---------- table (one row per type, stages joined) ----------
function fetchTypeStage() {

	loadTypeStageLookups().done(function() {

		$.ajax({
			url: new URL("/api/selection_stage/getAll", baseUrl).toString(),
			type: "GET",
			xhrFields: { withCredentials: true },

			success: function(data) {

				typeStageRecords = data || [];

				if ($.fn.DataTable.isDataTable('#typeStageTable')) {
					$('#typeStageTable').DataTable().destroy();
				}

				let tbody = $("#typeStageTable tbody");
				tbody.empty();

				// 204 No Content -> data is undefined
				if (typeStageRecords.length === 0) {
					tbody.append(`
						<tr>
							<td colspan="4" class="text-center text-muted">
								No records found
							</td>
						</tr>
					`);
					return;
				}

				// group stages by type, keeping first-seen type order
				let groups = {};
				let typeOrder = [];
				$.each(typeStageRecords, function(i, item) {
					if (!groups[item.typeId]) {
						groups[item.typeId] = [];
						typeOrder.push(item.typeId);
					}
					groups[item.typeId].push(item.stageId);
				});

				$.each(typeOrder, function(index, typeId) {

					let stageNames = groups[typeId]
						.sort(function(a, b) { return a - b; })
						.map(function(id) { return typeStageStageMap[id]; })
						.join(", ");

					tbody.append(`
						<tr>
							<td>${index + 1}</td>
							<td>${escapeTypeStageHtml(typeStageTypeMap[typeId])}</td>
							<td>${escapeTypeStageHtml(stageNames)}</td>
							<td class="text-center">
								<i class="fa fa-pen text-muted cursor-pointer"
								   title="Edit"
								   onclick="editTypeStage(${typeId})"></i>
							</td>
						</tr>
					`);
				});

				$('#typeStageTable').DataTable({
					dom: '<"d-flex justify-content-between mb-2"Bf>rtip',
					buttons: [
						{
							extend: 'excelHtml5',
							text: 'Export to Excel',
							className: 'btn btn-primary btn-sm',
							filename: 'Drawing_Type_Selection_Stage_Report',
							title: 'Drawing Type Selection Stage Report',
							exportOptions: { columns: [0, 1, 2] }
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
				console.error("Fetch Type Selection Stage Error:", error);
				alert("Failed to load Type Selection for Stage data");
			}
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
	setTimeout(function() {
		popup.fadeOut(400, function() {
			$(this).remove();
			window.location = redirectUrl;
		});
	}, 2000);
}
