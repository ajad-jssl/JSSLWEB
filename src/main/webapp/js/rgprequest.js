const MainPage = 'GPMSUserRequest.jsp';
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



/* =====================================================================
   RGP REQUEST — rgprequest.js
   Depends on: baseUrl from js/config.js
   ===================================================================== */

let itemMasterList = [];
let rowCount       = 1;
let upRowCount     = 1;




function initSelect2(selector, modalId, placeholder) {
    $(selector).select2({
        theme          : "bootstrap4",
        width          : "100%",
        dropdownParent : $(modalId),
        placeholder    : placeholder || "Select",
        allowClear     : true
    });
}
// ── Open create modal ─────────────────────────────────────────────────
$("#rgpcreate").click(function () {
	  const allowed =allowedActions || [];

	if (!allowed.includes("Insert")) {
	  alert(" You do not have permission to Insert.");
	  $('#exampleModalScrollable123').modal('hide');
	  return;
	}
	$('#exampleModalScrollable123').modal('show');

});

// ── Single document.ready ─────────────────────────────────────────────
$(document).ready( async  function () {
await	loadActions();

    // Date defaults
    const today = new Date().toISOString().split('T')[0];
    $("#returndatee").attr("min", today).val(today);
    $("#returndateup").attr("min", today).val(today);
	
	$("#contractno").prop("disabled", true).val("");
	    $("#contractnoup").prop("disabled", true).val("");
		
		
		// ── Select2 init — CREATE modal ───────────────────────────────
		    initSelect2("#tovendor", "#exampleModalScrollable123", "Select Vendor");
		    initSelect2("#employee", "#exampleModalScrollable123", "Select Employee");
		    initSelect2("#itemno1",  "#exampleModalScrollable123", "-- Select Item --");

		    // ── Select2 init — UPDATE modal ───────────────────────────────
		    initSelect2("#tovendorup", "#exampleModalScrollable12", "Select Vendor");
		    initSelect2("#employeeup", "#exampleModalScrollable12", "Select Employee");
		    initSelect2("#upitemno1",  "#exampleModalScrollable12", "-- Select Item --");
	loadFactoryLocations();
    // Load all dropdowns
	loadUomMaster();
    loadItemMaster();
  await  loadVendors();
  await loadEmployees();
  QSlist();
    
    loadContracts();
    loadPRSequence();

    // Vendor / Employee toggle — CREATE modal
	// ── Vendor / Employee toggle — CREATE modal
	$("#selectvendor").on("change", function () {
		    const val = this.value;
		    if (val === "1") {
		        $("#tovendor").prop("disabled", false);
		        $("#employee").prop("disabled", true).val("").trigger("change");
		        $("#empaddress").prop("disabled", true).val("");
		        $("#employeeaddress").val("").prop("readonly", true);
		        $("#contractno").prop("disabled", true).val("");
		    } else if (val === "2") {
		        $("#employee").prop("disabled", false);
		        $("#tovendor").prop("disabled", true).val("").trigger("change");
		        $("#empaddress").prop("disabled", false);
		        $("#contractno").prop("disabled", true).val("");
		    } else {
		        $("#tovendor").prop("disabled", true).val("").trigger("change");
		        $("#employee").prop("disabled", true).val("").trigger("change");
		        $("#empaddress").prop("disabled", true).val("");
		        $("#employeeaddress").val("").prop("readonly", true);
		        $("#contractno").prop("disabled", true).val("");
		    }
		});

	// ── When employee is selected → load factory locations
	$("#employee").on("change", function () {
	    if ($(this).val()) {
	        loadFactoryLocations();
	    } else {
	        $("#empaddress").empty().append('<option value="">Select Location</option>');
	        $("#employeeaddress").val("");
	    }
	});


	
	// ── When factory location selected → fill address
	$("#empaddress").on("change", function () {
			    const selected   = $(this).find("option:selected");
			    const locationId = selected.val();

			    $("#contractnoError").hide();

			    if (locationId === "OTHER") {
			        // Other selected → allow manual entry
			        $("#employeeaddress").val("").prop("readonly", false);
			        // Contract locked & cleared — only usable for "Site"
			        $("#contractno").prop("disabled", true).val("");

			    } else if (locationId === "Site") {
			        // Site selected → address will be derived from the chosen contract
			        $("#employeeaddress").val("").prop("readonly", true);
			        // Unlock contract so the user can pick one
			        $("#contractno").prop("disabled", false).val("");

			    } else {
			        // Auto-fill address and make readonly
			        $("#employeeaddress").val(selected.data("address") || "").prop("readonly", true);
			        // Not Site → contract locked & cleared
			        $("#contractno").prop("disabled", true).val("");
			    }
			});

		// ── When contract is selected AND location is "Site" → fetch & prefill address
		$("#contractno").on("change", function () {
		    const contractId = $(this).val();
		    const location    = $("#empaddress").val();

		    if (location === "Site" && contractId) {
		        $.ajax({
		            url       : new URL("/api/description", baseUrl),
		            type      : "GET",
		            data      : { contractId: contractId },
		            dataType  : "text",
		            xhrFields : { withCredentials: true },
		            success: function (response) {
		                $("#employeeaddress").val(response || "").prop("readonly", true);
		            },
		            error: function (xhr) {
		                console.error("Failed to load contract description:", xhr);
		                $("#employeeaddress").val("");
		            }
		        });
		    }
		});
	
	
	// Vendor / Employee toggle — UPDATE modal
	$("#selectvendorup").on("change", function () {
			    const val = this.value;
			    if (val === "1") {
			        $("#tovendorup").prop("disabled", false);
			        $("#employeeup").prop("disabled", true).val("").trigger("change");
	
			        $("#empaddressup").prop("disabled", true).val("");
			        $("#employeeaddressup").val("").prop("readonly", true);
			        $("#contractnoup").prop("disabled", true).val("");
			    } else if (val === "2") {
			        $("#employeeup").prop("disabled", false);
			        $("#tovendorup").prop("disabled", true).val("").trigger("change");
	
			        $("#empaddressup").prop("disabled", false);
			        $("#contractnoup").prop("disabled", true).val("");
			    } else {
			        $("#tovendorup").prop("disabled", true).val("").trigger("change");
	
			        $("#employeeup").prop("disabled", true).val("").trigger("change");
	
			        $("#empaddressup").prop("disabled", true).val("");
			        $("#employeeaddressup").val("").prop("readonly", true);
			        $("#contractnoup").prop("disabled", true).val("");
			    }
			});
	// Employee change → load factory locations for update modal
	$("#employeeup").on("change", function () {
	    if ($(this).val()) {
	        loadFactoryLocationsUp();
	    } else {
	        $("#empaddressup").empty().append('<option value="">Select Location</option>');
	        $("#employeeaddressup").val("");
	    }
	});


	
	// Factory location change → fill address for update modal
	$("#empaddressup").on("change", function () {
			    const selected   = $(this).find("option:selected");
			    const locationId = selected.val();

			    $("#contractnoErrorup").hide();

			    if (locationId === "OTHER") {
			        $("#employeeaddressup").val("").prop("readonly", false);
			        $("#contractnoup").prop("disabled", true).val("");

			    } else if (locationId === "Site") {
			        $("#employeeaddressup").val("").prop("readonly", true);
			        $("#contractnoup").prop("disabled", false).val("");

			    } else {
			        $("#employeeaddressup").val(selected.data("address") || "").prop("readonly", true);
			        $("#contractnoup").prop("disabled", true).val("");
			    }
			});

		// Contract change → fetch & prefill address (UPDATE modal), only when location is "Site"
		$("#contractnoup").on("change", function () {
		    const contractId = $(this).val();
		    const location    = $("#empaddressup").val();

		    if (location === "Site" && contractId) {
		        $.ajax({
		            url       : new URL("/api/description", baseUrl),
		            type      : "GET",
		            data      : { contractId: contractId },
		            dataType  : "text",
		            xhrFields : { withCredentials: true },
		            success: function (response) {
		                $("#employeeaddressup").val(response || "").prop("readonly", true);
		            },
		            error: function (xhr) {
		                console.error("Failed to load contract description:", xhr);
		                $("#employeeaddressup").val("");
		            }
		        });
		    }
		});

    // Create → validate → show confirm popup
    $("#showConfirmationPopup").on("click", function () {
        if (!validateHeader())   return;
        if (!collectLineItems()) return;
        $("#exampleModalCenter66").modal("show");
    });

    // Confirmed YES → POST
    $("#confirmSubmission").on("click", function () {
		$("#exampleModalCenter66").modal("hide");
		               $("#exampleModalScrollable123").modal("hide");
        const lineItems = collectLineItems();
        if (!lineItems) return;

        const payload = {
            selectvendor : $("#selectvendor").val(),
            tovendor     : $("#tovendor").val()   || null,
            employee     : $("#employee").val()   || null,
			employeeLocation: $("#empaddress").val()      || null,
			employeeAddress : $("#employeeaddress").val() || null,
            returnDate   : $("#returndatee").val(),
            contractno   : $("#contractno").val() || null,
            remarks      : $("#remarks5").val().trim(),
            createdBy    : sessionStorage.getItem("id"),
			requestBy :sessionStorage.getItem("Empcode"),
			reasondisptach:$("#reasondispatch").val().trim()|| null,
			selectfactoryId : sessionStorage.getItem("selectedFactoryId"),
            lineItems    : lineItems   // [{ itemid, quantity, price, remarks }]
        };

        $.ajax({
         
			url       : new URL("api/rgp", baseUrl),
            type        : "POST",
            contentType : "application/json",
            data        : JSON.stringify(payload),
            xhrFields   : { withCredentials: true },
            success: function () {
                $("#exampleModalCenter66").modal("hide");
                $("#exampleModalScrollable123").modal("hide");
				
				//alert("the Reqeust UserCreatedSuccessfully");
              showPopup("RGP created successfully!","RGPRequest.jsp");
               
            },
            error: function (err) {
                console.error("Create RGP failed:", err);
                alert("Failed to create RGP. Please try again.");
            }
        });
    });


	
	
	/*$("#submitVerifyButton").on("click", function () {
	    $("#exampleModalCenterVerifyConfirm").modal("show");
	});*/
	
	
	$("#submitVerifyButton").on("click", function () {

	    if (JSON.stringify(captureVerifySnapshot()) === JSON.stringify(originalVerifySnapshot)) {
	    //    $("#modalMessage").text("No Feilds changes");
			showPopup("No Feilds Changes.","RGPRequest.jsp");
	       // $("#messageModal").modal("show");
	        return;
	    }

	    $("#exampleModalCenterVerifyConfirm").modal("show");
	});

	// Keep the verify modal scrollable after closing the message modal on top of it
	$("#messageModal").on("hidden.bs.modal", function () {
	    if ($(".modal.show").length) $("body").addClass("modal-open");
	});

    // ── Confirmed YES → submit verification (API to be wired later) ───
    $("#confirmVerifyYes").on("click", function () {
        $("#exampleModalCenterVerifyConfirm").modal("hide");
        submitVerification();
    });

});

