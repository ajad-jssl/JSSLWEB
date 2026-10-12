let date_allowed = 0;
const MainPage =  window.location.pathname.split("/").pop()+'.jsp';
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


document.addEventListener("DOMContentLoaded", function () {

    document.getElementById("entry1").addEventListener("click", function () {

        // safe check
        const allowed = typeof allowedActions !== "undefined"
            ? allowedActions
            : [];

        if (!allowed.includes("Insert")) {
            alert("You do not have permission to Insert.");
            $('#exampleModalScrollable123').modal('hide');
            return;
        }

        $('#exampleModalScrollable123').modal('show');
    });

});

let ALLOWED_NET_HOURS = 0;
const CANONICAL_SHIFT_ID = { A: 1, B: 2, G: 5 }; // fixed ids, ignore duplicate rows
let RECOMMENDED_SHIFT_CODE = null;
$(document).ready(function() {
	loadActions();
	loadDateAllowed();

    addShiftRow();
/* $(".emp-name").text(sessionStorage.getItem("username") || "N/A");*/

    const $yearSelect = $("#yearSelect");
    const $monthSelect = $("#monthSelect");
    const $weekSelect = $("#weekSelect");
    const $tableHeader = $("#tableHeader");
	
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth(); // 0-based
    const currentWeek = getISOWeekNumber(currentDate);

   
    // Populate Year Dropdown

    $yearSelect.empty();
    for (let y = currentYear;y >= currentYear-1 ;y--) {
        $("<option>", { value: y, text: y }).appendTo($yearSelect);
    }
	
	const $reportYearSelect = $("#yearSelectsss"); // Fixed selector - target the SELECT not the TD

	$reportYearSelect.empty();
	$reportYearSelect.append('<option value="">Select the year</option>');

	for (let y = currentYear; y >= currentYear - 5; y--) {
	    $("<option>", { value: y, text: y }).appendTo($reportYearSelect);
	}

	// Set current year as default
	$reportYearSelect.val(currentYear);

	// Load summary for current year on page load
	loadSummary(currentYear);
   
    // Populate Month Dropdown
  
    $monthSelect.empty();
    for (let m = 0;m <= 11;m++) {
        $("<option>", {
            value: m,
            text: new Date(0, m).toLocaleString('default', { month: 'long' })
        }).appendTo($monthSelect);
    }
    $monthSelect.val(currentMonth);

   
    // Populate Week Dropdown for selected month/year
   
    populateWeeksForMonth(currentMonth, currentYear);

 
    // Auto-render table for current week on page load
   
    if ($weekSelect.val()) {
        const days = getISOWeekDates(parseInt($weekSelect.val()), currentYear)
            .filter(d => d.getFullYear() === currentYear && d.getMonth() === currentMonth);
        if (days.length > 0) renderTable(days, currentYear);
    }



    $yearSelect.on("change", function() {

        const year = parseInt($(this).val());

        // reset month to January
        $monthSelect.val(0);

        // populate weeks for January
        populateWeeksForMonth(0, year);

        $weekSelect.val("");

        $tableHeader.empty();

        $("#container1, #container2").hide();

        $("#exampleModalScrollable123").removeClass("scroll-enabled");
    });
	$reportYearSelect.on("change", function() {
	    const selectedYear = $(this).val();
	    
	    if (selectedYear) {
	        // Load summary data for selected year
	        loadSummary(selectedYear);
	        $("#monthlyDetailsSection").hide();
	        // Update the display year text if you have one
	        $("#selectedyear").text(selectedYear);
	    } else {
	        // Clear summary if no year selected
	        clearSummaryTable();
	    }
	});
  
    // Month change - populate week dropdown

    $monthSelect.on("change", function() {
        const month = parseInt($(this).val());
        const year = parseInt($yearSelect.val());
        if (isNaN(month) || !year) return;

        populateWeeksForMonth(month, year);

        $tableHeader.empty();
        $("#container1, #container2").hide();
        $("#exampleModalScrollable123").removeClass("scroll-enabled");
    });

   
    // Week change - render table

    $weekSelect.on("change", function() {
        const year = parseInt($yearSelect.val());
        const month = parseInt($monthSelect.val());
        const week = parseInt($(this).val());

        if (!year || isNaN(month) || !week) return;

        let days = getISOWeekDates(week, year)
            .filter(d => d.getFullYear() === year && d.getMonth() === month);
        if (days.length === 0) return;
        $("#exampleModalScrollable123").removeClass("scroll-enabled");
        renderTable(days, year);

    });

   
    // Functions

    function populateWeeksForMonth(month, year) {
        const weeks = getWeeksInMonth(month, year);
        $weekSelect.empty().append('<option value="">-- Select Week --</option>');

        weeks.forEach(w => {
            $("<option>", { value: w, text: "Week " + w }).appendTo($weekSelect);
        });

        // Preselect current week if month/year matches today
        if (month === currentMonth && year === currentYear && weeks.includes(currentWeek)) {
            $weekSelect.val(currentWeek);
        }
    }

    function renderTable(days, year) {
        $tableHeader.empty();

        $tableHeader.append(createTH("Location"));
        $tableHeader.append(createTH("Name"));



        // Inside your renderTable function, update the <th> click handler
		// Inside your renderTable function, update the <th> click handler
		days.forEach(d => {
		    const $th = $("<th>")
		        .text(formatDate(d))
		        .css("cursor", "pointer")
		        .on("click", function() {

		            const clickedDate = new Date(d.getFullYear(), d.getMonth(), d.getDate());
		            const today = new Date();
		            today.setHours(0, 0, 0, 0);

		            // ✅ NEW: Check if date is in the future
		            if (clickedDate > today) {
		                $("#container2").hide();
		                $("#exampleModalScrollable123").removeClass("scroll-enabled");
		                $("#customErrorMessage").text("Cannot enter data for future dates!");
		                $("#customErrorModal").modal('show');
		                return;
		            }

		            //  Check if date is more than 30 days in the past
		            const thirtyDaysAgo = new Date(today);
		            thirtyDaysAgo.setDate(today.getDate() -date_allowed);
		            thirtyDaysAgo.setHours(0, 0, 0, 0);

		            if (clickedDate < thirtyDaysAgo) {
		                $("#container2").hide();
		                $("#exampleModalScrollable123").removeClass("scroll-enabled");
		                
		                // Format the cutoff date for display
		                const cutoffDateStr = formatDate(thirtyDaysAgo);
		                
						$("#customErrorMessage").text(
						    `Data entry or modification is not allowed for dates older than ${date_allowed} days. ` +
						    `Please select a date from ${cutoffDateStr} onwards.`
						);
		                $("#customErrorModal").modal('show');
		                return;
		            }

		            //  Remove highlight from all date headers
		            $("#tableHeader th").removeClass("selected-date-header");
		            
		            //  Add highlight to clicked header
		            $(this).addClass("selected-date-header");
		            
		            //  Highlight all cells in the same column
		            const columnIndex = $(this).index();
		            $("#attendanceBody tr").each(function() {
		                $(this).find("td").removeClass("selected-date-cell");
		                $(this).find("td").eq(columnIndex).addClass("selected-date-cell");
		            });

		            const selectedDate = $(this).text();
		            loadTotalsForAllDates(days);
		            checkAndLoadDrawingEntry(selectedDate);
		        });
		    $tableHeader.append($th);
		});



        $tableHeader.append(createTH("Total"));

        fetchLocations().done(() => {
            createAttendanceBody(days, year);
        });
		
		const selectedWeek = $weekSelect.val();
		   highlightExistingEntries(days, year, selectedWeek);
        $("#container1").show();
        $("#container2").hide();
    }


    function createTH(text) {
        return $("<th>").text(text);
    }

    function loadTotalsForAllDates(days) {

        days.forEach(d => {

            const dateStr = formatDate(d);

            fetchTotalGrandTotal(dateStr).done(res => {

                const value = Number(res.totalGrandTotal || 0).toFixed(2);

                // Fill only matching date column
                document.querySelectorAll(`#attendanceBody td[data-date="${dateStr}"]`)
                    .forEach(cell => {
                        cell.innerText = value;
                        cell.style.display = ""; //  show
                    });

                // Update TOTAL column
                document.querySelectorAll("#attendanceBody tr").forEach(row => {
                    let total = 0;
                    row.querySelectorAll("td[data-date]").forEach(td => {
                        total += Number(td.innerText || 0);
                    });
                    row.querySelector("td:last-child").innerText = total.toFixed(2);
                });
            });
        });
    }



    function getWeeksInMonth(month, year) {
        const weeks = new Set();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);

        for (let d = new Date(firstDay);d <= lastDay;d.setDate(d.getDate() + 1)) {
            let weekNum = getISOWeekNumber(d);
            let weekYear = getISOWeekYear(d);

            if (weekYear < year && d.getMonth() === month && d.getDate() <= 7) {
                weekNum = 1;
            }

            weeks.add(weekNum);
        }

        return Array.from(weeks).sort((a, b) => a - b);
    }

    function getISOWeekDates(week, year) {
        const jan4 = new Date(year, 0, 4);
        const day = jan4.getDay() || 7;
        const monday = new Date(jan4);
        monday.setDate(jan4.getDate() - day + 1 + (week - 1) * 7);

        const dates = [];
        for (let i = 0;i < 7;i++) {
            const d = new Date(monday);
            d.setDate(monday.getDate() + i);
            dates.push(d);
        }
        return dates;
    }

    function getISOWeekNumber(date) {
        const d = new Date(date);
        d.setHours(0, 0, 0, 0);
        d.setDate(d.getDate() + 3 - (d.getDay() || 7));
        const week1 = new Date(d.getFullYear(), 0, 4);
        return 1 + Math.round(((d - week1) / 86400000 - 3 + (week1.getDay() || 7)) / 7);
    }

    function getISOWeekYear(date) {
        const d = new Date(date);
        d.setHours(0, 0, 0, 0);
        d.setDate(d.getDate() + 3 - (d.getDay() || 7));
        return d.getFullYear();
    }
    $(".revisionSelect").val("N").trigger("change");


    $("#saveButton").on("click", function() {
        let flags = validateShiftTable();
        console.log(flags);
        if (!flags) {

            return;
        }


        $("#confimationDrawingEntry").modal("show");


    });



    $("#confirmdrawingentry").click(function() {
		$("#confimationDrawingEntry").modal("hide");


        const result = trackShiftTableData();

        console.log("the resul",result);



       if (!result.hasChanges) {
          
			showPopup("No Feilds Changes", "DrawingEntry.jsp");
            return;
        }

        inserthour(result.payload);
    });




	$(document).on("change", "#shiftSelect", function() {
	    const selectedShift = $(this).val();
	    
	    if (selectedShift) {
	        // Show the shift table container
	        $(".subContainer").show();
	        
	        // Pre-select the same shift in all rows and disable them
	        $("#shiftTableBody tr:not(#shiftRowTemplate) .shiftSelect").each(function() {
	            $(this).val(selectedShift).prop("disabled", true).addClass("readonly-select");
	        });
	    } else {
	        // Hide shift table if no shift selected
	        $(".subContainer").hide();
	    }
	});
});



