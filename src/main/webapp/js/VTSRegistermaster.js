




const MainPage = 'VTSMaster.jsp';
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




document.getElementById("vtsreg").addEventListener("click", function () {
    // show custom message instead of opening modal
	  const allowed =allowedActions || [];

	if (!allowed.includes("Insert")) {
	  alert(" You do not have permission to Insert.");
	  $('#exampleModalScrollableIN').modal('hide');
	  return;
	}
	$('#exampleModalScrollableIN').modal('show');
})

document.getElementById("vtsveh").addEventListener("click", function () {
    // show custom message instead of opening modal
	  const allowed = allowedActions || [];

	if (!allowed.includes("Insert")) {
	  alert(" You do not have permission to Insert.");
	  $('#exampleModalScrollableCon').modal('hide');
	  return;
	}
	$('#exampleModalScrollableCon').modal('show');
})

document.getElementById("vtssta").addEventListener("click", function () {
    // show custom message instead of opening modal
	  const allowed = allowedActions || [];

	if (!allowed.includes("Insert")) {
	  alert(" You do not have permission to Insert.");
	  $('#exampleModalScrollableState').modal('hide');
	  return;
	}
	$('#exampleModalScrollableState').modal('show');
})

document.getElementById("vtscity").addEventListener("click", function () {
    // show custom message instead of opening modal
	  const allowed = allowedActions || [];

	if (!allowed.includes("Insert")) {
	  alert(" You do not have permission to Insert.");
	  $('#exampleModalScrollableLocation').modal('hide');
	  return;
	}
	$('#exampleModalScrollableLocation').modal('show');
})

document.getElementById("vtscom").addEventListener("click", function () {
    // show custom message instead of opening modal
	  const allowed = allowedActions || [];

	if (!allowed.includes("Insert")) {
	  alert(" You do not have permission to Insert.");
	  $('#exampleModalScrollableCompany').modal('hide');
	  return;
	}
	$('#exampleModalScrollableCompany').modal('show');
})

document.getElementById("vtssel").addEventListener("click", function () {
    // show custom message instead of opening modal
	  const allowed =allowedActions || [];

	if (!allowed.includes("Insert")) {
	  alert(" You do not have permission to Insert.");
	  $('#exampleModalScrollableSelect').modal('hide');
	  return;
	}
	$('#exampleModalScrollableSelect').modal('show');
})

let selectedTypeId = null; // Store only ID

$(document).ready(function () {
	
	loadActions();
	
	const selectedType = localStorage.getItem("selectedRadioType");

	   if (selectedType) {

	       $("input[name='vehicleSelection']").prop("checked", false);

	       $("input[name='vehicleSelection'][value='" + selectedType + "']")
	           .prop("checked", true);

	       toggleTables();

	       // clear after use
	       localStorage.removeItem("selectedRadioType");
	   }
	
	
	
	
	
    // Create - "Submit" button click
    $("#createselect").click(function () {
		var selecttype = $('#selecttype').val().trim();

		   if (!selecttype) {
		       $('#selecttypeError').show();
		       return;
		   } else {
		       $('#selecttypeError').hide();
		   }
        console.log("Create clicked - Modal will show");
        $("#exampleModalCenter199").modal("show");
    });

    // Create - "No" button click
    $(".btn-secondary[data-dismiss='modal']").click(function () {
        console.log("No clicked - Modal will hide");
        $("#exampleModalCenter199").modal("hide");
    });

    // Create - "Yes" button click
    $(document).on("click", "#confirmselecttypeyes", function () {
        console.log("Yes clicked - Proceeding with creation");
        $("#exampleModalCenter199").modal("hide");
        handleAddSelectType();
    });

    // Update - Show update modal
    $("#updselect").click(function () {
        console.log("Update clicked - Modal will show");
		let selettype = $("#selecttype1").val().trim();
		
	if(!selettype){
		$("#selecttype1Error").show();
	}
	else{
		$("#selecttype1Error").hide();
		$("#exampleModalCenter109").modal("show");
	}
       
    });

    // Update - Cancel update modal
    $("#cancelselectmodal").click(function () {
        console.log("No clicked - Modal will hide");
        $("#exampleModalCenter109").modal("hide");
    });

    // Update - Confirm update
    $(document).on("click", "#confirmselectupd", function () {
        $("#exampleModalCenter109").modal("hide");
        if (selectedTypeId) {
            updateSelectType(selectedTypeId);
        } else {
            alert("Data not found for update.");
        }
    });
});

// Add new select type
function handleAddSelectType() {
   // const selectType = $('#selecttype').val();
   var selecttype = $('#selecttype').val().trim();

    /*if (!selecttype) {
        $('#selecttypeError').show();
        return;
    } else {
        $('#selecttypeError').hide();
    }
*/
    // Check for duplicates
    $.ajax({
        url:new URL(`/api/vms/checkvisitorpasstype?Pass_name=${encodeURIComponent(selecttype)}`,baseUrl1),
        type: 'GET',
		xhrFields: {
			    withCredentials: true
			},
        success: function (response) {
            if (response.exists) {
				showModalPopup("Pass type already exists!");
                //alert("Pass type already exists!");
            } else {
                insertSelectType(selecttype);
            }
        },
        error: function (xhr, status, error) {
            console.error("Check API Error:", error);
            alert("An error occurred while checking: " + error);
        }
    });
}


function insertSelectType(selecttype) {
    let currentDateTimeString = getIndianDateTimeFormat(new Date());

    var requestData = {
        "passName": selecttype,
        "createdBy": createdById, // number, not string
        "createdDate": currentDateTimeString // match with @JsonProperty
    };

    $.ajax({
        url: new URL('/api/vms',baseUrl1),
        type: 'POST',
		xhrFields: {
			    withCredentials: true
			},
        contentType: 'application/json',
        data: JSON.stringify(requestData),
        dataType: 'json',
        success: function (response) {
            if (response && response.status === "Success") {
                showPopup("Inserted Successfully", "VTSRegister.jsp");
                fetchSelectTypes();
            } else {
                alert("Record not inserted. Please try again.");
            }
        },
        error: function (xhr, status, error) {
            console.error("Insert AJAX Error:", error);
            alert("An error occurred while inserting: " + error);
        }
    });
}

// Fetch and render select types
async function fetchSelectTypes() {
    const apiUrl = new URL('/api/vms', baseUrl1);

    try {
        const response = await fetch(apiUrl, {
            method: "GET",
            credentials: "include"
        });
        if (!response.ok) throw new Error("Failed to fetch pass types");

        const selectTypes = await response.json();
        let tableRows = '';

        for (let index = 0; index < selectTypes.length; index++) {
            const item = selectTypes[index];

            // 🔍 check if pass is used (outtime IS NULL)
            const usedRes = await fetch(
                new URL(`/api/VMScompany/pass/is-used/${item.passId}`, baseUrl1),
                { credentials: "include" }
            );
            const usedData = await usedRes.json();
            const isUsed = usedData.used;

            tableRows += `
                <tr id="${item.passId}">
                    <td>${index + 1}</td>
                    <td>${item.passName}</td>
                    <td>
                        ${
                            isUsed
                                ? `<i class="fa fa-pen text-secondary"
                                       title="Pass is currently in use"
                                       style="cursor:not-allowed; opacity:0.3;"></i>`
                                : `<i class="fa fa-pen text-muted cursor-pointer"
                                       title="Edit"
                                       onclick="editSelectType(${item.passId})"></i>`
                        }
                    </td>
                </tr>
            `;
        }

        document.querySelector("#selecttypeTable tbody").innerHTML = tableRows;

        if ($.fn.DataTable.isDataTable('#selecttypeTable')) {
            $('#selecttypeTable').DataTable().destroy();
        }

		$('#selecttypeTable').DataTable({
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
		        title: 'Pass Type List'
		    }]
		});

        $('.dt-buttons').css({ float: 'left', 'margin-right': '10px' });
        $('.dataTables_filter').css({ float: 'right', 'margin-bottom': '10px' });

    } catch (error) {
        console.error('Error fetching pass types:', error);
    }
}