let uomMap = {};

function loadUomMaster() {

    $.ajax({
        url: new URL('/api/items/all', baseUrl),
        type: 'GET',
        xhrFields: {
            withCredentials: true
        },
        success: function (data) {

            uomMap = {};

            $.each(data, function (i, item) {
                uomMap[item.uid] = item.unit;
            });

            console.log('UOM Master:', uomMap);

        },
        error: function (xhr, status, error) {
            console.error('Failed to load UOM master:', error);
        }
    });

}

// ── PR Sequence ───────────────────────────────────────────────────────
function loadPRSequence() {
    const factoryId = sessionStorage.getItem("selectedFactoryId");
    const prefix    = factoryId == "1" ? "RGPB-PR"
                    : factoryId == "2" ? "RGPG-PR" : "";
    $.ajax({
        url       : baseUrl + "/api/UserRequest/next-sequence",
        type      : "GET",
        xhrFields : { withCredentials: true },
        success: function (sequence) {
            const fmt = sequence < 1000 ? String(sequence).padStart(3, "0") : sequence;
            $("#rgpcode").val(prefix + fmt);
        }
    });
}




let currentFactoryIdRGP;

function QSlist() {

    currentFactoryIdRGP = parseInt(sessionStorage.getItem("selectedFactoryId"), 10);
    const EmpCode = sessionStorage.getItem("Empcode");
	const userId = sessionStorage.getItem("username");

    if (!currentFactoryIdRGP || isNaN(currentFactoryIdRGP)) {
        console.warn("No valid factory ID in sessionStorage");
        return;
    }

    if ($.fn.DataTable.isDataTable('#tableID2')) {
        $('#tableID2').DataTable().clear().destroy();
    }

    $('#tableID2').DataTable({
        processing: true,
        serverSide: true,
        scrollX: true,
        searching: true,
        pageLength: 10,

        dom:
            "<'row mb-2'<'col-sm-6'B><'col-sm-6 text-right'f>>" +
            "<'row'<'col-sm-12'tr>>" +
            "<'row mt-2 align-items-center'<'col-sm-6'i><'col-sm-6 d-flex justify-content-end'p>>",

        buttons: [
            {
                text: 'Export to Excel',
                action: function () {

                    const EmpCode = sessionStorage.getItem("Empcode");
                    const url = new URL(`/api/rgp/pagging/${currentFactoryIdRGP}`, baseUrl);
                    url.searchParams.append('empCode', EmpCode);
					url.searchParams.append('userId',userId);
                    url.searchParams.append('page', 0);
                    url.searchParams.append('size', 99999);

                    fetch(url, { credentials: "include" })
                        .then(response => response.json())
                        .then(json => {

                            const exportData = (json.data || []).map(item => {

                                let sentTo = "";
                                if (item.vendor_Name && item.vendor_Name !== "NULL") {
                                    sentTo = vendorMap[String(item.vendor_Name)] || "";
                                } else if (item.employee_Name && item.employee_Name !== "NULL") {
                                    sentTo = employeeMap[String(item.employee_Name)]
                                             || "Employee #" + item.employee_Name;
                                }

                                const returnDate = item.expected_Return_Date
                                    ? item.expected_Return_Date.toString().split("T")[0]
                                    : "";

                                return [
                                    item.pr_No || "",
                                    sentTo,
                                    returnDate
                                ];
                            });

                            let tempTable = $('<table>').append(
                                $('<thead>').append(
                                    $('<tr>').append(
                                        '<th>PR No</th>',
                                        '<th>Sent To</th>',
                                        '<th>Return Date</th>'
                                    )
                                ),
                                $('<tbody>').append(
                                    exportData.map(row =>
                                        $('<tr>').append(
                                            row.map(cell => $('<td>').text(cell))
                                        )
                                    )
                                )
                            ).appendTo('body');

                            $(tempTable).DataTable({
                                buttons: [{
                                    extend: 'excelHtml5',
                                    title: 'RGP Request Details'
                                }]
                            }).button(0).trigger();

                            setTimeout(() => {
                                $(tempTable).DataTable().destroy();
                                $(tempTable).remove();
                            }, 1000);
                        })
                        .catch(error => console.error('Export error:', error));
                }
            }
        ],

        columns: [
            { title: "Sl No",       orderable: false },
            { title: "PR No"                          },
            { title: "Sent To"                         },
            { title: "Return Date"                     },
            { title: "Edit",        orderable: false  },
            { title: "Verify",      orderable: false  },
            { title: "Cancel",      orderable: false  }
        ],

        ajax: function (data, callback, settings) {

            const page        = data.start / data.length;
            const size        = data.length;
            const searchValue = data.search.value;

            const url = new URL(`/api/rgp/pagging/${currentFactoryIdRGP}`, baseUrl);
            url.searchParams.append('empCode', EmpCode);
			url.searchParams.append('userId',userId);
            url.searchParams.append('page',    page);
            url.searchParams.append('size',    size);
            url.searchParams.append('search',  searchValue);

            fetch(url, { credentials: "include" })
                .then(response => response.json())
                .then(json => {

                    if (!json.data) {
                        callback({
                            draw:            data.draw,
                            recordsTotal:    0,
                            recordsFiltered: 0,
                            data:            []
                        });
                        return;
                    }

                    let slNo = data.start + 1;

					const rows = json.data.map(item => {

					    let sentTo = "";
					    if (item.vendor_Name && item.vendor_Name !== "NULL") {
					        sentTo = vendorMap[String(item.vendor_Name)] || "";
					    } else if (item.employee_Name && item.employee_Name !== "NULL") {
					        sentTo = employeeMap[String(item.employee_Name)]
					                 || "Employee #" + item.employee_Name;
					    }

					    const returnDate = item.expected_Return_Date
					        ? item.expected_Return_Date.toString().split("T")[0]
					        : "";

					    const editIcon =
					        `<i class="fa fa-pen"
					            style="color:blue;cursor:pointer;"
					            onclick="editRgp(${item.request_Id})"
					            title="Edit"></i>`;

					    // ── NEW: Verify is only active for vendor-type requests ──
					    const isVendorType = item.vendor_Name && item.vendor_Name !== "NULL";

					    const verifyIcon = isVendorType
					        ? `<i class="fa fa-check-circle"
					              style="color:green;cursor:pointer;"
					              onclick="verifyRgp(${item.request_Id})"
					              title="Verify"></i>`
					        : `<i class="fa fa-check-circle"
					              style="color:#ccc;cursor:not-allowed;"
					              title="Verify not applicable for employee requests"></i>`;

					    const cancelIcon =
					        `<i class="fa fa-times-circle"
					            style="color:red;cursor:pointer;"
					            onclick="cancelRgp(${item.request_Id})"
					            title="Cancel"></i>`;

					    return [
					        slNo++,
					        item.pr_No || "",
					        sentTo,
					        returnDate,
					        editIcon,
					        verifyIcon,
					        cancelIcon
					    ];
					});

                    callback({
                        draw:            data.draw,
                        recordsTotal:    json.totalRecords,
                        recordsFiltered: json.totalItems,
                        data:            rows
                    });
                })
                .catch(error => {
                    console.error('Error fetching RGP data:', error);
                    callback({
                        draw:            data.draw,
                        recordsTotal:    0,
                        recordsFiltered: 0,
                        data:            []
                    });
                });
        }
    });
}

// ── Cancel RGP request ──────────────────────────────────────────────
let pendingCancelRequestId = null;

function cancelRgp(requestId) {
	  const allowed =allowedActions || [];

	if (!allowed.includes("Cancel")) {
	  alert(" You do not have permission to Cancel.");
	
	  return;
	}
	
	
    pendingCancelRequestId = requestId;
    $("#cancelRgpModal").modal("show");
}

