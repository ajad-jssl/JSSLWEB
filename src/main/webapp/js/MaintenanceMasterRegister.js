
$("#modaltype").click(function (){
	$("#exampleModalScrollablestype1").modal("show");
})

$("#modalpage").click(function (){
	$("#exampleModalScrollablePages").modal("show");
})

$("#usertype").click(function (){
	$("#workerMappingModal").modal("show");
})

$("#designatype").click(function (){
	$("#exampleModalScrollabledesignation").modal("show");
})

function allowTodayAndFuture(id){
    const today = new Date().toISOString().split("T")[0];
    document.getElementById(id).setAttribute("min", today);
}

// Call for your fields


$(document).ready(function () {
	
	allowTodayAndFuture("purchaseDate");
	allowTodayAndFuture("warranteStartDate");
	loadCountries();
	$("#warranteStartDate").on("change", function () {

	       let startDate = $(this).val();

	       // End date cannot be before start date
	       $("#warranteEndDate").attr("min", startDate);

	       // Optional: clear end date if it's already before start date
	       if ($("#warranteEndDate").val() < startDate) {
	           $("#warranteEndDate").val("");
	       }
	   });
	   $("#warranteStartDateUp").on("change", function () {
	       let startDate = $(this).val();
	       $("#warranteEndDateUp").attr("min", startDate);
	       if ($("#warranteEndDateUp").val() < startDate) {
	           $("#warranteEndDateUp").val("");
	       }
	   })
    fetchMachineDescriptions();
	loadDepartments();
loadMachines();

	loadDepartmentDropdown();
	loadMachineDescriptionDropdown();
		loadEmployees(3);
	loadEmployeesUp(3);
		loadWorkerMappings();
		loaddesignationmappings();
});

function loadCountries() {
    $.ajax({
        url: new URL("/jssl/country/getAllCountryListNew", baseUrl).toString(),
        type: "GET",
        xhrFields: { withCredentials: true },
        success: function(response) {

            let countryDropdown   = $("#countryId");
            let countryDropdownUp = $("#countryIdUp");  // ADD THIS

            countryDropdown.empty();
            countryDropdownUp.empty();

            countryDropdown.append('<option value="">Select Country</option>');
            countryDropdownUp.append('<option value="">Select Country</option>');

            if (response && response.AllCountryDetailsNew && response.AllCountryDetailsNew.length > 0) {
                $.each(response.AllCountryDetailsNew, function(index, country) {
                    let opt = `<option value="${country.id}">
                                   ${country.country_code} - ${country.country_name}
                               </option>`;
                    countryDropdown.append(opt);
                    countryDropdownUp.append(opt);
                });
            }
        },
        error: function(xhr) { console.error("Failed to load countries", xhr); }
    });
}


$("#createModule").click(function () {

    let machineDescription = $("#module").val().trim();

    if (machineDescription === "") {
        $("#moduleError").show();
        return;
    }

    $("#moduleError").hide();

    $.ajax({
        url: new URL(
            "api/machine-description/create",
            baseUrl
        ).toString(),

        type: "POST",

        xhrFields: {
            withCredentials: true
        },

        data: {
            machineDescription: machineDescription
        },

        success: function (response) {

            if (response.status) {

               /* alert(response.message);
				window.location = 'MaintenanceMasterRegister.jsp';*/
				
				showPopup(response.message,"MaintenanceMasterRegister.jsp");
                $("#exampleModalScrollablestype1").modal("hide");

                $("#module").val("");

               // loadMachineDescriptions();

            } else {
			
				   $("#duplicateMessage").text(response.message);
				$("#duplicateModal").modal("show");
              
            }
        },

        error: function () {
            alert("Something went wrong");
        }
    });
});



function fetchMachineDescriptions() {

    $.ajax({
        url: new URL(
            "/api/machine-description/getAll",
            baseUrl
        ).toString(),

        type: "GET",

        xhrFields: {
            withCredentials: true
        },

        success: function(data) {

            let tbody = $("#typeSelectionTableBody");

            tbody.empty();

            if (!data || data.length === 0) {

                tbody.append(`
                    <tr>
                        <td colspan="3" class="text-center">
                            No Records Found
                        </td>
                    </tr>
                `);

                return;
            }

            $.each(data, function(index, item) {

                tbody.append(`
                    <tr>
                        <td>${index + 1}</td>
                        <td>${(item.machineDescription || '').toUpperCase()}</td>
                        <td>
                            <i class="fa fa-pen text-primary cursor-pointer" 
                               title="Edit"
                               onclick="editMachineDescription(${item.machineDescId})">
                            </i>
                        </td>
                    </tr>
                `);
            });

            if ($.fn.DataTable.isDataTable('#TypeSelectiontableID')) {
                $('#TypeSelectiontableID').DataTable().destroy();
            }

            $('#TypeSelectiontableID').DataTable({
                paging: true,
                pageLength: 10,
                searching: true,
                ordering: true
            });
        },

        error: function(xhr) {
            console.error(xhr);
            alert("Failed to load data");
        }
    });
}

let selectedMachineDescId = null;
let originalMachineDescription = "";

function editMachineDescription(machineDescId) {

    $.ajax({

        url: new URL(
            `/api/machine-description/get/${machineDescId}`,
            baseUrl
        ).toString(),

        type: "GET",

        xhrFields: {
            withCredentials: true
        },

		success: function(response) {

		    selectedMachineDescId =
		        response.machineDescId;

		    originalMachineDescription =
		        (response.machineDescription || "").trim();

		    $("#typeUp")
		        .val(response.machineDescription);

		    $("#exampleModalScrollablestypeUp")
		        .modal("show");
		}
    });
}


$("#createtypeUp").click(function () {

    let machineDescription = $("#typeUp").val().trim();

    if (machineDescription === "") {
        $("#typeUpError").show();
        return;
    }

    $("#typeUpError").hide();

    // No changes check
    if (machineDescription === originalMachineDescription) {
        showPopup("No fields were changed","MaintenanceMasterRegister.jsp");
        return;
    }

    $.ajax({

        url: new URL(
            "/api/machine-description/update",
            baseUrl
        ).toString(),

        type: "POST",

        xhrFields: {
            withCredentials: true
        },

        data: {
            machineDescId: selectedMachineDescId,
            machineDescription: machineDescription
        },

        success: function(response) {

            if (response.status) {

                fetchMachineDescriptions();

                $("#exampleModalScrollablestypeUp")
                    .modal("hide");

                showPopup(response.message,"MaintenanceMasterRegister.jsp");

            } else {

                // Duplicate message from backend
                $("#duplicateMessage")
                    .text(response.message);

                $("#duplicateModal")
                    .modal("show");
            }
        },

        error: function() {

            showPopup("Something went wrong");
        }
    });
});



