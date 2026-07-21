const currentPage = window.location.pathname.split("/").pop()+'.jsp';

const UserId = sessionStorage.getItem("username");

let allowedActions = [];

/* =========================
   LOAD PAGE ACTIONS
========================= */
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

/* =========================
   COMMON PERMISSION CHECK
========================= */
function hasPermission(actionName) {

    return allowedActions.includes(actionName);

}

/* =========================
   MODAL ACCESS BINDING
========================= */
function bindModalPermission(buttonId, modalId, actionName = "Insert") {

    const button = document.getElementById(buttonId);

    // Button not present in current JSP
    if (!button) return;

    button.addEventListener("click", function () {

        if (!hasPermission(actionName)) {

            alert(`You do not have permission to ${actionName}.`);

            $(modalId).modal("hide");

            return;
        }

        $(modalId).modal("show");

    });
}

/* =========================
   PAGE INITIALIZATION
========================= */
document.addEventListener("DOMContentLoaded", async function () {

    await loadActions();

    /* ---------- ENTRY MODALS ---------- */

    bindModalPermission(
        "modalnature",
        "#exampleModalScrollableNature"
    );

    bindModalPermission(
        "modalwork",
        "#exampleModalScrollableWork"
    );

    bindModalPermission(
        "modalbus",
        "#exampleModalScrollableBus"
    );

    bindModalPermission(
        "modalvaccine",
        "#exampleModalScrollableVaccine"
    );

    bindModalPermission(
        "modalmedical",
        "#exampleModalScrollableMedical"
    );

    bindModalPermission(
        "modalblood",
        "#exampleModalScrollableBlood"
    );

    bindModalPermission(
        "modaleductaion",
        "#exampleModalScrollableeducation"
    );

    bindModalPermission(
        "modalreligion",
        "#exampleModalScrollablereligion"
    );
	bindModalPermission(
	       "modalcontrentry",
	       "#exampleModalScrollable123"
	   );

});


window.onload = function() {
    fetchbloodgrp();
    fetchnatureofjob();
    fetchworkloc();
    fetchbloodgrp1();
    fetchreligon();
    fetchedu();
    fetchvacc();
};
$(document).ready(function() {
    // Create - "Submit" button click
    $("#createreligion").click(function() {
        console.log("Create clicked - Modal will show");
        var religion = $('#religion').val().trim();
        if (!religion) {
            $('#religionError').show();
            return;
        } else {
            $('#religionError').hide();
            $("#exampleModalCenter308").modal("show");
        }

    });
    $('#services').on('input', function() {
        if ($(this).val().trim() !== '') {
            $('#servicesError').hide();
        }
    });

    // Create - "No" button click
    $(".btn-secondary[data-dismiss='modal']").click(function() {
        console.log("No clicked - Modal will hide");
        $("#exampleModalCenter308").modal("hide");
        $("#exampleModalScrollable12").modal("hide");
        $("#statusConfirmModal").modal("hide");
        $("#exampleModalCenterUpdate").modal("hide");

    });

    $(".close[data-dismiss='modal']").click(function() {
        $('#exampleModalStatusCreate').modal('hide');
        $("#exampleModalScrollable12").modal("hide");
        $("#exampleModalScrollableTitle123").modal("hide");
    });

    // Create - "Yes" button click
    $(document).on("click", "#confirmreligionyes", function() {
        console.log("Yes clicked - Proceeding with creation");



        $("#exampleModalCenter308").modal("hide");
        religionaddevent();
    });

    // Update - "Submit" button click
    $("#updreligion").click(function() {
        console.log("Update clicked - Modal will show");
        $("#exampleModalCenter309").modal("show");
    });
	
	
	
	$("#removeadharduplicate").click(function (){
		$("#messageModal").modal("hide");
	})

    $("#cancelreligion1modal").click(function() {
        console.log("No clicked - Modal will hide");
        $("#exampleModalCenter309").modal("hide");
    });


    // Update - "Yes" button click
    $(document).on("click", "#confirmreligion1upd", function() {
        $("#exampleModalCenter309").modal("hide");
        if (selectedreligionid) {
            religionidupdate(selectedreligionid);
        } else {
            alert("Data not found for update.");
        }
    });



    $("#spouse").prop("readonly", true);

    $("#marital").change(function() {
        let maritalValue = $(this).val();
        if (maritalValue === "1") { // Married
            $("#spouse").prop("readonly", false).val(""); // make editable and clear previous value
        } else { // Unmarried or empty
            $("#spouse").prop("readonly", true).val(""); // make readonly and clear value
            $("#spouseError").hide(); // hide error if any
        }
    });




    $("#birth1").on("change", function() {
        let dob = new Date($(this).val());
        if (!isNaN(dob)) {
            let diff = Date.now() - dob.getTime();
            let age = new Date(diff).getUTCFullYear() - 1970;
            $("#age1").val(age);
        } else {
            $("#age1").val("");
        }
    });

    // ====== AGE AUTO CALCULATION FOR NOMINEE ======
    $("#nomineedate1").on("change", function() {
        let dob = new Date($(this).val());
        if (!isNaN(dob)) {
            let diff = Date.now() - dob.getTime();
            let age = new Date(diff).getUTCFullYear() - 1970;
            $("#nomineeage1").val(age);
        } else {
            $("#nomineeage1").val("");
        }
    });

    // ====== SHOW/HIDE SPOUSE NAME BASED ON MARITAL STATUS ======
    $("#marital1").on("change", function() {
        let val = $(this).val();

        if (val == "1") {
            // Married
            $("#spouse1").prop("disabled", false)
        } else {
            // Unmarried
            $("#spouse1").prop("disabled", true).val("");
        }
    });

    // Default disable when modal opens
    $("#exampleModalScrollableTitle123").closest(".modal").on('shown.bs.modal', function() {
        if ($("#marital1").val() !== "1") {
            $("#spouse1").prop("disabled", true);
        }
    });
	
	
	
	
	
    // Fetch initial table
    fetchreligion();
});
const selectedFactoryId = localStorage.getItem('selectedFactoryId');
console.log('selectedFactoryId:', selectedFactoryId);
function showPopup1(message, redirectUrl) {
    var popup = $('<div class="popup">' + message + '</div>').appendTo('body').hide().fadeIn(400);
    setTimeout(function() {
        popup.fadeOut(400, function() {
            $(this).remove();
            window.location = redirectUrl;
        });
    }, 2000);
}
let selectedreligionid = null;  // Must store only ID

function religionaddevent() {
    var religion = $('#religion').val().trim();
    if (!religion) {
        $('#religionError').show();
        return;
    } else {
        $('#religionError').hide();
    }

    // Check if Register Type already exists
    $.ajax({
        url: new URL('/api/religion/check?religionDesc=' + encodeURIComponent(religion), baseUrl1),
        type: 'GET',
        xhrFields: {
            withCredentials: true  // <-- correct way
        },
        success: function(response) {
            if (response.exists) {
                //  alert("Religion already exists!");
                $("#duplicateReligionModal").modal("show");
            } else {
                // Proceed to insert

                $("#duplicateReligionModal").modal("hide");
                insertreligion(religion);
            }
        },
        error: function(xhr, status, error) {
            console.error("Check API Error:", error);
            alert("An error occurred while checking: " + error);
        }
    });
}
document.addEventListener("DOMContentLoaded", function() {
    // Fetch data from your Spring Boot API
    fetch(new URL('/api/contractbus', baseUrl1),
        { credentials: "include" })

        .then(response => response.json()) // Parse JSON response
        .then(data => {
            // Get the select element by ID
            const selectElement = document.getElementById("bus");
            const selectElement1 = document.getElementById("bus1");

            // Loop through the data and create option elements
            data.forEach(item => {
                const option = document.createElement("option");
                option.value = item.busId; // Set the value of the option to 'tid'
                option.textContent = item.busDesc; // Set the text of the option to 'regtype'
                selectElement.appendChild(option); // Append the option to the select element
                const option1 = document.createElement("option");
                option1.value = item.busId; // Set the value of the option to 'tid'
                option1.textContent = item.busDesc; // Set the text of the option to 'regtype'
                selectElement1.appendChild(option1); // Append the option to the select element
            });

            // Enable the select element after populating it
            selectElement.disabled = false;
            selectElement1.disabled = false;
        })
        .catch(error => {
            console.error("Error fetching data:", error);
        });
});

document.addEventListener("DOMContentLoaded", function() {
    // Fetch data from your Spring Boot API
    fetch(new URL('/api/contractvaccine', baseUrl1),
        { credentials: "include" })
        .then(response => response.json()) // Parse JSON response
        .then(data => {
            // Get the select element by ID
            const selectElement = document.getElementById("vaccine");
            const selectElement1 = document.getElementById("vaccine1");
            // Loop through the data and create option elements
            data.forEach(item => {
                const option = document.createElement("option");
                option.value = item.vac_id; // Set the value of the option to 'tid'
                option.textContent = item.vaccineDesc; // Set the text of the option to 'regtype'
                selectElement.appendChild(option); // Append the option to the select element
                const option1 = document.createElement("option");
                option1.value = item.vac_id; // Set the value of the option to 'tid'
                option1.textContent = item.vaccineDesc; // Set the text of the option to 'regtype'
                selectElement1.appendChild(option1); // Append the option to the select element
            });

            // Enable the select element after populating it
            selectElement.disabled = false;
            selectElement1.disabled = false;
        })
        .catch(error => {
            console.error("Error fetching data:", error);
        });
});

document.addEventListener("DOMContentLoaded", function() {
    // Fetch data from your Spring Boot API
    fetch(new URL('/api/contractmedcheckup', baseUrl1),
        { credentials: "include" })
        .then(response => response.json()) // Parse JSON response
        .then(data => {
            // Get the select element by ID
            const selectElement = document.getElementById("medical");
            const selectElement1 = document.getElementById("medical1");

            // Loop through the data and create option elements
            data.forEach(item => {
                const option = document.createElement("option");
                option.value = item.mcid; // Set the value of the option to 'tid'
                option.textContent = item.mcDesc; // Set the text of the option to 'regtype'
                selectElement.appendChild(option); // Append the option to the select element
                const option1 = document.createElement("option");
                option1.value = item.mcid; // Set the value of the option to 'tid'
                option1.textContent = item.mcDesc; // Set the text of the option to 'regtype'
                selectElement1.appendChild(option1); // Append the option to the select element
            });

            // Enable the select element after populating it
            selectElement.disabled = false;
            selectElement1.disabled = false;
        })
        .catch(error => {
            console.error("Error fetching data:", error);
        });
});

