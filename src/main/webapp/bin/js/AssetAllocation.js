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

$(document).ready(function() {
	setAllocationDateLimits();
	setUpdateAllocationDateLimits();

	$('#table_ID1').DataTable({
		dom: '<"d-flex justify-content-between mb-2"Bf>rtp',  // 👈 added 'p' for pagination
		buttons: [
			{
				extend: 'excelHtml5',
				text: 'Export to Excel',
				className: 'btn btn-primary btn-sm',
				title: 'AMS_ALLOCATION_REPORT',
				filename: 'Asset_Allocation_Report'
			}
		],
		paging: true,       // 👈 enable pagination
		pageLength: 8,     // 👈 rows per page
		lengthMenu: [10, 25, 50, 100],  // 👈 dropdown options
		info: true,         // show page info like "Showing 1 to 10 of 50"
		searching: true,
		ordering: true
	});

	loadAssetNoDropdown().then(() => {
			fetchAssetData();

			// 🔥 ENABLE SEARCH FOR ALL SELECTS
			initUniversalSelect2();
		});
});

// ======================= GLOBAL VARIABLES =======================
let assetData = [];
let typeMap = {};
let modelMap = {};
let makeMap = {};
let contractMap = {};
let userMap = {};
let departmentMap = {};
let userListGlobal = [];
let selectedAssetDetails = null;
let selectedUpdateAssetDetails = null;
let assetNoMap = {};
let updatedAssetData = {};


$('#exampleModalScrollable123').on('shown.bs.modal', function () {
	initUniversalSelect2(this);
});


$('#exampleModalScrollableup123').on('shown.bs.modal', function () {
	initUniversalSelect2(this);
});
// ======================= LOAD LOOKUPS =======================
async function loadLookups() {
	const typeList = await fetch(`${baseUrl}/api/ams/getall`,{credentials:"include"}).then(res => res.json());
	typeList.forEach(t => typeMap[t.type_id] = t.assetType);

	const modelList = await fetch(`${baseUrl}/api/ams/model/getAll`,{credentials:"include"}).then(res => res.json());
	modelList.forEach(m => modelMap[m.model_id] = m.assetModel);

	const makeList = await fetch(`${baseUrl}/api/ams/maker/getAll`,{credentials:"include"}).then(res => res.json());
	makeList.forEach(mk => makeMap[mk.makeId] = mk.makeDescription);

	const contractList = await fetch(`${baseUrl}/api/contract/getAll`,{credentials:"include"}).then(res => res.json());
	contractList.forEach(c => contractMap[c.contractId] = `${c.jobCode} - ${c.cname}`);

	userListGlobal = await fetch(`${baseUrl}/api/user/getAll`,{credentials:"include"}).then(res => res.json());
	let allocatedDropdown = $("#Allocated_To");
	allocatedDropdown.empty()
	allocatedDropdown.html(`<option value="null">Select User</option>`);
	userListGlobal.forEach(u => {
		userMap[u.id] = u.userName;
		allocatedDropdown.append(`<option value="${u.id}">${u.userName}</option>`);
	});

	const deptList = await fetch(`${baseUrl}/api/dept/getAll`,{credentials:"include"}).then(res => res.json());
	deptList.forEach(d => departmentMap[d.deptId] = d.departmentName);
}

// ======================= LOAD ASSET NUMBERS =======================
async function loadAssetNoDropdown() {
	await loadLookups();

	try {
		// 🟢 Fetch available assets for dropdown
		const availableAssets = await fetch(`${baseUrl}/api/ams/entry/asset/available`,{credentials:"include"})
			.then(res => res.json());

		// 🟢 Fetch ALL assets to build full mapping (for table)
		const allAssets = await fetch(`${baseUrl}/api/ams/entry/getAll`,{credentials:"include"})
			.then(res => res.json());

		$("#Asset_No").empty()
		.html(`<option value=" ">Select Asset No</option>`);

		// 🔥 Filter ONLY assets with status = 1 (Active + Not allocated)
		const filteredAssets = availableAssets.filter(asset => asset.statusId === 1);

		// Save only filtered assets in global array
		assetData = filteredAssets;

		// 🟦 Fill dropdown using ONLY filtered assets
		filteredAssets.forEach(asset => {
			$("#Asset_No")
			.append(`<option value="${asset.assetenId}">${asset.assetNo}</option>`);
		});

		// 🟨 Build Asset Map from ALL assets (fixes blank in allocation table)
		allAssets.forEach(asset => {
			assetNoMap[Number(asset.assetenId)] = asset.assetNo;
		});

	} catch (error) {
		console.error("Error loading assets:", error);
	}
}


