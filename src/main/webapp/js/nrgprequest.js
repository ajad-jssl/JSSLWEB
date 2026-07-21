/* =====================================================================
   NGPB REQUEST — ngpbrequest.js
   Non-Returnable Gate Pass
   Mirrors rgprequest.js structure 1:1 (now including select2)
   Depends on: baseUrl from js/config.js
   ===================================================================== */

let ngpbItemMasterList = [];
let ngpbRowCount       = 1;
let ngpbUpRowCount     = 1;

function ngpbInitSelect2(selector, modalId, placeholder) {
    $(selector).select2({
        theme          : "bootstrap4",
        width          : "100%",
        dropdownParent : $(modalId),
        placeholder    : placeholder || "Select",
        allowClear     : true
    });
}

// ── Open create modal ─────────────────────────────────────────────────
$("#ngpbcreate").click(function () {
    console.log("ngpb create clicked");
    $("#ngpbCreateModal").modal("show");
});

// ── Single document.ready ─────────────────────────────────────────────
$(document).ready(async function () {

    // Date defaults
    const today = new Date().toISOString().split('T')[0];
    /*$("#ngpbreturndatee").attr("min", today).val(today);
    $("#ngpbreturndateup").attr("min", today).val(today);*/

    // Contract locked by default — only unlocked when location = "Site"
    $("#ngpbcontractno").prop("disabled", true).val("");
    $("#ngpbcontractnoup").prop("disabled", true).val("");

    // ── Select2 init — CREATE modal ───────────────────────────────
    ngpbInitSelect2("#ngpbtovendor", "#ngpbCreateModal", "Select Vendor");
    ngpbInitSelect2("#ngpbemployee", "#ngpbCreateModal", "Select Employee");
    ngpbInitSelect2("#ngpbitemno1",  "#ngpbCreateModal", "-- Select Item --");

    // ── Select2 init — UPDATE modal ───────────────────────────────
    ngpbInitSelect2("#ngpbtovendorup", "#ngpbUpdateModal", "Select Vendor");
    ngpbInitSelect2("#ngpbemployeeup", "#ngpbUpdateModal", "Select Employee");
    ngpbInitSelect2("#ngpbupitemno1",  "#ngpbUpdateModal", "-- Select Item --");

    loadNgpbFactoryLocations();

    // Load all dropdowns
    loadNgpbUomMaster();
    loadNgpbItemMaster();
    await loadNgpbVendors();
    await loadNgpbEmployees();
    ngpbList();

    loadNgpbContracts();
    loadNgpbPRSequence();

    // ── Vendor / Employee toggle — CREATE modal ───────────────────────
    $("#ngpbselectvendor").on("change", function () {
        const val = this.value;
        if (val === "1") {
            $("#ngpbtovendor").prop("disabled", false);
            $("#ngpbemployee").prop("disabled", true).val("").trigger("change");
            $("#ngpbempaddress").prop("disabled", true).val("");
            $("#ngpbemployeeaddress").val("").prop("readonly", true);
            $("#ngpbcontractno").prop("disabled", true).val("");
        } else if (val === "2") {
            $("#ngpbemployee").prop("disabled", false);
            $("#ngpbtovendor").prop("disabled", true).val("").trigger("change");
            $("#ngpbempaddress").prop("disabled", false);
            $("#ngpbcontractno").prop("disabled", true).val("");
        } else {
            $("#ngpbtovendor").prop("disabled", true).val("").trigger("change");
            $("#ngpbemployee").prop("disabled", true).val("").trigger("change");
            $("#ngpbempaddress").prop("disabled", true).val("");
            $("#ngpbemployeeaddress").val("").prop("readonly", true);
            $("#ngpbcontractno").prop("disabled", true).val("");
        }
    });

    // ── When employee is selected → load factory locations ───────────
    $("#ngpbemployee").on("change", function () {
        if ($(this).val()) {
            loadNgpbFactoryLocations();
        } else {
            $("#ngpbempaddress").empty().append('<option value="">Select Location</option>');
            $("#ngpbemployeeaddress").val("");
        }
    });

    // ── When factory location selected → fill address ─────────────────
    $("#ngpbempaddress").on("change", function () {
        const selected   = $(this).find("option:selected");
        const locationId = selected.val();

        $("#ngpbcontractnoError").hide();

        if (locationId === "OTHER") {
            $("#ngpbemployeeaddress").val("").prop("readonly", false);
            $("#ngpbcontractno").prop("disabled", true).val("");

        } else if (locationId === "Site") {
            $("#ngpbemployeeaddress").val("").prop("readonly", true);
            $("#ngpbcontractno").prop("disabled", false).val("");

        } else {
            $("#ngpbemployeeaddress").val(selected.data("address") || "").prop("readonly", true);
            $("#ngpbcontractno").prop("disabled", true).val("");
        }
    });

    // ── When contract is selected AND location is "Site" → fetch & prefill address
    $("#ngpbcontractno").on("change", function () {
        const contractId = $(this).val();
        const location    = $("#ngpbempaddress").val();

        if (location === "Site" && contractId) {
            $.ajax({
                url       : new URL("/api/description", baseUrl),
                type      : "GET",
                data      : { contractId: contractId },
                dataType  : "text",
                xhrFields : { withCredentials: true },
                success: function (response) {
                    $("#ngpbemployeeaddress").val(response || "").prop("readonly", true);
                },
                error: function (xhr) {
                    console.error("Failed to load contract description:", xhr);
                    $("#ngpbemployeeaddress").val("");
                }
            });
        }
    });

    // ── Vendor / Employee toggle — UPDATE modal ───────────────────────
    $("#ngpbselectvendorup").on("change", function () {
        const val = this.value;
        if (val === "1") {
            $("#ngpbtovendorup").prop("disabled", false);
            $("#ngpbemployeeup").prop("disabled", true).val("").trigger("change");
            $("#ngpbempaddressup").prop("disabled", true).val("");
            $("#ngpbemployeeaddressup").val("").prop("readonly", true);
            $("#ngpbcontractnoup").prop("disabled", true).val("");
        } else if (val === "2") {
            $("#ngpbemployeeup").prop("disabled", false);
            $("#ngpbtovendorup").prop("disabled", true).val("").trigger("change");
            $("#ngpbempaddressup").prop("disabled", false);
            $("#ngpbcontractnoup").prop("disabled", true).val("");
        } else {
            $("#ngpbtovendorup").prop("disabled", true).val("").trigger("change");
            $("#ngpbemployeeup").prop("disabled", true).val("").trigger("change");
            $("#ngpbempaddressup").prop("disabled", true).val("");
            $("#ngpbemployeeaddressup").val("").prop("readonly", true);
            $("#ngpbcontractnoup").prop("disabled", true).val("");
        }
    });

    // Employee change → load factory locations for update modal
    $("#ngpbemployeeup").on("change", function () {
        if ($(this).val()) {
            loadNgpbFactoryLocationsUp();
        } else {
            $("#ngpbempaddressup").empty().append('<option value="">Select Location</option>');
            $("#ngpbemployeeaddressup").val("");
        }
    });

    // Factory location change → fill address for update modal
    $("#ngpbempaddressup").on("change", function () {
        const selected   = $(this).find("option:selected");
        const locationId = selected.val();

        $("#ngpbcontractnoErrorup").hide();

        if (locationId === "OTHER") {
            $("#ngpbemployeeaddressup").val("").prop("readonly", false);
            $("#ngpbcontractnoup").prop("disabled", true).val("");

        } else if (locationId === "Site") {
            $("#ngpbemployeeaddressup").val("").prop("readonly", true);
            $("#ngpbcontractnoup").prop("disabled", false).val("");

        } else {
            $("#ngpbemployeeaddressup").val(selected.data("address") || "").prop("readonly", true);
            $("#ngpbcontractnoup").prop("disabled", true).val("");
        }
    });

    // Contract change → fetch & prefill address (UPDATE modal), only when location is "Site"
    $("#ngpbcontractnoup").on("change", function () {
        const contractId = $(this).val();
        const location    = $("#ngpbempaddressup").val();

        if (location === "Site" && contractId) {
            $.ajax({
                url       : new URL("/api/description", baseUrl),
                type      : "GET",
                data      : { contractId: contractId },
                dataType  : "text",
                xhrFields : { withCredentials: true },
                success: function (response) {
                    $("#ngpbemployeeaddressup").val(response || "").prop("readonly", true);
                },
                error: function (xhr) {
                    console.error("Failed to load contract description:", xhr);
                    $("#ngpbemployeeaddressup").val("");
                }
            });
        }
    });

    // Create → validate → show confirm popup
    $("#ngpbShowConfirm").on("click", function () {
        if (!ngpbValidateHeader())   return;
        if (!ngpbCollectLineItems()) return;
        $("#ngpbConfirmCreate").modal("show");
    });

    // Confirmed YES → POST
    $("#ngpbConfirmYes").on("click", function () {
        const lineItems = ngpbCollectLineItems();
        if (!lineItems) return;

        const payload = {
            selectvendor     : $("#ngpbselectvendor").val(),
            tovendor         : $("#ngpbtovendor").val()          || null,
            employee         : $("#ngpbemployee").val()          || null,
            employeeLocation : $("#ngpbempaddress").val()        || null,
            employeeAddress  : $("#ngpbemployeeaddress").val()   || null,
            returnDate       : null,
            contractno       : $("#ngpbcontractno").val()        || null,
            remarks          : $("#ngpbremarks5").val().trim(),
            createdBy        : sessionStorage.getItem("id"),
            requestBy        : sessionStorage.getItem("Empcode"),
            reasondisptach   : $("#ngpbreasondispatch").val().trim() || null,
            selectfactoryId  : localStorage.getItem("selectedFactoryId"),
            lineItems        : lineItems   // [{ itemid, quantity, price, remarks }]
        };

        $.ajax({
            url         : new URL("api/ngpb", baseUrl),
            type        : "POST",
            contentType : "application/json",
            data        : JSON.stringify(payload),
            xhrFields   : { withCredentials: true },
            success: function () {
                $("#ngpbConfirmCreate").modal("hide");
                $("#ngpbCreateModal").modal("hide");
                showPopup("NGPB created successfully!","NRGPRequest.jsp");
                ngpbList();
            },
            error: function (err) {
                console.error("Create NGPB failed:", err);
                alert("Failed to create NGPB. Please try again.");
            }
        });
    });

});