$("#confirmCancelRgp").on("click", function () {

    if (!pendingCancelRequestId) return;

    const requestId = pendingCancelRequestId;

    $.ajax({
        url         : new URL("/api/rgpreqeust/cancel/" + requestId, baseUrl),
        type        : "PUT",
        xhrFields   : { withCredentials: true },
        success: function () {
            $("#cancelRgpModal").modal("hide");
            showPopup("RGP Request cancelled successfully!", "RGPRequest.jsp");
            //QSlist();
        },
        error: function (xhr) {
            $("#cancelRgpModal").modal("hide");
            if (xhr.status === 409 ) {
                $("#modalMessage").text("Cancellation is not allowed because one or more line items have already been verified.");
                $("#messageModal").modal("show");
                return;
            }
            console.error("Cancel RGP failed:", xhr);
            alert("Failed to cancel RGP. Please try again.");
        }
    });

    pendingCancelRequestId = null;
});



let vendorMap  ={};
let employeeMap = {}; 
function loadVendors() {
    return new Promise(function (resolve) {
        $.ajax({
            url       : new URL("/api/clients", baseUrl),
            type      : "GET",
            xhrFields : { withCredentials: true },
            success: function (response) {
                const $v  = $("#tovendor").empty().append('<option value="1">Select Vendor</option>');
                const $vu = $("#tovendorup").empty().append('<option value="1">Select Vendor</option>');
				const $vuv = $("#tovendorverify").empty().append('<option value="1">Select Vendor</option>');
				response.forEach(function (c) {
				                    vendorMap[String(c.cid)] = c.client_number + " - " + c.name;
				                    const opt = $("<option>", { value: c.cid, text: c.client_number + " - " + c.name });
				                    $v.append(opt.clone());
				                    $vu.append(opt.clone());
									$vuv.append(opt.clone());
				                });
				                $v.trigger("change");
				                $vu.trigger("change");
								$vuv.trigger("change");
				                resolve();
                
            },
            error: function (err) { console.error(err); resolve(); }
        });
    });
}

function loadEmployees() {
    return new Promise(function (resolve) {
        $.ajax({
            url       : new URL("/api/websmartuser/getAll", baseUrl),
            type      : "GET",
            xhrFields : { withCredentials: true },
            success: function (response) {
                const $e  = $("#employee").empty().append('<option value="">Select Employee</option>');
                const $eu = $("#employeeup").empty().append('<option value="">Select Employee</option>');
				response.Data.forEach(function (u) {
				                    employeeMap[String(u.id)] = u.username;
				                    const opt = $("<option>", { value: u.id, text: u.username });
				                    $e.append(opt.clone());
				                    $eu.append(opt.clone());
				                });
				                $e.trigger("change");
				                $eu.trigger("change");
				                resolve();
           
            },
            error: function (xhr) { console.error("Failed to load employees", xhr); resolve(); }
        });
    });
}

// ── Edit RGP → prefill Update modal ──────────────────────────────────
let originalRgpSnapshot = {};   // ← add at top of file with other lets

/*function editRgp(requestId) {
    $.ajax({
        url       : new URL("/api/rgp/edit/" + requestId, baseUrl),
        type      : "GET",
        xhrFields : { withCredentials: true },
        success: function (response) {
            if (!response || response.length === 0) return;

            const header = response[0];
			const hasVerifiedItem = response.some(row => row.Is_Verified === true || row.Is_Verified === 1);
            $("#updateModal_RequestId").val(header.Request_Id);
            $("#rgpcodeup").val(header.PR_No || "");
			
			

    
			if (header.Vendor_Name && String(header.Vendor_Name) !== "null") {
			    $("#selectvendorup").val("1");
			    $("#tovendorup")
			        .prop("disabled", false)
			        .val(String(header.Vendor_Name))
			        .trigger("change");   // update select2 immediately
			    $("#employeeup").prop("disabled", true).val("").trigger("change");
			    $("#empaddressup").prop("disabled", true).val("");
			    $("#employeeaddressup").val("").prop("readonly", true);
			}
			
			
			else if (header.Employee_Name && String(header.Employee_Name) !== "null") {
                $("#selectvendorup").val("2");
                $("#employeeup").prop("disabled", false).val(String(header.Employee_Name));
                $("#tovendorup").prop("disabled", true).val("");
                $("#empaddressup").prop("disabled", false);
                loadFactoryLocationsUp(
                    header.Employee_Sender_Location || null,
                    header.Employee_Address         || null
                );
            } else {
                $("#selectvendorup").val("");
                $("#tovendorup").prop("disabled", true).val("");
                $("#employeeup").prop("disabled", true).val("");
                $("#empaddressup").prop("disabled", true).val("");
                $("#employeeaddressup").val("").prop("readonly", true);
            }

            // ── Return Date ───────────────────────────────────────
            const rd = header.Expected_Return_Date
                ? header.Expected_Return_Date.toString().split("T")[0] : "";
            $("#returndateup").val(rd);

            // ── Contract + Remarks ────────────────────────────────
            loadContractsUp(header.Contract_No);
            $("#remarks5up").val(header.Remarks || "");

			
			$("#reasondispatchup").val(header.reasondisptach || "");
			
			if (hasVerifiedItem) {

						    $("#selectvendorup").prop("disabled", true);
						    $("#tovendorup").prop("disabled", true);
						    $("#employeeup").prop("disabled", true);
						    $("#empaddressup").prop("disabled", true);

						    $("#employeeaddressup").prop("readonly", true);

						    $("#returndateup").prop("readonly", true);

						    $("#contractnoup").prop("disabled", true);   // if this is your contract dropdown

						    $("#remarks5up").prop("readonly", true);
						    $("#reasondispatchup").prop("readonly", true);

						    // Hide Add Row button (change selector if needed)
						   // $("#addnewrow3").hide();

						    // Disable Save/Update button (change selector to your button id)
						    $("#updateBtn").prop("disabled", true);
						}
            // ── Line Items ────────────────────────────────────────
            $("#updateTableID tbody").empty();
            upRowCount = 0;

			response.forEach(function (row) {
			    if (!row.Item_Id) return;
			    upRowCount++;
			    const n = upRowCount;

			    $("#updateTableID tbody").append(`
			        <tr id="uprow${n}" data-item-request-id="${row.ItemRequest_Id || ''}">
			            <td>${n}</td>
			            <td>
			                <select class="form-control form-control-sm"
			                        id="upitemno${n}"
			                        onchange="getUpdateItemDetails(${n})"></select>
			            </td>
			            <td><input type="text" class="form-control form-control-sm" id="upunit${n}" readonly></td>
			            <td><input type="text" class="form-control form-control-sm" id="updescription1${n}" readonly></td>
			            <td><input type="text" class="form-control form-control-sm" id="upquantity${n}"
			                       onkeydown="return allowOnlyPositive(event)"></td>
			            <td><input type="text" class="form-control form-control-sm" id="upprice${n}"
			                       onkeydown="return allowOnlyPositive(event)"></td>
			            <td><input type="text" class="form-control form-control-sm" id="upremarks${n}"></td>
			            <td class="text-center">
			                <i class="bi bi-trash text-danger" style="cursor:pointer;font-size:16px;"
			                   onclick="deleteRow3(this)" title="Delete"></i>
			            </td>
			        </tr>`);

			    populateItemDropdown("upitemno" + n);
			    initSelect2("#upitemno" + n, "#exampleModalScrollable12", "-- Select Item --");
			    $("#upitemno"   + n).val(String(row.Item_Id)).trigger("change");
			    getUpdateItemDetails(n);

			    $("#upquantity" + n).val(row.Quantity     || "");
			    $("#upprice"    + n).val(row.Price        || "");
			    $("#upremarks"  + n).val(row.Item_Remarks || "");

			    // Lock only THIS row if THIS row is verified — not every row just because
			    // some other row in the request happens to be verified.
			    const isThisRowVerified = row.Is_Verified === true || row.Is_Verified === 1;

			    if (isThisRowVerified) {
			        $("#upitemno" + n).prop("disabled", true);
			        $("#upquantity" + n).prop("readonly", true);
			        $("#upprice" + n).prop("readonly", true);
			        $("#upremarks" + n).prop("readonly", true);

			        // Hide delete icon
			        $("#uprow" + n).find(".bi-trash").hide();
			    }
			});

            if (upRowCount === 0) {
                upRowCount = 1;
				$("#updateTableID tbody").append(`
				    <tr id="uprow1" data-item-request-id="">
				        <td>1</td>
				        <td><select class="form-control form-control-sm" id="upitemno1"
				                    onchange="getUpdateItemDetails(1)"></select></td>
				        <td><input type="text" class="form-control form-control-sm" id="upunit1" readonly></td>
				        <td><input type="text" class="form-control form-control-sm" id="updescription11" readonly></td>
				        <td><input type="text" class="form-control form-control-sm" id="upquantity1"
				                   onkeydown="return allowOnlyPositive(event)"></td>
				        <td><input type="text" class="form-control form-control-sm" id="upprice1"
				                   onkeydown="return allowOnlyPositive(event)"></td>
				        <td><input type="text" class="form-control form-control-sm" id="upremarks1"></td>
				        <td class="text-center">
				            <i class="bi bi-trash text-danger" style="cursor:pointer;font-size:16px;"
				               onclick="deleteRow3(this)" title="Delete"></i>
				        </td>
				    </tr>`);
                populateItemDropdown("upitemno1");
				initSelect2("#upitemno1", "#exampleModalScrollable12", "-- Select Item --");
            }

            // ── Snapshot AFTER all fields are filled ──────────────
            // Small delay so async dropdowns (contracts/locations) settle
            setTimeout(function () {
                originalRgpSnapshot = captureUpdateSnapshot();
            }, 600);
			$("#tovendorup").trigger("change.select2");
			$("#employeeup").trigger("change.select2");
			
            $("#exampleModalScrollable12").modal("show");
        },
        error: function (xhr) {
            console.error("Failed to load RGP for edit", xhr);
            alert("Failed to load record. Please try again.");
        }
    });
}*/