// Populate modal for edit
function editSelectType(passId) {
	  const allowed = allowedActions || [];

	if (!allowed.includes("Edit")) {
	  alert(" You do not have permission to edit.");
	  return;
	}
    fetch(new URL(`/api/vms/${passId}`,baseUrl1)	, {
	    credentials: "include"
	})
        .then(response => response.json())
        .then(data => {
            document.getElementById('selecttype1').value = data.passName || '';
            selectedTypeId = data.passId;
            $('#exampleModalScrollableSelectUp').modal('show');
        })
        .catch(error => {
            console.error('Error fetching pass type for editing:', error);
            alert('Error fetching pass type');
        });
}

// Update selected type
function updateSelectType(passId) {
    const updatedPassName = document.getElementById('selecttype1').value.trim();

    // Step 1: Check if the pass type already exists
    $.ajax({
        url: new URL(`/api/vms/checkvisitorpasstype?Pass_name=${encodeURIComponent(updatedPassName)}`, baseUrl1),
        type: 'GET',
        xhrFields: {
            withCredentials: true
        },
        success: function (response) {
            // If pass type exists but belongs to a different record
            if (response.exists && response.id != passId) {
                showModalPopup("Pass type already exists!");
            } else {
                // Step 2: Proceed to update if not duplicate
                const updatedData = {
                    passName: updatedPassName,
                    modifiedBy: createdById,
                    modifiedDate: getIndianDateTimeFormat(new Date())
                };

                fetch(new URL(`/api/vms/passtype/${passId}`, baseUrl1), {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include',
                    body: JSON.stringify(updatedData)
                })
                .then(response => {
                    if (response.ok) {
                        showPopup("Updated Successfully!", "VTSRegister.jsp");
                        $('#exampleModalScrollableSelectUp').modal('hide');
                        fetchSelectTypes(); // Refresh list
                    } else {
                        alert('Failed to update pass type');
                    }
                })
                .catch(error => {
                    console.error('Error updating pass type:', error);
                    alert('Error updating pass type');
                });
            }
        },
        error: function (xhr, status, error) {
            console.error("Check API Error:", error);
            alert("An error occurred while checking: " + error);
        }
    });
}

let selectedcompanyId = null;

$(document).ready(function () {
    // Create button triggers confirmation modal for adding state
    $("#createcompany").click(function () {
		var company = $('#company').val().trim();
		var address = $('#address').val().trim();
		var statedp = $('#statedp').val().trim();
		//var city3 = $('#city3').val().trim();

		var hasError = false;

		if (!company) {
		    $('#companyError').show();
		    hasError = true;
		} else {
		    $('#companyError').hide();
		}

		if (!address) {
		    $('#addressError').show();
		    hasError = true;
		} else {
		    $('#addressError').hide();
		}

		if (!statedp) {
		    $('#statedpError').show();
		    hasError = true;
		} else {
		    $('#statedpError').hide();
		}
		
		/*if (!city3) {
			$('#city3Error').show();
			hasError = true;
			} else {
			$('#city3Error').hide();
			}*/
			
		// If any error, stop further action
		if (hasError) {
		    return;
		}
        $("#exampleModalCenter110").modal("show");
    });

    // Confirm - No
    $(".btn-secondary[data-dismiss='modal']").click(function () {
        $("#exampleModalCenter110").modal("hide");
    });

    // Confirm - Yes
    $("#confirmcompanyyes").click(function () {
        $("#exampleModalCenter110").modal("hide");
        companyaddevent();
    });

    // Fetch initial state list
    fetchcompanydetails();
});

// Update - "Submit" button click
$("#Companyup").click(function () {
    console.log("Update clicked - Modal will show");

    let isValid = true;
	let companyname = ($("#company1").val() || "").trim();
	let address     = ($("#address1").val() || "").trim();
	let state2      = ($("#state2").val() || "").trim();
	let city2       = ($("#city2").val() || "").trim();

    // Company name
    if (!companyname) {
        $("#company1Error").show();
        isValid = false;
    } else {
        $("#company1Error").hide();
    }

    // Address
    if (!address) {
        $("#address1Error").show();
        isValid = false;
    } else {
        $("#address1Error").hide();
    }

    // State
    if (!state2) {
        $("#state2Error").show();
        isValid = false;
    } else {
        $("#state2Error").hide();
    }

    // City
    if (!city2) {
        $("#city2Error").show();
        isValid = false;
    } else {
        $("#city2Error").hide();
    }

    // Final submit
    if (isValid) {
        $("#exampleModalCenter111").modal("show");
    }
});

$("#cancelcompanymodal").click(function () {
    console.log("No clicked - Modal will hide");
    $("#exampleModalCenter111").modal("hide");
});

// Click handler for the confirm update button
$(document).on("click", "#confirmcompanyupd", function () {
    $("#exampleModalCenter111").modal("hide");
    if (selectedcompanyId) {
        companyUpdate(selectedcompanyId);  
    } else {
        alert("Data not found for update.");
    }
});

// Add new state event
function companyaddevent() {
	var company = $('#company').val().trim();
	/*var address = $('#address').val().trim();
	var statedp = $('#statedp').val().trim();
	//var city3 = $('#city3').val().trim();

	var hasError = false;

	if (!company) {
	    $('#companyError1').show();
	    hasError = true;
	} else {
	    $('#companyError1').hide();
	}

	if (!address) {
	    $('#addressError1').show();
	    hasError = true;
	} else {
	    $('#addressError1').hide();
	}
	
	if (!statedp) {
	    $('#statedpError1').show();
	    hasError = true;
	} else {
	    $('#statedpError1').hide();
	}
	
	if (!city3) {
	    $('#city3Error1').show();
	    hasError = true;
	} else {
	    $('#city3Error1').hide();
	}

	// If any error, stop further action
	if (hasError) {
	    return;
	}*/

    // Check if state already exists
    $.ajax({
        url: new URL('/api/VMScompany/checkcompany?Company_name=' + encodeURIComponent(company),baseUrl1),
        type: 'GET',
		xhrFields: {
			    withCredentials: true
			},
        success: function (response) {
            if (response.exists) {
				showModalPopup("company already exists!");
                //alert("company already exists!");
            } else {
                insertcompany(company);
            }
        },
        error: function (xhr, status, error) {
            console.error("Check Error:", error);
            alert("Error while checking company.");
        }
    });
}

// Insert new state into database
function insertcompany() {
    let company = $('#company').val();   // Get company name
    let address = $('#address').val();   // Get address
    let stateId = parseInt($('#statedp').val());  // Ensure it's an integer
    let cityId = parseInt($('#city3').val());     // Ensure it's an integer
    let currentDateTimeString = getIndianDateTimeFormat(new Date());

    var requestData = {
        company_name: company,
        address: address,
        state_id: stateId,
        city_id: cityId,
        created_by: createdById,  // Integer
        created_date: currentDateTimeString
    };

    $.ajax({
        url: new URL('/api/VMScompany',baseUrl1),
        type: 'POST',
		xhrFields: {
			    withCredentials: true
			},
        contentType: 'application/json',
        data: JSON.stringify(requestData),
        dataType: 'json',
        success: function (response) {
            if (response && response.status === "Success") {
                showPopup("Inserted Successfully", "VTSRegister.jsp");
            } else {
                alert("Record not inserted. Please try again.");
            }
        },
        error: function (xhr, status, error) {
            console.error("Insert AJAX Error:", error);
            alert("An error occurred while inserting: " + error);
        }
    });
}
let originalCompanyData = {};

async function editcompany(company_id) {
	  const allowed =allowedActions || [];

	if (!allowed.includes("Edit")) {
	  alert(" You do not have permission to edit.");
	  return;
	}
    try {
        selectedcompanyId = company_id;

        const response = await fetch(
            new URL(`/api/VMScompany/${company_id}`, baseUrl1),
            { credentials: "include" }
        );
        const companyData = await response.json();

        // 🔹 Store original values for comparison
        originalCompanyData = {
            company_name: companyData.company_name || '',
            address: companyData.address || '',
            state_id: String(companyData.state_id || ''),
            city_id: String(companyData.city_id || '')
        };

        // Set fields
        $('#company1').val(originalCompanyData.company_name);
        $('#address1').val(originalCompanyData.address);

        // Load states
        const statesResponse = await fetch(
            new URL('/api/location/states', baseUrl1),
            { credentials: "include" }
        );
        const states = await statesResponse.json();

        const stateDropdown = $('#state2');
        stateDropdown.html('<option value="">Select State</option>');
        states.forEach(s => {
            stateDropdown.append(`<option value="${s.stateId}">${s.stateName}</option>`);
        });

        $('#state2').val(originalCompanyData.state_id);

        // Load cities and preselect
        await loadCitiesByState(originalCompanyData.state_id, originalCompanyData.city_id);

        $('#exampleModalScrollableCompanyup').modal('show');

    } catch (err) {
        console.error(err);
        alert("Error loading company details");
    }
}


