/* ================================================================
   subconassign.js  –  Full updated version (RGP-style Select2)
================================================================ */

const MainPage = 'subconassign.jsp';
const UserId   = sessionStorage.getItem('username');

let allowedActions = [];
let supplierMap = {};

/* ─────────────────────────────────────────
   Select2 helper — same convention as rgprequest.js
───────────────────────────────────────── */
function initSelect2(selector, modalId, placeholder) {
    const $el = $(selector);
    if ($el.hasClass("select2-hidden-accessible")) {
        $el.select2('destroy');   // safe re-init since our loaders repopulate <select> via innerHTML
    }
    $el.select2({
        theme          : "bootstrap4",
        width          : "100%",
        dropdownParent : $(modalId),
        placeholder    : placeholder || "Select",
        allowClear     : true
    });
}

/* ─────────────────────────────────────────
   Load page-level action permissions
───────────────────────────────────────── */
async function loadActions() {
    try {
        const response = await fetch(
            `${baseUrl}/api/page/actions?userId=${encodeURIComponent(UserId)}&pageName=${encodeURIComponent(MainPage)}`,
            {
                method: "GET",
                credentials: "include",
                headers: { "Content-Type": "application/json" }
            }
        );
        if (!response.ok) throw new Error("Failed to fetch actions");
        allowedActions = await response.json();
    } catch (error) {
        console.error("loadActions error:", error);
    }
}

/* ─────────────────────────────────────────
   Popup notification
───────────────────────────────────────── */
window.showPopup1 = function (message, redirectUrl) {
    const popup = document.createElement("div");
    popup.className = "popup";
    popup.textContent = message;
    document.body.appendChild(popup);
    popup.style.display = "none";
    $(popup).fadeIn(400);
    setTimeout(function () {
        $(popup).fadeOut(400, function () {
            popup.remove();
            if (redirectUrl) window.location = redirectUrl;
        });
    }, 2000);
};

/* ─────────────────────────────────────────
   Helper: check permission
───────────────────────────────────────── */
function hasPermission(action) {
    const allowed = Array.isArray(allowedActions) ? allowedActions : [];
    return allowed.includes(action);
}

/* ================================================================
   DOM READY
================================================================ */
document.addEventListener("DOMContentLoaded", async function () {

    await loadActions();

    /* ── Load dropdowns ── */
    loadSubConUsers();
    loadG2Users();
    loadEmployeesCodeG2();
    loadSuppliers();
    loadFactories();
    loadLocations();
    loadDepartment();

    /* ── Load tables ── */
    loadUserSupplierTable();
    loadG2UserTable();

    /* ── Create SubCon button ── */
    document.getElementById("subconassingnmodal").addEventListener("click", function () {
        if (!hasPermission("Insert")) {
            alert("You do not have permission to Insert.");
            return;
        }
        $('#subContractModal').modal('show');
    });

    /* ── Create G2 button ── */
    document.getElementById("g2assingnmodal").addEventListener("click", function () {
        if (!hasPermission("Insert")) {
            alert("You do not have permission to Insert.");
            return;
        }
        $('#g2assignmodal').modal('show');
    });

    document.getElementById("confirmSubConCreateBtn").addEventListener("click", function () {
        $('#confirmSubConCreateModal').modal('hide');
        doAssignSubContract();
    });

    document.getElementById("confirmG2CreateBtn").addEventListener("click", function () {
        $('#confirmG2CreateModal').modal('hide');
        doAssignG2User();
    });

    document.getElementById("confirmG2UpdateBtn").addEventListener("click", function () {
        $('#confirmG2UpdateModal').modal('hide');
        doUpdateAssignG2();
    });

});

/* ================================================================
   DROPDOWN LOADERS
================================================================ */