// ======================= AUTO DEPARTMENT ON USER CHANGE =======================



$(document).on("change", "#Allocated_To_up", function() {
	let selectedUserId = Number($(this).val());
	let user = userListGlobal.find(u => u.id === selectedUserId);
	$("#Department_up").val(user && user.department ? departmentMap[user.department] : "");
});

// ======================= ON CHANGE FILL FORM =======================
$("#Asset_No").on("change", function() {
	let selectedId = Number($(this).val());
	let asset = assetData.find(a => a.assetenId === selectedId);
	if (!asset) { clearForm(); return; }

	$("#Asset_Type").html(`<option>${typeMap[asset.typeId] || "---"}</option>`);
	$("#Asset_Model").html(`<option>${modelMap[asset.modelId] || "---"}</option>`);
	$("#Asset_Make").html(`<option>${makeMap[asset.makeId] || "---"}</option>`);
	$("#Contract_No").html(`<option>${contractMap[asset.contractId] || "---"}</option>`);

	$("#Asset_SrNo").val(asset.assetSrNo || "");
	$("#Purchase_Date").val(asset.purchaseDate || "");
	$("#Allocated_Qty").val(asset.qty || "1");
	$("#Allocated_To").val("");
	$("#Department").val("");
	$("#Allocated_Date").val("");
	$("#Expected_Return_Date").val("");
	$("#Remarks").val("");

	selectedAssetDetails = {
		assetId: asset.assetenId,
		assetNo: asset.assetNo,
		assetSerialNo: asset.assetSrNo,
		typeId: asset.typeId,
		modelId: asset.modelId,
		makeId: asset.makeId,
		contractId: asset.contractId,
		purchaseDate: asset.purchaseDate,
		qty: asset.qty,
		statusId: asset.statusId
	};
});

// ======================= CLEAR FORM =======================
function clearForm() {
	$("#Asset_Type, #Asset_Model, #Asset_Make, #Contract_No").html(`<option>select</option>`);
	$("#Asset_SrNo, #Purchase_Date").val("");
	$("#Allocated_Qty").val("1");
	$("#Allocated_To, #Department").val("");
	$("#Allocated_Date, #Expected_Return_Date, #Remarks").val("");
}

// ======================= SAVE INSERT =======================
$("#saveAssetBtn").click(function() {
	let assetNo = $("#Asset_No").val().trim();
	  // get selected asset number

	if (!assetNo) {
		$("#AssetNoError").show();      // show inline error
		return;                           // stop execution
	} else {
		$("#AssetNoError").hide();      // hide error if asset is selected
	}


	if (validationBefore()) {
		$("#exampleModalCenter205").modal("show");
	}
});




$("#confirmassetallocationyyes").click(function() {
	$("#exampleModalCenter205").modal("hide");
	insertAssetAllocation();
});

function insertAssetAllocation() {

	let payload = {
		...selectedAssetDetails,
		assetNo: $("#Asset_No").val(),
		allocatedTo: $("#Allocated_To").val(),
		department: $("#Department").val(),

		allocatedDate: appendTimeToDate($("#Allocated_Date").val()),
		expectedReturnDate: appendTimeToDate($("#Expected_Return_Date").val()),
		remarks: $("#Remarks").val(),
		createdBy:sessionStorage.getItem("id"),
		createdDate: getIndianDateTimeFormat(new Date()) // full current datetime
	};

	$.ajax({
		url: `${baseUrl}/api/ams/allocate`,
		type: "POST",
		contentType: "application/json",
		data: JSON.stringify(payload),
		xhrFields: { withCredentials: true },
		success: function() {
			showPopup("Inserted Data Successfully", "AssetAllocation.jsp");
			fetchAssetData();
		},
		error: function(xhr) {
			console.error("Insert failed:", xhr.responseText);
			alert("Failed to insert. Check console for details.");
		}
	});
}