function companyUpdate(company_id) {

    const updatedData = {
        company_name: $('#company1').val().trim(),
        address: $('#address1').val().trim(),
        state_id: $('#state2').val(),
        city_id: $('#city2').val()
    };

    // 🔹 1️⃣ Check if ANY field changed
    const isChanged =
        updatedData.company_name !== originalCompanyData.company_name ||
        updatedData.address !== originalCompanyData.address ||
        updatedData.state_id !== originalCompanyData.state_id ||
        updatedData.city_id !== originalCompanyData.city_id;

    if (!isChanged) {
		showModalPopup("No changes are detected Updated is Skipped..!");
        return; // ⛔ stop here
    }

    // 🔹 2️⃣ Check if company name changed
    const isCompanyNameChanged =
        updatedData.company_name !== originalCompanyData.company_name;

    // 🔹 3️⃣ If company name NOT changed → directly update
    if (!isCompanyNameChanged) {
        proceedUpdate(company_id, updatedData);
        return;
    }

    // 🔹 4️⃣ Company name changed → check duplication
    $.ajax({
        url: new URL(
            `/api/VMScompany/checkcompany?Company_name=${encodeURIComponent(updatedData.company_name)}`,
            baseUrl1
        ),
        type: 'GET',
        xhrFields: { withCredentials: true },
        success: function (response) {
            if (response.exists && response.id != company_id) {
				showModalPopup("Company already exists!");
            } else {
                proceedUpdate(company_id, updatedData);
            }
        },
        error: function () {
            alert("Error while checking company.");
        }
    });
}

function proceedUpdate(company_id, updatedData) {

    const payload = {
        ...updatedData,
        modified_by: createdById,
        modified_date: getIndianDateTimeFormat(new Date())
    };

    fetch(new URL(`/api/VMScompany/${company_id}`, baseUrl1), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        credentials: 'include'
    })
    .then(res => {
        if (res.ok) {
            alert("Updated Successfully!");
            $('#exampleModalScrollableCompanyup').modal('hide');
            fetchcompanydetails();
        } else {
            alert("Update failed");
        }
    })
    .catch(err => {
        console.error(err);
        alert("Error updating company");
    });
}



async function fetchcompanydetails() {
    try {
        // 1️⃣ Fetch states and cities once for lookup maps
        const [statesRes, citiesRes] = await Promise.all([
            fetch(new URL('/api/location/states', baseUrl1), { credentials: "include" }),
            fetch(new URL('/api/location/cities', baseUrl1), { credentials: "include" })
        ]);

        if (!statesRes.ok || !citiesRes.ok) throw new Error("Lookup fetch failed");

        const [states, cities] = await Promise.all([
            statesRes.json(),
            citiesRes.json()
        ]);

        const stateMap = {};
        states.forEach(s => stateMap[s.stateId] = s.stateName);

        const cityMap = {};
        cities.forEach(c => cityMap[c.cityId] = c.cityName);

        // 2️⃣ Destroy existing DataTable instance if present
        if ($.fn.DataTable.isDataTable('#companyTableID')) {
            $('#companyTableID').DataTable().destroy();
        }

        // 3️⃣ Helper: fetch one page of companies from backend
        async function fetchCompanyPage(page, size, search) {
            const url = new URL('/api/VMScompany/paging', baseUrl1);
            url.searchParams.set('page', page);
            url.searchParams.set('size', size);
            if (search) url.searchParams.set('search', search);

            const res = await fetch(url, { credentials: "include" });
            if (!res.ok) throw new Error("Company fetch failed");
            return await res.json(); // Spring Page<Company>: { content, totalElements, ... }
        }

        // 4️⃣ Helper: build row for DataTables (with is-used check)
        async function buildRow(item, serialNo) {
            const usedRes = await fetch(
                new URL(`/api/VMScompany/transporter/is-used/${item.company_id}`, baseUrl1),
                { credentials: "include" }
            );
            const usedData = await usedRes.json();
            const isUsed = usedData.used;

            return {
                rowData: [
                    serialNo,
                    item.company_name,
                    item.address,
                    stateMap[item.state_id] || 'N/A',
                    cityMap[item.city_id]  || 'N/A',
                    isUsed
                        ? `<i class="fa fa-pen text-secondary"
                               title="Company already used in Transporter"
                               style="cursor:not-allowed; opacity:0.3;"></i>`
                        : `<i class="fa fa-pen text-muted cursor-pointer"
                               title="Edit"
                               onclick="editcompany(${item.company_id})"></i>`
                ]
            };
        }

        // 5️⃣ Init DataTables with server-side + custom Excel export
        $('#companyTableID').DataTable({
            dom: 'Bfrtip',
            serverSide: true,
            processing: true,
            scrollX: false,
            info: true,
            paging: true,
            pageLength: 10,
            lengthMenu: [
                [10, 25, 50, 100],
                [10, 25, 50, 100]
            ],

            buttons: [
                {
                    text: 'Export to Excel',
                    className: 'btn btn-success',
                    action: async function () {
                        try {
                            const table = $('#companyTableID').DataTable();
                            const searchTerm = table.search();

                            // Fetch up to 1000 records — no is-used check needed
                            const allData = await fetchCompanyPage(0, 1000, searchTerm);

                            // Directly map — no async, no is-used
                            const excelRows = allData.content.map((item, index) => [
                                index + 1,
                                item.company_name,
                                item.address,
                                stateMap[item.state_id] || 'N/A',
                                cityMap[item.city_id]  || 'N/A'
                            ]);

                            if (typeof XLSX !== 'undefined') {
                                const ws = XLSX.utils.aoa_to_sheet([
                                    ['#', 'Company Name', 'Address', 'State', 'City'],
                                    ...excelRows
                                ]);
                                const wb = XLSX.utils.book_new();
                                XLSX.utils.book_append_sheet(wb, ws, 'Company List');
                                XLSX.writeFile(wb, 'Company_List.xlsx');
                            } else {
                                // Fallback: CSV
                                const csvContent = [
                                    ['#', 'Company Name', 'Address', 'State', 'City'].join(','),
                                    ...excelRows.map(r => r.join(','))
                                ].join('\n');
                                const blob = new Blob([csvContent], { type: 'text/csv' });
                                const a = document.createElement('a');
                                a.href = URL.createObjectURL(blob);
                                a.download = 'Company_List.csv';
                                a.click();
                            }
                        } catch (err) {
                            console.error("Excel export error:", err);
                            alert("Export failed. Please try again.");
                        }
                    }
                }
            ],

            // 6️⃣ Server-side ajax
            ajax: async function (dtParams, callback) {
                try {
                    const page   = Math.floor(dtParams.start / dtParams.length);
                    const size   = dtParams.length;
                    const search = dtParams.search?.value?.trim() || '';

                    const companyPage = await fetchCompanyPage(page, size, search);

                    // is-used checks in parallel for current page only
                    const rows = await Promise.all(
                        companyPage.content.map((item, index) =>
                            buildRow(item, dtParams.start + index + 1)
                        )
                    );

                    callback({
                        draw: dtParams.draw,
                        recordsTotal: companyPage.totalElements,
                        recordsFiltered: companyPage.totalElements,
                        data: rows.map(r => r.rowData)
                    });

                } catch (err) {
                    console.error("DataTables ajax error:", err);
                    callback({ draw: dtParams.draw, recordsTotal: 0, recordsFiltered: 0, data: [] });
                }
            },

            columnDefs: [
                { targets: 0, title: '#' },
                { targets: 1, title: 'Company Name' },
                { targets: 2, title: 'Address' },
                { targets: 3, title: 'State' },
                { targets: 4, title: 'City' },
                { targets: 5, title: 'Action', orderable: false, searchable: false }
            ],

            initComplete: function () {
                $('.dt-buttons').css({ float: 'left',  marginRight:  '10px' });
                $('.dataTables_filter').css({ float: 'right', marginBottom: '10px' });
            }
        });

    } catch (error) {
        console.error("Fetch Error:", error);
    }
}