$("#createPage").click(function () {

    let departmentName = $("#pagediplay").val().trim();

    if (departmentName === "") {

        $("#pageDisplayError").show();
        return;
    }

    $("#pageDisplayError").hide();

    let selectedFactory =
        localStorage.getItem("selectedFactoryId");

    $.ajax({

        url: new URL(
            "api/department/create",
            baseUrl
        ).toString(),

        type: "POST",

        xhrFields: {
            withCredentials: true
        },

        data: {
            departmentName: departmentName,
            factory_id: selectedFactory
        },

        success: function(response) {

            if (response.status) {

                showPopup(response.message,"MaintenanceMasterRegister.jsp");

                $("#exampleModalScrollablePages")
                    .modal("hide");

                $("#pagediplay").val("");

                //loadDepartments();

            } else {

                $("#duplicateMessage")
                    .text(response.message);

                $("#duplicateModal")
                    .modal("show");
            }
        },

        error: function() {

            showPopup("Something went wrong");
        }
    });
});


function loadDepartments() {

    let factory_id = localStorage.getItem("selectedFactoryId");

    $.ajax({
        url: new URL("/api/department/getAll", baseUrl).toString(),

        type: "GET",

        data: {
            factoryId: factory_id
        },

        xhrFields: {
            withCredentials: true
        },

        success: function(data) {

            let tbody = $("#pageSelctionOuterbody");
            tbody.empty();

            if (!data || data.length === 0) {
                tbody.append(`
                    <tr>
                        <td colspan="3" class="text-center">
                            No Records Found
                        </td>
                    </tr>
                `);
                return;
            }

            $.each(data, function(index, item) {
                tbody.append(`
                    <tr>
                        <td>${index + 1}</td>
                        <td>${item.DEPT_NAME}</td>
                        <td>
                            <i class="fa fa-pen text-primary cursor-pointer"
                               title="Edit"
                               onclick="editDept(${item.DEPT_ID}, '${item.DEPT_NAME}')">
                            </i>
                        </td>
                    </tr>
                `);
            });

            if ($.fn.DataTable.isDataTable('#pageSelectionOuterTable')) {
                $('#pageSelectionOuterTable').DataTable().destroy();
            }

            $('#pageSelectionOuterTable').DataTable({
                paging: true,
                pageLength: 10,
                searching: true,
                ordering: true
            });
        },

        error: function(xhr) {
            console.error(xhr);
            alert("Failed to load departments");
        }
    });
}

let selectedDeptId = null;
let originalDepartmentName = "";

function editDept(deptId, departmentName) {

    selectedDeptId = deptId;

    originalDepartmentName =
        (departmentName || "").trim();

    $("#pagediplayUp").val(departmentName);

    $("#exampleModalScrollablePagesUp")
        .modal("show");
}

$("#createPageUp").click(function () {

    let departmentName =
        $("#pagediplayUp").val().trim();

    if (departmentName === "") {

        $("#pageDisplayErrorUp").show();
        return;
    }

    $("#pageDisplayErrorUp").hide();

    // No changes check
    if (departmentName === originalDepartmentName) {

        showPopup(
            "No fields were changed",
            "MaintenanceMasterRegister.jsp"
        );
        return;
    }

    $.ajax({

        url: new URL(
            "api/department/update",
            baseUrl
        ).toString(),

        type: "POST",

        xhrFields: {
            withCredentials: true
        },

        data: {

            deptId: selectedDeptId,
            departmentName: departmentName
        },

        success: function(response) {

            if (response.status) {

                $("#exampleModalScrollablePagesUp")
                    .modal("hide");

                loadDepartments();

                showPopup(
                    response.message,
                    "MaintenanceMasterRegister.jsp"
                );

            } else {

                $("#duplicateMessage")
                    .text(response.message);

                $("#duplicateModal")
                    .modal("show");
            }
        },

        error: function() {

            showPopup("Something went wrong");
        }
    });
});






$("#modalpageAction").click(function (){
	$("#machineModal").modal("show");
})


$("#createMachine").click(function () {

    let factory_id = localStorage.getItem("selectedFactoryId");

    let machineCode = $("#machineCode").val().trim();
    let machineSubCode = $("#machineSubCode").val().trim();
    let serialNo = $("#serialNo").val().trim();
    let modelNo = $("#modelNo").val().trim();
    let poNumber = $("#PoNumber").val().trim();

    let purchaseDate = $("#purchaseDate").val();
    let warrantyStartDate = $("#warranteStartDate").val();
    let warrantyEndDate = $("#warranteEndDate").val();
    let manufactureDate = $("#manufactureDate").val();

    let manufacturerName = $("#manufacturerName").val().trim();
    let countryId = $("#countryId").val();

    let machineDescriptionId = $("#machineDescriptionId").val();
    let deptId = $("#departmentId").val();
	
	let machineDes =$("#machdes").val().trim();

    let isValid = true;

    if (machineCode === "") {
        $("#MachineCodeError").show();
        isValid = false;
    } else {
        $("#MachineCodeError").hide();
    }

    if (machineSubCode === "") {
        $("#MachineSubCodeError").show();
        isValid = false;
    } else {
        $("#MachineSubCodeError").hide();
    }

    if (serialNo === "") {
        $("#MachineSerialError").show();
        isValid = false;
    } else {
        $("#MachineSerialError").hide();
    }

    if (modelNo === "") {
        $("#MachineModalError").show();
        isValid = false;
    } else {
        $("#MachineModalError").hide();
    }

    if (poNumber === "") {
        $("#PurchaseNoError").show();
        isValid = false;
    } else {
        $("#PurchaseNoError").hide();
    }

    if (purchaseDate === "") {
        $("#PurchaseDateError").show();
        isValid = false;
    } else {
        $("#PurchaseDateError").hide();
    }

    if (warrantyStartDate === "") {
        $("#warrateStartDateError").show();
        isValid = false;
    } else {
        $("#warrateStartDateError").hide();
    }

    if (warrantyEndDate === "") {
        $("#warrateEndDateError").show();
        isValid = false;
    } else {
        $("#warrateEndDateError").hide();
    }

    if (manufactureDate === "") {
        $("#manufatureDateError").show();
        isValid = false;
    } else {
        $("#manufatureDateError").hide();
    }

    if (manufacturerName === "") {
        $("#manufacturerNameError").show();
        isValid = false;
    }

    if (countryId === "") {
        $("#countryDateError").show();
        isValid = false;
    } else {
        $("#countryDateError").hide();
    }

    if (deptId === "") {
        $("#MachineLocationError").show();
        isValid = false;
    } else {
        $("#MachineLocationError").hide();
    }

    if (machineDescriptionId === "") {
        $("#MachineCategoryError").show();
        isValid = false;
    } else {
        $("#MachineCategoryError").hide();
    }
	
	if (machineDes === "") {
	      $("#machdesError").show();
	      isValid = false;
	  } else {
	      $("#machdesError").hide();
	  }
	  
	  const itemIds = getSelectedItemIds();

	  if (!itemIds || itemIds.length === 0) {
	      $("#itemserror").text("Please select at least one item.").show();
	      isValid = false;
	  } else {
	      $("#itemserror").hide().text("");
	  }

    if (!isValid) {
        return;
    }

 

    $.ajax({
        url: new URL(
            "api/machine/create",
            baseUrl
        ).toString(),

        type: "POST",

        traditional: true,

        xhrFields: {
            withCredentials: true
        },

        data: {

            machineCode: machineCode,
            machineSubCode: machineSubCode,
            serialNo: serialNo,
            modelNo: modelNo,
            poNumber: poNumber,

            purchaseDate: purchaseDate,
            warrantyStartDate: warrantyStartDate,
            warrantyEndDate: warrantyEndDate,
            manufactureDate: manufactureDate,

            manufacturerName: manufacturerName,
            countryId: countryId,

            machineDescriptionId: machineDescriptionId,
            deptId: deptId,

            factory_id: factory_id,
            createdBy: createdById,

            itemIds: itemIds,
			machDes:machineDes
        },

        success: function(response) {

            if (response.status) {

             showPopup(
                    response.message,
                    "MaintenanceMasterRegister.jsp");
               

                $("#machineModal").modal("hide");

               // loadMachines();

            } else {

                $("#duplicateMessage")
                    .text(response.message);

                $("#duplicateModal")
                    .modal("show");
            }
        },

        error: function(xhr) {

            console.log(xhr.responseText);

            showPopup("Something went wrong");
        }
    });
});
function loadMachines() {

    let factoryId = localStorage.getItem("selectedFactoryId");

    $.ajax({

        url: new URL(
            "/api/machine/getAll",
            baseUrl
        ).toString(),

        type: "GET",

        data: {
            factoryId: factoryId
        },

        xhrFields: {
            withCredentials: true
        },

        success: function(response) {

            let tbody = $("#machineTableBody");
            tbody.empty();

            if (!response || response.length === 0) {

                tbody.append(`
                    <tr>
                        <td colspan="9" class="text-center">
                            No Records Found
                        </td>
                    </tr>
                `);

                return;
            }

            $.each(response, function(index, item) {

                tbody.append(`
                    <tr>
                        <td>${index + 1}</td>
                        <td>${item.MACHINE_CODE || ''}</td>
                        <td>${item.MACHINE_SUBCODE || ''}</td>
                        <td>${item.MACHINE_DESCRIPTION || ''}</td>
                        <td>${item.DEPT_NAME || ''}</td>
                        <td>${item.MODEL_NO || ''}</td>
                        <td>${item.SERIAL_NO || ''}</td>
                        <td>${item.MANUFACTURER_NAME || ''}</td>
                        <td>
                            <i class="fa fa-pen text-primary"
                               title="Edit"
                               onclick="editMachine(${item.MACHINE_ID})">
                            </i>
                        </td>
                    </tr>
                `);

            });

            if ($.fn.DataTable.isDataTable('#machineTable')) {
                $('#machineTable').DataTable().destroy();
            }

            $('#machineTable').DataTable({
                paging: true,
                searching: true,
                ordering: true,
                pageLength: 10
            });
        }
    });
}