function loadDateAllowed() {

    fetch(new URL("/api/global/config-value?config_key=date_allowed", baseUrl), {
        method: "GET",
        credentials: "include"
    })
    .then(response => response.json())
    .then(data => {

        if (data.config_value) {
            date_allowed = parseInt(data.config_value);
        }

        console.log("Date Allowed:", date_allowed);

    })
    .catch(error => console.error("Error loading date_allowed:", error));
}

function clearSummaryTable() {
    for (let i = 1; i <= 12; i++) {
        document.getElementById(i.toString()).innerText = "0";
    }
    document.getElementById("totalyear").innerText = "0";
}

let locationMap = {};  // global

function fetchLocations() {
    return $.ajax({
        url: new URL("/api/location/getAll", baseUrl).toString(),
        type: "GET",
        xhrFields: { withCredentials: true }
    }).done(function(response) {
        // Safety check
        if (response?.Data?.length) {
            response.Data.forEach(loc => {
                locationMap[loc.Loc_id] = loc.Location; // Map ID → Location
            });
        }
    });
}


function createAttendanceBody(days, year) {

    const tbody = document.getElementById("attendanceBody");
    tbody.innerHTML = "";


    //const userId = sessionStorage.getItem("user_id") || "N/A";
    const username = sessionStorage.getItem("username") || "N/A";

    const tr = document.createElement("tr");


    let tdLocation = document.createElement("td");

    const location =
        locationMap[sessionStorage.getItem("loction_id")] || "N/A";

    tdLocation.innerText = location.toUpperCase();

    tr.appendChild(tdLocation);




    let tdName = document.createElement("td");


    tdName.innerText = username.toUpperCase();
    tr.appendChild(tdName);


    days.forEach(d => {
        if (d.getFullYear() === year) {
            let td = document.createElement("td");
            td.dataset.date = formatDate(d);
            td.innerText = "";
            tr.appendChild(td);
        }
    });

    let tdTotal = document.createElement("td");
    tdTotal.innerText = "0";
    tr.appendChild(tdTotal);

    tbody.appendChild(tr);
}
function formatDate(date) {
    return String(date.getDate()).padStart(2, '0') + '/' + String(date.getMonth() + 1).padStart(2, '0');
}





function showDataForDate(dateStr) {
    $("#exampleModalScrollable123").addClass("scroll-enabled");

    populateShiftDropdown();
    populateContractDropdown();
    populateModalAndActivityDropdowns();
    populateReasonDropdown();

    // Store for display (with year)
    const year = $("#yearSelect").val();
    const fullDate = dateStr + "/" + year;
    $("#selecteddate").text(fullDate);  // Display: "11/03/2026"
    
    //  ADD THIS LINE - Store raw value for backend
    $("#selectedDateValue").val(dateStr);  // Value: "11/03"
    
    $("#selectedyear").text(year);

    let yearselect = $("#yearSelect").val().trim();
    loadSummary(yearselect);

    $("#container2").show();
    $(".subContainer").hide();
    $("#shiftSelect").val("");

    fetchTotalGrandTotal(dateStr).done(function(res) {
        const value = Number(res.totalGrandTotal || 0);
        const rows = document.querySelectorAll("#attendanceBody tr");

        rows.forEach(row => {
            let rowTotal = 0;
            row.querySelectorAll("td[data-date]").forEach(cell => {
                if (cell.dataset.date === dateStr) {
                    cell.style.display = "";
                    cell.innerText = value.toFixed(2);
                }
                rowTotal += Number(cell.innerText || 0);
            });
            row.querySelector("td:last-child").innerText = rowTotal.toFixed(2);
        });
    });
}




function fetchTotalGrandTotal(dateStr) {
    return $.ajax({
        url: new URL("/api/Drawing_txn/total-grand-total", baseUrl).toString(),
        type: "GET",
        data: {
            userId: sessionStorage.getItem("id"),
            year: $("#yearSelect").val(),
            txtDate: dateStr
        },
        xhrFields: { withCredentials: true }
    });
}







function addShiftRow() {
    const tbody = document.querySelector("#shiftTableBody");
    const template = document.querySelector("#shiftRowTemplate");

    const newRow = template.cloneNode(true);
    newRow.removeAttribute("id");
    newRow.style.display = "";

    // Reset inputs
    newRow.querySelectorAll("input").forEach(input => {
        input.value = "";
        input.readOnly = input.classList.contains("Total") ||
            input.classList.contains("GTotal") ||
            input.classList.contains("IHours") ||
            input.classList.contains("reworkInput") ||
            input.classList.contains("ecNoInput");
    });

    // Reset selects
    newRow.querySelectorAll("select").forEach(select => {
        select.selectedIndex = 0;
    });

	$(newRow).find(".contractSelect")
	      .prop("disabled", false)
	      .removeClass("readonly-select");
	
    // Force Revision = N
    $(newRow).find(".revisionSelect").val("N").trigger("change");

    // Make row-level shift select readonly/disabled
    const rowShiftSelect = $(newRow).find(".shiftSelect");
    rowShiftSelect.prop("disabled", true).addClass("readonly-select");

    tbody.appendChild(newRow);
    
    // Pre-select shift if main dropdown has a value
    const mainShiftValue = $("#shiftSelect").val();
    if (mainShiftValue) {
        rowShiftSelect.val(mainShiftValue);
    }
    
    updateSerialNumbers();
}