$(document).ready(function () {
    // Fetch states when the city master page loads
    fetchStatesForcity();
	
	$('#state2').on('change', function () {
	    const selectedStateId = $(this).val();

	    // Clear previously selected city
	    $('#city2').val('');

	    // Load new cities
	    loadCitiesByState(selectedStateId);
	});

    // Bind event to the state dropdown to fetch cities when the state is changed
    $("#statedp").change(function () {
        fetchCitiesForState();
    });
	
});



// Fetch States to bind to State Dropdown
async function fetchStatesForcity() {
    try {
        const response = await fetch(new URL('/api/location/states',baseUrl1)		, {
		    credentials: "include"
		});
        if (!response.ok) throw new Error("Fetch failed");

        const states = await response.json();
        let stateOptions = '<option value="">Select State</option>'; // Default "Select State" option

        states.forEach(state => {
            stateOptions += `<option value="${state.stateId}">${state.stateName}</option>`;
        });

        // Bind to state dropdown
        document.querySelector("#statedp").innerHTML = stateOptions; // Corrected element ID
    } catch (error) {
        console.error("Error fetching states:", error);
        alert("Failed to load states for city master.");
    }
}

// Fetch Cities based on the selected State
async function fetchCitiesForState() {
    const stateId = document.getElementById("statedp").value; // Get selected state ID
    if (!stateId) {
        // Clear the cities dropdown if no state is selected
        document.getElementById("city3").innerHTML = '<option value="">Select City</option>';
        return;
    }

    try {
        const response = await fetch(new URL(`/api/location/cities/states/${stateId}`,baseUrl1)		, {
		    credentials: "include"
		});
        if (!response.ok) throw new Error("Fetch failed");

        const cities = await response.json();
        let cityOptions = '<option value="">Select City</option>'; // Default "Select City" option

        cities.forEach(city => {
            cityOptions += `<option value="${city.cityId}">${city.cityName}</option>`;
        });

        // Bind to city dropdown
        document.querySelector("#city3").innerHTML = cityOptions;
    } catch (error) {
        console.error("Error fetching cities:", error);
        alert("Failed to load cities for the selected state.");
    }
}

let selectedcityId = null;

$(document).ready(function () {
    // Create button triggers confirmation modal for adding state
    $("#createcity").click(function () {
		var city = $('#city').val().trim();
			var state1 = $('#state1').val().trim();

			var hasError = false;

			if (!city) {
			    $('#cityError').show();
			    hasError = true;
			} else {
			    $('#cityError').hide();
			}

			if (!state1) {
			    $('#state1Error').show();
			    hasError = true;
			} else {
			    $('#state1Error').hide();
			}

			// If any error, stop further action
			if (hasError) {
			    return;
			}
        $("#exampleModalCenter100").modal("show");
    });

    // Confirm - No
    $(".btn-secondary[data-dismiss='modal']").click(function () {
        $("#exampleModalCenter100").modal("hide");
    });

    // Confirm - Yes
    $("#confirmcityyes").click(function () {
        $("#exampleModalCenter100").modal("hide");
        cityaddevent();
    });

    // Fetch initial state list
    fetchcities();
});

// Update - "Submit" button click
$("#updcity").click(function () {
    console.log("Update clicked - Modal will show");

    let state3 = $("#state3").val().trim();
    let city3  = $("#city1").val().trim();

    let isValid = true;

    // ✅ State validation
    if (!state3) {
        $("#state3Error").show();
        isValid = false;
    } else {
        $("#state3Error").hide();
    }

    // ✅ City validation
    if (!city3) {
        $("#city1Error").show();
        isValid = false;
    } else {
        $("#city1Error").hide();
    }

    // ✅ Open modal only if ALL validations pass
    if (isValid) {
        $("#exampleModalCenter101").modal("show");
    }
});


$("#cancelcitymodal").click(function () {
    console.log("No clicked - Modal will hide");
    $("#exampleModalCenter101").modal("hide");
});

// Click handler for the confirm update button
$(document).on("click", "#confirmcityupd", function () {
    $("#exampleModalCenter101").modal("hide");
    if (selectedcityId) {
        cityUpdate(selectedcityId);  // Call cityUpdate without passing cityId since it's already stored in selectedCityId
    } else {
        alert("Data not found for update.");
    }
});

// Add new state event
function cityaddevent() {
	var city = $('#city').val().trim();
	//var state1 = $('#state1').val().trim();

	/*var hasError = false;

	if (!city) {
	    $('#cityError1').show();
	    hasError = true;
	} else {
	    $('#cityError1').hide();
	}

	if (!state1) {
	    $('#state1Error').show();
	    hasError = true;
	} else {
	    $('#state1Error').hide();
	}

	// If any error, stop further action
	if (hasError) {
	    return;
	}*/

    // Check if state already exists
    $.ajax({
        url: new URL('/api/location/checkcity?City_name=' + encodeURIComponent(city),baseUrl1),
        type: 'GET',
		xhrFields: {
			    withCredentials: true
			},
        success: function (response) {
            if (response.exists) {
				showModalPopup("city already exists!");
               // alert("city already exists!");
            } else {
                insertcity(city);
            }
        },
        error: function (xhr, status, error) {
            console.error("Check Error:", error);
            alert("Error while checking city.");
        }
    });
}

// Insert new state into database
function insertcity(city) {
    let currentDateTimeString = getIndianDateTimeFormat(new Date());
    var stateId = $('#state1').val();  // <-- Get selected stateId from dropdown

    var requestData = {
        "cityName": city,
        "stateId": stateId,             // <-- Include stateId here
        "createdBy": createdById,
        "created_date": currentDateTimeString
    };

    $.ajax({
        url: new URL('/api/location/cities',baseUrl1),
        type: 'POST',
		xhrFields: {
			    withCredentials: true
			},
        contentType: 'application/json',
        data: JSON.stringify(requestData),
        dataType: 'json',
        success: function (response) {
            if (response && response.status === "Success") {
                showPopup("Inserted Successfully", "VTSRegister.jsp");
            } else {
                alert("Record not inserted. Please try again.");
            }
        },
        error: function (xhr, status, error) {
            console.error("Insert AJAX Error:", error);
            alert("An error occurred while inserting: " + error);
        }
    });
}

// Edit city function
async function editcity(cityId) {
	  const allowed = allowedActions || [];

	if (!allowed.includes("Edit")) {
	  alert(" You do not have permission to edit.");
	  return;
	}
    try {
        selectedcityId = cityId;  // Store the selected city ID here
        const cityResponse = await fetch(new URL(`/api/location/cities/${cityId}`,baseUrl1)		, {
		    credentials: "include"
		});
        const cityData = await cityResponse.json();

        // Populate the city name
        document.getElementById('city1').value = cityData.cityName || '';

        // Fetch states list
        const statesResponse = await fetch(new URL('/api/location/states',baseUrl1)		, {
		    credentials: "include"
		});
        const statesData = await statesResponse.json();

        // Populate the state3 dropdown
        const stateDropdown = document.getElementById('state3');
        stateDropdown.innerHTML = '<option value="">Select State</option>'; // Reset dropdown first
        statesData.forEach(state => {
            const option = document.createElement('option');
            option.value = state.stateId;
            option.text = state.stateName;
            stateDropdown.appendChild(option);
        });

        // Set the selected state
        $('#state3').val(cityData.stateId);

        // Show the edit modal
        $('#exampleModalScrollableCityup').modal('show');

    } catch (err) {
        console.error("Edit Error:", err);
        alert("Error fetching city or state data.");
    }
}

