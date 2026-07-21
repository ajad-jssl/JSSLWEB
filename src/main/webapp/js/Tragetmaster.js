const userId = sessionStorage.getItem("user_id");

$(document).ready(function () {

    loadContracts();
    fetchTargetMaster();
	loadFinancialYears();
});

/* ==============================
   Load Contract Dropdown
============================== */

async function loadContracts() {

    try {
		const factoryId = localStorage.getItem("selectedFactoryId");
		const url = new URL("/jssl/contractfrom/g2/listcontractorsbasedonfactory", baseUrl);
		   url.searchParams.set("factoryId", factoryId);

        const response = await fetch(url, {
            method: "GET",
            credentials: "include"
        });

        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        }

        const json = await response.json();

        $("#contract_id").empty()
            .append('<option value="">Select Contract</option>');

        $("#contract_id_edit").empty()
            .append('<option value="">Select Contract</option>');

            json.Data.forEach(function (contract) {

                $("#contract_id").append(`
                    <option value="${contract.contract_id}">
                        ${contract.contract_name}
                    </option>
                `);

                $("#contract_id_edit").append(`
                    <option value="${contract.contract_id}">
                        ${contract.contract_name}
                    </option>
                `);

            });
    } catch (error) {

        console.error("Contract Load Error:", error);

    }

}
/* ==============================
   Fetch List
============================== */

function fetchTargetMaster() {

    $.ajax({

        url: new URL(
            "/jssl/master/listtargetmaster",
            baseUrl
        ).toString(),

        type: "GET",
        xhrFields: { withCredentials: true },

        success: function (response) {

            let data = response.data || [];

            if ($.fn.DataTable.isDataTable('#tableID')) {
                $('#tableID').DataTable().destroy();
            }

            $('#tableID').DataTable({

                destroy: true,

                data: data,

                dom: 'Bfrtip',

                buttons: [
                    'excelHtml5',
                ],

				columns: [

				    {
				        title: "Sl No",
				        data: null,
				        render: function (data, type, row, meta) {
				            return meta.row + 1;
				        }
				    },

				    {
				        title: "Financial Year",
				        data: "financialYear"
				    },

				    {
				        title: "Target Type",
				        data: "targetType"
				    },

				    {
				        title: "Contract",
				        data: "jobCode",
				        defaultContent: "-"
				    },

				    {
				        title: "Manhours",
				        data: "targetManhours"
				    },

				    {
				        title: "Created Date",
				        data: "createdDate",
				        render: function (data) {

				            if (!data) return "";

				            return data.split("T")[0];

				        }
				    },

				    {
				        title: "Action",
				        data: null,
				        orderable: false,

				        render: function (data) {

				            return `
				                <i class="fa fa-pen text-primary"
				                   style="cursor:pointer"
				                   onclick="editRecord('${data.targetId}')">
				                </i>
				            `;
				        }
				    }

				]
            });

        },

        error: function (err) {
            console.error("Fetch Target Master Error", err);
        }

    });

}

/* ==============================
   Add Record
============================== */

function openModalAdd() {
    $("#exampleModalCenter66").modal("show");
}

