
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
	  const allowed = allowedActions || [];

	if (!allowed.includes("Insert")) {
	  alert(" You do not have permission to Insert.");
	  $('#exampleModalScrollable123').modal('hide');
	  return;
	}
	$('#exampleModalScrollable123').modal('show');
})

$(document).ready(function() {

/*	$('#assetMake').select2({
	    placeholder: "Select Make",
	    allowClear: true,
	    width: '100%',
		dropdownParent: $('#exampleModalScrollable123')
	});
*/

initUniversalSelect2($('#exampleModalScrollable123'));
initUniversalSelect2Up($('#updateAssetEntryModal'));


	loadAssetOwners();
	loadAssetMakes();
	loadStatusList();
	loadAssetTypes();
	loadAssetModels();
	loadContractsForEmployee(sessionStorage.getItem("id"));
	fetchAssetEntry();

});










// 🔁 Helper Function for formatting date
function formatDateDMY(dateStr) {
	if (!dateStr) return "";
	const d = new Date(dateStr);
	const day = String(d.getDate()).padStart(2, "0");
	const month = String(d.getMonth() + 1).padStart(2, "0");
	const year = d.getFullYear();
	return `${day}-${month}-${year}`;
}

async function fetchAssetEntry() {

	// ---- Load lookup data first ----
	const typeMap = {};
	const modelMap = {};

	// Fetch Type List
	const typeList = await fetch(`${baseUrl}/api/ams/getall`, { credentials: "include" }).then(res => res.json());
	typeList.forEach(t => {
		typeMap[t.type_id] = `${t.code} - ${t.assetType}`;
	});

	// Fetch Model List
	const modelList = await fetch(`${baseUrl}/api/ams/model/getAll`, { credentials: "include" }).then(res => res.json());
	modelList.forEach(m => {
		modelMap[m.model_id] = `${m.code} - ${m.assetModel}`;
	});

	// ---- Fetch Asset Entries ----
	const apiUrl = `${baseUrl}/api/ams/entry/getAll`;

	try {
		const response = await fetch(apiUrl, {
			method: "GET",
			credentials: "include"
		});

		if (!response.ok) throw new Error("Failed to fetch assets");

		const assetList = await response.json();

		let table;
		if (!$.fn.DataTable.isDataTable('#Table1')) {
			table = $('#Table1').DataTable({
				"paging": true,
				"searching": true,
				"ordering": true,
				"info": true
			});
		} else {
			table = $('#Table1').DataTable();
			table.clear();
		}

		// ---------------- Loop Asset List ----------------
		for (const [index, asset] of assetList.entries()) {

			// 🔵 Check Allocation API
			const checkUrl = `${baseUrl}/api/ams/allocate/getactiveassetentry/${asset.assetenId}`;
			let isAllocated = false;

			try {
				let res = await fetch(checkUrl, { credentials: "include" });
				if (res.ok) {
					isAllocated = await res.json(); // true/false
				}
			} catch (e) {
				console.error("Check allocation failed", e);
			}

			// 🟢 If Allocated → Disable Pen
			const editIcon = isAllocated
				? `<i class="fa fa-pen text-secondary" 
                      title="Allocation exists, Cannot Modify"
                      style="cursor:not-allowed; opacity:0.3;"></i>`
				: `<i class="fa fa-pen text-muted" style="cursor:pointer;"
                      onclick="editAssetEntry(${asset.assetenId})" title="Edit"></i>`;

			table.row.add([
				index + 1,
				asset.assetNo || "",
				`<span style="display:block; text-align:left;">${typeMap[asset.typeId] || '----'}</span>`,
				`<span style="display:block; text-align:left;">${modelMap[asset.modelId] || '----'}</span>`,
				asset.purchaseDate ? formatDateDMY(asset.purchaseDate) : "",
				asset.purchaseOrder || "",
				editIcon
			]);
		}

		table.draw();

	} catch (error) {
		console.error("Error fetching asset entries:", error);
	}
}