let DELETED_RECORD_IDS = [];

function deleteShiftRow(btn) {
    const row = $(btn).closest("tr");

    const recordId = row.attr("data-record-id");

    if (recordId) {
        DELETED_RECORD_IDS.push(parseInt(recordId));
    }

    row.remove();
    updateSerialNumbers();
    
    //  Recalculate Grand Total after deleting row
    updateGrandTotal();
}


function updateSerialNumbers() {
    const rows = document.querySelectorAll(
        "#shiftTableBody tr:not(#shiftRowTemplate)"
    );

    rows.forEach((row, index) => {
        row.querySelector(".slno").innerText = index + 1;
    });
}

$(document).on("change", ".revisionSelect", function() {
    const row = $(this).closest("tr");

    const reworkInput = row.find(".reworkInput");
    const reasonSelect = row.find(".reasonSelect");
    const ecNoInput = row.find(".ecNoInput");
    const dhInput = row.find(".dhInput");
    const ihInput = row.find(".IHours");
    const typeId = parseInt(row.find(".modalselect").val());

    if ($(this).val() === "Y") {
        // Enable rework fields
        reworkInput.prop("readonly", false);
        ecNoInput.prop("readonly", false);
        reasonSelect.prop("disabled", false)
            .removeClass("readonly-select");

        // Clear DH and IH, make both readonly
        dhInput.val("0").prop("readonly", true);
        ihInput.val("0").prop("readonly", true);

    } else {
        // Disable rework fields
        reworkInput.val("").prop("readonly", true);
        ecNoInput.val("").prop("readonly", true);
        reasonSelect.val("")
            .prop("disabled", true)
            .addClass("readonly-select");

        // Restore DH or IH based on modal type
        if (typeId === 4) {
            // Indirect: restore IH only
            ihInput.prop("readonly", false);
            dhInput.val("").prop("readonly", true);
        } else if (!isNaN(typeId) && typeId) {
            // Direct: restore DH only
            dhInput.prop("readonly", false);
            ihInput.val("").prop("readonly", true);
        }
    }

    calculateRowTotals(row);
});

function editdrawing() {
    alert("the edit drawing button is clicked");


}
function populateShiftDropdown() {

    const locationId = sessionStorage.getItem("loction_id");

    return $.ajax({
        url: new URL(
            `/api/drawingentry/shift/by-location?locationId=${locationId}`,
            baseUrl
        ).toString(),
        type: "GET",
        xhrFields: { withCredentials: true }
    }).then(response => {
        $(".shiftSelect").each(function() {
            const dropdown = $(this);
            dropdown.empty().append('<option value="">Select Shift</option>');

			response?.Data?.forEach(shift => {
			    const option = document.createElement("option");
			    option.value = shift.shift_id;
			    option.textContent = shift.shift_code;
			    option.dataset.hours = shift.shift_hours; // for validation later
			    this.appendChild(option); // this = select element in .each
			});
        });
    });
}






function populateContractDropdown() {
    return $.ajax({
        url: new URL("/api/drawingentry/contractlist", baseUrl).toString(),
        type: "GET",
        xhrFields: { withCredentials: true }
    }).then(response => {
        $(".contractSelect").each(function() {
            const dropdown = $(this);
            dropdown.empty().append('<option value="">Select Contract</option>');

            if (response?.Data?.length) {
                response.Data.forEach(contract => {
                    $("<option>", {
                        value: contract.contract_id,
                        text: contract.jobCode
                    }).appendTo(dropdown);
                });
            }
        });
    });
}

$(document).on("wheel keydown", ".Total, .GTotal", function(e) {
    e.preventDefault();
});

let USER_ACTIVITIES = [];  // store user activities

async function populateModalAndActivityDropdowns() {

    const userId = sessionStorage.getItem("id") || 18;

    return Promise.all([

        //  User activities
        $.ajax({
            url: new URL("/api/drawingentry/by-user", baseUrl).toString(),
            type: "GET",
            data: { userId },
            xhrFields: { withCredentials: true }
        }),

        //  Modal type mapping
        $.ajax({
            url: new URL("/api/type_selection/mapping", baseUrl).toString(),
            type: "GET",
            xhrFields: { withCredentials: true }
        }),

        //  All activities API (NEW)
        $.ajax({
            url: new URL("/api/activity_category/getAll", baseUrl).toString(),
            type: "GET",
            xhrFields: { withCredentials: true }
        })

    ]).then(([response, types, activities]) => {

        //  Store ALL activities globally
        window.ALL_ACTIVITIES_GLOBAL = activities;

        //  Store USER activities
        window.ALL_USER_ACTIVITIES = response?.Data || [];
        USER_ACTIVITIES = response?.Data || [];

        const uniqueTypeIds = [...new Set(USER_ACTIVITIES.map(a => a.type_id))];

        // Get only types user currently has access to
        const userTypes = types.filter(t =>
            uniqueTypeIds.includes(t.typeId)
        );

        //  Store ALL types globally
        window.ALL_TYPES = types;

        $(".modalselect").each(function () {

            const dropdown = $(this);
            dropdown.empty().append('<option value="">Select Modal</option>');

            userTypes.forEach(type => {
                $("<option>", {
                    value: type.typeId,
                    text: type.typeName
                }).appendTo(dropdown);
            });

        });

    });

}

//  Add missing modal option if user doesn't have access
function addMissingModalOption(dropdown, typeId) {
    // Check if option already exists
    if (dropdown.find(`option[value="${typeId}"]`).length > 0) {
        return false; // Option exists
    }

    // Find the type details from ALL_TYPES
    const typeInfo = window.ALL_TYPES?.find(t => t.typeId === typeId);
    
    if (typeInfo) {
        // Add the option with special styling
        const option = $("<option>", {
            value: typeInfo.typeId,
            text: typeInfo.typeName + " (No Access)",
            class: "legacy-option"
        });
        
        dropdown.append(option);
        console.log(` Added legacy modal option: ${typeInfo.typeName}`);
        return true; // Added legacy option
    } else {
        console.error(` Could not find type info for typeId: ${typeId}`);
        return false;
    }
}


function addMissingActivityOption(dropdown, activityId, typeId) {

    // Check if option already exists
    if (dropdown.find(`option[value="${activityId}"]`).length > 0) {
        return false;
    }

    // Search inside ALL activities
    const activityInfo = window.ALL_ACTIVITIES_GLOBAL?.find(a =>
        String(a.activityId || a.activity_id) === String(activityId)
    );

    if (activityInfo) {

        const actId = activityInfo.activityId || activityInfo.activity_id;
        const actName = activityInfo.activityName || activityInfo.activity_name;

        const option = $("<option>", {
            value: actId,
            text: actName + " (No Access)",
            class: "legacy-option"
        });

        dropdown.append(option);

        console.log(" Added legacy activity option:", actName);

        return true;
    }

    console.error(" Could not find activity info for activityId:", activityId);

    return false;
}
function loadActivitiesByType(typeId, activityDropdown, preserveLegacy = false) {
    return new Promise((resolve) => {
        
        //Save any existing legacy option before clearing
        let legacyOption = null;
        if (preserveLegacy) {
            legacyOption = activityDropdown.find('.legacy-option').clone();
        }
        
        activityDropdown.empty();
        activityDropdown.append('<option value="">Select Activity</option>');

        const filteredActivities = USER_ACTIVITIES.filter(
            act => String(act.type_id) === String(typeId)
        );

        filteredActivities.forEach(act => {
            $("<option>", {
                value: String(act.activity_id),
                text: act.activity_name
            }).appendTo(activityDropdown);
        });

        //  Re-add legacy option if it was there
        if (legacyOption && legacyOption.length > 0) {
            activityDropdown.append(legacyOption);
        }

        resolve();
    });
}