function addevent() {

    let month_no = [];
    let prod_ih = [];
    let prod_sc = [];
    let disp_ih = [];
    let disp_sc = [];
    let erec_ih = [];
    let erec_sc = [];

    const months = [
        "apr","may","jun","jul","aug","sep",
        "oct","nov","dec","jan","feb","mar"
    ];

    months.forEach((m,index)=>{

        month_no.push(index + 1);

        prod_ih.push($("#" + m + "_prod_ih").val() || 0);
        prod_sc.push($("#" + m + "_prod_sc").val() || 0);

        disp_ih.push($("#" + m + "_disp_ih").val() || 0);
        disp_sc.push($("#" + m + "_disp_sc").val() || 0);

        erec_ih.push($("#" + m + "_erec_ih").val() || 0);
        erec_sc.push($("#" + m + "_erec_sc").val() || 0);
    });

    $.ajax({

        url: new URL(
            "/jssl/master/addtargetmaster",
            baseUrl
        ).toString(),

        type: "POST",

        xhrFields: { withCredentials: true },

        traditional: true,

        data: {

            financial_year:
                $("#financial_year").val(),

            target_type:
                $("#target_type").val(),

            contract_id:
                $("#target_type").val() === "CONTRACT"
                ? $("#contract_id").val()
                : null,

            target_production_ih:
                $("#target_prod_ih").val(),

            target_production_sc:
                $("#target_prod_sc").val(),

            target_dispatch_ih:
                $("#target_disp_ih").val(),

            target_dispatch_sc:
                $("#target_disp_sc").val(),

            target_erection_ih:
                $("#target_erec_ih").val(),

            target_erection_sc:
                $("#target_erec_sc").val(),

            target_manhours:
                $("#target_manhours").val(),

        	created_by:createdById,

            month_no: month_no,

            prod_ih: prod_ih,
            prod_sc: prod_sc,

            disp_ih: disp_ih,
            disp_sc: disp_sc,

            erec_ih: erec_ih,
            erec_sc: erec_sc
        },

        success: function(response) {

            if(response.status){

                $("#exampleModalScrollable").modal("hide");

                fetchTargetMaster();

            } else {

                $("#errorMessage").html(response.message);
                $("#exampleModalCenterDup").modal("show");
            }
        },

        error: function(err) {

            console.error(
                "Add Target Master Error",
                err
            );
        }
    });
}

/* ==============================
   Edit Record
============================== */

function editRecord(id) {

    $.ajax({

        url: new URL(
            `/jssl/master/searchtargetmaster?targetId=${id}`,
            baseUrl
        ).toString(),

        type: "GET",

        xhrFields: { withCredentials: true },

        success: function (response) {

            if (response.status) {
			
                let master = response.targetMaster;
          /*      let monthly = response.monthly || [];*/

                // Master Details

                $("#target_id").val(master.targetId);

                $("#financial_year_edit")
                    .val(master.financialYear);

                $("#target_type_edit")
                    .val(master.targetType);

                $("#contract_id_edit")
                    .val(master.contractId);

                if (master.targetType === "TOTAL") {

                    $("#contractDivEdit").hide();

                } else {

                    $("#contractDivEdit").show();
                }

                $("#target_prod_ih_edit")
                    .val(master.targetProductionIh);

                $("#target_prod_sc_edit")
                    .val(master.targetProductionSc);

                $("#target_disp_ih_edit")
                    .val(master.targetDispatchIh);

                $("#target_disp_sc_edit")
                    .val(master.targetDispatchSc);

                $("#target_erec_ih_edit")
                    .val(master.targetErectionIh);

                $("#target_erec_sc_edit")
                    .val(master.targetErectionSc);

                $("#target_manhours_edit")
                    .val(master.targetManhours);

                // Annual Totals
				calculateAnnualTotalsEdit();
			
                $("#target_prod_total_edit").val(
                    (parseFloat(master.targetProductionIh) || 0) +
                    (parseFloat(master.targetProductionSc) || 0)
                );

                $("#target_disp_total_edit").val(
                    (parseFloat(master.targetDispatchIh) || 0) +
                    (parseFloat(master.targetDispatchSc) || 0)
                );

                $("#target_erec_total_edit").val(
                    (parseFloat(master.targetErectionIh) || 0) +
                    (parseFloat(master.targetErectionSc) || 0)
                );

                // Monthly Details

                const monthMap = {
                    1: "apr",
                    2: "may",
                    3: "jun",
                    4: "jul",
                    5: "aug",
                    6: "sep",
                    7: "oct",
                    8: "nov",
                    9: "dec",
                    10: "jan",
                    11: "feb",
                    12: "mar"
                };

				response.monthlyDetails.forEach(function(m){


                    let prefix = monthMap[m.monthNo];

                    if (!prefix) return;

                    $("#" + prefix + "_prod_ih_edit")
                        .val(m.prodIh);

                    $("#" + prefix + "_prod_sc_edit")
                        .val(m.prodSc);

                    $("#" + prefix + "_disp_ih_edit")
                        .val(m.dispIh);

                    $("#" + prefix + "_disp_sc_edit")
                        .val(m.dispSc);

                    $("#" + prefix + "_erec_ih_edit")
                        .val(m.erecIh);

                    $("#" + prefix + "_erec_sc_edit")
                        .val(m.erecSc);
                });

                $("#exampleModalScrollableedit")
                    .modal("show");
            }
        },

        error: function (err) {

            console.error(
                "Search Target Master Error",
                err
            );
        }

    });

}