// ======================= VALIDATION =======================
function validationBefore() {
	let isValid = true;

	const allocatedTo = $("#Allocated_To").val();
	const allocatedDate = $("#Allocated_Date").val();
	const expectedReturnDate = $("#Expected_Return_Date").val();


	console.log("allcatedTo", allocatedTo);
	
	// USER
	if (!allocatedTo || allocatedTo === "null") {
		$("#allocatedToError").show();
		isValid = false;
	} else {
		$("#allocatedToError").hide();
	}

	// ALLOCATED DATE
	if (!allocatedDate) {
		$("#allocatedDateError").show();
		isValid = false;
	} else {
		$("#allocatedDateError").hide();
	}

	// EXPECTED RETURN DATE
	if (!expectedReturnDate) {
		$("#excepteddateUpError")
			.text("Expected Return Date is required")
			.show();
		isValid = false;
	} else {
		$("#excepteddateUpError").hide();
	}

	// DATE COMPARISON
	if (
		allocatedDate &&
		expectedReturnDate &&
		new Date(allocatedDate) > new Date(expectedReturnDate)
	) {
		$("#excepteddateUpError")
			.text("Expected Return Date must be after Allocated Date")
			.show();
		isValid = false;
	}

	return isValid;
}

// ======================= FETCH & TABLE =======================
function fetchAssetData() {
	$.ajax({
		url: `${baseUrl}/api/ams/allocate/getactivedetail`,

		type: 'GET',
		dataType: 'json',
		xhrFields: { withCredentials: true },
		success: function(data) { populateTable(data); }
	});
}

function populateTable(data) {
	const table = $('#table_ID1').DataTable();
	table.clear();

	if (!data || data.length === 0) {
		table.row.add(['', 'No data available', '', '', '', '', '', '']);
	} else {
		$.each(data, function(index, item) {
			let isReturned = item.allocatedReturnDate !== null && item.allocatedReturnDate !== "";

			// Update icon should be DISABLED if returned
			let updateIcon = isReturned
				? `<i class="fa fa-pen" style="color:gray; cursor:not-allowed; opacity:0.5;"></i>`
				: `<i class="fa fa-pen update-icon" style="cursor:pointer; color:green;" data-id="${item.allocationId}"></i>`;

			// Return icon should be DISABLED if returned
			let returnIcon = isReturned
				? `<i class="fas fa-box" style="color:gray; cursor:not-allowed; opacity:0.5;"></i>`
				: `<i class="fas fa-box return-icon" style="cursor:pointer; color:blue;" data-id="${item.allocationId}"></i>`;

			table.row.add([
				index + 1,
				assetNoMap[Number(item.assetId)] || '',
				item.assetSerialNo || '',
				`<span style="display:block; text-align:left;">${contractMap[item.contractId] || ''}</span>`,
				formatDateToDDMMYYYY(item.purchaseDate) || '',
				userMap[item.allocatedTo] || '',
				updateIcon,
				returnIcon
			]);
		});
	}
	table.draw();
}
function formatDateToDDMMYYYY(dateStr) {
    if (!dateStr) return "";
    const [yyyy, mm, dd] = dateStr.split("-");
    return `${dd}-${mm}-${yyyy}`;
}

// ======================= UPDATE =======================
$(document).on('click', '.update-icon', function() {

				  const allowed = allowedActions || [];

	if (!allowed.includes("Edit")) {
	  alert(" You do not have permission to edit.");
	  return;
	}
	let allocationId = $(this).data('id');
	$.ajax({
		url: `${baseUrl}/api/ams/allocate/get/${allocationId}`,
		type: 'GET',
		dataType: 'json',
		xhrFields: { withCredentials: true },
		success: function(data) {
			if (data.allocatedReturnDate) { alert("Already returned. Cannot update."); return; }
			openUpdateModal(data);
		}
	});
});


let orginalupdateasset = null;


