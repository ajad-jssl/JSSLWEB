const currentPage = window.location.pathname.split("/").pop()+'.jsp';

const UserId = sessionStorage.getItem("username");

let allowedActions = [];


async function loadActions() {

    try {

        const response = await fetch(
            `${baseUrl}/api/page/actions?userId=${encodeURIComponent(UserId)}&pageName=${encodeURIComponent(currentPage)}`,
            {
                method: "GET",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );

        if (!response.ok) {
            throw new Error("Failed to fetch actions");
        }

        allowedActions = await response.json();

        console.log("Allowed Actions:", allowedActions);

    } catch (error) {

        console.error("Permission Load Error:", error);

    }
}

$(document).ready(function() {
	loadActions();
	fetchAndDisplayadminGP();

	loadCompanyDropdown();
	loadMedicalDropdown();
	loadBusDropdown();

	handleContractAdminSubmission();
	handleAdminUpdateSubmission()

});
const selectedFactoryId = sessionStorage.getItem('selectedFactoryId');

let currentFactoryIdAdminGP = null;


function fetchAndDisplayadminGP() {

    currentFactoryIdAdminGP = parseInt(sessionStorage.getItem("selectedFactoryId"), 10);

    if (!currentFactoryIdAdminGP || isNaN(currentFactoryIdAdminGP)) {
        console.warn("No valid factory ID in sessionStorage");
        return;
    }

    //  Destroy existing DataTable
    if ($.fn.DataTable.isDataTable('#adminTable1')) {
        $('#adminTable1').DataTable().clear().destroy();
    }

    $('#adminTable1').DataTable({
        processing: true,
        serverSide: true,
        scrollX: true,
        searching: true,
        dom: 'Bfrtip',
        pageLength: 10,
        buttons: [
            {
                text: 'Export to Excel',
                action: function () {

                    const url = new URL(`/api/contractgatepass/adminlist`, baseUrl1);
                    url.searchParams.append('factory_id', currentFactoryIdAdminGP);
                    url.searchParams.append('page', 0);
                    url.searchParams.append('size', 99999);

                    fetch(url, { credentials: "include" })
                        .then(response => response.json())
                        .then(json => {

                     
							
							const exportData = json.data.map(item => [
							    item.pass_id || '',
							    item.old_pass_id ? item.old_pass_id.trim() : '',
							    item.aadhar_no ? item.aadhar_no.trim() : '',
							    item.emp_id || '',
							    ((item.fname || '') + ' ' + (item.lname || '')).trim()
							]);

                            let tempTable = $('<table>').append(
                                $('<thead>').append(
                                
									
									$('<tr>').append(
									    '<th>Pass No</th>',
									    '<th>Old Pass No</th>',
									    '<th>Aadhar No</th>',
									    '<th>Employee Code</th>',
									    '<th>Employee Name</th>'
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
                                    title: 'ContractGP Admin Details'
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
		    { title: "Pass No" },
		    { title: "Old Pass No" },
		    { title: "Aadhar No" },
		    { title: "Employee Code" },
		    { title: "Employee Name" },
		    { title: "Verify", orderable: false },
		    { title: "Edit", orderable: false },
		    { title: "Validity Extended", orderable: false },
		    { title: "Status", orderable: false },
		    { title: "Delete", orderable: false }
		],
        ajax: function (data, callback, settings) {

            const page        = data.start / data.length;
            const size        = data.length;
            const searchValue = data.search.value;

            const url = new URL(`/api/contractgatepass/adminlist`, baseUrl1);
            url.searchParams.append('factory_id', currentFactoryIdAdminGP);
            url.searchParams.append('page',       page);
            url.searchParams.append('size',       size);
            url.searchParams.append('search',     searchValue);

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

                        const isVerified = item.emp_id &&
                                           String(item.emp_id).trim() !== '';
                        const isInactive = item.active == 1;
                        const aadhar     = item.aadhar_no
                                           ? item.aadhar_no.trim() : '';
                        const passId     = item.pass_id || '';
						const oldPassId = item.old_pass_id ? item.old_pass_id.trim() : '';
                        const empName    = ((item.fname || '') + ' ' +
                                           (item.lname  || '')).trim();

                        // ── Verify icon ──────────────────────────────
                        const verifyIcon = (isVerified || isInactive)
                            ? `<i class="fa fa-edit"
                                  title="${isInactive
                                      ? 'Inactive Record'
                                      : 'Already Verified'}"
                                  style="cursor:not-allowed; opacity:0.5;"></i>`
                            : `<i class="fa fa-edit cursor-pointer"
                                  style="color:blue;"
                                  title="Verify"
                                  onclick="verifyContractGP(
                                      ${item.cg_id},'${aadhar}')"></i>`;

                        // ── Edit icon ────────────────────────────────
                        const editIcon = (!isVerified || isInactive)
                            ? `<i class="fa fa-pen text-secondary"
                                  title="${isInactive
                                      ? 'Inactive Record'
                                      : 'Record is not verified'}"
                                  style="cursor:not-allowed; opacity:0.3;"></i>`
                            : `<i class="fa fa-pen cursor-pointer"
                                  style="color:blue;"
                                  title="Edit"
                                  onclick="editadminContractGP(
                                      ${item.cg_id})"></i>`;

                        // ── Status checkbox ───────────────
                        const statusBox =
                            `<input type="checkbox"
                                    class="status-toggle" id="status"
                                    data-id="${item.cg_id}"
                                    ${item.active == 1 ? 'checked' : ''}>`;
									const isExpired = item.is_expired == 1;

									// 🔥 Extend Icon
									const extendIcon = (isExpired && !isInactive)
									    ? `<i class="fa fa-calendar-check cursor-pointer"
									          style="color:blue;"
									          title="Extend Validity"
									          onclick="extendContract(${item.cg_id})"></i>`
									    : `<i class="fa fa-calendar-check"
									          title="${isInactive ? 'Inactive Record' : 'Not Expired'}"
									          style="cursor:not-allowed; opacity:0.5;"></i>`;
											  
											  // 🔥 Delete Icon
											  const deleteIcon = !isInactive
											      ? `<i class="fa fa-trash cursor-pointer"
											            style="color:red;"
											            title="Delete"
											            onclick="deleteContractGP(${item.cg_id})"></i>`
											      : `<i class="fa fa-trash"
											            title="Inactive Record"
											            style="cursor:not-allowed; opacity:0.5;"></i>`;

                  
						
						return [
						    slNo++,            // Sl No
						    passId,            // Pass No
						    oldPassId,         // Old Pass No
						    aadhar,            // Aadhar No
						    item.emp_id || '', // Employee Code
						    empName,           // Employee Name
						    verifyIcon,        // Verify
						    editIcon,          // Edit
						    extendIcon,        // Validity Extended
						    statusBox,         // Status
						    deleteIcon         // Delete
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
                    console.error('Error fetching admin GP data:', error);
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


function extendContract(cg_id) {
	
	
	const allowed = allowedActions || [];

		if (!allowed.includes("Edit")) {
		  alert(" You do not have permission to edit.");
		  return;
		}
	
	
	
	console.log("teh cg_id", cg_id);
	$("#statusValiddateModal").modal("show");

	//  prevent multiple click bindings
	$("#confirmextendvalidity").off("click").on("click", function () {

		let validdate = $("#validDate").val();

		if (!validdate) {
			$("#validDateError").show();
		} else {
			$("#validDateError").hide();

			//  store values temporarily
			window._cg_id = cg_id;
			window._validdate = validdate;

			// close date modal
			$("#statusValiddateModal").modal("hide");

			//  open confirmation modal
			$("#exampleModalvalidateCenterUpdate").modal("show");
		}
	});
}


// 🔥 confirmation YES click (add this once, outside function)
$("#confirmassetentryvalidateyes").off("click").on("click", function () {

	$("#exampleModalvalidateCenterUpdate").modal("hide");

	// call API only after confirmation
	funvalidate(window._cg_id, window._validdate);
});

async function funvalidate(cg_id, validdate) {

  
    const url = `${baseUrl1}/api/contractgatepass/extend-validity/${cg_id}?valid_till=${validdate}`;

    try {
        const response = await fetch(url, {
            method: 'PUT',
            credentials: 'include'
        });

        const result = await response.json();

        if (response.ok) {
        showPopup("Successfully Extends Validity","AdminEntry.jsp");
            
            // 🔄 Optional: refresh table
            $('#adminTable1').DataTable().ajax.reload();

        } else {
            alert(result.message || "Failed to update validity");
        }

    } catch (error) {
        console.error("Error updating validity:", error);
        alert("Error occurred while updating validity");
    }
}
$(".btn-secondary[data-dismiss='modal']").click(function() { $("#exampleModalScrollable12").modal("hide"); });
function verifyContractGP(cg_id, aadharNo) {
	  const allowed =  allowedActions || [];

	if (!allowed.includes("Verify")) {
	  alert(" You do not have permission to Verify.");
	  return;
	}
    console.log("Verify clicked:", cg_id, aadharNo);

    // Store ID if needed
    sessionStorage.setItem("selectedCGID", cg_id);

    // Reset form
    $("#exampleModalScrollable123 form")[0].reset();

    // Hide container initially
    $("#container1").hide();

    // Open modal
    $("#exampleModalScrollable123").modal("show");

    // 👉 DIRECTLY FETCH DATA (no dropdown, no search)
    fetchContractGPDetails(cg_id,aadharNo);
}


let currentCheckbox = null;
let currentId = null;
let previousState = null;
let pendingData = null; //  store data before confirm

$(document).on('change', '.status-toggle', function () {
		  const allowed = allowedActions || [];

	if (!allowed.includes("Status")) {
	  alert(" You do not have permission for Status change.");
	  $(this).prop('checked', false);
	  $('#statusDescModal').modal('hide');
	  return;
	}
    currentCheckbox = $(this);
    currentId = $(this).data('id');

    previousState = currentCheckbox.prop('checked');

    // revert temporarily
    currentCheckbox.prop('checked', !previousState);

    if (previousState === true) {
        // ACTIVE → INACTIVE
        $('#statusDescModal').modal('show');
    } else {
        // INACTIVE → ACTIVE
        $('#statusReenterModal').modal('show');
    }
});
$('#confirmDeactivate').click(function () {

    const desc = $("#statusDesc").val().trim();

    if (!desc) {
        $("#statusDescError").show();
        return;
    }

    //  store data instead of calling API
    pendingData = {
        active: 1,
        status_description: desc
    };

    $('#statusDescModal').modal('hide');
    $('#statusConfirmModal').modal('show');
});
$('#confirmActivate').click(function () {

    const date = $("#reEnterDate").val();
    const desc = $("#reEnterDesc").val().trim();

    let isValid = true;

    if (!date) {
        $("#reEnterDateError").show();
        isValid = false;
    }

    if (!desc) {
        $("#reEnterDescError").show();
        isValid = false;
    }

    if (!isValid) return;

    //  store data
    pendingData = {
        active: 0,
        rejoin_date: date,
        status_description: desc
    };

    $('#statusReenterModal').modal('hide');
    $('#statusConfirmModal').modal('show');
});

$('#btnStatusYes').off('click').on('click', function () {

    if (!pendingData) return;

    updateStatus(pendingData);
});
function updateStatus(data) {

    //  Add these  fields
    data.modified_by = createdById;
    data.modified_date = getIndianDateTimeFormat(new Date());

    console.log("Final Payload:", JSON.stringify(data));

    $.ajax({
        url: `${baseUrl1}/api/contractgatepass/${currentId}`,
        type: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify(data),
        xhrFields: { withCredentials: true },

        success: function () {
            currentCheckbox.prop('checked', data.active === 0);
            $('#statusConfirmModal').modal('hide');

           // alert("Successfully status changed");
		   
		   showPopup("Status Changed Successfully","AdminEntry.jsp");
        },

        error: function () {
            $('#statusConfirmModal').modal('hide');
            currentCheckbox.prop('checked', previousState);
            alert('Failed to update status!');
        }
    });
}
$('#btnStatusNo').click(function () {
    $('#statusConfirmModal').modal('hide');
    currentCheckbox.prop('checked', previousState);
});



function fetchContractGPDetails(selectedCGID,adharNo) {

	var apiUrl = new URL(
		`/api/contractgatepass/jims/getContractGatepassDetails?cg_id=${selectedCGID}&factory_id=${selectedFactoryId}`,
		baseUrl1
	).toString();

	$.ajax({
		url: apiUrl,
		method: "GET",
		xhrFields: { withCredentials: true },

		success: function(data) {

			if (!data || data.length === 0) {
				alert("No data found");
				$("#container1").hide();
				return;
			}
			const maritalMap = {
				"1": "Married",
				"2": "Unmarried"
			};

			const contractGp = data[0];

			// ===== STATUS (New / Rejoinee) =====
			if (contractGp.rejoin_date == null) {
				$("#Joinee").val(1);
				$("#reentry_text").hide();
			} else {
				$("#Joinee").val(2);
				$("#entrydate").val(contractGp.rejoin_date);
				$("#reentry_text").show();
			}

			// ===== Fill Fields =====
			$("#Adaadhar").val(adharNo);
			$("#firstname").val(contractGp.Fname || '');
			$("#lastname").val(contractGp.Lname || '');
			$("#contact").val(contractGp.contactno || '');
			$("#date_birth").val(contractGp.Dob || '');
			$("#gen").val(contractGp.Gender || '');
			$("#age2").val(contractGp.Age || '');
			$("#date_joining").val(contractGp.Doj || '');
			$("#validto").val(contractGp.valid_till || '');
			$("#department2").val(contractGp.deptname || '');
			$("#designation2").val(contractGp.designation || '');
			$("#PANNo").val(contractGp.pan_no || '');
			$("#UANNo").val(contractGp.UAN_no || '');
			$("#PFNo").val(contractGp.PF_no || '');
			$("#ESICNo").val(contractGp.ESIC_no || '');
			$("#nomineename").val(contractGp.Nominee_name || '');
			$("#nominee_date").val(contractGp.NDOB || '');
			$("#nominee_age").val(contractGp.NAge || '');
			$("#n_relationship").val(contractGp.NRelationship || '');
			$("#dependants").val(contractGp.NTotal_depandants || '');
			$("#bankname").val(contractGp.Bank_name || '');
			$("#banka\\/c").val(contractGp.bacc || '');
			$("#branch2").val(contractGp.Branch || '');
			$("#IFSC2").val(contractGp.IFSC || '');
			$("#fathername").val(contractGp.Father_name || '');
			$("#maritalstatus").val(maritalMap[contractGp.Marital_status?.trim()]  || '');
			$("#spousename").val(contractGp.Spouse_name || '');
			$("#econtact").val(contractGp.emergency_contact_name || '');
			$("#rela_tion1").val(contractGp.Relation || '');
			$("#econtactno").val(contractGp.emergency_contact_no || '');
			$("#religion3").val(contractGp.religion || '');
			$("#education3").val(contractGp.education || '');
		
			$("#addpermanent").val(contractGp.Permnt_add || '');
			$("#pstate2").val(contractGp.state || '');
			$("#pdistrict2").val(contractGp.dist || '');
			$("#ppincode2").val(contractGp.pincode || '');
			$("#address2").val(contractGp.Present_add || '');
			$("#district2").val(contractGp.present_dist || '');
			$("#state3").val(contractGp.present_state || '');
			$("#pincode3").val(contractGp.present_pincode || '');
			$("#nature-job").val(contractGp.Nojdesc || '');
			$("#blood_group").val(contractGp.blg || '');
			$("#location").val(contractGp.wldesc || '');
			

			//  SHOW container only after data load
			$("#container1").slideDown();
			
			
			
			
		},

		error: function(err) {
			console.error("Error fetching CG details:", err);
			alert("Error loading details");
			$("#container1").hide();
		}
	});
}

function loadCompanyDropdown() {

	$.ajax({
		url: new URL('/api/VMScompany', baseUrl1),
		method: 'GET',
		xhrFields: {
			withCredentials: true
		},
		success: function(data) {

			const $company = $("#company");
			const $company1 = $("#company1");

			// Clear existing options
			$company.empty();
			$company1.empty();

			// 🔹 First default option
			$company.append('<option value="">Select Company</option>');
			$company1.append('<option value="">Select Company</option>');

			// 🔹 Append backend values
			$.each(data, function(index, item) {
				$company.append(
					$('<option></option>')
						.val(item.company_id)
						.text(item.company_name)
				);

				$company1.append(
					$('<option></option>')
						.val(item.company_id)
						.text(item.company_name)
				);
			});

			// Enable dropdowns
			$company.prop("disabled", false);
			$company1.prop("disabled", false);
		},
		error: function(xhr, status, error) {
			console.error("Error fetching company data:", error);
		}
	});
}


function loadMedicalDropdown() {

	$.ajax({
		url: new URL('/api/contractmedcheckup', baseUrl1),
		method: 'GET',
		xhrFields: {
			withCredentials: true
		},
		success: function(data) {

			const $medical = $("#medical");
			const $medical1 = $("#medical1");

			// Clear existing options
			$medical.empty();
			$medical1.empty();

			// 🔹 First default option
			$medical.append('<option value="">Select Medical</option>');
			$medical1.append('<option value="">Select Medical</option>');

			// 🔹 Append backend values
			$.each(data, function(index, item) {
				$medical.append(
					$('<option></option>')
						.val(item.mcid)
						.text(item.mcDesc)
				);

				$medical1.append(
					$('<option></option>')
						.val(item.mcid)
						.text(item.mcDesc)
				);
			});

			// Enable dropdowns
			$medical.prop("disabled", false);
			$medical1.prop("disabled", false);
		},
		error: function(xhr, status, error) {
			console.error("Error fetching medical data:", error);
		}
	});
}

function loadBusDropdown() {

	$.ajax({
		url: new URL('/api/contractbus', baseUrl1),
		method: 'GET',
		xhrFields: {
			withCredentials: true
		},
		success: function(data) {

			const $bus = $("#bus");
			const $bus1 = $("#bus1");

			// Clear existing options
			$bus.empty();
			$bus1.empty();

			// 🔹 Default option
			$bus.append('<option value="">Select Bus</option>');
			$bus1.append('<option value="">Select Bus</option>');

			// 🔹 Append backend values
			$.each(data, function(index, item) {
				$bus.append(
					$('<option></option>')
						.val(item.busId)
						.text(item.busDesc)
				);

				$bus1.append(
					$('<option></option>')
						.val(item.busId)
						.text(item.busDesc)
				);
			});

			// Enable dropdowns
			$bus.prop("disabled", false);
			$bus1.prop("disabled", false);
		},
		error: function(xhr, status, error) {
			console.error("Error fetching bus data:", error);
		}
	});
}



async function handleContractAdminSubmission() {

	let selectedCGID = $("#Adaadhar").val();

	// Update selectedCGID if dropdown changes
	$("#Adaadhar").on("change", function() {
		selectedCGID = $(this).val();
	});

	// Submit button click
	$("#btnsubmit").on("click", async function() {

		// --- Validation starts here ---
		let isValid = true;
		$(".text-danger").hide();

		const empid = $("#ID").val().trim();
		const companyid = $("#company").val();
		const medical = $("#medical").val();
		const busid = $("#bus").val();

		const remarks = $("#remarks").val().trim();
	
		

		if (!empid) { $("#IDError").show(); isValid = false; }
		if (!companyid) { $("#companyError").show(); isValid = false; }
		if (!medical) { $("#medicalError").show(); isValid = false; }
		if (!busid) { $("#busError").show(); isValid = false; }
	
		if (!remarks) { $("#remarksError").show(); isValid = false; }
	
		
		if (empid && isValid) {
		    try {
		        const duplicateCheck = await fetch(`${baseUrl1}/api/contractgatepass/entry/employee/${empid}`, { credentials: "include" });
		        if (duplicateCheck.status === 409) {
		            const data = await duplicateCheck.json();
		let factory = data.factory_id;
		let factory_name = factory==1?"Bellary":"Gujarat";
		
		            $("#IDError").text(`The entered Employee ID already exists under Contract Pass ${data.pass_id} for the ${factory_name} factory`).show();
		            isValid = false;
		        }
		    } catch (err) {
		        console.error("Error checking Employee ID:", err);
		        $("#IDError").text("Error checking Employee ID").show();
		        isValid = false;
		    }
		}

		if (!isValid) return; // Stop here if validation fails
		// --- Validation ends here ---

		//  Show confirmation modal only if validation passes
		$("#exampleModalCenter322").modal("show");

		// Handle YES button click
		$("#confirmassetentryyes").off("click").on("click", async function() {
		    $("#exampleModalCenter322").modal("hide");

		    let currentDateTimeString = getIndianDateTimeFormat(new Date());
		    const selectedCGID = sessionStorage.getItem("selectedCGID");

		    try {
		        const admindata = {
		            emp_id:        empid,
		            company_id:    companyid,
		            medical:       medical,
		            bus_id:        busid,
		            admin_remarks: remarks,
		            modified_by:   createdById,
		            modified_date: currentDateTimeString
		        };

		        const response = await fetch(
		            new URL(`/api/contractgatepass/${selectedCGID}`, baseUrl1),
		            {
		                method: 'PUT',
		                credentials: 'include',
		                headers: { 'Content-Type': 'application/json' },
		                body: JSON.stringify(admindata)
		            }
		        );

		        if (response.ok) {
		            showPopup("Admin Entry Successfully Created", "AdminEntry.jsp");
		        } else {
		            alert("Error submitting data: " + await response.text());
		        }

		    } catch (error) {
		        console.error("Error:", error);
		        alert("An error occurred. Please try again.");
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

	const day = istDate.getDate().toString().padStart(2, '0');
	const month = (istDate.getMonth() + 1).toString().padStart(2, '0');
	const year = istDate.getFullYear();

	const hours = istDate.getHours().toString().padStart(2, '0');
	const minutes = istDate.getMinutes().toString().padStart(2, '0');
	const seconds = istDate.getSeconds().toString().padStart(2, '0');

	// Format it as ISO-8601: yyyy-MM-dd'T'HH:mm:ss
	return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
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
async function editadminContractGP(cg_id) {
			  const allowed = allowedActions || [];

	if (!allowed.includes("Edit")) {
	  alert(" You do not have permission to edit.");
	  return;
	}
	const url = new URL(
		`/api/contractgatepass/jims/getContractGatepassDetails?cg_id=${cg_id}&factory_id=${selectedFactoryId}`,
		baseUrl1
	);

	try {
		const response = await fetch(url, {
			method: "GET",
			credentials: "include"
		});

		if (!response.ok) {
			throw new Error(`HTTP ${response.status}`);
		}

		const data = await response.json();
		const contractGp = data?.[0];

		if (!contractGp) {
			alert("No data found");
			return;
		}

		// Helper
		const setValue = (id, value) => {
			const el = document.getElementById(id);
			if (el) el.value = value?.trim?.() || value || '';
		};
		const maritalMap = {
			"1": "Married",
			"2": "Unmarried"
		};
		/* ================= BASIC DETAILS ================= */

		console.log(contractGp);


		setValue("Joinee1", contractGp.joinee_type)
		setValue('aadhar1', contractGp.Aadhar_no);
		setValue('firstname1', contractGp.Fname);
		setValue('lastname1', contractGp.Lname);
		setValue('contact1', contractGp.contactno);
		setValue('gen1', contractGp.Gender);
		setValue('date_birth1', contractGp.Dob);
		setValue('age21', contractGp.Age);
		setValue('blood_group1', contractGp.blg);

		/* ================= JOB DETAILS ================= */

		setValue('date_joining1', contractGp.Doj);
		setValue('department21', contractGp.deptname);
		setValue('designation21', contractGp.designation);
		setValue('nature-job1', contractGp.Nojdesc);
		setValue('location1', contractGp.wldesc);
		setValue('validto1', contractGp.valid_till);

		/* ================= RE-ENTRY LOGIC ================= */

		if (contractGp.joinee_type === "2") {
			// Re-Join
			document.getElementById("updatereentrydiv").style.display = "block";
			setValue('entrydate1', contractGp.rejoin_date || '');
		
		} else {
			// New Join
			document.getElementById("updatereentrydiv").style.display = "none";
	
		}


		/* ================= ID / STATUTORY ================= */

		setValue('PANNo1', contractGp.pan_no);
		setValue('UANNo1', contractGp.UAN_no);
		setValue('PFNo1', contractGp.PF_no);
		setValue('ESICNo1', contractGp.ESIC_no);

		/* ================= NOMINEE ================= */

		setValue('nomineename1', contractGp.Nominee_name);
		setValue('nominee_date1', contractGp.NDOB);
		setValue('nominee_age1', contractGp.NAge);
		setValue('n_relationship1', contractGp.NRelationship);
		setValue('dependants1', contractGp.NTotal_depandants);

		/* ================= BANK ================= */

		setValue('bankname1', contractGp.Bank_name);
		setValue('banka/c1', contractGp.bacc);     // FIXED ID
		setValue('branch21', contractGp.Branch);
		setValue('IFSC21', contractGp.IFSC);

		/* ================= FAMILY ================= */

		setValue('fathername1', contractGp.Father_name);
		setValue('maritalstatus1', maritalMap[contractGp.Marital_status?.trim()] || '');
		setValue('spousename1', contractGp.Spouse_name);

		/* ================= EMERGENCY ================= */

		setValue('econtact1', contractGp.emergency_contact_name);
		setValue('econtactno1', contractGp.emergency_contact_no);
		setValue('rela_tion11', contractGp.Relation);

		/* ================= ADDRESS ================= */

		setValue('addpermanent1', contractGp.Permnt_add);
		setValue('pdistrict21', contractGp.dist);
		setValue('pstate21', contractGp.state);
		setValue('ppincode21', contractGp.pincode);

		setValue('address21', contractGp.Present_add);
		setValue('district21', contractGp.present_dist);
		setValue('state31', contractGp.present_state);
		setValue('pincode31', contractGp.present_pincode);

		/* ================= OTHER ================= */

		setValue('education31', contractGp.education);

		setValue('religion31', contractGp.religion);

		/* ================= ADMIN / VACCINE ================= */

		setValue('ID1', contractGp.emp_id);
		setValue('company1', contractGp.company_id);
		setValue('medical1', contractGp.medical);
		setValue('bus1', contractGp.bus_id);
		
		setValue('remarks1', contractGp.Admin_remarks);
	
		/* ================= OPEN MODAL ================= */
		window.originalAdminData = {
		    emp_id:        contractGp.emp_id?.trim(),
		    company_id:    contractGp.company_id,
		    medical:       contractGp.medical,
		    bus_id:        contractGp.bus_id,
		    admin_remarks: contractGp.Admin_remarks?.trim()
		};;
		window.currentCGID = cg_id;
		$("#exampleModalScrollableadmin12").modal("show");

	} catch (err) {
		console.error("Edit load failed:", err);
		alert("Failed to load data");
	}
}

function handleAdminUpdateSubmission() {

    $("#btnsubmitup").off("click").on("click", async function() {

        const currentData = {
            emp_id:        $("#ID1").val().trim(),
            company_id:    $("#company1").val(),
            medical:       $("#medical1").val(),
            bus_id:        $("#bus1").val(),
            admin_remarks: $("#remarks1").val().trim()
        };

        let hasError = false;
        const checkRequired = (value, errorId) => {
            if (!value || String(value).trim() === "") {
                $("#" + errorId).show();
                hasError = true;
            } else {
                $("#" + errorId).hide();
            }
        };

        checkRequired(currentData.emp_id,        "ID1Error");
        checkRequired(currentData.company_id,    "company1Error");
        checkRequired(currentData.medical,       "medical1Error");
        checkRequired(currentData.bus_id,        "bus1Error");
        checkRequired(currentData.admin_remarks, "remarks1Error");

        if (hasError) return;

        // ── No-change detection ──────────────────────────────────────
        let isChanged = false;
        for (let key in currentData) {
            if (
                String(currentData[key] || "").trim() !==
                String(window.originalAdminData[key] || "").trim()
            ) {
                isChanged = true;
                break;
            }
        }

        if (!isChanged) {
            showPopup("No Feilds Changes", "AdminEntry.jsp");
            return;
        }

        // ── Duplicate emp_id check ───────────────────────────────────
        const oldEmpId = window.originalAdminData.emp_id;
        const newEmpId = currentData.emp_id;

        if (oldEmpId !== newEmpId) {
            try {
                const duplicateCheck = await fetch(
                    `${baseUrl1}/api/contractgatepass/entry/employee/${newEmpId}`,
                    { credentials: "include" }
                );
                if (duplicateCheck.status === 409) {
                    const data = await duplicateCheck.json();
                    const factory_name = data.factory_id == 1 ? "Bellary" : "Gujarat";
                    $("#ID1Error").text(
                        `The entered Employee ID already exists under Contract Pass ${data.pass_id} for the ${factory_name} factory`
                    ).show();
                    return;
                }
            } catch (err) {
                console.error("Error checking Employee ID:", err);
                $("#ID1Error").text("Error checking Employee ID").show();
                return;
            }
        } else {
            $("#ID1Error").hide();
        }

        // ── Show confirm modal ───────────────────────────────────────
        $("#exampleModalCenterUpdate").modal("show");

        $("#confirmassetentryupdateyes").off("click").on("click", async function() {
            $("#exampleModalCenterUpdate").modal("hide");

            try {
                const payload = {
                    ...currentData,
                    modified_by:   createdById,
                    modified_date: getIndianDateTimeFormat(new Date())
                };

                const updateRes = await fetch(
                    new URL(`/api/contractgatepass/${window.currentCGID}`, baseUrl1),
                    {
                        method: "PUT",
                        credentials: "include",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(payload)
                    }
                );

                if (updateRes.ok) {
                    showPopup("Update the Admin Successfully", "AdminEntry.jsp");
                } else {
                    alert("Update failed: " + await updateRes.text());
                }

            } catch (err) {
                console.error(err);
                alert("Something went wrong");
            }
        });
    });
}

function showPopup(message, redirectUrl) {
							    var popup = $('<div class="popup">' + message + '</div>').appendTo('body').hide().fadeIn(400);
							    setTimeout(function () {
							        popup.fadeOut(400, function () {
							            $(this).remove();
							            window.location = redirectUrl;
							        });
							    }, 2000);
							}

function extractFileName(path) {
    if (!path) return '';
    return path.split(/[/\\]/).pop();
}






let pendingDeleteCgId = null;

function deleteContractGP(cg_id) {

    const allowed = allowedActions || [];

    if (!allowed.includes("Delete")) {
        alert(" You do not have permission to delete.");
        return;
    }

    console.log("the cg_id", cg_id);
    $("#deleteRemarks").val('');
    $("#deleteRemarksError").hide();
    $("#deleteRemarksModal").modal("show");

    // prevent multiple click bindings
    $("#confirmDeleteRemarks").off("click").on("click", function () {

        let remarks = $("#deleteRemarks").val().trim();

        if (!remarks) {
            $("#deleteRemarksError").show();
        } else {
            $("#deleteRemarksError").hide();

            // store values temporarily
            window._delete_cg_id = cg_id;
            window._deleteRemarks = remarks;

            // close remarks modal
            $("#deleteRemarksModal").modal("hide");

            // open confirmation modal
            $("#exampleModalDeleteCenterUpdate").modal("show");
        }
    });
}

// 🔥 confirmation YES click (add this once, outside function)
$("#confirmassetentrydeleteyes").off("click").on("click", function () {

    $("#exampleModalDeleteCenterUpdate").modal("hide");

    // call API only after confirmation
    funDelete(window._delete_cg_id, window._deleteRemarks);
});

async function funDelete(cg_id, remarks) {

    const payload = {
        remarks: remarks,
        modified_by: createdById,
        modified_date: getIndianDateTimeFormat(new Date())
    };

    try {
        const response = await fetch(`${baseUrl1}/api/contractgatepass/delete/${cg_id}`, {
            method: 'PUT',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            showPopup("Successfully Deleted", "AdminEntry.jsp");

            // 🔄 Optional: refresh table
            $('#adminTable1').DataTable().ajax.reload();

        } else {
            const result = await response.json().catch(() => ({}));
            alert(result.message || "Failed to delete record");
        }

    } catch (error) {
        console.error("Error deleting record:", error);
        alert("Error occurred while deleting the record");
    }
}