/* ==============================
   Update Record
============================== */

function editevent() {

    $.ajax({

        url: new URL(
            "/jssl/master/updatetargetmaster",
            baseUrl
        ).toString(),

        type: "POST",

        xhrFields: { withCredentials: true },

        data: {

            target_id:
                $("#target_id").val(),

            contract_id:
                $("#contract_id_edit").val(),

            target_production:
                $("#target_production_edit").val(),

            target_dispatch:
                $("#target_dispatch_edit").val(),

            target_erection:
                $("#target_erection_edit").val(),

            modified_by:
                userId
        },

        success: function (response) {

            if (response.message === "Success") {

                $("#exampleModalScrollableedit").modal("hide");
                $("#exampleModalCenterupdate").modal("hide");

                fetchTargetMaster();

            } else {

                $("#exampleModalCenterupdate").modal("hide");

                $("#errorMessageup").html(response.message);

                $("#exampleModalCenterDupUP").modal("show");

            }

        },

        error: function (err) {
            console.error("Update Target Master Error", err);
        }

    });

}

function loadFinancialYears() {
    const currentYear = new Date().getFullYear();

    let html = '<option value="">Select Financial Year</option>';

    for (let i = currentYear - 2; i <= currentYear + 5; i++) {
        html += `<option value="${i}-${i + 1}">
                    ${i}-${i + 1}
                 </option>`;
    }

    $("#financial_year").html(html);
}


$("#target_type").change(function () {

    if ($(this).val() === "TOTAL") {
        $("#contractDiv").hide();
        $("#contract_id").val("");
    } else {
        $("#contractDiv").show();
    }

});
$("#target_prod_ih,#target_prod_sc").on(
    "input",
    calculateAnnualTotals
);

$("#target_disp_ih,#target_disp_sc").on(
    "input",
    calculateAnnualTotals
);

$("#target_erec_ih,#target_erec_sc").on(
    "input",
    calculateAnnualTotals
);

function calculateAnnualTotals() {

    const prodIH =
        parseFloat($("#target_prod_ih").val()) || 0;

    const prodSC =
        parseFloat($("#target_prod_sc").val()) || 0;

    $("#target_prod_total")
        .val(prodIH + prodSC);

    const dispIH =
        parseFloat($("#target_disp_ih").val()) || 0;

    const dispSC =
        parseFloat($("#target_disp_sc").val()) || 0;

    $("#target_disp_total")
        .val(dispIH + dispSC);

    const erecIH =
        parseFloat($("#target_erec_ih").val()) || 0;

    const erecSC =
        parseFloat($("#target_erec_sc").val()) || 0;

    $("#target_erec_total")
        .val(erecIH + erecSC);
}


function calculateAnnualTotalsEdit() {

    const prodIH =
        parseFloat($("#target_prod_ih_edit").val()) || 0;

    const prodSC =
        parseFloat($("#target_prod_sc_edit").val()) || 0;

    $("#target_prod_total_edit")
        .val(prodIH + prodSC);

    const dispIH =
        parseFloat($("#target_disp_ih_edit").val()) || 0;

    const dispSC =
        parseFloat($("#target_disp_sc_edit").val()) || 0;

    $("#target_disp_total_edit")
        .val(dispIH + dispSC);

    const erecIH =
        parseFloat($("#target_erec_ih_edit").val()) || 0;

    const erecSC =
        parseFloat($("#target_erec_sc_edit").val()) || 0;

    $("#target_erec_total_edit")
        .val(erecIH + erecSC);
}

$("#target_type_edit").change(function () {

    if ($(this).val() === "TOTAL") {

        $("#contractDivEdit").hide();
        $("#contract_id_edit").val("");

    } else {

        $("#contractDivEdit").show();
    }

});