function editRgp(requestId) {
	  const allowed =allowedActions || [];

	if (!allowed.includes("Edit")) {
	  alert(" You do not have permission to Edit.");
	 
	  return;
	}
	
	
    $.ajax({
        url       : new URL("/api/rgp/edit/" + requestId, baseUrl),
        type      : "GET",
        xhrFields : { withCredentials: true },
        success: function (response) {
            if (!response || response.length === 0) return;

            const header = response[0];
            const hasVerifiedItem = response.some(row => row.Is_Verified === true || row.Is_Verified === 1);

            $("#updateModal_RequestId").val(header.Request_Id);
            $("#rgpcodeup").val(header.PR_No || "");

            // ── NEW: determine if this is a vendor-type request ──
            const isVendorType = header.Vendor_Name && String(header.Vendor_Name) !== "null";
           /* const headerVendorName = isVendorType
                ? (vendorMap[String(header.Vendor_Name)] || header.Vendor_Name)
                : "";*/

            // Show/hide the Vendor column entirely based on type
            if (isVendorType) {
                $("#upVendorColHeader").show();
            } else {
                $("#upVendorColHeader").hide();
            }

            if (header.Vendor_Name && String(header.Vendor_Name) !== "null") {
                $("#selectvendorup").val("1");
                $("#tovendorup")
                    .prop("disabled", false)
                    .val(String(header.Vendor_Name))
                    .trigger("change");
                $("#employeeup").prop("disabled", true).val("").trigger("change");
                $("#empaddressup").prop("disabled", true).val("");
                $("#employeeaddressup").val("").prop("readonly", true);
            }
            else if (header.Employee_Name && String(header.Employee_Name) !== "null") {
                $("#selectvendorup").val("2");
                $("#employeeup").prop("disabled", false).val(String(header.Employee_Name));
                $("#tovendorup").prop("disabled", true).val("");
                $("#empaddressup").prop("disabled", false);
                loadFactoryLocationsUp(
                    header.Employee_Sender_Location || null,
                    header.Employee_Address         || null
                );
            } else {
                $("#selectvendorup").val("");
                $("#tovendorup").prop("disabled", true).val("");
                $("#employeeup").prop("disabled", true).val("");
                $("#empaddressup").prop("disabled", true).val("");
                $("#employeeaddressup").val("").prop("readonly", true);
            }

            const rd = header.Expected_Return_Date
                ? header.Expected_Return_Date.toString().split("T")[0] : "";
            $("#returndateup").val(rd);

            loadContractsUp(header.Contract_No);
            $("#remarks5up").val(header.Remarks || "");
            $("#reasondispatchup").val(header.reasondisptach || "");

            if (hasVerifiedItem) {
                $("#selectvendorup").prop("disabled", true);
                $("#tovendorup").prop("disabled", true);
                $("#employeeup").prop("disabled", true);
                $("#empaddressup").prop("disabled", true);
                $("#employeeaddressup").prop("readonly", true);
                $("#returndateup").prop("readonly", true);
                $("#contractnoup").prop("disabled", true);
                $("#remarks5up").prop("readonly", true);
                $("#reasondispatchup").prop("readonly", true);
                $("#updateBtn").prop("disabled", true);
            }

            $("#updateTableID tbody").empty();
            upRowCount = 0;

			response.forEach(function (row) {
			    if (!row.Item_Id) return;
			    upRowCount++;
			    const n = upRowCount;

			    // ── Per-row vendor: item_vendor takes priority, fallback to header vendor ──
			    let vendorCellHtml = '';
			    if (isVendorType) {
			        const rowVendorId = (row.item_vendor !== null && row.item_vendor !== undefined && row.item_vendor !== '')
			            ? row.item_vendor
			            : header.Vendor_Name;

			        const rowVendorName = vendorMap[String(rowVendorId)] || rowVendorId || '';

			        vendorCellHtml = `<td><input type="text" class="form-control form-control-sm"
			                             id="upvendor${n}" value="${rowVendorName}" readonly></td>`;
			    } else {
			        vendorCellHtml = `<td style="display:none;"><input type="text" class="form-control form-control-sm"
			                             id="upvendor${n}" value="" readonly></td>`;
			    }

			    $("#updateTableID tbody").append(`
			        <tr id="uprow${n}" data-item-request-id="${row.ItemRequest_Id || ''}">
			            <td>${n}</td>
			            <td>
			                <select class="form-control form-control-sm"
			                        id="upitemno${n}"
			                        onchange="getUpdateItemDetails(${n})"></select>
			            </td>
			            <td><input type="text" class="form-control form-control-sm" id="upunit${n}" readonly></td>
			            <td><input type="text" class="form-control form-control-sm" id="updescription1${n}" readonly></td>
			            <td><input type="text" class="form-control form-control-sm" id="upquantity${n}"
			                       onkeydown="return allowOnlyPositive(event)"></td>
			            <td><input type="text" class="form-control form-control-sm" id="upprice${n}"
			                       onkeydown="return allowOnlyPositive(event)"></td>
			            <td><input type="text" class="form-control form-control-sm" id="upremarks${n}"></td>
			            ${vendorCellHtml}
			            <td class="text-center">
			                <i class="bi bi-trash text-danger" style="cursor:pointer;font-size:16px;"
			                   onclick="deleteRow3(this)" title="Delete"></i>
			            </td>
			        </tr>`);

			    populateItemDropdown("upitemno" + n);
			    initSelect2("#upitemno" + n, "#exampleModalScrollable12", "-- Select Item --");
			    $("#upitemno"   + n).val(String(row.Item_Id)).trigger("change");
			    getUpdateItemDetails(n);

			    $("#upquantity" + n).val(row.Quantity     || "");
			    $("#upprice"    + n).val(row.Price        || "");
			    $("#upremarks"  + n).val(row.Item_Remarks || "");

			    const isThisRowVerified = row.Is_Verified === true || row.Is_Verified === 1;

			    if (isThisRowVerified) {
			        $("#upitemno" + n).prop("disabled", true);
			        $("#upquantity" + n).prop("readonly", true);
			        $("#upprice" + n).prop("readonly", true);
			        $("#upremarks" + n).prop("readonly", true);
			        $("#uprow" + n).find(".bi-trash").hide();
			    }
			});

            if (upRowCount === 0) {
                upRowCount = 1;
                const emptyVendorCellHtml = isVendorType
                    ? `<td><input type="text" class="form-control form-control-sm" id="upvendor1" value="" readonly></td>`
                    : `<td style="display:none;"><input type="text" class="form-control form-control-sm" id="upvendor1" value="" readonly></td>`;

                $("#updateTableID tbody").append(`
                    <tr id="uprow1" data-item-request-id="">
                        <td>1</td>
                        <td><select class="form-control form-control-sm" id="upitemno1"
                                    onchange="getUpdateItemDetails(1)"></select></td>
                        <td><input type="text" class="form-control form-control-sm" id="upunit1" readonly></td>
                        <td><input type="text" class="form-control form-control-sm" id="updescription11" readonly></td>
                        <td><input type="text" class="form-control form-control-sm" id="upquantity1"
                                   onkeydown="return allowOnlyPositive(event)"></td>
                        <td><input type="text" class="form-control form-control-sm" id="upprice1"
                                   onkeydown="return allowOnlyPositive(event)"></td>
                        <td><input type="text" class="form-control form-control-sm" id="upremarks1"></td>
                        ${emptyVendorCellHtml}
                        <td class="text-center">
                            <i class="bi bi-trash text-danger" style="cursor:pointer;font-size:16px;"
                               onclick="deleteRow3(this)" title="Delete"></i>
                        </td>
                    </tr>`);
                populateItemDropdown("upitemno1");
                initSelect2("#upitemno1", "#exampleModalScrollable12", "-- Select Item --");
            }

            setTimeout(function () {
                originalRgpSnapshot = captureUpdateSnapshot();
            }, 600);
            $("#tovendorup").trigger("change.select2");
            $("#employeeup").trigger("change.select2");

            $("#exampleModalScrollable12").modal("show");
        },
        error: function (xhr) {
            console.error("Failed to load RGP for edit", xhr);
            alert("Failed to load record. Please try again.");
        }
    });
}
// ── Capture current state of the update modal ─────────────────────────
function captureUpdateSnapshot() {
    return {
        selectvendor    : $("#selectvendorup").val()        || "",
        tovendor        : $("#tovendorup").val()            || "",
        employee        : $("#employeeup").val()            || "",
        employeeLocation: $("#empaddressup").val()          || "",
        employeeAddress : $("#employeeaddressup").val()     || "",
        returnDate      : $("#returndateup").val()          || "",
        contractno      : $("#contractnoup").val()          || "",
        remarks         : $("#remarks5up").val().trim()     || "",
		reasondisptach  : $("#reasondispatchup").val().trim()  || "",
        lineItems       : collectUpdateLineItems(true)      || []
    };
}

// ── Collect update line items ─────────────────────────────────────────