$(document).on("change", ".contractSelect", function() {
    const contractId = $(this).val();
    const row = $(this).closest("tr");
    const phaseDropdown = row.find(".phaseselect");
    const modalDropdown = row.find(".modalselect");

    phaseDropdown.empty().append('<option value="">Select Phase</option>');

    // Filter modal options based on contract selection
    filterModalsByContract(contractId, modalDropdown);

    if (!contractId) return;

    if (contractId !== "1") {
        loadPhasesByContract(contractId, phaseDropdown);
    }
});



function filterModalsByContract(contractId, modalDropdown) {
    const currentVal = modalDropdown.val();

    modalDropdown.empty().append('<option value="">Select Modal</option>');

    if (contractId === "1") {
        // Stock contract → only show Indirect (typeId = 4)
        const indirectType = window.ALL_TYPES?.find(t => t.typeId === 4);
        if (indirectType) {
            $("<option>", {
                value: indirectType.typeId,
                text: indirectType.typeName
            }).appendTo(modalDropdown);
            modalDropdown.val().trigger("change");
        }
    } else if (contractId) {
        // Non-stock → show all user types EXCEPT indirect (typeId 4)
        const uniqueTypeIds = [...new Set(USER_ACTIVITIES.map(a => a.type_id))];
        const userTypes = (window.ALL_TYPES || []).filter(t =>
            uniqueTypeIds.includes(t.typeId) && t.typeId !== 4
        );

        userTypes.forEach(type => {
            $("<option>", {
                value: type.typeId,
                text: type.typeName
            }).appendTo(modalDropdown);
        });

        // Restore previous selection if it's still valid
        if (currentVal && currentVal !== "4") {
            modalDropdown.val(currentVal);
        }
    } else {
        // No contract selected → show all types
        const uniqueTypeIds = [...new Set(USER_ACTIVITIES.map(a => a.type_id))];
        const userTypes = (window.ALL_TYPES || []).filter(t =>
            uniqueTypeIds.includes(t.typeId)
        );
        userTypes.forEach(type => {
            $("<option>", {
                value: type.typeId,
                text: type.typeName
            }).appendTo(modalDropdown);
        });
    }
}


function loadPhasesByContract(contractId, phaseDropdown) {
    return $.ajax({
        url: new URL("/api/drawingentry/phases", baseUrl).toString(),
        type: "GET",
        data: { contractId: contractId },
        xhrFields: { withCredentials: true }
    }).then(response => {
        phaseDropdown.empty().append('<option value="">Select Phase</option>');

        if (response?.Data?.length) {
            response.Data.forEach(phase => {
                $("<option>", {
                    value: phase,
                    text: phase
                }).appendTo(phaseDropdown);
            });
        }
    });
}




$(document).on("change", ".modalselect", function () {
    const row = $(this).closest("tr");
    const typeId = parseInt($(this).val());
    applyModalLogic(row, typeId);
});


function populateReasonDropdown() {
    return $.ajax({
        url: new URL("/api/reason_selection/mapping", baseUrl).toString(),
        type: "GET",
        xhrFields: { withCredentials: true }
    }).then(response => {
        $(".reasonSelect").each(function() {
            const dropdown = $(this);
            dropdown.empty().append('<option value="">Select</option>');

            response.forEach(reason => {
                $("<option>", {
                    value: reason.reasonId,
                    text: reason.reasonName
                }).appendTo(dropdown);
            });
        });
    });
}

function showFieldError($field, message) {
    clearFieldError($field);

    $field.addClass("field-error");

    const msg = $("<div>")
        .addClass("validation-msg")
        .text(message);

    $field.after(msg);
}



function applyModalLogic(row, typeId) {

    const ihInput = row.find(".IHours");
    const dhInput = row.find(".dhInput");
    const activitySelect = row.find(".activityselect");
    const contractSelect = row.find(".contractSelect");
    const phaseSelect = row.find(".phaseselect");
    const revisionSelect = row.find(".revisionSelect");
    const reworkInput = row.find(".reworkInput");
    const reasonSelect = row.find(".reasonSelect");
    const ecNoInput = row.find(".ecNoInput");

    // RESET hours
    ihInput.prop("readonly", true).val("")
    dhInput.prop("readonly", true).val("");
    activitySelect.empty().append('<option value="">Select Activity</option>');

    if (typeId === 4) {
        // INDIRECT: IH enabled, DH stays readonly
        ihInput.prop("readonly", false);

        // Auto-select Stock (contract_id = 1) and lock contract
		contractSelect.val("1")
		        .prop("disabled", false)
		        .removeClass("readonly-select");
        // Clear and lock phase (no validation needed)
        phaseSelect.empty()
            .append('<option value="">N/A</option>')
            .prop("disabled", true)
            .addClass("readonly-select");

        // Force Rework = No and make it readonly for Indirect
        revisionSelect.val("N")
            .prop("disabled", true)
            .addClass("readonly-select");

        // Clear and lock all rework-related fields
        reworkInput.val("").prop("readonly", true);
        ecNoInput.val("").prop("readonly", true);
        reasonSelect.val("")
            .prop("disabled", true)
            .addClass("readonly-select");

   	} else if (!isNaN(typeId) && typeId) {
			        // DIRECT: DH enabled
			        dhInput.prop("readonly", false);

			        // Unlock contract and phase for direct modals
			        contractSelect.prop("disabled", false)
			            .removeClass("readonly-select");

			        // Clear stock selection if it was set by indirect
			        if (contractSelect.val() === "1") {
			            contractSelect.val("");
			        }

			        phaseSelect.prop("disabled", false)
			            .removeClass("readonly-select");

			        // Reload phases if contract is already selected
			        if (contractSelect.val()) {
			            loadPhasesByContract(contractSelect.val(), phaseSelect);
			        }

			        // Unlock Rework dropdown for direct modals
			        revisionSelect.prop("disabled", false)
			            .removeClass("readonly-select");
			    }

    // LOAD ACTIVITIES
    if (!isNaN(typeId) && typeId) {
        return loadActivitiesByType(typeId, activitySelect)
            .then(() => calculateRowTotals(row));
    }

    calculateRowTotals(row);
    return Promise.resolve();
}



function clearFieldError($field) {
    $field.removeClass("field-error");
    $field.siblings(".validation-msg").remove();
}

/* Auto-clear error when user changes input */
$(document).on("change keyup", "select, input", function() {
    clearFieldError($(this));
});