function getIndianDateTimeFormat(date) {
	const options = {
		timeZone: 'Asia/Kolkata',
		hour12: false,
	};
	const istDate = new Date(date.toLocaleString('en-US', options));
	return `${istDate.getFullYear()}-${(istDate.getMonth() + 1).toString().padStart(2, '0')}-${istDate.getDate().toString().padStart(2, '0')}T${istDate.getHours().toString().padStart(2, '0')}:${istDate.getMinutes().toString().padStart(2, '0')}:${istDate.getSeconds().toString().padStart(2, '0')}`;
}





function loadAssetOwners() {
	$.ajax({
		url: `${baseUrl}/api/ams/owned/getAll`,
		type: "GET",
		xhrFields: { withCredentials: true },
		success: function(data) {
			let dropdown = $("#assetOwner");
			dropdown.empty(); // remove existing
			 dropdown.html(`<option value=" ">Select Asset Owner</option>`);


			data.forEach(item => {
				let optionText = `${item.code} - ${item.ownedByDescription}`;
				dropdown.append(`<option value="${item.asserob_id}">${optionText}</option>`);
			});
			dropdown.trigger('change');
		},
		error: function(err) {
			console.error("Error fetching owners:", err);
		}
	});
}

function loadAssetMakes() {
    $.ajax({
        url: `${baseUrl}/api/ams/maker/getAll`,
        type: "GET",
        xhrFields: { withCredentials: true },
        success: function (data) {
            let dropdown = $("#assetMake");
            dropdown.empty();
           dropdown.html(`<option value=" ">Select AssetMaker</option>`);

            data.forEach(item => {
                let optionText = `${item.code} - ${item.makeDescription}`;
                dropdown.append(
                    `<option value="${item.makeId}">${optionText}</option>`
                );
            });

            dropdown.trigger('change');
        },
        error: function (err) {
            console.error("Error fetching asset makes:", err);
        }
    });
}






function loadStatusList() {
	$.ajax({
		url: `${baseUrl}/api/ams/status/getAll`,
		type: "GET",
		xhrFields: { withCredentials: true },
		success: function(data) {
			let dropdown = $("#status");
			dropdown.empty();
		dropdown.html(`<option value=" ">Select Asset Status</option>`);
			data.forEach(item => {
				let optionText = `${item.code} - ${item.assetStatus}`;
				dropdown.append(`<option value="${item.status_id}">${optionText}</option>`);
			});
			dropdown.trigger('change');

		},
		error: function(err) {
			console.error("Error fetching status list:", err);
		}
	});
}

function loadAssetTypes() {
	$.ajax({
		url: `${baseUrl}/api/ams/getall`,
		type: "GET",
		xhrFields: { withCredentials: true },
		success: function(data) {
			let dropdown = $("#assetType");
			dropdown.empty();
			dropdown.html(`<option value=" ">Select Asset Type</option>`);

			data.forEach(item => {
				let optionText = `${item.code} - ${item.assetType}`;
				dropdown.append(`<option value="${item.type_id}">${optionText}</option>`);
			});
			dropdown.trigger('change');

		},
		error: function(err) {
			console.error("Error loading asset types:", err);
		}
	});
}

function loadAssetModels() {
	$.ajax({
		url: `${baseUrl}/api/ams/model/getAll`,
		type: "GET",
		xhrFields: { withCredentials: true },
		success: function(data) {

			let dropdown = $("#assetModelUp");
			dropdown.empty();
			dropdown.html(`<option value=" ">Select Asset Modal</option>`);
			data.forEach(item => {
				let optionText = `${item.code} - ${item.assetModel}`;
				dropdown.append(
					`<option value="${item.model_id}">${optionText}</option>`
				);
			});
			dropdown.trigger('change');
		},
		error: function(err) {
			console.error("Error loading asset models:", err);
		}
	});
}