function collectUpdateLineItems(silentMode) {
    const lineItems = [];
    let   valid     = true;

    if (!silentMode) {
        // Clear previous inline errors
        $("#updateTableID .line-item-error").remove();
        $("#updateTableID select, #updateTableID input").removeClass("is-invalid");
    }

    $("#updateTableID tbody tr").each(function (i) {
        const $tr           = $(this);
        const idx           = $tr.attr("id").replace("uprow", "");
        const itemRequestId = $tr.data("item-request-id")
                                ? parseInt($tr.data("item-request-id")) : null;
        const $itemSel = $("#upitemno"   + idx);
        const $qtyInp  = $("#upquantity" + idx);
        const itemid   = parseInt($itemSel.val())   || 0;
        const qty      = parseFloat($qtyInp.val())  || 0;
        const price    = parseFloat($("#upprice"   + idx).val());
        const remarks  = ($("#upremarks" + idx).val() || "").trim();
        let   rowOk    = true;

        if (!silentMode) {
            // ── Item required ─────────────────────────────────────────
            if (!itemid) {
                $itemSel.addClass("is-invalid");
                if (!$itemSel.siblings(".line-item-error.err-item").length) {
                    $itemSel.after(
                        '<div class="line-item-error err-item" ' +
                        'style="color:red;font-size:11px;margin-top:2px;">Item is required</div>'
                    );
                }
                valid = false; rowOk = false;
            } else {
                $itemSel.removeClass("is-invalid");
                $itemSel.siblings(".err-item").remove();
            }

            // ── Quantity required ─────────────────────────────────────
            if (!qty || qty <= 0) {
                $qtyInp.addClass("is-invalid");
                if (!$qtyInp.siblings(".line-item-error.err-qty").length) {
                    $qtyInp.after(
                        '<div class="line-item-error err-qty" ' +
                        'style="color:red;font-size:11px;margin-top:2px;">Quantity is required</div>'
                    );
                }
                valid = false; rowOk = false;
            } else {
                $qtyInp.removeClass("is-invalid");
                $qtyInp.siblings(".err-qty").remove();
            }
        }

        // For snapshot (silentMode) always push; for real submit only if row is ok
        if (silentMode || rowOk) {
            lineItems.push({
                itemRequestId,
                itemid   : itemid,
                quantity : qty,
                price    : isNaN(price) ? 0 : price,
                remarks
            });
        }
    });

    return (silentMode || valid) ? lineItems : null;
}
// ── Update button ──────────
$("#updateButton").on("click", function () {
	
	if (!validateHeaderUp()) return;

    const lineItems = collectUpdateLineItems(false);
    if (!lineItems) return;

    const current = {
        selectvendor    : $("#selectvendorup").val()        || "",
        tovendor        : $("#tovendorup").val()            || "",
        employee        : $("#employeeup").val()            || "",
        employeeLocation: $("#empaddressup").val()          || "",
        employeeAddress : $("#employeeaddressup").val()     || "",
        returnDate      : $("#returndateup").val()          || "",
        contractno      : $("#contractnoup").val()          || "",
        remarks         : $("#remarks5up").val().trim()     || "",
		reasondisptach  : $("#reasondispatchup").val().trim()  || "",
        lineItems       : lineItems
    };

    // ── Deep compare with original snapshot ──────────────────────
    if (JSON.stringify(current) === JSON.stringify(originalRgpSnapshot)) {
        showPopup("No Feilds Changes.","RGPRequest.jsp");
        return;
    }

    const requestId = $("#updateModal_RequestId").val();

    const payload = {
        selectvendor    : current.selectvendor,
        tovendor        : current.tovendor        || null,
        employee        : current.employee        || null,
        employeeLocation: current.employeeLocation|| null,
        employeeAddress : current.employeeAddress || null,
        returnDate      : current.returnDate,
        contractno      : current.contractno      || null,
        remarks         : current.remarks,
        modifiedBy      : sessionStorage.getItem("id"),
		reasondisptach  : current.reasondisptach,
        lineItems       : current.lineItems
    };

	$.ajax({
	    url         : new URL("/api/rgp/" + requestId, baseUrl),
	    type        : "PUT",
	    contentType : "application/json",
	    data        : JSON.stringify(payload),
	    xhrFields   : { withCredentials: true },
	    success: function (response) {
	        if (response === "NO_CHANGES") {
	            showPopup("No Feilds Changes.","RGPRequest.jsp");
	            return;
	        }
	        $("#exampleModalScrollable12").modal("hide");
	        showPopup("RGP updated successfully!","RGPRequest.jsp");
		   
		   //alert("the update successfully");
	      //  QSlist();   // refresh table
	    },
		error: function (xhr) {
		    if (xhr.status === 409 && xhr.responseText === "GATE_PASS_ALREADY_ISSUED") {
		        $("#exampleModalScrollable12").modal("hide");
		        $("#modalMessage").text("Gate Pass already issued. Editing is not allowed.");
		        $("#messageModal").modal("show");
		        return;
		    }
		    console.error("Update RGP failed:", xhr);
		    alert("Failed to update RGP. Please try again.");
		}
	});
});

// FIX: cast contract_id to String so .val() matches "15" == "15"
function loadContractsUp(selectedContractId) {
    const factoryId = sessionStorage.getItem("selectedFactoryId");
    $.ajax({
        url       : new URL("/jssl/contracts/allContracts", baseUrl),
        type      : "GET",
        data      : { factory: factoryId },
        xhrFields : { withCredentials: true },
        success: function (response) {
            const $dd = $("#contractnoup").empty()
                            .append('<option value="">Select Contract</option>');
            $.each(response.contracts, function (i, c) {
                $dd.append(`<option value="${c.contract_id}">${c.JobCode}</option>`);
            });
            if (selectedContractId) {
                // FIX: both sides must be strings for .val() to match
                $("#contractnoup").val(String(selectedContractId));
            }
        },
        error: function (xhr, s, err) { console.error("Error loading contracts:", err); }
    });
}

// FIX: accepts saved location + address to pre-fill after options load
function loadFactoryLocationsUp(selectedLocationId, savedAddress) {
    const currentFactoryId = sessionStorage.getItem("selectedFactoryId");
    $.ajax({
        url       : new URL("/api/allfactory", baseUrl),
        type      : "GET",
        xhrFields : { withCredentials: true },
        success: function (response) {
            const $dd = $("#empaddressup").empty()
                            .append('<option value="">Select Location</option>');

            response.forEach(function (f) {
                if (String(f.id) === String(currentFactoryId)) return;
                $dd.append(
                    $("<option>", {
                        value          : f.id,
                        text           : f.factory_name,
                        "data-address" : f.address || ""
                    })
                );
            });
            $dd.append($("<option>", { value: "Site", text: "Site" }));
            $dd.append($("<option>", { value: "OTHER", text: "Others" }));

            // Pre-select saved location then fill address
            if (selectedLocationId) {
                $dd.val(String(selectedLocationId));
                const sel = $dd.find("option:selected");

                if (sel.val() === "OTHER") {
                    $("#employeeaddressup").val(savedAddress || "").prop("readonly", false);
                    $("#contractnoup").prop("disabled", true);   // keep loaded value locked but not cleared

                } else if (sel.val() === "Site") {
                    $("#employeeaddressup").val(savedAddress || "").prop("readonly", true);
                    $("#contractnoup").prop("disabled", false);  // unlock — this record was made against a contract

                } else {
                    $("#employeeaddressup")
                        .val(sel.data("address") || savedAddress || "")
                        .prop("readonly", true);
                    $("#contractnoup").prop("disabled", true);
                }
            } else {
                $("#contractnoup").prop("disabled", true).val("");
            }
        },
        error: function (xhr) { console.error("Failed to load factory locations", xhr); }
    });
}


// ── Contracts ─────────────────────────────────────────────────────────
function loadContracts() {
    const factoryId = sessionStorage.getItem("selectedFactoryId");
    $.ajax({
        url       : new URL("/jssl/contracts/allContracts", baseUrl),
        type      : "GET",
        data      : { factory: factoryId },
        xhrFields : { withCredentials: true },
        success: function (response) {
            const $dd = $("#contractno").empty().append('<option value="">Select Contract</option>');
            $.each(response.contracts, function (i, c) {
                $dd.append(`<option value="${c.contract_id}">${c.JobCode}</option>`);
            });
        },
        error: function (xhr, s, err) { console.error("Error loading contracts:", err); }
    });
}

// ── Item Master ───────────────────────────────────────────────────────
function loadItemMaster() {
    $.ajax({
        url: new URL('/api/items', baseUrl),
        type: 'GET',
        xhrFields: {
            withCredentials: true
        },
        success: function (data) {

            itemMasterList = data;

            populateItemDropdown("itemno1");     // CREATE row 1
            populateItemDropdown("upitemno1");   // UPDATE row 1

        },
        error: function (xhr, status, error) {
            console.error("Failed to load item master:", error);
        }
    });
}

/**
 * Fills a <select> with "ItemNo - Description1" labels.
 * option value = itemid  (ONLY the id is sent to the backend)
 */
function populateItemDropdown(selectId) {
    const $sel = $("#" + selectId);
    if (!$sel.length) return;

    $sel.empty().append('<option value="">-- Select Item --</option>');

    itemMasterList.forEach(function (item) {
        $sel.append(
            $("<option>", {
                value        : item.itemid,
                text         : item.itemNo + " - " + (item.itmDescription1 || ""),
                "data-um"    : uomMap[item.um]              || "",
                "data-desc1" : item.itmDescription1 || ""
            })
        );
    });

    $sel.trigger("change.select2");
}