function validateShiftTable() {
    let valid = true;

    

    $("#shiftTable tbody tr:not(#shiftRowTemplate)").each(function(index) {
        const row = $(this);
        const rowNo = index + 1;

        console.log(`--- Validating Row ${rowNo} ---`);

        // Clear old errors
        row.find(".field-error").removeClass("field-error");
        row.find(".validation-msg").remove();

        const shift = row.find(".shiftSelect");
        const contract = row.find(".contractSelect");
        const phase = row.find(".phaseselect");
        const modal = row.find(".modalselect");
        const activity = row.find(".activityselect");

        const dh = row.find(".dhInput");
        const ih = row.find(".IHours");
        const rework = row.find(".reworkInput");
        const revision = row.find(".revisionSelect");
        const reason = row.find(".reasonSelect");

        let rowValid = true;

        //  Mandatory fields
        if (!shift.val()) {
            showFieldError(shift, "Shift is required");
            rowValid = false;
        }
        if (!contract.val()) {
            showFieldError(contract, "Contract is required");
            rowValid = false;
        }
		const modalValForPhase = parseInt(modal.val());
		/*if (!phase.val() && modalValForPhase !== 4) {
		    showFieldError(phase, "Phase is required");
		    rowValid = false;
		}*/
        if (!modal.val()) {
            showFieldError(modal, "Modal is required");
            rowValid = false;
        }
        if (!activity.val()) {
            showFieldError(activity, "Activity is required");
            rowValid = false;
        }

        //  Hours validation
		//  Hours validation
		const modalVal = parseInt(modal.val());
		const dhVal = parseFloat(dh.val()) || 0;
		const ihVal = parseFloat(ih.val()) || 0;
		const rhVal = parseFloat(rework.val()) || 0;
		const isRework = revision.val() === "Y";

		if (modalVal === 4) {
		    // Indirect: always validate IH
		    if (ihVal <= 0) {
		        showFieldError(ih, "IH is mandatory for indirect activity");
		        rowValid = false;
		    }
		} else {
		    // Direct: skip DH validation if Rework = Yes
		    // (DH is locked to 0 when rework, so RH covers the hours)
		    if (!isRework && dhVal <= 0) {
		        showFieldError(dh, "DH is mandatory");
		        rowValid = false;
		    }
		}

        // 🔴 Revision logic
        if (revision.val() === "Y") {
            if (rhVal <= 0) {
                showFieldError(rework, "Rework hours required");
                rowValid = false;
            }
            if (!reason.val()) {
                showFieldError(reason, "Reason required");
                rowValid = false;
            }
        }

        if (!rowValid) {
            console.log(` Row ${rowNo} INVALID`);
            valid = false;
        } else {
            console.log(` Row ${rowNo} VALID`);
        }
    });

    //  Validate Grand Total against shift hours
	// ── BEFORE (old code — uses shift dropdown hours) ─────────────────────────────
	
	const firstRow = $("#shiftTable tbody tr:not(#shiftRowTemplate)").first();
	if (firstRow.length > 0) {
	    const shiftSelect = firstRow.find(".shiftSelect");
	    if (shiftSelect.val()) {
	        const selectedOption = shiftSelect[0].options[shiftSelect[0].selectedIndex];
	        const maxHours = parseFloat(selectedOption.dataset.hours) || 0;
	        const grandTotal = updateGrandTotal();

	        const EPSILON = 0.01; // tolerance for floating point comparison
	        const diff = grandTotal - ALLOWED_NET_HOURS;

	        if (ALLOWED_NET_HOURS <= 0) {
	            // No punch data yet — skip hours validation
	            //console.warn("ALLOWED_NET_HOURS not set — skipping grand total check");

	        } else if (Math.abs(diff) > EPSILON) {

	            if (diff > 0) {
	                // Grand Total is MORE than allowed
	                showGrandTotalError(
	                    `Grand Total (${grandTotal.toFixed(2)} hrs) exceeds Worked hours ` +
	                    `(${ALLOWED_NET_HOURS.toFixed(2)} hrs ). ` +
	                    `Please reduce by ${diff.toFixed(2)} hrs.`
	                );
	            } else {
	                // Grand Total is LESS than allowed
	                showGrandTotalError(
	                    `Grand Total (${grandTotal.toFixed(2)} hrs) is less than your Worked hours ` +
	                    `(${ALLOWED_NET_HOURS.toFixed(2)} hrs ). ` +
	                    `Please add ${Math.abs(diff).toFixed(2)} hrs more.`
	                );
	            }

	            valid = false;

	        } else {
	            clearGrandTotalError();
	        }
	    }
	}

  
    console.log("Overall Valid:", valid);

    return valid;
}


function showGrandTotalError(message) {
    $("#grandTotalErrorMessage").text(message);
    $("#grandTotalError").fadeIn(300);
    
    // Change Grand Total color to red
    $("#grandTotalDisplay").css("color", "#dc3545");
}

//  Clear Grand Total error
function clearGrandTotalError() {
    $("#grandTotalError").fadeOut(300);
    
    // Reset Grand Total color to green
    $("#grandTotalDisplay").css("color", "#28a745");
}

$(document).on("input change",
    ".dhInput, .IHours, .reworkInput, .ehhour",
    function() {
        const row = $(this).closest("tr");
        calculateRowTotals(row);
    }
);

function calculateRowTotals(row) {
    const dh = parseFloat(row.find(".dhInput").val()) || 0;
    const ih = parseFloat(row.find(".IHours").val()) || 0;
    const rework = parseFloat(row.find(".reworkInput").val()) || 0;

    const total = dh + ih + rework;

    row.find(".Total").val(total.toFixed(2));
    
    //  After updating row total, recalculate Grand Total
    updateGrandTotal();
}

//  Calculate Grand Total across ALL rows
function updateGrandTotal() {
    let grandTotal = 0;
    
    $("#shiftTableBody tr:not(#shiftRowTemplate)").each(function() {
        const rowTotal = parseFloat($(this).find(".Total").val()) || 0;
        grandTotal += rowTotal;
    });
    
    // Update the display
    $("#grandTotalDisplay").text(grandTotal.toFixed(2));
    
    //  Clear error when recalculating (will be re-validated on save)
    clearGrandTotalError();
    
    return grandTotal;
}





function trackShiftTableData() {
    const grandTotal = updateGrandTotal();
    
    //  REPLACE THIS SECTION - Read from hidden input instead of parsing text
    const txtDate = $("#selectedDateValue").val();
    
    console.log("txtDate from hidden input:", txtDate);
    console.log("Grand Total:", grandTotal);
    
    //  ADD VALIDATION - Make sure date is selected
    if (!txtDate) {
        alert("Please select a date first!");
        return { 
            hasChanges: false, 
            payload: { saveOrUpdateList: [], deleteIds: [] } 
        };
    }
    
    const saveOrUpdateList = [];
    let hasChanges = false;

    $("#shiftTable tbody tr:not(#shiftRowTemplate)").each(function() {
        const row = $(this);
        const original = row.data("original") || {};
        const currentRow = {
            id: row.attr("data-record-id") || null,
            userId: parseInt(sessionStorage.getItem("id")),
            shiftId: row.find(".shiftSelect").val(),
            contractId: row.find(".contractSelect").val(),
            phaseId: null,
            typeId: row.find(".modalselect").val(),
            activityCategoryId: row.find(".activityselect").val(),
            dhHours: row.find(".dhInput").val() || 0,
            ihHours: row.find(".IHours").val() || 0,
            rhHours: row.find(".reworkInput").val() || 0,
            rework: row.find(".revisionSelect").val(),
            reasonId: row.find(".reasonSelect").val() || null,
            ecNo: row.find(".ecNoInput").val() || null,
            totalHours: row.find(".Total").val() || 0,
            grandTotal: row.find(".Total").val() || 0,
            txtDate: txtDate,  // ✅ Use value from hidden input
            year: parseInt($("#yearSelect").val()),
            week: parseInt($("#weekSelect").val()),
            createdBy: sessionStorage.getItem("id"),
            Month: parseInt($("#monthSelect").val()) + 1
        };

        console.log("Current row data:", currentRow);
        
        if (!rowsAreEqual(original, currentRow)) {
            saveOrUpdateList.push(currentRow);
            hasChanges = true;
        }
    });

    if (DELETED_RECORD_IDS.length > 0) {
        hasChanges = true;
    }

    return {
        hasChanges,
        payload: {
            saveOrUpdateList,
            deleteIds: DELETED_RECORD_IDS
        }
    };
}
function inserthour(payload) {
    $.ajax({
        url: new URL("/api/Drawing_txn", baseUrl).toString(),
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(payload),
        xhrFields: { withCredentials: true },

        success: function(res) {
			//alert("the data is saved ");
          showPopup("Data has been saved successfully", "DrawingEntry.jsp");
            console.log(res);
        },
        error: function(err) {
            console.error("Save failed", err);
        }
    });
}



/*function checkAndLoadDrawingEntry(dateStr) {
    
    console.log("date str", dateStr);

    const userId = sessionStorage.getItem("id");
    const year = $("#yearSelect").val();
    const datees = dateStr + "/" + year;
    console.log("the selected date", datees);
    
    // ADD THIS LINE - Store the raw date value
    $("#selectedDateValue").val(dateStr);  // Store "11/03"

    $.ajax({
        url: new URL("/api/Drawing_txn/by-date", baseUrl).toString(),
        type: "GET",
        data: {
            userId: userId,
            year: year,
            txtDate: dateStr
        },
        xhrFields: { withCredentials: true },

        success: function(response) {

            showDataForDate(dateStr);

            $.when(
                populateShiftDropdown(),
                populateContractDropdown(),
                populateModalAndActivityDropdowns(),
                populateReasonDropdown()
            ).done(function() {

                if (response.exists && response.Data.length > 0) {
                    console.log("Existing data found");
                    populateShiftTableFromDB(response.Data);
                    $(".subContainer").show();
                } else {
                    console.log("🆕 No data found");
                    resetShiftTableForInsert();
                    $(".subContainer").hide();
                }
            });
        },

        error: function(err) {
            console.error("Error checking drawing entry:", err);
        }
    });
}*/



