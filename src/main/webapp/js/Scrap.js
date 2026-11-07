/* ======================================================================
   Scrap.js  -  Scrap Sale Order list + CREATE (multiple line items)
   The shared helpers at the top are also used by scrapedit.js, which is
   loaded AFTER this file (same order as in Scrap.jsp).
   ====================================================================== */

/* ------------------------------ permissions ------------------------------ */
let allowed = null;
const can = (action) => (allowed || []).includes(action);

function loadAllowedActions() {
    const rawPageName = window.location.pathname.split("/").pop();
    const pageName = rawPageName.endsWith(".jsp") ? rawPageName : rawPageName + ".jsp";

    const userId = sessionStorage.getItem("user_id");
    if (!userId) {
        console.warn("User ID not found in sessionStorage");
        return;
    }

    const url = new URL(`/api/user-tab-actions-by-page`, baseUrl);
    url.searchParams.append("userId", userId);
    url.searchParams.append("pageName", pageName);

    fetch(url, { method: "GET", credentials: "include" })
        .then(res => {
            if (!res.ok) throw new Error("Failed to fetch allowed actions");
            return res.json();
        })
        .then(actions => {
            console.log("Allowed Actions:", actions);
            allowed = actions || [];
        })
        .catch(err => {
            console.error("Error fetching actions:", err);
            allowed = [];
        });
}

/* ------------------------------ shared helpers ------------------------------ */
const byId = (id) => document.getElementById(id);

function setError(id, message) {
    const e = byId(id);
    if (!e) return !!message;
    e.innerText = message || "";
    e.style.display = message ? "inline-block" : "none";
    return !!message;
}

async function apiGet(path, params = {}) {
    const url = new URL(path, baseUrl);
    Object.entries(params).forEach(([k, v]) => url.searchParams.append(k, v));
    const response = await fetch(url, { method: "GET", credentials: "include" });
    if (!response.ok) throw new Error("Request failed: " + path);
    return response.json();
}

// Wraps an async loader so it only hits the API once (retries after a failure)
function memoAsync(fn) {
    let promise = null;
    return () => promise || (promise = fn().catch(err => { promise = null; throw err; }));
}

function fillSelect(select, placeholder, items, valueFn, textFn) {
    select.innerHTML = `<option value="">${placeholder}</option>`;
    items.forEach((item) => {
        const value = valueFn(item);
        const text = textFn(item);
        if (value && text) {
            const option = document.createElement("option");
            option.value = value;
            option.textContent = text;
            select.appendChild(option);
        }
    });
}

function fillTaxSelect(select, taxData) {
    select.innerHTML = `<option value="">Select Tax</option>`;
    taxData.forEach((t) => {
        if (t.tax_id && t.tax_name && t.tax_per !== undefined) {
            const option = document.createElement("option");
            option.value = t.tax_id;
            option.dataset.taxPer = t.tax_per;
            option.textContent = t.tax_name + '-' + t.tax_per;
            select.appendChild(option);
        }
    });
}

const isTcs = (select) =>
    (select.options[select.selectedIndex]?.text || "").toUpperCase().includes("TCS");

/* GST-type taxes are calculated on the net amount, TCS on (net + GST).
   fields = [[selectId, percentInputId, valueInputId], ...]  -> returns total tax */
function applyTaxes(fields, net) {
    let gstTotal = 0;
    let taxTotal = 0;

    fields.forEach(([selectId, percId, valId]) => {
        if (isTcs(byId(selectId))) return;
        const per = parseFloat(byId(percId).value) || 0;
        const value = (net * per) / 100;
        byId(valId).value = value.toFixed(2);
        gstTotal += value;
        taxTotal += value;
    });

    fields.forEach(([selectId, percId, valId]) => {
        if (!isTcs(byId(selectId))) return;
        const per = parseFloat(byId(percId).value) || 0;
        const value = ((net + gstTotal) * per) / 100;
        byId(valId).value = value.toFixed(2);
        taxTotal += value;
    });

    return taxTotal;
}

/* ---------- cached master data (shared by create and update modals) ---------- */
const getTaxMasters = memoAsync(async () => {
    const json = await apiGet(`/jssl/taxmasters/list`);
    return json?.Data || [];
});

const getScrapTypes = memoAsync(async () => {
    const json = await apiGet(`/jssl/scraptypes/list`);
    return (json.status === "yes" && json.Lists) || [];
});

const getUoms = memoAsync(async () => {
    const json = await apiGet(`/jssl/master/listunitmeasurementmasternew`);
    return (json.status === "yes" && json.Data) || [];
});

const getScrapItems = memoAsync(async () => {
    const json = await apiGet(`/jssl/scrapsalescrapitems/list`, {
        factory_id: sessionStorage.getItem("selectedFactoryId")
    });
    return (json.status === "yes" && json.ListScrapSaleScrapItems) || [];
});