async function loadContractsForEmployee(employeeId) {
	try {
		// 1️⃣ Fetch all contracts
		const contractResponse = await fetch(`${baseUrl}/api/contract/getAll`, { credentials: "include" });
		const allContracts = await contractResponse.json();

		// 2️⃣ Fetch all employee assignments
		const assignResponse = await fetch(`${baseUrl}/api/assign/getAll`, { credentials: "include" });
		const allAssignments = await assignResponse.json();

		// 3️⃣ Filter assignments for this employee
		const assignedContractIds = allAssignments
			.filter(a => a.employee_code === employeeId.toString())
			.map(a => a.conid);

		// 4️⃣ Filter the contracts that match assignedContractIds
		const filteredContracts = allContracts.filter(c => assignedContractIds.includes(c.contractId));

		// 5️⃣ Populate the dropdown
		const dropdown = $("#contractNo"); // replace with your asset form dropdown id
		dropdown.empty();
		dropdown.html(`<option value=" ">Select Contract</option>`);

		filteredContracts.forEach(c => {
			let text = c.jobCode + (c.description ? " - " + c.description : "");
			dropdown.append(`<option value="${c.contractId}">${text}</option>`);
		});
		dropdown.trigger('change');

	} catch (err) {
		console.error("Error loading contracts for employee:", err);
	}
}


$(document).ready(function() {

	$("#assetForm").on("submit", async function(e) {
		e.preventDefault(); // prevent default submit

		if (await validateAssetForm()) {
			
			$("#exampleModalCenter317").modal("show"); // open confirmation modal
		}
	});

});



$("#confirmassetentryyes").click(function() {
	$("#exampleModalScrollable123").modal("hide");
	insertAssetEntry();
})

$("#CANCEL_CONFIRM").click(function (){
	$("#exampleModalCenter317").modal("hide"); 
})


async function validateAssetForm() {
	let valid = true;

	// Collect all form values
	let assetOwner = $("#assetOwner").val().trim();
	let assetMake = $("#assetMake").val().trim();
	let purchaseDate = $("#purchaseDate").val().trim();
	let cost = $("#cost").val().trim();
	let warrantyStart = $("#warrantyStart").val().trim();
	let warrantyEnd = $("#warrantyEnd").val().trim();
	let status = $("#status").val().trim();
	let serialNo = $("#serialNo").val().trim();
	let assetType = $("#assetType").val().trim();
	let contractNo = $("#contractNo").val().trim();
	let assetModelUp = $("#assetModelUp").val().trim();
	let poNo = $("#poNo").val().trim();
	let quantity = $("#quantity").val().trim();

	// Helper function to show/hide error messages
	function showError(id, condition, message) {
	    if (condition) {
	        $("#" + id).text(message || $("#" + id).text() || "This field is required").show();
	        valid = false;
	    } else {
	        $("#" + id).hide();
	    }
	}


	// 1️⃣ Check Asset Serial Number duplicate via backend API
	if (serialNo !== "") {
		try {
			const response = await fetch(`${baseUrl}/api/ams/entry/asset_srno/${serialNo}`, { credentials: "include" });

			if (response.status === 409) {
				// Duplicate found → read JSON data
				const data = await response.json();
				const assetNo = data.assetNo || "Unknown";

				showError(
					"serialNoError",
					true,
					`The Asset Serial Number already exists For this  (Asset No: ${assetNo})`
				);

			} else if (response.status === 500) {
				showError("serialNoError", true, "Error checking Serial Number");
			} else {
				$("#serialNoError").hide();  // No duplicate
			}

		} catch (err) {
			console.error("Error checking Asset Serial Number:", err);
			showError("serialNoError", true, "Error checking Serial Number");
		}

	} else {
		showError("serialNoError", true, "Serial Number is required");
	}

	// 2️⃣ Validate other mandatory fields
	showError("assetOwnerError", assetOwner === "");
	showError("assetMakeError", assetMake === "");
	showError("purchaseDateError", purchaseDate === "");
	showError("costError", cost === "");
	showError("warrantyStartError", warrantyStart === "");
	showError("statusError", status === "");
	showError("assetTypeError", assetType === "");
	showError("contractNoError", contractNo === "");
	showError("assetModelUpError", assetModelUp === "");
	showError("poNoError", poNo === "");
	showError("warrantyEndError", warrantyEnd === "");
	showError("quantityError", quantity === "");

	// 3️⃣ Warranty date validation: End > Start
	if (warrantyStart !== "" && warrantyEnd !== "") {
		let start = new Date(warrantyStart);
		let end = new Date(warrantyEnd);

		if (end < start) {
			$("#warrantyEndError").text("Warranty End date must be greater than Warranty Start date").show();
			valid = false;
		} else {
			$("#warrantyEndError").hide();
		}
	}

	return valid;
}