// ─────────────────────────────────────────────────────────────────────────────
//  REPLACE your existing checkAndLoadDrawingEntry() with this version.
//  Everything else in your JS stays UNCHANGED.
// ─────────────────────────────────────────────────────────────────────────────

function checkAndLoadDrawingEntry(dateStr) {

    console.log("date str", dateStr);

    const userId = sessionStorage.getItem("id");
    const year   = $("#yearSelect").val();
    const datees = dateStr + "/" + year;
    console.log("the selected date", datees);

    // Store the raw date value
    $("#selectedDateValue").val(dateStr);

    // ── NEW: Check in-punch BEFORE opening container2 ──────────────────────
   
    const empId = sessionStorage.getItem("Empcode");

    $.ajax({
        url: new URL(`/api/websmartuser/check-inpunch`, baseUrl).toString(),
        type: "GET",
        data: {
            empId : empId,
            date  : dateStr,   // "dd/MM"  e.g. "06/03"
            year  : year       // "2026"
        },
        xhrFields: { withCredentials: true },
		success: function(punchRes) {

		    if (!punchRes.allowed) {
		        $("#container2").hide();
		        $("#exampleModalScrollable123").removeClass("scroll-enabled");
		        $("#customErrorMessage").text(punchRes.message);
		        $("#customErrorModal").modal('show');
		        return;
		    }

		    // ── Store net hours for Grand Total validation ────────────────────
		    ALLOWED_NET_HOURS = parseFloat(punchRes.netWorkHours) || 0;

		    // ── Store recommended shift for later auto-select ─────────────────
		    RECOMMENDED_SHIFT_CODE = punchRes.recommendedShiftCode || null;
  // ── Compact punch info strip (short labels) ────────────────────────
			// ── Compact styled punch info panel (right side) ──────────────────────────
			$("#punchHoursInfo").html(`
			    <div class="punch-info-panel">
			        <div class="punch-stat in">
			            <span class="label">In</span>
			            <span class="value">${punchRes.inTime || '-'}</span>
			        </div>
			        <div class="punch-stat out">
			            <span class="label">Out</span>
			            <span class="value">${punchRes.outTime || '-'}</span>
			        </div>
			        <div class="punch-stat total">
			            <span class="label">Total</span>
			            <span class="value">${punchRes.rawHours}h</span>
			        </div>
			        <div class="punch-stat ded">
			            <span class="label">Lunch Hour.</span>
			            <span class="value">${punchRes.deduction}h</span>
			        </div>
			        <div class="punch-stat allowed">
			            <span class="label">Worked Hours</span>
			            <span class="value">${punchRes.netWorkHours}h</span>
			        </div>
			    </div>
			`);

		    // ── Proceed with drawing entry load ──────────────────────────────
		    $.ajax({
		        url: new URL("/api/Drawing_txn/by-date", baseUrl).toString(),
		        type: "GET",
		        data: {
		            userId : userId,
		            year   : year,
		            txtDate: dateStr
		        },
		        xhrFields: { withCredentials: true },

		        success: function(response) {
		            showDataForDate(dateStr);

		            $.when(
		                populateShiftDropdown(),
		                populateContractDropdown(),
		                populateModalAndActivityDropdowns(),
		                populateReasonDropdown()
		            ).done(function() {
		                if (response.exists && response.Data.length > 0) {
		                    console.log("Existing data found");
		                    populateShiftTableFromDB(response.Data); // keeps DB shift as-is
		                    $(".subContainer").show();
		                } else {
		                    console.log("No data found");
		                    resetShiftTableForInsert();
		                    applyRecommendedShift(); // ✅ NEW: only for fresh entries
		                    $(".subContainer").show();
		                }
		            });
		        },

		        error: function(err) {
		            console.error("Error checking drawing entry:", err);
		        }
		    });
		},

        error: function(err) {
            console.error("Error checking in-punch:", err);
            // On API failure, optionally allow or block — here we block safely
            $("#customErrorMessage").text("Unable to verify attendance. Please try again.");
            $("#customErrorModal").modal('show');
        }
    });
}

// ── Auto-select & lock the main shift dropdown based on InTime ───────────────
function applyRecommendedShift() {
    const $mainShift = $("#shiftSelect");

    if (!RECOMMENDED_SHIFT_CODE || !CANONICAL_SHIFT_ID[RECOMMENDED_SHIFT_CODE]) {
        // No confident match -> leave manual, container stays hidden until user picks one
        $mainShift.prop("disabled", false).removeClass("readonly-select");
        $(".subContainer").hide();
        return;
    }

    const shiftId = CANONICAL_SHIFT_ID[RECOMMENDED_SHIFT_CODE];

    if ($mainShift.find(`option[value="${shiftId}"]`).length > 0) {
        $mainShift.val(shiftId).trigger("change"); // cascades to row .shiftSelect + shows .subContainer
        $mainShift.prop("disabled", true).addClass("readonly-select");
        $(".subContainer").show(); // ✅ explicit, don't rely only on the change handler
    } else {
        // Recommended shift not offered at this location -> stay manual
        $mainShift.prop("disabled", false).removeClass("readonly-select");
        $(".subContainer").hide();
    }
}