function loadSubConUsers() {
    fetch(new URL('/api/subcontractor/users', baseUrl1), { credentials: "include" })
        .then(r => r.json())
        .then(data => {
            const sel = document.getElementById('userName');
            sel.innerHTML = '<option value="">Select</option>';
            data.forEach(u => {
                const o = document.createElement('option');
                o.value = u.user_id;
                o.textContent = u.user_name;
                sel.appendChild(o);
            });
            initSelect2("#userName", "#subContractModal", "Select User Name");
        })
        .catch(e => console.error('loadSubConUsers:', e));
}

function loadG2Users() {
    fetch(new URL('/api/subcontractor/G2User', baseUrl1), { method: "GET", credentials: "include" })
        .then(r => r.json())
        .then(data => {
            const sel = document.getElementById("userNameg2");
            sel.innerHTML = '<option value="">Select</option>';
            data.forEach(u => {
                const o = document.createElement("option");
                o.value = u.user_id;
                o.textContent = u.user_name.trim();
                o.setAttribute("data-username", u.user_name.trim());
                sel.appendChild(o);
            });
            initSelect2("#userNameg2", "#g2assignmodal", "Select User Name");
        })
        .catch(e => console.error("loadG2Users:", e));
}

function loadEmployeesCodeG2() {
    $.ajax({
        url: new URL('/api/websmartuser/getAll', baseUrl).toString(),
        type: "GET",
        xhrFields: { withCredentials: true },
        success: function (response) {
            ["#EmpCode", "#EmpCodeUp"].forEach(sel => {
                $(sel).empty().append('<option value="">Select Employee</option>');
                $.each(response.Data, function (index, emp) {
                    $(sel).append(`<option value="${emp.id}">${emp.username}</option>`);
                });
            });
            initSelect2("#EmpCode",   "#g2assignmodal",   "Select Employee");
            initSelect2("#EmpCodeUp", "#g2assignmodalUp", "Select Employee");
        },
        error: function (xhr, status, error) {
            console.error('Error loading employees:', error);
        }
    });
}

function loadSuppliers() {
    fetch(new URL('api/usersupplier/suppliers-distinct', baseUrl1), { credentials: "include" })
        .then(r => r.json())
        .then(data => {
            const sel  = document.getElementById('subContract');
            const selU = document.getElementById('subContractUp');
            sel.innerHTML  = '<option value="">Select</option>';
            selU.innerHTML = '<option value="">Select</option>';
            data.forEach(item => {
                supplierMap[item.supplier_id] = item.name;
                const o1 = document.createElement('option');
                o1.value = item.supplier_id; o1.textContent = item.name;
                const o2 = document.createElement('option');
                o2.value = item.supplier_id; o2.textContent = item.name;
                sel.appendChild(o1);
                selU.appendChild(o2);
            });
            initSelect2("#subContract",   "#subContractModal",   "Select Sub Contract");
            initSelect2("#subContractUp", "#subContractModalUP", "Select Sub Contract");
        })
        .catch(e => console.error('loadSuppliers:', e));
}

function loadFactories() {
    fetch(new URL('/jssl/factory/getAllFactoryList', baseUrl1), { credentials: "include" })
        .then(r => r.json())
        .then(data => {
            const baseOpts = `<option value="">Select</option><option value="all">ALL</option>`;
            ['factory', 'factoryUp', 'factoryg2', 'factoryg2Up'].forEach(id => {
                document.getElementById(id).innerHTML = baseOpts;
            });
            if (Array.isArray(data.FactoryDetails)) {
                data.FactoryDetails.forEach(f => {
                    ['factory', 'factoryUp', 'factoryg2', 'factoryg2Up'].forEach(id => {
                        const o = document.createElement('option');
                        o.value = f.id; o.textContent = f.factory_name;
                        document.getElementById(id).appendChild(o);
                    });
                });
            }
            initSelect2("#factory",     "#subContractModal",   "Select Factory");
            initSelect2("#factoryUp",   "#subContractModalUP", "Select Factory");
            initSelect2("#factoryg2",   "#g2assignmodal",      "Select Factory");
            initSelect2("#factoryg2Up", "#g2assignmodalUp",    "Select Factory");
        })
        .catch(e => console.error('loadFactories:', e));
}