async function insertAssetEntry() {
	// Collect values from the form
	let assetData = {
		typeId: parseInt($("#assetType").val().trim()),
		makeId: parseInt($("#assetMake").val().trim()),
		assetSrNo: $("#serialNo").val().trim(),
		purchaseDate: $("#purchaseDate").val().trim(),
		purchaseOrder: $("#poNo").val().trim(),
		cost: parseFloat($("#cost").val().trim()),
		assertorId: $("#assetOwner").val().trim(),
		wstartDate: $("#warrantyStart").val().trim(),
		wendDate: $("#warrantyEnd").val().trim(),
		statusId: parseInt($("#status").val().trim()),
		qty: parseInt($("#quantity").val().trim()),
		assetNo: $("#contractNo").val().trim(),
		modelId: parseInt($("#assetModelUp").val().trim()),
		remarks: $("#remarks").val().trim(),
		createdDate: getIndianDateTimeFormat(new Date()),
		contractId: $("#contractNo").val().trim(),
		createdBy: sessionStorage.getItem("id")
	};



	try {




		$.ajax({
			url: `${baseUrl}/api/ams/entry`,
			method: "POST",
			contentType: "application/json",
			data: JSON.stringify(assetData),
			xhrFields: { withCredentials: true },

			success: function(response) {
				const insertedId = response.assetenId; // returned ID from insert

				// Fetch full asset details
				$.ajax({
					url: `${baseUrl}/api/ams/entry/get/${insertedId}`,
					method: "GET",
					xhrFields: { withCredentials: true },

					success: function(fullAsset) {
						showPopup(`Asset Entry Successfully .... ${fullAsset.assetNo}`, "AmsEntry.jsp");
						console.log(fullAsset);
					},
					error: function(xhr) {
						console.error("Error fetching inserted asset:", xhr.responseText);
					}
				});
			},
			error: function(xhr) {
				console.error("Error saving asset entry:", xhr.responseText);
			}
		})

	} catch (err) {
		console.error("Error checking Asset Serial Number:", err);
	}
}

function loadAssetTypesUp() {
	return new Promise((resolve, reject) => {
		$.ajax({
			url: `${baseUrl}/api/ams/getall`,
			type: "GET",
			xhrFields: { withCredentials: true },

			success: function (data) {
				let dropdown = $("#assettypeUp");

				dropdown.prop("disabled", false);
				dropdown.empty();
				dropdown.html(`<option value="">Select Asset Type</option>`);

				data.forEach(item => {
					let optionText = `${item.code} - ${item.assetType}`;
					dropdown.append(
						`<option value="${item.type_id}">${optionText}</option>`
					);
				});

				// disable after load (as per your requirement)
				dropdown.prop("disabled", true)
					.css({ "background-color": "#f0f0f0", "cursor": "not-allowed" });

				resolve(); // ✅ IMPORTANT
			},
			error: function (err) {
				console.error("Error loading asset types for update:", err);
				reject(err);
			}
		});
	});
}