/*let originalDrawingData = [];*/
async function populateShiftTableFromDB(data) {

    await populateShiftDropdown();

    const tbody = $("#shiftTableBody");
    tbody.find("tr:not(#shiftRowTemplate)").remove();

    // Get the first shift ID to populate the main dropdown
/*    const firstShiftId = data[0]?.shiftId;
    if (firstShiftId) {
        $("#shiftSelect").val(firstShiftId);
    }*/
	
	const firstShiftId = data[0]?.shiftId;
	if (firstShiftId) {
	    $("#shiftSelect")
	        .val(firstShiftId)
	        .prop("disabled", true)
	        .addClass("readonly-select");
	}

    for (const item of data) {
        addShiftRow();
        const row = tbody.find("tr:not(#shiftRowTemplate)").last();

        row.attr("data-record-id", item.id || "");
        row.data("original", JSON.parse(JSON.stringify(item)));

        // SHIFT - set value and disable it
        row.find(".shiftSelect")
           .val(item.shiftId)
           .prop("disabled", true)
           .addClass("readonly-select");

        // CONTRACT → PHASE
        const contractSelect = row.find(".contractSelect");
        const phaseSelect = row.find(".phaseselect");

        contractSelect.val(item.contractId);

        await loadPhasesByContract(item.contractId, phaseSelect);
        phaseSelect.val(item.phaseId);

        //  MODAL (with legacy handling)
        const modalSelect = row.find(".modalselect");
		if (parseInt(item.typeId) === 4) {
		    // Lock contract to Stock
		    contractSelect.val("1")
		       
		      

		    // Lock phase
		    phaseSelect.empty()
		        .append('<option value="">N/A</option>')
		        .prop("disabled", true)
		        .addClass("readonly-select");

		    // Lock Rework = No for Indirect (even if DB says Y, force N)
		    row.find(".revisionSelect")
		        .val("N")
		        .prop("disabled", true)
		        .addClass("readonly-select");

		    // Clear rework-related fields
		    row.find(".reworkInput").val("").prop("readonly", true);
		    row.find(".ecNoInput").val("").prop("readonly", true);
		    row.find(".reasonSelect").val("")
		        .prop("disabled", true)
		        .addClass("readonly-select");
		}
        const isModalLegacy = addMissingModalOption(modalSelect, item.typeId);
        modalSelect.val(item.typeId);

        // Make modal readonly if it's a legacy option
        if (isModalLegacy) {
            modalSelect.prop("disabled", true).addClass("readonly-select legacy-field");
        }

        // ACTIVITY (with legacy handling)
        const activitySelect = row.find(".activityselect");
        
        // Load activities for this type
        await loadActivitiesByType(item.typeId, activitySelect, false);
        
        // Check if activity exists in the loaded options
        const activityExists = activitySelect.find(`option[value="${item.activityCategoryId}"]`).length > 0;
        
        if (!activityExists) {
            // Activity doesn't exist - add it as legacy option
            const isActivityLegacy = addMissingActivityOption(activitySelect, item.activityCategoryId, item.typeId);
            
            // Make activity readonly if it's a legacy option
            if (isActivityLegacy) {
                activitySelect.prop("disabled", true).addClass("readonly-select legacy-field");
            }
        }
        
        // Set the activity value
        activitySelect.val(item.activityCategoryId);

        //  POPULATE HOURS FIRST (before enabling fields)
        row.find(".dhInput").val(item.dhHours);
        row.find(".IHours").val(item.ihHours);
        row.find(".ehhour").val(item.ehHours);

        // NOW enable DH or IH based on type (without clearing values)
        const ihInput = row.find(".IHours");
        const dhInput = row.find(".dhInput");
        
        if (item.typeId === 4) {
            // Indirect - enable IH
            ihInput.prop("readonly", false);
            dhInput.prop("readonly", true);
        } else {
            // Direct - enable DH
            dhInput.prop("readonly", false);
            ihInput.prop("readonly", true);
        }

        // REVISION
        if (item.rework === "Y") {
            row.find(".reworkInput").prop("readonly", false);
            row.find(".ecNoInput").prop("readonly", false);
            row.find(".reasonSelect").prop("disabled", false).removeClass("readonly-select");
        } else {
            row.find(".reworkInput").val("").prop("readonly", true);
            row.find(".ecNoInput").val("").prop("readonly", true);
            row.find(".reasonSelect").val("").prop("disabled", true).addClass("readonly-select");
        }

        row.find(".revisionSelect").val(item.rework).trigger("change");
        row.find(".reworkInput").val(item.rhHours);
        row.find(".reasonSelect").val(item.reasonId);
        row.find(".ecNoInput").val(item.ecNo);

        row.find(".Total").val(item.totalHours);
        row.find(".GTotal").val(item.grandTotal);
    }

    let yearselect = $("#yearSelect").val().trim();
    loadSummary(yearselect);
    $("#container2").show();
    $(".subContainer").show();
	updateGrandTotal();
}

//  Helper function to apply modal logic without reloading activities
function applyModalLogicWithoutActivityReload(row, typeId) {
    const ihInput = row.find(".IHours");
    const dhInput = row.find(".dhInput");

    // RESET hours
    ihInput.prop("readonly", true).val("");
    dhInput.prop("readonly", true).val("");

    // IH / DH LOGIC
    if (typeId === 4) {
        ihInput.prop("readonly", false);
    } else if (!isNaN(typeId)) {
        dhInput.prop("readonly", false);
    }
}



function normalize(val) {
    if (val === "" || val === null || val === undefined) return null; // treat empty string same as null
    if (!isNaN(val)) return Number(val); // convert numeric strings to numbers
    return val;
}


function rowsAreEqual(original, current) {
    const keys = [
        "shiftId",
        "contractId",
        "phaseId",
        "typeId",
        "activityCategoryId",
        "dhHours",
        "ihHours",
        "rhHours",
        "rework",
        "reasonId",
        "ecNo",
        "totalHours",
        "grandTotal"
    ];

    return keys.every(k => normalize(original[k]) === normalize(current[k]));
}



//  Update makeMonthCellsClickable() to store and use year correctly
function makeMonthCellsClickable() {
    // Get all month cells (td with id from 1 to 12)
    for (let month = 1; month <= 12; month++) {
        const cell = document.getElementById(month.toString());
        
        if (cell) {
            cell.style.cursor = 'pointer';
            
            cell.onclick = function() {
                const hours = parseFloat(this.innerText) || 0;
                
                if (hours > 0) {
                    // Get year from the dropdown, not default to current year
                    const year = $("#yearSelectsss").val();
                    
                    //  Make sure year is selected
                    if (!year) {
                        alert("Please select a year first");
                        return;
                    }
                    
                    const userId = sessionStorage.getItem("id");
                    
                    // Store selected month and year
                    sessionStorage.setItem("selectedMonth", month);
                    sessionStorage.setItem("selectedYear", year);
                    sessionStorage.setItem("selectedUserId", userId);
                    
                    // Fetch and display monthly details
                    fetchMonthlyDetails(year, month, userId);
                } else {
                   $("#monthlyDetailsSection").hide();
                }
            };
        }
    }
}

function loadSummary(year) {
    $("#selectedyear").text(year);
    
    fetch(new URL(`/api/Drawing_txn/monthly/${year}/${sessionStorage.getItem("id")}`, baseUrl), {
        method: "GET",
        credentials: "include"
    })
    .then(res => res.json())
    .then(data => {
        console.log("Summary API response:", data);

        document.getElementById("1").innerText = data.jan || 0;
        document.getElementById("2").innerText = data.feb || 0;
        document.getElementById("3").innerText = data.mar || 0;
        document.getElementById("4").innerText = data.apr || 0;
        document.getElementById("5").innerText = data.may || 0;
        document.getElementById("6").innerText = data.jun || 0;
        document.getElementById("7").innerText = data.jul || 0;
        document.getElementById("8").innerText = data.aug || 0;
        document.getElementById("9").innerText = data.sep || 0;
        document.getElementById("10").innerText = data.oct || 0;
        document.getElementById("11").innerText = data.nov || 0;
        document.getElementById("12").innerText = data.dec || 0;

        const total = (parseFloat(data.jan) || 0) + (parseFloat(data.feb) || 0) + 
                     (parseFloat(data.mar) || 0) + (parseFloat(data.apr) || 0) + 
                     (parseFloat(data.may) || 0) + (parseFloat(data.jun) || 0) +
                     (parseFloat(data.jul) || 0) + (parseFloat(data.aug) || 0) + 
                     (parseFloat(data.sep) || 0) + (parseFloat(data.oct) || 0) + 
                     (parseFloat(data.nov) || 0) + (parseFloat(data.dec) || 0);
        
        document.getElementById("totalyear").innerText = total.toFixed(2);
        document.getElementById("totalyearFooter").innerText = total.toFixed(2);
        document.getElementById("avgPerMonth").innerText = (total / 12).toFixed(2);
		makeMonthCellsClickable();
		makeYearCellClickable();
    })
    .catch(err => {
        console.error("Summary load failed:", err);
        alert("Failed to load summary data for year " + year);
    });
}



//  Fetch monthly drawing entry details
function fetchMonthlyDetails(year, month, userId) {
    
    $.ajax({
        url: new URL(`api/Drawing_txn/by-user`, baseUrl).toString(),
        type: "GET",
        data: {
            year: year,
            month: month,
            userId: userId
        },
        xhrFields: { withCredentials: true },
        
        success: function(response) {
            if (response.success && response.Data && response.Data.length > 0) {
                displayMonthlyDetails(response.Data, year, month);
            } else {
                alert("No detailed data found for this month");
            }
        },
        
        error: function(error) {
            console.error("Error fetching monthly details:", error);
            alert("Failed to load monthly details");
        }
    });
}