// Update city function
function cityUpdate(cityId) {
    const updatedCityName = document.getElementById('city1').value.trim();

    // Step 1: Check if the city already exists
    $.ajax({
        url: new URL('/api/location/checkcity?City_name=' + encodeURIComponent(updatedCityName), baseUrl1),
        type: 'GET',
        xhrFields: {
            withCredentials: true
        },
        success: function (response) {
            // If same city name exists but belongs to a different record
            if (response.exists && response.id != cityId) {
                showModalPopup("City already exists!");
            } else {
                // Step 2: Proceed to update if no duplicate found
                const updatedCity = {
                    cityName: updatedCityName,
                    modifiedBy: createdById,
                    modifiedDate: getIndianDateTimeFormat(new Date())
                };

                console.log("Updated City Data:", updatedCity);

                fetch(new URL(`/api/location/cities/${cityId}`, baseUrl1), {
                    method: 'PUT',
                    headers: { 
                        'Content-Type': 'application/json' 
                    },
                    body: JSON.stringify(updatedCity),
                    credentials: 'include'
                })
                .then(response => {
                    if (response.ok) {
                        showPopup("Updated Successfully!", "VTSRegister.jsp");
                        $('#exampleModalScrollableCityup').modal('hide');
                        fetchcities(); // Refresh city list
                    } else {
                        alert("Update failed.");
                    }
                })
                .catch(err => {
                    console.error("Error in fetch request:", err);
                    alert("Error updating city.");
                });
            }
        },
        error: function (xhr, status, error) {
            console.error("Check Error:", error);
            alert("Error while checking city.");
        }
    });
}

// Fetch states list and display in table
async function fetchcities() {
    try {
        // 1️⃣ Fetch all states once for ID → name map
        const statesResponse = await fetch(
            new URL('/api/location/states', baseUrl1),
            { credentials: "include" }
        );
        if (!statesResponse.ok) throw new Error("States fetch failed");
        const statesData = await statesResponse.json();
        const stateIdToNameMap = {};
        statesData.forEach(state => {
            stateIdToNameMap[state.stateId] = state.stateName;
        });

        // 2️⃣ Destroy existing DataTable instance if present
        if ($.fn.DataTable.isDataTable('#locationTableID')) {
            $('#locationTableID').DataTable().destroy();
        }

        // 3️⃣ Helper: fetch one page of cities from backend
        async function fetchCitiesPage(page, size, search) {
            const url = new URL('/api/location/cities/paging', baseUrl1);
            url.searchParams.set('page', page);
            url.searchParams.set('size', size);
            if (search) url.searchParams.set('search', search);

            const res = await fetch(url, { credentials: "include" });
            if (!res.ok) throw new Error("Cities fetch failed");
            return await res.json(); // Spring Page<City>: { content, totalElements, ... }
        }

        // 4️⃣ Helper: build row data array for a city item
        async function buildRow(item, serialNo) {
            const stateName = stateIdToNameMap[item.stateId] || 'Unknown';
            const usedRes = await fetch(
                new URL(`/api/VMScompany/city/is-used/${item.cityId}`, baseUrl1),
                { credentials: "include" }
            );
            const usedData = await usedRes.json();
            const isUsed = usedData.used;

            return {
                cityId: item.cityId,
                rowData: [
                    serialNo,
                    stateName,
                    item.cityName,
                    isUsed
                        ? `<i class="fa fa-pen text-secondary"
                               title="City already used"
                               style="cursor:not-allowed; opacity:0.3;"></i>`
                        : `<i class="fa fa-pen text-muted cursor-pointer"
                               title="Edit"
                               onclick="editcity(${item.cityId})"></i>`
                ]
            };
        }

        // 5️⃣ Init DataTables with server-side + custom Excel export
        $('#locationTableID').DataTable({
            dom: 'Bfrtip',
            serverSide: true,
            processing: true,
            scrollX: false,
            info: true,
            paging: true,
            pageLength: 10,
            lengthMenu: [
                [10, 25, 50, 100],
                [10, 25, 50, 100]
            ],

			buttons: [
			    {
			        text: 'Export to Excel',
			        className: 'btn btn-success',
			        action: async function () {
			            try {
			                const table = $('#locationTableID').DataTable();
			                const searchTerm = table.search();

			                // Fetch up to 1000 records — no is-used check needed
			                const allData = await fetchCitiesPage(0, 1000, searchTerm);

			                // Directly map content to rows — no async needed
			                const excelRows = allData.content.map((item, index) => [
			                    index + 1,                                        // Serial
			                    stateIdToNameMap[item.stateId] || 'Unknown',     // State
			                    item.cityName                                     // City
			                ]);

			                if (typeof XLSX !== 'undefined') {
			                    const ws = XLSX.utils.aoa_to_sheet([
			                        ['#', 'State', 'City'],
			                        ...excelRows
			                    ]);
			                    const wb = XLSX.utils.book_new();
			                    XLSX.utils.book_append_sheet(wb, ws, 'City List');
			                    XLSX.writeFile(wb, 'City_List.xlsx');
			                } else {
			                    // Fallback: CSV
			                    const csvContent = [
			                        ['#', 'State', 'City'].join(','),
			                        ...excelRows.map(r => r.join(','))
			                    ].join('\n');
			                    const blob = new Blob([csvContent], { type: 'text/csv' });
			                    const a = document.createElement('a');
			                    a.href = URL.createObjectURL(blob);
			                    a.download = 'City_List.csv';
			                    a.click();
			                }
			            } catch (err) {
			                console.error("Excel export error:", err);
			                alert("Export failed. Please try again.");
			            }
			        }
			    }
			],

            // 6️⃣ Server-side ajax — passes DataTables search term to backend
            ajax: async function (dtParams, callback) {
                try {
                    const page = Math.floor(dtParams.start / dtParams.length);
                    const size = dtParams.length;

                    // DataTables puts the search string here
                    const search = dtParams.search?.value?.trim() || '';

                    const citiesPage = await fetchCitiesPage(page, size, search);

                    // Fetch is-used for current page in parallel
                    const rows = await Promise.all(
                        citiesPage.content.map((item, index) =>
                            buildRow(item, dtParams.start + index + 1)
                        )
                    );

                    callback({
                        draw: dtParams.draw,
                        recordsTotal: citiesPage.totalElements,
                        recordsFiltered: citiesPage.totalElements,
                        data: rows.map(r => r.rowData)
                    });

                } catch (err) {
                    console.error("DataTables ajax error:", err);
                    callback({ draw: dtParams.draw, recordsTotal: 0, recordsFiltered: 0, data: [] });
                }
            },

            columnDefs: [
                { targets: 0, title: '#' },
                { targets: 1, title: 'State' },
                { targets: 2, title: 'City' },
                { targets: 3, title: 'Action', orderable: false, searchable: false }
            ]
        });

    } catch (error) {
        console.error("Fetch Error:", error);
    }
}

$(document).ready(function () {
    // Fetch states when the city master page loads
    fetchStatesForCityMaster();
});

// Fetch States to bind to City Dropdown or any relevant field
async function fetchStatesForCityMaster() {
    try {
        const response = await fetch(new URL('/api/location/states',baseUrl1)		, {
		    credentials: "include"
		});
        if (!response.ok) throw new Error("Fetch failed");

        const states = await response.json();
        let stateOptions = '<option value="">Select State</option>'; // Default "Select State" option

        states.forEach(state => {
            stateOptions += `<option value="${state.stateId}">${state.stateName}</option>`;
        });

        // Assuming you have a city master dropdown or similar element to fill the states
        document.querySelector("#state1").innerHTML = stateOptions; // Update with correct element ID 
    } catch (error) {
        console.error("Error fetching states:", error);
        alert("Failed to load states for city master.");
    }
}

let selectedStateId = null;

$(document).ready(function () {
    // Create button triggers confirmation modal for adding state
    $("#createstate").click(function () {
		var state = $('#state').val().trim();
		   if (!state) {
		       $('#stateError').show();
		       return;
		   } else {
		       $('#stateError').hide();
		   }
        $("#exampleModalCenter99").modal("show");
    });

    // Confirm - No
    $(".btn-secondary[data-dismiss='modal']").click(function () {
        $("#exampleModalCenter99").modal("hide");
    });

    // Confirm - Yes
    $("#confirmstateyes").click(function () {
        $("#exampleModalCenter99").modal("hide");
        stateaddevent();
    });

    // Fetch initial state list
    fetchStates();
});

// Update - "Submit" button click
$("#updstate").click(function () {
    console.log("Update clicked - Modal will show");
	let updatestate = $("#State_2").val().trim();
	if(!updatestate){
		$("#State_2Error").show();
	}else{
		$("#State_2Error").hide();
    $("#exampleModalCenter89").modal("show");
	}
});

$("#cancelstatemodal").click(function () {
    console.log("No clicked - Modal will hide");
    $("#exampleModalCenter89").modal("hide");
});