document.addEventListener("DOMContentLoaded", function() {
    // Fetch data from your Spring Boot API
    const selectElement = document.getElementById("Adaadhar");
    fetch(new URL(`/api/contractgatepass/jims/aadharforadmin?factory_id=${selectedFactoryId}`, baseUrl1),
        { credentials: "include" })
        .then(response => response.json()) // Parse JSON response
        .then(data => {
            // Get the select element by ID
            const selectElement = document.getElementById("Adaadhar");

            // Loop through the data and create option elements
            data.forEach(item => {
                const option = document.createElement("option");
                option.value = item.cg_id; // Set the value of the option to 'tid'
                option.textContent = item.aadhar_no; // Set the text of the option to 'regtype'
                selectElement.appendChild(option); // Append the option to the select element
            });

            // Enable the select element after populating it
            selectElement.disabled = false;
        })
        .catch(error => {
            console.error("Error fetching data:", error);
        });

    selectElement.addEventListener("change", function() {
        const selectedCGID = this.value;
        document.getElementById("btnsubmit").onclick = async function() {
            let currentDate = new Date();
            let currentDateTimeString = getIndianDateTimeFormat(currentDate);
            const empid = document.getElementById("ID").value;
            const companyid = document.getElementById("company").value;
            const medical = document.getElementById("medical").value;
            const busid = document.getElementById("bus").value;
            const vaccineid = document.getElementById("vaccine").value;
            const vaccinedate1 = document.getElementById("vaccinedate").value;
            const vaccinedate2 = document.getElementById("vaccine_date").value;
            const remarks = document.getElementById("remarks").value;
            const fileInput = document.getElementById("upload");

            const file = fileInput.files[0];
            if (!file) {
                uploadError.style.display = "block";
                return;
            } else {
                uploadError.style.display = "none";
            }
            const formData = new FormData();
            formData.append("file", file);
            formData.append("passId", selectedCGID); // Pass_id for association

            const uploadResponse = await fetch(new URL('/api/contractgatepass/upload', baseUrl1), {
                method: "POST",
                credentials: 'include',
                body: formData
            });

            if (!uploadResponse.ok) {
                const errorMessage = await uploadResponse.text();
                alert("Error uploading file: " + errorMessage);
                return;
            }

            const uploadResult = await uploadResponse.json();
            const filePath = uploadResult.filePath; // Assume backend returns file path
            const admindata = {
                emp_id: empid,
                company_id: companyid,
                medical: medical,
                bus_id: busid,
                vac_id: vaccineid,
                admin_remarks: remarks,
                vac_date: vaccinedate1,
                vac2_date: vaccinedate2,
                filepath: filePath,
                modified_by: createdById,
                modified_date: currentDateTimeString
            };
            fetch(new URL(`/api/contractgatepass/${selectedCGID}`, baseUrl1), {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(admindata)
            })
                .then(response => {
                    // Check for success
                    if (response.ok) {
                        //alert('Data submitted successfully!');
                        showPopup1("Data submitted successfully!", "AdminEntry.jsp");
                        // Clear all form fields if submission was successful
                        //clearFormFields();
                    } else {
                        // Handle non-200 responses here (e.g., 400 or 500)
                        return response.text().then(errorMessage => {
                            alert('Error submitting data: ' + errorMessage);
                        });
                    }
                })

                .catch(error => {
                    console.error('Error:', error);
                    alert('An error occurred. Please try again.');
                });

        };
        if (!selectedCGID) return;
        fetch(new URL(`/api/contractgatepass/jims/getContractGatepassDetails?cg_id=${selectedCGID}&factory_id=${selectedFactoryId}`, baseUrl1), {
            credentials: "include"
        })
            .then(response => response.json())
            .then(data => {
                /*    if (data.length > 0) {*/
                const contractGp = data[0];

                // Fill form fields
                if (contractGp.rejoin_date == null) {
                    document.getElementById('Joinee').value = 1
                    const reenrtytext = document.getElementById("reentry_text");
                    reenrtytext.style.display = 'none';
                }
                else {
                    document.getElementById("Joinee").value = 2 || '';
                    const reenrtytext = document.getElementById("reentry_text");
                    document.getElementById("entrydate").value = contractGp.rejoin_date;
                    reenrtytext.style.display = 'block';

                }

                document.getElementById('firstname').value = contractGp.Fname;
                document.getElementById('lastname').value = contractGp.Lname;
                document.getElementById('contact').value = contractGp.contactno;
                document.getElementById('date_birth').value = contractGp.Dob;
                document.getElementById('gen').value = contractGp.Gender;
                document.getElementById('age2').value = contractGp.Age;
                document.getElementById('date_joining').value = contractGp.Doj;
                document.getElementById('validto').value = contractGp.valid_till;
                document.getElementById('department2').value = contractGp.deptname;
                document.getElementById('designation2').value = contractGp.designation;
                document.getElementById('PANNo').value = contractGp.pan_no;
                document.getElementById('UANNo').value = contractGp.UAN_no;
                document.getElementById('PFNo').value = contractGp.PF_no;
                document.getElementById('ESICNo').value = contractGp.ESIC_no;
                document.getElementById('nomineename').value = contractGp.Nominee_name;
                document.getElementById('nominee_date').value = contractGp.NDOB;
                document.getElementById('nominee_age').value = contractGp.NAge;
                document.getElementById('n_relationship').value = contractGp.NRelationship;
                document.getElementById('dependants').value = contractGp.NTotal_depandants;
                document.getElementById('bankname').value = contractGp.Bank_name;
                document.getElementById('banka/c').value = contractGp.bacc;
                document.getElementById('branch2').value = contractGp.Branch;
                document.getElementById('IFSC2').value = contractGp.IFSC;
                document.getElementById('fathername').value = contractGp.Father_name;
                document.getElementById('maritalstatus').value = contractGp.Marital_status;
                document.getElementById('spousename').value = contractGp.Spouse_name;
                document.getElementById('econtact').value = contractGp.emergency_contact_name;
                document.getElementById('rela_tion1').value = contractGp.Relation;
                document.getElementById('econtactno').value = contractGp.emergency_contact_no;
                document.getElementById('religion3').value = contractGp.religion;
                document.getElementById('education3').value = contractGp.education;
                document.getElementById('vaccinationstatus').value = contractGp.Vac_status;
                document.getElementById('addpermanent').value = contractGp.Permnt_add;
                document.getElementById('pstate2').value = contractGp.state;
                document.getElementById('pdistrict2').value = contractGp.dist;
                document.getElementById('ppincode2').value = contractGp.pincode;
                document.getElementById('address2').value = contractGp.Present_add;
                document.getElementById('district2').value = contractGp.present_dist;
                document.getElementById('state3').value = contractGp.present_state;
                document.getElementById('pincode3').value = contractGp.present_pincode;
                document.getElementById('nature-job').value = contractGp.Nojdesc;
                document.getElementById('blood_group').value = contractGp.blg;
                document.getElementById('location').value = contractGp.wldesc;
                document.getElementById('eprevious').value = contractGp.previous_exp;
                /*	document.getElementById('ID1').value = contractGp.emp_id;
                    document.getElementById('medical1').value = contractGp.medical;
                    document.getElementById('bus1').value = contractGp.bus_id;
                    document.getElementById('vaccine1').value = contractGp.vac_id;
                    document.getElementById('vaccinedate1').value = contractGp.vac_date;
                    document.getElementById('vaccine_date1').value = contractGp.vac2_date;*/

                $("#container1").modal("show");
                /*	$("#exampleModalScrollable123").modal("show");*/
            })
            .catch(error => {
                console.error("Error fetching CGID details:", error);
            });
    });
});
document.addEventListener('DOMContentLoaded', fetchAndDisplayadminGP);
async function fetchAndDisplayadminGP() {
    const apiUrl = new URL(`/api/contractgatepass/jims/getContractGatepassDetails?filter=admin_remarks&factory_id=${selectedFactoryId}`, baseUrl1); // Update if your backend port differs

    try {
        const response = await fetch(apiUrl, {
            method: "GET",
            credentials: "include"   // Send the session cookie automatically
        });

        if (!response.ok) throw new Error("Failed to fetch  data");

        const data = await response.json();
        let tableRows = '';

        data.forEach((item, index) => {
            tableRows += `
									<tr id="row_${item.cg_id}">
									<td>${index + 1 || ''}</td>
									<td>${item.Pass_id || ''}</td>
									<td>${item.Aadhar_no || ''}</td>
				                    <td>${item.emp_id || ''}</td>
									<td>${item.Fname || ''}</td>
				                    <td>${item.Lname || ''}</td>
				                    <td>
				                   <i class="fa fa-pen text-muted" style="cursor: pointer;" onclick="editadminContractGP(${item.cg_id},'${item.pass_id}')"></i>
				                    </td>
				                </tr>
				            `;
        });

        // Inject rows into the table body
        document.querySelector("#adminTable1 tbody").innerHTML = tableRows;

        // Reinitialize DataTable
        if ($.fn.DataTable.isDataTable('#adminTable1')) {
            $('#adminTable1').DataTable().destroy();
        }

        $('#adminTable1').DataTable({
            dom: 'Bfrtip',
            scrollX: true,
            info: false,
            paging: false,
            buttons: [
                {
                    extend: 'excel',
                    text: 'Export to Excel',
                    title: 'ContractGP Details'
                }
            ]
        });

        // Custom button styling
        $('.dt-buttons').css({
            'float': 'left',
            'margin-right': '10px'
        });

        $('.dataTables_filter').css({
            'text-align': 'right',
            'float': 'right',
            'margin-bottom': '10px'
        });

    } catch (error) {
        console.error('Error fetching invoice exit data:', error);
    }
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
    const contractGpApiUrl = new URL(`/api/contractgatepass/jims/getContractGatepassDetails?cg_id=${cg_id}&factory_id=${selectedFactoryId}`, baseUrl1);
    document.getElementById("btnsubmitup").addEventListener("click", async function() {
        const fileInput = document.getElementById("upload1");
        let currentDate = new Date();
        let currentDateTimeString = getIndianDateTimeFormat(currentDate);
        const url = new URL(`/api/contractgatepass/${cg_id}`, baseUrl1);

        const getValue = (id) => document.getElementById(id)?.value?.trim() || '';
        const file = fileInput.files[0];
        if (!file) {
            uploadError.style.display = "block";
            return;
        } else {
            uploadError.style.display = "none";
        }
        const formData = new FormData();
        formData.append("file", file);
        formData.append("passId", cg_id); // Pass_id for association

        const uploadResponse = await fetch(new URL('/api/contractgatepass/upload', baseUrl1), {
            method: "POST",
            credentials: 'include',
            body: formData
        });

        if (!uploadResponse.ok) {
            const errorMessage = await uploadResponse.text();
            alert("Error uploading file: " + errorMessage);
            return;
        }

        const uploadResult = await uploadResponse.json();
        const filePath = uploadResult.filePath; // Assume backend returns file path

        const payload = {
            emp_id: getValue('ID1'),
            medical: getValue('medical1'),
            bus_id: getValue('bus1'),
            vac_id: getValue('vaccine1'),
            vac_date: getValue('vaccinedate1'),
            vac2_date: getValue('vaccine_date1'),
            admin_remarks: getValue('remarks1'),
            filepath: filePath,
            modified_by: createdById,
            modified_date: currentDateTimeString
        };

        try {
            const response = await fetch(url, {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const result = await response.json();
            // showPopup1("Contract Gate Pass updated successfully!", "AdminEntry.jsp");
            const popup = $('<div class="popup">Updated Successfully!</div>').appendTo('body').fadeIn(400);
            setTimeout(() => {
                popup.fadeOut(400, () => {
                    popup.remove();
                    window.location = 'AdminEntry.jsp';
                });
            }, 2000);
            console.log('Update result:', result);
            $("#exampleModalScrollable123").modal("hide");

        } catch (error) {
            console.error("Error updating ContractGP data:", error);
            alert("Failed to update ContractGP: " + error.message);
        }
    });

    try {
        // Fetch visitor data
        const response = await fetch(contractGpApiUrl, {
            method: "GET",
            credentials: "include"   // Send the session cookie automatically
        });

        if (!response.ok) throw new Error(`Failed to fetch ContractGP data: ${response.status}`);

        const contractGpArray = await response.json(); // result is the array itself
        const contractGp = contractGpArray?.[0]; // safely access the first object

        console.log('ContractGP Data:', contractGp);

        const setValue = (id, value) => {
            const element = document.getElementById(id);
            if (element) element.value = value || '';
        };

        // Set field values
        setValue('aadhar1', contractGp.Aadhar_no);
        setValue('firstname1', contractGp.Fname);
        setValue('Joinee1', contractGp.fname);
        if (contractGp.rejoin_date == null) {
            document.getElementById('Joinee1').value = 1
            const reenrtytext = document.getElementById("updatereentrydiv");
            reenrtytext.style.display = 'none';
        }
        else {
            document.getElementById("Joinee1").value = 2 || '';
            const reenrtytext = document.getElementById("updatereentrydiv");
            reenrtytext.style.display = 'block';

        }
        setValue('lastname1', contractGp.Lname);
        setValue('contact1', contractGp.contactno);
        setValue('date_birth1', contractGp.Dob);
        setValue('age21', contractGp.Age);
        setValue('blood_group1', contractGp.blg);
        setValue('gen1', contractGp.Gender);
        setValue('joining1', contractGp.Doj);
        setValue('nature-job1', contractGp.Nojdesc);
        setValue('validto1', contractGp.valid_till);
        setValue('department21', contractGp.deptname);
        setValue('designation21', contractGp.designation);
        setValue('location1', contractGp.wldesc);
        setValue('PANNo1', contractGp.pan_no);
        setValue('UANNo1', contractGp.UAN_no);
        setValue('PFNo1', contractGp.PF_no);
        setValue('ESICNo1', contractGp.ESIC_no);
        setValue('nomineename1', contractGp.Nominee_name);
        setValue('nominee_date1', contractGp.NDOB);
        setValue('nominee_age1', contractGp.NAge);
        setValue('relationship1', contractGp.nrelationship);
        setValue('dependants1', contractGp.NTotal_depandants);
        setValue('bankname1', contractGp.Bank_name);
        setValue('banka/c1', contractGp.bacc);
        setValue('branch21', contractGp.Branch);
        setValue('IFSC21', contractGp.IFSC);
        setValue('fathername1', contractGp.Father_name);
        setValue('maritalstatus1', contractGp.Marital_status);
        setValue('spousename1', contractGp.Spouse_name);
        setValue('econtact1', contractGp.emergency_contact_name);
        setValue('rela_tion11', contractGp.Relation);
        setValue('econtactno1', contractGp.emergency_contact_no);
        setValue('religion1', contractGp.religion);
        setValue('education31', contractGp.education);

        setValue('addpermanent1', contractGp.Permnt_add);
        setValue('pstate21', contractGp.state);
        setValue('pdistrict21', contractGp.dist);
        setValue('ppincode21', contractGp.pincode);
        setValue('address21', contractGp.Present_add);
        setValue('district21', contractGp.present_dist);
        setValue('state31', contractGp.present_state);
        setValue('pincode31', contractGp.pincode);
        setValue('eprevious1', contractGp.previous_exp);
        setValue('vaccinationstatus1', contractGp.Vac_status);
        setValue('religion31', contractGp.religion);
        setValue('ID1', contractGp.emp_id);
        setValue('medical1', contractGp.medical);
        setValue('bus1', contractGp.bus_id);
        setValue('vaccine1', contractGp.vac_id);
        setValue('vaccinedate1', contractGp.vac_date);
        setValue('vaccine_date1', contractGp.vac2_date);
        setValue('remarks1', contractGp.Admin_remarks);


        $("#exampleModalScrollable12").modal("show");

    } catch (error) {
        console.error('Error fetching ContractGP data:', error);
        alert('Could not load ContractGP data: ' + error.message);
    }
}



document.addEventListener("DOMContentLoaded", function() {
    // Fetch data from your Spring Boot API
    /*	const selectElement = document.getElementById("company");*/
    fetch(new URL('/api/VMScompany', baseUrl1), {
        credentials: "include"
    })
        .then(response => response.json()) // Parse JSON response
        .then(data => {
            // Get the select element by ID
            const selectElement = document.getElementById("company");
            const selectElement1 = document.getElementById("company1");

            // Loop through the data and create option elements
            data.forEach(item => {
                const option = document.createElement("option");
                option.value = item.company_id; // Set the value of the option to 'tid'
                option.textContent = item.company_name; // Set the text of the option to 'regtype'
                selectElement.appendChild(option); // Append the option to the select element

                const option1 = document.createElement("option");
                option1.value = item.company_id; // Set the value of the option to 'tid'
                option1.textContent = item.company_name; // Set the text of the option to 'regtype'
                selectElement1.appendChild(option1); // Append the option to the select element
            });

            // Enable the select element after populating it
            selectElement.disabled = false;
            selectElement1.disabled = false;
        })
        .catch(error => {
            console.error("Error fetching data:", error);
        });
});
/*		function admincontractgp()
        {
            const adhaar = document.getElementById("aadhar").value;
            const adhaar = document.getElementById("aadhar").value;
            const adhaar = document.getElementById("aadhar").value;
        	
            console.log("Sending data to server:", contractentrydata);

                            fetch('http://localhost:8004/api/contractgatepass', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify(contractentrydata)
                            })
                            .then(async response => {
                                const responseBody = await response.text(); // In case it's not JSON
                                console.log("Response status:", response.status);
                                console.log("Response body:", responseBody);

                                if (response.ok) {
                                    showPopup("Inserted Successfully", "ContractGPEntry.jsp");
                                   // clearFormFields();
                                } else {
                                    alert("Error submitting data: " + responseBody);
                                }
                            })
                            .catch(error => {
                                console.error('Network or fetch error:', error);
                                alert('An error occurred. Please try again.');
                            });
                        };*/

function insertreligion(religion) {
    let currentDateTimeString = getIndianDateTimeFormat(new Date());

    var requestData = {
        "religionDesc": religion,
        "createdby": createdById,
        "createddt": currentDateTimeString
    };

    $.ajax({
        url: new URL('/api/religion', baseUrl1),
        type: 'POST',
        xhrFields: {
            withCredentials: true
        },
        contentType: 'application/json',
        data: JSON.stringify(requestData),
        dataType: 'json',
        success: function(response) {
            if (response && response.status === "Success") {
                // showPopup("Inserted Successfully", "ContractMaster.jsp");
                const popup = $('<div class="popup">Inserted Successfully!</div>').appendTo('body').fadeIn(400);
                setTimeout(() => {
                    popup.fadeOut(400, () => {
                        popup.remove();
                        window.location = 'ContractMaster.jsp';
                    });
                }, 2000);
            } else {
                alert("Record not inserted. Please try again.");
            }
        },
        error: function(xhr, status, error) {
            console.error("Insert AJAX Error:", error);
            alert("An error occurred while inserting: " + error);
        }
    });
}

async function fetchreligion() {
    const apiUrl = new URL('/api/religion', baseUrl1);

    try {
        const response = await fetch(apiUrl, { credentials: "include" });
        if (!response.ok) throw new Error("Failed to fetch religions");

        const religionList = await response.json();
        let tableRows = '';

        for (let index = 0;index < religionList.length;index++) {
            const item = religionList[index];

            // 🔍 Check if religion is already used
            const usedRes = await fetch(
                new URL(`/api/religion/is-used/${item.reliId}`, baseUrl1),
                { credentials: "include" }
            );

            const usedData = await usedRes.json();
            const isUsed = usedData.used;

            tableRows += `
                <tr id="${item.reliId}">
                    <td>${index + 1}</td>
                    <td>${item.religionDesc}</td>
                    <td>
                        ${isUsed
                    ? `<i class="fa fa-pen text-secondary"
                                  title="Religion already used"
                                  style="cursor:not-allowed; opacity:0.3;"></i>`
                    : `<i class="fa fa-pen text-muted cursor-pointer"
                                  title="Edit"
                                  onclick="editreligion(${item.reliId})"></i>`
                }
                    </td>
                </tr>
            `;
        }

        document.querySelector("#religionTableID tbody").innerHTML = tableRows;

        if ($.fn.DataTable.isDataTable('#religionTableID')) {
            $('#religionTableID').DataTable().destroy();
        }

		$('#religionTableID').DataTable({
		    dom: 'Bfrtip',
		    scrollX: false,
		    info: true,
		    paging: true,
		    pageLength: 10,
		    lengthMenu: [10, 25, 50, 100],
		    buttons: [{
		        extend: 'excel',
		        text: 'Export to Excel',
		        title: 'Religion List'
		    }]
		});

        $('.dt-buttons').css({ float: 'left', 'margin-right': '10px' });
        $('.dataTables_filter').css({ float: 'right', 'margin-bottom': '10px' });

    } catch (error) {
        console.error('Error fetching religions:', error);
    }
}


let originalReligionDesc = "";

function editreligion(reliId) {
	
	if (!hasPermission("Edit")) {

		           alert(`You do not have permission to Edit`);
				   return;
				   }
    fetch(new URL(`/api/religion/${reliId}`, baseUrl1), {
        credentials: "include"
    })
        .then(response => response.json())
        .then(data => {
            originalReligionDesc = (data.religionDesc || "").trim(); // 🔒 store original
            document.getElementById('religion1').value = originalReligionDesc;

            selectedreligionid = data.reliId;
            $('#exampleModalScrollablereligion1').modal('show');
        })
        .catch(error => {
            console.error('Error fetching religion for editing:', error);
            alert('Error fetching religion');
        });
}

async function religionidupdate(reliId) {
    const newReligionDesc = document.getElementById('religion1').value.trim();

    // ❌ No changes made
    if (newReligionDesc === originalReligionDesc) {
        // alert("No changes detected. Update not allowed.");
        showPopup("No changes detected Update is skipped.", "ContractMaster.jsp")
        return;
    }

    try {
        // 🔍 Duplicate check before update
        const checkRes = await fetch(
            new URL(`/api/religion/check-update?religionDesc=${encodeURIComponent(newReligionDesc)}&reliId=${reliId}`, baseUrl1),
            { credentials: "include" }
        );

        const checkData = await checkRes.json();

        if (checkData.exists) {
            // ❌ Duplicate found
            $('#duplicateReligionModal').modal('show');
            return;
        }

        // ✅ Proceed with update
        const updatedreligion = {
            religionDesc: newReligionDesc,
            updatedBy: createdById,
            updatedDate: getIndianDateTimeFormat(new Date())
        };

        const updateRes = await fetch(
            new URL(`/api/religion/${reliId}`, baseUrl1),
            {
                method: 'PUT',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedreligion)
            }
        );

        if (updateRes.ok) {
            showPopup("Updated Successfully!", "ContractMaster.jsp");
            $('#exampleModalScrollablereligion1').modal('hide');
            fetchreligion();
        } else {
            alert('Failed to update religion');
        }

    } catch (error) {
        console.error('Error updating religion:', error);
        alert('Error updating religion');
    }
}

$(document).ready(function() {
    // Create - "Submit" button click
    $("#createeducation").click(function() {
        console.log("Create clicked - Modal will show");
        var education = $('#education').val().trim();
        if (!education) {
            $('#educationError').show();

        } else {
            $('#educationError').hide();
            $("#exampleModalCenter306").modal("show");
        }

    });

    // Create - "No" button click
    $(".btn-secondary[data-dismiss='modal']").click(function() {
        console.log("No clicked - Modal will hide");
        $("#exampleModalCenter306").modal("hide");
    });

    // Create - "Yes" button click
    $(document).on("click", "#confirmeducationyes", function() {
        console.log("Yes clicked - Proceeding with creation");
        $("#exampleModalCenter306").modal("hide");
        educationaddevent();
    });

    // Update - "Submit" button click
    $("#updeducation1").click(function() {
        console.log("Update clicked - Modal will show");

        let education1 = $("#education1").val().trim();
        if (!education1) {
            $("#education1Error").show();
        }
        else {
            $("#education1Error").hide();

            $("#exampleModalCenter307").modal("show");
        }
    });

    $("#canceleducation1modal").click(function() {
        console.log("No clicked - Modal will hide");
        $("#exampleModalCenter307").modal("hide");
    });


    // Update - "Yes" button click
    $(document).on("click", "#confirmeducation1upd", function() {
        $("#exampleModalCenter307").modal("hide");
        if (selectededucationid) {
            educationupdate(selectededucationid);
        } else {
            alert("Data not found for update.");
        }
    });

    // Fetch initial table
    fetcheducation();
});

let selectededucationid = null;  // Must store only ID

function educationaddevent() {
    var education = $('#education').val().trim();
    if (!education) {
        $('#educationError').show();
        return;
    } else {
        $('#educationError').hide();
    }

    // Check if Register Type already exists
    $.ajax({
        url: new URL('/api/education/check?eduDesc=' + encodeURIComponent(education), baseUrl1),
        type: 'GET',
        xhrFields: {
            withCredentials: true  // <-- correct way
        },
        success: function(response) {
            if (response.exists) {
                //  alert("Education already exists!");
                $("#duplicateEducationModal").modal("show");
            } else {
                $("#duplicateEducationModal").modal("hide");
                inserteducation(education);
            }
        },
        error: function(xhr, status, error) {
            console.error("Check API Error:", error);
            alert("An error occurred while checking: " + error);
        }
    });
}

function inserteducation(education) {
    let currentDateTimeString = getIndianDateTimeFormat(new Date());

    var requestData = {
        "eduDesc": education,
        "createdby": createdById,
        "createddt": currentDateTimeString
    };

    $.ajax({
        url: new URL('/api/education', baseUrl1),
        type: 'POST',
        xhrFields: {
            withCredentials: true
        },
        contentType: 'application/json',
        data: JSON.stringify(requestData),
        dataType: 'json',
        success: function(response) {
            if (response && response.status === "Success") {
                showPopup("Inserted Successfully", "ContractMaster.jsp");
            } else {
                alert("Record not inserted. Please try again.");
            }
        },
        error: function(xhr, status, error) {
            console.error("Insert AJAX Error:", error);
            alert("An error occurred while inserting: " + error);
        }
    });
}

async function fetcheducation() {
    const apiUrl = new URL('/api/education', baseUrl1);

    try {
        const response = await fetch(apiUrl, { credentials: "include" });
        if (!response.ok) throw new Error("Failed to fetch education");

        const educationList = await response.json();
        let tableRows = '';

        for (let index = 0;index < educationList.length;index++) {
            const item = educationList[index];

            // 🔍 Check if education is already used
            const usedRes = await fetch(
                new URL(`/api/education/is-used/${item.eduId}`, baseUrl1),
                { credentials: "include" }
            );

            const usedData = await usedRes.json();
            const isUsed = usedData.used;

            tableRows += `
                <tr id="${item.eduId}">
                    <td>${index + 1}</td>
                    <td>${item.eduDesc}</td>
                    <td>
                        ${isUsed
                    ? `<i class="fa fa-pen text-secondary"
                                  title="Education already used"
                                  style="cursor:not-allowed; opacity:0.3;"></i>`
                    : `<i class="fa fa-pen text-muted cursor-pointer"
                                  title="Edit"
                                  onclick="editeducation(${item.eduId})"></i>`
                }
                    </td>
                </tr>
            `;
        }

        document.querySelector("#educationTableID tbody").innerHTML = tableRows;

        if ($.fn.DataTable.isDataTable('#educationTableID')) {
            $('#educationTableID').DataTable().destroy();
        }

		$('#educationTableID').DataTable({
		    dom: 'Bfrtip',
		    scrollX: false,
		    info: true,          // Show "Showing 1 to 10 of X entries"
		    paging: true,        // Enable pagination
		    pageLength: 10,      // Display 10 rows per page
		    lengthMenu: [
		        [10, 25, 50, 100],
		        [10, 25, 50, 100]
		    ],
		    buttons: [{
		        extend: 'excel',
		        text: 'Export to Excel',
		        title: 'Education List'
		    }]
		});

        $('.dt-buttons').css({ float: 'left', 'margin-right': '10px' });
        $('.dataTables_filter').css({ float: 'right', 'margin-bottom': '10px' });

    } catch (error) {
        console.error('Error fetching education:', error);
    }
}


let originalEducationDesc = "";

function editeducation(eduId) {
	
	if (!hasPermission("Edit")) {

		           alert(`You do not have permission to Edit`);
				   return;
				   }
    fetch(new URL(`/api/education/${eduId}`, baseUrl1), {
        credentials: "include"
    })
        .then(response => response.json())
        .then(data => {
            document.getElementById('education1').value = data.eduDesc || '';
            originalEducationDesc = data.eduDesc || '';   // 🔥 store original
            selectededucationid = data.eduId;
            $('#exampleModalScrollableeducation1').modal('show');
        })
        .catch(error => {
            console.error('Error fetching education:', error);
            alert('Error fetching education');
        });
}

async function educationupdate(eduId) {

    const newEduDesc = document.getElementById('education1').value.trim();

    // ❌ No change
    if (newEduDesc === originalEducationDesc) {
        showPopup("No changes Detected Upadate Skipped", "ContractMaster.jsp");
        return;
    }

    try {
        // 🔍 Duplicate check
        const checkRes = await fetch(
            new URL(`/api/education/check-update?eduDesc=${encodeURIComponent(newEduDesc)}&eduId=${eduId}`, baseUrl1),
            { credentials: "include" }
        );

        const checkData = await checkRes.json();

        if (checkData.exists) {
            $('#duplicateEducationModal').modal('show');
            return;
        }

        // ✅ Update only if unique
        const updatededucation = {
            eduDesc: newEduDesc,
            updatedBy: createdById,
            updatedDate: getIndianDateTimeFormat(new Date())
        };

        const updateRes = await fetch(
            new URL(`/api/education/${eduId}`, baseUrl1),
            {
                method: 'PUT',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatededucation)
            }
        );

        if (updateRes.ok) {
            showPopup("Updated Successfully!", "ContractMaster.jsp");
            $('#exampleModalScrollableeducation1').modal('hide');
            fetcheducation();
        } else {
            alert("Failed to update education");
        }

    } catch (error) {
        console.error("Error updating education:", error);
        alert("Error updating education");
    }
}

$(document).ready(function() {
    // Create - "Submit" button click
    $("#createbloodgrp").click(function() {
        console.log("Create clicked - Modal will show");

        var bloodgroup = $('#bloodgroup').val().trim();
        if (!bloodgroup) {
            $('#bloodgroupError').show();
            $("#exampleModalCenter304").modal("hide");

        } else {
            $('#bloodgroupError').hide();
            $("#exampleModalCenter304").modal("show");
        }


    });

    // Create - "No" button click
    $(".btn-secondary[data-dismiss='modal']").click(function() {
        console.log("No clicked - Modal will hide");
        $("#exampleModalCenter304").modal("hide");
    });

    // Create - "Yes" button click
    $(document).on("click", "#confirmbloodgroupyes", function() {
        console.log("Yes clicked - Proceeding with creation");
        $("#exampleModalCenter304").modal("hide");
        bloodgroupaddevent();
    });

    // Update - "Submit" button click
    $("#updbloodgrp").click(function() {
        console.log("Update clicked - Modal will show");


        const blg = document.getElementById('bloodgroup1').value.trim();
        if (!blg) {
            $("#bloodgroup1Error").show();
        }
        else {
            $("#bloodgroup1Error").hide();
            $("#exampleModalCenter305").modal("show");
        }
    });

    $("#cancelbloodgroup1modal").click(function() {
        console.log("No clicked - Modal will hide");
        $("#exampleModalCenter305").modal("hide");
    });


    // Update - "Yes" button click
    $(document).on("click", "#confirmbloodgroup1upd", function() {
        $("#exampleModalCenter305").modal("hide");
        if (selectedbloodgroupid) {
            bloodgroupupdate(selectedbloodgroupid);
        } else {
            alert("Data not found for update.");
        }
    });

    // Fetch initial table
    fetchbloodgroup();
});