// ── CREATE modal: auto-fill on item select ────────────────────────────
// JSP ids:  unit{N}  |  description1{N}  |  description2{N}
// Row 1 example → unit1, description11, description21
function getitemdetails(rowNum) {
    const opt = $("#itemno" + rowNum + " option:selected");
    $("#unit"         + rowNum).val(opt.data("um")    || "");
    $("#description1" + rowNum).val(opt.data("desc1") || "");
}

// ── UPDATE modal: auto-fill on item select ────────────────────────────
function getUpdateItemDetails(rowNum) {
    const opt = $("#upitemno" + rowNum + " option:selected");
    $("#upunit"         + rowNum).val(opt.data("um")    || "");
    $("#updescription1" + rowNum).val(opt.data("desc1") || "");
}

// ── Add / Delete rows — CREATE modal ─────────────────────────────────
function addNewRow() {
    rowCount++;
    const n = rowCount;
    $("#TableID tbody").append(`
      <tr id="row${n}">
        <td>${n}</td>
        <td><select class="form-control form-control-sm" id="itemno${n}" onchange="getitemdetails(${n})"></select></td>
        <td><input type="text" class="form-control form-control-sm" id="unit${n}" readonly></td>
        <td><input type="text" class="form-control form-control-sm" id="description1${n}" readonly></td>
        <td><input type="text" class="form-control form-control-sm" id="quantity${n}" onkeydown="return allowOnlyPositive(event)"></td>
        <td><input type="text" class="form-control form-control-sm" id="price${n}" onkeydown="return allowOnlyPositive(event)"></td>
        <td><input type="text" class="form-control form-control-sm" id="remarks${n}"></td>
        <td class="text-center"><i class="bi bi-trash text-danger" style="cursor:pointer;font-size:16px;" onclick="deleteRow(this)" title="Delete"></i></td>
      </tr>`);
    populateItemDropdown("itemno" + n);
    initSelect2("#itemno" + n, "#exampleModalScrollable123", "-- Select Item --");
}


function deleteRow(btn) {
    const $tr = $(btn).closest("tr");
    $tr.find("select").each(function () {
        if ($(this).data("select2")) $(this).select2("destroy");
    });
    $tr.remove();
    renumber("#TableID");
}

// ── Add / Delete rows — UPDATE modal ─────────────────────────────────
function addNewRow3() {
    upRowCount++;
    const n = upRowCount;
    $("#updateTableID tbody").append(`
      <tr id="uprow${n}">
        <td>${n}</td>
        <td><select class="form-control form-control-sm" id="upitemno${n}" onchange="getUpdateItemDetails(${n})"></select></td>
        <td><input type="text" class="form-control form-control-sm" id="upunit${n}" readonly></td>
        <td><input type="text" class="form-control form-control-sm" id="updescription1${n}" readonly></td>
        <td><input type="text" class="form-control form-control-sm" id="upquantity${n}" onkeydown="return allowOnlyPositive(event)"></td>
        <td><input type="text" class="form-control form-control-sm" id="upprice${n}" onkeydown="return allowOnlyPositive(event)"></td>
        <td><input type="text" class="form-control form-control-sm" id="upremarks${n}"></td>
        <td class="text-center"><i class="bi bi-trash text-danger" style="cursor:pointer;font-size:16px;" onclick="deleteRow3(this)" title="Delete"></i></td>
      </tr>`);
    populateItemDropdown("upitemno" + n);
    initSelect2("#upitemno" + n, "#exampleModalScrollable12", "-- Select Item --");
}

function deleteRow3(btn) {
    const $tr = $(btn).closest("tr");
    $tr.find("select").each(function () {
        if ($(this).data("select2")) $(this).select2("destroy");
    });
    $tr.remove();
    renumber("#updateTableID");
}


function renumber(tableSelector) {
    $(tableSelector + " tbody tr").each(function (i) {
        $(this).find("td:first").text(i + 1);
    });
}

// ── Collect line items (only itemid to backend) ───────────────────────
function collectLineItems() {
    const lineItems = [];
    let   valid     = true;

    // Clear previous inline errors
    $("#TableID .line-item-error").remove();
    $("#TableID select, #TableID input").removeClass("is-invalid");

    $("#TableID tbody tr").each(function (i) {
        const idx      = $(this).attr("id").replace("row", "");
        const $itemSel = $("#itemno"   + idx);
        const $qtyInp  = $("#quantity" + idx);
        const itemid   = parseInt($itemSel.val())   || 0;
        const qty      = parseFloat($qtyInp.val())  || 0;
        const price    = parseFloat($("#price"   + idx).val());
        const remarks  = ($("#remarks" + idx).val() || "").trim();
        let   rowOk    = true;

        // ── Item required ─────────────────────────────────────────────
        if (!itemid) {
            $itemSel.addClass("is-invalid");
            if (!$itemSel.siblings(".line-item-error.err-item").length) {
                $itemSel.after(
                    '<div class="line-item-error err-item" ' +
                    'style="color:red;font-size:11px;margin-top:2px;">Item is required</div>'
                );
            }
            valid = false; rowOk = false;
        } else {
            $itemSel.removeClass("is-invalid");
            $itemSel.siblings(".err-item").remove();
        }

        // ── Quantity required ─────────────────────────────────────────
        if (!qty || qty <= 0) {
            $qtyInp.addClass("is-invalid");
            if (!$qtyInp.siblings(".line-item-error.err-qty").length) {
                $qtyInp.after(
                    '<div class="line-item-error err-qty" ' +
                    'style="color:red;font-size:11px;margin-top:2px;">Quantity is required</div>'
                );
            }
            valid = false; rowOk = false;
        } else {
            $qtyInp.removeClass("is-invalid");
            $qtyInp.siblings(".err-qty").remove();
        }

        if (rowOk) {
            lineItems.push({
                itemid,
                quantity : qty,
                price    : isNaN(price) ? 0 : price,
                remarks
            });
        }
    });

    return valid ? lineItems : null;
}

// ── Header validation ─────────────────────────────────────────────────
function validateHeader() {
    let ok = true;
    const type = $("#selectvendor").val();
	
	//const reasondispatch = $("#reasondispatch").val().trim();

    if (!type) {
        $("#selectvendorError").show(); ok = false;
    } else {
        $("#selectvendorError").hide();
    }

    // Vendor is optional — never blocks submission
    $("#tovendorError").hide();

    if (type === "1") {
        $("#employeeError").hide();
        $("#empaddressError").hide();
        $("#employeeaddressError").hide();
        $("#contractnoError").hide();

    } else if (type === "2") {
        if (!$("#employee").val()) {
            $("#employeeError").show(); ok = false;
        } else {
            $("#employeeError").hide();
        }
        if (!$("#empaddress").val()) {
            $("#empaddressError").show(); ok = false;
        } else {
            $("#empaddressError").hide();
        }
        if (!$("#employeeaddress").val().trim()) {
            $("#employeeaddressError").show(); ok = false;
        } else {
            $("#employeeaddressError").hide();
        }

        // Contract is compulsory only when the employee location is "Site"
        if ($("#empaddress").val() === "Site" && !$("#contractno").val()) {
            $("#contractnoError").show(); ok = false;
        } else {
            $("#contractnoError").hide();
        }

    } else {
        $("#employeeError").hide();
        $("#empaddressError").hide();
        $("#employeeaddressError").hide();
        $("#contractnoError").hide();
    }

    if (!$("#returndatee").val()) {
        $("#returndateeError").show(); ok = false;
    } else {
        $("#returndateeError").hide();
    }
	
	if (!$("#reasondispatch").val()) {
	       $("#reasondispatchError").show(); ok = false;
	   } else {
	       $("#reasondispatchError").hide();
	   }

    return ok;
}

function validateHeaderUp() {
    let ok = true;
    const type = $("#selectvendorup").val();

    if (!type) {
        $("#selectvendorErrorup").show(); ok = false;
    } else {
        $("#selectvendorErrorup").hide();
    }

    // Vendor is optional — never blocks submission
    $("#tovendorErrorup").hide();

    if (type === "1") {
        $("#employeeErrorup").hide();
        $("#empaddressErrorup").hide();
        $("#employeeaddressErrorup").hide();
        $("#contractnoErrorup").hide();

    } else if (type === "2") {
        if (!$("#employeeup").val()) {
            $("#employeeErrorup").show(); ok = false;
        } else {
            $("#employeeErrorup").hide();
        }
        if (!$("#empaddressup").val()) {
            $("#empaddressErrorup").show(); ok = false;
        } else {
            $("#empaddressErrorup").hide();
        }
        if (!$("#employeeaddressup").val().trim()) {
            $("#employeeaddressErrorup").show(); ok = false;
        } else {
            $("#employeeaddressErrorup").hide();
        }

        // Contract is compulsory only when the employee location is "Site"
        if ($("#empaddressup").val() === "Site" && !$("#contractnoup").val()) {
            $("#contractnoErrorup").show(); ok = false;
        } else {
            $("#contractnoErrorup").hide();
        }

    } else {
        $("#employeeErrorup").hide();
        $("#empaddressErrorup").hide();
        $("#employeeaddressErrorup").hide();
        $("#contractnoErrorup").hide();
    }

    if (!$("#returndateup").val()) {
        $("#returndateErrorup").show(); ok = false;
    } else {
        $("#returndateErrorup").hide();
    }
	
	if (!$("#reasondispatchup").val()) {
	        $("#reasondispatchupError").show(); ok = false;
	    } else {
	        $("#reasondispatchupError").hide();
	    }

    return ok;
}