// Update - "Yes" button click
$(document).on("click", "#confirmstateupd", function () {
    $("#exampleModalCenter89").modal("hide");
    if (selectedStateId) {
        stateUpdate(selectedStateId);
    } else {
        alert("Data not found for update.");
    }
});

// Add new state event
function stateaddevent() {
    var state = $('#state').val().trim();
    /*if (!state) {
        $('#stateError').show();
        return;
    } else {
        $('#stateError').hide();
    }*/

    // Check if state already exists
    $.ajax({
        url: new URL('/api/location/check?State_name=' + encodeURIComponent(state),baseUrl1),
        type: 'GET',
		xhrFields: {
			    withCredentials: true
			},
        success: function (response) {
            if (response.exists) {
				showModalPopup("State already exists!");
               // alert("State already exists!");
            } else {
                insertState(state);
            }
        },
        error: function (xhr, status, error) {
            console.error("Check Error:", error);
            alert("Error while checking state.");
        }
    });
}

// Insert new state into database
function insertState(state) {
    let currentDateTimeString = getIndianDateTimeFormat(new Date());

    var requestData = {
        "stateName": state,
        "createdBy": createdById,
        "created_date": currentDateTimeString
    };

    $.ajax({
        url: new URL('/api/location/states',baseUrl1),
        type: 'POST',
		xhrFields: {
			    withCredentials: true
			},
        contentType: 'application/json',
        data: JSON.stringify(requestData),
        dataType: 'json',
        success: function (response) {
            if (response && response.status === "Success") {
                showPopup("Inserted Successfully", "VTSRegister.jsp");
            } else {
                alert("Record not inserted. Please try again.");
            }
        },
        error: function (xhr, status, error) {
            console.error("Insert AJAX Error:", error);
            alert("An error occurred while inserting: " + error);
        }
    });
}

// Fetch states list and display in table
async function fetchStates() {
    try {
        // 1️⃣ Destroy existing DataTable instance if present
        if ($.fn.DataTable.isDataTable('#statetableID')) {
            $('#statetableID').DataTable().destroy();
        }

        // 2️⃣ Helper: fetch one page of states from backend
        async function fetchStatesPage(page, size, search) {
            const url = new URL('/api/location/states/paging', baseUrl1);
            url.searchParams.set('page', page);
            url.searchParams.set('size', size);
            if (search) url.searchParams.set('search', search);

            const res = await fetch(url, { credentials: "include" });
            if (!res.ok) throw new Error("States fetch failed");
            return await res.json(); // Spring Page<State>: { content, totalElements, ... }
        }

        // 3️⃣ Helper: build row data array for a state item
        async function buildRow(item, serialNo) {
            const usedRes = await fetch(
                new URL(`/api/location/state/is-used/${item.stateId}`, baseUrl1),
                { credentials: "include" }
            );
            const usedData = await usedRes.json();
            const isUsed = usedData.used;

            return {
                stateId: item.stateId,
                rowData: [
                    serialNo,
                    item.stateName,
                    isUsed
                        ? `<i class="fa fa-pen text-secondary"
                               title="State already used"
                               style="cursor:not-allowed; opacity:0.3;"></i>`
                        : `<i class="fa fa-pen text-muted cursor-pointer"
                               title="Edit"
                               onclick="editState(${item.stateId})"></i>`
                ]
            };
        }

        // 4️⃣ Init DataTables with server-side + custom Excel export
        $('#statetableID').DataTable({
            dom: 'Bfrtip',
            serverSide: true,
            processing: true,
            scrollX: false,
            info: true,
            paging: true,
            pageLength: 10,
            lengthMenu: [
                [10, 25, 50, 100],
                [10, 25, 50, 100]
            ],

			buttons: [
			    {
			        text: 'Export to Excel',
			        className: 'btn btn-success',
			        action: async function () {
			            try {
			                const table = $('#statetableID').DataTable();
			                const searchTerm = table.search();

			                // Fetch up to 1000 records — no is-used check needed
			                const allData = await fetchStatesPage(0, 1000, searchTerm);

			                // Directly map content to rows — no async needed
			                const excelRows = allData.content.map((item, index) => [
			                    index + 1,        // Serial
			                    item.stateName    // State Name
			                ]);

			                if (typeof XLSX !== 'undefined') {
			                    const ws = XLSX.utils.aoa_to_sheet([
			                        ['#', 'State Name'],
			                        ...excelRows
			                    ]);
			                    const wb = XLSX.utils.book_new();
			                    XLSX.utils.book_append_sheet(wb, ws, 'State List');
			                    XLSX.writeFile(wb, 'State_List.xlsx');
			                } else {
			                    // Fallback: CSV
			                    const csvContent = [
			                        ['#', 'State Name'].join(','),
			                        ...excelRows.map(r => r.join(','))
			                    ].join('\n');
			                    const blob = new Blob([csvContent], { type: 'text/csv' });
			                    const a = document.createElement('a');
			                    a.href = URL.createObjectURL(blob);
			                    a.download = 'State_List.csv';
			                    a.click();
			                }
			            } catch (err) {
			                console.error("Excel export error:", err);
			                alert("Export failed. Please try again.");
			            }
			        }
			    }
			],

            // 5️⃣ Server-side ajax — passes DataTables search term to backend
            ajax: async function (dtParams, callback) {
                try {
                    const page = Math.floor(dtParams.start / dtParams.length);
                    const size = dtParams.length;
                    const search = dtParams.search?.value?.trim() || '';

                    const statesPage = await fetchStatesPage(page, size, search);

                    // Fetch is-used for current page in parallel
                    const rows = await Promise.all(
                        statesPage.content.map((item, index) =>
                            buildRow(item, dtParams.start + index + 1)
                        )
                    );

                    callback({
                        draw: dtParams.draw,
                        recordsTotal: statesPage.totalElements,
                        recordsFiltered: statesPage.totalElements,
                        data: rows.map(r => r.rowData)
                    });

                } catch (err) {
                    console.error("DataTables ajax error:", err);
                    callback({ draw: dtParams.draw, recordsTotal: 0, recordsFiltered: 0, data: [] });
                }
            },

            columnDefs: [
                { targets: 0, title: '#' },
                { targets: 1, title: 'State Name' },
                { targets: 2, title: 'Action', orderable: false, searchable: false }
            ],

            initComplete: function () {
                $('.dt-buttons').css({ 'float': 'left', 'margin-right': '10px' });
                $('.dataTables_filter').css({ 'float': 'right', 'margin-bottom': '10px' });
            }
        });

    } catch (error) {
        console.error("Fetch Error:", error);
    }
}


// Edit state event
function editState(stateId) {
	  const allowed =allowedActions || [];

	if (!allowed.includes("Edit")) {
	  alert(" You do not have permission to edit.");
	  return;
	}
    fetch(new URL(`/api/location/states/${stateId}`,baseUrl1)	, {
	    credentials: "include"
	})
        .then(response => response.json())
        .then(data => {
            // Ensure 'stateId' from backend is used here
            document.getElementById('State_2').value = data.stateName || '';  // populate the state name
            selectedStateId = data.stateId;  // use the correct field name for the stateId
            $('#exampleModalScrollableStateUp').modal('show');
        })
        .catch(err => {
            console.error("Edit Error:", err);
            alert("Error fetching state data.");
        });
}

// Update state
function stateUpdate(stateId) {
    const updatedStateName = document.getElementById('State_2').value.trim();

    // Step 1: Check if the state already exists
    $.ajax({
        url: new URL('/api/location/check?State_name=' + encodeURIComponent(updatedStateName), baseUrl1),
        type: 'GET',
        xhrFields: {
            withCredentials: true
        },
        success: function (response) {
            // If the same state name exists and belongs to a *different* record, show popup
            if (response.exists && response.id != stateId) {
                showModalPopup("State already exists!");
            } else {
                // Step 2: Proceed to update if not duplicate
                const updatedState = {
                    stateName: updatedStateName,
                    modifiedBy: createdById,
                    modifiedDate: getIndianDateTimeFormat(new Date())
                };

                fetch(new URL(`/api/location/states/${stateId}`, baseUrl1), {
                    method: 'PUT',
                    headers: { 
                        'Content-Type': 'application/json' 
                    },
                    body: JSON.stringify(updatedState),
                    credentials: 'include'
                })
                .then(response => {
                    if (response.ok) {
                        showPopup("Updated Successfully!", "VTSRegister.jsp");
                        $('#exampleModalScrollableStateUp').modal('hide');
                        fetchStates(); // Refresh the state list
                    } else {
                        alert("Update failed.");
                    }
                })
                .catch(err => {
                    console.error("Update Error:", err);
                    alert("Error updating state.");
                });
            }
        },
        error: function (xhr, status, error) {
            console.error("Check Error:", error);
            alert("Error while checking state.");
        }
    });
}