function loadLocations() {
    $.ajax({
        url: new URL('/api/location/getAll', baseUrl).toString(),
        type: "GET",
        xhrFields: { withCredentials: true },
        success: function (response) {
            ["#locationg2", "#locationg2Up"].forEach(sel => {
                $(sel).empty().append('<option value="">Select Location</option>');
                $.each(response.Data, function (i, item) {
                    $(sel).append(`<option value="${item.Loc_id}">${item.Location}</option>`);
                });
            });
            initSelect2("#locationg2",   "#g2assignmodal",   "Select Location");
            initSelect2("#locationg2Up", "#g2assignmodalUp", "Select Location");
        },
        error: function (xhr, status, error) { console.log("loadLocations error:", error); }
    });
}

function loadDepartment() {
    $.ajax({
        url: new URL('/api/departments', baseUrl).toString(),
        type: "GET",
        xhrFields: { withCredentials: true },
        success: function (response) {
            ["#Departmentg2", "#Departmentg2Up"].forEach(sel => {
                $(sel).empty().append('<option value="">Select Department</option>');
                $.each(response, function (i, item) {
                    $(sel).append(`<option value="${item.deptId}">${item.departmentName}</option>`);
                });
            });
            initSelect2("#Departmentg2",   "#g2assignmodal",   "Select Department");
            initSelect2("#Departmentg2Up", "#g2assignmodalUp", "Select Department");
        },
        error: function (xhr, status, error) { console.log("loadDepartment error:", error); }
    });
}

/* ================================================================
   TABLE LOADERS  (unchanged)
================================================================ */

function loadUserSupplierTable() {
    const url = new URL('/api/usersupplier/all-users-distinct', baseUrl);
    fetch(url, { credentials: "include" })
        .then(r => r.json())
        .then(data => {
            if (!Array.isArray(data)) { console.error("Invalid response"); return; }

            let rows = '';
            data.forEach(item => {
                const uid      = item.uid      || 'N/A';
                const username = item.user_name ? item.user_name.trim() : 'N/A';
                const factory  = item.factory  ? item.factory : '-';
                rows += `<tr>
                    <td>${username}</td>
                    <td>${getFactoryName(factory)}</td>
                    <td>
                        <i class="fa fa-pen text-primary mr-2" style="cursor:pointer;"
                           onclick="editUser(${uid})"></i>
                    </td>
                </tr>`;
            });

            if ($.fn.DataTable.isDataTable('#tableID')) {
                $('#tableID').DataTable().clear().destroy();
            }
            document.querySelector("#tableID tbody").innerHTML = rows;
            $('#tableID').DataTable({
                dom: 'Bfrtip', scrollX: true, info: true, paging: true,
                buttons: [{ extend: 'excel', text: 'Export to Excel', title: 'User Supplier List' }]
            });
        })
        .catch(e => console.error("loadUserSupplierTable:", e));
}

function loadG2UserTable() {
    const url = new URL('/api/usersupplier/getG2UserMappings', baseUrl1);
    fetch(url, { credentials: "include" })
        .then(r => r.json())
        .then(data => {
            if (!Array.isArray(data)) { console.error("Invalid response"); return; }

            let rows = '';
            data.forEach(item => {
                const userId   = item.User_Id  || 'N/A';
                const username = item.UserName  ? item.UserName.trim() : 'N/A';
                const factory  = item.FactoryId ? item.FactoryId : '-';
                const location = item.Location  ? item.Location  : '-';
                rows += `<tr>
                    <td>${username}</td>
                    <td>${getLocationName(location)}</td>
                    <td>${getFactoryName(factory)}</td>
                    <td>
                        <i class="fa fa-pen text-primary mr-2" style="cursor:pointer;"
                           onclick="editG2User('${userId}')"></i>
                    </td>
                </tr>`;
            });

            if ($.fn.DataTable.isDataTable('#tableID1')) {
                $('#tableID1').DataTable().clear().destroy();
            }
            document.querySelector("#tableID1 tbody").innerHTML = rows;
            $('#tableID1').DataTable({
                dom: 'Bfrtip', scrollX: true, info: true, paging: true,
                buttons: [{ extend: 'excel', text: 'Export to Excel', title: 'G2 User Mapping' }]
            });
        })
        .catch(e => console.error("loadG2UserTable:", e));
}