/* ------------------------------ line item rows ------------------------------ */
// withItemId = true for the UPDATE modal (hidden id of the existing DB row, 0 = new row)
function buildItemRow(rowClass, withItemId) {
    const tr = document.createElement("tr");
    tr.className = rowClass;
    tr.innerHTML = `
      <td class="sl-no"></td>
      <td>
        <input type="number" class="form-control form-control-sm auction-no" min="0" autocomplete="off">
        ${withItemId ? '<input type="hidden" class="item-id" value="0">' : ''}
      </td>
      <td><select class="form-control form-control-sm scrap-type"></select></td>
      <td><select class="form-control form-control-sm scrap-item"><option value="">Select scrap item</option></select></td>
      <td><select class="form-control form-control-sm uom"></select></td>
      <td><input type="number" class="form-control form-control-sm qty" min="0" autocomplete="off"></td>
      <td><input type="number" class="form-control form-control-sm kg" min="0" autocomplete="off"></td>
      <td><input type="number" class="form-control form-control-sm uprice" min="0" autocomplete="off"></td>
      <td><input type="number" class="form-control form-control-sm row-total" readonly></td>
      <td><input type="number" class="form-control form-control-sm tolerance" min="0" autocomplete="off"></td>
      <td><button type="button" class="btn btn-danger btn-sm deleteRowBtn">Delete</button></td>`;
    return tr;
}

// Loads only the items that belong to the chosen scrap type into one row
async function loadItemsForRow(row, stid, selectedSiid) {
    const select = row.querySelector(".scrap-item");
    const reqId = (row._itemReq = (row._itemReq || 0) + 1); // ignore out-of-order responses
    select.innerHTML = `<option value="">Select scrap item</option>`;
    if (!stid) return;

    try {
        const items = await getScrapItems();
        if (reqId !== row._itemReq) return;

        const filtered = items.filter(i => String(i.stid) === String(stid));
        if (!filtered.length) {
            select.innerHTML = `<option value="">No items available</option>`;
            return;
        }
        fillSelect(select, "Select scrap item", filtered, i => i.siid, i => (i.scrapitemname || "").trim());
        if (selectedSiid) select.value = String(selectedSiid);
    } catch (error) {
        console.error("Error fetching scrap items:", error);
    }
}

// Fills the dropdowns of a row; when `data` is given (edit), also sets all values
async function initItemRow(row, data) {
    try {
        const [types, uoms] = await Promise.all([getScrapTypes(), getUoms()]);
        fillSelect(row.querySelector(".scrap-type"), "Select scrap type", types, t => t.stid, t => t.scrap_TypeName);
        fillSelect(row.querySelector(".uom"), "Select uom", uoms, u => u.unit_id, u => u.unit_name);
    } catch (error) {
        console.error("Error loading scrap type / uom:", error);
    }

    if (!data) return;

    row.querySelector(".auction-no").value = data.auction_no ?? "";
    row.querySelector(".scrap-type").value = data.scrap_type_id ?? "";
    await loadItemsForRow(row, data.scrap_type_id, data.scrapitem_id);
    row.querySelector(".uom").value = data.uom_id ?? "";
    row.querySelector(".qty").value = data.quantity ?? "";
    row.querySelector(".kg").value = data.kg ?? "";
    row.querySelector(".uprice").value = data.unit_price ?? "";
    row.querySelector(".row-total").value = data.total ?? "";
    row.querySelector(".tolerance").value = data.tolerance ?? "";
    const idInput = row.querySelector(".item-id");
    if (idInput) idInput.value = data.soei_id ?? 0;
}

// NOS / SQ MTS are priced on quantity, everything else on kgs
function calcRowTotal(row) {
    const uomSel = row.querySelector(".uom");
    const uomText = (uomSel.options[uomSel.selectedIndex]?.text || "").trim().toUpperCase();
    const qty = parseFloat(row.querySelector(".qty").value) || 0;
    const kg = parseFloat(row.querySelector(".kg").value) || 0;
    const price = parseFloat(row.querySelector(".uprice").value) || 0;
    const base = (uomText === "NOS" || uomText === "SQ MTS") ? qty : kg;
    const total = base * price;
    row.querySelector(".row-total").value = total.toFixed(2);
    return total;
}

function sumRowTotals(tbody, recalc) {
    let sum = 0;
    tbody.querySelectorAll("tr").forEach(row => {
        sum += recalc ? calcRowTotal(row) : (parseFloat(row.querySelector(".row-total").value) || 0);
    });
    return sum;
}

function renumberRows(tbody) {
    const rows = tbody.querySelectorAll("tr");
    rows.forEach((row, i) => {
        row.querySelector(".sl-no").textContent = i + 1;
        row.querySelector(".deleteRowBtn").style.display = rows.length > 1 ? "" : "none";
    });
}

