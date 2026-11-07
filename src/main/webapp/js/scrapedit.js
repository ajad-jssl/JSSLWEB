/* ======================================================================
   scrapedit.js  -  UPDATE Sale Order (multiple line items)
   Depends on helpers defined in Scrap.js (loaded before this file):
   byId, can, setError, apiGet, fillSelect, fillTaxSelect, applyTaxes,
   getTaxMasters, buildItemRow, initItemRow, calcRowTotal, sumRowTotals,
   renumberRows, validateItemRows, wireItemTable
   ====================================================================== */

// ids of existing DB item rows that the user removed in the update modal
let deletedItemIds = [];

document.addEventListener("DOMContentLoaded", function () {

    // line items (update modal)
    wireItemTable(byId("itemRowsUp"), recalcAllUp, function (row) {
        const id = row.querySelector(".item-id")?.value;
        if (id && id !== "0") deletedItemIds.push(id);
    });
    byId("addItemBtnUp").addEventListener("click", function () {
        addItemRowUp();
    });

    // taxes
    fetchtaxadd1up();
    fetchtaxadd2up();
    fetchtaxadd3up();

    ["tax11up", "tax12up", "tax13up"].forEach((taxPercentId) => {
        byId(taxPercentId).addEventListener("input", () => {
            calculateTaxes(parseFloat(byId("netAmountup").value) || 0);
        });
    });

    const selectedFactoryId = sessionStorage.getItem("selectedFactoryId");
    if (selectedFactoryId) {
        fetchSaleOrderTypesUP();
        fetchLocationTypesUP();
        fetchOrderToUP();
        fetchbillingup();
        fetchshippingup();
        fetchbusunitup();
    } else {
        console.error("No factory ID found in sessionStorage.");
    }
});

/* ------------------------------ header dropdowns (update modal) ------------------------------ */
async function fetchSaleOrderTypesUP() {
    try {
        const json = await apiGet(`/jssl/salesordertype/list`);
        if (json.status !== "yes" || !json.SalesOrderTypeDetails?.length) {
            console.warn("No sale order types found.");
            return;
        }
        fillSelect(byId("saleOrderTypeAddup"), "Select Sale Order Type", json.SalesOrderTypeDetails,
            t => t.saleorder_id, t => t.saleorder_typename);
    } catch (error) {
        console.error("Error fetching sale order types:", error);
    }
}

async function fetchLocationTypesUP() {
    try {
        const json = await apiGet(`/jssl/scrapsalelocation/list`);
        if (json.status !== "yes" || !json.ListLocationTrack?.length) {
            console.warn("No locations found.");
            return;
        }
        fillSelect(byId("locationTypeAddUP"), "Select location", json.ListLocationTrack,
            t => t.slid, t => t.location_name);
    } catch (error) {
        console.error("Error fetching locations:", error);
    }
}

async function fetchOrderToUP() {
    try {
        const json = await apiGet(`/jssl/invoiceConsigneeAddress/getInvoiceAddressNew`);
        if (json.status !== "yes" || !json.InvoiceAddress?.length) {
            console.warn("No order-to addresses found.");
            return;
        }
        fillSelect(byId("saleOrderToup"), "Select order To",
            json.InvoiceAddress.filter(t => t.is_verified == 1), t => t.id, t => t.address);
    } catch (error) {
        console.error("Error fetching order to:", error);
    }
}

async function fetchbillingup() {
    try {
        const json = await apiGet(`/jssl/invoiceConsigneeAddress/getInvoiceAddressNew`);
        if (json.status !== "yes" || !json.InvoiceAddress?.length) {
            console.warn("No billing addresses found.");
            return;
        }
        fillSelect(byId("billingaddup"), "Select billing address",
            json.InvoiceAddress.filter(t => t.is_verified == 1), t => t.id, t => t.address);
    } catch (error) {
        console.error("Error fetching billing addresses:", error);
    }
}

async function fetchshippingup() {
    try {
        const json = await apiGet(`/jssl/invoiceConsigneeAddress/getConsigneeAddressNew`);
        if (json.status !== "yes" || !json.ConsigneeAddress?.length) {
            console.warn("No shipping addresses found.");
            return;
        }
        fillSelect(byId("shippingaddup"), "Select shipping address",
            json.ConsigneeAddress.filter(t => t.is_verified == 1), t => t.id, t => t.address);
    } catch (error) {
        console.error("Error fetching shipping addresses:", error);
    }
}