// Store originals for "no fields changed" check
let originalMachineData = {};

let originalItemIds = [];  // ADD THIS

function editMachine(machineId) {
    $.ajax({
        url: new URL("api/machine/getById", baseUrl).toString(),
        type: "GET",
        data: { machineId: machineId },
        xhrFields: { withCredentials: true },

        success: async function(data) {

            // Store originals
            originalMachineData = {
                machineCode:         (data.MACHINE_CODE        || "").trim(),
                machineSubCode:      (data.MACHINE_SUBCODE     || "").trim(),
                serialNo:            (data.SERIAL_NO           || "").trim(),
                modelNo:             (data.MODEL_NO            || "").trim(),
                poNumber:            (data.PO_NUMBER           || "").trim(),
                purchaseDate:        (data.PURCHASE_DATE       || ""),
                warrantyStartDate:   (data.WARRANTY_START_DATE || ""),
                warrantyEndDate:     (data.WARRANTY_END_DATE   || ""),
                manufactureDate:     (data.MANUFACTURE_DATE    || ""),
                manufacturerName:    (data.MANUFACTURER_NAME   || "").trim(),
                countryId:           (data.COUNTRY_ID          || "").toString(),
                deptId:              (data.DEPT_ID             || "").toString(),
                machineDescriptionId:(data.MACHINE_DESCRIPTION || "").toString(),
				machineDes :(data.MACHINE_DESCRIPTION_NAME || "").toString()
				
            };

            // Populate fields
            $("#machineIdUp").val(data.MACHINE_ID);
            $("#machineCodeUp").val(data.MACHINE_CODE);
            $("#machineSubCodeUp").val(data.MACHINE_SUBCODE);
            $("#serialNoUp").val(data.SERIAL_NO);
            $("#modelNoUp").val(data.MODEL_NO);
            $("#PoNumberUp").val(data.PO_NUMBER);
            $("#purchaseDateUp").val(data.PURCHASE_DATE);
            $("#warranteStartDateUp").val(data.WARRANTY_START_DATE);
            $("#warranteEndDateUp").val(data.WARRANTY_END_DATE);
            $("#manufactureDateUp").val(data.MANUFACTURE_DATE);
            $("#manufacturerNameUp").val(data.MANUFACTURER_NAME);
            $("#countryIdUp").val(data.COUNTRY_ID);
            $("#departmentIdUp").val(data.DEPT_ID);
            $("#machineDescriptionIdUp").val(data.MACHINE_DESCRIPTION);
			$("#machdesUp").val(data.MACHINE_DESCRIPTION_NAME);

            if (data.WARRANTY_START_DATE) {
                $("#warranteEndDateUp").attr("min", data.WARRANTY_START_DATE);
            }

            // Load items and THEN capture original item IDs
            await loadSelectedItems(data.MACHINE_ID);

            // ── Capture original selected item IDs after checkboxes are set ──
            originalItemIds = Array.from(
                document.querySelectorAll(
                    "#items1DropdownMenu .item1-checkbox:checked"
                )
            ).map(cb => cb.value).sort();  // sort for reliable comparison

            clearUpdateMachineErrors();

            $("#exampleModalScrollablePagesActionUp").modal("show");
        }
    });
}

function clearUpdateMachineErrors() {
    const ids = [
        "MachineCodeUpError","MachineSubCodeUpError","MachineSerialUpError",
        "MachineModelUpError","PurchaseNoUpError","PurchaseDateUpError",
        "WarrantyStartUpError","WarrantyEndUpError","ManufactureDateUpError",
        "ManufacturerNameUpError","CountryUpError","MachineLocationUpError",
        "MachineDescUpError"
    ];
    ids.forEach(id => $("#" + id).hide());
}