function validateItemRows(tbody, errorEl) {
    const rows = tbody.querySelectorAll("tr");
    let valid = rows.length > 0;
    const fields = [".auction-no", ".scrap-type", ".scrap-item", ".uom", ".qty", ".kg", ".uprice", ".tolerance"];

    rows.forEach(row => {
        fields.forEach(sel => {
            const el = row.querySelector(sel);
            const empty = el.value.trim() === "";
            el.style.borderColor = empty ? "red" : "";
            if (empty) valid = false;
        });
    });

    errorEl.innerText = valid ? "" : "Please add at least one item and fill all fields in every item row.";
    errorEl.style.display = valid ? "none" : "inline-block";
    return valid;
}

// Event delegation for one items table body
function wireItemTable(tbody, onChanged, onRowDeleted) {
    tbody.addEventListener("input", (e) => {
        if (e.target.matches(".qty, .kg, .uprice")) onChanged();
    });

    tbody.addEventListener("change", (e) => {
        const row = e.target.closest("tr");
        if (!row) return;
        if (e.target.matches(".uom")) onChanged();
        if (e.target.matches(".scrap-type")) loadItemsForRow(row, e.target.value);
    });

    tbody.addEventListener("click", (e) => {
        const btn = e.target.closest(".deleteRowBtn");
        if (!btn) return;
        const row = btn.closest("tr");
        if (onRowDeleted) onRowDeleted(row);
        row.remove();
        renumberRows(tbody);
        onChanged();
    });
}

/* ------------------------------ page setup ------------------------------ */
byId("modalScroll1").addEventListener("click", function () {
    if (!can("Insert")) {
        alert(" You do not have permission to Insert.");
        $('#exampleModalScrollable123').modal('hide');
        return;
    }
    $('#exampleModalScrollable123').modal('show');
});

const todayStr = new Date().toISOString().split('T')[0];
byId("auctionDate").setAttribute("max", todayStr);
byId("durationDate").setAttribute("min", todayStr);
byId("auctionDateup").setAttribute("max", todayStr);
byId("durationDateup").setAttribute("min", todayStr);

// Terms & Conditions: add a new editable row (create modal)
function addNewRow() {
    const table = byId("myTable");
    const newTbody = document.createElement("tbody");
    newTbody.innerHTML = `<tr><td><textarea class="form-control textarea"></textarea></td></tr>`;
    table.appendChild(newTbody);
}

const selectedFactoryId = sessionStorage.getItem('selectedFactoryId');
console.log('selectedFactoryId:', selectedFactoryId);

document.addEventListener("DOMContentLoaded", function () {
    loadAllowedActions();

    // line items (create modal)
    wireItemTable(byId("itemRows"), recalcAll);
    byId("addItemBtn").addEventListener("click", addItemRow);
    addItemRow(); // first row

    if (selectedFactoryId) {
        fetchSaleOrderTypes();
        fetchUserList(selectedFactoryId);
        fetchLocationTypes();
        fetchOrderTo();
        fetchbilling();
        fetchshipping();
        fetchbusunit();
    } else {
        console.error("No factory ID found in sessionStorage.");
    }
});