async function fetchbusunitup() {
    try {
        const json = await apiGet(`/jssl/contract/listbusinessunitnew`);
        if (json.status !== "yes" || !json.Data?.length) {
            console.warn("No business units found.");
            return;
        }
        fillSelect(byId("businessUnitAddressup"), "Select busnisess unit", json.Data,
            t => t.business_unit_id,
            t => t.business_unit_name
                ? (t.business_unit_name + ' ' + t.orgName + ',' + t.location + ',' + t.stateName + '(' + t.gst_number + ')')
                : "");
    } catch (error) {
        console.error("Error fetching business units:", error);
    }
}

/* ------------------------------ taxes (update modal) ------------------------------ */
const TAX_FIELDS_UP = [
    ["tax1addup", "tax11up", "tax1valueup"],
    ["tax2addup", "tax12up", "tax2valueup"],
    ["tax3addup", "tax13up", "tax3valueup"]
];

function isDuplicateTaxUpdate(selectedValue, currentId) {
    if (!selectedValue) return false;
    return TAX_FIELDS_UP.some(([selectId]) =>
        selectId !== currentId && byId(selectId).value === selectedValue);
}

// total = net amount
function calculateTaxes(total) {
    const taxTotal = applyTaxes(TAX_FIELDS_UP, total);
    byId("totalTaxup").value = taxTotal.toFixed(2);
    byId("grandTotalup").value = (total + taxTotal).toFixed(2);
}

async function fetchTaxData(selectId, taxPercentId, taxValueId) {
    try {
        const taxData = await getTaxMasters();
        if (!taxData.length) {
            console.warn("No tax data found.");
            return;
        }

        const select = byId(selectId);
        fillTaxSelect(select, taxData);

        select.onchange = function () {
            if (isDuplicateTaxUpdate(select.value, selectId)) {
                alert("This tax is already selected in another field!");
                select.value = "";
                byId(taxPercentId).value = "";
                byId(taxValueId).value = "";
            } else {
                byId(taxPercentId).value = select.options[select.selectedIndex]?.dataset.taxPer || "";
            }
            calculateTaxes(parseFloat(byId("netAmountup").value) || 0);
        };
    } catch (error) {
        console.error("Error fetching tax data:", error);
    }
}

function fetchtaxadd1up() { fetchTaxData("tax1addup", "tax11up", "tax1valueup"); }
function fetchtaxadd2up() { fetchTaxData("tax2addup", "tax12up", "tax2valueup"); }
function fetchtaxadd3up() { fetchTaxData("tax3addup", "tax13up", "tax3valueup"); }

/* ------------------------------ line items (update modal) ------------------------------ */
// data = existing item from the API (edit) or undefined for a brand new row
async function addItemRowUp(data) {
    const tbody = byId("itemRowsUp");
    const row = buildItemRow("item-row-up", true);
    tbody.appendChild(row);
    renumberRows(tbody);
    await initItemRow(row, data);
    return row;
}

function recalcAllUp() {
    const sum = sumRowTotals(byId("itemRowsUp"), true);
    byId("totalNoUp").value = sum.toFixed(2);
    byId("netAmountup").value = sum.toFixed(2);
    calculateTaxes(sum);
}