let selectedbloodgroupid = null;  // Must store only ID

function bloodgroupaddevent() {
    var bloodgroup = $('#bloodgroup').val().trim();
    if (!bloodgroup) {
        $('#bloodgroupError').show();
        return;
    } else {
        $('#bloodgroupError').hide();
    }

    // Check if Register Type already exists
    $.ajax({
        url: new URL('/api/contractbloodgroup/check?blg=' + encodeURIComponent(bloodgroup), baseUrl1),
        type: 'GET',
        xhrFields: {
            withCredentials: true  // <-- correct way
        },
        success: function(response) {
            if (response.exists) {
                //alert("Blood group already exists!");
                $("#duplicateBloodModal").modal("show");
            } else {
                // Proceed to insert
                $("#duplicateBloodModal").modal("hide");
                insertbloodgroup(bloodgroup);
            }
        },
        error: function(xhr, status, error) {
            console.error("Check API Error:", error);
            alert("An error occurred while checking: " + error);
        }
    });
}

function insertbloodgroup(bloodgroup) {
    let currentDateTimeString = getIndianDateTimeFormat(new Date());

    var requestData = {
        blg: bloodgroup,
        createdby: createdById,
        createddt: currentDateTimeString
    };

    $.ajax({
        url: new URL('/api/contractbloodgroup', baseUrl1).toString(),
        type: 'POST',
        xhrFields: {
            withCredentials: true
        },
        contentType: "application/json",       // <-- REQUIRED
        data: JSON.stringify(requestData),     // sending JSON body
        dataType: 'json',                      // expecting JSON response
        success: function(response) {
            if (response && response.status === "Success") {
                showPopup("Inserted Successfully", "ContractMaster.jsp");
            } else {
                alert("Record not inserted. Please try again.");
            }
        },
        error: function(xhr, status, error) {
            console.error("Insert AJAX Error:", xhr.responseText || error);
            alert("An error occurred while inserting: " + error);
        }
    });
}

async function fetchbloodgroup() {
    const apiUrl = new URL('/api/contractbloodgroup', baseUrl1);

    try {
        const response = await fetch(apiUrl, { credentials: "include" });
        if (!response.ok) throw new Error("Failed to fetch blood groups");

        const bloodgroups = await response.json();
        let tableRows = '';

        for (let index = 0;index < bloodgroups.length;index++) {
            const item = bloodgroups[index];

            // 🔍 Check if blood group is already used
            const usedRes = await fetch(
                new URL(`/api/contractbloodgroup/is-used/${item.blId}`, baseUrl1),
                { credentials: "include" }
            );

            const usedData = await usedRes.json();
            const isUsed = usedData.used;

            tableRows += `
                <tr id="${item.blId}">
                    <td>${index + 1}</td>
                    <td>${item.blg}</td>
                    <td>
                        ${isUsed
                    ? `<i class="fa fa-pen text-secondary"
                                  title="Blood group already used"
                                  style="cursor:not-allowed; opacity:0.3;"></i>`
                    : `<i class="fa fa-pen text-muted cursor-pointer"
                                  title="Edit"
                                  onclick="editblg(${item.blId})"></i>`
                }
                    </td>
                </tr>
            `;
        }

        document.querySelector("#bloodTableID tbody").innerHTML = tableRows;

        if ($.fn.DataTable.isDataTable('#bloodTableID')) {
            $('#bloodTableID').DataTable().destroy();
        }

		$('#bloodTableID').DataTable({
		    dom: 'Bfrtip',
		    scrollX: false,
		    info: true,
		    paging: true,
		    pageLength: 10,
		    lengthMenu: [
		        [10, 25, 50, 100],
		        [10, 25, 50, 100]
		    ],
		    buttons: [{
		        extend: 'excel',
		        text: 'Export to Excel',
		        title: 'Blood Group List'
		    }]
		});
        $('.dt-buttons').css({ 'float': 'left', 'margin-right': '10px' });
        $('.dataTables_filter').css({ 'float': 'right', 'margin-bottom': '10px' });

    } catch (error) {
        console.error('Error fetching blood groups:', error);
    }
}

let originalBloodGroup = "";
function editblg(blId) {
	if (!hasPermission("Edit")) {

		           alert(`You do not have permission to Edit`);
				   return;
				   }
	
    fetch(new URL(`/api/contractbloodgroup/${blId}`, baseUrl1), {
        credentials: "include"
    })
        .then(response => response.json())
        .then(data => {
            document.getElementById('bloodgroup1').value = data.blg || '';
            selectedbloodgroupid = data.blId;
            originalBloodGroup = data.blg || "";   // ✅ store original value
            $('#exampleModalScrollableBlood1').modal('show');
        })
        .catch(error => {
            console.error('Error fetching blood group for editing:', error);
            alert('Error fetching blood group');
        });
}

async function bloodgroupupdate(blId) {
    const blg = document.getElementById('bloodgroup1').value.trim();

    if (!blg) {
        alert("Blood group cannot be empty");
        return;
    }

    // ❌ No change detected
    if (blg === originalBloodGroup) {
        showPopup("No Change detected, Update is Skipped", "ContractMaster.jsp");
        return;
    }

    try {
        // 🔍 Duplicate check (excluding current ID)
        const checkRes = await fetch(
            new URL(
                `/api/contractbloodgroup/check-update?blg=${encodeURIComponent(blg)}&blgId=${blId}`,
                baseUrl1
            ),
            { credentials: "include" }
        );

        const checkData = await checkRes.json();

        if (checkData.exists) {
            // ❌ Duplicate found
            $('#duplicateBloodModal').modal('show');
            return;
        }

        // ✅ Proceed with update
        const updatedbloodgroup = {
            blg: blg,
            updatedBy: createdById,
            updatedDate: getIndianDateTimeFormat(new Date())
        };

        const updateRes = await fetch(
            new URL(`/api/contractbloodgroup/${blId}`, baseUrl1),
            {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedbloodgroup)
            }
        );

        if (updateRes.ok) {
            showPopup("Updated Successfully!", "ContractMaster.jsp");
            $('#exampleModalScrollableBlood1').modal('hide');
            fetchbloodgroup();   // refresh list
        } else {
            alert('Failed to update blood group');
        }

    } catch (error) {
        console.error('Error updating blood group:', error);
        alert('Error updating blood group');
    }
}




$(document).ready(function() {
    // Create - "Submit" button click
    $("#createmedicalcheckup").click(function() {
        console.log("Create clicked - Modal will show");

        var checkup = $('#checkup').val().trim();
        if (!checkup) {
            $('#checkupError').show();

        } else {
            $('#checkupError').hide();
            $("#exampleModalCenter302").modal("show");
        }

    });

    // Create - "No" button click
    $(".btn-secondary[data-dismiss='modal']").click(function() {
        console.log("No clicked - Modal will hide");
        $("#exampleModalCenter302").modal("hide");
    });

    // Create - "Yes" button click
    $(document).on("click", "#confirmcheckupyes", function() {
        console.log("Yes clicked - Proceeding with creation");
        $("#exampleModalCenter302").modal("hide");
        checkupaddevent();
    });

    // Update - "Submit" button click
    $("#updmedicalcheckuptype").click(function() {
        console.log("Update clicked - Modal will show");
        $("#exampleModalCenter303").modal("show");
    });

    $("#cancelcheckup1modal").click(function() {
        console.log("No clicked - Modal will hide");
        $("#exampleModalCenter303").modal("hide");
    });


    // Update - "Yes" button click
    $(document).on("click", "#confirmcheckup1upd", function() {
        $("#exampleModalCenter303").modal("hide");
        if (selectedcheckupid) {
            checkupdate(selectedcheckupid);
        } else {
            alert("Data not found for update.");
        }
    });

    // Fetch initial table
    fetchcheckup();
});

let selectedcheckupid = null;  // Must store only ID

function checkupaddevent() {
    var checkup = $('#checkup').val().trim();
    if (!checkup) {
        $('#checkupError').show();
        return;
    } else {
        $('#checkupError').hide();
    }

    // Check if Register Type already exists
    $.ajax({
        url: new URL('/api/contractmedcheckup/check?mcDesc=' + encodeURIComponent(checkup), baseUrl1),
        type: 'GET',
        xhrFields: {
            withCredentials: true  // <-- correct way
        },
        success: function(response) {
            if (response.exists) {
                //alert("Check up type already exists!");
                $("#duplicateMedicalModal").modal("show");
            } else {
                // Proceed to insert
                $("#duplicateMedicalModal").modal("hide");
                insertcheckup(checkup);
            }
        },
        error: function(xhr, status, error) {
            console.error("Check API Error:", error);
            alert("An error occurred while checking: " + error);
        }
    });
}

function insertcheckup(checkup) {
    let currentDateTimeString = getIndianDateTimeFormat(new Date());

    var requestData = {
        mcDesc: checkup,
        createdby: createdById,
        createddt: currentDateTimeString
    };

    $.ajax({
        url: new URL('/api/contractmedcheckup', baseUrl1).toString(),
        type: 'POST',
        xhrFields: {
            withCredentials: true
        },
        contentType: "application/json",     // <-- REQUIRED
        data: JSON.stringify(requestData),   // send JSON body
        success: function(response) {
            if (response && response.status === "Success") {
                showPopup("Inserted Successfully", "ContractMaster.jsp");
            } else {
                alert("Record not inserted. Please try again.");
            }
        },
        error: function(xhr, status, error) {
            console.error("Insert AJAX Error:", xhr.responseText || error);
            alert("An error occurred while inserting: " + error);
        }
    });
}


async function fetchcheckup() {
    const apiUrl = new URL('/api/contractmedcheckup', baseUrl1);

    try {
        const response = await fetch(apiUrl, { credentials: "include" });
        if (!response.ok) throw new Error("Failed to fetch medical checkups");

        const checkups = await response.json();
        let tableRows = '';

        for (let index = 0;index < checkups.length;index++) {
            const item = checkups[index];

            // 🔍 Check if this medical checkup is used
            const usedRes = await fetch(
                new URL(`/api/contractmedcheckup/is-used/${item.mcid}`, baseUrl1),
                { credentials: "include" }
            );
            const usedData = await usedRes.json();
            const isUsed = usedData.used;

            tableRows += `
                <tr id="${item.mcid}">
                    <td>${index + 1}</td>
                    <td>${item.mcDesc}</td>
                    <td>
                        ${isUsed
                    ? `<i class="fa fa-pen text-secondary" title="Medical Checkup already used"
                                  style="cursor:not-allowed; opacity:0.3;"></i>`
                    : `<i class="fa fa-pen text-muted cursor-pointer" title="Edit"
                                  onclick="editmcDesc(${item.mcid})"></i>`
                }
                    </td>
                </tr>
            `;
        }

        document.querySelector("#medicalTableID tbody").innerHTML = tableRows;

        if ($.fn.DataTable.isDataTable('#medicalTableID')) {
            $('#medicalTableID').DataTable().destroy();
        }

		$('#medicalTableID').DataTable({
		    dom: 'Bfrtip',
		    scrollX: false,
		    info: true,
		    paging: true,
		    pageLength: 10,
		    lengthMenu: [
		        [10, 25, 50, 100],
		        [10, 25, 50, 100]
		    ],
		    buttons: [{
		        extend: 'excel',
		        text: 'Export to Excel',
		        title: 'Medical Checkup List'
		    }]
		});

        $('.dt-buttons').css({ 'float': 'left', 'margin-right': '10px' });
        $('.dataTables_filter').css({ 'float': 'right', 'margin-bottom': '10px' });

    } catch (error) {
        console.error('Error fetching medical checkups:', error);
    }
}


let originalCheckupDesc = "";
function editmcDesc(mcid) {
	
	if (!hasPermission("Edit")) {

		           alert(`You do not have permission to Edit`);
				   return;
				   }
			   
			   
    fetch(new URL(`/api/contractmedcheckup/${mcid}`, baseUrl1), {
        credentials: "include"
    })
        .then(response => response.json())
        .then(data => {
            document.getElementById('checkup1').value = data.mcDesc || '';
            selectedcheckupid = data.mcid;
            originalCheckupDesc = data.mcDesc || ""; // store original for no-change detection
            $('#exampleModalScrollableMedicalupdate').modal('show');
        })
        .catch(error => {
            console.error('Error fetching checkup type for editing:', error);
            alert('Error fetching checkup type');
        });
}

async function checkupdate(mcid) {
    const mcDesc = document.getElementById('checkup1').value.trim();

    if (!mcDesc) {
        alert("Medical Checkup type cannot be empty");
        return;
    }

    if (mcDesc === originalCheckupDesc) {
        showPopup("No Change detected, Update is Skipped", "ContractMaster.jsp");
        return;
    }

    try {
        // Duplicate check
        const checkRes = await fetch(
            new URL(`/api/contractmedcheckup/check-update?mcDesc=${encodeURIComponent(mcDesc)}&mcId=${mcid}`, baseUrl1),
            { credentials: "include" }
        );
        const checkData = await checkRes.json();

        if (checkData.exists) {
            $('#duplicateMedicalModal').modal('show');
            return;
        }

        // Update
        const updatedcheckup = {
            mcDesc: mcDesc,
            updatedBy: createdById,
            updatedDate: getIndianDateTimeFormat(new Date())
        };

        const updateRes = await fetch(
            new URL(`/api/contractmedcheckup/${mcid}`, baseUrl1),
            {
                method: 'PUT',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedcheckup)
            }
        );

        if (updateRes.ok) {
            showPopup("Updated Successfully!", "ContractMaster.jsp");
            $('#exampleModalScrollableMedicalupdate').modal('hide');
            fetchcheckup();
        } else {
            const errorText = await updateRes.text();
            console.error("Update failed:", errorText);
            alert("Failed to update Medical Checkup type");
        }

    } catch (error) {
        console.error("Error updating Medical Checkup type:", error);
        alert("Error updating Medical Checkup type");
    }
}


$(document).ready(function() {
    // Create - "Submit" button click
    $("#createvaccinetype").click(function() {
        console.log("Create clicked - Modal will show");
        var vaccinetype = $('#vaccinetype').val().trim();
        if (!vaccinetype) {
            $('#vaccinetypeError').show();

        } else {
            $('#vaccinetypeError').hide();
            $("#exampleModalCenter300").modal("show");
        }





    });

    // Create - "No" button click
    $(".btn-secondary[data-dismiss='modal']").click(function() {
        console.log("No clicked - Modal will hide");
        $("#exampleModalCenter300").modal("hide");
    });

    // Create - "Yes" button click
    $(document).on("click", "#confirmvaccinetypeyes", function() {
        console.log("Yes clicked - Proceeding with creation");
        $("#exampleModalCenter300").modal("hide");
        vaccinetypeaddevent();
    });

    // Update - "Submit" button click
    $("#updvaccinetype1").click(function() {
        console.log("Update clicked - Modal will show");

        const vaccineDesc = document.getElementById('vaccinetype1').value.trim();

        if (!vaccineDesc) {
            $("#vaccinetype1Error").show();

        }
        else {
            $("#vaccinetype1Error").show();
            $("#exampleModalCenter301").modal("show");
        }

    });

    $("#cancelvaccinetype1modal").click(function() {
        console.log("No clicked - Modal will hide");
        $("#exampleModalCenter301").modal("hide");
    });


    // Update - "Yes" button click
    $(document).on("click", "#confirmvaccinetype1upd", function() {
        $("#exampleModalCenter301").modal("hide");
        if (selectedvaccinetypeid) {
            vaccinetypeupdate(selectedvaccinetypeid);
        } else {
            alert("Data not found for update.");
        }
    });

    // Fetch initial table
    fetchvaccinetype();
});

let selectedvaccinetypeid = null;  // Must store only ID

function vaccinetypeaddevent() {
    var vaccinetype = $('#vaccinetype').val().trim();
    if (!vaccinetype) {
        $('#vaccinetypeError').show();
        return;
    } else {
        $('#vaccinetypeError').hide();
        //$("#exampleModalCenter300").modal("show");
    }
    // Check if Register Type already exists
    $.ajax({
        url: new URL('/api/contractvaccine/check?VaccineDesc=' + encodeURIComponent(vaccinetype), baseUrl1),
        type: 'GET',
        xhrFields: {
            withCredentials: true  // <-- correct way
        },
        success: function(response) {
            if (response.exists) {
                // alert("Vaccine type already exists!");
                $("#duplicateVaccineModal").modal("show");
            } else {
                // Proceed to insert
                $("#duplicateVaccineModal").modal("hide");
                insertvaccinetype(vaccinetype);
            }
        },
        error: function(xhr, status, error) {
            console.error("Check API Error:", error);
            alert("An error occurred while checking: " + error);
        }
    });
}

function insertvaccinetype(vaccinetype) {
    let currentDateTimeString = getIndianDateTimeFormat(new Date());

    var requestData = {
        "vaccineDesc": vaccinetype,
        "createdby": createdById,
        "createddt": currentDateTimeString
    };

    $.ajax({
        url: new URL('/api/contractvaccine', baseUrl1),
        type: 'POST',
        xhrFields: {
            withCredentials: true
        },
        contentType: 'application/json',
        data: JSON.stringify(requestData),
        dataType: 'json',
        success: function(response) {
            if (response && response.status === "Success") {
                showPopup("Inserted Successfully", "ContractMaster.jsp");
            } else {
                alert("Record not inserted. Please try again.");
            }
        },
        error: function(xhr, status, error) {
            console.error("Insert AJAX Error:", error);
            alert("An error occurred while inserting: " + error);
        }
    });
}

async function fetchvaccinetype() {
    const apiUrl = new URL('/api/contractvaccine', baseUrl1);

    try {
        const response = await fetch(apiUrl, {
            method: "GET",
            credentials: "include"
        });

        if (!response.ok) throw new Error("Failed to fetch vaccine types");

        const vaccinetypes = await response.json();
        let tableRows = '';

        for (let index = 0;index < vaccinetypes.length;index++) {
            const item = vaccinetypes[index];

            // 🔍 Check if vaccine is used
            const usedRes = await fetch(
                new URL(`/api/contractvaccine/is-used/${item.vac_id}`, baseUrl1),
                { credentials: "include" }
            );

            const usedData = await usedRes.json();
            const isUsed = usedData.used;

            tableRows += `
                <tr id="${item.vac_id}">
                    <td>${index + 1}</td>
                    <td>${item.vaccineDesc}</td>
                    <td>
                        ${isUsed
                    ? `<i class="fa fa-pen text-secondary"
                                   title="Vaccine already used"
                                   style="cursor:not-allowed; opacity:0.3;"></i>`
                    : `<i class="fa fa-pen text-muted cursor-pointer"
                                   title="Edit"
                                   onclick="editvaccineDesc(${item.vac_id})"></i>`
                }
                    </td>
                </tr>
            `;
        }

        document.querySelector("#vaccineTableID tbody").innerHTML = tableRows;

        if ($.fn.DataTable.isDataTable('#vaccineTableID')) {
            $('#vaccineTableID').DataTable().destroy();
        }

		$('#vaccineTableID').DataTable({
		    dom: 'Bfrtip',
		    scrollX: false,
		    info: true,
		    paging: true,
		    pageLength: 10,
		    lengthMenu: [
		        [10, 25, 50, 100],
		        [10, 25, 50, 100]
		    ],
		    buttons: [{
		        extend: 'excel',
		        text: 'Export to Excel',
		        title: 'Vaccine List'
		    }]
		});

        $('.dt-buttons').css({ 'float': 'left', 'margin-right': '10px' });
        $('.dataTables_filter').css({ 'float': 'right', 'margin-bottom': '10px' });

    } catch (error) {
        console.error('Error fetching vaccine types:', error);
    }
}


let originalVaccineDesc = ""; // Store the original value when modal opens

function editvaccineDesc(vac_id) {
	if (!hasPermission("Edit")) {

	           alert(`You do not have permission to Edit`);
			   return;
			   }
    fetch(new URL(`/api/contractvaccine/${vac_id}`, baseUrl1), {
        credentials: "include"
    })
        .then(response => response.json())
        .then(data => {
            document.getElementById('vaccinetype1').value = data.vaccineDesc || '';
            selectedvaccinetypeid = data.vac_id;
            originalVaccineDesc = data.vaccineDesc || ""; // store original for no-change detection
            $('#exampleModalScrollableVaccineup').modal('show');
        })
        .catch(error => {
            console.error('Error fetching vaccine type for editing:', error);
            alert('Error fetching vaccine type');
        });
}