/* ================================================================
   SUBCON ASSIGN – CREATE
================================================================ */
function assignSubContract() {
    let isValid = true;

    const uid = document.getElementById("userName").value;
    const supid = document.getElementById("subContract").value;
    const factory = document.getElementById("factory").value;

    hideError("userName");
    hideError("subContract");
    hideError("factory");

    if (!uid) { showError("userName", "Please select User Name"); isValid = false; }
    if (!supid) { showError("subContract", "Please select Sub Contract"); isValid = false; }
    if (!factory) { showError("factory", "Please select Factory"); isValid = false; }

    if (!isValid) return;

    $('#confirmSubConCreateModal').modal('show');
}

function doAssignSubContract() {
    const uid     = document.getElementById("userName").value;
    const supid   = document.getElementById("subContract").value;
    const euid    = createdById;
    const factory = document.getElementById('factory').value;

    const data = { uid, supid, euid };

    const url = new URL('/api/usersupplier/assign', baseUrl1);
    url.searchParams.append("factory", factory);

    fetch(url, {
        method: "POST",
        credentials: 'include',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (response.ok) {
            $('#subContractModal').modal('hide');
            showPopup1("Data submitted successfully!", "subconassign.jsp");
        } else {
            return response.text().then(msg => { alert('Error: ' + msg); });
        }
    })
    .catch(err => {
        console.error("doAssignSubContract:", err);
        alert("Error submitting data. Please check console.");
    });
}

/* ================================================================
   SUBCON ASSIGN – EDIT / UPDATE
================================================================ */
let uidss   = null;
let factory = null;

function editUser(uid) {
    if (!hasPermission("Edit")) {
        alert("You do not have permission to Edit.");
        return;
    }

    uidss = uid;
    $("#subContractModalUP").modal("show");

    fetch(new URL(`/api/usersupplier/user-by-id?uid=${uid}`, baseUrl), {
        method: "GET",
        credentials: "include"
    })
    .then(r => r.json())
    .then(data => {
        if (!data) return;

        document.getElementById("userNameUp").value = data.user_name ? data.user_name.trim() : "";

        const sel = document.getElementById("subContractUp");
        sel.innerHTML = "";
        const o = document.createElement("option");
        o.value       = data.supid;
        o.textContent = supplierMap[data.supid] || data.supid;
        o.selected    = true;
        sel.appendChild(o);
        sel.disabled = true;
        // refresh select2 display since options were replaced
        if ($(sel).hasClass("select2-hidden-accessible")) {
            $(sel).trigger("change.select2");
        }

        document.getElementById("factoryUp").value = data.factory || "";
        $("#factoryUp").trigger("change.select2");
        factory = data.factory || "";
    })
    .catch(e => console.error("editUser:", e));
}

function UpdateFactory() {
    const factup = document.getElementById("factoryUp").value;
    hideError("factoryUp");

    if (!factup) {
        showError("factoryUp", "Please select Factory");
        return;
    }
    $("#exampleModalCenterupdate").modal("show");
}