function openUpdateModal(allocation) {
	orginalupdateasset = allocation; // store original

    $("#Asset_Type_up").html(`<option>${typeMap[allocation.typeId] || "---"}</option>`);
    $("#Asset_Model_up").html(`<option>${modelMap[allocation.modelId] || "---"}</option>`);
    $("#Asset_Make_up").html(`<option>${makeMap[allocation.makeId] || "---"}</option>`);
    $("#Contract_No_up").html(`<option>${contractMap[allocation.contractId] || "---"}</option>`);

    $("#Asset_SrNo_up").val(allocation.assetSerialNo || "");
    $("#Purchase_Date_up").val(formatDateOnly(allocation.purchaseDate));
    $("#Allocated_Qty_up").val(allocation.qty || 1);

    $("#Allocated_To_up").empty().append(`<option value="">Select</option>`);
    let allocatedToId = Number(allocation.allocatedTo);
    userListGlobal.forEach(u => {
        let selected = (u.id === allocatedToId) ? "selected" : "";
        $("#Allocated_To_up").append(`<option value="${u.id}" ${selected}>${u.userName}</option>`);
    });

    let user = userListGlobal.find(u => u.id === allocatedToId);
    $("#Department_up").val(user && user.department ? departmentMap[user.department] : "");

    $("#Allocated_Date_up").val(formatDateOnly(allocation.allocatedDate));
    $("#Expected_Return_Date_up").val(formatDateOnly(allocation.expectedReturnDate));
    $("#Remarks_up").val(allocation.remarks || "");

    selectedUpdateAssetDetails = {
        typeId: allocation.typeId,
        modelId: allocation.modelId,
        makeId: allocation.makeId,
        contractId: allocation.contractId
    };

    $("#saveAssetBtn_up").data("allocationId", allocation.allocationId);
    $("#exampleModalScrollableup123").modal("show");
}

function validationBeforeUpdate() {
    let isValid = true;

    // Get values from update modal
    let allocatedTo = $("#Allocated_To_up").val();
    let allocatedDate = $("#Allocated_Date_up").val();
    let expectedReturnDate = $("#Expected_Return_Date_up").val();


	
    // Validate Allocated To
    if (!allocatedTo) {
        $("#allocatedToError_up").show();
        isValid = false;
    } else {
        $("#allocatedToError_up").hide();
    }

    // Validate Allocated Date
    if (!allocatedDate) {
        $("#allocatedDateError_up").show();
        isValid = false;
    } else {
        $("#allocatedDateError_up").hide();
    }

    // Validate Expected Return Date
    if (!expectedReturnDate) {
        $("#excepteddateUpError_up").text("Expected Return Date is required").show();
        isValid = false;
    } else {
        $("#excepteddateUpError_up").hide();
    }

    // Check if Expected Return Date >= Allocated Date
    if (allocatedDate && expectedReturnDate && new Date(allocatedDate) > new Date(expectedReturnDate)) {
        $("#excepteddateUpError_up").text("Expected Return Date must be after Allocated Date").show();
        isValid = false;
    }

    return isValid;
}
// ======================= CHANGE DETECTION =======================
function isAllocationChanged() {
    if (!orginalupdateasset) return true;

    const normalize = v => (v === null || v === undefined) ? "" : v.toString().trim();

    // current modal values
    let updated = {
        allocatedTo: normalize($("#Allocated_To_up").val()),
        allocatedDate: normalize($("#Allocated_Date_up").val()),
        expectedReturnDate: normalize($("#Expected_Return_Date_up").val()),
        remarks: normalize($("#Remarks_up").val())
    };

    // original values from API
    let original = {
        allocatedTo: normalize(orginalupdateasset.allocatedTo),
        allocatedDate: normalize(formatDateOnly(orginalupdateasset.allocatedDate)),
        expectedReturnDate: normalize(formatDateOnly(orginalupdateasset.expectedReturnDate)),
        remarks: normalize(orginalupdateasset.remarks)
    };

    // compare only the selected fields
    for (let key in updated) {
        if (updated[key] !== original[key]) {
            return true; // at least one relevant field changed
        }
    }

    return false; // nothing changed
}