async function vaccinetypeupdate(vac_id) {
    const vaccineDesc = document.getElementById('vaccinetype1').value.trim();

    if (!vaccineDesc) {
        alert("Vaccine type cannot be empty");
        return;
    }

    // ❌ Check if value hasn't changed
    if (vaccineDesc === originalVaccineDesc) {
        showPopup("No Change detected,Update is Skipped", "ContractMaster.jsp");
        return;
    }

    try {
        // 🔍 Step 1: Check duplicate only if changed
        const checkRes = await fetch(
            new URL(`/api/contractvaccine/check-duplicate-update?VaccineDesc=${encodeURIComponent(vaccineDesc)}&vaccineId=${vac_id}`, baseUrl1),
            { credentials: "include" }
        );

        const checkData = await checkRes.json();

        if (checkData.exists) {
            // ❌ Duplicate found
            $('#duplicateVaccineModal').modal('show');
            return;
        }

        // ✅ Step 2: Proceed with update
        const updatedvaccinetype = {
            vaccineDesc: vaccineDesc,
            updatedBy: createdById,
            updatedDate: getIndianDateTimeFormat(new Date())
        };

        const updateRes = await fetch(
            new URL(`/api/contractvaccine/${vac_id}`, baseUrl1),
            {
                method: 'PUT',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedvaccinetype)
            }
        );

        if (updateRes.ok) {
            showPopup("Updated Successfully!", "ContractMaster.jsp");
            $('#exampleModalScrollableVaccineup').modal('hide');
            fetchvaccinetype();  // Refresh list
        } else {
            alert("Failed to update vaccine type");
        }

    } catch (error) {
        console.error("Error updating vaccine type:", error);
        alert("Error updating vaccine type");
    }
}

$(document).ready(function() {
    // Create - "Submit" button click
    $("#createbusname").click(function() {
        console.log("Create clicked - Modal will show");
        let busname = $("#busname").val().trim();
        if (!busname) {
            $("#busnameError").show();

        } else {

            $("#busnameError").hide();
            $("#exampleModalCenter299").modal("show");
        }
    });

    // Create - "No" button click
    $(".btn-secondary[data-dismiss='modal']").click(function() {
        console.log("No clicked - Modal will hide");
        $("#exampleModalCenter299").modal("hide");
    });

    // Create - "Yes" button click
    $(document).on("click", "#confirmbusnameyes", function() {
        console.log("Yes clicked - Proceeding with creation");
        $("#exampleModalCenter299").modal("hide");
        busnameaddevent();
    });

    // Update - "Submit" button click
    $("#updbusname").click(function() {
        console.log("Update clicked - Modal will show");
        $("#exampleModalCenter289").modal("show");
    });

    $("#cancelbusnamemodal").click(function() {
        console.log("No clicked - Modal will hide");
        $("#exampleModalCenter289").modal("hide");
    });


    // Update - "Yes" button click
    $(document).on("click", "#confirmbusnameupd", function() {
        $("#exampleModalCenter289").modal("hide");
        if (selectedbusnameid) {
            busnameupdate(selectedbusnameid);
        } else {
            alert("Data not found for update.");
        }
    });

    // Fetch initial table
    fetchbusname();
});

let selectedbusnameid = null;  // Must store only ID

function busnameaddevent() {
    var busname = $('#busname').val().trim();
    if (!busname) {
        $('#busnameError').show();
        return;
    } else {
        $('#busnameError').hide();
    }

    // Check if Register Type already exists
    $.ajax({
        url: new URL('/api/contractbus/check?busDesc=' + encodeURIComponent(busname), baseUrl1),
        type: 'GET',
        xhrFields: {
            withCredentials: true  // <-- correct way
        },
        success: function(response) {
            if (response.exists) {
                //  alert("Bus name already exists!");
                $("#duplicateBusModal").modal("show");
            } else {
                // Proceed to insert
                insertBusname(busname);
            }
        },
        error: function(xhr, status, error) {
            console.error("Check API Error:", error);
            alert("An error occurred while checking: " + error);
        }
    });
}

function insertBusname(busname) {
    let currentDateTimeString = getIndianDateTimeFormat(new Date());

    var requestData = {
        "busDesc": busname,
        "createdby": createdById,
        "createddt": currentDateTimeString
    };

    $.ajax({
        url: new URL('/api/contractbus', baseUrl1),
        type: 'POST',
        xhrFields: {
            withCredentials: true
        },
        contentType: 'application/json',
        data: JSON.stringify(requestData),
        dataType: 'json',
        success: function(response) {
            if (response && response.status === "Success") {
                showPopup("Inserted Successfully", "ContractMaster.jsp");
            } else {
                alert("Record not inserted. Please try again.");
            }
        },
        error: function(xhr, status, error) {
            console.error("Insert AJAX Error:", error);
            alert("An error occurred while inserting: " + error);
        }
    });
}

async function fetchbusname() {
    const apiUrl = new URL('/api/contractbus', baseUrl1);

    try {
        const response = await fetch(apiUrl, {
            method: "GET",
            credentials: "include"
        });

        if (!response.ok) throw new Error("Failed to fetch bus names");

        const busnames = await response.json();
        let tableRows = '';

        for (let index = 0;index < busnames.length;index++) {
            const item = busnames[index];

            // 🔍 check if bus is used
            const usedRes = await fetch(
                new URL(`/api/contractbus/is-used/${item.busId}`, baseUrl1),
                { credentials: "include" }
            );

            const usedData = await usedRes.json();
            const isUsed = usedData.used;

            tableRows += `
                <tr id="${item.busId}">
                    <td>${index + 1}</td>
                    <td>${item.busDesc}</td>
                    <td>
                        ${isUsed
                    ? `<i class="fa fa-pen text-secondary"
                                   title="Bus already used"
                                   style="cursor:not-allowed; opacity:0.3;"></i>`
                    : `<i class="fa fa-pen text-muted cursor-pointer"
                                   title="Edit"
                                   onclick="editbusDesc(${item.busId})"></i>`
                }
                    </td>
                </tr>
            `;
        }

        document.querySelector("#bustableID tbody").innerHTML = tableRows;

        if ($.fn.DataTable.isDataTable('#bustableID')) {
            $('#bustableID').DataTable().destroy();
        }

		$('#bustableID').DataTable({
		    dom: 'Bfrtip',
		    scrollX: false,
		    info: true,
		    paging: true,
		    pageLength: 10,
		    lengthMenu: [
		        [10, 25, 50, 100],
		        [10, 25, 50, 100]
		    ],
		    buttons: [{
		        extend: 'excel',
		        text: 'Export to Excel',
		        title: 'Bus List'
		    }]
		});
        $('.dt-buttons').css({ 'float': 'left', 'margin-right': '10px' });
        $('.dataTables_filter').css({ 'float': 'right', 'margin-bottom': '10px' });

    } catch (error) {
        console.error('Error fetching bus names:', error);
    }
}


let originalBusDesc = ""; // Global variable to store the original value

function editbusDesc(busId) {
	if (!hasPermission("Edit")) {

	           alert(`You do not have permission to Edit`);
			   return;
			   }
	
	
    fetch(new URL(`/api/contractbus/${busId}`, baseUrl1), {
        credentials: "include"
    })
        .then(response => response.json())
        .then(data => {
            document.getElementById('busname1').value = data.busDesc || '';
            selectedbusnameid = data.busId;      // Store the ID
            originalBusDesc = data.busDesc || ''; // Store the original value
            $('#exampleModalScrollableBusUp').modal('show');
        })
        .catch(error => {
            console.error('Error fetching bus name for editing:', error);
            alert('Error fetching bus name');
        });
}

async function busnameupdate(busId) {
    const busDesc = document.getElementById('busname1').value.trim();

    if (!busDesc) {
        alert("Bus name cannot be empty");
        return;
    }

    // ❌ Check if the value hasn't changed
    if (busDesc === originalBusDesc) {
        showPopup("No Change Detected,Updated is skipped", "ContractMaster.jsp");
        return;
    }

    try {
        // 🔍 Step 1: Check duplicate only if changed
        const checkRes = await fetch(
            new URL(`/api/contractbus/check-update?busDesc=${encodeURIComponent(busDesc)}&busId=${busId}`, baseUrl1),
            { credentials: "include" }
        );

        const checkData = await checkRes.json();

        if (checkData.exists) {
            // ❌ Duplicate found
            $('#duplicateBusModal').modal('show');
            return;
        }

        // ✅ Step 2: Proceed with update
        const updatedbusname = {
            busDesc: busDesc,
            updatedBy: createdById,
            updatedDate: getIndianDateTimeFormat(new Date())
        };

        const updateRes = await fetch(
            new URL(`/api/contractbus/${busId}`, baseUrl1),
            {
                method: 'PUT',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedbusname)
            }
        );

        if (updateRes.ok) {
            showPopup("Updated Successfully!", "ContractMaster.jsp");
            $('#exampleModalScrollableBusUp').modal('hide');
            fetchbusname();
        } else {
            alert("Failed to update bus name");
        }

    } catch (error) {
        console.error("Error updating bus name:", error);
        alert("Error updating bus name");
    }
}



$(document).ready(function() {
    // Create - "Submit" button click
    $("#createworklocation").click(function() {
        console.log("Create clicked - Modal will show");

        let worklocation = $("#worklocation").val().trim();
        if (!worklocation) {
            $("#worklocationError").show();
            return;
        }
        else {

            $("#worklocationError").hide();

            $("#exampleModalCenter185").modal("show");
        }
    });

    // Create - "No" button click
    $(".btn-secondary[data-dismiss='modal']").click(function() {
        console.log("No clicked - Modal will hide");
        $("#exampleModalCenter185").modal("hide");
    });

    // Create - "Yes" button click
    $(document).on("click", "#confirmworklocationYes", function() {
        console.log("Yes clicked - Proceeding with creation");
        $("#exampleModalCenter185").modal("hide");
        worklocationaddevent();
    });

    // Update - "Submit" button click
    $("#workupd").click(function() {
        console.log("Update clicked - Modal will show");

        let worklocation1 = $("#worklocation1").val().trim();
        if (!worklocation1) {
            $("#worklocation1Error").show();
        }
        else {
            $("#worklocation1Error").hide();
            $("#exampleModalCenter186").modal("show");
        }
    });

    $("#cancelworklocation1modal").click(function() {
        console.log("No clicked - Modal will hide");
        $("#exampleModalCenter186").modal("hide");
    });


    // Update - "Yes" button click
    $(document).on("click", "#confirmworklocation1upd", function() {
        $("#exampleModalCenter186").modal("hide");
        if (selectedworklocationid) {
            worklocationcupdate(selectedworklocationid);
        } else {
            alert("Data not found for update.");
        }
    });

    // Fetch initial table
    fetchworklocation();
});

let selectedworklocationid = null;  // Must store only ID

function worklocationaddevent() {
    var worklocation = $('#worklocation').val().trim();
    if (!worklocation) {
        $('#worklocationError').show();
        return;
    } else {
        $('#worklocationError').hide();
    }

    // Check if Register Type already exists
    $.ajax({
        url: new URL('/api/contractworklocation/check?wlDesc=' + encodeURIComponent(worklocation), baseUrl1),
        type: 'GET',
        xhrFields: {
            withCredentials: true  // <-- correct way
        },
        success: function(response) {
            if (response.exists) {
                //alert("Work location already exists!");
                $("#duplicateWorkLocationModal").modal("show");
            } else {
                // Proceed to insert
                $("#duplicateWorkLocationModal").modal("hide");
                insertWorklocation(worklocation);
            }
        },
        error: function(xhr, status, error) {
            console.error("Check API Error:", error);
            alert("An error occurred while checking: " + error);
        }
    });
}

function insertWorklocation(worklocation) {
    let currentDateTimeString = getIndianDateTimeFormat(new Date());

    var requestData = {
        "wldesc": worklocation,
        "createdby": createdById,
        "createddt": currentDateTimeString
    };

    $.ajax({
        url: new URL('/api/contractworklocation', baseUrl1),
        type: 'POST',
        xhrFields: {
            withCredentials: true
        },
        contentType: 'application/json',
        data: JSON.stringify(requestData),
        dataType: 'json',
        success: function(response) {
            if (response && response.status === "Success") {
                showPopup("Inserted Successfully", "ContractMaster.jsp");
            } else {
                alert("Record not inserted. Please try again.");
            }
        },
        error: function(xhr, status, error) {
            console.error("Insert AJAX Error:", error);
            alert("An error occurred while inserting: " + error);
        }
    });
}

async function fetchworklocation() {
    const apiUrl = new URL('/api/contractworklocation', baseUrl1);

    try {
        const response = await fetch(apiUrl, {
            method: "GET",
            credentials: "include"
        });

        if (!response.ok) throw new Error("Failed to fetch work locations");

        const worklocations = await response.json();
        let tableRows = '';

        for (let index = 0;index < worklocations.length;index++) {
            const item = worklocations[index];

            // 🔍 check if work location is used
            const usedRes = await fetch(
                new URL(`/api/contractworklocation/is-used/${item.wl_id}`, baseUrl1),
                { credentials: "include" }
            );

            const usedData = await usedRes.json();
            const isUsed = usedData.used;

            tableRows += `
                <tr id="${item.wl_id}">
                    <td>${index + 1}</td>
                    <td>${item.wldesc}</td>
                    <td>
                        ${isUsed
                    ? `<i class="fa fa-pen text-secondary"
                                   title="Work Location already used"
                                   style="cursor:not-allowed; opacity:0.3;"></i>`
                    : `<i class="fa fa-pen text-muted cursor-pointer"
                                   title="Edit"
                                   onclick="editworklocation(${item.wl_id})"></i>`
                }
                    </td>
                </tr>
            `;
        }

        document.querySelector("#worktableID tbody").innerHTML = tableRows;

        if ($.fn.DataTable.isDataTable('#worktableID')) {
            $('#worktableID').DataTable().destroy();
        }

		$('#worktableID').DataTable({
		    dom: 'Bfrtip',
		    scrollX: false,
		    info: true,
		    paging: true,
		    pageLength: 10,
		    lengthMenu: [
		        [10, 25, 50, 100],
		        [10, 25, 50, 100]
		    ],
		    buttons: [{
		        extend: 'excel',
		        text: 'Export to Excel',
		        title: 'Work Location List'
		    }]
		});

        $('.dt-buttons').css({ 'float': 'left', 'margin-right': '10px' });
        $('.dataTables_filter').css({ 'float': 'right', 'margin-bottom': '10px' });

    } catch (error) {
        console.error('Error fetching work locations:', error);
    }
}

function editworklocation(wl_id) {
	
	
	if (!hasPermission("Edit")) {

	           alert(`You do not have permission to Edit`);
			   return;
			   }
    fetch(new URL(`/api/contractworklocation/${wl_id}`, baseUrl1), {
        credentials: "include"
    })
        .then(response => response.json())
        .then(data => {
            document.getElementById('worklocation1').value = data.wldesc || '';
            document.getElementById('worklocation1').setAttribute('data-original', data.wldesc || ''); // store original
            selectedworklocationid = data.wl_id;  // Only store the ID properly
            $('#exampleModalScrollableWorkUp').modal('show');
        })
        .catch(error => {
            console.error('Error fetching work location for editing:', error);
            alert('Error fetching work location');
        });
}

function worklocationcupdate() {
    const wlDesc = document.getElementById('worklocation1').value.trim();
    const originalDesc = document.getElementById('worklocation1').getAttribute('data-original') || '';

    if (!wlDesc) {
        alert("Work Location cannot be empty");
        return;
    }

    // 🔹 Step 1: Check if value changed
    if (wlDesc === originalDesc) {
        //alert("No changes made.");
        showPopup("No Feilds Changes", "ContractMaster.jsp");
        return;
    }

    // 🔹 Step 2: Check duplicate
    fetch(new URL(`/api/contractworklocation/check?wlDesc=${encodeURIComponent(wlDesc)}`, baseUrl1), {
        credentials: "include"
    })
        .then(response => response.json())
        .then(result => {
            if (result.exists) {
                // 🔴 Duplicate found → show modal
                $('#duplicateWorkLocationModal').modal('show');
                return;
            }

            // ✅ Step 3: No duplicate → proceed with update
            const updatedworklocation = {
                wldesc: wlDesc,
                updatedBy: createdById,
                updatedDate: getIndianDateTimeFormat(new Date())
            };

            return fetch(new URL(`/api/contractworklocation/${selectedworklocationid}`, baseUrl1), {
                method: 'PUT',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedworklocation)
            });
        })
        .then(response => {
            if (!response) return; // stopped due to duplicate

            if (response.ok) {
                showPopup("Updated Successfully!", "ContractMaster.jsp");
                $('#exampleModalScrollableWorkUp').modal('hide');
                fetchworklocation(); // refresh list
            } else {
                alert('Failed to update work location');
            }
        })
        .catch(error => {
            console.error('Error updating work location:', error);
            alert('Error updating work location');
        });
}

$(document).ready(function() {
    // Create - "Submit" button click
    $("#createnatureofjob").click(function() {
        console.log("Create clicked - Modal will show");
        natureofjobaddevent();
        // $("#exampleModalCenter120").modal("show");
    });

    // Create - "No" button click
    $(".btn-secondary[data-dismiss='modal']").click(function() {
        console.log("No clicked - Modal will hide");
        $("#exampleModalCenter120").modal("hide");
    });

    // Create - "Yes" button click


    $("#natureupd").click(function() {
        console.log("Update clicked");

        // ✅ Read value from input field
        const nojDesc = $('#naturejob1').val().trim();

        // ❌ If empty → show error & stop
        if (!nojDesc) {
            $('#naturejob1Error').show();
            return;   // ⛔ stop here
        }

        // ✅ If value exists → hide error & proceed
        $('#naturejob1Error').hide();

        // Show confirmation modal
        $("#exampleModalCenter175").modal("show");
    });

    $("#cancelnaturejob1modal").click(function() {
        console.log("No clicked - Modal will hide");
        $("#exampleModalCenter175").modal("hide");
    });


    // Update - "Yes" button click
    $(document).on("click", "#confirmnaturejob1upd", function() {
        $("#exampleModalCenter175").modal("hide");
        if (selectednatureid) {
            natureofjobupdate(selectednatureid);
        } else {
            alert("Data not found for update.");
        }
    });

    // Fetch initial table
    fetchnaturejob();
});

let selectednatureid = null;  // Must store only ID

function natureofjobaddevent() {
    var naturejob = $('#naturejob').val().trim();
    if (!naturejob) {
        $('#naturejobError').show();
        return;
    } else {
        $('#naturejobError').hide();
    }


    $(document).on("click", "#confirmnaturejobYes", function() {
        console.log("Yes clicked - Proceeding with creation");
        insertNatureofjob(naturejob);
        //  $("#exampleModalCenter120").modal("hide");

    });
    // Check if Register Type already exists
    $.ajax({
        url: new URL('/api/natureofjob/check?nojDesc=' + encodeURIComponent(naturejob), baseUrl1),
        type: 'GET',
        xhrFields: {
            withCredentials: true  // <-- correct way
        },
        success: function(response) {
            if (response.exists) {
                $("#duplicateNatureModal").modal("show");
            } else {
                // Proceed to insert
                $("#exampleModalCenter120").modal("show");
            }
        },
        error: function(xhr, status, error) {
            console.error("Check API Error:", error);
            alert("An error occurred while checking: " + error);
        }
    });
}

function insertNatureofjob(naturejob) {
    let currentDateTimeString = getIndianDateTimeFormat(new Date());

    var requestData = {
        "nojDesc": naturejob,
        "createdby": createdById,
        "createddt": currentDateTimeString
    };

    $.ajax({
        url: new URL('/api/natureofjob', baseUrl1),
        type: 'POST',
        xhrFields: {
            withCredentials: true
        },
        contentType: 'application/json',
        data: JSON.stringify(requestData),
        dataType: 'json',
        success: function(response) {
            if (response && response.status === "Success") {
                showPopup("Inserted Successfully", "ContractMaster.jsp");
                $("#exampleModalCenter120").modal("hide");
            } else {
                alert("Record not inserted. Please try again.");
            }
        },
        error: function(xhr, status, error) {
            console.error("Insert AJAX Error:", error);
            alert("An error occurred while inserting: " + error);
        }
    });
}