function loadAssetOwnersUp() {
	return new Promise((resolve, reject) => {
		$.ajax({
			url: `${baseUrl}/api/ams/owned/getAll`,
			type: "GET",
			xhrFields: { withCredentials: true },

			success: function (data) {
				let dropdown = $("#assetOwnerUp");
				dropdown.empty();
				dropdown.html(`<option value=" ">Select Asset owner</option>`);

				data.forEach(item => {
					let optionText = `${item.code} - ${item.ownedByDescription}`;
					dropdown.append(
						`<option value="${item.asserob_id}">${optionText}</option>`
					);
				});

				resolve(); // ✅
			},
			error: function (err) {
				console.error("Error loading owners for update:", err);
				reject(err);
			}
		});
	});
}

function loadStatusListForUpdate() {
	return new Promise((resolve, reject) => {
		$.ajax({
			url: `${baseUrl}/api/ams/status/getAll`,
			type: "GET",
			xhrFields: { withCredentials: true },

			success: function (data) {
				let dropdown = $("#statusUp");
				dropdown.empty();
				dropdown.html(`<option value=" ">Select Asset Status</option>`);

				data.forEach(item => {
					let optionText = `${item.code} - ${item.assetStatus}`;
					dropdown.append(
						`<option value="${item.status_id}">${optionText}</option>`
					);
				});

				resolve(); // ✅ FIXED
			},
			error: function (err) {
				console.error("Error fetching status list:", err);
				reject(err);
			}
		});
	});
}


function loadAssetMakesForUpdate() {
	return new Promise((resolve, reject) => {
		$.ajax({
			url: `${baseUrl}/api/ams/maker/getAll`,
			type: "GET",
			xhrFields: { withCredentials: true },

			success: function (data) {
				let dropdown = $("#assetMakeUp");
				dropdown.empty();
				dropdown.html(`<option value=" ">Select Asset Maker</option>`);

				data.forEach(item => {
					let optionText = `${item.code} - ${item.makeDescription}`;
					dropdown.append(
						`<option value="${item.makeId}">${optionText}</option>`
					);
				});

				resolve(); // ✅
			},
			error: function (err) {
				console.error("Error fetching asset makes:", err);
				reject(err);
			}
		});
	});
}



function loadAssetModelsForUpdate() {
	return new Promise((resolve, reject) => {
		$.ajax({
			url: `${baseUrl}/api/ams/model/getAll`,
			type: "GET",
			xhrFields: { withCredentials: true },

			success: function(data) {

				let dropdown = $("#assetModelUpdate");
				dropdown.empty();
			 dropdown.html(`<option value=" ">Select Asset Modal</option>`);

				data.forEach(item => {
					let optionText = `${item.code} - ${item.assetModel}`;
					dropdown.append(`<option value="${item.model_id}">${optionText}</option>`);
				});

				resolve(); // IMPORTANT
			},
			error: function(err) {
				console.error("Error fetching models:", err);
				reject(err);
			}
		});
	});
}

function loadContractsForEmployeeUp(employeeId, currentContractId) {
	return new Promise(async (resolve, reject) => {
		try {
			// 1️⃣ Fetch all contracts
			const contractResponse = await fetch(
				`${baseUrl}/api/contract/getAll`,
				{ credentials: "include" }
			);
			const allContracts = await contractResponse.json();

			// 2️⃣ Fetch assignments
			const assignResponse = await fetch(
				`${baseUrl}/api/assign/getAll`,
				{ credentials: "include" }
			);
			const allAssignments = await assignResponse.json();

			// 3️⃣ Filter assigned contracts
			const assignedContractIds = allAssignments
				.filter(a => a.employee_code === employeeId.toString())
				.map(a => a.conid);

			// 4️⃣ Include current contract
			const filteredContracts = allContracts.filter(c =>
				assignedContractIds.includes(c.contractId) ||
				c.contractId === currentContractId
			);

			// 5️⃣ Populate dropdown
			const dropdown = $("#contractNoUp");
			dropdown.empty();
			 dropdown.html(`<option value=" ">Select Contract</option>`);

			filteredContracts.forEach(c => {
				let optionText = `${c.jobCode} - ${c.description || ""}`;
				dropdown.append(
					`<option value="${c.contractId}">${optionText}</option>`
				);
			});

			/*// 6️⃣ Prefill selected contract
			if (currentContractId != null) {
				dropdown.val(currentContractId.toString());
			}*/

			resolve(); // ✅ IMPORTANT

		} catch (err) {
			console.error("Error loading update contracts:", err);
			reject(err);
		}
	});
}