$("#updateMachine").click(function () {

    clearUpdateMachineErrors();

    // Collect values
    let machineCode        = $("#machineCodeUp").val().trim();
    let machineSubCode     = $("#machineSubCodeUp").val().trim();
    let serialNo           = $("#serialNoUp").val().trim();
    let modelNo            = $("#modelNoUp").val().trim();
    let poNumber           = $("#PoNumberUp").val().trim();
    let purchaseDate       = $("#purchaseDateUp").val();
    let warrantyStartDate  = $("#warranteStartDateUp").val();
    let warrantyEndDate    = $("#warranteEndDateUp").val();
    let manufactureDate    = $("#manufactureDateUp").val();
    let manufacturerName   = $("#manufacturerNameUp").val().trim();
    let countryId          = $("#countryIdUp").val();
    let deptId             = $("#departmentIdUp").val();
    let machineDescriptionId = $("#machineDescriptionIdUp").val();
    let machineId          = $("#machineIdUp").val();
    let selectedFactory    = localStorage.getItem("selectedFactoryId");

    // --- Validation ---
    let isValid = true;

    if (machineCode === "") {
        $("#MachineCodeUpError").show(); isValid = false;
    }
    if (machineSubCode === "") {
        $("#MachineSubCodeUpError").show(); isValid = false;
    }
    if (serialNo === "") {
        $("#MachineSerialUpError").show(); isValid = false;
    }
    if (modelNo === "") {
        $("#MachineModelUpError").show(); isValid = false;
    }
    if (poNumber === "") {
        $("#PurchaseNoUpError").show(); isValid = false;
    }
    if (purchaseDate === "") {
        $("#PurchaseDateUpError").show(); isValid = false;
    }
    if (warrantyStartDate === "") {
        $("#WarrantyStartUpError").show(); isValid = false;
    }
    if (warrantyEndDate === "") {
        $("#WarrantyEndUpError").show(); isValid = false;
    }
    if (manufactureDate === "") {
        $("#ManufactureDateUpError").show(); isValid = false;
    }
    if (manufacturerName === "") {
        $("#ManufacturerNameUpError").show(); isValid = false;
    }
    if (countryId === "") {
        $("#CountryUpError").show(); isValid = false;
    }
    if (deptId === "") {
        $("#MachineLocationUpError").show(); isValid = false;
    }
    if (machineDescriptionId === "") {
        $("#MachineDescUpError").show(); isValid = false;
    }
	let machineDes = $("#machdesUp").val().trim();

	if (machineDes === "") {
	    $("#machdesErrorUp").show(); isValid = false;
	} else {
	    $("#machdesErrorUp").hide();
	}
	
	//const currentItemIds = getSelectedItemIds1().map(id => String(id)).sort();



    if (!isValid) return;

    // --- No fields changed check ---
	const currentItemIds = getSelectedItemIds1()
	        .map(id => String(id))
	        .sort();  // sort for reliable comparison
			
			if (currentItemIds.length === 0) {
			    $("#items1error").text("Please select at least one item.").show(); isValid = false;
			} else {
			    $("#items1error").hide().text("");
			}

	    // Compare items: same length AND every id matches
	    const itemsUnchanged =
	        currentItemIds.length === originalItemIds.length &&
	        currentItemIds.every((id, index) => id === originalItemIds[index]);

	    let noChange =
	        machineCode          === originalMachineData.machineCode &&
	        machineSubCode       === originalMachineData.machineSubCode &&
	        serialNo             === originalMachineData.serialNo &&
	        modelNo              === originalMachineData.modelNo &&
	        poNumber             === originalMachineData.poNumber &&
	        purchaseDate         === originalMachineData.purchaseDate &&
	        warrantyStartDate    === originalMachineData.warrantyStartDate &&
	        warrantyEndDate      === originalMachineData.warrantyEndDate &&
	        manufactureDate      === originalMachineData.manufactureDate &&
	        manufacturerName     === originalMachineData.manufacturerName &&
	        countryId            === originalMachineData.countryId &&
	        deptId               === originalMachineData.deptId &&
	        machineDescriptionId === originalMachineData.machineDescriptionId &&
			machineDes           === originalMachineData.machineDes && 
	        itemsUnchanged;  // ADD THIS

	    if (noChange) {
	        showPopup("No fields were changed", "MaintenanceMasterRegister.jsp");
	        return;
	    }

    const selectedItemIds = getSelectedItemIds1();

    // --- AJAX update ---
    $.ajax({
        url: new URL("api/machine/update", baseUrl).toString(),
        type: "POST",
        traditional: true,
        xhrFields: { withCredentials: true },
        data: {
            machineId:           machineId,
            machineCode:         machineCode,
            machineSubCode:      machineSubCode,
            serialNo:            serialNo,
            modelNo:             modelNo,
            poNumber:            poNumber,
            purchaseDate:        purchaseDate,
            warrantyStartDate:   warrantyStartDate,
            warrantyEndDate:     warrantyEndDate,
            manufactureDate:     manufactureDate,
            manufacturerName:    manufacturerName,
            countryId:           countryId,
            machineDescriptionId: machineDescriptionId,
            deptId:              deptId,
            createdBy:           createdById,
            factoryId:           selectedFactory,
            itemIds:             selectedItemIds,
			machDes: machineDes  
        },
        success: function(response) {
            if (response.status) {
                $("#exampleModalScrollablePagesActionUp").modal("hide");
                showPopup(response.message, "MaintenanceMasterRegister.jsp");
            } else {
                // Duplicate message (machine code / sub code / serial no)
                $("#duplicateMessage").text(response.message);
                $("#duplicateModal").modal("show");
            }
        },
        error: function(xhr) {
            console.log(xhr.responseText);
			alert("seemthing went wrong");
            //showPopup("Something went wrong");
        }
    });
});



async function loadSelectedItems(machineId) {

    const response = await fetch(
        new URL(
            `/api/machine/items/${machineId}`,
            baseUrl
        ),
        {
            credentials: "include"
        }
    );

    const selectedItems = await response.json();

    document.querySelectorAll(
        "#items1DropdownMenu .item1-checkbox"
    ).forEach(cb => cb.checked = false);

    selectedItems.forEach(item => {

        const checkbox = document.querySelector(
            `#items1DropdownMenu .item1-checkbox[value="${item.items_id}"]`
        );

        if (checkbox) {
            checkbox.checked = true;
        }
    });

    updateSelectedItems1();
}



function loadDepartmentDropdown() {

    let factoryId = localStorage.getItem("selectedFactoryId");

    $.ajax({

        url: new URL(
            "/api/department/getAll",
            baseUrl
        ).toString(),

        type: "GET",

        data: {
            factoryId: factoryId
        },

        xhrFields: {
            withCredentials: true
        },

        success: function(response) {

            let dropdown = $("#departmentId");
            let dropdownUp = $("#departmentIdUp");

            dropdown.empty();
            dropdownUp.empty();

            dropdown.append(
                '<option value="">Select Department</option>'
            );

            dropdownUp.append(
                '<option value="">Select Department</option>'
            );

            $.each(response, function(index, item) {

                dropdown.append(`
                    <option value="${item.DEPT_ID}">
                        ${item.DEPT_NAME}
                    </option>
                `);

                dropdownUp.append(`
                    <option value="${item.DEPT_ID}">
                        ${item.DEPT_NAME}
                    </option>
                `);
            });
        },

        error: function(xhr) {
            console.error(xhr);
            alert("Failed to load departments");
        }
    });
}