let ngpbUomMap = {};

function loadNgpbUomMaster() {
    $.ajax({
        url: new URL('/api/items/all', baseUrl),
        type: 'GET',
        xhrFields: { withCredentials: true },
        success: function (data) {
            ngpbUomMap = {};
            $.each(data, function (i, item) {
                ngpbUomMap[item.uid] = item.unit;
            });
            console.log('NGPB UOM Master:', ngpbUomMap);
        },
        error: function (xhr, status, error) {
            console.error('Failed to load UOM master:', error);
        }
    });
}

// ── PR Sequence ───────────────────────────────────────────────────────
function loadNgpbPRSequence() {
    const factoryId = localStorage.getItem("selectedFactoryId");
    const prefix    = factoryId == "1" ? "NRGPB-PR"
                     : factoryId == "2" ? "NRGPG-PR" : "";
    $.ajax({
        url       : baseUrl + "/api/UserRequest/ngpb/next-sequence",
        type      : "GET",
        xhrFields : { withCredentials: true },
        success: function (sequence) {
            const fmt = sequence < 1000 ? String(sequence).padStart(3, "0") : sequence;
            $("#ngpbcode").val(prefix + fmt);
        }
    });
}

let currentFactoryIdNGPB;

function ngpbList() {

    currentFactoryIdNGPB = parseInt(localStorage.getItem("selectedFactoryId"), 10);
    const EmpCode = sessionStorage.getItem("Empcode");

    if (!currentFactoryIdNGPB || isNaN(currentFactoryIdNGPB)) {
        console.warn("No valid factory ID in localStorage");
        return;
    }

    if ($.fn.DataTable.isDataTable('#ngpbTable')) {
        $('#ngpbTable').DataTable().clear().destroy();
    }

    $('#ngpbTable').DataTable({
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
                    const url = new URL(`/api/ngpb/pagging/${currentFactoryIdNGPB}`, baseUrl);
                    url.searchParams.append('empCode', EmpCode);
                    url.searchParams.append('page', 0);
                    url.searchParams.append('size', 99999);

                    fetch(url, { credentials: "include" })
                        .then(response => response.json())
                        .then(json => {

                            const exportData = (json.data || []).map(item => {

                                let sentTo = "";
                                if (item.vendor_Name && item.vendor_Name !== "NULL") {
                                    sentTo = ngpbVendorMap[String(item.vendor_Name)] || "";
                                } else if (item.employee_Name && item.employee_Name !== "NULL") {
                                    sentTo = ngpbEmployeeMap[String(item.employee_Name)]
                                             || "Employee #" + item.employee_Name;
                                }

                                return [
                                    item.pr_No || "",
                                    sentTo
                                ];
                            });

                            let tempTable = $('<table>').append(
                                $('<thead>').append(
                                    $('<tr>').append(
                                        '<th>PR No</th>',
                                        '<th>Sent To</th>'
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
                                    title: 'NGPB Request Details'
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
            { title: "Sl No", orderable: false },
            { title: "PR No" },
            { title: "Sent To" },
            { title: "Edit", orderable: false },
            { title: "Cancel", orderable: false }
        ],

        ajax: function (data, callback, settings) {

            const page        = data.start / data.length;
            const size        = data.length;
            const searchValue = data.search.value;

            const url = new URL(`/api/ngpb/pagging/${currentFactoryIdNGPB}`, baseUrl);
            url.searchParams.append('empCode', EmpCode);
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
                            sentTo = ngpbVendorMap[String(item.vendor_Name)] || "";
                        } else if (item.employee_Name && item.employee_Name !== "NULL") {
                            sentTo = ngpbEmployeeMap[String(item.employee_Name)]
                                     || "Employee #" + item.employee_Name;
                        }

                        const editIcon =
                            `<i class="fa fa-pen"
                                style="color:blue;cursor:pointer;"
                                onclick="ngpbEdit(${item.request_Id})"
                                title="Edit"></i>`;

                        const cancelIcon =
                            `<i class="fa fa-times-circle"
                                style="color:red;cursor:pointer;"
                                onclick="cancelNgpb(${item.request_Id})"
                                title="Cancel"></i>`;

                        return [
                            slNo++,
                            item.pr_No || "",
                            sentTo,
                            editIcon,
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
                    console.error('Error fetching NGPB data:', error);
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


let pendingCancelNgpbId = null;

function cancelNgpb(requestId) {
    pendingCancelNgpbId = requestId;
    $("#cancelNgpbModal").modal("show");
}

$("#confirmCancelNgpb").on("click", function () {

    if (!pendingCancelNgpbId) return;

    const requestId = pendingCancelNgpbId;

    $.ajax({
        url         : new URL("/api/rgpreqeust/cancel/" + requestId, baseUrl),
        type        : "PUT",
        xhrFields   : { withCredentials: true },
        success: function () {
            $("#cancelNgpbModal").modal("hide");
            showPopup("NGPB Request cancelled successfully!", "NRGPRequest.jsp");
            ngpbList();
        },
        error: function (xhr) {
            $("#cancelNgpbModal").modal("hide");
            if (xhr.status === 409 && xhr.responseText === "GATE_PASS_ALREADY_ISSUED") {
                $("#modalMessage").text("This NRGPB already has a gate pass issued and can no longer be cancelled.");
                $("#messageModal").modal("show");
                return;
            }
            console.error("Cancel NGPB failed:", xhr);
            alert("Failed to cancel NGPB. Please try again.");
        }
    });

    pendingCancelNgpbId = null;
});

// ── Vendors / Employees ────────────────────────────────────────────────
let ngpbVendorMap   = {};
let ngpbEmployeeMap = {};

function loadNgpbVendors() {
    return new Promise(function (resolve) {
        $.ajax({
            url       : new URL("/api/clients", baseUrl),
            type      : "GET",
            xhrFields : { withCredentials: true },
            success: function (response) {
                const $v  = $("#ngpbtovendor").empty().append('<option value="1">Select Vendor</option>');
                const $vu = $("#ngpbtovendorup").empty().append('<option value="1">Select Vendor</option>');
                response.forEach(function (c) {
                    ngpbVendorMap[String(c.cid)] = c.client_number + " - " + c.name;
                    const opt = $("<option>", { value: c.cid, text: c.client_number + " - " + c.name });
                    $v.append(opt.clone());
                    $vu.append(opt.clone());
                });
                $v.trigger("change");
                $vu.trigger("change");
                resolve();
            },
            error: function (err) { console.error(err); resolve(); }
        });
    });
}

function loadNgpbEmployees() {
    return new Promise(function (resolve) {
        $.ajax({
            url       : new URL("/api/websmartuser/getAll", baseUrl),
            type      : "GET",
            xhrFields : { withCredentials: true },
            success: function (response) {
                const $e  = $("#ngpbemployee").empty().append('<option value="">Select Employee</option>');
                const $eu = $("#ngpbemployeeup").empty().append('<option value="">Select Employee</option>');
                response.Data.forEach(function (u) {
                    ngpbEmployeeMap[String(u.id)] = u.username;
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

// ── Edit NGPB → prefill Update modal ──────────────────────────────────
let ngpbOriginalSnapshot = {};

function ngpbEdit(requestId) {
    $.ajax({
        url       : new URL("/api/rgp/edit/" + requestId, baseUrl),
        type      : "GET",
        xhrFields : { withCredentials: true },
        success: function (response) {
            if (!response || response.length === 0) return;

            const header = response[0];

            $("#ngpbUpdateId").val(header.Request_Id);
            $("#ngpbcodeup").val(header.PR_No || "");

            // ── Vendor / Employee ─────────────────────────────────
            // Both fields now use select2, so .val() alone won't repaint the
            // widget — it needs a "change" event. BUT plain "change" would
            // also re-fire the business-logic handlers bound to these fields
            // (in particular #ngpbemployeeup's handler calls
            // loadNgpbFactoryLocationsUp() with NO args, which would wipe out
            // the saved location/address we set explicitly below).
            //
            // Fix: trigger "change.select2" — select2 listens on this
            // namespaced event internally to redraw itself, but our own
            // .on("change", ...) handlers (bound without a namespace) do
            // NOT fire for a namespaced trigger. This updates the visible
            // select2 box without touching the custom handlers.
            if (header.Vendor_Name && String(header.Vendor_Name) !== "null") {
                $("#ngpbselectvendorup").val("1");
                $("#ngpbtovendorup")
                    .prop("disabled", false)
                    .val(String(header.Vendor_Name))
                    .trigger("change.select2");
                $("#ngpbemployeeup")
                    .prop("disabled", true)
                    .val("")
                    .trigger("change.select2");
                $("#ngpbempaddressup").prop("disabled", true).val("");
                $("#ngpbemployeeaddressup").val("").prop("readonly", true);

            } else if (header.Employee_Name && String(header.Employee_Name) !== "null") {
                $("#ngpbselectvendorup").val("2");
                $("#ngpbemployeeup")
                    .prop("disabled", false)
                    .val(String(header.Employee_Name))
                    .trigger("change.select2");   // repaint only — does NOT
                                                   // fire the plain "change"
                                                   // handler that would call
                                                   // loadNgpbFactoryLocationsUp()
                                                   // with no args
                $("#ngpbtovendorup")
                    .prop("disabled", true)
                    .val("")
                    .trigger("change.select2");
                $("#ngpbempaddressup").prop("disabled", false);
                loadNgpbFactoryLocationsUp(
                    header.Employee_Sender_Location || null,
                    header.Employee_Address         || null
                );
            } else {
                $("#ngpbselectvendorup").val("");
                $("#ngpbtovendorup").prop("disabled", true).val("").trigger("change.select2");
                $("#ngpbemployeeup").prop("disabled", true).val("").trigger("change.select2");
                $("#ngpbempaddressup").prop("disabled", true).val("");
                $("#ngpbemployeeaddressup").val("").prop("readonly", true);
            }

            // ── Return Date ───────────────────────────────────────
            const rd = header.Expected_Return_Date
                ? header.Expected_Return_Date.toString().split("T")[0] : "";
            $("#ngpbreturndateup").val(rd);

            // ── Contract + Remarks ────────────────────────────────
            loadNgpbContractsUp(header.Contract_No);
            $("#ngpbremarks5up").val(header.Remarks || "");
            $("#ngpbreasondispatchup").val(header.reasondisptach || "");

            // ── Line Items ────────────────────────────────────────
            $("#ngpbTableUpdate tbody").empty();
            ngpbUpRowCount = 0;

            response.forEach(function (row) {
                if (!row.Item_Id) return;
                ngpbUpRowCount++;
                const n = ngpbUpRowCount;

                $("#ngpbTableUpdate tbody").append(`
                    <tr id="ngpbuprow${n}" data-item-request-id="${row.ItemRequest_Id || ''}">
                        <td>${n}</td>
                        <td>
                            <select class="form-control form-control-sm"
                                    id="ngpbupitemno${n}"
                                    onchange="ngpbGetUpdateItemDetails(${n})"></select>
                        </td>
                        <td><input type="text" class="form-control form-control-sm" id="ngpbupunit${n}" readonly></td>
                        <td><input type="text" class="form-control form-control-sm" id="ngpbupdesc1${n}" readonly></td>
                        <td><input type="text" class="form-control form-control-sm" id="ngpbupqty${n}"
                                   onkeydown="return allowOnlyPositive(event)"></td>
                        <td><input type="text" class="form-control form-control-sm" id="ngpbupprice${n}"
                                   onkeydown="return allowOnlyPositive(event)"></td>
                        <td><input type="text" class="form-control form-control-sm" id="ngpbupremarks${n}"></td>
                        <td class="text-center">
                            <i class="bi bi-trash text-danger" style="cursor:pointer;font-size:16px;"
                               onclick="ngpbDeleteUpdateRow(this)" title="Delete"></i>
                        </td>
                    </tr>`);

                ngpbPopulateItemDropdown("ngpbupitemno" + n);
                ngpbInitSelect2("#ngpbupitemno" + n, "#ngpbUpdateModal", "-- Select Item --");
                $("#ngpbupitemno" + n).val(String(row.Item_Id)).trigger("change");
                ngpbGetUpdateItemDetails(n);

                $("#ngpbupqty"    + n).val(row.Quantity     || "");
                $("#ngpbupprice"  + n).val(row.Price        || "");
                $("#ngpbupremarks" + n).val(row.Item_Remarks || "");
            });

            if (ngpbUpRowCount === 0) {
                ngpbUpRowCount = 1;
                $("#ngpbTableUpdate tbody").append(`
                    <tr id="ngpbuprow1" data-item-request-id="">
                        <td>1</td>
                        <td><select class="form-control form-control-sm" id="ngpbupitemno1"
                                    onchange="ngpbGetUpdateItemDetails(1)"></select></td>
                        <td><input type="text" class="form-control form-control-sm" id="ngpbupunit1" readonly></td>
                        <td><input type="text" class="form-control form-control-sm" id="ngpbupdesc11" readonly></td>
                        <td><input type="text" class="form-control form-control-sm" id="ngpbupqty1"
                                   onkeydown="return allowOnlyPositive(event)"></td>
                        <td><input type="text" class="form-control form-control-sm" id="ngpbupprice1"
                                   onkeydown="return allowOnlyPositive(event)"></td>
                        <td><input type="text" class="form-control form-control-sm" id="ngpbupremarks1"></td>
                        <td class="text-center">
                            <i class="bi bi-trash text-danger" style="cursor:pointer;font-size:16px;"
                               onclick="ngpbDeleteUpdateRow(this)" title="Delete"></i>
                        </td>
                    </tr>`);
                ngpbPopulateItemDropdown("ngpbupitemno1");
                ngpbInitSelect2("#ngpbupitemno1", "#ngpbUpdateModal", "-- Select Item --");
            }

            // ── Snapshot AFTER all fields are filled ──────────────
            // Small delay so async dropdowns (contracts/locations) settle
            setTimeout(function () {
                ngpbOriginalSnapshot = ngpbCaptureUpdateSnapshot();
            }, 600);

            $("#ngpbUpdateModal").modal("show");
        },
        error: function (xhr) {
            console.error("Failed to load NGPB for edit", xhr);
            alert("Failed to load record. Please try again.");
        }
    });
}

// ── Capture current state of the update modal ─────────────────────────
function ngpbCaptureUpdateSnapshot() {
    return {
        selectvendor     : $("#ngpbselectvendorup").val()        || "",
        tovendor         : $("#ngpbtovendorup").val()            || "",
        employee         : $("#ngpbemployeeup").val()            || "",
        employeeLocation : $("#ngpbempaddressup").val()          || "",
        employeeAddress  : $("#ngpbemployeeaddressup").val()     || "",
        returnDate       : $("#ngpbreturndateup").val()          || "",
        contractno       : $("#ngpbcontractnoup").val()          || "",
        remarks          : $("#ngpbremarks5up").val().trim()     || "",
        reasondisptach   : $("#ngpbreasondispatchup").val().trim() || "",
        lineItems        : ngpbCollectUpdateLineItems(true)      || []
    };
}

// ── Collect update line items ─────────────────────────────────────────
function ngpbCollectUpdateLineItems(silentMode) {
    const lineItems = [];
    let   valid     = true;

    if (!silentMode) {
        $("#ngpbTableUpdate .line-item-error").remove();
        $("#ngpbTableUpdate select, #ngpbTableUpdate input").removeClass("is-invalid");
    }

    $("#ngpbTableUpdate tbody tr").each(function (i) {
        const $tr           = $(this);
        const idx           = $tr.attr("id").replace("ngpbuprow", "");
        const itemRequestId = $tr.data("item-request-id")
                                ? parseInt($tr.data("item-request-id")) : null;
        const $itemSel = $("#ngpbupitemno" + idx);
        const $qtyInp  = $("#ngpbupqty"    + idx);
        const itemid   = parseInt($itemSel.val())   || 0;
        const qty      = parseFloat($qtyInp.val())  || 0;
        const price    = parseFloat($("#ngpbupprice" + idx).val());
        const remarks  = ($("#ngpbupremarks" + idx).val() || "").trim();
        let   rowOk    = true;

        if (!silentMode) {
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

// ── Update button ─────────────────────────────────────────────────────
$("#ngpbUpdateButton").on("click", function () {

    if (!ngpbValidateHeaderUp()) return;

    const lineItems = ngpbCollectUpdateLineItems(false);
    if (!lineItems) return;

    const current = {
        selectvendor     : $("#ngpbselectvendorup").val()        || "",
        tovendor         : $("#ngpbtovendorup").val()            || "",
        employee         : $("#ngpbemployeeup").val()            || "",
        employeeLocation : $("#ngpbempaddressup").val()          || "",
        employeeAddress  : $("#ngpbemployeeaddressup").val()     || "",
        returnDate       : null,
        contractno       : $("#ngpbcontractnoup").val()          || "",
        remarks          : $("#ngpbremarks5up").val().trim()     || "",
        reasondisptach   : $("#ngpbreasondispatchup").val().trim() || "",
        lineItems        : lineItems
    };

    // ── Deep compare with original snapshot ──────────────────────
    if (JSON.stringify(current) === JSON.stringify(ngpbOriginalSnapshot)) {
        showPopup("No Feilds Changes.","NRGPRequest.jsp");
        return;
    }

    const requestId = $("#ngpbUpdateId").val();

    const payload = {
        selectvendor     : current.selectvendor,
        tovendor         : current.tovendor          || null,
        employee         : current.employee          || null,
        employeeLocation : current.employeeLocation  || null,
        employeeAddress  : current.employeeAddress   || null,
        returnDate       : null,
        contractno       : current.contractno        || null,
        remarks          : current.remarks,
        modifiedBy       : sessionStorage.getItem("id"),
        reasondisptach   : current.reasondisptach,
        lineItems        : current.lineItems
    };

    $.ajax({
        url         : new URL("/api/rgp/" + requestId, baseUrl),
        type        : "PUT",
        contentType : "application/json",
        data        : JSON.stringify(payload),
        xhrFields   : { withCredentials: true },
        success: function (response) {
            if (response === "NO_CHANGES") {
                showPopup("No Feilds Changes.","NRGPRequest.jsp");
                return;
            }
            $("#ngpbUpdateModal").modal("hide");
            showPopup("NGPB updated successfully!","NRGPRequest.jsp");
            ngpbList();   // refresh table
        },
		error: function (xhr) {
		    if (xhr.status === 409 && xhr.responseText === "GATE_PASS_ALREADY_ISSUED") {
		        $("#ngpbUpdateModal").modal("hide");
		        $("#modalMessage").text("This NRGPB already has a gate pass issued and can no longer be edited.");
		        $("#messageModal").modal("show");
		        return;
		    }
		    console.error("Update NGPB failed:", xhr);
		    alert("Failed to update NGPB. Please try again.");
		}
    });
});
// FIX: cast contract_id to String so .val() matches "15" == "15"
function loadNgpbContractsUp(selectedContractId) {
    const factoryId = localStorage.getItem("selectedFactoryId");
    $.ajax({
        url       : new URL("/jssl/contracts/allContracts", baseUrl),
        type      : "GET",
        data      : { factory: factoryId },
        xhrFields : { withCredentials: true },
        success: function (response) {
            const $dd = $("#ngpbcontractnoup").empty()
                            .append('<option value="">Select Contract</option>');
            $.each(response.contracts, function (i, c) {
                $dd.append(`<option value="${c.contract_id}">${c.JobCode}</option>`);
            });
            if (selectedContractId) {
                $("#ngpbcontractnoup").val(String(selectedContractId));
            }
        },
        error: function (xhr, s, err) { console.error("Error loading contracts:", err); }
    });
}

// FIX: accepts saved location + address to pre-fill after options load
function loadNgpbFactoryLocationsUp(selectedLocationId, savedAddress) {
    const currentFactoryId = localStorage.getItem("selectedFactoryId");
    $.ajax({
        url       : new URL("/api/allfactory", baseUrl),
        type      : "GET",
        xhrFields : { withCredentials: true },
        success: function (response) {
            const $dd = $("#ngpbempaddressup").empty()
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
                    $("#ngpbemployeeaddressup").val(savedAddress || "").prop("readonly", false);
                    $("#ngpbcontractnoup").prop("disabled", true);

                } else if (sel.val() === "Site") {
                    $("#ngpbemployeeaddressup").val(savedAddress || "").prop("readonly", true);
                    $("#ngpbcontractnoup").prop("disabled", false);

                } else {
                    $("#ngpbemployeeaddressup")
                        .val(sel.data("address") || savedAddress || "")
                        .prop("readonly", true);
                    $("#ngpbcontractnoup").prop("disabled", true);
                }
            } else {
                $("#ngpbcontractnoup").prop("disabled", true).val("");
            }
        },
        error: function (xhr) { console.error("Failed to load factory locations", xhr); }
    });
}

// ── Contracts ─────────────────────────────────────────────────────────
function loadNgpbContracts() {
    const factoryId = localStorage.getItem("selectedFactoryId");
    $.ajax({
        url       : new URL("/jssl/contracts/allContracts", baseUrl),
        type      : "GET",
        data      : { factory: factoryId },
        xhrFields : { withCredentials: true },
        success: function (response) {
            const $dd = $("#ngpbcontractno").empty().append('<option value="">Select Contract</option>');
            $.each(response.contracts, function (i, c) {
                $dd.append(`<option value="${c.contract_id}">${c.JobCode}</option>`);
            });
        },
        error: function (xhr, s, err) { console.error("Error loading contracts:", err); }
    });
}

// ── Item Master ───────────────────────────────────────────────────────
function loadNgpbItemMaster() {
    $.ajax({
        url: new URL('/api/items', baseUrl),
        type: 'GET',
        xhrFields: { withCredentials: true },
        success: function (data) {
            ngpbItemMasterList = data;
            ngpbPopulateItemDropdown("ngpbitemno1");     // CREATE row 1
            ngpbPopulateItemDropdown("ngpbupitemno1");   // UPDATE row 1
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
function ngpbPopulateItemDropdown(selectId) {
    const $sel = $("#" + selectId);
    if (!$sel.length) return;

    $sel.empty().append('<option value="">-- Select Item --</option>');

    ngpbItemMasterList.forEach(function (item) {
        $sel.append(
            $("<option>", {
                value        : item.itemid,
                text         : item.itemNo + " - " + (item.itmDescription1 || ""),
                "data-um"    : ngpbUomMap[item.um]          || "",
                "data-desc1" : item.itmDescription1 || ""
            })
        );
    });

    $sel.trigger("change.select2");
}

// ── CREATE modal: auto-fill on item select ────────────────────────────
function ngpbGetItemDetails(rowNum) {
    const opt = $("#ngpbitemno" + rowNum + " option:selected");
    $("#ngpbunit"  + rowNum).val(opt.data("um")    || "");
    $("#ngpbdesc1" + rowNum).val(opt.data("desc1") || "");
}

// ── UPDATE modal: auto-fill on item select ────────────────────────────
function ngpbGetUpdateItemDetails(rowNum) {
    const opt = $("#ngpbupitemno" + rowNum + " option:selected");
    $("#ngpbupunit"  + rowNum).val(opt.data("um")    || "");
    $("#ngpbupdesc1" + rowNum).val(opt.data("desc1") || "");
}

// ── Add / Delete rows — CREATE modal ─────────────────────────────────
function ngpbAddNewRow() {
    ngpbRowCount++;
    const n = ngpbRowCount;
    $("#ngpbTableCreate tbody").append(`
      <tr id="ngpbrow${n}">
        <td>${n}</td>
        <td><select class="form-control form-control-sm" id="ngpbitemno${n}" onchange="ngpbGetItemDetails(${n})"></select></td>
        <td><input type="text" class="form-control form-control-sm" id="ngpbunit${n}" readonly></td>
        <td><input type="text" class="form-control form-control-sm" id="ngpbdesc1${n}" readonly></td>
        <td><input type="text" class="form-control form-control-sm" id="ngpbqty${n}" onkeydown="return allowOnlyPositive(event)"></td>
        <td><input type="text" class="form-control form-control-sm" id="ngpbprice${n}" onkeydown="return allowOnlyPositive(event)"></td>
        <td><input type="text" class="form-control form-control-sm" id="ngpbremarks${n}"></td>
        <td class="text-center"><i class="bi bi-trash text-danger" style="cursor:pointer;font-size:16px;" onclick="ngpbDeleteRow(this)" title="Delete"></i></td>
      </tr>`);
    ngpbPopulateItemDropdown("ngpbitemno" + n);
    ngpbInitSelect2("#ngpbitemno" + n, "#ngpbCreateModal", "-- Select Item --");
}

function ngpbDeleteRow(btn) {
    const $tr = $(btn).closest("tr");
    $tr.find("select").each(function () {
        if ($(this).data("select2")) $(this).select2("destroy");
    });
    $tr.remove();
    ngpbRenumber("#ngpbTableCreate");
}

// ── Add / Delete rows — UPDATE modal ──────────────────────────────────
function ngpbAddNewUpdateRow() {
    ngpbUpRowCount++;
    const n = ngpbUpRowCount;
    $("#ngpbTableUpdate tbody").append(`
      <tr id="ngpbuprow${n}">
        <td>${n}</td>
        <td><select class="form-control form-control-sm" id="ngpbupitemno${n}" onchange="ngpbGetUpdateItemDetails(${n})"></select></td>
        <td><input type="text" class="form-control form-control-sm" id="ngpbupunit${n}" readonly></td>
        <td><input type="text" class="form-control form-control-sm" id="ngpbupdesc1${n}" readonly></td>
        <td><input type="text" class="form-control form-control-sm" id="ngpbupqty${n}" onkeydown="return allowOnlyPositive(event)"></td>
        <td><input type="text" class="form-control form-control-sm" id="ngpbupprice${n}" onkeydown="return allowOnlyPositive(event)"></td>
        <td><input type="text" class="form-control form-control-sm" id="ngpbupremarks${n}"></td>
        <td class="text-center"><i class="bi bi-trash text-danger" style="cursor:pointer;font-size:16px;" onclick="ngpbDeleteUpdateRow(this)" title="Delete"></i></td>
      </tr>`);
    ngpbPopulateItemDropdown("ngpbupitemno" + n);
    ngpbInitSelect2("#ngpbupitemno" + n, "#ngpbUpdateModal", "-- Select Item --");
}

function ngpbDeleteUpdateRow(btn) {
    const $tr = $(btn).closest("tr");
    $tr.find("select").each(function () {
        if ($(this).data("select2")) $(this).select2("destroy");
    });
    $tr.remove();
    ngpbRenumber("#ngpbTableUpdate");
}

function ngpbRenumber(tableSelector) {
    $(tableSelector + " tbody tr").each(function (i) {
        $(this).find("td:first").text(i + 1);
    });
}

// ── Collect line items (only itemid to backend) ───────────────────────
function ngpbCollectLineItems() {
    const lineItems = [];
    let   valid     = true;

    $("#ngpbTableCreate .line-item-error").remove();
    $("#ngpbTableCreate select, #ngpbTableCreate input").removeClass("is-invalid");

    $("#ngpbTableCreate tbody tr").each(function (i) {
        const idx      = $(this).attr("id").replace("ngpbrow", "");
        const $itemSel = $("#ngpbitemno" + idx);
        const $qtyInp  = $("#ngpbqty"    + idx);
        const itemid   = parseInt($itemSel.val())   || 0;
        const qty      = parseFloat($qtyInp.val())  || 0;
        const price    = parseFloat($("#ngpbprice" + idx).val());
        const remarks  = ($("#ngpbremarks" + idx).val() || "").trim();
        let   rowOk    = true;

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
function ngpbValidateHeader() {
    let ok = true;
    const type = $("#ngpbselectvendor").val();

    if (!type) {
        $("#ngpbselectvendorError").show(); ok = false;
    } else {
        $("#ngpbselectvendorError").hide();
    }

    $("#ngpbtovendorError").hide();

    if (type === "1") {
        $("#ngpbemployeeError").hide();
        $("#ngpbempaddressError").hide();
        $("#ngpbemployeeaddressError").hide();
        $("#ngpbcontractnoError").hide();

    } else if (type === "2") {
        if (!$("#ngpbemployee").val()) {
            $("#ngpbemployeeError").show(); ok = false;
        } else {
            $("#ngpbemployeeError").hide();
        }
        if (!$("#ngpbempaddress").val()) {
            $("#ngpbempaddressError").show(); ok = false;
        } else {
            $("#ngpbempaddressError").hide();
        }
        if (!$("#ngpbemployeeaddress").val().trim()) {
            $("#ngpbemployeeaddressError").show(); ok = false;
        } else {
            $("#ngpbemployeeaddressError").hide();
        }

        if ($("#ngpbempaddress").val() === "Site" && !$("#ngpbcontractno").val()) {
            $("#ngpbcontractnoError").show(); ok = false;
        } else {
            $("#ngpbcontractnoError").hide();
        }

    } else {
        $("#ngpbemployeeError").hide();
        $("#ngpbempaddressError").hide();
        $("#ngpbemployeeaddressError").hide();
        $("#ngpbcontractnoError").hide();
    }

if (!$("#ngpbreasondispatch").val()) {
        $("#ngpbreasondispatchError").show(); ok = false;
    } else {
        $("#ngpbreasondispatchError").hide();
    }

    return ok;
}

function ngpbValidateHeaderUp() {
    let ok = true;
    const type = $("#ngpbselectvendorup").val();

    if (!type) {
        $("#ngpbselectvendorErrorup").show(); ok = false;
    } else {
        $("#ngpbselectvendorErrorup").hide();
    }

    $("#ngpbtovendorErrorup").hide();

    if (type === "1") {
        $("#ngpbemployeeErrorup").hide();
        $("#ngpbempaddressErrorup").hide();
        $("#ngpbemployeeaddressErrorup").hide();
        $("#ngpbcontractnoErrorup").hide();

    } else if (type === "2") {
        if (!$("#ngpbemployeeup").val()) {
            $("#ngpbemployeeErrorup").show(); ok = false;
        } else {
            $("#ngpbemployeeErrorup").hide();
        }
        if (!$("#ngpbempaddressup").val()) {
            $("#ngpbempaddressErrorup").show(); ok = false;
        } else {
            $("#ngpbempaddressErrorup").hide();
        }
        if (!$("#ngpbemployeeaddressup").val().trim()) {
            $("#ngpbemployeeaddressErrorup").show(); ok = false;
        } else {
            $("#ngpbemployeeaddressErrorup").hide();
        }

        if ($("#ngpbempaddressup").val() === "Site" && !$("#ngpbcontractnoup").val()) {
            $("#ngpbcontractnoErrorup").show(); ok = false;
        } else {
            $("#ngpbcontractnoErrorup").hide();
        }

    } else {
        $("#ngpbemployeeErrorup").hide();
        $("#ngpbempaddressErrorup").hide();
        $("#ngpbemployeeaddressErrorup").hide();
        $("#ngpbcontractnoErrorup").hide();
    }

    if (!$("#ngpbreasondispatchup").val()) {
        $("#ngpbreasondispatchupError").show(); ok = false;
    } else {
        $("#ngpbreasondispatchupError").hide();
    }

    return ok;
}

// ── Load Factory Locations (exclude current selected factory) ─────────
function loadNgpbFactoryLocations() {
    const currentFactoryId = localStorage.getItem("selectedFactoryId");

    $.ajax({
        url       : new URL("/api/allfactory", baseUrl),
        type      : "GET",
        xhrFields : { withCredentials: true },
        success: function (response) {
            const $dd = $("#ngpbempaddress").empty().append('<option value="">Select Location</option>');

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
        },
        error: function (xhr) {
            console.error("Failed to load factory locations", xhr);
        }
    });
}

// ── Utilities ─────────────────────────────────────────────────────────
function allowOnlyPositive(e) {
    if (e.key === "-" || e.keyCode === 189 || e.keyCode === 109) return false;
    return (e.key >= "0" && e.key <= "9") ||
           ["Backspace","Delete","ArrowLeft","ArrowRight","Tab"].includes(e.key);
}

/*function showNgpbPopup(message) {
    const $p = $("<div>").addClass("popup").text(message).appendTo("body");
    setTimeout(function () { $p.remove(); }, 400);
}
*/
function showPopup(message, redirectUrl) {
	var popup = $('<div class="popup">' + message + '</div>').appendTo('body').hide().fadeIn(400);
	setTimeout(function() {
		popup.fadeOut(400, function() {
			$(this).remove();
			window.location = redirectUrl;
		});
	}, 2000);
}