/* ------------------------------ list (server-side DataTable) ------------------------------ */
function fetchUserList(selectedFactoryId) {

    // dropdown / code loaders (kept outside the DataTable)
    fetchtaxadd1();
    fetchtaxadd2();
    fetchtaxadd3();
    fetchSaleOrderCode();

    if ($.fn.DataTable.isDataTable('#tableID')) {
        $('#tableID').DataTable().clear().destroy();
    }

    $('#tableID').DataTable({
        processing: false,
        serverSide: true,
        scrollX: true,
        searching: true,
        dom: 'Bfrtip',
        pageLength: 10,
        buttons: [
            {
                text: 'Export to Excel',
                action: function () {

                    const url = new URL(`/jssl/saleOrderEntry/getSaleOrderBasedOnFactoryIdForScrapPaged`, baseUrl);
                    url.searchParams.append('factory_id', selectedFactoryId);
                    url.searchParams.append('page', 0);
                    url.searchParams.append('size', 99999);

                    fetch(url, { credentials: "include" })
                        .then(response => response.json())
                        .then(json => {

                            const formatDate = (dateStr) => {
                                if (!dateStr) return '';
                                const dateObj = new Date(dateStr);
                                if (isNaN(dateObj)) return dateStr;
                                return dateObj.toLocaleDateString("en-GB").replace(/\//g, '-');
                            };

                            const exportData = json.SaleOrderDetails.map(item => [
                                item.sale_order_code || '',
                                formatDate(item.auction_date),
                                item.saleorder_typename || '',
                                item.address || '',
                                item.location_name || ''
                            ]);

                            let tempTable = $('<table>').append(
                                $('<thead>').append(
                                    $('<tr>').append(
                                        '<th>Sale Order Code</th>',
                                        '<th>Auction Date</th>',
                                        '<th>Sale Order Type</th>',
                                        '<th>Sale Order To</th>',
                                        '<th>Location</th>'
                                    )
                                ),
                                $('<tbody>').append(
                                    exportData.map(row =>
                                        $('<tr>').append(row.map(cell => $('<td>').text(cell)))
                                    )
                                )
                            ).appendTo('body');

                            $(tempTable).DataTable({
                                buttons: [{
                                    extend: 'excelHtml5',
                                    title: 'Sale Order List'
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
            { title: "Sale Order Code" },
            { title: "Auction Date" },
            { title: "Sale Order Type" },
            { title: "Sale Order To" },
            { title: "Location" },
            { title: "Edit", orderable: false },
            { title: "Cancel", orderable: false },
            { title: "Print", orderable: false }
        ],
        ajax: function (data, callback, settings) {

            const page = data.start / data.length;
            const size = data.length;
            const searchValue = data.search.value;

            const formatDate = (dateStr) => {
                if (!dateStr) return '';
                const dateObj = new Date(dateStr);
                if (isNaN(dateObj)) return dateStr;
                return dateObj.toLocaleDateString("en-GB").replace(/\//g, '-');
            };

            const url = new URL(`/jssl/saleOrderEntry/getSaleOrderBasedOnFactoryIdForScrapPaged`, baseUrl);
            url.searchParams.append('factory_id', selectedFactoryId);
            url.searchParams.append('page', page);
            url.searchParams.append('size', size);
            url.searchParams.append('search', searchValue);

            fetch(url, { credentials: "include" })
                .then(response => response.json())
                .then(json => {

                    if (!json.SaleOrderDetails || json.status === 'error') {
                        callback({ draw: data.draw, recordsTotal: 0, recordsFiltered: 0, data: [] });
                        return;
                    }

                    const rows = json.SaleOrderDetails.map(item => {

                        const isCancelled = item.cancel == "true";

                        return [
                            item.sale_order_code || '',
                            formatDate(item.auction_date),
                            item.saleorder_typename || '',
                            item.address || '',
                            item.location_name || '',

                            isCancelled
                                ? `<i class="fa fa-edit text-muted"
                                      style="cursor:not-allowed;"
                                      title="Sale Order Cancelled"></i>`
                                : `<i class="fa fa-edit text-primary"
                                      style="cursor:pointer;"
                                      onclick="editRecord('${item.sale_order_code}')"></i>`,

                            isCancelled
                                ? `<i class="fa fa-times-circle text-muted"
                                      style="cursor:not-allowed;"
                                      title="Sale Order Cancelled"></i>`
                                : `<i class="fa fa-times-circle text-danger"
                                      style="cursor:pointer;"
                                      onclick="openModalcancel('${item.sale_order_code}')"></i>`,

                            `<i class="fa fa-print text-success"
                                  style="cursor:pointer;"
                                  onclick="printRecord('${item.sale_order_code}')"></i>`
                        ];
                    });

                    callback({
                        draw: data.draw,
                        recordsTotal: json.totalItems,
                        recordsFiltered: json.totalItems,
                        data: rows
                    });
                })
                .catch(error => {
                    console.error('Error fetching sale order data:', error);
                    callback({ draw: data.draw, recordsTotal: 0, recordsFiltered: 0, data: [] });
                });
        }
    });
}

/* ------------------------------ header dropdowns (create modal) ------------------------------ */
async function fetchSaleOrderTypes() {
    try {
        const json = await apiGet(`/jssl/salesordertype/list`);
        if (json.status !== "yes" || !json.SalesOrderTypeDetails?.length) {
            console.warn("No sale order types found.");
            return;
        }
        fillSelect(byId("saleOrderTypeAdd"), "Select Sale Order Type", json.SalesOrderTypeDetails,
            t => t.saleorder_id, t => t.saleorder_typename);
    } catch (error) {
        console.error("Error fetching sale order types:", error);
    }
}

async function fetchLocationTypes() {
    try {
        const json = await apiGet(`/jssl/scrapsalelocation/list`);
        if (json.status !== "yes" || !json.ListLocationTrack?.length) {
            console.warn("No locations found.");
            return;
        }
        fillSelect(byId("locationTypeAdd"), "Select location", json.ListLocationTrack,
            t => t.slid, t => t.location_name);
    } catch (error) {
        console.error("Error fetching locations:", error);
    }
}

async function fetchOrderTo() {
    try {
        const json = await apiGet(`/jssl/invoiceConsigneeAddress/getInvoiceAddressNew`);
        if (json.status !== "yes" || !json.InvoiceAddress?.length) {
            console.warn("No order-to addresses found.");
            return;
        }
        fillSelect(byId("saleOrderTo"), "Select order To",
            json.InvoiceAddress.filter(t => t.is_verified == 1), t => t.id, t => t.address);
    } catch (error) {
        console.error("Error fetching order to:", error);
    }
}

async function fetchbilling() {
    try {
        const json = await apiGet(`/jssl/invoiceConsigneeAddress/getInvoiceAddressNew`);
        if (json.status !== "yes" || !json.InvoiceAddress?.length) {
            console.warn("No billing addresses found.");
            return;
        }
        fillSelect(byId("billingadd"), "Select billing address",
            json.InvoiceAddress.filter(t => t.is_verified == 1), t => t.id, t => t.address);
    } catch (error) {
        console.error("Error fetching billing addresses:", error);
    }
}

async function fetchshipping() {
    try {
        const json = await apiGet(`/jssl/invoiceConsigneeAddress/getConsigneeAddressNew`);
        if (json.status !== "yes" || !json.ConsigneeAddress?.length) {
            console.warn("No shipping addresses found.");
            return;
        }
        fillSelect(byId("shippingadd"), "Select shipping address",
            json.ConsigneeAddress.filter(t => t.is_verified == 1), t => t.id, t => t.address);
    } catch (error) {
        console.error("Error fetching shipping addresses:", error);
    }
}

async function fetchbusunit() {
    try {
        const json = await apiGet(`/jssl/contract/listbusinessunitnew`);
        if (json.status !== "yes" || !json.Data?.length) {
            console.warn("No business units found.");
            return;
        }
        fillSelect(byId("businessUnitAddress"), "Select busnisess unit", json.Data,
            t => t.business_unit_id,
            t => t.business_unit_name ? (t.business_unit_name + t.location + '(' + t.gst_number + ')') : "");
    } catch (error) {
        console.error("Error fetching business units:", error);
    }
}

async function fetchSaleOrderCode() {
    try {
        const json = await apiGet(`/jssl/saleOrderEntry/getSaleOrderCode`);
        if (json.status !== "yes" || !json.Sale_order_code) {
            console.warn("No Sale Order Code found.");
            return;
        }
        byId("saleOrderNo").value = json.Sale_order_code;
    } catch (error) {
        console.error("Error fetching Sale Order Code:", error);
    }
}

/* ------------------------------ taxes (create modal) ------------------------------ */
const TAX_FIELDS_ADD = [
    ["tax1add", "tax11", "tax1value"],
    ["tax2add", "tax12", "tax2value"],
    ["tax3add", "tax13", "tax3value"]
];

function isDuplicateTax(selectedValue, currentId) {
    if (!selectedValue) return false;
    return TAX_FIELDS_ADD.some(([selectId]) =>
        selectId !== currentId && byId(selectId).value === selectedValue);
}

function recalcTaxesCreate() {
    const net = parseFloat(byId("netAmount").value) || 0;
    const taxTotal = applyTaxes(TAX_FIELDS_ADD, net);
    byId("totalTax").value = taxTotal.toFixed(2);
    byId("grandTotal").value = (net + taxTotal).toFixed(2);
}

async function setupTaxSelectAdd([selectId, percId, valId]) {
    try {
        const taxData = await getTaxMasters();
        const select = byId(selectId);

        if (taxData.length === 0) {
            console.warn("No tax records found.");
            select.innerHTML = `<option value="">No Tax Records Found</option>`;
            return;
        }

        fillTaxSelect(select, taxData);

        select.onchange = function () {
            if (isDuplicateTax(select.value, selectId)) {
                alert("This tax is already selected in another field!");
                select.value = "";
                byId(percId).value = "";
                byId(valId).value = "";
            } else {
                byId(percId).value = select.options[select.selectedIndex]?.dataset.taxPer || "";
            }
            recalcTaxesCreate();
        };
    } catch (error) {
        console.error("Error fetching tax data:", error);
    }
}

function fetchtaxadd1() { return setupTaxSelectAdd(TAX_FIELDS_ADD[0]); }
function fetchtaxadd2() { return setupTaxSelectAdd(TAX_FIELDS_ADD[1]); }
function fetchtaxadd3() { return setupTaxSelectAdd(TAX_FIELDS_ADD[2]); }

/* ------------------------------ create: add row / totals ------------------------------ */
function addItemRow() {
    const tbody = byId("itemRows");
    const row = buildItemRow("item-row", false);
    tbody.appendChild(row);
    renumberRows(tbody);
    initItemRow(row);
    return row;
}

function recalcAll() {
    const sum = sumRowTotals(byId("itemRows"), true);
    byId("totalNo").value = sum.toFixed(2);
    byId("netAmount").value = sum.toFixed(2);
    recalcTaxesCreate();
}

/* ------------------------------ create: validation + save ------------------------------ */
function openModalAdd() {
    const checks = [
        ['saleOrderTypeAdd',   'productCodeError2',  'Please select order type.'],
        ['locationTypeAdd',    'productCodeError3',  'Please select location type.'],
        ['saleOrderTo',        'productCodeError4',  'Please select order to.'],
        ['auctionDate',        'productCodeError13', 'Please enter Auction Date.'],
        ['durationDate',       'productCodeError14', 'Please enter Sale Order Duration Date.'],
        ['advancePayment',     'productCodeError15', 'Please enter Advance Payment.'],
        ['billingadd',         'productCodeError16', 'Please select Billing Address.'],
        ['shippingadd',        'productCodeError17', 'Please select Shipping Address.'],
        ['businessUnitAddress','productCodeError18', 'Please select Business Unit Address.']
    ];

    let showError = false;
    checks.forEach(([fieldId, errId, msg]) => {
        if (setError(errId, byId(fieldId).value.trim() === '' ? msg : "")) showError = true;
    });

    if (!validateItemRows(byId("itemRows"), byId("itemsError"))) showError = true;

    if (!showError) {
        $('#exampleModalCenter66').modal('show');
    }
}

function addevent() {
    $('#exampleModalCenter66').modal('hide');

    const formData = new FormData();
    const val = (id) => byId(id).value;

    // Terms & conditions (one entry per textarea)
    Array.from(document.querySelectorAll("#myTable tbody tr .textarea"))
        .map(t => t.value.trim())
        .filter(v => v !== "")
        .forEach(v => formData.append("termsConditions", v));

    // header fields
    formData.append("sale_order_type_id", val("saleOrderTypeAdd"));
    formData.append("sale_order_code", val("saleOrderNo"));
    formData.append("location_type_id", val("locationTypeAdd"));
    formData.append("sale_order_to_id", val("saleOrderTo"));
    formData.append("auction_date", val("auctionDate"));
    formData.append("sale_order_duration", val("durationDate"));
    formData.append("advance_payment", val("advancePayment"));
    formData.append("billing_address_id", val("billingadd"));
    formData.append("shipping_address_id", val("shippingadd"));
    formData.append("business_unit_id", val("businessUnitAddress"));
    formData.append("tax1", val("tax1add").trim() || "0");
    formData.append("tax1_value", val("tax1value").trim() || "0");
    formData.append("tax2", val("tax2add").trim() || "0");
    formData.append("tax2_value", val("tax2value").trim() || "0");
    formData.append("tax3", val("tax3add").trim() || "0");
    formData.append("tax3_value", val("tax3value").trim() || "0");
    formData.append("net_amount", val("netAmount"));
    formData.append("total_tax", val("totalTax"));
    formData.append("grand_total", val("grandTotal"));
    formData.append("created_by", createdById);
    formData.append("factory_id", selectedFactoryId);

    // line items: repeated keys, same order => index i of every list is one item
    document.querySelectorAll("#itemRows tr").forEach(row => {
        formData.append("auction_no",    row.querySelector(".auction-no").value);
        formData.append("scrap_type_id", row.querySelector(".scrap-type").value);
        formData.append("scrapitem_id",  row.querySelector(".scrap-item").value);
        formData.append("uom_id",        row.querySelector(".uom").value);
        formData.append("quantity",      row.querySelector(".qty").value);
        formData.append("kg",            row.querySelector(".kg").value);
        formData.append("unit_price",    row.querySelector(".uprice").value);
        formData.append("total",         row.querySelector(".row-total").value);
        formData.append("tolerance",     row.querySelector(".tolerance").value);
    });

    $.ajax({
        url: new URL('/jssl/saleOrderEntry/addSaleOrderEntry', baseUrl),
        type: 'POST',
        xhrFields: { withCredentials: true },
        processData: false,
        contentType: false,
        data: formData,
        success: function (data) {
            if (data.message === "Success") {
                const popup = $('<div class="popup">Sale Order Created Successfully!</div>')
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
                alert(data.message || "Failed to create Sale Order.");
            }
        },
        error: function (xhr, status, error) {
            console.error("Request failed:", error);
            alert("An error occurred. Please try again.");
        }
    });
}

/* ------------------------------ print ------------------------------ */
async function printRecord(sale_order_code) {
    if (!can("Print")) {
        alert(" You do not have permission to print.");
        return;
    }
    try {

        const url = new URL(
            `/jssl/saleOrderEntry/getSaleOrderBasedOnIdNew?sale_order_code=${sale_order_code}`,
            baseUrl
        );

        const response = await fetch(url, { method: "GET", credentials: "include" });

        if (!response.ok) throw new Error("Failed to fetch data");

        const json = await response.json();
        const orderDescriptionLevel = json.orderDescriptionLevel || {};
        const orderlevel = json.orderLevel || {};
        const orderitemlevel = json.orderItemLevel || [];
        const Grand_Total_value = json.Grand_Total_value || "";

        /* ================= BUILD SCRAP ROWS ================= */

        let scrapRows = "";
        let netAmount = 0;
        let sl = 1;

        orderitemlevel.forEach(item => {

            const qty = parseFloat(item.kg || 0);
            const unitPrice = parseFloat(item.unit_price || 0);
            const subTotal = qty * unitPrice;

            netAmount += subTotal;

            scrapRows += `
                 <tr>
                     <td>${sl++}</td>
                     <td>${item.auction_no || "-"}</td>
                     <td>${item.scrap_type || ""}</td>
                     <td>${item.scrapitemname || ""}</td>
                     <td>${item.unit_name || ""}</td>
                     <td style="text-align:right">${qty.toFixed(2)}</td>
                     <td style="text-align:right">${unitPrice.toLocaleString('en-IN', {
                         minimumFractionDigits: 2,
                         maximumFractionDigits: 2
                     })}</td>
                     <td style="text-align:right">${subTotal.toLocaleString('en-IN', {
                         minimumFractionDigits: 2,
                         maximumFractionDigits: 2
                     })}</td>
                 </tr>
             `;
        });

        /* ================= TAX ROWS ================= */

        let taxRows = "";

        const tax1Val = parseFloat(orderlevel[0].tax1_value || 0);
        const tax2Val = parseFloat(orderlevel[0].tax2_value || 0);
        const tax3Val = parseFloat(orderlevel[0].tax3_value || 0);

        const fmt = (n) => n.toLocaleString('en-IN', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });

        if (tax1Val > 0) {
            taxRows += `
                 <tr>
                     <td colspan="7" style="text-align:right">
                        ${orderlevel[0].taxname1} (${orderlevel[0].tax1_per}%)
                     </td>
                     <td style="text-align:right">${fmt(tax1Val)}</td>
                 </tr>`;
        }

        if (tax2Val > 0) {
            taxRows += `
                 <tr>
                     <td colspan="7" style="text-align:right">
                       ${orderlevel[0].taxname2} (${orderlevel[0].tax2_per}%)
                     </td>
                     <td style="text-align:right">${fmt(tax2Val)}</td>
                 </tr>`;
        }

        if (tax3Val > 0) {
            taxRows += `
                 <tr>
                     <td colspan="7" style="text-align:right">
                        ${orderlevel[0].taxname3} (${orderlevel[0].tax3_per}%)
                     </td>
                     <td style="text-align:right">${fmt(tax3Val)}</td>
                 </tr>`;
        }

        const grandTotal = parseFloat(orderlevel[0].grand_total || 0);

        /* ================= TERMS ================= */

		let termsHtml = "";

		if (Array.isArray(orderDescriptionLevel)) {

		    const uniqueTerms = new Set();

		    orderDescriptionLevel.forEach((item) => {

		        if (item.terms_conditions && item.terms_conditions.trim() !== "") {

		            const term = item.terms_conditions.trim();
		            const uniqueKey = term.replace(/\s+/g, " ").toLowerCase();

		            if (!uniqueTerms.has(uniqueKey)) {
		                uniqueTerms.add(uniqueKey);
		                termsHtml += `${term}<br>`;
		            }
		        }

		    });
		}

        /* ================= BUSINESS UNIT / FACTORY BLOCK =================
           Bound dynamically from orderlevel[0] (BUSINESS_UNITS join in the
           query) - NOT hardcoded per business unit id, and NOT read from
           sessionStorage. Whatever business unit is attached to this sale
           order is what gets printed.
        */

        const bu = orderlevel[0] || {};

        // Strip any leading "JBU-<number>" style prefix (e.g. "JBU-4 ") from the business unit name
        const cleanBusinessUnitName = (bu.business_unit_name || "JSW Severfield Structures Ltd")
            .replace(/^JBU-?\s*\d+\s*/i, "")
            .trim();

        const factoryAddressLines = [
            cleanBusinessUnitName,
            bu.location || "",
            bu.state_id ? `State Code: ${bu.state_id}` : "",
            bu.country ? `Country: ${bu.country}` : "",
            bu.gst_number ? `GSTIN : ${bu.gst_number}` : "",
            bu.pan_number ? `PAN: ${bu.pan_number}` : ""
        ].filter(line => line !== "");

        const factoryHtml = factoryAddressLines.join("<br>");

        /* ================= HTML CONTENT ================= */
        const isCancelled = orderlevel[0].cancel == "true";
        const pdfContainer = document.createElement("div");
        pdfContainer.style.width = "210mm";

        pdfContainer.innerHTML = `
		 ${isCancelled ? `
		 <div style="
		     position:absolute;
		     top:50%;
		     left:50%;
		     transform:translate(-50%, -50%) rotate(-45deg);
		     font-size:100px;
		     font-weight:bold;
		     color:red;
		     opacity:0.15;
		     z-index:9999;
		     pointer-events:none;
		     white-space:nowrap;
		 ">
		     CANCELLED
		 </div>
		 ` : ''}
		 <div style="width:190mm; margin:8mm auto; font-family:Arial; font-size:11px; border:1px solid #000;">

		     <!-- HEADER -->
		     <div style="text-align:center; font-weight:bold; font-size:16px; margin-bottom:6px;">
		         SCRAP SALE ORDER
		     </div>

		     <div style="display:flex; border:1px solid #000; margin-bottom:6px;">
		         <div style="width:50%; padding:6px; border-right:1px solid #000;">
		             <img src="img/logo/download.png" style="height:45px;"><br>
		             ${factoryHtml}
		         </div>
		         <div style="width:50%; padding:6px;">
		             <b>Sale Order No:</b> ${orderlevel[0].sale_order_code || ""}<br>
		             <b>Auction Date:</b> ${formatDateDDMMYY(orderlevel[0].auction_date || "")}<br>
		             <b>Order Date:</b> ${formatDateDDMMYY(orderlevel[0].saleorderdate || "")}<br>
		             <b>Validity:</b> ${formatDateDDMMYY(orderlevel[0].sale_order_duration || "")}<br>
		             <b>Location:</b> ${orderlevel[0].location_name || ""}
		         </div>
		     </div>

		     <!-- BUYER BLOCK -->
		     <div style="border:1px solid #000; padding:6px; margin-bottom:6px;">
		         <b>Sale Order To:</b><br>
		         ${orderlevel[0].address || ""}
		     </div>

		     <!-- ITEM TABLE -->
		     <table style="width:100%; border-collapse:collapse;" border="1" cellpadding="4">
		         <thead style="background:#e6f0ff; font-weight:bold;">
		             <tr>
		                 <th>Sl</th>
		                 <th>E-Auction No</th>
		                 <th>Scrap Type</th>
		                 <th>Scrap Name</th>
		                 <th>UOM</th>
		                 <th style="text-align:right;">Kgs</th>
		                 <th style="text-align:right;">Unit Price</th>
		                 <th style="text-align:right;">Sub Total</th>
		             </tr>
		         </thead>
		         <tbody>
		             ${scrapRows}
		             <tr>
		                 <td colspan="7" style="text-align:right;"><b>Net Amount</b></td>
		                 <td style="text-align:right;"><b>${fmt(netAmount)}</b></td>
		             </tr>
		             ${taxRows}
		             <tr>
		                 <td colspan="7" style="text-align:right; font-size:13px;"><b>Grand Total</b></td>
		                 <td style="text-align:right; font-size:13px;"><b>${fmt(grandTotal)}</b></td>
		             </tr>
		         </tbody>
		     </table>

		     <!-- AMOUNT IN WORDS -->
		     <div style="margin-top:6px; border:1px solid #000; padding:5px;">
		         <b>Amount in Words:</b> ${Grand_Total_value}
		     </div>

		     <!-- TERMS -->
		     <div style="margin-top:6px; border:1px solid #000; padding:5px;">
		         <b>Terms & Conditions</b><br>
		         ${termsHtml}
		     </div>

		     <!-- FOOTER -->
		     <div style="margin-top:10px; padding:5px; text-align:right;">
		         For ${cleanBusinessUnitName}<br><br>
		         Authorized Signatory
		     </div>

		 </div>
		 `;

        document.body.appendChild(pdfContainer);

        const opt = {
            margin: 0,
            filename: `Sale_Order_${sale_order_code}.pdf`,
            image: { type: 'jpeg', quality: 1 },
            html2canvas: {
                scale: 2,
                useCORS: true,
                scrollY: 0
            },
            jsPDF: {
                unit: 'mm',
                format: 'a4',
                orientation: 'portrait'
            },
            pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
        };

        html2pdf()
            .set(opt)
            .from(pdfContainer)
            .save()
            .then(() => {
                document.body.removeChild(pdfContainer);
            });

    } catch (error) {
        console.error("PDF Error:", error);
        alert("Error generating PDF");
    }
}

function formatDateDDMMYY(dateString) {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date)) return "";

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2);

    return `${day}-${month}-${year}`;
}

/* ------------------------------ cancel ------------------------------ */
function openModalcancel(id) {
    if (!can("Cancel")) {
        alert(" You do not have permission to Cancel.");
        $('#exampleModalCenter16').modal('hide');
        return;
    }
    $('#exampleModalCenter16').modal('show');
    $('#exampleModalCenter16').attr('data-id', id);
}

function cancelRecord() {

    $('#exampleModalCenter16').modal('hide');

    var id = $('#exampleModalCenter16').attr('data-id');

    $.ajax({
        url: new URL('/jssl/saleorder/cancel', baseUrl),
        type: 'POST',
        dataType: 'json',
        xhrFields: { withCredentials: true },
        data: {
            id: id,
            cancelled_by: createdById
        },
        success: function (data) {

            if (data.message === "Success") {

                const popup = $('<div class="popup">Sale Order Cancelled Successfully!</div>')
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
                // e.g. "Can't cancel Sale Order. Transaction already done."
                alert(data.message);
            }
        }
    });
}