function confirmUpdate() {
    $("#exampleModalCenterupdate").modal("hide");

    const factoryUp = document.getElementById("factoryUp").value;

    if (factory === factoryUp) {
        showPopup1("No Fields Changed", "subconassign.jsp");
        return;
    }

    const url = new URL('/api/usersupplier/update-factory', baseUrl1);
    url.searchParams.append("uid", uidss);
    url.searchParams.append("factory", factoryUp);

    fetch(url, { method: "POST", credentials: "include" })
        .then(r => r.json())
        .then(data => {
            if (data.status === "SUCCESS") {
                $('#subContractModalUP').modal('hide');
                showPopup1("Updated Successfully", "subconassign.jsp");
            } else {
                alert("Update Failed");
            }
        })
        .catch(e => {
            console.error("confirmUpdate:", e);
            alert("Error updating data");
        });
}

/* ================================================================
   G2 USER ASSIGN – CREATE
================================================================ */
function assigng2User() {
    let isValid = true;

    const userId = document.getElementById("userNameg2").value;
    const department = document.getElementById("Departmentg2").value;
    const location = document.getElementById("locationg2").value;
    const factory = document.getElementById("factoryg2").value;
    let EmployeeCode = document.getElementById("EmpCode").value;

    hideError("userNameg2");
    hideError("Departmentg2");
    hideError("locationg2");
    hideError("factoryg2");
    hideError("EmpCode");

    if (!userId) { showError("userNameg2", "Please select User Name"); isValid = false; }
    if (!department) { showError("Departmentg2", "Please select Department"); isValid = false; }
    if (!location) { showError("locationg2", "Please select Location"); isValid = false; }
    if (!factory) { showError("factoryg2", "Please select Factory"); isValid = false; }
    if (!EmployeeCode) { showError("EmpCode", "Please select the EmployeeCode"); isValid = false; }

    if (!isValid) return;

    $('#confirmG2CreateModal').modal('show');
}

function doAssignG2User() {
    const dropdown      = document.getElementById("userNameg2");
    const selectedOption = dropdown.options[dropdown.selectedIndex];
    const userId        = dropdown.value;
    const userName      = selectedOption.getAttribute("data-username");
    const factory       = document.getElementById("factoryg2").value;
    const location      = document.getElementById("locationg2").value;
    const department    = document.getElementById("Departmentg2").value;
    const EmployeeCode  = document.getElementById("EmpCode").value;

    const requestData = {
        user_id:    userId,
        username:   userName,
        factory:    factory,
        location:   location,
        created_by: createdById,
        department: department,
        EmployeeCode: EmployeeCode
    };

    fetch(new URL('/api/usersupplier/assignG2User', baseUrl1), {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData)
    })
    .then(r => {
        if (r.ok) return r.text();
        return r.text().then(err => { throw new Error(err); });
    })
    .then(() => {
        $("#g2assignmodal").modal("hide");
        showPopup1("G2 User Assigned Successfully", "subconassign.jsp");
    })
    .catch(e => {
        console.error("doAssignG2User:", e);
        alert(e.message || "Error while assigning G2 User");
    });
}

/* ================================================================
   G2 USER ASSIGN – EDIT / UPDATE
================================================================ */
let g2UserId        = null;
let oldG2Factory    = null;
let oldG2Location   = null;
let oldG2Department = null;
let oldEmpcode      = null;

function editG2User(user_id) {
    if (!hasPermission("Edit")) {
        alert("You do not have permission to Edit.");
        return;
    }

    g2UserId = user_id;
    $("#g2assignmodalUp").modal("show");

    fetch(new URL(`/api/usersupplier/getG2UserById?user_id=${user_id}`, baseUrl1), {
        method: "GET",
        credentials: "include"
    })
    .then(r => r.json())
    .then(data => {
        document.getElementById("userNameg2Up").value =
            data.UserName ? data.UserName.trim() : "";

        document.getElementById("factoryg2Up").value =
            data.FactoryId ? data.FactoryId : "";
        $("#factoryg2Up").trigger("change.select2");

        document.getElementById("locationg2Up").value =
            data.Location ? data.Location : "";
        $("#locationg2Up").trigger("change.select2");

        document.getElementById("Departmentg2Up").value =
            data.Department_Id ? data.Department_Id : '';
        $("#Departmentg2Up").trigger("change.select2");

        document.getElementById("EmpCodeUp").value =
            data.emp_id ? data.emp_id : '';
        $("#EmpCodeUp").trigger("change.select2");

        oldG2Factory    = data.FactoryId ? data.FactoryId : "";
        oldG2Location   = data.Location ? data.Location : "";
        oldG2Department = data.Department_Id ? data.Department_Id : "";
        oldEmpcode      = data.emp_id ? data.emp_id : '';
    })
    .catch(e => {
        console.error("editG2User:", e);
        alert("Error loading G2 User");
    });
}