async function fetchnaturejob() {
    const apiUrl = new URL('/api/natureofjob', baseUrl1);

    try {
        const response = await fetch(apiUrl, {
            method: "GET",
            credentials: "include"
        });

        if (!response.ok) throw new Error("Failed to fetch nature of jobs");

        const natureofjobs = await response.json();
        let tableRows = '';

        for (let index = 0;index < natureofjobs.length;index++) {
            const item = natureofjobs[index];

            // 🔍 check if this nature of job is used
            const usedRes = await fetch(
                new URL(`/api/natureofjob/is-used/${item.noj_id}`, baseUrl1),
                { credentials: "include" }
            );
            const usedData = await usedRes.json();

            const isUsed = usedData.used;

            tableRows += `
                <tr id="${item.noj_id}">
                    <td>${index + 1}</td>
                    <td>${item.nojDesc}</td>
					<td>
					    ${isUsed
                    ? `<i class="fa fa-pen text-secondary"
					               title="Nature of Job already used"
					               style="cursor:not-allowed; opacity:0.3;"></i>`
                    : `<i class="fa fa-pen text-muted cursor-pointer"
					               title="Edit"
					               onclick="editnaturejob(${item.noj_id})"></i>`
                }
					</td>
                </tr>
            `;
        }

        document.querySelector("#naturetableID tbody").innerHTML = tableRows;

        if ($.fn.DataTable.isDataTable('#naturetableID')) {
            $('#naturetableID').DataTable().destroy();
        }

		$('#naturetableID').DataTable({
		    dom: 'Bfrtip',
		    scrollX: false,
		    info: true,
		    paging: true,
		    pageLength: 10,
		    lengthMenu: [
		        [10, 25, 50, 100],
		        [10, 25, 50, 100]
		    ],
		    buttons: [{
		        extend: 'excel',
		        text: 'Export to Excel',
		        title: 'Nature of Job List'
		    }]
		});

    } catch (error) {
        console.error('Error fetching nature of jobs:', error);
    }
}

function natureofjobupdate() {
    const desc = document.getElementById('naturejob1').value.trim();

    if (!desc) {
        alert("Nature of Job cannot be empty");
        return;
    }

    // 🔍 CHECK IF VALUE CHANGED
    const currentDesc = document.getElementById('naturejob1').getAttribute('data-original') || '';
    if (desc === currentDesc) {
        //alert("No changes made.");
        showPopup("No Feilds Changes", "ContractMaster.jsp");
        return;
    }

    // 🔍 CHECK DUPLICATE BEFORE UPDATE
    fetch(new URL(
        `/api/natureofjob/check-update?nojDesc=${encodeURIComponent(desc)}&id=${selectednatureid}`,
        baseUrl1
    ), {
        credentials: 'include'
    })
        .then(res => res.json())
        .then(data => {
            if (data.exists) {
                // ❌ Duplicate found → show modal
                $('#duplicateNatureModal').modal('show');
            } else {
                // ✅ No duplicate → proceed update
                updateNatureOfJob(desc);
            }
        })
        .catch(err => {
            console.error('Duplicate check failed:', err);
            alert('Error while checking duplicate');
        });
}

function editnaturejob(noj_id) {

	if (!hasPermission("Edit")) {

	           alert(`You do not have permission to Edit`);
			   return;
			   }
	
	
    fetch(new URL(`/api/natureofjob/${noj_id}`, baseUrl1), {
        credentials: "include"
    })
        .then(response => response.json())
        .then(data => {
            document.getElementById('naturejob1').value = data.nojDesc || '';
            document.getElementById('naturejob1').setAttribute('data-original', data.nojDesc || ''); // store original
            selectednatureid = data.noj_id;   // store ID
            $('#exampleModalScrollableNatureUp').modal('show');
        })
        .catch(error => {
            console.error('Error fetching nature of job:', error);
            alert('Error fetching nature of job');
        });
}

function updateNatureOfJob(desc) {
    const payload = {
        nojDesc: desc,
        updatedBy: createdById,
        updatedDate: getIndianDateTimeFormat(new Date())
    };

    fetch(new URL(`/api/natureofjob/${selectednatureid}`, baseUrl1), {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    })
        .then(response => {
            if (!response.ok) throw new Error("Update failed");
            return response.text();
        })
        .then(() => {
            showPopup("Updated Successfully!", "ContractMaster.jsp");
            $('#exampleModalScrollableNatureUp').modal('hide');
            fetchnaturejob();
        })
        .catch(error => {
            console.error('Error updating nature of job:', error);
            alert('Error updating nature of job');
        });
}


function validateForm() {
    let isValid = true;

    const safe = id => ($("#" + id).val() || "").trim();

    let name = safe("name");
    let last = safe("last");
    let contact = safe("contact_no");
    let department = safe("department");
    let designation = safe("designation");
    let birth = safe("birth");
    let age = safe("age");
    let gender = safe("gender");
    let blood = safe("blood");
    let nature = safe("nature");
    let work = safe("work");
    let joining = safe("joining");
    let services = safe("services");
    let valid = safe("valid");
    let reEntry = safe("re-entry");
    let card = safe("card");
    let UAN = safe("UAN");
    let PF_No = safe("PF_No");
    let ESIC = safe("ESIC");
    let bank = safe("bank");
    let ac = safe("ac");
    let branch = safe("branch");
    let IFSC = safe("IFSC");
    let joineeType = $("#Joinee").val();

    // ── Detect nature of job ──────────────────────────────────────────
    const nojDesc = getSelectedNojDesc('nature'); // 'MBC', 'JBC', 'ATS', or ''

    function checkField(value, errorId) {
        if (value === "") {
            $("#" + errorId).show();
            isValid = false;
        } else {
            $("#" + errorId).hide();
        }
    }

    // Always required
    checkField(name, "nameError");
    checkField(last, "lastError");
    checkField(contact, "contact_noError");
    checkField(department, "departmentError");
    checkField(designation, "designationError");
    checkField(birth, "birthError");
    checkField(age, "ageError");
    checkField(gender, "genderError");
    checkField(blood, "bloodError");
    checkField(nature, "natureError");
    checkField(work, "workError");
    checkField(joining, "joiningError");
    checkField(valid, "validError");
    checkField(bank, "bankError");
    checkField(ac, "acError");
    checkField(branch, "branchError");
    checkField(IFSC, "IFSCError");

    // ── PAN — mandatory for MBC only ─────────────────────────────────
    if (nojDesc === 'MBC') {
        if (card === "") {
            $("#cardError").text("PAN Card is required for MBC").show();
            isValid = false;
        } else if (card.length !== 10) {
            $("#cardError").text("PAN No must be 10 characters").show();
            isValid = false;
        } else {
            $("#cardError").hide();
        }
    } else {
        // JBC / ATS — optional but validate length if provided
        if (card !== "" && card.length !== 10) {
            $("#cardError").text("PAN No must be 10 characters").show();
            isValid = false;
        } else {
            $("#cardError").hide();
        }
    }

    // ── PF, UAN, ESIC — compulsory for MBC & JBC, optional for ATS ──
    if (nojDesc === 'MBC' || nojDesc === 'JBC') {
        // UAN — exactly 12 digits
        if (UAN === "") {
            $("#UANError").text("UAN No is required").show();
            isValid = false;
        } else if (!/^\d{12}$/.test(UAN)) {
            $("#UANError").text("UAN must be exactly 12 digits").show();
            isValid = false;
        } else {
            $("#UANError").hide();
        }

        // PF — 1 to 22 alphanumeric
        if (PF_No === "") {
            $("#PF_NoError").text("PF No is required").show();
            isValid = false;
        } else if (PF_No.length !== 22) {
            $("#PF_NoError").text("PF No must be exactly  22 characters").show();
            isValid = false;
        } else {
            $("#PF_NoError").hide();
        }

        // ESIC — exactly 17 digits
        if (ESIC === "") {
            $("#ESICError").text("ESIC No is required").show();
            isValid = false;
        } else if (!/^\d{10}$/.test(ESIC)) {
            $("#ESICError").text("ESIC No must be exactly 10 digits").show();
            isValid = false;
        } else {
            $("#ESICError").hide();
        }

    } else if (nojDesc === 'ATS') {
        // ATS — optional with format check only
		$("#UANError, #PF_NoError, #ESICError").hide();

    } else {
        // No nature selected yet — hide all three errors, they'll be checked once nature is picked
        $("#UANError, #PF_NoError, #ESICError").hide();
    }

    // ── Contact ───────────────────────────────────────────────────────
    if (contact.length !== 10 || !/^\d{10}$/.test(contact)) {
        $("#contact_noError").text("Contact No must be 10 digits").show();
        isValid = false;
    }

    // ── Age ──────────────────────────────────────────────────────────
    if (parseInt(age) < 18) {
        $("#ageError").text("Age must be 18 or above").show();
        isValid = false;
    }

    // ── Rejoinee conditional fields ───────────────────────────────────
    $("#re-entryError, #servicesError").hide();

    if (joineeType === "2") {
        if (services === "") {
            $("#servicesError").show();
            isValid = false;
        }
        if (reEntry === "") {
            $("#re-entryError").text("Re-Entry date is required").show();
            isValid = false;
        }
    } else {
        $("#re-entryError, #servicesError").hide();
    }

    return isValid;
}



// Attach to button
document.getElementById("btnnext").addEventListener("click", function() {

    console.log(validateForm());
    if (validateForm()) {
        document.getElementById("container2").style.display = "block";
    } else {
        // Optionally scroll to the first error
        // const firstError = document.querySelector("span[style*='block']");
        //  if (firstError) firstError.scrollIntoView({ behavior: "smooth" });

        document.getElementById("container2").style.display = "none";
    }
});


function validateForm1() {
    let isValid = true;

    const fields = [
        { id: "nominee", error: "nomineeError" },
        { id: "nomineedate", error: "nomineedateError" },
        { id: "nomineeage", error: "nomineeageError" },
        { id: "relationship", error: "relationshipError" },
        { id: "total", error: "totalError" }

    ];

    fields.forEach(f => {
        const input = document.getElementById(f.id);
        const msg = document.getElementById(f.error);

        if (input.value.trim() === "") {
            msg.style.display = "block";
            isValid = false;
        } else {
            msg.style.display = "none";
        }
    });

    return isValid;
}

function validateForm2() {
    let isValid = true;

    const fields = [
        { id: "father", error: "fatherError" },
        { id: "marital", error: "maritalError" },
        { id: "emergency", error: "emergencyError" },
        { id: "relation", error: "relationError" },
        { id: "emergencyno", error: "emergencynoError" },
        { id: "religion", error: "religionError" },
        { id: "education", error: "educationError" },

        { id: "present", error: "presentError" },
        { id: "permanent", error: "permanentError" },
        { id: "state", error: "stateError" },
        { id: "district", error: "districtError" },
        { id: "pin", error: "pinError" },
        { id: "state1", error: "state1Error" },
        { id: "district1", error: "district1Error" },
        { id: "code", error: "codeError" }

    ];

    // Validate normal fields
    fields.forEach(f => {
        const input = document.getElementById(f.id);
        const msg = document.getElementById(f.error);

        if (input.value.trim() === "") {
            msg.style.display = "block";
            isValid = false;
        } else {
            msg.style.display = "none";
        }
    });

    // Emergency contact number validation
    let emergencyno = $("#emergencyno").val().trim();
    if (emergencyno.length !== 10 || !/^\d{10}$/.test(emergencyno)) {
        $("#emergencynoError").text("Emergency Contact No must be 10 digits").show();
        isValid = false;
    } else {
        $("#emergencynoError").hide();
    }

    // Present Pin Code
    let prespin = $("#code").val().trim();
    if (prespin.length !== 6 || !/^\d{6}$/.test(prespin)) {
        $("#codeError").text("Present Pin Code must be 6 digits").show();
        isValid = false;
    } else {
        $("#codeError").hide();
    }

    // Permanent Pin Code
    let perpin = $("#pin").val().trim();
    if (perpin.length !== 6 || !/^\d{6}$/.test(perpin)) {
        $("#pinError").text("Permanent Pin Code must be 6 digits").show();
        isValid = false;
    } else {
        $("#pinError").hide();
    }

    // Conditional validation: Spouse name only if Married
    const marital = document.getElementById("marital").value;
    const spouseInput = document.getElementById("spouse");
    const spouseMsg = document.getElementById("spouseError");

    if (marital === "1") { // Married
        if (spouseInput.value.trim() === "") {
            spouseMsg.style.display = "block";
            isValid = false;
        } else {
            spouseMsg.style.display = "none";
        }
    } else {
        // Not married: hide error & clear field
        spouseMsg.style.display = "none";
        spouseInput.value = "";
    }
    const adharupload = document.getElementById('adharfile');

    if (!adharupload || !adharupload.files || adharupload.files.length === 0) {
        $("#adharfileError").show();
        return;
    } else {
        $("#adharfileError").hide();
    }


    const medicalUpload = document.getElementById('medicalfile');
    const otherUpload = document.getElementById('otherfile');
    const isAadharValid = validatePDF(adharupload, "adharfileError");
    const isMedicalValid = validatePDF(medicalUpload, "medicalfileError");
    const isOtherValid = validatePDF(otherUpload, "otherfileError");
    if (!isAadharValid || !isMedicalValid || !isOtherValid) {
        return;
    }

    return isValid;
}


// "Create" button click
document.getElementById("createcontractGPentry").addEventListener("click", function(e) {
    e.preventDefault(); // Prevent form submission

    const isValid = validateForm2();
    const panel3 = document.getElementById("container3");
    console.log(isValid);

    if (isValid) {
        console.log("Create clicked - Modal will show");
        $("#exampleModalCenter310").modal("show");
    } else {
        console.log("Validation failed - showing errors and keeping panel3 visible");
        panel3.style.display = "block"; // Make sure container3 is visible

        // Scroll to the first visible error
        const errors = document.querySelectorAll("div.text-danger");
        for (let i = 0;i < errors.length;i++) {
            if (errors[i].style.display === "block") {
                errors[i].scrollIntoView({ behavior: "smooth" });
                break;
            }
        }
    }
});

// “Next” button
document.getElementById("btnnext1").addEventListener("click", function(e) {
    e.preventDefault();                       // stop any default submit/refresh
    const panel3 = document.getElementById("container3");

    if (validateForm1()) {
        panel3.style.display = "block";      // all good – reveal next panel
    } else {
        panel3.style.display = "none";       // keep it hidden on error
        const firstError = document.querySelector("div.text-danger[style*='block']");
        if (firstError) firstError.scrollIntoView({ behavior: "smooth" });
    }
});


async function fetchbloodgrp() {
    const apiUrl = new URL('/api/contractbloodgroup', baseUrl1);

    try {
        const res = await fetch(apiUrl, {
            method: "GET",
            credentials: "include"   // Send the session cookie automatically
        });

        if (!res.ok) throw new Error('Failed to fetch blood groups');

        const bloodgroups = await res.json();   // e.g. [{ blId: 1, blg: "A+" }, …]

        // ‑‑‑‑‑ add options to the SELECT, not the table ‑‑‑‑‑
        const ddl = document.getElementById('blood');
        const ddl1 = document.getElementById('blood1');
        ddl.length = 1;                         // keep only the “Select” placeholder
        ddl1.length = 1;
        bloodgroups.forEach(bg => {
            const opt = document.createElement('option');
            opt.value = bg.blId;
            opt.textContent = bg.blg;
            ddl.appendChild(opt);
            const opt1 = document.createElement('option');
            opt1.value = bg.blId;
            opt1.textContent = bg.blg;
            ddl1.appendChild(opt1);
        });

    } catch (err) {
        console.error('Error fetching blood groups:', err);
    }
}

async function fetchnatureofjob() {
    const apiUrl = new URL('/api/natureofjob', baseUrl1);

    try {
        const res = await fetch(apiUrl, {
            method: "GET",
            credentials: "include"   // Send the session cookie automatically
        });

        if (!res.ok) throw new Error('Failed to fetch nature of jobs');

        const natureofjobs = await res.json();   // e.g. [{ blId: 1, blg: "A+" }, …]

        // ‑‑‑‑‑ add options to the SELECT, not the table ‑‑‑‑‑
        const ddl = document.getElementById('nature');
        const ddl1 = document.getElementById('nature1');
        ddl.length = 1;
        ddl1.length = 1;
        natureofjobs.forEach(nh => {
            const opt = document.createElement('option');
            opt.value = nh.noj_id;
            opt.textContent = nh.nojDesc;
            ddl.appendChild(opt);
            const opt1 = document.createElement('option');
            opt1.value = nh.noj_id;
            opt1.textContent = nh.nojDesc;
            ddl1.appendChild(opt1);
        });

    } catch (err) {
        console.error('Error fetching nature of jobs:', err);
    }
}

async function fetchworkloc() {
    const apiUrl = new URL('/api/contractworklocation', baseUrl1);

    try {
        const res = await fetch(apiUrl, {
            method: "GET",
            credentials: "include"   // Send the session cookie automatically
        });

        if (!res.ok) throw new Error('Failed to fetch work locations');

        const worklocations = await res.json();   // e.g. [{ blId: 1, blg: "A+" }, …]

        // ‑‑‑‑‑ add options to the SELECT, not the table ‑‑‑‑‑
        const ddl = document.getElementById('work');
        const ddl1 = document.getElementById('work1');
        ddl.length = 1;
        ddl1.length = 1;
        worklocations.forEach(wh => {
            const opt = document.createElement('option');
            opt.value = wh.wl_id;
            opt.textContent = wh.wldesc;
            ddl.appendChild(opt);
            const opt1 = document.createElement('option');
            opt1.value = wh.wl_id;
            opt1.textContent = wh.wldesc;
            ddl1.appendChild(opt1);
        });

    } catch (err) {
        console.error('Error fetching work locations:', err);
    }
}

async function fetchbloodgrp1() {
    const apiUrl = new URL('/api/contractbloodgroup', baseUrl1);

    try {
        const res = await fetch(apiUrl, {
            method: "GET",
            credentials: "include"   // Send the session cookie automatically
        });

        if (!res.ok) throw new Error('Failed to fetch blood groups');

        const bloodgrps = await res.json();   // e.g. [{ blId: 1, blg: "A+" }, …]

        // ‑‑‑‑‑ add options to the SELECT, not the table ‑‑‑‑‑
        const ddl = document.getElementById('blood_grp');
        ddl.length = 1;

        bloodgrps.forEach(bg => {
            const opt = document.createElement('option');
            opt.value = bg.blId;
            opt.textContent = bg.blg;
            ddl.appendChild(opt);
        });

    } catch (err) {
        console.error('Error fetching blood groups:', err);
    }
}

async function fetchreligon() {
    const apiUrl = new URL('/api/religion', baseUrl1);

    try {
        const res = await fetch(apiUrl, {
            method: "GET",
            credentials: "include"   // Send the session cookie automatically
        });

        if (!res.ok) throw new Error('Failed to fetch religions');

        const religions = await res.json();   // e.g. [{ blId: 1, blg: "A+" }, …]

        // ‑‑‑‑‑ add options to the SELECT, not the table ‑‑‑‑‑
        const ddl = document.getElementById('religion');
        const ddl1 = document.getElementById('religion1');
        ddl.length = 1;
        ddl1.length = 1;
        religions.forEach(ri => {
            const opt = document.createElement('option');
            opt.value = ri.reliId;
            opt.textContent = ri.religionDesc;
            ddl.appendChild(opt);
            const opt1 = document.createElement('option');
            opt1.value = ri.reliId;
            opt1.textContent = ri.religionDesc;
            ddl1.appendChild(opt1);
        });

    } catch (err) {
        console.error('Error fetching religions:', err);
    }
}

async function fetchedu() {
    const apiUrl = new URL('/api/education', baseUrl1);

    try {
        const res = await fetch(apiUrl, {
            method: "GET",
            credentials: "include"   // Send the session cookie automatically
        });

        if (!res.ok) throw new Error('Failed to fetch education');

        const education = await res.json();   // e.g. [{ blId: 1, blg: "A+" }, …]

        // ‑‑‑‑‑ add options to the SELECT, not the table ‑‑‑‑‑
        const ddl = document.getElementById('education');
        const ddl1 = document.getElementById('education1');
        ddl.length = 1;
        ddl1.length = 1;
        education.forEach(ed => {
            const opt = document.createElement('option');
            opt.value = ed.eduId;
            opt.textContent = ed.eduDesc;
            ddl.appendChild(opt);
            const opt1 = document.createElement('option');
            opt1.value = ed.eduId;
            opt1.textContent = ed.eduDesc;
            ddl1.appendChild(opt1);
        });

    } catch (err) {
        console.error('Error fetching education:', err);
    }
}

/*				async function fetchvacc() {
                                  const apiUrl = 'http://localhost:8004/api/contractvaccine';

                                  try {
                                    const res = await fetch(apiUrl);
                                    if (!res.ok) throw new Error('Failed to fetch vaccines');

                                    const vaccines = await res.json();   // e.g. [{ blId: 1, blg: "A+" }, …]

                                    // ‑‑‑‑‑ add options to the SELECT, not the table ‑‑‑‑‑
                                    const ddl = document.getElementById('vaccination');
                                    ddl.length = 1;                         

                                    vaccines.forEach(vac => {
                                      const opt = document.createElement('option');
                                        opt.value = vac.vac_id;                  
                                        opt.textContent = vac.vaccineDesc;
                                      ddl.appendChild(opt);
                                    });

                                  } catch (err) {
                                    console.error('Error fetching vaccines:', err);
                                  }
                                }*/

/*document.getElementById('Joinee').addEventListener('change', function () {
    const joineeSelect = document.getElementById('Joinee');
    const reEntryDiv = document.getElementById('reEntryDiv');
     reEntryDiv.style.display = joineeSelect.value === '2' ? 'block' : 'none';

    });*/