$("#saveAssetBtn_up").click(function() {
	if (!validationBeforeUpdate()) return;

	let allocationId = $(this).data("allocationId");
	updatedAssetData = {
		allocationId: allocationId,
		...selectedUpdateAssetDetails,
		assetSerialNo: $("#Asset_SrNo_up").val(),
		purchaseDate: $("#Purchase_Date_up").val(),
		qty: $("#Allocated_Qty_up").val(),
		allocatedTo: $("#Allocated_To_up").val(),
		department: $("#Department_up").val(),
		allocatedDate: appendTimeToDate($("#Allocated_Date_up").val()),
		expectedReturnDate: appendTimeToDate($("#Expected_Return_Date_up").val()),
		remarks: $("#Remarks_up").val(),
		modifiedBy:sessionStorage.getItem("id")
	};

	$("#exampleModalCenterup205").modal("show");
});

$("#confirmassetallocationupyes").click(function() {
	$("#exampleModalCenterup205").modal("hide");

	if (!isAllocationChanged()) {
		$("#exampleModalScrollableup123").modal("hide");
		showPopup("Nothing has changed to update.", "AssetAllocation.jsp");
		return;
	}

	updateAssetAllocation(updatedAssetData);
});
function updateAssetAllocation(data) {
	$.ajax({
		url: `${baseUrl}/api/ams/allocate/update`,
		type: "PUT",
		contentType: "application/json",
		data: JSON.stringify(data),
		xhrFields: { withCredentials: true },
		success: function() {
			showPopup("Updated The Asset Allocation Successfully", "AssetAllocation.jsp");
			$("#exampleModalScrollableup123").modal('hide');
		}
	});
}

// ======================= RETURN =======================
$(document).on('click', '.return-icon', function() {

				  const allowed = allowedActions || [];

	if (!allowed.includes("Edit")) {
	  alert(" You do not have permission to edit.");
	  return;
	}
	let allocationId = $(this).data('id');

	$.ajax({
		url: `${baseUrl}/api/ams/allocate/get/${allocationId}`,
		type: 'GET',
		dataType: 'json',
		xhrFields: { withCredentials: true },
		success: function(data) {
			if (data.allocatedReturnDate) {
				alert("Already returned. Cannot update.");
				return;
			}
			openReturnAssetModal(data);
		}
	});
});

function openReturnAssetModal(allocation) {

    $("#Asset_Type_Return").html(`<option>${typeMap[allocation.typeId] || "---"}</option>`);
    $("#Asset_Model_Return").html(`<option>${modelMap[allocation.modelId] || "---"}</option>`);
    $("#Asset_Make_Return").html(`<option>${makeMap[allocation.makeId] || "---"}</option>`);
    $("#Contract_No_Return").html(`<option>${contractMap[allocation.contractId] || "---"}</option>`);
    $("#Asset_No_Return").html(`<option>${assetNoMap[Number(allocation.assetId)] || "---"}</option>`);

    $("#Asset_SrNo_Return").val(allocation.assetSerialNo || "");

    // 🔥 FIX DATE FORMAT (convert YYYY-MM-DDTHH:mm:ss → YYYY-MM-DD)
    $("#Purchase_Date_Return").val(formatDateOnly(allocation.purchaseDate));
    $("#Allocated_Date_Return").val(formatDateOnly(allocation.allocatedDate));
    $("#Expected_Return_Date_Return").val(formatDateOnly(allocation.expectedReturnDate));

    $("#Allocated_Qty_Return").val(allocation.qty || 1);

    $("#Allocated_To_Return").empty().append(`<option value="">Select</option>`);
    let allocatedUserId = Number(allocation.allocatedTo);

    userListGlobal.forEach(u => {
        let selected = (u.id === allocatedUserId) ? "selected" : "";
        $("#Allocated_To_Return").append(`<option value="${u.id}" ${selected}>${u.userName}</option>`);
    });

    let user = userListGlobal.find(u => u.id === allocatedUserId);
    $("#Department_Return").val(
        user && user.department ? departmentMap[user.department] : ""
    );

    $("#Remarks_Return").val("");
	let today = new Date().toISOString().split('T')[0];
    // Clear return date always
    $("#Return_Date").val(today);

    $("#btnReturnSubmit").data("allocationId", allocation.allocationId);

    $("#AssetAllocationReturnModal").modal("show");
}