function loadMachineDescriptionDropdown() {

    $.ajax({

        url: new URL(
            "/api/machine-description/getAll",
            baseUrl
        ).toString(),

        type: "GET",
		xhrFields: {
		          withCredentials: true
		      },

        success: function(response) {

            let dropdown =
                $("#machineDescriptionId");

            let dropdownUp =
                $("#machineDescriptionIdUp");
		     let usermachinedes = $("#machineCategoryId");
			 let usermachinedesup = $("#machineCategoryIdUp");

            dropdown.empty();
            dropdownUp.empty();
			usermachinedes.empty();
			usermachinedesup.empty();

            dropdown.append(
                '<option value="">Select Machine Category</option>'
            );

            dropdownUp.append(
                '<option value="">Select Machine Category</option>'
            );
			
		    usermachinedes.append(
		 	           '<option value="">Select Machine Category</option>'
			       );

				   usermachinedesup.append(
				    	           '<option value="">Select Machine Category</option>'
				   	       );
            $.each(response, function(index, item) {

                dropdown.append(`
                    <option value="${item.machineDescId}">
                        ${item.machineDescription}
                    </option>
                `);

                dropdownUp.append(`
                    <option value="${item.machineDescId}">
                        ${item.machineDescription}
                    </option>
                `);
				usermachinedes.append(`
				                    <option value="${item.machineDescId}">
				                        ${item.machineDescription}
				                    </option>
				   `);
				   usermachinedesup.append(`
				   				                    <option value="${item.machineDescId}">
				   				                        ${item.machineDescription}
				   				                    </option>
				   				   `);
            });
        }
    });
}




function onCategoryChange() {

    let machineDescriptionId = $("#catSelect").val();

    $.ajax({

        url: new URL(
            "/api/machine/getByDescription",
            baseUrl
        ).toString(),

        type: "GET",

        data: {
            machineDescriptionId: machineDescriptionId
        },

        xhrFields: {
            withCredentials: true
        },

        success: function(response) {

            let machineDropdown =
                $("#machineSelect");

            machineDropdown.empty();

            machineDropdown.append(
                '<option value="">-- Select Machine --</option>'
            );

            $.each(response, function(index, item) {

                machineDropdown.append(`
                    <option value="${item.MACHINE_ID}">
                        ${item.MACHINE_SUBCODE}
                    </option>
                `);

            });

            machineDropdown.prop("disabled", false);
        }
    });
}

document.addEventListener("DOMContentLoaded", function () {

    initializeDropdown(
        "itemsDropdown",
        "itemsDropdownMenu"
    );

    initializeDropdown(
        "itemsDropdown1",
        "items1DropdownMenu"
    );

    fetchitems();
    fetchitems1();
});

function initializeDropdown(buttonId, menuId) {

    const button = document.getElementById(buttonId);
    const menu = document.getElementById(menuId);

    if (!button || !menu) return;

    button.addEventListener("click", function (e) {

        e.stopPropagation();

        // Close all dropdowns first
        document.querySelectorAll(".custom-dropdown-menu")
            .forEach(m => {
                if (m !== menu) {
                    m.style.display = "none";
                }
            });

        menu.style.display =
            menu.style.display === "block"
                ? "none"
                : "block";
    });

    menu.addEventListener("click", function (e) {
        e.stopPropagation();
    });
}

document.addEventListener("click", function () {

    document.querySelectorAll(".custom-dropdown-menu")
        .forEach(menu => {
            menu.style.display = "none";
        });
});

async function fetchitems() {
    try {
        const url = new URL('/api/items', baseUrl);

        const response = await fetch(url, {
            method: "GET",
            credentials: "include"
        });

        if (!response.ok) {
            throw new Error("Failed to fetch items data");
        }

        const items = await response.json();


        const dropdownMenu =
            document.getElementById("itemsDropdownMenu");

        dropdownMenu.innerHTML = "";

        items.forEach((item) => {

            if (item.itemid && item.itmDescription1) {

                const div = document.createElement("div");
				
				let itemdisplayDiscription = item.itemNo +'-'+item.itmDescription1 +''+'('+item.um +')';

                div.innerHTML = `
                    <label style="display:block;padding:5px;cursor:pointer;">
                        <input type="checkbox"
                               class="item-checkbox"
                               value="${item.itemid}"
                               data-name="${item.itmDescription1}">
                        ${itemdisplayDiscription}
                    </label>
                `;

                dropdownMenu.appendChild(div);
            }
        });

        dropdownMenu.addEventListener(
            "change",
            updateSelectedItems
        );


    } catch (error) {
        console.error("Error fetching items data:", error);
    }
}

function updateSelectedItems() {
    const checkedItems = document.querySelectorAll(
        "#itemsDropdownMenu .item-checkbox:checked"
    );

    const button = document.getElementById("itemsDropdown");

    if (checkedItems.length === 0) {
        button.textContent = "Select Items";
        return;
    }

    button.textContent = `${checkedItems.length} item(s) selected`;
}

function getSelectedItemIds() {
    return Array.from(
        document.querySelectorAll(
            "#itemsDropdownMenu .item-checkbox:checked"
        )
    ).map(item => item.value);
}


async function fetchitems1() {
    try {
        const url = new URL('/api/items', baseUrl);

        const response = await fetch(url, {
            method: "GET",
            credentials: "include"
        });

        const items = await response.json();

        const dropdownMenu =
            document.getElementById("items1DropdownMenu");

        dropdownMenu.innerHTML = "";

        items.forEach((item) => {

            const div = document.createElement("div");
			
			let itemdisplayDiscription = item.itemNo +'-'+item.itmDescription1 +''+'('+item.um +')';

            div.innerHTML = `
                <label style="display:block;padding:5px;cursor:pointer;">
                    <input type="checkbox"
                           class="item1-checkbox"
                           value="${item.itemid}">
                    ${itemdisplayDiscription}
                </label>
            `;

            dropdownMenu.appendChild(div);
        });

		dropdownMenu.addEventListener(
		      "change",
		      updateSelectedItems1
		  );

    } catch (error) {
        console.error(error);
    }
}


function updateSelectedItems1() {

    const checkedItems = document.querySelectorAll(
        "#items1DropdownMenu .item1-checkbox:checked"
    );

    const button =
        document.getElementById("itemsDropdown1");

    if (checkedItems.length === 0) {

        button.textContent = "Select Items";
        return;
    }

    button.textContent =
        `${checkedItems.length} item(s) selected`;
}