let oldSerialNo = "";
let originalAsset = null;

async function editAssetEntry(assetId) {
			  const allowed = allowedActions || [];

	if (!allowed.includes("Edit")) {
	  alert(" You do not have permission to edit.");
	  return;
	}
	$('#assetMakeUp').select2({
	    placeholder: "Select Make",
	    allowClear: true,
	    width: '100%',
		dropdownParent: $('#updateAssetEntryModal')
	});
	
	$('#assetOwnerUp').select2({
		    placeholder: "Select Make",
		    allowClear: true,
		    width: '100%',
			dropdownParent: $('#updateAssetEntryModal')
		});
		
		$('#assetModelUpdate').select2({
			    placeholder: "Select Make",
			    allowClear: true,
			    width: '100%',
				dropdownParent: $('#updateAssetEntryModal')
			});
			$('#statusUp').select2({
					    placeholder: "Select Make",
					    allowClear: true,
					    width: '100%',
						dropdownParent: $('#updateAssetEntryModal')
					});
					$('#contractNoUp').select2({
									    placeholder: "Select Make",
									    allowClear: true,
									    width: '100%',
										dropdownParent: $('#updateAssetEntryModal')
									});
	await loadAssetOwnersUp();
	await loadAssetTypesUp();
	await loadStatusListForUpdate();
	await loadAssetMakesForUpdate();
	await loadAssetModelsForUpdate();

	setUpdateDateLimits();

	try {
		// Fetch asset details by ID
		const response = await fetch(`${baseUrl}/api/ams/entry/get/${assetId}`,{credentials:"include"});
		if (!response.ok) throw new Error("Failed to load asset details");

		const asset = await response.json();
		originalAsset = asset;
		await loadContractsForEmployeeUp(sessionStorage.getItem("id"), asset.contractId);
		console.log(asset);

		oldSerialNo = asset.assetSrNo;

		$("#updateAssetEntryModal").attr("data-asset-id", asset.assetenId);

		// Fill modal fields
		$("#assetNoUp").val(asset.assetNo);
		$("#assetOwnerUp").val(asset.assertorId).trigger('change');
		$("#assetMakeUp").val(asset.makeId).trigger('change');
		$("#purchaseDateUp").val(asset.purchaseDate ? asset.purchaseDate.split("T")[0] : "");
		$("#costUp").val(asset.cost);
		$("#warrantyStartUp").val(asset.wstartDate ? asset.wstartDate.split("T")[0] : "");
		$("#statusUp").val(asset.statusId).trigger('change');
		$("#serialNoUp").val(asset.assetSrNo);

		$("#assettypeUp").val(asset.typeId);

		$("#assetModelUpdate").val(asset.modelId).trigger('change');
		$("#contractNoUp").val(asset.contractId.toString()).trigger('change');

		$("#poNoUp").val(asset.purchaseOrder);
		$("#vendorUp").val(asset.vendor);

		$("#warrantyEndUp").val(asset.wendDate ? asset.wendDate.split("T")[0] : "");
		$("#quantityUp").val(asset.quantity);
		$("#remarksUp").val(asset.remarks);

		// Open the modal now
		$("#updateAssetEntryModal").modal("show");

	} catch (error) {
		console.error("Error loading asset entry:", error);
	}
}