function triggerUpdateG2() {
    const department = document.getElementById("Departmentg2Up").value;
    const location = document.getElementById("locationg2Up").value;
    const factory_id = document.getElementById("factoryg2Up").value;
    const EmployeeCode = document.getElementById("EmpCodeUp").value;

    let isValid = true;

    hideError("Departmentg2Up");
    hideError("locationg2Up");
    hideError("factoryg2Up");
    hideError("EmpCodeUp");

    if (!department) { showError("Departmentg2Up", "Please select Department"); isValid = false; }
    if (!location) { showError("locationg2Up", "Please select Location"); isValid = false; }
    if (!factory_id) { showError("factoryg2Up", "Please select Factory"); isValid = false; }
    if (!EmployeeCode) { showError("EmpCodeUp", "Please select Employed Code"); isValid = false; }

    if (!isValid) return;

    $('#confirmG2UpdateModal').modal('show');
}

function doUpdateAssignG2() {
    const factory_id = document.getElementById("factoryg2Up").value;
    const location = document.getElementById("locationg2Up").value;
    const department = document.getElementById("Departmentg2Up").value;
    const Employeecode = document.getElementById("EmpCodeUp").value;

    if (
        factory_id == oldG2Factory &&
        location == oldG2Location &&
        department == oldG2Department &&
        Employeecode == oldEmpcode
    ) {
        $("#g2assignmodalUp").modal("hide");
        showPopup1("No Fields Changed", "subconassign.jsp");
        return;
    }

    const url = new URL('/api/usersupplier/updateG2Factory', baseUrl1);
    url.searchParams.append("user_id", g2UserId);
    url.searchParams.append("factory_id", factory_id);
    url.searchParams.append("Location", location);
    url.searchParams.append("department", department);
    url.searchParams.append("modified_by", createdById);
    url.searchParams.append("Empcode", Employeecode);

    fetch(url, { method: "POST", credentials: "include" })
        .then(r => r.json())
        .then(data => {
            if (data.status === "SUCCESS") {
                $("#g2assignmodalUp").modal("hide");
                showPopup1("G2 User Updated Successfully", "subconassign.jsp");
            } else {
                alert(data.message);
            }
        })
        .catch(e => {
            console.error("doUpdateAssignG2:", e);
            alert("Error updating G2 User");
        });
}

/* ================================================================
   UTILITY HELPERS
================================================================ */
function getFactoryName(val) {
    if (val === "1")   return "Bellary";
    if (val === "2")   return "Gujarat";
    if (val === "all") return "Bellary / Gujarat";
    return "-";
}

function getLocationName(val) {
    if (val === "2") return "Mumbai";
    if (val === "3") return "Bellary";
    if (val === "4") return "Project Site";
    if (val === "5") return "Bellary Contractors";
    return "-";
}

function showError(id, message) {
    const errorDiv = document.getElementById(id + "Error");
    const field = document.getElementById(id);
    if (errorDiv) { errorDiv.textContent = message; errorDiv.style.display = "block"; }
    if (field) { field.classList.add("error-border"); }
}

function hideError(id) {
    const errorDiv = document.getElementById(id + "Error");
    const field = document.getElementById(id);
    if (errorDiv) { errorDiv.style.display = "none"; }
    if (field) { field.classList.remove("error-border"); }
}