document.getElementById('Joinee').addEventListener('change', function() {
    const joineeSelect = document.getElementById('Joinee');
    const reEntryField = document.getElementById('reEntryField');
    const servicesField = document.getElementById('servicesField');

    $("#container2").hide();
    $("#container3").hide();

    if (joineeSelect.value === '2') {
        // Rejoinee: Show both conditional fields
        reEntryField.style.display = 'block';
        servicesField.style.display = 'block';
    } else {
        // New Joinee: Hide and clear both fields
        reEntryField.style.display = 'none';
        servicesField.style.display = 'none';
        document.getElementById('re-entry').value = '';
        document.getElementById('services').value = '';
    }
});
document.getElementById('Joinee1').addEventListener('change', function() {
    const joineeSelect = document.getElementById('Joinee1');
    const reEntryField1 = document.getElementById('reEntryField1');
    const servicesField1 = document.getElementById('servicesField1');

    if (joineeSelect.value === '2') {
        // Rejoinee: Show both conditional fields
        reEntryField1.style.display = 'block';
        servicesField1.style.display = 'block';
    } else {
        // New Joinee: Hide and clear both fields
        reEntryField1.style.display = 'none';
        servicesField1.style.display = 'none';
        document.getElementById('re-entry1').value = '';
        document.getElementById('services1').value = '';
    }
});


// ═══════════════════════════════════════════════
// CAMERA CAPTURE — ContractGP Entry
// ═══════════════════════════════════════════════

let cameraStream     = null;   // active MediaStream
let capturedBlob     = null;   // captured photo as Blob
let capturedFileName = '';     // filename for upload

// ── Open Camera ──────────────────────────────────
document.getElementById('btnOpenCamera')
    .addEventListener('click', async function () {

    const videoEl    = document.getElementById('videoElement');
    const captureBtn = document.getElementById('btnCapture');
    const closeBtn   = document.getElementById('btnCloseCamera');
    const openBtn    = document.getElementById('btnOpenCamera');
    const errorDiv   = document.getElementById('cameraError');
    const statusDiv  = document.getElementById('photoStatus');
    const capturedImg= document.getElementById('capturedImage');

    errorDiv.style.display  = 'none';
    statusDiv.style.display = 'none';

    try {
        // Request camera access
        cameraStream = await navigator.mediaDevices.getUserMedia({
            video: {
                width:  { ideal: 1280 },
                height: { ideal: 720 },
                facingMode: 'user'   // front camera
            },
            audio: false
        });

        videoEl.srcObject    = cameraStream;
        videoEl.style.display   = 'block';
        captureBtn.style.display = 'inline-block';
        closeBtn.style.display   = 'inline-block';
        openBtn.style.display    = 'none';
        capturedImg.style.display = 'none';

    } catch (err) {
        console.error('Camera error:', err);
        errorDiv.textContent  =
            'Camera access denied. Please allow camera permission.';
        errorDiv.style.display = 'block';
    }
});

// ── Capture Photo ────────────────────────────────
document.getElementById('btnCapture')
    .addEventListener('click', function () {

    const videoEl    = document.getElementById('videoElement');
    const capturedImg= document.getElementById('capturedImage');
    const retakeBtn  = document.getElementById('btnRetake');
    const captureBtn = document.getElementById('btnCapture');
    const statusDiv  = document.getElementById('photoStatus');

    // Draw video frame onto canvas
    const canvas  = document.createElement('canvas');
    canvas.width  = videoEl.videoWidth  || 640;
    canvas.height = videoEl.videoHeight || 480;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoEl, 0, 0, canvas.width, canvas.height);

    // Show captured image
    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
    capturedImg.src           = dataUrl;
    capturedImg.style.display = 'block';

    // Stop camera stream
    stopCameraStream();
    videoEl.style.display    = 'none';
    captureBtn.style.display = 'none';
    retakeBtn.style.display  = 'inline-block';
    statusDiv.style.display  = 'block';

    // Convert canvas to Blob for upload
    canvas.toBlob(function (blob) {
        capturedBlob     = blob;
        capturedFileName = 'photo_' + Date.now() + '.jpg';
        console.log('Photo captured:', capturedFileName);
    }, 'image/jpeg', 0.9);
});

// ── Retake Photo ─────────────────────────────────
document.getElementById('btnRetake')
    .addEventListener('click', async function () {

    const videoEl    = document.getElementById('videoElement');
    const capturedImg= document.getElementById('capturedImage');
    const retakeBtn  = document.getElementById('btnRetake');
    const captureBtn = document.getElementById('btnCapture');
    const closeBtn   = document.getElementById('btnCloseCamera');
    const statusDiv  = document.getElementById('photoStatus');
    const errorDiv   = document.getElementById('cameraError');

    // Reset state
    capturedBlob            = null;
    capturedFileName        = '';
    capturedImg.src         = '';
    capturedImg.style.display = 'none';
    statusDiv.style.display   = 'none';
    errorDiv.style.display    = 'none';

    try {
        // Restart camera
        cameraStream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: 'user' },
            audio: false
        });

        videoEl.srcObject     = cameraStream;
        videoEl.style.display = 'block';
        captureBtn.style.display = 'inline-block';
        closeBtn.style.display   = 'inline-block';
        retakeBtn.style.display  = 'none';

    } catch (err) {
        errorDiv.textContent   =
            'Could not restart camera. Please try again.';
        errorDiv.style.display = 'block';
    }
});

// ── Close Camera ─────────────────────────────────
document.getElementById('btnCloseCamera')
    .addEventListener('click', function () {

    const videoEl    = document.getElementById('videoElement');
    const captureBtn = document.getElementById('btnCapture');
    const closeBtn   = document.getElementById('btnCloseCamera');
    const openBtn    = document.getElementById('btnOpenCamera');
    const retakeBtn  = document.getElementById('btnRetake');

    stopCameraStream();
    videoEl.style.display    = 'none';
    captureBtn.style.display = 'none';
    closeBtn.style.display   = 'none';
    retakeBtn.style.display  = 'none';
    openBtn.style.display    = 'inline-block';
});

// ── Helper: stop stream ───────────────────────────
function stopCameraStream() {
    if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
        cameraStream = null;
    }
}

// ── Upload captured photo ─────────────────────────
async function uploadCapturedPhoto(passId) {
    if (!capturedBlob) return null;  // no photo taken — skip

    const formData = new FormData();
    formData.append('file',   capturedBlob, capturedFileName);
    formData.append('passId', passId);

    const response = await fetch(
        new URL('/api/contractgatepass/upload', baseUrl1), {
        method:      'POST',
        credentials: 'include',
        body:        formData
    });

    if (!response.ok) {
        const err = await response.text();
        throw new Error('Photo upload failed: ' + err);
    }

    const result = await response.json();
    console.log('Photo uploaded:', result.filePath);
    return result.filePath;   // return path to store in DB
}

function generateCGNO(callback) {
    // Fetch the auto-generated number from the backend
    $.ajax({
        url: new URL('/api/contractgatepass/jims/autoCGNO', baseUrl1), // Endpoint
        type: 'GET',
        xhrFields: {
            withCredentials: true
        },
        success: function(autoNumber) {
            // If the auto-generated number is 0 or an invalid number, start with 1
            if (!autoNumber || isNaN(autoNumber)) {
                autoNumber = 1;
            } else {
                autoNumber = parseInt(autoNumber) + 1; // Auto-increment by 1
            }

            // Format the number to be zero-padded to 6 digits
/*            const formattedNumber = ('000' + autoNumber).slice(-3); // Zero-padded to 6 digits
            const CGNO = `CG00${formattedNumber}`; // Prefix with VL00*/
			const CGNO = `CG${String(autoNumber).padStart(5, '0')}`;

            // Call the callback with the generated vehicle number
            callback(CGNO);
        },
        error: function(error) {
            console.error('Error generating vehicle number:', error);
            callback('CG0001'); // Default fallback
        }
    });
}

document.addEventListener("DOMContentLoaded", function() {
    // Fetch the list of Vehicle IDs and populate the select dropdown
    fetch(new URL('/api/location/states', baseUrl1), {
        credentials: "include"
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const stateSelect = document.getElementById("state");
            const stateSelect1 = document.getElementById("state1");

            // Check if elements exist
            if (!stateSelect) {
                console.error("Element with ID 'selecttype' not found");
                return;
            }
            if (!stateSelect1) {
                console.error("Element with ID 'selecttype1' not found");
                return;
            }

            // Clear both dropdowns
            stateSelect.innerHTML = "<option value=''>Select</option>";
            stateSelect1.innerHTML = "<option value=''>Select</option>";

            // Populate both dropdowns with new option elements
            data.forEach(vehicle => {
                // Create option for vehicleSelect
                const option1 = document.createElement("option");
                option1.value = vehicle.stateId;
                option1.textContent = vehicle.stateName;
                stateSelect.appendChild(option1);

                // Create option for vehicleSelect1
                const option2 = document.createElement("option");
                option2.value = vehicle.stateId;
                option2.textContent = vehicle.stateName;
                stateSelect1.appendChild(option2);
            });
        })
        .catch(error => {
            console.error("Error fetching pass data:", error);
            alert("Failed to load pass data: " + error.message);
        });
});

document.getElementById('state').addEventListener('change', function() {
    const stateid = document.getElementById('state').value;
    // Fetch the list of Vehicle IDs and populate the select dropdown
    fetch(new URL(`/api/location/cities/states/${stateid}`, baseUrl1), {
        credentials: "include"
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const distictSelect = document.getElementById("district");
            // Check if elements exist
            if (!distictSelect) {
                console.error("Element with ID 'selecttype' not found");
                return;
            }
            // Clear both dropdowns
            distictSelect.innerHTML = "<option value=''>Select</option>";
            // Populate both dropdowns with new option elements
            data.forEach(vehicle => {
                // Create option for vehicleSelect
                const option1 = document.createElement("option");
                option1.value = vehicle.cityId;
                option1.textContent = vehicle.cityName;
                distictSelect.appendChild(option1);
            });
        })
        .catch(error => {
            console.error("Error fetching pass data:", error);
            alert("Failed to load pass data: " + error.message);
        });
});

document.getElementById('state1').addEventListener('change', function() {
    const stateid = document.getElementById('state1').value;
    // Fetch the list of Vehicle IDs and populate the select dropdown
    fetch(new URL(`/api/location/cities/states/${stateid}`, baseUrl1), {
        credentials: "include"
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const distictSelect1 = document.getElementById("district1");


            if (!distictSelect1) {
                console.error("Element with ID 'selecttype1' not found");
                return;
            }


            distictSelect1.innerHTML = "<option value=''>Select</option>";

            // Populate both dropdowns with new option elements
            data.forEach(vehicle => {
                // Create option for vehicleSelect1
                const option2 = document.createElement("option");
                option2.value = vehicle.cityId;
                option2.textContent = vehicle.cityName;
                distictSelect1.appendChild(option2);
            });
        })
        .catch(error => {
            console.error("Error fetching pass data:", error);
            alert("Failed to load pass data: " + error.message);
        });
});

//for update state and distict
document.addEventListener("DOMContentLoaded", function() {
    // Fetch the list of Vehicle IDs and populate the select dropdown
    fetch(new URL('/api/location/states', baseUrl1), {
        credentials: "include"
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const stateSelect = document.getElementById("state11");
            const stateSelect1 = document.getElementById("state22");

            // Check if elements exist
            if (!stateSelect) {
                console.error("Element with ID 'state11' not found");
                return;
            }
            if (!stateSelect1) {
                console.error("Element with ID 'state22' not found");
                return;
            }

            // Clear both dropdowns
            stateSelect.innerHTML = "<option value=''>Select</option>";
            stateSelect1.innerHTML = "<option value=''>Select</option>";

            // Populate both dropdowns with new option elements
            data.forEach(vehicle => {
                // Create option for stateSelect
                const option1 = document.createElement("option");
                option1.value = vehicle.stateId;
                option1.textContent = vehicle.stateName;
                stateSelect.appendChild(option1);

                // Create option for stateSelect1
                const option2 = document.createElement("option");
                option2.value = vehicle.stateId;
                option2.textContent = vehicle.stateName;
                stateSelect1.appendChild(option2);
            });
        })
        .catch(error => {
            console.error("Error fetching pass data:", error);
            alert("Failed to load pass data: " + error.message);
        });
});

document.getElementById('state11').addEventListener('change', function() {
    const stateid = document.getElementById('state11').value;
    // Fetch the list of cities and populate the district11 dropdown
    fetch(new URL(`/api/location/cities/states/${stateid}`, baseUrl1), {
        credentials: "include"
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const districtSelect = document.getElementById("district11");
            // Check if element exists
            if (!districtSelect) {
                console.error("Element with ID 'district11' not found");
                return;
            }
            // Clear dropdown
            districtSelect.innerHTML = "<option value=''>Select</option>";
            // Populate dropdown with new option elements
            data.forEach(vehicle => {
                // Create option for districtSelect
                const option1 = document.createElement("option");
                option1.value = vehicle.cityId;
                option1.textContent = vehicle.cityName;
                districtSelect.appendChild(option1);
            });
        })
        .catch(error => {
            console.error("Error fetching pass data:", error);
            alert("Failed to load pass data: " + error.message);
        });
});

document.getElementById('state22').addEventListener('change', function() {
    const stateid = document.getElementById('state22').value;
    // Fetch the list of cities and populate the district22 dropdown
    fetch(new URL(`api/location/cities/states/${stateid}`, baseUrl1), {
        credentials: "include"
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const districtSelect1 = document.getElementById("district22");

            if (!districtSelect1) {
                console.error("Element with ID 'district22' not found");
                return;
            }

            districtSelect1.innerHTML = "<option value=''>Select</option>";

            // Populate dropdown with new option elements
            data.forEach(vehicle => {
                // Create option for districtSelect1
                const option2 = document.createElement("option");
                option2.value = vehicle.cityId;
                option2.textContent = vehicle.cityName;
                districtSelect1.appendChild(option2);
            });
        })
        .catch(error => {
            console.error("Error fetching pass data:", error);
            alert("Failed to load pass data: " + error.message);
        });
});
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

function getIndianDateonly(date) {
    const options = {
        timeZone: 'Asia/Kolkata',
        hour12: false,
    };

    const istDate = new Date(date.toLocaleString('en-US', options));

    const day = istDate.getDate().toString().padStart(2, '0');
    const month = (istDate.getMonth() + 1).toString().padStart(2, '0');
    const year = istDate.getFullYear();

    // Format it as ISO-8601: yyyy-MM-dd'T'HH:mm:ss
    return `${year}-${month}-${day}`;
}

document.getElementById("search").addEventListener("click", function() {
    // Get the Aadhar number from the input field (replace with your actual input ID)
    var aadhar = document.getElementById("aadhar").value.trim();

    if (aadhar.length !== 12) {
        $("#adharError").show();
        document.getElementById("container1").style.display = "none";
        return;
    }
    $("#adharError").hide();

    // Check if Aadhar exists before showing modal
    $.ajax({
        url: new URL('/api/contractgatepass/check?aadhar_no=' + encodeURIComponent(aadhar), baseUrl1),
        type: 'GET',
        xhrFields: {
            withCredentials: true  // <-- correct way
        },
        success: function(response) {
            if (response.exists) {
                alert("Aadhar No already exists!");
                $("#container1").hide();
            } else {
                // Show confirmation modal if not exists
                console.log("Aadhar not found - Modal will show");
                document.getElementById("container1").style.display = "block";

            }
        },
        error: function(xhr, status, error) {
            console.error("Check API Error:", error);
            alert("An error occurred while checking Aadhar: " + error);
        }
    });
});





// Handle "Yes" button click in modal
/*	document.getElementById("confirmcontractGPyes").addEventListener("click", function () {
        console.log("Yes clicked - Proceeding with creation");
        $("#exampleModalCenter310").modal("hide");
        ContractGPentry(); // Call the insert function here
    });
    */


function contractGPaddevent() {

    $.ajax({
        url: new URL('/api/contractgatepass/check?aadhar_no=' + encodeURIComponent(aadhar), baseUrl1),
        type: 'GET',
        xhrFields: { withCredentials: true },
        success: function(response) {

            if (response.exists) {
                alert("Aadhar number already exists!");
                $("#container1").hide();
            } else {
                // SHOW THE CONFIRM MODAL
                $("#exampleModalCenter310").modal("show");
            }
        },
        error: function(xhr, status, error) {
            alert("Error checking Aadhaar: " + error);
        }
    });
}


async function ContractGPentry() {

    const adhaar = document.getElementById("aadhar").value;
    const joinee = document.getElementById("Joinee").value;
    const natureofjob = document.getElementById("nature").value;
    const fname = document.getElementById("name").value;
    const lastname = document.getElementById("last").value;
    const contactno = document.getElementById("contact_no").value;
    const gender = document.getElementById("gender").value;

    let rejoinee = null;
    if (joinee == 2) {
        const rejoinInput = document.getElementById("re-entry").value;
        if (rejoinInput) {
            rejoinee = rejoinInput;
        }
    }

    const dob = document.getElementById("birth").value;
    const age = document.getElementById("age").value;
    const joiningdate = document.getElementById("joining").value;
    const service = document.getElementById("services").value;
    const pancard = document.getElementById("card").value;
    const uancard = document.getElementById("UAN").value;
    const pfno = document.getElementById("PF_No").value;
    const esic = document.getElementById("ESIC").value;
    const nominee = document.getElementById("nominee").value;
    const nomrelation = document.getElementById("relationship").value;
    const nondate = document.getElementById("nomineedate").value;
    const totaldepen = document.getElementById("total").value;
    const bankname = document.getElementById("bank").value;
    const account = document.getElementById("ac").value;
    const branch = document.getElementById("branch").value;
    const ifsc = document.getElementById("IFSC").value;
    const fathername = document.getElementById("father").value;
    const marital = document.getElementById("marital").value;
    const spouse = document.getElementById("spouse").value;
    /*  const vaccin = document.getElementById("vaccination").value;*/
    const emergencycontact = document.getElementById("emergency").value;
    const relationship = document.getElementById("relation").value;
    const emergencyno = document.getElementById("emergencyno").value;
    const permanentadd = document.getElementById("permanent").value;
    const district = document.getElementById("district").value;
    const state = document.getElementById("state").value;
    const pincode = document.getElementById("pin").value;
    const presntadd = document.getElementById("present").value;
    const presentdistrict = document.getElementById("district1").value;
    const presntstate = document.getElementById("state1").value;
    const presentpincode = document.getElementById("code").value;
    const nage = document.getElementById("nomineeage").value;
    const workloc = document.getElementById("work").value;
    const bloodgrp = document.getElementById("blood").value;
    const servicein_jssl = document.getElementById("services").value;
    const valid_till = document.getElementById("valid").value;
    const department = document.getElementById("department").value;
    const designation = document.getElementById("designation").value;
    const educa = document.getElementById("education").value;
    const relig = document.getElementById("religion").value;

    // ================= FILE UPLOAD SECTION =================

    const adharupload = document.getElementById('adharfile');
    const medicalUpload = document.getElementById('medicalfile');   // ✅ FIXED ID
    const otherUpload = document.getElementById('otherfile');



    // Aadhar mandatory
    if (!adharupload || !adharupload.files || adharupload.files.length === 0) {
        $("#adharfileError").show();
        return;
    } else {
        $("#adharfileError").hide();
    }

    async function uploadSingleFile(fileInput) {
        if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
            return null; // optional
        }

        const file = fileInput.files[0];
        const formData = new FormData();
        formData.append("file", file);
        formData.append("passId", 2);

        const response = await fetch(new URL('/api/contractgatepass/upload', baseUrl1), {
            method: "POST",
            credentials: 'include',
            body: formData
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(errorMessage);
        }

        const result = await response.json();
        return result.filePath;
    }

    let filePath, medicalFilePath, otherFilePath;

    try {
        filePath = await uploadSingleFile(adharupload);
        medicalFilePath = await uploadSingleFile(medicalUpload);
        otherFilePath = await uploadSingleFile(otherUpload);
    } catch (err) {
        alert("File upload error: " + err.message);
        return;
    }

    // ================= DATE =================
    let currentDate = new Date();
    let currentDateTimeString = getIndianDateTimeFormat(currentDate);
    let currentdateonly = getIndianDateonly(currentDate);

    console.log("Generating CGNO ...");

    generateCGNO( async function(CGNO) {
		  const photoPath = await uploadCapturedPhoto(CGNO);
		  
		  
		  console.log("PhotoPath is this",photoPath);
        const contractentrydata = {
            "pass_issued_dt": currentdateonly,
            "valid_till": valid_till,
            "did": department,
            "deg": designation,
            "noj": natureofjob,
            "work_loc": workloc,
            "status": 0,
            "filepath": filePath,
            "contactno": contactno,
            "pan_no": pancard,
            "bacc": account,
            "emergency_contact_no": emergencyno,
            "dist": district,
            "state": state,
            "pincode": pincode,
            "present_pincode": presentpincode,
            "previous_exp": service,
            "emergency_contact_name": emergencycontact,
            "ntotal_depandants": totaldepen,
            "aadhar_no": adhaar,
            "nominee_name": nominee,
            "nrelationship": nomrelation,
            "bank_name": bankname,
            "father_name": fathername,
            "marital_status": marital,
            "spouse_name": spouse,
            "permnt_add": permanentadd,
            "emp_status": joinee,

            "present_state": presntstate,
            "present_dist": presentdistrict,
            "present_add": presntadd,
            "nage": nage,
            "esic_no": esic,
            "ndob": nondate,
            "pf_no": pfno,
            "ifsc": ifsc,
            "uan_no": uancard,
            "bg_id": bloodgrp,
            "vac_id": null,
            "bus_id": null,
            "fname": fname,
            "lname": lastname,
            "gender": gender,
            "dob": dob,
            "age": age,
            "doj": joiningdate,
            "education": educa,
            "relation": relationship,
            "religion": relig,
            "branch": branch,
            "created_by": createdById,
            "created_date": currentDateTimeString,
            "pass_id": CGNO,
            "servicein_JSSL": servicein_jssl,
            "rejoin_date": rejoinee,
            "factory_id": selectedFactoryId,
            "joinee_type": joinee,
            "active": 0,

            // ✅ FILE PATHS
            "aadharFilePath": filePath,
            "medicalFilePath": medicalFilePath,
            "other1FilePath": otherFilePath,
			"photoFilePath":   photoPath || null
        };

        console.log("Sending data to server:", contractentrydata);

        fetch(new URL('/api/contractgatepass', baseUrl1), {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(contractentrydata)
        })
            .then(async response => {
                const responseBody = await response.text();
                console.log("Response:", responseBody);

                if (response.ok) {
                   const popup = $('<div class="popup">Inserted Successfully!</div>')
                        .appendTo('body').fadeIn(400);

                    setTimeout(() => {
                        popup.fadeOut(400, () => {
                            popup.remove();
                            window.location = 'ContractGPEntry.jsp';
                        });
                    }, 500);
					
					
				/*	alert('the photo is capture successfully');*/

                } else {
                    alert("Error: " + responseBody);
                }
            })
            .catch(error => {
                console.error(error);
                alert('An error occurred.');
            });

    });
}