// ── Load Factory Locations (exclude current selected factory) ─────────
function loadFactoryLocations() {
    const currentFactoryId = sessionStorage.getItem("selectedFactoryId");

    $.ajax({
        url       : new URL("/api/allfactory", baseUrl),
        type      : "GET",
        xhrFields : { withCredentials: true },
        success: function (response) {
            const $dd = $("#empaddress").empty().append('<option value="">Select Location</option>');

            response.forEach(function (f) {
                // Skip the currently selected factory
                if (String(f.id) === String(currentFactoryId)) return;

                $dd.append(
                    $("<option>", {
                        value          : f.id,
                        text           : f.factory_name,
                        "data-address" : f.address || ""
                    })
                );
            });

            // Always add "Other" at the end
			$dd.append($("<option>", { value: "Site", text: "Site" }));
            $dd.append($("<option>", { value: "OTHER", text: "Others" }));
		

        },
        error: function (xhr) {
            console.error("Failed to load factory locations", xhr);
        }
    });
}


// ── Verify modal state ──────────────────────────────────────────────
let verifyLineItemsData    = [];
let vendorOptionsHtmlCache = "";
let originalVerifySnapshot = null;
let verifyHeaderVendorId   = null;   // header's vendor, used as default for unverified rows

function captureVerifySnapshot() {
    const hv = $("#tovendorverify").val();
    const snap = {
        headerVendor : (hv && hv !== "1") ? String(hv) : "",
        items        : []
    };

    $("#verifyTableID tbody tr").each(function () {
        const idx = $(this).attr("id").replace("verifyrow", "");
        const p   = parseFloat($("#verify_price_" + idx).val());
        const v   = $("#verify_vendor_" + idx).val();

        snap.items.push({
            itemRequestId : $(this).data("item-request-id") || null,
            price         : isNaN(p) ? 0 : p,
            verified      : $("#verify_check_" + idx).is(":checked"),
            vendor        : (v && v !== "1") ? String(v) : ""
        });
    });
    return snap;
}

function verifyRgp(requestId) {
	  const allowed =allowedActions || [];

	if (!allowed.includes("Verify")) {
	  alert(" You do not have permission to Verify.");
	
	  return;
	}
	
	
    $.ajax({
        url       : new URL("/api/rgp/verify-details/" + requestId, baseUrl),
        type      : "GET",
        xhrFields : { withCredentials: true },
        success: function (response) {
            if (!response || response.length === 0) return;

            const header = response[0];
			
			

            $("#verifyModal_RequestId").val(header.Request_Id);
            $("#rgpcodeverify").val(header.PR_No || "");

            // ── Vendor / Employee (readonly display) ───────────────────
			// ── Vendor / Employee ────────────────────────────────────────────────
			$("#tovendorverifyError").hide();

			const isVendorType = header.Vendor_Name && String(header.Vendor_Name) !== "null";

			if (isVendorType) {
			    // Vendor-type request → header Vendor select becomes editable.
			    // #tovendorverify is already fully populated with the vendor list
			    // (and the "1" = Select Vendor sentinel) by loadVendors() on page load.
				
				
				
				
				
			    verifyHeaderVendorId = String(header.Vendor_Name);
				
				
				$("#selectvendorver").prop("disabled", true).val("1");

			    $("#tovendorverify")
			        .prop("disabled", true)
			        .val(verifyHeaderVendorId);

			    $("#employeeverify")
			        .empty()
			        .append('<option value="">-</option>')
			        .prop("disabled", true);

			} else if (header.Employee_Name && String(header.Employee_Name) !== "null") {
			    // Employee-type request → stays fully readonly, as before.
			    verifyHeaderVendorId = null;

			    $("#tovendorverify")
			        .prop("disabled", true)
			        .val("1");

			    $("#employeeverify")
			        .empty()
			        .append(
			            `<option value="${header.Employee_Name}" selected>` +
			            (employeeMap[String(header.Employee_Name)] || header.Employee_Name) +
			            `</option>`
			        )
			        .prop("disabled", true);

			} else {
			    verifyHeaderVendorId = null;
			    $("#tovendorverify").prop("disabled", true).val("1");
			    $("#employeeverify").empty().append('<option value="">-</option>').prop("disabled", true);
			}

            // ── Location ────────────────────────────────────────────────
            $("#empaddressverify").empty();
            if (header.Employee_Sender_Location) {
                $("#empaddressverify").append(
                    `<option value="${header.Employee_Sender_Location}" selected>` +
                    header.Employee_Sender_Location + `</option>`
                );
            } else {
                $("#empaddressverify").append('<option value="">-</option>');
            }
            $("#employeeaddressverify").val(header.Employee_Address || "");

            // ── Contract ────────────────────────────────────────────────
            $("#contractnoverify").empty();
            if (header.Contract_No) {
                $("#contractnoverify").append(
                    `<option value="${header.Contract_No}" selected>${header.Contract_No}</option>`
                );
            } else {
                $("#contractnoverify").append('<option value="">-</option>');
            }

            const rd = header.Expected_Return_Date
                ? header.Expected_Return_Date.toString().split("T")[0] : "";
            $("#returndateverify").val(rd);
            $("#reasondispatchverify").val(header.reasondisptach || "");
            $("#remarks5verify").val(header.Remarks || "");

            // ── Line items, carrying saved verify status + vendor ──────
            verifyLineItemsData = [];
            response.forEach(function (row) {
                if (!row.Item_Id) return;
                const itemMeta = itemMasterList.find(
                    it => String(it.itemid) === String(row.Item_Id)
                );
           /*     verifyLineItemsData.push({
                    itemRequestId : row.ItemRequest_Id || null,
                    itemId        : row.Item_Id,
                    itemLabel     : itemMeta
                        ? (itemMeta.itemNo + " - " + (itemMeta.itmDescription1 || ""))
                        : row.Item_Id,
                    uom           : itemMeta ? (uomMap[itemMeta.um] || "") : "",
                    description   : itemMeta ? (itemMeta.itmDescription1 || "") : "",
                    quantity      : row.Quantity || "",
                    price         : row.Price || "",
                    remarks       : row.Item_Remarks || "",
                    isVerified    : row.Is_Verified === 1 || row.Is_Verified === true,
                    vendorId      : row.Vendor_Id || null
                });*/
				
				verifyLineItemsData.push({
				    itemRequestId : row.ItemRequest_Id || null,
				    itemId        : row.Item_Id,
				    itemLabel     : itemMeta
				        ? (itemMeta.itemNo + " - " + (itemMeta.itmDescription1 || ""))
				        : row.Item_Id,
				    uom           : itemMeta ? (uomMap[itemMeta.um] || "") : "",
				    description   : itemMeta ? (itemMeta.itmDescription1 || "") : "",
				    quantity      : row.Quantity || "",
				    price         : row.Price || "",
				    remarks       : row.Item_Remarks || "",

				    // Purely reflects saved verification status → drives checked state + vendor prefill.
				    isVerified    : row.Is_Verified === 1 || row.Is_Verified === true,

				    // Only lock (disable) the row when is_gatepass is true AND it's verified.
				    // is_gatepass null/false → never locked, regardless of Is_Verified.
				    isLocked      : (row.is_gatepass === true || row.is_gatepass === 1)
				                        && (row.Is_Verified === 1 || row.Is_Verified === true),

				    vendorId      : row.Vendor_Id || null
				});
            });

            renderVerifyLineItems();
			originalVerifySnapshot = captureVerifySnapshot();
            $("#exampleModalScrollableVerify").modal("show");
        },
        error: function (xhr) {
            console.error("Failed to load RGP for verify", xhr);
            alert("Failed to load record. Please try again.");
        }
    });
}


// ── Header vendor changed → push it down to every unverified line item ──
$(document).on("change", "#tovendorverify", function () {
    const newVendorId = $(this).val();

    // "1" is the "Select Vendor" sentinel → treat as no vendor chosen
    verifyHeaderVendorId = (newVendorId && newVendorId !== "1") ? newVendorId : null;

    $("#verifyTableID tbody tr").each(function () {
        const $tr        = $(this);
        const idx        = $tr.attr("id").replace("verifyrow", "");
        const $chk       = $("#verify_check_" + idx);
        const $vendorSel = $("#verify_vendor_" + idx);

        // Only rows that aren't verified yet follow the header vendor
        if (!$chk.is(":checked")) {
            $vendorSel.val(verifyHeaderVendorId || "1");
        }
    });

    $("#tovendorverifyError").hide();
});

function buildVendorOptionsHtmlCache() {
    vendorOptionsHtmlCache = "";
    Object.keys(vendorMap).forEach(function (cid) {
        vendorOptionsHtmlCache += `<option value="${cid}">${vendorMap[cid]}</option>`;
    });
}