/* ------------------------------ open the update modal ------------------------------ */
async function editRecord(sale_order_code) {
    if (!can("Edit")) {
        alert(" You do not have permission to edit.");
        return;
    }

    try {
        const response = await apiGet(`/jssl/saleOrderEntry/getSaleOrderBasedOnIdNew`, { sale_order_code });

        // Order level data
        if (response.orderLevel && response.orderLevel.length > 0) {
            const order = response.orderLevel[0];

            $('#locationTypeAddUP').val(order.location_type_id);
            $('#saleOrderTypeAddup').val(order.sale_order_type_id);
            $('#saleOrderToup').val(order.sale_order_to_id);
            $('#durationDateup').val(order.sale_order_duration);
            $('#advancePaymentup').val(order.advance_payment);
            $('#auctionDateup').val(order.auction_date);
            $('#billingaddup').val(order.billing_address_id);
            $('#shippingaddup').val(order.shipping_address_id);
            $('#businessUnitAddressup').val(order.business_unit_id);
            $('#tax1addup').val(order.tax1);
            $('#tax1valueup').val(order.tax1_value);
            $('#tax2addup').val(order.tax2);
            $('#tax2valueup').val(order.tax2_value);
            $('#tax3addup').val(order.tax3);
            $('#tax3valueup').val(order.tax3_value);
            $('#netAmountup').val(order.net_amount);
            $('#totalTaxup').val(order.total_tax);
            $('#grandTotalup').val(order.grand_total);
            $('#saleOrderNoUP').val(order.sale_order_code);
            $('#tax11up').val(order.tax1_per);
            $('#tax12up').val(order.tax2_per);
            $('#tax13up').val(order.tax3_per);
        }

        $('#exampleModalScrollable123Update').modal('show');

        // Line items: one row per saved item
        deletedItemIds = [];
        const tbody = byId("itemRowsUp");
        tbody.innerHTML = "";

        const items = response.orderItemLevel || [];
        if (items.length > 0) {
            // rows are appended synchronously inside addItemRowUp, so the order is kept
            await Promise.all(items.map(item => addItemRowUp({
                auction_no:    item.auction_no,
                scrap_type_id: item.scrap_type_id,
                scrapitem_id:  item.scrapitem_id,
                uom_id:        item.uom_id,
                quantity:      item.quantity,
                kg:            item.kg,
                unit_price:    item.unit_price,
                total:         item.total,
                tolerance:     item.tolerance,
                soei_id:       item.soei_id
            })));
            $('#soeid').val(items[0].soe_id);
        } else {
            await addItemRowUp();
        }

        byId("totalNoUp").value = sumRowTotals(tbody, false).toFixed(2);

        // Terms table
        const termsTable = document.querySelector('#myTablup tbody');
        termsTable.innerHTML = '';
        let termsRows = '';

        if (response.orderDescriptionLevel && response.orderDescriptionLevel.length > 0) {
            // The same term can come back more than once (e.g. when the query is
            // joined with the item rows), so keep only the first row per sl_no.
            const seenSlNo = new Set();
            response.orderDescriptionLevel.forEach((desc) => {
                const slKey = String(desc.sl_no);
                if (seenSlNo.has(slKey)) return;
                seenSlNo.add(slKey);
                termsRows += `
                        <tr>
                            <td><textarea class="form-control textareaup">${desc.terms_conditions}</textarea></td>
                            <td style="display:none;"><input type="hidden" class="sl_no" value="${desc.sl_no}"></td>
                        </tr>
                    `;
            });
            termsTable.innerHTML = termsRows;
            $('#myTablup').show();
        } else {
            $('#myTablup').hide();
        }
    } catch (error) {
        console.error('Error fetching sale order:', error);
        $('#exampleModalScrollable123Update').modal('hide');
    }
}

/* ------------------------------ terms & conditions ------------------------------ */
function addNewRowup() {
    let tableBody = document.querySelector("#myTablup tbody");
    let newRow = document.createElement("tr");

    // Find the last existing sl_no value and increment it
    let lastSlNo = 0;
    let slNoInputs = tableBody.querySelectorAll(".sl_no");
    if (slNoInputs.length > 0) {
        lastSlNo = Math.max(...Array.from(slNoInputs).map(input => parseInt(input.value) || 0));
    }
    let newSlNo = lastSlNo + 1;

    newRow.innerHTML = `
        <td><textarea class="form-control textareaup"></textarea></td>
        <td style="display:none;"><input type="hidden" class="sl_no" value="${newSlNo}"></td>
    `;

    tableBody.appendChild(newRow);
}

/* ------------------------------ validation ------------------------------ */
function openModalUpdate() {
    const checks = [
        ['saleOrderTypeAddup',   'productCodeError2up',  'Please select order type.'],
        ['locationTypeAddUP',    'productCodeError3up',  'Please select location type.'],
        ['saleOrderToup',        'productCodeError4up',  'Please select order to.'],
        ['auctionDateup',        'productCodeError13up', 'Please enter Auction Date.'],
        ['durationDateup',       'productCodeError14up', 'Please enter Sale Order Duration Date.'],
        ['advancePaymentup',     'productCodeError15up', 'Please enter Advance Payment.'],
        ['billingaddup',         'productCodeError16up', 'Please select Billing Address.'],
        ['shippingaddup',        'productCodeError17up', 'Please select Shipping Address.'],
        ['businessUnitAddressup','productCodeError18up', 'Please select Business Unit Address.']
    ];

    let showError = false;
    checks.forEach(([fieldId, errId, msg]) => {
        if (setError(errId, byId(fieldId).value.trim() === '' ? msg : "")) showError = true;
    });

    if (!validateItemRows(byId("itemRowsUp"), byId("itemsErrorUp"))) showError = true;

    if (!showError) {
        $('#exampleModalCenter66update').modal('show');
    }
}