async function validateUpdateAssetForm() {
	let valid = true;

	// Collect all UPDATE modal values safely
	let assetOwner = $("#assetOwnerUp")?.val()?.trim() || "";
	let assetMake = $("#assetMakeUp")?.val()?.trim() || "";
	let purchaseDate = $("#purchaseDateUp")?.val()?.trim() || "";
	let cost = $("#costUp")?.val()?.trim() || "";
	let warrantyStart = $("#warrantyStartUp")?.val()?.trim() || "";
	let warrantyEnd = $("#warrantyEndUp")?.val()?.trim() || "";
	let status = $("#statusUp")?.val()?.trim() || "";
	let serialNo = $("#serialNoUp")?.val()?.trim() || "";
	let assetType = $("#assettypeUp")?.val()?.trim() || "";
	let contractNo = $("#contractNoUp")?.val()?.trim() || "";
	let assetModelId = $("#assetModelUpdate")?.val()?.trim() || "";
	let poNo = $("#poNoUp")?.val()?.trim() || "";

	function showError(id, condition, message) {
	    if (condition) {
	        $("#" + id).text(message || $("#" + id).text() || "This field is required").show();
	        valid = false;
	    } else {
	        $("#" + id).hide();
	    }
	}


	// 🟡 1️⃣ Duplicate Serial No check (only if changed)
	if (serialNo !== oldSerialNo) {
		if (serialNo !== "") {
			try {
				const response = await fetch(`${baseUrl}/api/ams/entry/asset_srno/${serialNo}`,{credentials:"include"});

				if (response.status === 409) {  // Duplicate
					const duplicateAsset = await response.json();
					showError("serialNoUpError", true,
						`Serial Number already exists for Asset No: ${duplicateAsset.assetNo}`);
				} else if (response.status === 500) {
					showError("serialNoUpError", true, "Error checking Serial Number");
				} else {
					$("#serialNoUpError").hide(); // no duplicate
				}
			} catch (err) {
				console.error("Error checking Asset Serial Number:", err);
				showError("serialNoUpError", true, "Error checking Serial Number");
			}
		} else {
			showError("serialNoUpError", true, "Serial Number is required");
		}
	}

	// 2️⃣ Other validations
	showError("assetOwnerUpError", assetOwner === "");
	showError("assetMakeUpError", assetMake === "");
	showError("purchaseDateUpError", purchaseDate === "");
	showError("costUpError", cost === "");
	showError("warrantyStartUpError", warrantyStart === "");
	showError("statusUpError", status === "");
	showError("contractModelupdateError", contractNo === "");
	showError("assetModelUpdateError", assetModelId === "");
	showError("warrantyEndUpError", warrantyEnd === "");
    showError("purchaseorderupdateerror",poNo==="");
	

	if (warrantyStart && warrantyEnd) {
		let start = new Date(warrantyStart);
		let end = new Date(warrantyEnd);
		if (end < start) {
			$("#warrantyEndUpError").text("Warranty End date must be greater than Warranty Start date").show();
			valid = false;
		} else {
			$("#warrantyEndUpError").hide();
		}
	}

	return valid;
}




function isAssetChanged() {
	let updated = {
		assetOwner: $("#assetOwnerUp").val()?.trim(),
		assetMake: $("#assetMakeUp").val()?.trim(),
		purchaseDate: $("#purchaseDateUp").val()?.trim(),
		cost: $("#costUp").val()?.trim(),
		warrantyStart: $("#warrantyStartUp").val()?.trim(),
		warrantyEnd: $("#warrantyEndUp").val()?.trim(),
		status: $("#statusUp").val()?.trim(),
		serialNo: $("#serialNoUp").val()?.trim(),
		assetType: $("#assettypeUp").val()?.trim(),
		contractNo: $("#contractNoUp").val()?.trim(),
		assetModelId: $("#assetModelUpdate").val()?.trim(),
		poNo: $("#poNoUp").val()?.trim(),
		quantity: $("#quantityUp").val()?.trim(),
		remarks: $("#remarksUp").val()?.trim()
	};

	let original = {
		assetOwner: originalAsset.assertorId?.toString() || "",
		assetMake: originalAsset.makeId?.toString() || "",
		purchaseDate: originalAsset.purchaseDate?.split("T")[0] || "",
		cost: originalAsset.cost?.toString() || "",
		warrantyStart: originalAsset.wstartDate?.split("T")[0] || "",
		warrantyEnd: originalAsset.wendDate?.split("T")[0] || "",
		status: originalAsset.statusId?.toString() || "",
		serialNo: originalAsset.assetSrNo || "",
		assetType: originalAsset.typeId?.toString() || "",
		contractNo: originalAsset.contractId?.toString() || "",
		assetModelId: originalAsset.modelId?.toString() || "",
		poNo: originalAsset.purchaseOrder || "",
		quantity: originalAsset.quantity?.toString() || "",
		remarks: originalAsset.remarks || ""
	};

	return JSON.stringify(updated) !== JSON.stringify(original);
}