$("#confirmcontractGPyes").off("click").on("click", function() {
    $("#exampleModalCenter310").modal("hide");
    ContractGPentry();
});

$("#confirmcontractGPno").off("click").on("click", function() {
    $("#exampleModalCenter310").modal("hide");
})



function openstatusmodel() {
    console.log("the open status model is click")
    $("#exampleModalStatusCreate").modal("show");
}


document.addEventListener('DOMContentLoaded', fetchAndDisplayVehicle);
/*async function fetchAndDisplayVehicle() {
    const apiUrl = new URL(`/api/contractgatepass?factory_id=${selectedFactoryId}`, baseUrl1); // Update if your backend port differs

    try {
        const response = await fetch(apiUrl, {
            method: "GET",
            credentials: "include"   // Send the session cookie automatically
        });

        if (!response.ok) throw new Error("Failed to fetch  data");

        const data = await response.json();
        let tableRows = '';

        data.forEach((item, index) => {
            tableRows += `
					        <tr id="row_${item.cg_id}">
					            <td>${index + 1 || ''}</td>
					            <td>${item.aadhar_no.trim() || ''}</td>
					            <td>${item.pass_id || ''}</td>
					            <td>${item.contactno.trim() || ''}</td>
					            <td>${item.pan_no || ''}</td>
										            <td>${item.father_name || ''}</td>
								<td>
								    <i class="fa fa-pen"
								       style="
								           cursor: ${item.active == 1 ? 'not-allowed' : 'pointer'};
								           color: ${item.active == 1 ? '#aaa' : '#0d6efd'};
								       "
								       ${item.active == 1 ? '' : `onclick="editContractGP(${item.cg_id}, '${item.pass_id.trim()}')"`}>
								    </i>
								</td>


					         
					        </tr>
					    `;
        });


        // Inject rows into the table body
        document.querySelector("#Table1 tbody").innerHTML = tableRows;

        // Reinitialize DataTable
        if ($.fn.DataTable.isDataTable('#Table1')) {
            $('#Table1').DataTable().destroy();
        }

        $('#Table1').DataTable({
            dom: 'Bfrtip',
            scrollX: true,
            info: false,
            paging: false,
            buttons: [
                {
                    extend: 'excel',
                    text: 'Export to Excel',
                    title: 'Contract GP Entry'
                }
            ]
        });

        // Custom button styling
        $('.dt-buttons').css({
            'float': 'left',
            'margin-right': '10px'
        });

        $('.dataTables_filter').css({
            'text-align': 'right',
            'float': 'right',
            'margin-bottom': '10px'
        });

    } catch (error) {
        console.error('Error fetching invoice exit data:', error);
    }
}*/


// ── State variable ────────────────────────────────────────────────
let currentFactoryIdContractGP = null;

/*function fetchAndDisplayVehicle() {

    currentFactoryIdContractGP = selectedFactoryId ||
                                  localStorage.getItem("selectedFactoryId");

    // 🔥 Destroy existing DataTable
    if ($.fn.DataTable.isDataTable('#Table1')) {
        $('#Table1').DataTable().clear().destroy();
    }

    $('#Table1').DataTable({
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

                    const url = new URL(`/api/contractgatepass/list`, baseUrl1);
                    url.searchParams.append('factory_id', currentFactoryIdContractGP);
                    url.searchParams.append('page', 0);
                    url.searchParams.append('size', 99999);

                    fetch(url, { credentials: "include" })
                        .then(response => response.json())
                        .then(json => {

                            const exportData = json.data.map(item => [
                                item.aadhar_no  ? item.aadhar_no.trim()  : '',
                                item.pass_id    ? item.pass_id.trim()    : '',
                                item.contactno  ? item.contactno.trim()  : '',
                                item.pan_no     || '',
                                item.father_name || ''
                            ]);

                            let tempTable = $('<table>').append(
                                $('<thead>').append(
                                    $('<tr>').append(
                                        '<th>Aadhar No</th>',
                                        '<th>Pass No</th>',
                                        '<th>Contact No</th>',
                                        '<th>Pan Card</th>',
                                        '<th>Father Name</th>'
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
                                    title: 'Contract GP Entry'
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
            { title: "Aadhar No"                     },
            { title: "Pass No"                       },
            { title: "Contact No"                    },
            { title: "Pan Card"                      },
            { title: "Father Name"                   },
            { title: "Action",      orderable: false }
        ],
        ajax: function (data, callback, settings) {

            const page        = data.start / data.length;
            const size        = data.length;
            const searchValue = data.search.value;

            const url = new URL(`/api/contractgatepass/list`, baseUrl1);
            url.searchParams.append('factory_id', currentFactoryIdContractGP);
            url.searchParams.append('page', page);
            url.searchParams.append('size', size);
            url.searchParams.append('search', searchValue);

            fetch(url, { credentials: "include" })
                .then(response => response.json())
                .then(json => {

                    if (!json.data) {
                        callback({
                            draw: data.draw,
                            recordsTotal: 0,
                            recordsFiltered: 0,
                            data: []
                        });
                        return;
                    }

                    let slNo = data.start + 1;

                    const rows = json.data.map(item => {

                        const passId  = item.pass_id   ? item.pass_id.trim()   : '';
                        const aadhar  = item.aadhar_no ? item.aadhar_no.trim() : '';
                        const contact = item.contactno ? item.contactno.trim() : '';

                        let actionIcon = '';

                        if (item.active == 1) {
                            // Inactive record — disabled pen
                            actionIcon = `
                                <i class="fa fa-pen text-muted"
                                   title="Inactive record"
                                   style="cursor:not-allowed; opacity:0.4;">
                                </i>`;
                        } else {
                            // Active record — clickable pen
                            actionIcon = `
                                <i class="fa fa-pen"
                                   style="color:#0d6efd; cursor:pointer;"
                                   title="Edit"
                                   onclick="editContractGP(${item.cg_id}, '${passId}')">
                                </i>`;
                        }

                        return [
                            slNo++,     // col 0 — Sl No
                            aadhar,     // col 1
                            passId,     // col 2
                            contact,    // col 3
                            item.pan_no      || '',   // col 4
                            item.father_name || '',   // col 5
                            actionIcon  // col 6
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
                    console.error('Error fetching Contract GP data:', error);
                    callback({
                        draw: data.draw,
                        recordsTotal: 0,
                        recordsFiltered: 0,
                        data: []
                    });
                });
        }
    });
}*/