$("#btnReturnSubmit").click(function() {
	let returnDate = $("#Return_Date").val().trim();

	if (!returnDate) {
		$("#Return_date_Error").text("Return Date is required").show();
		return;
	} else {
		$("#Return_date_Error").hide();
	}

	$("#exampleModalCenterreturn205").modal("show");
});

$("#confirmassetallocationreturnyes").click(function() {
	let returnDate = appendTimeToDate($("#Return_Date").val());
	let allocationId = $("#btnReturnSubmit").data("allocationId");
	let return_remarks = $("#Remarks_Return").val();

	if (!returnDate) {
		alert("Return date missing!");
		return;
	}

	

	let payload = {
		allocationId: allocationId,
		allocatedReturnDate: returnDate,
		remarks: return_remarks
	};

	$.ajax({
		url: `${baseUrl}/api/ams/allocate/update`,

		type: "PUT",
		data: JSON.stringify(payload),
		contentType: "application/json",
		xhrFields: { withCredentials: true },
		success: function() {
			showPopup("The asset is Return Successfully", "AssetAllocation.jsp");
			$("#exampleModalCenterreturn205").modal("hide");
			$("#AssetAllocationReturnModal").modal("hide");
		}
	});
});
function initUniversalSelect2(container = document) {
	$(container).find("select").each(function () {

		const $select = $(this);

		// ❌ Skip disabled or readonly selects
		if ($select.prop("disabled") || $select.attr("readonly")) {
			return;
		}

		// ❌ Skip already initialized Select2
		if ($select.hasClass("select2-hidden-accessible")) {
			return;
		}

		let modalParent = $select.closest(".modal");

		$select.select2({
			placeholder: $select.find("option:first").text() || "Select",
			allowClear: true,
			width: "100%",
			dropdownParent: modalParent.length ? modalParent : $(document.body)
		});
	});
}



function setAllocationDateLimits() {
	const today = new Date().toISOString().split("T")[0];

	// Disable selecting past dates
	$("#Allocated_Date").attr("min", today);
	$("#Expected_Return_Date").attr("min", today);

	// Expected Return Date cannot be < Allocated Date
	$("#Allocated_Date").on("change", function() {
		const allocDate = $(this).val();
		$("#Expected_Return_Date").val(""); // Clear if invalid
		$("#Expected_Return_Date").attr("min", allocDate);
	});
}


function setUpdateAllocationDateLimits() {
	const today = new Date().toISOString().split("T")[0];

	$("#Allocated_Date_up").attr("min", today);
	$("#Expected_Return_Date_up").attr("min", today);

	$("#Allocated_Date_up").on("change", function() {
		const allocDateUp = $(this).val();
		$("#Expected_Return_Date_up").val("");
		$("#Expected_Return_Date_up").attr("min", allocDateUp);
	});
}


function appendTimeToDate(dateStr) {
	if (!dateStr) return null;
	const now = new Date();
	const hh = String(now.getHours()).padStart(2, '0');
	const mm = String(now.getMinutes()).padStart(2, '0');
	const ss = String(now.getSeconds()).padStart(2, '0');
	return dateStr + "T" + hh + ":" + mm + ":" + ss;
}

// ======================= COMMON METHODS =======================
function showPopup(message, redirectUrl) {
	var popup = $('<div class="popup">' + message + '</div>').appendTo('body').hide().fadeIn(400);
	setTimeout(function() {
		popup.fadeOut(400, function() {
			$(this).remove();
			window.location = redirectUrl;
		});
	}, 2000);
}
function formatDateOnly(dateString) {
    if (!dateString) return "";
    return dateString.split("T")[0];  // Keeps only YYYY-MM-DD
}

function getIndianDateTimeFormat(date) {
	const options = { timeZone: 'Asia/Kolkata', hour12: false };
	const istDate = new Date(date.toLocaleString('en-US', options));
	return `${istDate.getFullYear()}-${(istDate.getMonth() + 1).toString().padStart(2, '0')}-${istDate.getDate().toString().padStart(2, '0')}T${istDate.getHours().toString().padStart(2, '0')}:${istDate.getMinutes().toString().padStart(2, '0')}:${istDate.getSeconds().toString().padStart(2, '0')}`;
}