// Update button click
$("#updateAssetBtn").click(async function() {
	if (await validateUpdateAssetForm()) {
		$("#confirmUpdateModal").modal("show");
	} else {
		console.log("Validation failed");
	}
});

// no button is clicked
$("#cancelUpdateConfirm").click(function() {
	$("#confirmUpdateModal").modal("hide");
})

//yes button is click 
$("#confirmUpdateYes").click(function() {

	if (!isAssetChanged()) {
		$("#updateAssetEntryModal").modal("hide");
		$("#confirmUpdateModal").modal("hide");
		showPopup("Nothing has changed to update.", "AmsEntry.jsp");

		return;
	}
	else {
		updateAssetEntry();
	}
});





function updateAssetEntry() {

	let assetId = $("#updateAssetEntryModal").attr("data-asset-id");


	const payload = {
		typeId: $("#assettypeUp").val(),
		contractId: $("#contractNoUp").val(),
		makeId: $("#assetMakeUp").val(),
		assetSrNo: $("#serialNoUp").val(),
		purchaseDate: $("#purchaseDateUp").val(),
		purchaseOrder: $("#poNoUp").val(),
		cost: $("#costUp").val(),
		wstartDate: $("#warrantyStartUp").val(),
		wendDate: $("#warrantyEndUp").val(),
		statusId: $("#statusUp").val(),
		assertorId: $("#assetOwnerUp").val(),
		remarks: $("#remarksUp").val(),
		assetNo: $("#assetNoUp").val(),
		modelId: $("#assetModelUpdate").val(),

		// Always send modification details

		modifiedDate: new Date().toISOString(),

		// You said: do NOT send vendor or quantity
		vendorId: null,
		qty: null,
		modifiedBy:sessionStorage.getItem("id"),
	};

	console.log("UPDATE PAYLOAD:", payload);

	$.ajax({
		url: `${baseUrl}/api/ams/entry/update/${assetId}`,
		type: "PUT",
		contentType: "application/json",
		data: JSON.stringify(payload),
		xhrFields: { withCredentials: true },

		success: function(response) {
			$("#updateAssetEntryModal").modal("hide");
			$("#confirmUpdateModal").modal("hide");
			showPopup("updated the data Successfully", "AmsEntry.jsp"); // Reload table
		},

		error: function(xhr) {
			console.error("Update failed:", xhr);
			alert("Error updating asset!");
		}
	});
}







$("#updateAssetEntryModal .close").on("click", function() {
	$("#updateAssetEntryModal").modal("hide");
	
})


$("#updateAssetEntryModal .btn-secondary").on("click", function() {
	$("#updateAssetEntryModal").modal("hide");
	
});

$(document).on('hidden.bs.modal', function() {
	$('body').removeClass('modal-open');
	$('.modal-backdrop').remove();
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




function initUniversalSelect2Up(parentModal = null) {
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



function setUpdateDateLimits() {
	const today = new Date().toISOString().split("T")[0];

	$("#purchaseDateUp").attr("min", today);
	$("#warrantyStartUp").attr("min", today);
	$("#warrantyEndUp").attr("min", today);

	// Warranty End cannot be < Start
	$("#warrantyStartUp").on("change", function() {
		const startDate = $(this).val();
		$("#warrantyEndUp").attr("min", startDate);
	});
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