let selectedvehid = null;

$(document).ready(function () {
    // Create button triggers confirmation modal
    $("#submitvehtype").click(function () {
		var vehicletype = $('#vehicletype').val().trim();
		if (!vehicletype) {
		        $('#vehicletypeError').show();
		        return;
		    } else {
		        $('#vehicletypeError').hide();
		    }
        $("#exampleModalCenter85").modal("show");
    });

    // Confirm - NO
    $(".btn-secondary[data-dismiss='modal']").click(function () {
        $("#exampleModalCenter85").modal("hide");
    });

    // Confirm - YES
    $("#confirmvehtypeYes").click(function () {
        $("#exampleModalCenter85").modal("hide");
        vehicletypeaddevent();
    });

    // Fetch initial vehicle type list
    fetchvehicletype();
});

// Update - "Submit" button click
$("#vehtypeupd").click(function () {
    console.log("Update clicked - Modal will show");
	
	let vehicleupdatetype  = $("#vehicletype1").val().trim();
	if(!vehicleupdatetype){
		$("#vehicletype1Error").show();
	}
	else{
		$("#vehicletype1Error").hide();
    $("#exampleModalCenter86").modal("show");
	}
});

$("#cancelvehmodal").click(function () {
    console.log("No clicked - Modal will hide");
    $("#exampleModalCenter86").modal("hide");
});

// Update - "Yes" button click
$(document).on("click", "#confirmvehtypeupd", function () {
    $("#exampleModalCenter86").modal("hide");
    if (selectedvehid) {
        vehicletypeupdate(selectedvehid);
    } else {
        alert("Data not found for update.");
    }
});

function vehicletypeaddevent() {
    var vehicletype = $('#vehicletype').val().trim();
    /*if (!vehicletype) {
        $('#vehicletypeError').show();
        return;
    } else {
        $('#vehicletypeError').hide();
    }
*/
    // Check if vehicle type already exists
    $.ajax({
        url: new URL('/api/vtype/check?Vtype=' + encodeURIComponent(vehicletype),baseUrl1),
        type: 'GET',
		xhrFields: {
			    withCredentials: true
			},
        success: function (response) {
            if (response.exists) {
				showModalPopup("Vehicle Type already exists!");
                //alert("Vehicle Type already exists!");
            } else {
                insertVehicleType(vehicletype);
            }
        },
        error: function (xhr, status, error) {
            console.error("Check Error:", error);
            alert("Error while checking vehicle type.");
        }
    });
}

function insertVehicleType(vehicletype) {
    let currentDateTimeString = getIndianDateTimeFormat(new Date());

    var requestData = {
        "vtype": vehicletype,
        "created_by": createdById,
        "created_date": currentDateTimeString
    };

    $.ajax({
        url: new URL('/api/vtype',baseUrl1),
        type: 'POST',
		xhrFields: {
			    withCredentials: true
			},
        contentType: 'application/json',
        data: JSON.stringify(requestData),
        dataType: 'json',
        success: function (response) {
            if (response && response.status === "Success") {
                showPopup("Inserted Successfully", "VTSRegister.jsp");
            } else {
                alert("Record not inserted. Please try again.");
            }
        },
        error: function (xhr, status, error) {
            console.error("Insert AJAX Error:", error);
            alert("An error occurred while inserting: " + error);
        }
    });
}

async function fetchvehicletype() {
    try {
        const response = await fetch(
            new URL('/api/vtype', baseUrl1),
            { credentials: "include" }
        );

        if (!response.ok) throw new Error("Fetch failed");

        const vehicleTypes = await response.json();
        let tableRows = '';

        for (let index = 0; index < vehicleTypes.length; index++) {
            const item = vehicleTypes[index];

            // 🔍 Check if vehicle type is used
            const usedRes = await fetch(
                new URL(`/api/vtype/vehicletype/is-used/${item.vid}`, baseUrl1),
                { credentials: "include" }
            );
            const usedData = await usedRes.json();
            const isUsed = usedData.used;

            tableRows += `
                <tr id="${item.vid}">
                    <td>${index + 1}</td>
                    <td>${item.vtype}</td>
                    <td>
                        ${
                            isUsed
                                ? `<i class="fa fa-pen text-secondary"
                                       title="Vehicle Type already used"
                                       style="cursor:not-allowed; opacity:0.3;"></i>`
                                : `<i class="fa fa-pen text-muted cursor-pointer"
                                       title="Edit"
                                       onclick="editvehicletype(${item.vid})"></i>`
                        }
                    </td>
                </tr>
            `;
        }

        document.querySelector("#tableID1 tbody").innerHTML = tableRows;

        if ($.fn.DataTable.isDataTable('#tableID1')) {
            $('#tableID1').DataTable().destroy();
        }

		$('#tableID1').DataTable({
		    dom: 'Bfrtip',
		    scrollX: false,
		    info: true,          // Show entry information
		    paging: true,        // Enable frontend pagination
		    pageLength: 10,      // Default rows per page
		    lengthMenu: [
		        [10, 25, 50, 100],
		        [10, 25, 50, 100]
		    ],
		    buttons: [{
		        extend: 'excel',
		        text: 'Export to Excel',
		        title: 'Vehicle Type List'
		    }]
		});

        $('.dt-buttons').css({ 'float': 'left', 'margin-right': '10px' });
        $('.dataTables_filter').css({ 'float': 'right', 'margin-bottom': '10px' });

    } catch (error) {
        console.error("Fetch Error:", error);
    }
}


function editvehicletype(vid) {
	  const allowed =allowedActions || [];

	if (!allowed.includes("Edit")) {
	  alert(" You do not have permission to edit.");
	  return;
	}
    fetch(new URL(`/api/vtype/${vid}`,baseUrl1)	, {
	    credentials: "include"
	})
        .then(response => response.json())
        .then(data => {
            document.getElementById('vehicletype1').value = data.vtype || '';
            selectedvehid = data.vid;
            $('#exampleModalScrollableConUp').modal('show');
        })
        .catch(err => {
            console.error("Edit Error:", err);
            alert("Error fetching vehicle type.");
        });
}

function vehicletypeupdate(vid) {
    const updatedVehType = document.getElementById('vehicletype1').value.trim();

    // Step 1: Check if vehicle type already exists
    $.ajax({
        url: new URL('/api/vtype/check?Vtype=' + encodeURIComponent(updatedVehType), baseUrl1),
        type: 'GET',
        xhrFields: {
            withCredentials: true
        },
        success: function (response) {
            // If vehicle type already exists and belongs to a *different* record, show popup
            if (response.exists && response.id != vid) {
                showModalPopup("Vehicle Type already exists!");
            } else {
                // Step 2: Proceed to update if not duplicate
                const updatedVeh = {
                    vtype: updatedVehType,
                    modified_by: createdById,
                    modified_date: getIndianDateTimeFormat(new Date())
                };

                fetch(new URL(`/api/vtype/${vid}`, baseUrl1), {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(updatedVeh),
                    credentials: 'include'
                })
                .then(response => {
                    if (response.ok) {
                        showPopup("Updated Successfully!", "VTSRegister.jsp");
                        $('#exampleModalScrollableConUp').modal('hide');
                        fetchvehicletype(); // Refresh list
                    } else {
                        alert("Update failed.");
                    }
                })
                .catch(err => {
                    console.error("Update Error:", err);
                    alert("Error updating vehicle type.");
                });
            }
        },
        error: function (xhr, status, error) {
            console.error("Check Error:", error);
            alert("Error while checking vehicle type.");
        }
    });
}