// Always renders the Vendor + Verify columns — no more Single/Partial branching.
function renderVerifyLineItems() {
    const $tbody = $("#verifyTableID tbody").empty();

    if (!vendorOptionsHtmlCache) {
        buildVendorOptionsHtmlCache();
    }

/*    verifyLineItemsData.forEach(function (item, i) {
        const n = i + 1;

        // Which vendor should be pre-selected in this row's dropdown?
        // Verified row → its saved Vendor_Id.
        // Unverified row → falls back to the header's vendor as the default.
        const selectedVendor = item.isVerified
            ? item.vendorId
            : (item.vendorId || verifyHeaderVendorId);

        let optsHtml = vendorOptionsHtmlCache;
        if (selectedVendor) {
            optsHtml = optsHtml.replace(
                `value="${selectedVendor}"`,
                `value="${selectedVendor}" selected`
            );
        }

        // Locked (disabled) once the row is verified; editable otherwise.
        const vendorDisabledAttr = item.isVerified ? "disabled" : "";

        $tbody.append(`
            <tr id="verifyrow${n}" data-item-request-id="${item.itemRequestId || ''}">
                <td>${n}</td>
                <td><input type="text" class="form-control form-control-sm" value="${item.itemLabel}" readonly></td>
                <td><input type="text" class="form-control form-control-sm" value="${item.uom}" readonly></td>
                <td><input type="text" class="form-control form-control-sm" value="${item.description}" readonly></td>
                <td><input type="text" class="form-control form-control-sm" value="${item.quantity}" readonly></td>
                <td><input type="text" class="form-control form-control-sm" id="verify_price_${n}"
                           value="${item.price}"></td>
                <td><input type="text" class="form-control form-control-sm" value="${item.remarks}" readonly></td>
                <td>
                    <select class="form-control form-control-sm" id="verify_vendor_${n}" ${vendorDisabledAttr}>
                        <option value="">Select Vendor</option>
                        ${optsHtml}
                    </select>
                </td>
                <td class="text-center">
                    <input type="checkbox" id="verify_check_${n}"
                           style="width:16px;height:16px;" ${item.isVerified ? "checked" : ""}>
                </td>
            </tr>`);
			
			$tbody.append(`
			    <tr id="verifyrow${n}" data-item-request-id="${item.itemRequestId || ''}">
			        <td>${n}</td>
			        <td><input type="text" class="form-control form-control-sm" value="${item.itemLabel}" readonly></td>
			        <td><input type="text" class="form-control form-control-sm" value="${item.uom}" readonly></td>
			        <td><input type="text" class="form-control form-control-sm" value="${item.description}" readonly></td>
			        <td><input type="text" class="form-control form-control-sm" value="${item.quantity}" readonly></td>
			        <td><input type="text" class="form-control form-control-sm" id="verify_price_${n}"
			                   value="${item.price}"></td>
			        <td><input type="text" class="form-control form-control-sm" value="${item.remarks}" readonly></td>
			        <td>
			            <select class="form-control form-control-sm" id="verify_vendor_${n}" ${vendorDisabledAttr}>
			                <option value="">Select Vendor</option>
			                ${optsHtml}
			            </select>
			        </td>
			        <td class="text-center">
			            <input type="checkbox" id="verify_check_${n}" class="verify-check-item"
			                   style="width:16px;height:16px;"
			                   ${item.isVerified ? "checked disabled" : ""}>
			        </td>
			    </tr>`);
    });*/
	verifyLineItemsData.forEach(function (item, i) {
	    const n = i + 1;

	    const selectedVendor = item.isVerified
	        ? item.vendorId
	        : (item.vendorId || verifyHeaderVendorId);

	    let optsHtml = vendorOptionsHtmlCache;
	    if (selectedVendor) {
	        optsHtml = optsHtml.replace(
	            `value="${selectedVendor}"`,
	            `value="${selectedVendor}" selected`
	        );
	    }

	    // Vendor locks whenever the row is already verified (checkbox pre-checked on load).
	    const vendorDisabledAttr = item.isVerified ? "disabled" : "";

	    // Price stays gated on isLocked (is_gatepass + verified) — unchanged.
	    const priceReadonlyAttr  = item.isLocked ? "readonly" : "";

	    $tbody.append(`
	        <tr id="verifyrow${n}" data-item-request-id="${item.itemRequestId || ''}">
	            <td>${n}</td>
	            <td><input type="text" class="form-control form-control-sm" value="${item.itemLabel}" readonly></td>
	            <td><input type="text" class="form-control form-control-sm" value="${item.uom}" readonly></td>
	            <td><input type="text" class="form-control form-control-sm" value="${item.description}" readonly></td>
	            <td><input type="text" class="form-control form-control-sm" value="${item.quantity}" readonly></td>
	            <td><input type="text" class="form-control form-control-sm" id="verify_price_${n}"
	                       value="${item.price}" ${priceReadonlyAttr}></td>
	            <td><input type="text" class="form-control form-control-sm" value="${item.remarks}" readonly></td>
	            <td>
	                <select class="form-control form-control-sm" id="verify_vendor_${n}" ${vendorDisabledAttr}>
	                    <option value="">Select Vendor</option>
	                    ${optsHtml}
	                </select>
	            </td>
	            <td class="text-center">
	                <input type="checkbox" id="verify_check_${n}" class="verify-check-item"
	                       style="width:16px;height:16px;"
	                       ${item.isVerified ? "checked" : ""} ${item.isLocked ? "disabled" : ""}>
	            </td>
	        </tr>`);
	});
}

// Toggling the checkbox locks/unlocks that row's Vendor select in real time.
// Ticking a row now requires a real vendor to already be selected.
$(document).on("change", "[id^='verify_check_']", function () {
    const idx         = $(this).attr("id").replace("verify_check_", "");
    const $vendorSel  = $("#verify_vendor_" + idx);
    const $vendorErr  = $("#verify_vendor_" + idx + "_error");

    if ($(this).is(":checked")) {
        const vendorVal = $vendorSel.val();

        if (!vendorVal || vendorVal === "1") {
            // Block the check — no vendor picked yet
            $(this).prop("checked", false);
            $vendorErr.show();
            $vendorSel.addClass("is-invalid");
            return;
        }

        $vendorErr.hide();
        $vendorSel.removeClass("is-invalid");
        $vendorSel.prop("disabled", true);   // lock the vendor in

    } else {
        $vendorSel.prop("disabled", false);  // unlock so it can follow the header again
    }
});

function submitVerification() {
    const requestId     = $("#verifyModal_RequestId").val();
    const items         = [];
    let   hasVendorError = false;

    $("#verifyTableID tbody tr").each(function () {
        const $tr           = $(this);
        const idx           = $tr.attr("id").replace("verifyrow", "");
        const itemRequestId = $tr.data("item-request-id")
                                ? parseInt($tr.data("item-request-id")) : null;
        const price     = parseFloat($("#verify_price_" + idx).val());
        const verified  = $("#verify_check_" + idx).is(":checked");
        const vendorVal = $("#verify_vendor_" + idx).val();

        if (verified && (!vendorVal || vendorVal === "1")) {
            $("#verify_vendor_" + idx + "_error").show();
            $("#verify_vendor_" + idx).addClass("is-invalid");
            hasVendorError = true;
        }

        items.push({
            itemRequestId,
            price    : isNaN(price) ? 0 : price,
            verified,
            vendor   : (vendorVal && vendorVal !== "1") ? parseInt(vendorVal) : null
        });
    });

    if (hasVendorError) {
        alert("Vendor is mandatory. Please select the vendor before verify.");
        return;
    }

   /* if (!items.some(i => i.verified)) {
        alert("Please verify at least one line item before submitting.");
        return;
    }*/

    // If the header vendor select is enabled (Vendor-type request), it must have a real value too
    let headerVendor = null;
    if ($("#tovendorverify").is(":enabled")) {
        headerVendor = $("#tovendorverify").val();
        if (!headerVendor || headerVendor === "1") {
            $("#tovendorverifyError").show();
            alert("Please select the vendor at header level before verify.");
            return;
        }
    }

    const payload = {
        verifiedBy   : sessionStorage.getItem("id"),
        headerVendor : headerVendor,   // null if header wasn't editable (Employee-type request)
        items        : items
    };

    $.ajax({
        url         : new URL("/api/rgp/verify/" + requestId, baseUrl),
        type        : "PUT",
        contentType : "application/json",
        data        : JSON.stringify(payload),
        xhrFields   : { withCredentials: true },
        success: function (response) {
            $("#exampleModalScrollableVerify").modal("hide");
            if (response === "NO_ITEMS_VERIFIED") {
                showPopup("Please verify at least one line item.", "RGPRequest.jsp");
                return;
            }
            showPopup("RGP verified successfully!", "RGPRequest.jsp");
        },
        error: function (xhr) {
            $("#exampleModalScrollableVerify").modal("hide");
            if (xhr.status === 409 && xhr.responseText === "GATE_PASS_ALREADY_ISSUED") {
                $("#modalMessage").text("This RGP already has a gate pass issued and can no longer be verified.");
                $("#messageModal").modal("show");
                return;
            }
			if (xhr.status === 400 ) {
			          $("#modalMessage").text("No item has been verified.");
			               $("#messageModal").modal("show");
						   
						  
			               return;
			   }
            console.error("Verify RGP failed:", xhr);
            alert("Failed to verify RGP. Please try again.");
        }
    });
}


function showPopup(message, redirectUrl) {
	var popup = $('<div class="popup">' + message + '</div>').appendTo('body').hide().fadeIn(400);
	setTimeout(function() {
		popup.fadeOut(400, function() {
			$(this).remove();
			window.location = redirectUrl;
		});
	}, 400);
}




// ── Utilities ─────────────────────────────────────────────────────────
function allowOnlyPositive(e) {
    if (e.key === "-" || e.keyCode === 189 || e.keyCode === 109) return false;
    return (e.key >= "0" && e.key <= "9") ||
           ["Backspace","Delete","ArrowLeft","ArrowRight","Tab"].includes(e.key);
}

/*function showPopup(message) {
    const $p = $("<div>").addClass("popup").text(message).appendTo("body");
    setTimeout(function () { $p.remove(); }, 400);
}*/