function getSelectedItemIds1() {

    return Array.from(
        document.querySelectorAll(
            "#items1DropdownMenu .item1-checkbox:checked"
        )
    ).map(item => item.value);
}

function loadEmployees(locid) {

    $.ajax({
        url: baseUrl + "/api/websmartuser/getEmployeesByLocation",
        type: "GET",
        data: {
            locid: locid
        },
        xhrFields: {
            withCredentials: true
        },
        success: function(response) {

            $("#employeeSelect").empty();
						
						   
	  

            $("#employeeSelect").append(
                '<option value="">Select Employee</option>'
							
            );

            $.each(response, function(index, emp) {
				  
   

                $("#employeeSelect").append(
                    $('<option>', {
                        value: emp.EmpId, // dropdown value = EmpId
                        text: emp.EmployeeDisplay,
                        'data-empcode': emp.EmpCode,
                        'data-mobile': emp.telephone || ''
                    })
                );

            });
        }
    });
}

$("#employeeSelect").on("change", function() {

    let selectedOption = $(this).find("option:selected");

    let empCode = selectedOption.data("empcode");
    let mobileNo = selectedOption.data("mobile");

    $("#workerEmpId").val(empCode || "");
    $("#workerMobileNo").val(mobileNo || "");
						   
								 
											 
				 
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

function clearErrors() {
						  
								  
		   

    $(".text-danger").addClass("d-none").text("");
														  
		 

}

function showError(id, message) {

    $("#" + id)
        .removeClass("d-none")
        .text(message);

}

$("#createWorkerMapping").click(function () {

    clearErrors();

    var empId             = $("#employeeSelect").val();
    var workerEmpCode     = $("#workerEmpId").val().trim();
    var workerMobileNo    = $("#workerMobileNo").val().trim();
    var machineCategoryId = $("#machineCategoryId").val();
    var wokeremail        = $("#workerEmail").val().trim();

    var selectedOption       = $("#employeeSelect option:selected");
    var employeeDisplayName  = selectedOption.text();
    var createdBy            = sessionStorage.getItem("id");

    // Get selected job type IDs
    var selectedDesignations = getSelectedDesignationIds();  // ADD THIS

    let isValid = true;

    if (!empId) {
        showError("workerEmpIdError", "Please select an employee.");
        isValid = false;
    }

    if (!machineCategoryId) {
        showError("machineCategoryError", "Please select a machine category.");
        isValid = false;
    }

    if (workerMobileNo === "") {
        showError("workerMobileNoError", "Please enter mobile number.");
        isValid = false;
    } else if (!/^[0-9]{10}$/.test(workerMobileNo)) {
        showError("workerMobileNoError", "Mobile number must be 10 digits.");
        isValid = false;
    }

    if (!wokeremail) {
        showError("workerMoemailNoError", "Please enter an Email.");
        isValid = false;
    }

    // ── Job Type validation ──────────────────────────────────────
    if (selectedDesignations.length === 0) {
        showError("designationDropdownError", "Please select at least one Job Type.");
        isValid = false;
    }
    // ────────────────────────────────────────────────────────────

    if (!isValid) return;

    let factroy_id = localStorage.getItem("selectedFactoryId");

    var request = {
        empId:               parseInt(empId),
        workerEmpCode:       workerEmpCode,
        workerMobileNo:      workerMobileNo,
        machineCategoryId:   parseInt(machineCategoryId),
        employeeDisplayName: employeeDisplayName,
        createdBy:           createdBy,
        factoryId:           factroy_id,
        email:               wokeremail,
        designationIds:      selectedDesignations   // use variable directly
    };

    $.ajax({
        url:         baseUrl + "/api/createWorkerMapping",
        type:        "POST",
        contentType: "application/json",
        data:        JSON.stringify(request),
        xhrFields:   { withCredentials: true },

        success: function(response) {
            $("#workerMappingModal").modal("hide");
            showPopup("Worker mapped successfully.", "MaintenanceMasterRegister.jsp");
        },

        error: function(xhr) {
            let message = xhr.responseText || "Worker already mapped.";
            showCenterMessage(message);
        }
    });
});

function showCenterMessage(message) {

    $("#messageModalText").text(message);

    $("#messageModal").modal("show");

}


							  
		 
												   

function loadWorkerMappings() {

    var Factoryid = localStorage.getItem('selectedFactoryId');

    $.ajax({
        url: baseUrl + "/api/getAllWorkerMappings?Factoryid=" + encodeURIComponent(Factoryid),
        type: "GET",

        xhrFields: {
            withCredentials: true
        },

        success: function(response) {

            let tbody = $("#userSelectionTableBody");
            tbody.empty();

            if (!response || response.length === 0) {

                tbody.append(`
                    <tr>
                        <td colspan="4" class="text-center">
                            No Records Found
                        </td>
                    </tr>
                `);

                return;
            }

            $.each(response, function(index, item) {

                tbody.append(`
                    <tr>
                        <td>${index + 1}</td>
                        <td>${item.employee_name || ''}</td>
                        <td>${item.machineDescription || ''}</td>
                        <td>
                            <i class="fa fa-pen text-primary"
                               style="cursor:pointer"
                               title="Edit"
                               onclick="editWorkerMapping(${item.id})">
                            </i>
                        </td>
                    </tr>
                `);

            });

            if ($.fn.DataTable.isDataTable('#UserSelectiontableID')) {
                $('#UserSelectiontableID').DataTable().destroy();
            }

            $('#UserSelectiontableID').DataTable({
                paging: true,
                pageLength: 10,
                searching: true,
                ordering: true
            });
        },

        error: function(xhr) {
            console.error(xhr);
            alert("Failed to load worker mappings.");
        }
    });
}


function loaddesignationmappings() {
						  
								  
		   

    $.ajax({

        url: baseUrl + "/api/getAlldesignationrMappings",
														  

        type: "GET",

        xhrFields: {
            withCredentials: true
        },

        success: function(response) {

            let tbody = $("#designationTableBody");
																		 
										  
												 
												  
										   
						
			  

            tbody.empty();
		   

            if (!response || response.length === 0) {
				 
							
	  

                tbody.append(`
                    <tr>
                        <td colspan="4" class="text-center">
                            No Records Found
                        </td>
                    </tr>
                `);

                return;
            }

            $.each(response, function(index, item) {

                tbody.append(`
                    <tr>
                        <td>${index + 1}</td>
                        <td>${item.DESIGNATION_NAME || ''}</td>
                        <td>
                            <i class="fa fa-pen text-primary"
                               style="cursor:pointer"
                               title="Edit"
                               onclick="editdesignationMapping(${item.DESIGNATON_ID})">
                            </i>
                        </td>
                    </tr>
                `);

            });

            if ($.fn.DataTable.isDataTable('#designationtableID')) {
                $('#designationtableID').DataTable().destroy();
            }

            $('#designationtableID').DataTable({
                paging: true,
                pageLength: 10,
                searching: true,
                ordering: true
            });
        },

        error: function(xhr) {

            console.error(xhr);

            alert("Failed to load worker mappings.");
        }
    });
}



$("#employeeSelectUp").on("change", function () {

    let selectedOption =
        $(this).find("option:selected");

    $("#workerEmpIdUp").val(
        selectedOption.data("empcode") || ""
    );
	
	$("#workerMobileNoUp").val(
	       selectedOption.data("mobile") || ""
	   );

  
												  

});

// Store originals for no-change check
let originalWorkerData       = {};
let originalDesignationIdsUp = [];  // track original job types

function editWorkerMapping(id) {

    $.ajax({
        url:  baseUrl + "/api/getWorkerMappingById",
        type: "GET",
        data: { id: id },
        xhrFields: { withCredentials: true },

        success: async function(response) {

            $("#workerMappingIdUp").val(response.id);
            $("#employeeSelectUp").val(response.empId);
            $("#workerEmpIdUp").val(response.workerEmpCode);
            $("#workerMobileNoUp").val(response.workerMobileNo);
            $("#workerEmailup").val(response.workerEmail);
            $("#machineCategoryIdUp").val(response.machineCategoryId);

            // Load designations and pre-check them
            await loadSelectedDesignationsUp(response.id);

            // ── Capture originals AFTER dropdowns are populated ──
            originalWorkerData = {
                empId:           (response.empId            || "").toString(),
                workerMobileNo:  (response.workerMobileNo   || "").trim(),
                workerEmail:     (response.workerEmail       || "").trim(),
                machineCategoryId:(response.machineCategoryId|| "").toString()
            };

            // Capture originally checked designation IDs (after pre-select)
            originalDesignationIdsUp = Array.from(
                document.querySelectorAll(
                    "#designationDropdownMenuUp .worker-desig-up-checkbox:checked"
                )
            ).map(cb => cb.value).sort();
            // ─────────────────────────────────────────────────────

            clearUpdateWorkerErrors();

            $("#workerMappingUpdateModal").modal("show");
        },

        error: function() {
            showCenterMessage("Unable to fetch worker mapping details.");
        }
    });
}
								

function loadEmployeesUp(locid) {

    $.ajax({

        url: baseUrl + "/api/websmartuser/getEmployeesByLocation",

        type: "GET",

        data: {
            locid: locid
        },

        xhrFields: {
            withCredentials: true
        },

        success: function(response) {

            $("#employeeSelectUp").empty();

            $("#employeeSelectUp").append(
                '<option value="">Select Employee</option>'
            );

            $.each(response, function(index, emp) {

                $("#employeeSelectUp").append(
                    $('<option>', {
                        value: emp.EmpId,
                        text: emp.EmployeeDisplay,
                        'data-empcode': emp.EmpCode,
                        'data-mobile': emp.telephone || ''
                    })
                );

            });

        }
    });
}


function clearUpdateWorkerErrors() {
    const ids = [
        "employeeSelectUpError",
        "workerMobileNoUpError",
        "workerEmailUpError",
        "machineCategoryUpError",
        "designationDropdownUpError"
    ];
    ids.forEach(id => $("#" + id).addClass("d-none").text(""));
}

function showUpdateWorkerError(id, message) {
    $("#" + id).removeClass("d-none").text(message);
}

$("#updateWorkerMapping").click(function () {

    clearUpdateWorkerErrors();

    var empId             = $("#employeeSelectUp").val();
    var workerEmpCode     = $("#workerEmpIdUp").val().trim();
    var workerMobileNo    = $("#workerMobileNoUp").val().trim();
    var workerEmail       = $("#workerEmailup").val().trim();
    var machineCategoryId = $("#machineCategoryIdUp").val();
    var selectedDesigs    = getSelectedDesignationIdsUp();

    var employeeDisplayName = $("#employeeSelectUp option:selected").text();
    var modifiedBy          = sessionStorage.getItem("id");
    var factoryId           = localStorage.getItem("selectedFactoryId");

    // ── Validation ───────────────────────────────────────────────
    let isValid = true;

    if (!empId) {
        showUpdateWorkerError("employeeSelectUpError", "Please select an employee.");
        isValid = false;
    }

    if (workerMobileNo === "") {
        showUpdateWorkerError("workerMobileNoUpError", "Please enter mobile number.");
        isValid = false;
    } else if (!/^[0-9]{10}$/.test(workerMobileNo)) {
        showUpdateWorkerError("workerMobileNoUpError", "Mobile number must be 10 digits.");
        isValid = false;
    }

    if (!workerEmail) {
        showUpdateWorkerError("workerEmailUpError", "Please enter an email.");
        isValid = false;
    }

    if (!machineCategoryId) {
        showUpdateWorkerError("machineCategoryUpError", "Please select a machine category.");
        isValid = false;
    }

    if (selectedDesigs.length === 0) {
        showUpdateWorkerError("designationDropdownUpError", "Please select at least one designation.");
        isValid = false;
    }

    if (!isValid) return;

    // ── No fields changed check ──────────────────────────────────
    const currentDesigIds = selectedDesigs
        .map(id => String(id))
        .sort();

    const designationsUnchanged =
        currentDesigIds.length === originalDesignationIdsUp.length &&
        currentDesigIds.every((id, i) => id === originalDesignationIdsUp[i]);

    const noChange =
        empId.toString()            === originalWorkerData.empId            &&
        workerMobileNo              === originalWorkerData.workerMobileNo    &&
        workerEmail                 === originalWorkerData.workerEmail       &&
        machineCategoryId.toString()=== originalWorkerData.machineCategoryId &&
        designationsUnchanged;

    if (noChange) {
        showPopup("No fields were changed", "MaintenanceMasterRegister.jsp");
        return;
    }
    // ─────────────────────────────────────────────────────────────

    var request = {
        id:                  $("#workerMappingIdUp").val(),
        empId:               empId,
        workerEmpCode:       workerEmpCode,
        workerMobileNo:      workerMobileNo,
        email:               workerEmail,
        machineCategoryId:   machineCategoryId,
        employeeDisplayName: employeeDisplayName,
        modifiedBy:          modifiedBy,
        designationIds:      selectedDesigs,
        factoryId:           factoryId
    };

    $.ajax({
        url:         baseUrl + "/api/updateWorkerMapping",
        type:        "POST",
        contentType: "application/json",
        data:        JSON.stringify(request),
        xhrFields:   { withCredentials: true },

        success: function(response) {

            if (response.status === false) {
                $("#duplicateMessage").text(response.message);
                $("#duplicateModal").modal("show");
                return;
            }

            $("#workerMappingUpdateModal").modal("hide");
            loadWorkerMappings();
            showPopup("Worker Mapping Updated Successfully", "MaintenanceMasterRegister.jsp");
        },

        error: function(xhr) {
            $("#duplicateMessage").text(
                xhr.responseText || "Failed to update worker mapping."
            );
            $("#duplicateModal").modal("show");
        }
    });
});
$("#createDesignation").click(function () {

    let designationName = $("#designationName").val().trim();
    let designationCode = $("#designationLCode").val().trim();

    let isValid = true;

    if (designationName === "") {
        $("#designationError").show();
        isValid = false;
    } else {
        $("#designationError").hide();
    }

    if (designationCode === "") {
        $("#designationCodeError").show();
        isValid = false;
    } else {
        $("#designationCodeError").hide();
    }

    if (!isValid) {
        return;
    }

   
    $.ajax({
        url: new URL(
            "api/designation/create",
            baseUrl
        ).toString(),

        type: "POST",

        xhrFields: {
            withCredentials: true
        },

        data: {
            designationName: designationName,
			designationCode:designationCode,
            createdBy: createdById
        },

        success: function (response) {

            if (response.status) {

                $("#exampleModalScrollabledesignation").modal("hide");
                $("#designationName").val("");

                showPopup(
                    "Designation Created Successfully",
                    "MaintenanceMasterRegister.jsp"
                );

            } else {
                alert(response.message);
            }
        },

        error: function () {
            alert("Something went wrong");
        }
    });
});

let selectedDesignationId = null;
let originalDesignationName = "";
let originalDesignationCode = "";

function editdesignationMapping(designationId) {

    $.ajax({

        url: new URL(
         `/api/designation/get/${designationId}`,
            baseUrl
        ).toString(),

        type: "GET",

        xhrFields: {
            withCredentials: true
        },

		success: function(response) {

		    selectedDesignationId = response.designationId;

		    originalDesignationName = response.designationName || "";
		    originalDesignationCode = response.designationCode || "";

		    $("#designationNameUp").val(response.designationName);
		    $("#designationCodeUp").val(response.designationCode);

		    $("#exampleModalScrollabledesignationUp").modal("show");
		}
    });
}
$("#updateDesignation").click(function () {

    let designationName = $("#designationNameUp").val().trim();
    let designationCode = $("#designationCodeUp").val().trim();

    let isValid = true;

    if (designationName === "") {
        $("#designationNameUpError").show();
        isValid = false;
    } else {
        $("#designationNameUpError").hide();
    }

    if (designationCode === "") {
        $("#designationCodeUpError").show();
        isValid = false;
    } else {
        $("#designationCodeUpError").hide();
    }

    if (!isValid) {
        return;
    }
	
	designationName = designationName.trim();
	designationCode = designationCode.trim();

	if (
	    designationName === originalDesignationName &&
	    designationCode === originalDesignationCode
	) {
	    showPopup("No Fields Changes.","MaintenanceMasterRegister.jsp");
	    return;
	}

    $.ajax({

        url: new URL(
            "/api/designation/update",
            baseUrl
        ).toString(),

        type: "POST",

        xhrFields: {
            withCredentials: true
        },

        data: {
            designationId: selectedDesignationId,
            designationName: designationName,
			designationCode:designationCode,
            modifiedBy: createdById
        },

        success: function(response) {

            if (response.status) {

                $("#exampleModalScrollabledesignationUp")
                    .modal("hide");

                showPopup(
                    "Designation Updated Successfully",
                    "MaintenanceMasterRegister.jsp"
                );

                // fetchDesignations();

            } else {
                alert(response.message);
            }
        },

        error: function() {
            alert("Something went wrong");
        }
    });
});


document.addEventListener("DOMContentLoaded", function () {
    initializeDropdown("designationDropdown",   "designationDropdownMenu");
    initializeDropdown("designationDropdownUp", "designationDropdownMenuUp");
    fetchDesignationsForWorker();
    fetchDesignationsForWorkerUp();
});

// Fetch and populate CREATE dropdown
async function fetchDesignationsForWorker() {
    try {
        const url = new URL('/api/getAlldesignationrMappings', baseUrl);
        const res  = await fetch(url, { credentials: "include" });
        const data = await res.json();
        const menu = document.getElementById("designationDropdownMenu");
        menu.innerHTML = "";

        data.forEach(item => {
            const div = document.createElement("div");
            div.innerHTML = `
                <label style="display:block;padding:5px;cursor:pointer;">
                    <input type="checkbox"
                           class="worker-desig-checkbox"
                           value="${item.DESIGNATON_ID}">
                    ${item.DESIGNATION_NAME}
                </label>`;
            menu.appendChild(div);
        });

        menu.addEventListener("change", updateSelectedDesignations);
    } catch (e) { console.error(e); }
}

// Fetch and populate UPDATE dropdown
async function fetchDesignationsForWorkerUp() {
    try {
        const url = new URL('/api/getAlldesignationrMappings', baseUrl);
        const res  = await fetch(url, { credentials: "include" });
        const data = await res.json();
        const menu = document.getElementById("designationDropdownMenuUp");
        menu.innerHTML = "";

        data.forEach(item => {
            const div = document.createElement("div");
            div.innerHTML = `
                <label style="display:block;padding:5px;cursor:pointer;">
                    <input type="checkbox"
                           class="worker-desig-up-checkbox"
                           value="${item.DESIGNATON_ID}">
                    ${item.DESIGNATION_NAME}
                </label>`;
            menu.appendChild(div);
        });

        menu.addEventListener("change", updateSelectedDesignationsUp);
    } catch (e) { console.error(e); }
}

// Label helpers
function updateSelectedDesignations() {
    const checked = document.querySelectorAll(
        "#designationDropdownMenu .worker-desig-checkbox:checked");
    document.getElementById("designationDropdown").textContent =
        checked.length ? `${checked.length} selected` : "Select Designation";
}
function updateSelectedDesignationsUp() {
    const checked = document.querySelectorAll(
        "#designationDropdownMenuUp .worker-desig-up-checkbox:checked");
    document.getElementById("designationDropdownUp").textContent =
        checked.length ? `${checked.length} selected` : "Select Designation";
}

// Getters
function getSelectedDesignationIds() {
    return Array.from(document.querySelectorAll(
        "#designationDropdownMenu .worker-desig-checkbox:checked"))
        .map(cb => parseInt(cb.value));
}
function getSelectedDesignationIdsUp() {
    return Array.from(document.querySelectorAll(
        "#designationDropdownMenuUp .worker-desig-up-checkbox:checked"))
        .map(cb => parseInt(cb.value));
}

// Pre-select on edit
async function loadSelectedDesignationsUp(workerMappingId) {
    const res  = await fetch(
        new URL(`/api/workerMapping/designations/${workerMappingId}`, baseUrl),
        { credentials: "include" }
    );
    const selected = await res.json();

    document.querySelectorAll(
        "#designationDropdownMenuUp .worker-desig-up-checkbox")
        .forEach(cb => cb.checked = false);

    selected.forEach(item => {
        const cb = document.querySelector(
            `#designationDropdownMenuUp .worker-desig-up-checkbox[value="${item.DESIGNATION_ID}"]`
        );
        if (cb) cb.checked = true;
    });

    updateSelectedDesignationsUp();
}