/* ------------------------------ save update ------------------------------ */
function updateevent() {

    $('#exampleModalCenter66update').modal('hide');

    const tax1 = byId("tax1addup").value;
    const tax2 = byId("tax2addup").value;
    const tax3 = byId("tax3addup").value;

    // Duplicate tax check
    if (
        (tax1 && (tax1 === tax2 || tax1 === tax3)) ||
        (tax2 && (tax2 === tax3))
    ) {
        alert("Duplicate tax not allowed");
        return;
    }

    // Terms & conditions and their SL numbers (kept as separate lists)
    const termsConditionsValues = Array.from(document.querySelectorAll("#myTablup tbody tr .textareaup"))
        .map(textarea => textarea.value.trim())
        .filter(value => value !== "");

    const slNoValues = Array.from(document.querySelectorAll("#myTablup tbody tr .sl_no"))
        .map(input => input.value.trim())
        .filter(value => value !== "");

    if (termsConditionsValues.length !== slNoValues.length) {
        console.error("Terms Conditions:", termsConditionsValues);
        console.error("SL Numbers:", slNoValues);
        alert(
            "Terms and conditions count (" + termsConditionsValues.length +
            ") does not match SL No count (" + slNoValues.length + ")."
        );
        return;
    }

    // Line items: one array per field, same order => index i is one item
    const rows = Array.from(document.querySelectorAll("#itemRowsUp tr"));
    const pick = (sel) => rows.map(r => r.querySelector(sel).value);

    const val = (id) => byId(id).value;

    const ajaxData = {
        sale_order_type_id: val("saleOrderTypeAddup"),
        location_type_id: val("locationTypeAddUP"),
        sale_order_to_id: val("saleOrderToup"),
        auction_date: val("auctionDateup"),
        sale_order_duration: val("durationDateup"),
        advance_payment: val("advancePaymentup"),
        billing_address_id: val("billingaddup"),
        shipping_address_id: val("shippingaddup"),
        business_unit_id: val("businessUnitAddressup"),

        tax1: tax1,
        tax1_value: val("tax1valueup"),
        tax2: tax2,
        tax2_value: val("tax2valueup"),
        tax3: tax3,
        tax3_value: val("tax3valueup"),

        net_amount: val("netAmountup"),
        total_tax: val("totalTaxup"),
        grand_total: val("grandTotalup"),

        sale_order_code: val("saleOrderNoUP"),
        soe_id: val("soeid"),
        modified_by: createdById,

        // line items (arrays -> repeated keys)
        soei_id: pick(".item-id"),            // "0" = new row, otherwise existing row id
        auction_no: pick(".auction-no"),
        scrap_type_id: pick(".scrap-type"),
        scrapitem_id: pick(".scrap-item"),
        uom_id: pick(".uom"),
        quantity: pick(".qty"),
        kg: pick(".kg"),
        unit_price: pick(".uprice"),
        total: pick(".row-total"),
        tolerance: pick(".tolerance"),
        deleted_item_ids: deletedItemIds,     // existing rows removed by the user

        // do NOT join these with a comma
        terms_conditions: termsConditionsValues,
        sl_no: slNoValues
    };

    $.ajax({
        url: new URL('/jssl/saleOrderEntry/updateSaleOrderNew', baseUrl),
        type: 'POST',
        xhrFields: { withCredentials: true },
        dataType: 'json',
        data: $.param(ajaxData, true), // true => key=1&key=2 (not key[]=1)

        success: function (data) {
            var result = data.message;

            if (result && result.toLowerCase().includes("success")) {

                const popup = $('<div class="popup">Sale Order Updated Successfully!</div>')
                    .appendTo('body')
                    .hide()
                    .fadeIn(400);

                setTimeout(function () {
                    popup.fadeOut(400, function () {
                        $(this).remove();
                        window.location = 'Scrap.jsp';
                    });
                }, 800);

            } else {
                const errorMessage = data.message || 'Failed to update sale order.';
                $('#errorMessage').text(errorMessage);
                $('#exampleModalCenterDup').modal('show');
                alert(errorMessage);
            }
        },

        error: function (xhr, status, error) {
            console.error("Request failed.");
            console.error("Status:", status);
            console.error("Error:", error);
            console.error("Response:", xhr.responseText);
        }
    });
}