$(document).ready(function () {
    // Create - "Submit" button click
	$("#submitregtype").click(function () {
	    var registertype = $('#registertype').val().trim();
	    
	    if (!registertype) {
	        $('#registertypeError').show(); // Show error message
	    } else {
	        $('#registertypeError').hide(); // Hide error if previously shown
	        console.log("Create clicked - Modal will show");
	        $("#exampleModalCenter80").modal("show"); // Show confirmation modal
	    }
	});

    // Create - "No" button click
    $(".btn-secondary[data-dismiss='modal']").click(function () {
        console.log("No clicked - Modal will hide");
        $("#exampleModalCenter80").modal("hide");
    });

    // Create - "Yes" button click
    $(document).on("click", "#confirmregYes", function () {
        console.log("Yes clicked - Proceeding with creation");
        $("#exampleModalCenter80").modal("hide");
        regtypeaddevent();
    });

    // Update - "Submit" button click
    $("#regtypeupd").click(function () {
        console.log("Update clicked - Modal will show");
		let registertype1 = $("#registertype1").val().trim();
		
		if(!registertype1){
			$("#registertype1Error").show();
		}
		else{
			
			$("#registertype1Error").hide();
		
        $("#exampleModalCenter75").modal("show");
		}
    });

	$("#cancelregmodal").click(function () {
	      console.log("No clicked - Modal will hide");
	      $("#exampleModalCenter75").modal("hide");
	  });


    // Update - "Yes" button click
    $(document).on("click", "#confirmregtypeupd", function () {
        $("#exampleModalCenter75").modal("hide");
        if (selectedtid) {
            regtypeupdate(selectedtid);
        } else {
            alert("Data not found for update.");
        }
    });

    // Fetch initial table
    fetchregistertype();
});

let selectedtid = null;  // Must store only ID

function regtypeaddevent() {
    var registertype = $('#registertype').val().trim();
	/*if (!registertype) {
	    $('#registertypeError').show();
	    return;
	  } else {
	    $('#registertypeError').hide();
	  }*/

    // Check if Register Type already exists
    $.ajax({
        url: new URL('/api/Regtype/check?regtype=' + encodeURIComponent(registertype),baseUrl1),
        type: 'GET',
		xhrFields: {
			    withCredentials: true
			},
        success: function (response) {
            if (response.exists) {
				showModalPopup("Register Type already exists!");
                //alert("Register Type already exists!");
            } else {
                // Proceed to insert
                insertRegisterType(registertype);
            }
        },
        error: function (xhr, status, error) {
            console.error("Check API Error:", error);
            alert("An error occurred while checking: " + error);
        }
    });
}

// Function to show the modal with a custom error message
function showModalPopup(message) {
    // Set the error message
    $('#errorMessageupcon').text(message);
    // Show the error modal
    $('#exampleModalCenterDupUPcon').modal('show');
}

// Function to close the error modal when "OK" is clicked
$(document).on('click', '#modalokk', function() {
    // Hide the error modal when "OK" is clicked
    $('#exampleModalCenterDupUPcon').modal('hide');
});

function insertRegisterType(registertype) {
    let currentDateTimeString = getIndianDateTimeFormat(new Date());

    var requestData = {
        "regtype": registertype,
        "created_by": createdById,
        "created_date": currentDateTimeString
    };

    $.ajax({
        url: new URL('/api/Regtype',baseUrl1),
        type: 'POST',
		xhrFields: {
			    withCredentials: true
			},
        contentType: 'application/json',
        data: JSON.stringify(requestData),
        dataType: 'json',
        success: function (response) {
            if (response && response.status === "Success") {
                showPopup("Inserted Successfully", "VTSRegister.jsp");
            } else {
                alert("Record not inserted. Please try again.");
            }
        },
        error: function (xhr, status, error) {
            console.error("Insert AJAX Error:", error);
            alert("An error occurred while inserting: " + error);
        }
    });
}

async function fetchregistertype() {
    const apiUrl = new URL('/api/Regtype', baseUrl1);

    try {
        const response = await fetch(apiUrl, {
            method: "GET",
            credentials: "include"
        });

        if (!response.ok) throw new Error("Failed to fetch register types");

        const registertypes = await response.json();
        let tableRows = '';

        for (let index = 0; index < registertypes.length; index++) {
            const item = registertypes[index];

            // 🔍 check if regtyp is used
            const usedRes = await fetch(
                new URL(`/api/Regtype/is-regtyp-used/${item.tid}`, baseUrl1),
                { credentials: "include" }
            );

            const usedData = await usedRes.json();
            const isUsed = usedData.used;

            tableRows += `
                <tr id="${item.tid}">
                    <td>${index + 1}</td>
                    <td>${item.regtype}</td>
                    <td>
                        ${
                            isUsed
                            ? `<i class="fa fa-pen text-secondary"
                                   title="Register Type already used"
                                   style="cursor:not-allowed; opacity:0.3;"></i>`
                            : `<i class="fa fa-pen text-muted cursor-pointer"
                                   title="Edit"
                                   onclick="editregistertype(${item.tid})"></i>`
                        }
                    </td>
                </tr>
            `;
        }

        document.querySelector("#tableID tbody").innerHTML = tableRows;

        if ($.fn.DataTable.isDataTable('#tableID')) {
            $('#tableID').DataTable().destroy();
        }

		$('#tableID').DataTable({
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
		        title: 'Register Type List'
		    }]
		});

    } catch (error) {
        console.error('Error fetching register types:', error);
    }
}


function editregistertype(tid) {
	  const allowed = allowedActions || [];

	if (!allowed.includes("Edit")) {
	  alert(" You do not have permission to edit.");
	  return;
	}
    fetch(new URL(`/api/Regtype/${tid}`,baseUrl1)	, {
	    credentials: "include"
	})
        .then(response => response.json())
        .then(data => {
            document.getElementById('registertype1').value = data.regtype || '';
            selectedtid = data.tid;  // Only store the ID properly
            $('#exampleModalScrollableINUp').modal('show');
        })
        .catch(error => {
            console.error('Error fetching register type for editing:', error);
            alert('Error fetching register type');
        });
}

function regtypeupdate(tid) {
    const updatedRegType = 	$("#registertype1").val().trim();
	
	

    // Step 1: Check if the Register Type already exists
    $.ajax({
        url: new URL('/api/Regtype/check?regtype=' + encodeURIComponent(updatedRegType), baseUrl1),
        type: 'GET',
        xhrFields: {
            withCredentials: true
        },
        success: function (response) {
            // If the same name exists but belongs to a *different ID*, block the update
            if (response.exists && response.id != tid) {
                showModalPopup("Register Type already exists!");
            } else {
                // Step 2: Proceed to update if no duplicate found
                const updatedregtype = {
                    regtype: updatedRegType,
                    modified_by: createdById,
                    modified_date: getIndianDateTimeFormat(new Date())
                };

                fetch(new URL(`/api/Regtype/${tid}`, baseUrl1), {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(updatedregtype),
                    credentials: 'include'
                })
                .then(response => {
                    if (response.ok) {
                        showPopup("Updated Successfully!", "VTSRegister.jsp");
                        $('#exampleModalScrollableINUp').modal('hide');
                        fetchregistertype(); // Refresh list
                    } else {
                        alert('Failed to update register type');
                    }
                })
                .catch(error => {
                    console.error('Error updating register type:', error);
                    alert('Error updating register type');
                });
            }
        },
        error: function (xhr, status, error) {
            console.error("Check API Error:", error);
            alert("An error occurred while checking: " + error);
        }
    });
}

async function loadCitiesByState(stateId, selectedCityId = null) {
    if (!stateId) {
        $('#city2').html('<option value="">Select City</option>');
        return;
    }

    try {
        const response = await fetch(
            new URL(`/api/location/cities/states/${stateId}`, baseUrl1),
            { credentials: "include" }
        );

        const cities = await response.json();

        const cityDropdown = document.getElementById('city2');
        cityDropdown.innerHTML = '<option value="">Select City</option>';

        cities.forEach(city => {
            const option = document.createElement('option');
            option.value = city.cityId;
            option.text = city.cityName;
            cityDropdown.appendChild(option);
        });

        // ✅ Preselect city during edit
        if (selectedCityId) {
            $('#city2').val(selectedCityId);
        }

    } catch (err) {
        console.error("Error loading cities:", err);
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

function showPopup(message, redirectUrl) {
    var popup = $('<div class="popup">' + message + '</div>').appendTo('body').hide().fadeIn(400);
    setTimeout(function () {
        popup.fadeOut(400, function () {
            $(this).remove();
            window.location = redirectUrl;
        });
    }, 2000);
}