function fetchAndDisplayVehicle() {

    currentFactoryIdContractGP = selectedFactoryId ||
                                  localStorage.getItem("selectedFactoryId");

    // 🔥 Destroy existing DataTable
    if ($.fn.DataTable.isDataTable('#Table1')) {
        $('#Table1').DataTable().clear().destroy();
    }

    $('#Table1').DataTable({
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

                    const url = new URL(`/api/contractgatepass/list`, baseUrl1);
                    url.searchParams.append('factory_id', currentFactoryIdContractGP);
                    url.searchParams.append('page', 0);
                    url.searchParams.append('size', 99999);

                    fetch(url, { credentials: "include" })
                        .then(response => response.json())
                        .then(json => {

							const exportData = json.data.map(item => [
							    item.aadhar_no  ? item.aadhar_no.trim()  : '',
							    item.pass_id    ? item.pass_id.trim()    : '',
							    item.old_pass_id ? item.old_pass_id.trim() : '',
							    item.contactno  ? item.contactno.trim()  : '',
							    item.pan_no     || '',
							    item.father_name || ''
							]);

                            let tempTable = $('<table>').append(
                                $('<thead>').append(
                                    $('<tr>').append(
                                        '<th>Aadhar No</th>',
                                        '<th>Pass No</th>',
										'<th>Old Pass No</th>',
                                        '<th>Contact No</th>',
                                        '<th>Pan Card</th>',
                                        '<th>Father Name</th>'
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
                                    title: 'Contract GP Entry'
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
		    { title: "Aadhar No" },
		    { title: "Pass No" },
		    { title: "Old Pass No" },
		    { title: "Contact No" },
		    { title: "Pan Card" },
		    { title: "Father Name" },
		    { title: "Action", orderable: false }
		],
        ajax: function (data, callback, settings) {

            const page        = data.start / data.length;
            const size        = data.length;
            const searchValue = data.search.value;

            const url = new URL(`/api/contractgatepass/list`, baseUrl1);
            url.searchParams.append('factory_id', currentFactoryIdContractGP);
            url.searchParams.append('page', page);
            url.searchParams.append('size', size);
            url.searchParams.append('search', searchValue);

            fetch(url, { credentials: "include" })
                .then(response => response.json())
                .then(json => {

                    if (!json.data) {
                        callback({
                            draw: data.draw,
                            recordsTotal: 0,
                            recordsFiltered: 0,
                            data: []
                        });
                        return;
                    }

                    let slNo = data.start + 1;

                    const rows = json.data.map(item => {

                        const passId  = item.pass_id   ? item.pass_id.trim()   : '';
                        const aadhar  = item.aadhar_no ? item.aadhar_no.trim() : '';
                        const contact = item.contactno ? item.contactno.trim() : '';

						const oldPass = item.old_pass_id ? item.old_pass_id.trim() : '';
                        let actionIcon = '';

                        if (item.active == 1) {
                            // Inactive record — disabled pen
                            actionIcon = `
                                <i class="fa fa-pen text-muted"
                                   title="Inactive record"
                                   style="cursor:not-allowed; opacity:0.4;">
                                </i>`;
                        } else {
                            // Active record — clickable pen
                            actionIcon = `
                                <i class="fa fa-pen"
                                   style="color:#0d6efd; cursor:pointer;"
                                   title="Edit"
                                   onclick="editContractGP(${item.cg_id}, '${passId}')">
                                </i>`;
                        }

                     
						return [
						    slNo++,                    // 0
						    aadhar,                    // 1
						    passId,                    // 2
						    oldPass,                   // 3
						    contact,                   // 4
						    item.pan_no || '',         // 5
						    item.father_name || '',    // 6
						    actionIcon                 // 7
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
                    console.error('Error fetching Contract GP data:', error);
                    callback({
                        draw: data.draw,
                        recordsTotal: 0,
                        recordsFiltered: 0,
                        data: []
                    });
                });
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
    }, 2000);
}



// ===== STORE ORIGINAL FORM PAYLOAD =====
let originalPayload = null;

// ----- helper: build payload from current form values (same shape as updatecontractgp uses) -----
function buildFormPayload() {
    const getValue = id => (document.getElementById(id)?.value?.trim() || null);

    const currentDate = new Date();
    const currentDateTimeString = getIndianDateTimeFormat(currentDate);

    return {
        fname: getValue('name1'),
        lname: getValue('last1'),
        joineeType: getValue('Joinee1'),
        rejoin_date:
            getValue('Joinee1') === '2'
                ? getValue('re-entry1')
                : null,

        servicein_JSSL:
            getValue('Joinee1') === '2'
                ? getValue('services1')
                : null,
        contactno: getValue('contact_no1'),
        dob: getValue('birth1'),
        gender: getValue('gender1'),
        age: getValue('age1'),
        bg_id: getValue('blood1'),
        noj: getValue('nature1'),
        work_loc: getValue('work1'),
        religion: getValue('religion1'),
        education: getValue('education1'),

        doj: getValue('joining1'),
        valid_till: getValue('valid1'),
        did: getValue('department1'),
        deg: getValue('designation1'),
        pan_no: getValue('card1'),
        uan_no: getValue('UAN1'),
        pf_no: getValue('PF_No1'),
        esic_no: getValue('ESIC1'),
        nominee_name: getValue('nominee1'),
        ndob: getValue('nomineedate1'),
        nage: getValue('nomineeage1'),
        nrelationship: getValue('relationship1'),
        ntotal_depandants: getValue('total1'),
        bank_name: getValue('bank1'),
        bacc: getValue('ac1'),
        branch: getValue('branch1'),
        ifsc: getValue('IFSC1'),
        father_name: getValue('father1'),
        marital_status: getValue('marital1'),
        spouse_name: getValue('spouse1'),
        emergency_contact_name: getValue('emergency1'),
        relation: getValue('relation1'),
        emergency_contact_no: getValue('emergencyno1'),
        permnt_add: getValue('permanent1'),
        state: getValue('state22'),
        dist: getValue('district22'),
        pincode: getValue('pin1'),

        present_pincode: getValue('code1'),
        present_add: getValue('present1'),
        present_state: getValue('state11'),
        present_dist: getValue('district11'),
        aadharFilePath: getValue('adharfile1'),
        medicalFilePath: getValue('medicalfile1'),
        other1FilePath: getValue('otherfile1'),
        modified_by: createdById,
        modified_date: currentDateTimeString,
		aadhar_no :getValue('adhar1')
    };
}

// ----- helper: shallow compare two payload objects -----
function payloadsEqual(a, b) {
    if (!a || !b) return false;

    const keys = new Set([...Object.keys(a), ...Object.keys(b)]);

    for (const k of keys) {

        // Always ignore modified_date
        if (k === "modified_date") continue;

        const va = a[k] == null ? '' : String(a[k]).trim();
        const vb = b[k] == null ? '' : String(b[k]).trim();

        // 🔴 IMPORTANT FIX:
        // rejoin_date must be compared properly
        // (Re-Joinee → New Joinee must be detected)
        if (k === "rejoin_date") {
            if (va !== vb) {
                console.log(`Mismatch at ${k}: original="${va}", current="${vb}"`);
                return false;
            }
            continue;
        }

        // Normal comparison
        if (va !== vb) {
            console.log(`Mismatch at ${k}: original="${va}", current="${vb}"`);
            return false;
        }
    }

    return true; // All fields match
}


async function updatecontractgp(cg_id) {

    const apiUrl = new URL(`/api/contractgatepass/${cg_id}`, baseUrl1);

    const getValue = id => document.getElementById(id)?.value?.trim() || '';

    let currentDate = new Date();
    let currentDateTimeString = getIndianDateTimeFormat(currentDate);

    const joineeType = getValue('Joinee1');

    // Reset fields for New Joinee
    if (joineeType === '1') {
        document.getElementById('re-entry1').value = '';
        document.getElementById('services1').value = '';
    }

    // ================= FILE UPLOAD FUNCTION (SAME AS INSERT) =================
    async function uploadSingleFile(fileInput) {
        if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
            return null;
        }

        const file = fileInput.files[0];
        const formData = new FormData();
        formData.append("file", file);
        formData.append("passId", 2); // same as insert

        const response = await fetch(new URL('/api/contractgatepass/upload', baseUrl1), {
            method: "POST",
            credentials: 'include',
            body: formData
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(errorMessage);
        }

        const result = await response.json();
        return result.filePath;
    }

    // ================= HANDLE FILES =================
    let aadharPath = originalFiles?.aadhar || '';
    let medicalPath = originalFiles?.medical || '';
    let otherPath = originalFiles?.other || '';

    try {

        const isAadharValid = validatePDF(document.getElementById("adharfile1"), "adharfile1Error");
        const isMedicalValid = validatePDF(document.getElementById("medicalfile1"), "medicalfile1Error");
        const isOtherValid = validatePDF(document.getElementById("otherfile1"), "otherfile1Error");

        if (!isAadharValid || !isMedicalValid || !isOtherValid) {
            return;
        }
        const newAadhar = await uploadSingleFile(document.getElementById("adharfile1"));
        const newMedical = await uploadSingleFile(document.getElementById("medicalfile1"));
        const newOther = await uploadSingleFile(document.getElementById("otherfile1"));

        if (newAadhar) aadharPath = newAadhar;
        if (newMedical) medicalPath = newMedical;
        if (newOther) otherPath = newOther;

    } catch (err) {
        console.error("File upload failed:", err);
        alert("File upload failed: " + err.message);
        return;
    }

    // ================= PAYLOAD =================
    const payload = {
        joinee_type: Number(joineeType),

        fname: getValue('name1'),
        lname: getValue('last1'),

        rejoin_date: joineeType === '2' ? getValue('re-entry1') : null,
        servicein_JSSL: joineeType === '2' ? getValue('services1') : null,

        contactno: getValue('contact_no1'),
        dob: getValue('birth1'),
        gender: getValue('gender1'),
        age: getValue('age1'),
        bg_id: getValue('blood1'),
        noj: getValue('nature1'),
        work_loc: getValue('work1'),
        religion: getValue('religion1'),
        education: getValue('education1'),


        doj: getValue('joining1'),
        valid_till: getValue('valid1'),
        did: getValue('department1'),
        deg: getValue('designation1'),

        pan_no: getValue('card1'),
        uan_no: getValue('UAN1'),
        pf_no: getValue('PF_No1'),
        esic_no: getValue('ESIC1'),

        nominee_name: getValue('nominee1'),
        ndob: getValue('nomineedate1'),
        nage: getValue('nomineeage1'),
        nrelationship: getValue('relationship1'),
        ntotal_depandants: getValue('total1'),

        bank_name: getValue('bank1'),
        bacc: getValue('ac1'),
        branch: getValue('branch1'),
        ifsc: getValue('IFSC1'),

        father_name: getValue('father1'),
        marital_status: getValue('marital1'),
        spouse_name: getValue('spouse1'),

        emergency_contact_name: getValue('emergency1'),
        relation: getValue('relation1'),
        emergency_contact_no: getValue('emergencyno1'),

        permnt_add: getValue('permanent1'),
        state: getValue('state22'),
        dist: getValue('district22'),
        pincode: getValue('pin1'),

        present_add: getValue('present1'),
        present_state: getValue('state11'),
        present_dist: getValue('district11'),
        present_pincode: getValue('code1'),

        // ✅ FILE PATHS (UPDATED CORRECTLY)
        aadharFilePath: aadharPath,
        medicalFilePath: medicalPath,
        other1FilePath: otherPath,

        modified_by: createdById,
        modified_date: currentDateTimeString,
		
		
		aadhar_no:getValue('adhar1')
    };

    // ================= API CALL =================
    try {
        const response = await fetch(apiUrl, {
            method: 'PUT',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

		if (response.status === 409) {
		      const errorData = await response.json();
		     // alert(errorData.message);
			 $("#exampleModalScrollable12").modal("hide");
			  document.getElementById("modalMessage").innerText = errorData.message;
			     $("#messageModal").modal("show");   // show duplicate message
		      return;
		  }
        if (!response.ok) {
            throw new Error(`Failed to update: ${response.statusText}`);
        }

        const result = await response.json();
        console.log('Update response:', result);

	
   showPopup("Updated Successfully!", "ContractGPEntry.jsp");
        $("#exampleModalScrollable12").modal("hide");

    } catch (error) {
        console.error('Error updating Contract Gate Pass:', error);
        alert('Error updating data: ' + error.message);
    }
}






$("#updcontractGP").off("click").on("click", function() {
    console.log("hello");



    if (validateUpdateForm()) {
        $("#exampleModalCenterUpdate").modal("show");
    } else {
        $("#exampleModalCenterUpdate").modal("hide");
    }
});






function validateUpdateForm() {
    let isValid = true;

    const safe = id => ($("#" + id).val() || "").trim();

    let name = safe("name1");
    let last = safe("last1");
    let contact = safe("contact_no1");
    let department = safe("department1");
    let designation = safe("designation1");
    let joineeType = $("#Joinee1").val();
    let birth = safe("birth1");
    let age = safe("age1");
    let gender = safe("gender1");
    let blood = safe("blood1");
    let nature = safe("nature1");
    let work = safe("work1");
    let joining = safe("joining1");
    let services = safe("services1");
    let reEntry = safe("re-entry1");
    let valid = safe("valid1");
    let card = safe("card1");
    let UAN = safe("UAN1");
    let PF_No = safe("PF_No1");
    let ESIC = safe("ESIC1");
    let nominee = safe("nominee1");
    let nomineeDate = safe("nomineedate1");
    let nomineeAge = safe("nomineeage1");
    let relationship = safe("relationship1");
    let total = safe("total1");
    let bank = safe("bank1");
    let ac = safe("ac1");
    let branch = safe("branch1");
    let IFSC = safe("IFSC1");
    let father = safe("father1");
    let marital = safe("marital1");
    let spouse = safe("spouse1");
    let emergency = safe("emergency1");
    let relation = safe("relation1");
    let emergencyno = safe("emergencyno1");
    let religion = safe("religion1");
    let education = safe("education1");
    let present = safe("present1");
    let permanent = safe("permanent1");
    let state = safe("state22");
    let district = safe("district22");
    let pin = safe("pin1");
    let state2 = safe("state11");
    let district2 = safe("district11");
    let code = safe("code1");
let adhar1 = safe('adhar1');
    // ── Detect nature of job ─────────────────────────────────────────
    const nojDesc = getSelectedNojDesc('nature1');

    function checkField(value, errorId) {
        if (value === "") {
            $("#" + errorId).show();
            isValid = false;
        } else {
            $("#" + errorId).hide();
        }
    }

    // Always required
    const requiredFields = [
        { value: name, error: "name1Error" },
        { value: last, error: "last1Error" },
        { value: contact, error: "contact_no1Error" },
        { value: department, error: "department1Error" },
        { value: designation, error: "designation1Error" },
        { value: birth, error: "birth1Error" },
        { value: age, error: "age1Error" },
        { value: gender, error: "gender1Error" },
        { value: blood, error: "blood1Error" },
        { value: nature, error: "nature1Error" },
        { value: work, error: "work1Error" },
        { value: joining, error: "joining1Error" },
        { value: valid, error: "valid1Error" },
        { value: nominee, error: "nominee1Error" },
        { value: nomineeDate, error: "nomineedate1Error" },
        { value: nomineeAge, error: "nomineeage1Error" },
        { value: relationship, error: "relationship1Error" },
        { value: total, error: "total1Error" },
        { value: bank, error: "bank1Error" },
        { value: ac, error: "ac1Error" },
        { value: branch, error: "branch1Error" },
        { value: IFSC, error: "IFSC1Error" },
        { value: father, error: "father1Error" },
        { value: marital, error: "marital1Error" },
        { value: emergency, error: "emergency1Error" },
        { value: relation, error: "relation1Error" },
        { value: emergencyno, error: "emergencyno1Error" },
        { value: religion, error: "religion1Error" },
        { value: education, error: "education1Error" },
        { value: present, error: "present1Error" },
        { value: permanent, error: "permanent1Error" },
        { value: state, error: "state1Error" },
        { value: district, error: "district1Error" },
        { value: pin, error: "pin1Error" },
        { value: state2, error: "state11Error" },
        { value: district2, error: "district11Error" },
        { value: code, error: "code1Error" },
		{value:adhar1, error:"adhar1Error"}
    ];

    requiredFields.forEach(f => checkField(f.value, f.error));

    // ── PAN — mandatory for MBC only ─────────────────────────────────
    if (nojDesc === 'MBC') {
        if (card === "") {
            $("#card1Error").text("PAN Card is required for MBC").show();
            isValid = false;
        } else if (card.length !== 10) {
            $("#card1Error").text("PAN must be 10 characters").show();
            isValid = false;
        } else {
            $("#card1Error").hide();
        }
    } else {
        if (card !== "" && card.length !== 10) {
            $("#card1Error").text("PAN must be 10 characters").show();
            isValid = false;
        } else {
            $("#card1Error").hide();
        }
    }

    // ── PF, UAN, ESIC — compulsory for MBC & JBC, optional for ATS ──
    if (nojDesc === 'MBC' || nojDesc === 'JBC') {

        // UAN — exactly 12 digits
        if (UAN === "") {
            $("#UAN1Error").text("UAN No is required").show();
            isValid = false;
        } else if (!/^\d{12}$/.test(UAN)) {
            $("#UAN1Error").text("UAN must be exactly 12 digits").show();
            isValid = false;
        } else {
            $("#UAN1Error").hide();
        }

        // PF — 1 to 22 alphanumeric characters
        if (PF_No === "") {
            $("#PF_No1Error").text("PF No is required").show();
            isValid = false;
        } else if (PF_No.length !== 22) {
            $("#PF_No1Error").text("PF No must be up to 22 alphanumeric characters").show();
            isValid = false;
        } else {
            $("#PF_No1Error").hide();
        }

        // ESIC — exactly 17 digits
        if (ESIC === "") {
            $("#ESIC1Error").text("ESIC No is required").show();
            isValid = false;
        } else if (!/^\d{10}$/.test(ESIC)) {
            $("#ESIC1Error").text("ESIC No must be exactly 10 digits").show();
            isValid = false;
        } else {
            $("#ESIC1Error").hide();
        }

    } else if (nojDesc === 'ATS') {
        // ATS — optional with format check
  /*      if (UAN !== "" && (UAN.length !== 12 || !/^\d{12}$/.test(UAN))) {
            $("#UAN1Error").text("UAN must be exactly 12 digits").show();
            isValid = false;
        } else { $("#UAN1Error").hide(); }

        if (PF_No !== "" && (PF_No.length > 22 || !/^[a-zA-Z0-9]{1,22}$/.test(PF_No))) {
            $("#PF_No1Error").text("PF No must be up to 22 alphanumeric characters").show();
            isValid = false;
        } else { $("#PF_No1Error").hide(); }

        if (ESIC !== "" && (ESIC.length !== 17 || !/^\d{17}$/.test(ESIC))) {
            $("#ESIC1Error").text("ESIC No must be exactly 17 digits").show();
            isValid = false;
        } else { $("#ESIC1Error").hide(); }*/
    }

    // ── Special validations ───────────────────────────────────────────
    if (contact && (contact.length !== 10 || !/^\d{10}$/.test(contact))) {
        $("#contact_no1Error").text("Contact No must be 10 digits").show();
        isValid = false;
    }

    if (age && parseInt(age) < 18) {
        $("#age1Error").text("Age must be 18 or above").show();
        isValid = false;
    }

    if (emergencyno && (emergencyno.length !== 10 || !/^\d{10}$/.test(emergencyno))) {
        $("#emergencyno1Error").text("Emergency Contact No must be 10 digits").show();
        isValid = false;
    }

    if (code && (code.length !== 6 || !/^\d{6}$/.test(code))) {
        $("#code1Error").text("Present Pin Code must be 6 digits").show();
        isValid = false;
    }

    if (pin && (pin.length !== 6 || !/^\d{6}$/.test(pin))) {
        $("#pin1Error").text("Permanent Pin Code must be 6 digits").show();
        isValid = false;
    }

    // ── Spouse ────────────────────────────────────────────────────────
    if (marital === "1") {
        if (spouse.trim() === "") {
            $("#spouse1Error").show();
            isValid = false;
        } else {
            $("#spouse1Error").hide();
        }
    } else {
        $("#spouse1Error").hide();
        $("#spouse1").val("");
    }

    // ── Rejoinee conditional ──────────────────────────────────────────
	if (joineeType === "2") {
	    if (services === "") { $("#services1Error").show(); isValid = false; }
	    else { $("#services1Error").hide(); }

	    if (reEntry === "") {
	        $("#re-entry1Error").text("Re-Entry date is required").show();
	        isValid = false;
	    } else { $("#re-entry1Error").hide(); }
	} else {
	    //  FIX: Only hide re-entry and services errors — NOT UAN/PF errors
	    $("#re-entry1Error, #services1Error").hide();
	}

    return isValid;
}





let originalFiles = null;
async function editContractGP(cg_id) {
	
	if (!hasPermission("Edit")) {

		           alert(`You do not have permission to Edit`);
				   return;
				   }
	
    const contractGpApiUrl = new URL(`/api/contractgatepass/${cg_id}`, baseUrl1);

    $("#confirmUpdateYes").off('click').on('click', async function() {

        $("#exampleModalCenterUpdate").modal("hide");

        // ✅ Step 1: Validate
        if (!validateUpdateForm()) {
            const popup = $('<div class="popup">Please fix validation errors.</div>')
                .appendTo('body').fadeIn(200);
            setTimeout(() => popup.fadeOut(200, () => popup.remove()), 2000);
            return;
        }

        // ✅ Step 2: Build current payload
        const currentPayload = buildFormPayload();

        console.log("Original Payload:", originalPayload);
        console.log("Current Payload:", currentPayload);
        const isSamePayload = payloadsEqual(originalPayload, currentPayload);
        const isFileChanged = filesChanged();

        if (isSamePayload && !isFileChanged) {

            showPopup("No Feilds Changes", "ContractGPEntry.jsp");
            $("#exampleModalScrollable12").modal("hide");
            return;
        }

        // ✅ Step 4: Call update
        await updatecontractgp(cg_id);
    });

    try {
        const response = await fetch(contractGpApiUrl, {
            method: "GET",
            credentials: "include"
        });

        if (!response.ok) throw new Error(`Failed to fetch ContractGP data: ${response.status}`);

        const contractGp = await response.json();
        console.log('ContractGP Data:', contractGp);

        const setValue = (id, value) => {
            const element = document.getElementById(id);
            if (element) element.value = String(value || '').trim();
        };

        // Load and populate state dropdowns
        const statesRes = await fetch(new URL('/api/location/states', baseUrl1), {
            credentials: "include"
        });
        const states = await statesRes.json();

        const state11 = document.getElementById("state11");
        const state22 = document.getElementById("state22");

        state11.innerHTML = "<option value=''>Select</option>";
        state22.innerHTML = "<option value=''>Select</option>";

        states.forEach(state => {
            const option1 = document.createElement("option");
            option1.value = state.stateId;
            option1.textContent = state.stateName;
            state11.appendChild(option1);

            const option2 = document.createElement("option");
            option2.value = state.stateId;
            option2.textContent = state.stateName;
            state22.appendChild(option2);
        });

        // Set selected state values (with trim)
        const presentStateId = String(contractGp.present_state || '').trim();
        const permanentStateId = String(contractGp.state || '').trim();
        state11.value = presentStateId;
        state22.value = permanentStateId;

        // Fetch districts for both states
        const [districts11Res, districts22Res] = await Promise.all([
            fetch(new URL(`/api/location/cities/states/${presentStateId}`, baseUrl1), {
                credentials: "include"
            }),
            fetch(new URL(`/api/location/cities/states/${permanentStateId}`, baseUrl1), {
                credentials: "include"
            })
        ]);

        const districts11 = await districts11Res.json();
        const districts22 = await districts22Res.json();

        const district11 = document.getElementById("district11");
        const district22 = document.getElementById("district22");

        district11.innerHTML = "<option value=''>Select</option>";
        district22.innerHTML = "<option value=''>Select</option>";

        // Populate and set present district
        districts11.forEach(city => {
            const option = document.createElement("option");
            option.value = city.cityId;
            option.textContent = city.cityName;
            district11.appendChild(option);
        });

        districts22.forEach(city => {
            const option = document.createElement("option");
            option.value = city.cityId;
            option.textContent = city.cityName;
            district22.appendChild(option);
        });

        district11.value = String(contractGp.present_dist || '').trim();
        district22.value = String(contractGp.dist || '').trim();

        // Set other form values
        setValue('name1', contractGp.fname);
        setValue('last1', contractGp.lname);

        // ✅ FIXED: Handle Joinee status and conditional fields properly
        if (contractGp.joinee_type == 1) {
            document.getElementById('Joinee1').value = 1;
            // Hide conditional fields for New Joinee
            const reEntryField1 = document.getElementById("reEntryField1");
            const servicesField1 = document.getElementById("servicesField1");
            if (reEntryField1) reEntryField1.style.display = 'none';
            if (servicesField1) servicesField1.style.display = 'none';
            // Clear values
            document.getElementById("re-entry1").value = "";
            document.getElementById("services1").value = "";
        } else if (contractGp.joinee_type == 2) {
            document.getElementById("Joinee1").value = 2;
            // Show conditional fields for Rejoinee
            const reEntryField1 = document.getElementById("reEntryField1");
            const servicesField1 = document.getElementById("servicesField1");
            if (reEntryField1) reEntryField1.style.display = 'block';
            if (servicesField1) servicesField1.style.display = 'block';
            // Set values
            setValue('re-entry1', contractGp.rejoin_date);
            setValue('services1', contractGp.servicein_JSSL);
        }

        setValue('contact_no1', contractGp.contactno);
        setValue('birth1', contractGp.dob);
        setValue('gender1', contractGp.gender);
        setValue('age1', contractGp.age);
        setValue('blood1', contractGp.bg_id);
        setValue('nature1', contractGp.noj);
        setValue('work1', contractGp.work_loc);
        setValue('religion1', contractGp.religion);
        setValue('education1', contractGp.education);

        setValue('joining1', contractGp.doj);
        setValue('valid1', contractGp.valid_till);
        setValue('card1', contractGp.pan_no);
        setValue('UAN1', contractGp.uan_no);
        setValue('PF_No1', contractGp.pf_no);
        setValue('ESIC1', contractGp.esic_no);
        setValue('nominee1', contractGp.nominee_name);
        setValue('nomineedate1', contractGp.ndob);
        setValue('nomineeage1', contractGp.nage);
        setValue('relationship1', contractGp.nrelationship);
        setValue('total1', contractGp.ntotal_depandants);
        setValue('bank1', contractGp.bank_name);
        setValue('ac1', contractGp.bacc);
        setValue('branch1', contractGp.branch);
        setValue('IFSC1', contractGp.ifsc);
        setValue('father1', contractGp.father_name);
        setValue('marital1', contractGp.marital_status);
        setValue('spouse1', contractGp.spouse_name);
        setValue('emergency1', contractGp.emergency_contact_name);
        setValue('relation1', contractGp.relation);
        setValue('emergencyno1', contractGp.emergency_contact_no);
        setValue('permanent1', contractGp.permnt_add);
        setValue('pin1', contractGp.pincode);
        setValue('code1', contractGp.present_pincode);
        setValue('present1', contractGp.present_add);
        setValue('department1', contractGp.did);
        setValue('designation1', contractGp.deg);
		setValue('adhar1',contractGp.aadhar_no);

        setValue('existingAdharFileLink', extractFileName(contractGp.aadharFilePath));
        setValue('existingmedicalFileLink', extractFileName(contractGp.medicalFilePath));
        setValue('existingOthersFileLink', extractFileName(contractGp.other1FilePath));

		originalFiles = {
			    aadhar: contractGp.aadharFilePath || '',
			    medical: contractGp.medicalFilePath || '',
			    other: contractGp.other1FilePath || ''
			};
        setTimeout(() => {
            originalPayload = buildFormPayload();
            console.log("Original payload captured:", originalPayload);
        }, 100);

        // Show modal
        $("#exampleModalScrollable12").modal("show");

    } catch (error) {
        console.error('Error fetching ContractGP data:', error);
        alert('Could not load ContractGP data: ' + error.message);
    }
}
function filesChanged() {
    const currentFiles = {
        aadhar: document.getElementById("adharfile1").files[0]?.name || originalFiles.aadhar,
        medical: document.getElementById("medicalfile1").files[0]?.name || originalFiles.medical,
        other: document.getElementById("otherfile1").files[0]?.name || originalFiles.other
    };

    return (
        currentFiles.aadhar !== originalFiles.aadhar ||
        currentFiles.medical !== originalFiles.medical ||
        currentFiles.other !== originalFiles.other
    );
}

document.addEventListener("DOMContentLoaded", function() {
    fetchdepartment();
});

function fetchdepartment() {
    fetch(new URL('/api/contractgatepass/jims/deptlist', baseUrl1), {
        method: 'GET',
        credentials: 'include'
    })
        .then(response => response.json())
        .then(data => {

            const deptDropdownIds = ["department", "department1"];

            deptDropdownIds.forEach(id => {
                const dropdown = document.getElementById(id);
                if (dropdown) {
                    dropdown.innerHTML = '<option value="">Select</option>';

                    data.forEach(dept => {
                        const option = document.createElement('option');
                        option.value = dept.id;        // ✔ Correct value = ID
                        option.textContent = dept.name; // ✔ Show name
                        dropdown.appendChild(option);
                    });
                }
            });
        })
        .catch(error => console.error("Error fetching departments:", error));
}

document.addEventListener("DOMContentLoaded", function() {
    fetchdesignation();
});

function fetchdesignation() {
    fetch(new URL('/api/contractgatepass/jims/designationlist', baseUrl1), {
        method: 'GET',
        credentials: 'include'
    })
        .then(response => response.json())
        .then(data => {

            const designationIds = ["designation", "designation1"];

            designationIds.forEach(id => {
                const dropdown = document.getElementById(id);
                if (dropdown) {
                    dropdown.innerHTML = '<option value="">Select</option>';

                    data.forEach(designation => {
                        const option = document.createElement('option');
                        option.value = designation.id;        // ✔ ID
                        option.textContent = designation.name; // ✔ Name
                        dropdown.appendChild(option);
                    });
                }
            });

        })
        .catch(error => console.error("Error fetching designation list:", error));
}




function extractFileName(path) {
    if (!path) return '';
    return path.split(/[/\\]/).pop();
}

function validatePDF(fileInput, errorId) {
    if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
        return true; // optional files allowed
    }

    const file = fileInput.files[0];

    // Check MIME type
    if (file.type !== "application/pdf") {
        $("#" + errorId).text("Only PDF files are allowed").show();
        fileInput.value = ""; // reset file
        return false;
    }

    // Optional: size check (e.g., 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
        $("#" + errorId).text("File size must be less than 5MB").show();
        fileInput.value = "";
        return false;
    }

    $("#" + errorId).hide();
    return true;
}



function getSelectedNojDesc(dropdownId) {
    const ddl = document.getElementById(dropdownId);
    if (!ddl) return '';
    const selectedOption = ddl.options[ddl.selectedIndex];
    return selectedOption ? selectedOption.textContent.trim().toUpperCase() : '';
}


// Auto-set valid_till based on nature of job selection and DOJ (INSERT form)
document.addEventListener("DOMContentLoaded", function() {
    const joiningEl = document.getElementById('joining');
    const natureEl = document.getElementById('nature');
    const validEl = document.getElementById('valid');

    if (!joiningEl || !natureEl || !validEl) return;

    function autoSetValidTill() {
        const doj = joiningEl.value;
        const nojDesc = getSelectedNojDesc('nature');
        if (!doj || nojDesc === 'ATS') return; // ATS: manual entry, don't auto-set

        const date = new Date(doj);
        if (isNaN(date)) return;

        if (nojDesc === 'MBC') {
            date.setFullYear(date.getFullYear() + 1); // +1 year
        } else if (nojDesc === 'JBC') {
            date.setMonth(date.getMonth() + 6); // +6 months
        } else {
            return; // unknown type, don't auto-set
        }

        validEl.value = date.toISOString().split('T')[0];
    }

    joiningEl.addEventListener('change', autoSetValidTill);
    natureEl.addEventListener('change', autoSetValidTill);
});


// Auto-set valid_till based on nature of job and DOJ (UPDATE form)
document.addEventListener("DOMContentLoaded", function() {
    const joiningEl1 = document.getElementById('joining1');
    const natureEl1 = document.getElementById('nature1');
    const validEl1 = document.getElementById('valid1');

    if (!joiningEl1 || !natureEl1 || !validEl1) return;

    function autoSetValidTill1() {
        const doj = joiningEl1.value;
        const nojDesc = getSelectedNojDesc('nature1');
        if (!doj || nojDesc === 'ATS') return;

        const date = new Date(doj);
        if (isNaN(date)) return;

        if (nojDesc === 'MBC') {
            date.setFullYear(date.getFullYear() + 1);
        } else if (nojDesc === 'JBC') {
            date.setMonth(date.getMonth() + 6);
        } else {
            return;
        }

        validEl1.value = date.toISOString().split('T')[0];
    }

    joiningEl1.addEventListener('change', autoSetValidTill1);
    natureEl1.addEventListener('change', autoSetValidTill1);
});