//  Display monthly details in table
//  Update displayMonthlyDetails to properly destroy and reinitialize DataTable
function displayMonthlyDetails(data, year, month) {
    
    const monthNames = ["January", "February", "March", "April", "May", "June",
                       "July", "August", "September", "October", "November", "December"];
    
    // Update header
    $("#detailsMonthYear").text(`${monthNames[month - 1]} ${year}`);
    
    //  CRITICAL FIX: Destroy DataTable BEFORE clearing tbody
    if ($.fn.DataTable.isDataTable('#monthlyDetailsTable')) {
        $('#monthlyDetailsTable').DataTable().clear().destroy();
    }
    
    // Clear existing table
    const tbody = $("#monthlyDetailsBody");
    tbody.empty();
    
    if (!data || data.length === 0) {
        tbody.append(`
            <tr>
                <td colspan="12" class="text-center text-muted">
                    No entries found for this month
                </td>
            </tr>
        `);
        $("#monthlyDetailsSection").show();
        return;
    }
    
    // Populate table rows
    $.each(data, function(index, entry) {
        tbody.append(`
            <tr>
                <td>${index + 1}</td>
                <td>${entry.txtDate}/${year}</td>
                <td>${entry.shiftCode || '-'}</td>
              <td>${entry.jobCode === 'Stock' ? 'Indirect' : (entry.jobCode || '-')}</td>
            
              
                <td>${entry.typeName || '-'}</td>
                <td>${entry.activityName || '-'}</td>
                <td>${parseFloat(entry.dhHours || 0).toFixed(2)}</td>
                <td>${parseFloat(entry.ihHours || 0).toFixed(2)}</td>
                <td>${parseFloat(entry.rhHours || 0).toFixed(2)}</td>
                <td><strong>${parseFloat(entry.totalHours || 0).toFixed(2)}</strong></td>
            </tr>
        `);
    });
    
    // Show the details section
    $("#monthlyDetailsSection").show();
    
    // Scroll to the details section
    $('html, body').animate({
        scrollTop: $("#monthlyDetailsSection").offset().top - 100
    }, 500);
    
    //  Initialize DataTable AFTER tbody is populated
    $('#monthlyDetailsTable').DataTable({
        dom: '<"d-flex justify-content-between mb-2"Bf>rtip',
        buttons: [
            {
                extend: 'excelHtml5',
                text: ' Export to Excel',
                className: 'btn btn-success btn-sm',
                filename: `Drawing_Entry_${monthNames[month - 1]}_${year}`,
                title: `Drawing Entry Report - ${monthNames[month - 1]} ${year}`
            }
        ],
        paging: true,
        pageLength: 10,
        lengthMenu: [[10, 25, 50, -1], [10, 25, 50, "All"]],
        info: true,
        searching: true,
        ordering: true,
        order: [[1, 'asc']], // Sort by date
        language: {
            search: "Search entries:",
            lengthMenu: "Show _MENU_ entries",
            info: "Showing _START_ to _END_ of _TOTAL_ entries",
            infoEmpty: "No entries available",
            emptyTable: "No data available for this month"
        },
        //   Redraw callback to ensure proper rendering
        drawCallback: function() {
            console.log('DataTable redrawn successfully');
        }
    });
}

//  Make year cell clickable
function makeYearCellClickable() {
    const yearCell = document.getElementById("selectedyear");
    
    if (yearCell) {
        yearCell.style.cursor = 'pointer';
        
        yearCell.onclick = function() {
            const year = this.innerText;
            
            //  Make sure year is selected
            if (!year || year === '-') {
                alert("Please select a year first");
                return;
            }
            
            const userId = sessionStorage.getItem("id");
            
            // Fetch and display yearly details
            fetchYearlyDetails(year, userId);
        };
    }
}

//   Fetch yearly drawing entry details
function fetchYearlyDetails(year, userId) {
    
    $.ajax({
        url: new URL(`api/Drawing_txn/by-user/by-year`, baseUrl).toString(),
        type: "GET",
        data: {
            year: year,
            userId: userId
        },
        xhrFields: { withCredentials: true },
        
        success: function(response) {
            if (response.success && response.Data && response.Data.length > 0) {
                displayYearlyDetails(response.Data, year);
            } else {
                alert("No detailed data found for this year");
            }
        },
        
        error: function(error) {
            console.error("Error fetching yearly details:", error);
            alert("Failed to load yearly details");
        }
    });
}

//  Display yearly details in table
function displayYearlyDetails(data, year) {
    
    const monthNames = ["January", "February", "March", "April", "May", "June",
                       "July", "August", "September", "October", "November", "December"];
    
    // Update header
    $("#detailsMonthYear").text(`Full Year ${year} Report`);
    
    // Destroy DataTable BEFORE clearing tbody
    if ($.fn.DataTable.isDataTable('#monthlyDetailsTable')) {
        $('#monthlyDetailsTable').DataTable().clear().destroy();
    }
    
    // Clear existing table
    const tbody = $("#monthlyDetailsBody");
    tbody.empty();
    
    if (!data || data.length === 0) {
        tbody.append(`
            <tr>
                <td colspan="12" class="text-center text-muted">
                    No entries found for this year
                </td>
            </tr>
        `);
        $("#monthlyDetailsSection").show();
        return;
    }
    
    // Populate table rows
    $.each(data, function(index, entry) {
        tbody.append(`
            <tr>
                <td>${index + 1}</td>
                <td>${entry.txtDate}/${year}</td>
                <td>${entry.shiftCode || '-'}</td>
             <td>${entry.jobCode === 'Stock' ? 'Indirect' : (entry.jobCode || '-')}</td>
             
             
                <td>${entry.typeName || '-'}</td>
                <td>${entry.activityName || '-'}</td>
                <td>${parseFloat(entry.dhHours || 0).toFixed(2)}</td>
                <td>${parseFloat(entry.ihHours || 0).toFixed(2)}</td>
                <td>${parseFloat(entry.rhHours || 0).toFixed(2)}</td>
                <td><strong>${parseFloat(entry.totalHours || 0).toFixed(2)}</strong></td>
            </tr>
        `);
    });
    
    // Show the details section
    $("#monthlyDetailsSection").show();
    
    // Scroll to the details section
    $('html, body').animate({
        scrollTop: $("#monthlyDetailsSection").offset().top - 100
    }, 500);
    
    //  Initialize DataTable AFTER tbody is populated
    $('#monthlyDetailsTable').DataTable({
        dom: '<"d-flex justify-content-between mb-2"Bf>rtip',
        buttons: [
            {
                extend: 'excelHtml5',
                text: ' Export to Excel',
                className: 'btn btn-success btn-sm',
                filename: `Drawing_Entry_Full_Year_${year}`,
                title: `Drawing Entry Report - Full Year ${year}`
            }
        ],
        paging: true,
        pageLength: 10,
        lengthMenu: [[10, 25, 50, 100, -1], [10, 25, 50, 100, "All"]],
        info: true,
        searching: true,
        ordering: true,
        order: [[1, 'asc']], // Sort by date
        language: {
            search: "Search entries:",
            lengthMenu: "Show _MENU_ entries",
            info: "Showing _START_ to _END_ of _TOTAL_ entries",
            infoEmpty: "No entries available",
            emptyTable: "No data available for this year"
        },
        drawCallback: function() {
            console.log('Yearly DataTable redrawn successfully');
        }
    });
}
function resetShiftTableForInsert() {
    const tbody = $("#shiftTableBody");
    tbody.find("tr:not(#shiftRowTemplate)").remove();

    addShiftRow(); // fresh empty row
    $("#container2").show();
    $(".subContainer").hide(); // Keep hidden until shift selected
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
    setTimeout(function() {
        popup.fadeOut(100, function() {
            $(this).remove();
            window.location = redirectUrl;
        });
    }, 2000);
}


function highlightExistingEntries(days, year, week) {
    const userId = sessionStorage.getItem("id");

    if (!week) return;

    $.ajax({
        url: new URL("/api/Drawing_txn/entries-by-week", baseUrl).toString(),
        type: "GET",
        data: { userId: userId, year: year, week: week },
        xhrFields: { withCredentials: true },
        success: function(response) {
            $("#tableHeader th").removeClass("has-entry-header");

            if (!response || !response.success || !response.dates || !response.dates.length) {
                return;
            }

            const entryDates = new Set(response.dates);

            $("#tableHeader th").each(function() {
                const headerText = $(this).text().trim();
                if (entryDates.has(headerText)) {
                    $(this).addClass("has-entry-header");
                }
            });
        },
        error: function(err) {
            console.error("Error checking existing entries for highlighting:", err);
        }
    });
}


