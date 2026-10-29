


const MainPage = window.location.pathname.split("/").pop() +'.jsp';


const UserId = sessionStorage.getItem('username');

let allowedActions = [];

async function loadActions() {
    try {
        const response = await fetch(
            `${baseUrl}/api/page/actions?userId=${encodeURIComponent(UserId)}&pageName=${encodeURIComponent(MainPage)}`,
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

    } catch (error) {
        console.error("Error:", error);
    }
}


document.getElementById("OprtSrc").addEventListener("click", function () {
    // show custom message instead of opening modal
	  const allowed =allowedActions || [];

	if (!allowed.includes("Insert")) {
	  alert(" You do not have permission to Insert.");
	  $('#exampleModalScrollableIN').modal('hide');
	  return;
	}
	$('#exampleModalScrollableIN').modal('show');
})


$(document).ready(async function () {

    // ==============================
    // CREATE OPPORTUNITY SOURCE
    // ==============================
	await loadActions();
	fetchregistertype();

    $('#submitregtype').on('click', function () {

        const registerType = $('#registertype').val().trim();

        // Clear previous error
        $('#registertypeError').hide();

        // Validation
        if (registerType === '') {

            $('#registertypeError')
                .text('Opportunity Source Type is required')
                .show();

            $('#registertype').focus();

            // Do not open confirmation modal
            return;
        }

        // Hide create modal
        $('#exampleModalScrollableIN').modal('hide');

        // Open confirmation modal
        $('#exampleModalCenter80').modal('show');
    });


    // ==============================
    // CONFIRM CREATE
    // ==============================

	$('#confirmregYes').on('click', function () {

	    const registerType = $('#registertype').val().trim();

	    // Hide confirmation modal
	    $('#exampleModalCenter80').modal('hide');

	    $.ajax({

	        url: baseUrl + '/api/salescrm/opportunity-source',

	        type: 'POST',

	        contentType: 'application/json',
			xhrFields: { withCredentials: true },

	        data: JSON.stringify({

	            opportunityName: registerType,

	            status: false,

	            createdBy: sessionStorage.getItem('id')

	        }),

	        success: function (response) {

	            console.log(
	                'Opportunity Source created successfully',
	                response
	            );

				//alert("successfully created");
	            // Clear input
	            $('#registertype').val('');

	            // Refresh table
	           // fetchregistertype();

	            // Optional success message
	            showPopup('Opportunity Source created successfully','SaleMaster.jsp');

	        },

	        error: function (xhr, status, error) {

	            console.error(
	                'Error creating Opportunity Source:',
	                xhr.responseText
	            );

	            alert(
	                xhr.responseText ||
	                'Error creating Opportunity Source'
	            );

	        }

	    });

	});


    // ==============================
    // CLEAR MODAL WHEN CLOSED
    // ==============================

    $('#exampleModalScrollableIN').on('hidden.bs.modal', function () {

        $('#registertypeError').hide();

    });

});


async function fetchregistertype() {

    const apiUrl = new URL(
        '/api/salescrm/opportunity-source',
        baseUrl1
    );

    try {

        const response = await fetch(apiUrl, {

            method: "GET",

            credentials: "include"

        });


        if (!response.ok) {

            throw new Error(
                "Failed to fetch Opportunity Sources"
            );
        }


        const opportunitySources =
            await response.json();


        let tableRows = '';


        for (
            let index = 0;
            index < opportunitySources.length;
            index++
        ) {

            const item =
                opportunitySources[index];


            tableRows += `

                <tr id="${item.id}">

                    <td>
                        ${index + 1}
                    </td>


                    <td>
                        ${item.opportunityName}
                    </td>


             
					
					<td>
					    ${item.isUsed
					        ? `<i class="fa fa-pen text-muted"
					              title="Already used in activities, cannot be edited"
					              style="cursor:not-allowed; opacity:0.4;">
					           </i>`
					        : `<i class="fa fa-pen text-primary cursor-pointer"
					              title="Edit"
					              style="cursor:pointer;"
					              onclick="editOpportunitySource(${item.id})">
					           </i>`}
					</td>

                </tr>

            `;
        }


        document.querySelector(
            "#tableID tbody"
        ).innerHTML = tableRows;


        // Destroy existing DataTable
        if (
            $.fn.DataTable.isDataTable(
                '#tableID'
            )
        ) {

            $('#tableID')
                .DataTable()
                .destroy();
        }


        // Initialize DataTable
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

                title:
                    'Opportunity Source List'

            }]

        });


    } catch (error) {

        console.error(
            'Error fetching Opportunity Sources:',
            error
        );

    }

}

let selectedOpportunitySourceId = null;
let originalOpportunitySourceName = '';

async function editOpportunitySource(id) {
	
	
	const allowed = allowedActions || [];

	 if (!allowed.includes("Edit")) {
	     alert("You do not have permission to edit.");
	     return;
	 }

    try {

        const apiUrl = new URL(
            `/api/salescrm/opportunity-source/${id}`,
            baseUrl1
        );
		
		
		

        const response = await fetch(apiUrl, {

            method: "GET",

            credentials: "include"

        });

        if (!response.ok) {

            throw new Error(
                "Failed to fetch Opportunity Source"
            );
        }

        const data = await response.json();

        // Store ID
        selectedOpportunitySourceId = data.id;

        // Store original value
        originalOpportunitySourceName =
            data.opportunityName.trim();

        // Set value in update input
        $('#registertype1').val(
            data.opportunityName
        );

        // Clear previous error
        $('#registertype1Error').hide();

        // Open update modal
        $('#exampleModalScrollableINUp').modal('show');

    } catch (error) {

        console.error(
            "Error fetching Opportunity Source:",
            error
        );

        alert(
            "Unable to fetch Opportunity Source"
        );
    }
}

$('#regtypeupd').on('click', function () {

    const currentOpportunitySource =
        $('#registertype1').val().trim();


    // Clear previous error
    $('#registertype1Error').hide();


    // =========================
    // VALIDATION
    // =========================

    if (currentOpportunitySource === '') {

        $('#registertype1Error')
            .text(
                'Opportunity Source Type is required'
            )
            .show();

        $('#registertype1').focus();

        return;
    }


    // =========================
    // CHECK WHETHER VALUE CHANGED
    // =========================

    if (
        currentOpportunitySource ===
        originalOpportunitySourceName
    ) {

        showPopup(
            'No Fields are changes','SaleMaster.jsp'
        );

        return;
    }


    // =========================
    // VALUE CHANGED
    // =========================

    // Hide update modal
    $('#exampleModalScrollableINUp')
        .modal('hide');


    // Show confirmation modal
    $('#exampleModalCenter75')
        .modal('show');

});


$('#confirmregtypeupd').on('click', function () {

    const currentOpportunitySource =
        $('#registertype1').val().trim();


    // Hide confirmation modal
    $('#exampleModalCenter75')
        .modal('hide');


    $.ajax({

        url:
            baseUrl1 +
            '/api/salescrm/opportunity-source/' +
            selectedOpportunitySourceId,

        type: 'PUT',

        contentType: 'application/json',
		xhrFields: { withCredentials: true },

        data: JSON.stringify({

            opportunityName:
                currentOpportunitySource,

            modifiedBy:
                sessionStorage.getItem('id')

        }),

        success: function (response) {

            console.log(
                'Opportunity Source updated successfully',
                response
            );


            // Close update modal
            $('#exampleModalScrollableINUp')
                .modal('hide');


            // Clear field
            $('#registertype1')
                .val('');


            // Refresh table
            fetchregistertype();


            showPopup(
                'Opportunity Source updated successfully','SaleMaster.jsp'
            );

        },

        error: function (xhr, status, error) {

            console.error(
                'Error updating Opportunity Source:',
                xhr.responseText
            );


            alert(
                xhr.responseText ||
                'Error updating Opportunity Source'
            );

        }

    });

});



document.getElementById("vtsveh").addEventListener("click", function () {
	
	  const allowed =allowedActions || [];

	if (!allowed.includes("Insert")) {
	  alert(" You do not have permission to Insert.");
	  $('#exampleModalScrollableIN').modal('hide');
	  return;
	}
	
    $('#exampleModalScrollableCon').modal('show');
});

$(document).ready(function () {

    // ==============================
    // CREATE ZONE
    // ==============================

    $('#submitvehtype').on('click', function () {

        const zoneType = $('#vehicletype').val().trim();

        $('#vehicletypeError').hide();

        if (zoneType === '') {
            $('#vehicletypeError').text('Zone Type is required').show();
            $('#vehicletype').focus();
            return;
        }

        $('#exampleModalScrollableCon').modal('hide');
        $('#exampleModalCenter85').modal('show');
    });

    // ==============================
    // CONFIRM CREATE
    // ==============================

    $('#confirmvehtypeYes').on('click', function () {

        const zoneType = $('#vehicletype').val().trim();

        $('#exampleModalCenter85').modal('hide');

        $.ajax({
            url: baseUrl + '/api/salescrm/zone',
            type: 'POST',
            contentType: 'application/json',
			xhrFields: { withCredentials: true },
            data: JSON.stringify({
                zoneName: zoneType,
                status: false,
                createdBy: sessionStorage.getItem('id')
            }),
            success: function (response) {
                console.log('Zone created successfully', response);
                $('#vehicletype').val('');
                showPopup('Zone created successfully', 'SaleMaster.jsp');
            },
            error: function (xhr, status, error) {
                console.error('Error creating Zone:', xhr.responseText);
                alert(xhr.responseText || 'Error creating Zone');
            }
        });
    });

    // ==============================
    // CLEAR MODAL WHEN CLOSED
    // ==============================

    $('#exampleModalScrollableCon').on('hidden.bs.modal', function () {
        $('#vehicletypeError').hide();
    });

});

async function fetchzonetype() {

    const apiUrl = new URL('/api/salescrm/zone', baseUrl1);

    try {
        const response = await fetch(apiUrl, {
            method: "GET",
            credentials: "include"
        });

        if (!response.ok) {
            throw new Error("Failed to fetch Zones");
        }

        const zones = await response.json();

        let tableRows = '';

        for (let index = 0; index < zones.length; index++) {

            const item = zones[index];

            tableRows += `
                <tr id="${item.id}">
                    <td>${index + 1}</td>
                    <td>${item.zoneName}</td>
         
					
					<td>
					    ${item.isUsed
					        ? `<i class="fa fa-pen text-muted"
					              title="Zone is already in use, cannot be edited"
					              style="cursor:not-allowed; opacity:0.4;"></i>`
					        : `<i class="fa fa-pen text-primary cursor-pointer"
					              title="Edit"
					              style="cursor:pointer;"
					              onclick="editZone(${item.id})"></i>`}
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
            info: true,
            paging: true,
            pageLength: 10,
            lengthMenu: [[10, 25, 50, 100], [10, 25, 50, 100]],
            buttons: [{
                extend: 'excel',
                text: 'Export to Excel',
                title: 'Zone List'
            }]
        });

    } catch (error) {
        console.error('Error fetching Zones:', error);
    }
}

let selectedZoneId = null;
let originalZoneName = '';

async function editZone(id) {
	const allowed = allowedActions || [];

	 if (!allowed.includes("Edit")) {
	     alert("You do not have permission to edit.");
	     return;
	 }
	

    try {
        const apiUrl = new URL(`/api/salescrm/zone/${id}`, baseUrl1);

        const response = await fetch(apiUrl, {
            method: "GET",
            credentials: "include"
        });

        if (!response.ok) {
            throw new Error("Failed to fetch Zone");
        }

        const data = await response.json();

        selectedZoneId = data.id;
        originalZoneName = data.zoneName.trim();

        $('#vehicletype1').val(data.zoneName);
        $('#vehicletype1Error').hide();

        $('#exampleModalScrollableConUp').modal('show');

    } catch (error) {
        console.error("Error fetching Zone:", error);
        alert("Unable to fetch Zone");
    }
}

$('#vehtypeupd').on('click', function () {

    const currentZone = $('#vehicletype1').val().trim();

    $('#vehicletype1Error').hide();

    if (currentZone === '') {
        $('#vehicletype1Error').text('Zone Type is required').show();
        $('#vehicletype1').focus();
        return;
    }

    if (currentZone === originalZoneName) {
        showPopup('No Fields are changes', 'SaleMaster.jsp');
        return;
    }

    $('#exampleModalScrollableConUp').modal('hide');
    $('#exampleModalCenter86').modal('show');
});

// NO button on the confirm-update modal (was missing a handler — see notes below)
$('#cancelvehmodal').on('click', function () {
    $('#exampleModalCenter86').modal('hide');
    $('#exampleModalScrollableConUp').modal('show');
});

$('#confirmvehtypeupd').on('click', function () {

    const currentZone = $('#vehicletype1').val().trim();

    $('#exampleModalCenter86').modal('hide');

    $.ajax({
        url: baseUrl1 + '/api/salescrm/zone/' + selectedZoneId,
        type: 'PUT',
        contentType: 'application/json',
		xhrFields: { withCredentials: true },
        data: JSON.stringify({
            zoneName: currentZone,
            modifiedBy: sessionStorage.getItem('id')
        }),
        success: function (response) {
            console.log('Zone updated successfully', response);
            $('#exampleModalScrollableConUp').modal('hide');
            $('#vehicletype1').val('');
            fetchzonetype();
            showPopup('Zone updated successfully', 'SaleMaster.jsp');
        },
        error: function (xhr, status, error) {
            console.error('Error updating Zone:', xhr.responseText);
            alert(xhr.responseText || 'Error updating Zone');
        }
    });
});


function showPopup(message, redirectUrl) {
	var popup = $('<div class="popup">' + message + '</div>').appendTo('body').hide().fadeIn(400);
	setTimeout(function() {
		popup.fadeOut(400, function() {
			$(this).remove();
			window.location = redirectUrl;
		});
	}, 2000);
}


document.getElementById("dsgnbss").addEventListener("click", function () {
	
	  const allowed =allowedActions || [];

	if (!allowed.includes("Insert")) {
	  alert(" You do not have permission to Insert.");
	  $('#exampleModalScrollableIN').modal('hide');
	  return;
	}
	
    $('#exampleModalScrollableDes').modal('show');
});

$(document).ready(function () {

    // ==============================
    // CREATE DESIGN BASIS
    // ==============================

    $('#submitdesignbasis').on('click', function () {

        const designBasis = $('#designbasis').val().trim();

        $('#designbasisError').hide();

        if (designBasis === '') {
            $('#designbasisError').text('Design Basis is required').show();
            $('#designbasis').focus();
            return;
        }

        $('#exampleModalScrollableDes').modal('hide');
        $('#exampleModalCenter90').modal('show');
    });

    // ==============================
    // CONFIRM CREATE
    // ==============================

    $('#confirmdesignYes').on('click', function () {

        const designBasis = $('#designbasis').val().trim();

        $('#exampleModalCenter90').modal('hide');

        $.ajax({
            url: baseUrl + '/api/salescrm/design-basis',
            type: 'POST',
            contentType: 'application/json',
			xhrFields: { withCredentials: true },
            data: JSON.stringify({
                designBasisName: designBasis,
                status: false,
                createdBy: sessionStorage.getItem('id')
            }),
            success: function (response) {
                console.log('Design Basis created successfully', response);
                $('#designbasis').val('');
                showPopup('Design Basis created successfully', 'SaleMaster.jsp');
            },
            error: function (xhr, status, error) {
                console.error('Error creating Design Basis:', xhr.responseText);
                alert(xhr.responseText || 'Error creating Design Basis');
            }
        });
    });

    // ==============================
    // CLEAR MODAL WHEN CLOSED
    // ==============================

    $('#exampleModalScrollableDes').on('hidden.bs.modal', function () {
        $('#designbasisError').hide();
    });

});

async function fetchdesignbasis() {

    const apiUrl = new URL('/api/salescrm/design-basis', baseUrl1);

    try {
        const response = await fetch(apiUrl, {
            method: "GET",
            credentials: "include"
        });

        if (!response.ok) {
            throw new Error("Failed to fetch Design Basis");
        }

        const designBasisList = await response.json();

        let tableRows = '';

        for (let index = 0; index < designBasisList.length; index++) {

            const item = designBasisList[index];

            tableRows += `
                <tr id="${item.id}">
                    <td>${index + 1}</td>
                    <td>${item.designBasisName}</td>
         
					
					<td>
					    ${item.isUsed
					        ? `<i class="fa fa-pen text-muted"
					              title="Already used in leads or enquiries, cannot be edited"
					              style="cursor:not-allowed; opacity:0.4;"></i>`
					        : `<i class="fa fa-pen text-primary cursor-pointer"
					              title="Edit"
					              style="cursor:pointer;"
					              onclick="editDesignBasis(${item.id})"></i>`}
					</td>
                </tr>
            `;
        }

        document.querySelector("#tableID2 tbody").innerHTML = tableRows;

        if ($.fn.DataTable.isDataTable('#tableID2')) {
            $('#tableID2').DataTable().destroy();
        }

        $('#tableID2').DataTable({
            dom: 'Bfrtip',
            scrollX: false,
            info: true,
            paging: true,
            pageLength: 10,
            lengthMenu: [[10, 25, 50, 100], [10, 25, 50, 100]],
            buttons: [{
                extend: 'excel',
                text: 'Export to Excel',
                title: 'Design Basis List'
            }]
        });

    } catch (error) {
        console.error('Error fetching Design Basis:', error);
    }
}

let selectedDesignBasisId = null;
let originalDesignBasisName = '';

async function editDesignBasis(id) {
	
	const allowed = allowedActions || [];

	 if (!allowed.includes("Edit")) {
	     alert("You do not have permission to edit.");
	     return;
	 }
	
	

    try {
        const apiUrl = new URL(`/api/salescrm/design-basis/${id}`, baseUrl1);

        const response = await fetch(apiUrl, {
            method: "GET",
            credentials: "include"
        });

        if (!response.ok) {
            throw new Error("Failed to fetch Design Basis");
        }

        const data = await response.json();

        selectedDesignBasisId = data.id;
        originalDesignBasisName = data.designBasisName.trim();

        $('#designbasis1').val(data.designBasisName);
        $('#designbasis1Error').hide();

        $('#exampleModalScrollableDesUp').modal('show');

    } catch (error) {
        console.error("Error fetching Design Basis:", error);
        alert("Unable to fetch Design Basis");
    }
}

$('#designbasisupd').on('click', function () {

    const currentDesignBasis = $('#designbasis1').val().trim();

    $('#designbasis1Error').hide();

    if (currentDesignBasis === '') {
        $('#designbasis1Error').text('Design Basis is required').show();
        $('#designbasis1').focus();
        return;
    }

    if (currentDesignBasis === originalDesignBasisName) {
        showPopup('No Fields are changes', 'SaleMaster.jsp');
        return;
    }

    $('#exampleModalScrollableDesUp').modal('hide');
    $('#exampleModalCenter91').modal('show');
});

$('#cancelldesignmodal').on('click', function () {
    $('#exampleModalCenter91').modal('hide');
    $('#exampleModalScrollableDesUp').modal('show');
});

$('#confirmdesignupd').on('click', function () {

    const currentDesignBasis = $('#designbasis1').val().trim();

    $('#exampleModalCenter91').modal('hide');

    $.ajax({
        url: baseUrl1 + '/api/salescrm/design-basis/' + selectedDesignBasisId,
        type: 'PUT',
        contentType: 'application/json',
		xhrFields: { withCredentials: true },
        data: JSON.stringify({
            designBasisName: currentDesignBasis,
            modifiedBy: sessionStorage.getItem('id')
        }),
        success: function (response) {
            console.log('Design Basis updated successfully', response);
            $('#exampleModalScrollableDesUp').modal('hide');
            $('#designbasis1').val('');
            fetchdesignbasis();
            showPopup('Design Basis updated successfully', 'SaleMaster.jsp');
        },
        error: function (xhr, status, error) {
            console.error('Error updating Design Basis:', xhr.responseText);
            alert(xhr.responseText || 'Error updating Design Basis');
        }
    });
});

document.getElementById("sgmnt").addEventListener("click", function () {
	  const allowed =allowedActions || [];

	if (!allowed.includes("Insert")) {
	  alert(" You do not have permission to Insert.");
	  $('#exampleModalScrollableIN').modal('hide');
	  return;
	}
	
	
    $('#exampleModalScrollableSeg').modal('show');
});

$(document).ready(function () {

    // ==============================
    // CREATE SEGMENT
    // ==============================

    $('#submitsegment').on('click', function () {

        const segment = $('#segment').val().trim();

        $('#segmentError').hide();

        if (segment === '') {
            $('#segmentError').text('Segment is required').show();
            $('#segment').focus();
            return;
        }

        $('#exampleModalScrollableSeg').modal('hide');
        $('#exampleModalCenter92').modal('show');
    });

    // ==============================
    // CONFIRM CREATE
    // ==============================

    $('#confirmsegmentYes').on('click', function () {

        const segment = $('#segment').val().trim();

        $('#exampleModalCenter92').modal('hide');

        $.ajax({
            url: baseUrl + '/api/salescrm/segment',
            type: 'POST',
            contentType: 'application/json',
			xhrFields: { withCredentials: true },
            data: JSON.stringify({
                segmentName: segment,
                status: false,
                createdBy: sessionStorage.getItem('id')
            }),
            success: function (response) {
                console.log('Segment created successfully', response);
                $('#segment').val('');
                showPopup('Segment created successfully', 'SaleMaster.jsp');
            },
            error: function (xhr, status, error) {
                console.error('Error creating Segment:', xhr.responseText);
                alert(xhr.responseText || 'Error creating Segment');
            }
        });
    });

    // ==============================
    // CLEAR MODAL WHEN CLOSED
    // ==============================

    $('#exampleModalScrollableSeg').on('hidden.bs.modal', function () {
        $('#segmentError').hide();
    });

});

async function fetchsegment() {

    const apiUrl = new URL('/api/salescrm/segment', baseUrl1);

    try {
        const response = await fetch(apiUrl, {
            method: "GET",
            credentials: "include"
        });

        if (!response.ok) {
            throw new Error("Failed to fetch Segments");
        }

        const segments = await response.json();

        let tableRows = '';

        for (let index = 0; index < segments.length; index++) {

            const item = segments[index];

            tableRows += `
                <tr id="${item.id}">
                    <td>${index + 1}</td>
                    <td>${item.segmentName}</td>
       
					
					<td>
					    ${item.isUsed
					        ? `<i class="fa fa-pen text-muted"
					              title="Already used in clients, leads or enquiries, cannot be edited"
					              style="cursor:not-allowed; opacity:0.4;"></i>`
					        : `<i class="fa fa-pen text-primary cursor-pointer"
					              title="Edit"
					              style="cursor:pointer;"
					              onclick="editSegment(${item.id})"></i>`}
					</td>
                </tr>
            `;
        }

        document.querySelector("#tableID3 tbody").innerHTML = tableRows;

        if ($.fn.DataTable.isDataTable('#tableID3')) {
            $('#tableID3').DataTable().destroy();
        }

        $('#tableID3').DataTable({
            dom: 'Bfrtip',
            scrollX: false,
            info: true,
            paging: true,
            pageLength: 10,
            lengthMenu: [[10, 25, 50, 100], [10, 25, 50, 100]],
            buttons: [{
                extend: 'excel',
                text: 'Export to Excel',
                title: 'Segment List'
            }]
        });

    } catch (error) {
        console.error('Error fetching Segments:', error);
    }
}

let selectedSegmentId = null;
let originalSegmentName = '';

async function editSegment(id) {
	const allowed = allowedActions || [];

	 if (!allowed.includes("Edit")) {
	     alert("You do not have permission to edit.");
	     return;
	 }
	

    try {
        const apiUrl = new URL(`/api/salescrm/segment/${id}`, baseUrl1);

        const response = await fetch(apiUrl, {
            method: "GET",
            credentials: "include"
        });

        if (!response.ok) {
            throw new Error("Failed to fetch Segment");
        }

        const data = await response.json();

        selectedSegmentId = data.id;
        originalSegmentName = data.segmentName.trim();

        $('#segment1').val(data.segmentName);
        $('#segment1Error').hide();

        $('#exampleModalScrollableSegUp').modal('show');

    } catch (error) {
        console.error("Error fetching Segment:", error);
        alert("Unable to fetch Segment");
    }
}

$('#segmentupd').on('click', function () {

    const currentSegment = $('#segment1').val().trim();

    $('#segment1Error').hide();

    if (currentSegment === '') {
        $('#segment1Error').text('Segment is required').show();
        $('#segment1').focus();
        return;
    }

    if (currentSegment === originalSegmentName) {
        showPopup('No Fields are changes', 'SaleMaster.jsp');
        return;
    }

    $('#exampleModalScrollableSegUp').modal('hide');
    $('#exampleModalCenter93').modal('show');
});

$('#cancellsegmentmodal').on('click', function () {
    $('#exampleModalCenter93').modal('hide');
    $('#exampleModalScrollableSegUp').modal('show');
});

$('#confirmsegmentupd').on('click', function () {

    const currentSegment = $('#segment1').val().trim();

    $('#exampleModalCenter93').modal('hide');

    $.ajax({
        url: baseUrl1 + '/api/salescrm/segment/' + selectedSegmentId,
        type: 'PUT',
        contentType: 'application/json',
		xhrFields: { withCredentials: true },
        data: JSON.stringify({
            segmentName: currentSegment,
            modifiedBy: sessionStorage.getItem('id')
        }),
        success: function (response) {
            console.log('Segment updated successfully', response);
            $('#exampleModalScrollableSegUp').modal('hide');
            $('#segment1').val('');
            fetchsegment();
            showPopup('Segment updated successfully', 'SaleMaster.jsp');
        },
        error: function (xhr, status, error) {
            console.error('Error updating Segment:', xhr.responseText);
            alert(xhr.responseText || 'Error updating Segment');
        }
    });
});


document.getElementById("clntBtn").addEventListener("click", function () {
	
	  const allowed =allowedActions || [];

	if (!allowed.includes("Insert")) {
	  alert(" You do not have permission to Insert.");
	  $('#exampleModalScrollableIN').modal('hide');
	  return;
	}
	
	loadCountriesDropdown('#clientCountry');
    loadStatesDropdown('#clientState');
	loadclientsegment('#clientSegment');
	loadZones('#clientZone')
    $('#exampleModalScrollableClient').modal('show');
});

// ==============================
// LOAD STATES INTO A DROPDOWN
// ==============================
async function loadStatesDropdown(selector) {

    try {
        const apiUrl = new URL('/api/location/states', baseUrl1);

        const response = await fetch(apiUrl, {
            method: "GET",
            credentials: "include"
        });

        if (!response.ok) {
            throw new Error("Failed to fetch States");
        }

        const states = await response.json();

        let options = '<option value="">Select State</option>';

        states.forEach(state => {
            options += `<option value="${state.stateId}">${state.stateName}</option>`;
        });

        $(selector).html(options);

    } catch (error) {
        console.error('Error fetching States:', error);
    }
}

// ==============================
// LOAD CITIES BASED ON SELECTED STATE
// ==============================
async function loadCitiesDropdown(stateId, citySelector) {

    $(citySelector).html('<option value="">Select City</option>').prop('disabled', true);

    if (!stateId) {
        return;
    }

    try {
        const apiUrl = new URL(`/api/location/cities/states/${stateId}`, baseUrl1);

        const response = await fetch(apiUrl, {
            method: "GET",
            credentials: "include"
        });

        if (!response.ok) {
            throw new Error("Failed to fetch Cities");
        }

        const cities = await response.json();

        let options = '<option value="">Select City</option>';

        cities.forEach(city => {
            options += `<option value="${city.cityId}">${city.cityName}</option>`;
        });

        $(citySelector).html(options).prop('disabled', false);

    } catch (error) {
        console.error('Error fetching Cities:', error);
    }
}


// ==============================
// LOAD COUNTRIES INTO A DROPDOWN
// ==============================
async function loadCountriesDropdown(selector) {

    try {
        const apiUrl = new URL('/jssl/country/getAllCountryListNew', baseUrl1);

        const response = await fetch(apiUrl, {
            method: "GET",
            credentials: "include"
        });

        if (!response.ok) {
            throw new Error("Failed to fetch Countries");
        }

        const result = await response.json();
        const countries = result.AllCountryDetailsNew || [];

        let options = '<option value="">Select Country</option>';

        countries.forEach(country => {
            options += `<option value="${country.id}" data-name="${country.country_name}">${country.country_code} - ${country.country_name}</option>`;
        });

        $(selector).html(options);

    } catch (error) {
        console.error('Error fetching Countries:', error);
    }
}

// ==============================
// TOGGLE STATE/CITY/PINCODE BASED ON COUNTRY SELECTED
// India -> enabled + mandatory, Others -> disabled + cleared + not mandatory
// ==============================
function toggleIndiaFields(countrySelector, stateSelector, citySelector, pincodeSelector) {
    const selectedOption = $(countrySelector + ' option:selected');
    const countryName = (selectedOption.data('name') || '').toString().toUpperCase();

    if (countryName === 'INDIA') {
        $(stateSelector).prop('disabled', false);
        $(pincodeSelector).prop('disabled', false);

        // Re-populate the states list since it may have been cleared earlier
        loadStatesDropdown(stateSelector);

        // city stays disabled until a state is chosen (existing cascading behavior)
        $(citySelector).prop('disabled', true).html('<option value="">Select City</option>');
    } else {
        $(stateSelector).prop('disabled', true).html('<option value="">Select State</option>');
        $(citySelector).prop('disabled', true).html('<option value="">Select City</option>');
        $(pincodeSelector).prop('disabled', true).val('');

        $(stateSelector).closest('.col-md-6').find('.error-message').hide();
        $(citySelector).closest('.col-md-6').find('.error-message').hide();
        $(pincodeSelector).closest('.col-md-6').find('.error-message').hide();
    }
}

// ==============================
// COUNTRY CHANGE HANDLERS (CREATE + UPDATE MODALS)
// ==============================
$(document).on('change', '#clientCountry', function () {
    toggleIndiaFields('#clientCountry', '#clientState', '#clientCity', '#clientPincode');
});

$(document).on('change', '#clientCountry1', function () {
    toggleIndiaFields('#clientCountry1', '#clientState1', '#clientCity1', '#clientPincode1');
});
// ==============================
// HELPER: IS SELECTED COUNTRY INDIA?
// ==============================
function isIndiaSelected(countrySelector) {
    const selectedOption = $(countrySelector + ' option:selected');
    const countryName = (selectedOption.data('name') || '').toString().toUpperCase();
    return countryName === 'INDIA';
}
// ==============================
// STATE CHANGE -> LOAD CITY (CREATE MODAL)
// ==============================
$(document).on('change', '#clientState', function () {
    const stateId = $(this).val();
    loadCitiesDropdown(stateId, '#clientCity');
});

// ==============================
// STATE CHANGE -> LOAD CITY (UPDATE MODAL)
// ==============================
$(document).on('change', '#clientState1', function () {
    const stateId = $(this).val();
    loadCitiesDropdown(stateId, '#clientCity1');
});

$(document).ready(function () {

    // ==============================
    // CREATE CLIENT
    // ==============================

	$('#submitclient').on('click', function () {

	    const clientName = $('#clientName').val().trim();
	    const contactNo = $('#contactNo').val().trim();
	    const emailAddress = $('#emailAddress').val().trim();
	    const address = $('#clientAddress').val().trim();
	    const countryId = $('#clientCountry').val();
	    const stateId = $('#clientState').val();
	    const cityId = $('#clientCity').val();
	    const pincode = $('#clientPincode').val().trim();
		const Clienttype = $("#Clienttype").val().trim();
	    const indiaSelected = isIndiaSelected('#clientCountry');
		const clientSegment = $("#clientSegment").val();
		const clientZone = $("#clientZone").val();

	    let isValid = true;

	    $('.error-message').hide();

	    if (clientName === '') {
	        $('#clientNameError').text('Client Name is required').show();
	        isValid = false;
	    }

	    if (!/^\d{10}$/.test(contactNo)) {
	        $('#contactNoError').text('Valid 10-digit Contact No is required').show();
	        isValid = false;
	    }

	    if (emailAddress !== '' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailAddress)) {
	        $('#emailAddressError').text('Valid Email Address is required').show();
	        isValid = false;
	    }

	    if (!countryId) {
	        $('#clientCountryError').text('Country is required').show();
	        isValid = false;
	    }

	    if (indiaSelected) {

	        if (!stateId) {
	            $('#clientStateError').text('State is required').show();
	            isValid = false;
	        }

	        if (!cityId) {
	            $('#clientCityError').text('City is required').show();
	            isValid = false;
	        }

	        if (!/^\d{6}$/.test(pincode)) {
	            $('#clientPincodeError').text('Valid 6-digit Pincode is required').show();
	            isValid = false;
	        }
	    }

	    if (address === '') {
	        $('#clientAddressError').text('Address is required').show();
	        isValid = false;
	    }
		if(Clienttype ===''){
			$("#clienttypeError").text('Client Type is Required').show();
			isValid = false;
		}
		if (clientSegment === '') {
		    $("#clientSegmentError").text('Client Segment is required').show();
		    isValid = false;
		}

		if (clientZone === '') {
		    $("#clientzoneError").text('Zone is required').show();
		    isValid = false;
		}

	    if (!isValid) {
	        return;
	    }

	    $('#exampleModalScrollableClient').modal('hide');
	    $('#exampleModalCenter94').modal('show');
	});

    // ==============================
    // CONFIRM CREATE
    // ==============================

	$('#confirmclientYes').on('click', function () {

	    const indiaSelected = isIndiaSelected('#clientCountry');

	    const payload = {
	        clientName: $('#clientName').val().trim(),
	        contactNo: $('#contactNo').val().trim(),
	        emailAddress: $('#emailAddress').val().trim(),
	        address: $('#clientAddress').val().trim(),
	        countryId: $('#clientCountry').val(),
	        stateId: indiaSelected ? $('#clientState').val() : null,
	        cityId: indiaSelected ? $('#clientCity').val() : null,
	        pincode: indiaSelected ? $('#clientPincode').val().trim() : null,
			segmentId: $("#clientSegment").val(),  
			zoneId: $("#clientZone").val(),  
	        status: false,
	        createdBy: sessionStorage.getItem('id'),
			clienttype:$("#Clienttype").val().trim(),
	    };

	    $('#exampleModalCenter94').modal('hide');

	    $.ajax({
	        url: baseUrl + '/api/salescrm/client',
	        type: 'POST',
	        contentType: 'application/json',
			xhrFields: { withCredentials: true },
	        data: JSON.stringify(payload),
	        success: function (response) {
	            console.log('Client created successfully', response);
	            $('#clientForm')[0].reset();
	            $('#clientState').prop('disabled', true);
	            $('#clientCity').prop('disabled', true);
	            $('#clientPincode').prop('disabled', true);
	            showPopup('Client created successfully', 'SaleMaster.jsp');
	        },
	        error: function (xhr, status, error) {
	            console.error('Error creating Client:', xhr.responseText);
	            alert(xhr.responseText || 'Error creating Client');
	        }
	    });
	});

    // ==============================
    // CLEAR MODAL WHEN CLOSED
    // ==============================

    $('#exampleModalScrollableClient').on('hidden.bs.modal', function () {
        $('.error-message').hide();
    });

});

async function fetchclients() {

    const apiUrl = new URL('/api/salescrm/client', baseUrl1);

    try {
        const response = await fetch(apiUrl, {
            method: "GET",
            credentials: "include"
        });

        if (!response.ok) {
            throw new Error("Failed to fetch Clients");
        }

        const clients = await response.json();

        let tableRows = '';

        for (let index = 0; index < clients.length; index++) {

            const item = clients[index];

            tableRows += `
                <tr id="${item.id}">
                    <td>${index + 1}</td>
					<td>${item.clientCode || '-'}</td>
                    <td>${item.clientName}</td>
                    <td>${item.contactNo}</td>
                    <td>${item.emailAddress || ''}</td>
                    <td>${item.address || ''}</td>
					<td>${item.country_name || ''}</td>
                    <td>${item.stateName || ''}</td>
                    <td>${item.cityName || ''}</td>
					<td>${item.pincode || ''}</td>
                
					
					<td>
					    ${item.isUsed
					        ? `<i class="fa fa-pen text-muted"
					              title="Client is used in a project, cannot be edited"
					              style="cursor:not-allowed; opacity:0.4;"></i>`
					        : `<i class="fa fa-pen text-primary cursor-pointer"
					              title="Edit"
					              style="cursor:pointer;"
					              onclick="editClient(${item.id})"></i>`}
					</td>
                </tr>
            `;
        }

        document.querySelector("#tableID4 tbody").innerHTML = tableRows;

        if ($.fn.DataTable.isDataTable('#tableID4')) {
            $('#tableID4').DataTable().destroy();
        }

        $('#tableID4').DataTable({
            dom: 'Bfrtip',
            scrollX: true,
            info: true,
            paging: true,
            pageLength: 10,
            lengthMenu: [[10, 25, 50, 100], [10, 25, 50, 100]],
            buttons: [{
                extend: 'excel',
                text: 'Export to Excel',
                title: 'Client List'
            }]
        });

    } catch (error) {
        console.error('Error fetching Clients:', error);
    }
}

let selectedClientId = null;
let originalClientData = {};

async function editClient(id) {
	
	const allowed = allowedActions || [];

	 if (!allowed.includes("Edit")) {
	     alert("You do not have permission to edit.");
	     return;
	 }
	

    try {
        const apiUrl = new URL(`/api/salescrm/client/${id}`, baseUrl1);

        const response = await fetch(apiUrl, {
            method: "GET",
            credentials: "include"
        });

        if (!response.ok) {
            throw new Error("Failed to fetch Client");
        }

        const data = await response.json();

        selectedClientId = data.id;

        originalClientData = {
            clientName: data.clientName,
            contactNo: data.contactNo,
            emailAddress: data.emailAddress,
            address: data.address,
            countryId: data.countryId,
            stateId: data.stateId,
            cityId: data.cityId,
            pincode: data.pincode,
			clienttype:data.client_type,
			segmentId: data.segment,
			zoneId: data.zone
        };

        $('#clientName1').val(data.clientName);
        $('#contactNo1').val(data.contactNo);
        $('#emailAddress1').val(data.emailAddress);
        $('#clientAddress1').val(data.address);
        $('#clientPincode1').val(data.pincode);
		$("#ClienttypeUp").val(data.client_type);

		

        $('#exampleModalScrollableClientUp .error-message').hide();

        // Load country list first, then select the client's current country
        await loadCountriesDropdown('#clientCountry1');
        $('#clientCountry1').val(data.countryId);
		await loadclientsegment("#clientSegment1");
		$("#clientSegment1").val(data.segment);

		await loadZones("#clientZone1");
		$("#clientZone1").val(data.zone);
        const indiaSelected = isIndiaSelected('#clientCountry1');

        if (indiaSelected) {

            $('#clientState1').prop('disabled', false);
            $('#clientPincode1').prop('disabled', false);

            await loadStatesDropdown('#clientState1');
            $('#clientState1').val(data.stateId);

            await loadCitiesDropdown(data.stateId, '#clientCity1');
            $('#clientCity1').val(data.cityId);

        } else {

            $('#clientState1').prop('disabled', true).html('<option value="">Select State</option>');
            $('#clientCity1').prop('disabled', true).html('<option value="">Select City</option>');
            $('#clientPincode1').prop('disabled', true).val('');
        }

        $('#exampleModalScrollableClientUp').modal('show');

    } catch (error) {
        console.error("Error fetching Client:", error);
        alert("Unable to fetch Client");
    }
}

$('#clientupd').on('click', function () {

    const clientName = $('#clientName1').val().trim();
    const contactNo = $('#contactNo1').val().trim();
    const emailAddress = $('#emailAddress1').val().trim();
    const address = $('#clientAddress1').val().trim();
    const countryId = $('#clientCountry1').val();
    const stateId = $('#clientState1').val();
    const cityId = $('#clientCity1').val();
    const pincode = $('#clientPincode1').val().trim();
    const indiaSelected = isIndiaSelected('#clientCountry1');
	const segmentId = $("#clientSegment1").val();
	const zoneId = $("#clientZone1").val();
	let clienttype = $("#ClienttypeUp").val().trim();

    let isValid = true;

    $('#exampleModalScrollableClientUp .error-message').hide();

    if (clientName === '') {
        $('#clientName1Error').text('Client Name is required').show();
        isValid = false;
    }

    if (!/^\d{10}$/.test(contactNo)) {
        $('#contactNo1Error').text('Valid 10-digit Contact No is required').show();
        isValid = false;
    }

    if (emailAddress !== '' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailAddress)) {
        $('#emailAddress1Error').text('Valid Email Address is required').show();
        isValid = false;
    }

    if (!countryId) {
        $('#clientCountry1Error').text('Country is required').show();
        isValid = false;
    }

    if (indiaSelected) {

        if (!stateId) {
            $('#clientState1Error').text('State is required').show();
            isValid = false;
        }

        if (!cityId) {
            $('#clientCity1Error').text('City is required').show();
            isValid = false;
        }

        if (!/^\d{6}$/.test(pincode)) {
            $('#clientPincode1Error').text('Valid 6-digit Pincode is required').show();
            isValid = false;
        }
    }

    if (address === '') {
        $('#clientAddress1Error').text('Address is required').show();
        isValid = false;
    }
	
	if(clienttype=== ''){
		$("#clienttypeErrorUp").text('Client type is required').show();
		isValid = false;
	}

    if (!isValid) {
        return;
    }

    // Check whether anything actually changed
    const noChange =
        clientName === originalClientData.clientName &&
        contactNo === originalClientData.contactNo &&
        emailAddress === (originalClientData.emailAddress || '') &&
        address === (originalClientData.address || '') &&
		clienttype === String(originalClientData.clienttype || '') &&
		String(segmentId) === String(originalClientData.segmentId) &&
		String(zoneId) === String(originalClientData.zoneId) &&
        String(countryId) === String(originalClientData.countryId) &&
        (indiaSelected
            ? (String(stateId) === String(originalClientData.stateId) &&
               String(cityId) === String(originalClientData.cityId) &&
               pincode === (originalClientData.pincode || ''))
            : true);

    if (noChange) {
        showPopup('No fields are changes', 'SaleMaster.jsp');
        return;
    }

    $('#exampleModalScrollableClientUp').modal('hide');
    $('#exampleModalCenter95').modal('show');
});

$('#cancellclientmodal').on('click', function () {
    $('#exampleModalCenter95').modal('hide');
    $('#exampleModalScrollableClientUp').modal('show');
});

$('#confirmclientupd').on('click', function () {

    const indiaSelected = isIndiaSelected('#clientCountry1');

    const payload = {
        clientName: $('#clientName1').val().trim(),
        contactNo: $('#contactNo1').val().trim(),
        emailAddress: $('#emailAddress1').val().trim(),
        address: $('#clientAddress1').val().trim(),
        countryId: $('#clientCountry1').val(),
        stateId: indiaSelected ? $('#clientState1').val() : null,
        cityId: indiaSelected ? $('#clientCity1').val() : null,
        pincode: indiaSelected ? $('#clientPincode1').val().trim() : null,
        modifiedBy: sessionStorage.getItem('id'),
		clienttype:$("#ClienttypeUp").val().trim(),
		segmentId: $("#clientSegment1").val(),
		zoneId: $("#clientZone1").val(),
    };

    $('#exampleModalCenter95').modal('hide');

    $.ajax({
        url: baseUrl1 + '/api/salescrm/client/' + selectedClientId,
        type: 'PUT',
        contentType: 'application/json',
		xhrFields: { withCredentials: true },
        data: JSON.stringify(payload),
		
        success: function (response) {
            console.log('Client updated successfully', response);
            $('#exampleModalScrollableClientUp').modal('hide');
            fetchclients();
            showPopup('Client updated successfully', 'SaleMaster.jsp');
        },
        error: function (xhr, status, error) {
            console.error('Error updating Client:', xhr.responseText);
            alert(xhr.responseText || 'Error updating Client');
        }
    });
});


document.getElementById("stgBtn").addEventListener("click", function () {
	  const allowed =allowedActions || [];

	if (!allowed.includes("Insert")) {
	  alert(" You do not have permission to Insert.");
	  $('#exampleModalScrollableIN').modal('hide');
	  return;
	}
	
	
    $('#exampleModalScrollableStage').modal('show');
});

$(document).ready(function () {

    // ==============================
    // CREATE CURRENT STAGE
    // ==============================

    $('#submitstage').on('click', function () {

        const currentStage = $('#currentStage').val().trim();

        $('#currentStageError').hide();

        if (currentStage === '') {
            $('#currentStageError').text('Current Stage is required').show();
            $('#currentStage').focus();
            return;
        }

        $('#exampleModalScrollableStage').modal('hide');
        $('#exampleModalCenter96').modal('show');
    });

    // ==============================
    // CONFIRM CREATE
    // ==============================

    $('#confirmstageYes').on('click', function () {

        const currentStage = $('#currentStage').val().trim();

        $('#exampleModalCenter96').modal('hide');

        $.ajax({
            url: baseUrl + '/api/salescrm/current-stage',
            type: 'POST',
            contentType: 'application/json',
			xhrFields: { withCredentials: true },
            data: JSON.stringify({
                stageName: currentStage,
                status: false,
                createdBy: sessionStorage.getItem('id')
            }),
            success: function (response) {
                console.log('Current Stage created successfully', response);
                $('#currentStage').val('');
                showPopup('Current Stage created successfully', 'SaleMaster.jsp');
            },
            error: function (xhr, status, error) {
                console.error('Error creating Current Stage:', xhr.responseText);
                alert(xhr.responseText || 'Error creating Current Stage');
            }
        });
    });

    // ==============================
    // CLEAR MODAL WHEN CLOSED
    // ==============================

    $('#exampleModalScrollableStage').on('hidden.bs.modal', function () {
        $('#currentStageError').hide();
    });

});

async function fetchstage() {

    const apiUrl = new URL('/api/salescrm/current-stage', baseUrl1);

    try {
        const response = await fetch(apiUrl, {
            method: "GET",
            credentials: "include"
        });

        if (!response.ok) {
            throw new Error("Failed to fetch Current Stages");
        }

        const stages = await response.json();

        let tableRows = '';

        for (let index = 0; index < stages.length; index++) {

            const item = stages[index];

            tableRows += `
                <tr id="${item.id}">
                    <td>${index + 1}</td>
                    <td>${item.stageName}</td>
               
					
					<td>
					    ${item.isUsed
					        ? `<i class="fa fa-pen text-muted"
					              title="Already used in leads or enquiries, cannot be edited"
					              style="cursor:not-allowed; opacity:0.4;"></i>`
					        : `<i class="fa fa-pen text-primary cursor-pointer"
					              title="Edit"
					              style="cursor:pointer;"
					              onclick="editStage(${item.id})"></i>`}
					</td>
                </tr>
            `;
        }

        document.querySelector("#tableID5 tbody").innerHTML = tableRows;

        if ($.fn.DataTable.isDataTable('#tableID5')) {
            $('#tableID5').DataTable().destroy();
        }

        $('#tableID5').DataTable({
            dom: 'Bfrtip',
            scrollX: false,
            info: true,
            paging: true,
            pageLength: 10,
            lengthMenu: [[10, 25, 50, 100], [10, 25, 50, 100]],
            buttons: [{
                extend: 'excel',
                text: 'Export to Excel',
                title: 'Current Stage List'
            }]
        });

    } catch (error) {
        console.error('Error fetching Current Stages:', error);
    }
}

let selectedStageId = null;
let originalStageName = '';

async function editStage(id) {
	
	const allowed = allowedActions || [];

	 if (!allowed.includes("Edit")) {
	     alert("You do not have permission to edit.");
	     return;
	 }
	

    try {
        const apiUrl = new URL(`/api/salescrm/current-stage/${id}`, baseUrl1);

        const response = await fetch(apiUrl, {
            method: "GET",
            credentials: "include"
        });

        if (!response.ok) {
            throw new Error("Failed to fetch Current Stage");
        }

        const data = await response.json();

        selectedStageId = data.id;
        originalStageName = data.stageName.trim();

        $('#currentStage1').val(data.stageName);
        $('#currentStage1Error').hide();

        $('#exampleModalScrollableStageUp').modal('show');

    } catch (error) {
        console.error("Error fetching Current Stage:", error);
        alert("Unable to fetch Current Stage");
    }
}

$('#stageupd').on('click', function () {

    const currentStage = $('#currentStage1').val().trim();

    $('#currentStage1Error').hide();

    if (currentStage === '') {
        $('#currentStage1Error').text('Current Stage is required').show();
        $('#currentStage1').focus();
        return;
    }

    if (currentStage === originalStageName) {
        showPopup('No Fields are changes', 'SaleMaster.jsp');
        return;
    }

    $('#exampleModalScrollableStageUp').modal('hide');
    $('#exampleModalCenter97').modal('show');
});

$('#cancellstagemodal').on('click', function () {
    $('#exampleModalCenter97').modal('hide');
    $('#exampleModalScrollableStageUp').modal('show');
});

$('#confirmstageupd').on('click', function () {

    const currentStage = $('#currentStage1').val().trim();

    $('#exampleModalCenter97').modal('hide');

    $.ajax({
        url: baseUrl1 + '/api/salescrm/current-stage/' + selectedStageId,
        type: 'PUT',
        contentType: 'application/json',
		xhrFields: { withCredentials: true },
        data: JSON.stringify({
            stageName: currentStage,
            modifiedBy: sessionStorage.getItem('id')
        }),
        success: function (response) {
            console.log('Current Stage updated successfully', response);
            $('#exampleModalScrollableStageUp').modal('hide');
            $('#currentStage1').val('');
            fetchstage();
            showPopup('Current Stage updated successfully', 'SaleMaster.jsp');
        },
        error: function (xhr, status, error) {
            console.error('Error updating Current Stage:', xhr.responseText);
            alert(xhr.responseText || 'Error updating Current Stage');
        }
    });
});


/*document.getElementById("cntctBtn").addEventListener("click", async function () {
    $('#contactForm')[0].reset();
    await loadClientCheckboxes('#clientCheckboxList', []);
    updateClientDropdownLabel('#clientCheckboxList', '#clientDropdownBtn');
    $('#exampleModalScrollableContact').modal('show');
});

// ==============================
// LOAD CLIENT CHECKBOXES INTO DROPDOWN
// ==============================
async function loadClientCheckboxes(containerSelector, selectedIds) {

    try {
        const apiUrl = new URL('/api/salescrm/client', baseUrl1);

        const response = await fetch(apiUrl, {
            method: "GET",
            credentials: "include"
        });

        if (!response.ok) {
            throw new Error("Failed to fetch Clients");
        }

        const clients = await response.json();

        let html = '';

        clients.forEach(client => {
            const checked = selectedIds.includes(client.id) ? 'checked' : '';
            html += `
                <div class="form-check">
                    <input class="form-check-input client-checkbox" type="checkbox"
                        value="${client.id}" id="client_${containerSelector.replace('#','')}_${client.id}"
                        data-clientname="${client.clientName}" ${checked}>
                    <label class="form-check-label" for="client_${containerSelector.replace('#','')}_${client.id}">
                        ${client.clientName}
                    </label>
                </div>
            `;
        });

        $(containerSelector).html(html || '<div class="text-muted small">No clients found</div>');

    } catch (error) {
        console.error('Error fetching Clients for dropdown:', error);
    }
}

// ==============================
// UPDATE DROPDOWN BUTTON LABEL BASED ON CHECKED ITEMS
// ==============================
function updateClientDropdownLabel(containerSelector, btnSelector) {

    const checkedBoxes = $(containerSelector + ' .client-checkbox:checked');

    if (checkedBoxes.length === 0) {
        $(btnSelector).text('Select Client(s)');
        return;
    }

    const names = checkedBoxes.map(function () {
        return $(this).data('clientname');
    }).get();

    $(btnSelector).text(names.join(', '));
}

// Keep dropdown open while checking multiple boxes, and refresh label live
$(document).on('click', '.client-checkbox', function (e) {
    e.stopPropagation();

    const containerId = '#' + $(this).closest('[id^="clientCheckboxList"]').attr('id');
    const btnId = containerId === '#clientCheckboxList' ? '#clientDropdownBtn' : '#clientDropdownBtn1';

    updateClientDropdownLabel(containerId, btnId);
});

$(document).on('click', '.dropdown-menu.p-2', function (e) {
    e.stopPropagation();
});

function getSelectedClientIds(containerSelector) {
    return $(containerSelector + ' .client-checkbox:checked').map(function () {
        return parseInt($(this).val());
    }).get();
}

$(document).ready(function () {

    // ==============================
    // CREATE CONTACT PERSON
    // ==============================

    $('#submitcontact').on('click', function () {

        const contactName = $('#contactName').val().trim();
        const designation = $('#designation').val().trim();
        const mobileNo = $('#mobileNo').val().trim();
        const alternateNo = $('#alternateNo').val().trim();
        const email = $('#contactEmail').val().trim();
        const clientIds = getSelectedClientIds('#clientCheckboxList');

        let isValid = true;

        $('#exampleModalScrollableContact .error-message').hide();

        if (contactName === '') {
            $('#contactNameError').text('Contact Name is required').show();
            isValid = false;
        }

        if (designation === '') {
            $('#designationError').text('Designation is required').show();
            isValid = false;
        }

        if (!/^\d{10}$/.test(mobileNo)) {
            $('#mobileNoError').text('Valid 10-digit Mobile No is required').show();
            isValid = false;
        }

        if (alternateNo !== '' && !/^\d{10}$/.test(alternateNo)) {
            $('#alternateNoError').text('Valid 10-digit Alternate No required').show();
            isValid = false;
        }

        if (email !== '' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            $('#contactEmailError').text('Valid Email Address is required').show();
            isValid = false;
        }

        if (clientIds.length === 0) {
            $('#clientListError').text('Select at least one Client').show();
            isValid = false;
        }

        if (!isValid) {
            return;
        }

        $('#exampleModalScrollableContact').modal('hide');
        $('#exampleModalCenter98').modal('show');
    });

    // ==============================
    // CONFIRM CREATE
    // ==============================

    $('#confirmcontactYes').on('click', function () {

        const payload = {
            contactName: $('#contactName').val().trim(),
            designation: $('#designation').val().trim(),
            mobileNo: $('#mobileNo').val().trim(),
            alternateMobileNo: $('#alternateNo').val().trim(),
            emailAddress: $('#contactEmail').val().trim(),
            clientIds: getSelectedClientIds('#clientCheckboxList'),
            status: false,
            createdBy: sessionStorage.getItem('id')
        };

        $('#exampleModalCenter98').modal('hide');

        $.ajax({
            url: baseUrl + '/api/salescrm/contact-person',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(payload),
            success: function (response) {
                console.log('Contact Person created successfully', response);
                $('#contactForm')[0].reset();
                showPopup('Contact Person created successfully', 'SaleMaster.jsp');
            },
            error: function (xhr, status, error) {
                console.error('Error creating Contact Person:', xhr.responseText);
                alert(xhr.responseText || 'Error creating Contact Person');
            }
        });
    });

    $('#exampleModalScrollableContact').on('hidden.bs.modal', function () {
        $('.error-message').hide();
    });

});

async function fetchcontacts() {

    const apiUrl = new URL('/api/salescrm/contact-person', baseUrl1);

    try {
        const response = await fetch(apiUrl, {
            method: "GET",
            credentials: "include"
        });

        if (!response.ok) {
            throw new Error("Failed to fetch Contact Persons");
        }

        const contacts = await response.json();

        let tableRows = '';

        for (let index = 0; index < contacts.length; index++) {

            const item = contacts[index];

            tableRows += `
                <tr id="${item.id}">
                    <td>${index + 1}</td>
                    <td>${item.contactName}</td>
                    <td>${item.designation || ''}</td>
                    <td>${item.mobileNo}</td>
                    <td>${item.alternateMobileNo || ''}</td>
                    <td>${item.emailAddress || ''}</td>
                    <td>${item.clientNames || ''}</td>
                    <td>
                        <i class="fa fa-pen text-primary cursor-pointer"
                           title="Edit"
                           style="cursor:pointer;"
                           onclick="editContact(${item.id})">
                        </i>
                    </td>
                </tr>
            `;
        }

        document.querySelector("#tableID6 tbody").innerHTML = tableRows;

        if ($.fn.DataTable.isDataTable('#tableID6')) {
            $('#tableID6').DataTable().destroy();
        }

        $('#tableID6').DataTable({
            dom: 'Bfrtip',
            scrollX: true,
            info: true,
            paging: true,
            pageLength: 10,
            lengthMenu: [[10, 25, 50, 100], [10, 25, 50, 100]],
            buttons: [{
                extend: 'excel',
                text: 'Export to Excel',
                title: 'Contact Person List'
            }]
        });

    } catch (error) {
        console.error('Error fetching Contact Persons:', error);
    }
}

let selectedContactId = null;
let originalContactData = {};

async function editContact(id) {

    try {
        const apiUrl = new URL(`/api/salescrm/contact-person/${id}`, baseUrl1);

        const response = await fetch(apiUrl, {
            method: "GET",
            credentials: "include"
        });

        if (!response.ok) {
            throw new Error("Failed to fetch Contact Person");
        }

        const data = await response.json();

        selectedContactId = data.id;

        const activeClientIds = (data.clientIds || []);

        originalContactData = {
            contactName: data.contactName,
            designation: data.designation,
            mobileNo: data.mobileNo,
            alternateMobileNo: data.alternateMobileNo,
            emailAddress: data.emailAddress,
            clientIds: [...activeClientIds].sort()
        };

        $('#contactName1').val(data.contactName);
        $('#designation1').val(data.designation);
        $('#mobileNo1').val(data.mobileNo);
        $('#alternateNo1').val(data.alternateMobileNo);
        $('#contactEmail1').val(data.emailAddress);

        $('#exampleModalScrollableContactUp .error-message').hide();

        await loadClientCheckboxes('#clientCheckboxList1', activeClientIds);
        updateClientDropdownLabel('#clientCheckboxList1', '#clientDropdownBtn1');

        $('#exampleModalScrollableContactUp').modal('show');

    } catch (error) {
        console.error("Error fetching Contact Person:", error);
        alert("Unable to fetch Contact Person");
    }
}

$('#contactupd').on('click', function () {

    const contactName = $('#contactName1').val().trim();
    const designation = $('#designation1').val().trim();
    const mobileNo = $('#mobileNo1').val().trim();
    const alternateNo = $('#alternateNo1').val().trim();
    const email = $('#contactEmail1').val().trim();
    const clientIds = getSelectedClientIds('#clientCheckboxList1');

    let isValid = true;

    $('#exampleModalScrollableContactUp .error-message').hide();

    if (contactName === '') {
        $('#contactName1Error').text('Contact Name is required').show();
        isValid = false;
    }

    if (designation === '') {
        $('#designation1Error').text('Designation is required').show();
        isValid = false;
    }

    if (!/^\d{10}$/.test(mobileNo)) {
        $('#mobileNo1Error').text('Valid 10-digit Mobile No is required').show();
        isValid = false;
    }

    if (alternateNo !== '' && !/^\d{10}$/.test(alternateNo)) {
        $('#alternateNo1Error').text('Valid 10-digit Alternate No required').show();
        isValid = false;
    }

    if (email !== '' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        $('#contactEmail1Error').text('Valid Email Address is required').show();
        isValid = false;
    }

    if (clientIds.length === 0) {
        $('#clientList1Error').text('Select at least one Client').show();
        isValid = false;
    }

    if (!isValid) {
        return;
    }

    const noChange =
        contactName === originalContactData.contactName &&
        designation === (originalContactData.designation || '') &&
        mobileNo === originalContactData.mobileNo &&
        alternateNo === (originalContactData.alternateMobileNo || '') &&
        email === (originalContactData.emailAddress || '') &&
        JSON.stringify([...clientIds].sort()) === JSON.stringify(originalContactData.clientIds);

    if (noChange) {
        showPopup('No Feilds are changes', 'SaleMaster.jsp');
        return;
    }

    $('#exampleModalScrollableContactUp').modal('hide');
    $('#exampleModalCenter99').modal('show');
});

$('#cancellcontactmodal').on('click', function () {
    $('#exampleModalCenter99').modal('hide');
    $('#exampleModalScrollableContactUp').modal('show');
});

$('#confirmcontactupd').on('click', function () {

    const payload = {
        contactName: $('#contactName1').val().trim(),
        designation: $('#designation1').val().trim(),
        mobileNo: $('#mobileNo1').val().trim(),
        alternateMobileNo: $('#alternateNo1').val().trim(),
        emailAddress: $('#contactEmail1').val().trim(),
        clientIds: getSelectedClientIds('#clientCheckboxList1'),
        modifiedBy: sessionStorage.getItem('id')
    };

    $('#exampleModalCenter99').modal('hide');

    $.ajax({
        url: baseUrl1 + '/api/salescrm/contact-person/' + selectedContactId,
        type: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify(payload),
        success: function (response) {
            console.log('Contact Person updated successfully', response);
            $('#exampleModalScrollableContactUp').modal('hide');
            fetchcontacts();
            showPopup('Contact Person updated successfully', 'SaleMaster.jsp');
        },
        error: function (xhr, status, error) {
            console.error('Error updating Contact Person:', xhr.responseText);
            alert(xhr.responseText || 'Error updating Contact Person');
        }
    });
});
*/
async function fetchcontacts() {

    const apiUrl = new URL('/api/salescrm/contact-person', baseUrl1);

    try {
        const response = await fetch(apiUrl, {
            method: "GET",
            credentials: "include"
        });

        if (!response.ok) {
            throw new Error("Failed to fetch Contact Persons");
        }

        const contacts = await response.json();

        let tableRows = '';

        for (let index = 0; index < contacts.length; index++) {

            const item = contacts[index];

            tableRows += `
                <tr id="${item.id}">
                    <td>${index + 1}</td>
                    <td>${item.contactName}</td>
                    <td>${item.designation || ''}</td>
                    <td>${item.mobileNo}</td>
                    <td>${item.alternateMobileNo || ''}</td>
                    <td>${item.emailAddress || ''}</td>
                    <td>${item.clientNames || ''}</td>
					<td>
					    ${item.isUsed
					        ? `<i class="fa fa-pen text-muted"
					              title="Already used in activities, cannot be edited"
					              style="cursor:not-allowed; opacity:0.4; margin-right:10px;">
					           </i>`
					        : `<i class="fa fa-pen text-primary cursor-pointer"
					              title="Edit"
					              style="cursor:pointer; margin-right:10px;"
					              onclick="editContact(${item.id}, ${item.clientId})">
					           </i>`}
					</td>
					<td>
					    ${item.isUsed
					        ? `<i class="fa fa-trash text-muted"
					              title="Already used in activities, cannot be deleted"
					              style="cursor:not-allowed; opacity:0.4;">
					           </i>`
					        : `<i class="fa fa-trash text-danger cursor-pointer"
					              title="Delete"
					              style="cursor:pointer;"
					              onclick="deleteContactFromMaster(${item.id})">
					           </i>`}
					</td>
                </tr>
            `;
        }

        document.querySelector("#tableID6 tbody").innerHTML = tableRows;

        if ($.fn.DataTable.isDataTable('#tableID6')) {
            $('#tableID6').DataTable().destroy();
        }

        $('#tableID6').DataTable({
            dom: 'Bfrtip',
            scrollX: true,
            info: true,
            paging: true,
            pageLength: 10,
            lengthMenu: [[10, 25, 50, 100], [10, 25, 50, 100]],
            buttons: [{
                extend: 'excel',
                text: 'Export to Excel',
                title: 'Contact Person List'
            }]
        });

    } catch (error) {
        console.error('Error fetching Contact Persons:', error);
    }
}

// ==============================
// DELETE FROM MASTER TABLE -> refresh master table after
// ==============================

let selectedContactIdForDelete = null;

function deleteContactFromMaster(id) {
	
	
	const allowed = allowedActions || [];

	 if (!allowed.includes("Delete")) {
	     alert("You do not have permission to Delete.");
	     return;
	 }
	

    // Store selected contact ID
    selectedContactIdForDelete = id;

    // Open confirmation modal
    $('#exampleModalCenterDeleteContact').modal('show');
}

$(document).on('click', '#confirmDeleteContact', function () {

    if (!selectedContactIdForDelete) {
        return;
    }

    const contactId = selectedContactIdForDelete;

    const deletedBy = sessionStorage.getItem('id');

    // Hide confirmation modal
    $('#exampleModalCenterDeleteContact').modal('hide');

    $.ajax({

        url: baseUrl1 +
             '/api/salescrm/contact-person/' +
             contactId +
             '?deletedBy=' +
             encodeURIComponent(deletedBy),

        type: 'DELETE',
		xhrFields: { withCredentials: true },

        success: async function () {

            selectedContactIdForDelete = null;

            await fetchcontacts();

            showPopup(
                'Contact Person deleted successfully',
                'SaleMaster.jsp'
            );
        },

        error: function (xhr, status, error) {

            console.error(
                'Error deleting Contact Person:',
                xhr.responseText
            );

            alert(
                xhr.responseText ||
                'Error deleting Contact Person'
            );
        }

    });

});
/*function deleteContactFromMaster(id) {

    if (!confirm('Delete this contact person?')) {
        return;
    }

    $.ajax({
        url: baseUrl1 + '/api/salescrm/contact-person/' + id + '?deletedBy=' + sessionStorage.getItem('id'),
        type: 'DELETE',
        success: async function () {
            await fetchcontacts();
            showPopup('Contact Person deleted successfully', 'SaleMaster.jsp');
        },
        error: function (xhr, status, error) {
            console.error('Error deleting Contact Person:', xhr.responseText);
            alert(xhr.responseText || 'Error deleting Contact Person');
        }
    });
}
*/

// ==============================
// OPEN CONTACT MODAL -> LOAD CLIENT DROPDOWN
// ==============================
document.getElementById("cntctBtn").addEventListener("click", async function () {
	  const allowed =allowedActions || [];

	if (!allowed.includes("Insert")) {
	  alert(" You do not have permission to Insert.");
	  $('#exampleModalScrollableIN').modal('hide');
	  return;
	}
	
	
    await loadClientSelectDropdown('#contactClientSelect');
    $('#clientContactsWrapper').hide();
    $('#contactClientSelect').val('');
    $('#contactClientError').hide();
    $('#exampleModalScrollableContact').modal('show');
});

// ==============================
// LOAD CLIENTS INTO SELECT DROPDOWN
// ==============================
async function loadClientSelectDropdown(selector) {
    try {
        const apiUrl = new URL('/api/salescrm/client', baseUrl1);
        const response = await fetch(apiUrl, { method: "GET", credentials: "include" });

        if (!response.ok) throw new Error("Failed to fetch Clients");

        const clients = await response.json();

        let options = '<option value="">Select Client</option>';
        clients.forEach(c => {
            options += `<option value="${c.id}">${c.clientName}</option>`;
        });

        $(selector).html(options);

    } catch (error) {
        console.error('Error fetching Clients:', error);
    }
}

// ==============================
// CLIENT SELECTED -> SHOW EXISTING CONTACTS FOR THAT CLIENT
// ==============================
$(document).on('change', '#contactClientSelect', async function () {
    const clientId = $(this).val();
    $('#contactClientError').hide();

    if (!clientId) {
        $('#clientContactsWrapper').hide();
        return;
    }

    await loadContactsForClient(clientId);
    $('#clientContactsWrapper').show();
});

// ==============================
// FETCH + RENDER CONTACTS FOR A GIVEN CLIENT
// ==============================
// ==============================
// FETCH + RENDER CONTACTS FOR A GIVEN CLIENT (READ-ONLY, reference only)
// ==============================
async function loadContactsForClient(clientId) {
    try {
        const apiUrl = new URL(`/api/salescrm/contact-person/by-client/${clientId}`, baseUrl1);
        const response = await fetch(apiUrl, { method: "GET", credentials: "include" });

        if (!response.ok) throw new Error("Failed to fetch Contacts");

        const contacts = await response.json();

        let rows = '';

        contacts.forEach(c => {
            rows += `
                <tr>
                    <td>${c.contactName}</td>
                    <td>${c.designation || ''}</td>
                    <td>${c.mobileNo}</td>
                    <td>${c.alternateMobileNo || ''}</td>
                    <td>${c.emailAddress || ''}</td>
                </tr>`;
        });

        $('#clientContactsTable tbody').html(
            rows || '<tr><td colspan="5" class="text-muted text-center">No contacts yet for this client</td></tr>'
        );

    } catch (error) {
        console.error('Error fetching Contacts for Client:', error);
    }
}

// ==============================
// ADD NEW CONTACT BUTTON -> OPEN CREATE MODAL WITH CLIENT PRESET
// ==============================
$(document).on('click', '#addNewContactBtn', function () {

    const clientId = $('#contactClientSelect').val();

    if (!clientId) {
        $('#contactClientError').text('Client is required').show();
        return;
    }

    $('#contactForm')[0].reset();
    $('#exampleModalScrollableContactCreate .error-message').hide();
    $('#contactClientIdHidden').val(clientId);
    $('#exampleModalScrollableContactCreate').modal('show');
});

// ==============================
// CREATE CONTACT — VALIDATE
// ==============================
$(document).on('click', '#submitcontact', function () {

    const clientId = $('#contactClientIdHidden').val().trim();
    const contactName = $('#contactName').val().trim();
    const designation = $('#designation').val().trim();
    const mobileNo = $('#mobileNo').val().trim();
    const alternateNo = $('#alternateNo').val().trim();
    const email = $('#contactEmail').val().trim();

    let isValid = true;

    // Clear all previous errors
    $('#exampleModalScrollableContactCreate .error-message').hide();

    // =========================
    // CLIENT VALIDATION
    // =========================
    if (clientId === '') {
        alert('Client is required');
        isValid = false;
    }

	// =========================
	// DESIGNATION VALIDATION
	// =========================
	if (designation === '') {

	    $('#designationError')
	        .text('Designation is required')
	        .show();

	    isValid = false;
	}
	
    // =========================
    // CONTACT NAME VALIDATION
    // =========================
    if (contactName === '') {
        $('#contactNameError')
            .text('Contact Name is required')
            .show();

        isValid = false;
    }

    // =========================
    // MOBILE NUMBER VALIDATION
    // =========================
    if (mobileNo === '') {

        $('#mobileNoError')
            .text('Mobile No is required')
            .show();

        isValid = false;

    } else if (!/^\d{10}$/.test(mobileNo)) {

        $('#mobileNoError')
            .text('Valid 10-digit Mobile No is required')
            .show();

        isValid = false;
    }

    // =========================
    // ALTERNATE MOBILE VALIDATION
    // =========================
    if (
        alternateNo !== '' &&
        !/^\d{10}$/.test(alternateNo)
    ) {

        $('#alternateNoError')
            .text('Valid 10-digit Alternate No is required')
            .show();

        isValid = false;
    }

    // =========================
    // EMAIL VALIDATION
    // =========================
	if (email === '') {

	    $('#contactEmailError')
	        .text('Email Address is required')
	        .show();

	    isValid = false;

	} else if (
	    !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
	        .test(email)
	) {

	    $('#contactEmailError')
	        .text('Please enter a valid email address')
	        .show();

	    isValid = false;
	}

    // =========================
    // STOP IF VALIDATION FAILED
    // =========================
    if (!isValid) {
        return;
    }

    // =========================
    // OPEN CONFIRMATION MODAL
    // =========================
    $('#exampleModalScrollableContactCreate')
        .modal('hide');

    $('#exampleModalCenter98')
        .modal('show');

});
// ==============================
// CONFIRM CREATE
// ==============================
$(document).on('click', '#confirmcontactYes', function () {

    const clientId = $('#contactClientIdHidden').val();

    const payload = {
        contactName: $('#contactName').val().trim(),
        designation: $('#designation').val().trim(),
        mobileNo: $('#mobileNo').val().trim(),
        alternateMobileNo: $('#alternateNo').val().trim(),
        emailAddress: $('#contactEmail').val().trim(),
        clientId: clientId,
        createdBy: sessionStorage.getItem('id')
    };

    $('#exampleModalCenter98').modal('hide');

    $.ajax({
        url: baseUrl + '/api/salescrm/contact-person',
        type: 'POST',
        contentType: 'application/json',
		xhrFields: { withCredentials: true },
        data: JSON.stringify(payload),
        success: async function (response) {
            console.log('Contact Person created successfully', response);
            $('#contactForm')[0].reset();
            await loadContactsForClient(clientId);   // refresh reference view
            if (typeof fetchcontacts === 'function') {
                await fetchcontacts();                // refresh master table too, if present
            }
            showPopup('Contact Person created successfully', 'SaleMaster.jsp');
        },
        error: function (xhr, status, error) {
            console.error('Error creating Contact Person:', xhr.responseText);
            alert(xhr.responseText || 'Error creating Contact Person');
        }
    });
});

$('#exampleModalScrollableContact').on('hidden.bs.modal', function () {
    $('.error-message').hide();
});

// ==============================
// EDIT CONTACT (personal fields only)
// ==============================
let selectedContactId = null;
let selectedContactClientId = null;
let originalContactData = {};

async function editContact(id, clientId) {
	
	
	
	const allowed = allowedActions || [];

	 if (!allowed.includes("Edit")) {
	     alert("You do not have permission to edit.");
	     return;
	 }

    try {
        const apiUrl = new URL(`/api/salescrm/contact-person/${id}`, baseUrl1);

        const response = await fetch(apiUrl, {
            method: "GET",
            credentials: "include"
        });

        if (!response.ok) {
            throw new Error("Failed to fetch Contact Person");
        }

        const data = await response.json();

        selectedContactId = data.id;
        selectedContactClientId = clientId;

        originalContactData = {
            contactName: data.contactName,
            designation: data.designation,
            mobileNo: data.mobileNo,
            alternateMobileNo: data.alternateMobileNo,
            emailAddress: data.emailAddress
        };

        $('#contactName1').val(data.contactName);
        $('#designation1').val(data.designation);
        $('#mobileNo1').val(data.mobileNo);
        $('#alternateNo1').val(data.alternateMobileNo);
        $('#contactEmail1').val(data.emailAddress);
        $('#contactClientIdHidden1').val(clientId);

        $('#exampleModalScrollableContactUp .error-message').hide();
        $('#exampleModalScrollableContactUp').modal('show');

    } catch (error) {
        console.error("Error fetching Contact Person:", error);
        alert("Unable to fetch Contact Person");
    }
}

$(document).on('click', '#contactupd', function () {

    const contactName = $('#contactName1').val().trim();
    const designation = $('#designation1').val().trim();
    const mobileNo = $('#mobileNo1').val().trim();
    const alternateNo = $('#alternateNo1').val().trim();
    const email = $('#contactEmail1').val().trim();

    let isValid = true;

    $('#exampleModalScrollableContactUp .error-message').hide();

    if (contactName === '') {
        $('#contactName1Error').text('Contact Name is required').show();
        isValid = false;
    }

    if (!/^\d{10}$/.test(mobileNo)) {
        $('#mobileNo1Error').text('Valid 10-digit Mobile No is required').show();
        isValid = false;
    }

    if (alternateNo !== '' && !/^\d{10}$/.test(alternateNo)) {
        $('#alternateNo1Error').text('Valid 10-digit Alternate No required').show();
        isValid = false;
    }

    if (email !== '' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        $('#contactEmail1Error').text('Valid Email Address is required').show();
        isValid = false;
    }

    if (!isValid) {
        return;
    }

    const noChange =
        contactName === originalContactData.contactName &&
        designation === (originalContactData.designation || '') &&
        mobileNo === originalContactData.mobileNo &&
        alternateNo === (originalContactData.alternateMobileNo || '') &&
        email === (originalContactData.emailAddress || '');

    if (noChange) {
        showPopup('No Fields are changes', 'SaleMaster.jsp');
        return;
    }

    $('#exampleModalScrollableContactUp').modal('hide');
    $('#exampleModalCenter99').modal('show');
});

$(document).on('click', '#cancellcontactmodal', function () {
    $('#exampleModalCenter99').modal('hide');
    $('#exampleModalScrollableContactUp').modal('show');
});

$(document).on('click', '#confirmcontactupd', function () {

    const payload = {
        contactName: $('#contactName1').val().trim(),
        designation: $('#designation1').val().trim(),
        mobileNo: $('#mobileNo1').val().trim(),
        alternateMobileNo: $('#alternateNo1').val().trim(),
        emailAddress: $('#contactEmail1').val().trim(),
        modifiedBy: sessionStorage.getItem('id')
    };

    $('#exampleModalCenter99').modal('hide');

    $.ajax({
        url: baseUrl1 + '/api/salescrm/contact-person/' + selectedContactId,
        type: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify(payload),
		xhrFields: { withCredentials: true },
        success: async function (response) {
            console.log('Contact Person updated successfully', response);
            $('#exampleModalScrollableContactUp').modal('hide');
            await fetchcontacts();
            showPopup('Contact Person updated successfully', 'SaleMaster.jsp');
        },
        error: function (xhr, status, error) {
            console.error('Error updating Contact Person:', xhr.responseText);
            alert(xhr.responseText || 'Error updating Contact Person');
        }
    });
});

// ==============================
// DELETE CONTACT
// ==============================
function deleteContact(id, clientId) {

    if (!confirm('Delete this contact person?')) {
        return;
    }

    $.ajax({
        url: baseUrl1 + '/api/salescrm/contact-person/' + id + '?deletedBy=' + sessionStorage.getItem('id'),
        type: 'DELETE',
        success: async function () {
            await loadContactsForClient(clientId);
            showPopup('Contact Person deleted successfully', 'SaleMaster.jsp');
        },
        error: function (xhr, status, error) {
            console.error('Error deleting Contact Person:', xhr.responseText);
            alert(xhr.responseText || 'Error deleting Contact Person');
        }
    });
}


document.getElementById("prjctBtn").addEventListener("click", function () {
	  const allowed =allowedActions || [];

	if (!allowed.includes("Insert")) {
	  alert(" You do not have permission to Insert.");
	  $('#exampleModalScrollableIN').modal('hide');
	  return;
	}
	
	
    $('#exampleModalScrollableProject').modal('show');
});

/*// Load client list into both dropdowns
function loadClients() {
    $.ajax({
        url: baseUrl + '/api/salescrm/client', // adjust if your client list endpoint differs
        type: 'GET',
        xhrFields: { withCredentials: true },
        success: function (clients) {
            let options = '<option value="">-- Select Client --</option>';
            clients.forEach(function (c) {
                options += `<option value="${c.id}">${c.clientName}</option>`;
            });
            $('#clientSelectInput').html(options);
            $('#clientSelectInput1').html(options);
        },
        error: function (xhr) {
            console.error('Error loading clients:', xhr.responseText);
        }
    });
}


function loadZones1() {
    $.ajax({
        url: baseUrl + '/api/salescrm/zone', // adjust if your client list endpoint differs
        type: 'GET',
        xhrFields: { withCredentials: true },
        success: function (clients) {
            let options = '<option value="">-- Select Zones --</option>';
            clients.forEach(function (c) {
                options += `<option value="${c.id}">${c.zoneName}</option>`;
            });
            $('#ZoneSelectInput').html(options);
			$('#ZoneSelectInput1').html(options);
           // $('#clientSelectInput1').html(options);
        },
        error: function (xhr) {
            console.error('Error loading clients:', xhr.responseText);
        }
    });
}


$(document).ready(function () {

    loadClients();
	loadZones1();

    // ==============================
    // CREATE PROJECT NAME
    // ==============================

    $('#submitproject').on('click', function () {

        const projectName = $('#projectNameInput').val().trim();
        const clientId = $('#clientSelectInput').val();

        $('#projectNameInputError').hide();
        $('#clientSelectInputError').hide();

        let hasError = false;

        if (clientId === '') {
            $('#clientSelectInputError').text('Client is required').show();
            hasError = true;
        }

        if (projectName === '') {
            $('#projectNameInputError').text('Project Name is required').show();
            hasError = true;
        }

        if (hasError) return;

        $('#exampleModalScrollableProject').modal('hide');
        $('#exampleModalCenter100').modal('show');
    });

    // ==============================
    // CONFIRM CREATE
    // ==============================

    $('#confirmprojectYes').on('click', function () {

        const projectName = $('#projectNameInput').val().trim();
        const clientId = $('#clientSelectInput').val();

        $('#exampleModalCenter100').modal('hide');

        $.ajax({
            url: baseUrl + '/api/salescrm/project',
            type: 'POST',
            contentType: 'application/json',
            xhrFields: { withCredentials: true },
            data: JSON.stringify({
                projectName: projectName,
                clientId: clientId,
                status: false,
                createdBy: sessionStorage.getItem('id')
            }),
            success: function (response) {
                console.log('Project Name created successfully', response);
                $('#projectNameInput').val('');
                $('#clientSelectInput').val('');
                showPopup('Project Name created successfully', 'SaleMaster.jsp');
            },
            error: function (xhr, status, error) {
                console.error('Error creating Project Name:', xhr.responseText);
                alert(xhr.responseText || 'Error creating Project Name');
            }
        });
    });

    // ==============================
    // CLEAR MODAL WHEN CLOSED
    // ==============================

    $('#exampleModalScrollableProject').on('hidden.bs.modal', function () {
        $('#projectNameInputError').hide();
        $('#clientSelectInputError').hide();
    });

});

async function fetchprojects() {

    const apiUrl = new URL('/api/salescrm/project', baseUrl1);

    try {
        const response = await fetch(apiUrl, {
            method: "GET",
            credentials: "include"
        });

        if (!response.ok) {
            throw new Error("Failed to fetch Project Names");
        }

        const projects = await response.json();

        let tableRows = '';

        for (let index = 0; index < projects.length; index++) {

            const item = projects[index];

            tableRows += `
                <tr id="${item.id}">
                    <td>${index + 1}</td>
                    <td>${item.clientName}</td>
                    <td>${item.projectName}</td>
                    <td>
                        <i class="fa fa-pen text-primary cursor-pointer"
                           title="Edit"
                           style="cursor:pointer;"
                           onclick="editProject(${item.id})">
                        </i>
                    </td>
                </tr>
            `;
        }

        document.querySelector("#tableID7 tbody").innerHTML = tableRows;

        if ($.fn.DataTable.isDataTable('#tableID7')) {
            $('#tableID7').DataTable().destroy();
        }

        $('#tableID7').DataTable({
            dom: 'Bfrtip',
            scrollX: false,
            info: true,
            paging: true,
            pageLength: 10,
            lengthMenu: [[10, 25, 50, 100], [10, 25, 50, 100]],
            buttons: [{
                extend: 'excel',
                text: 'Export to Excel',
                title: 'Project Name List'
            }]
        });

    } catch (error) {
        console.error('Error fetching Project Names:', error);
    }
}

let selectedProjectId = null;
let originalProjectName = '';
let originalClientId = '';

async function editProject(id) {

    try {
        const apiUrl = new URL(`/api/salescrm/project/${id}`, baseUrl1);

        const response = await fetch(apiUrl, {
            method: "GET",
            credentials: "include"
        });

        if (!response.ok) {
            throw new Error("Failed to fetch Project Name");
        }

        const data = await response.json();

        selectedProjectId = data.id;
        originalProjectName = data.projectName.trim();
        originalClientId = data.clientId != null ? String(data.clientId) : '';

        $('#projectNameInput1').val(data.projectName);
        $('#clientSelectInput1').val(originalClientId);
        $('#projectNameInput1Error').hide();
        $('#clientSelectInput1Error').hide();

        $('#exampleModalScrollableProjectUp').modal('show');

    } catch (error) {
        console.error("Error fetching Project Name:", error);
        alert("Unable to fetch Project Name");
    }
}

$('#projectupd').on('click', function () {

    const projectName = $('#projectNameInput1').val().trim();
    const clientId = $('#clientSelectInput1').val();

    $('#projectNameInput1Error').hide();
    $('#clientSelectInput1Error').hide();

    let hasError = false;

    if (clientId === '') {
        $('#clientSelectInput1Error').text('Client is required').show();
        hasError = true;
    }

    if (projectName === '') {
        $('#projectNameInput1Error').text('Project Name is required').show();
        hasError = true;
    }

    if (hasError) return;

    if (projectName === originalProjectName && clientId === originalClientId) {
        showPopup('No Fields are changes', 'SaleMaster.jsp');
        return;
    }

    $('#exampleModalScrollableProjectUp').modal('hide');
    $('#exampleModalCenter101').modal('show');
});

$('#cancellprojectmodal').on('click', function () {
    $('#exampleModalCenter101').modal('hide');
    $('#exampleModalScrollableProjectUp').modal('show');
});

$('#confirmprojectupd').on('click', function () {

    const projectName = $('#projectNameInput1').val().trim();
    const clientId = $('#clientSelectInput1').val();

    $('#exampleModalCenter101').modal('hide');

    $.ajax({
        url: baseUrl1 + '/api/salescrm/project/' + selectedProjectId,
        type: 'PUT',
        contentType: 'application/json',
        xhrFields: { withCredentials: true },
        data: JSON.stringify({
            projectName: projectName,
            clientId: clientId,
            modifiedBy: sessionStorage.getItem('id')
        }),
        success: function (response) {
            console.log('Project Name updated successfully', response);
            $('#exampleModalScrollableProjectUp').modal('hide');
            $('#projectNameInput1').val('');
            fetchprojects();
            showPopup('Project Name updated successfully', 'SaleMaster.jsp');
        },
        error: function (xhr, status, error) {
            console.error('Error updating Project Name:', xhr.responseText);
            alert(xhr.responseText || 'Error updating Project Name');
        }
    });
});
*/


// Load client list into both dropdowns
/*function loadClients() {
    $.ajax({
        url: baseUrl + '/api/salescrm/client',
        type: 'GET',
        xhrFields: { withCredentials: true },
        success: function (clients) {
            let options = '<option value="">-- Select Client --</option>';
            clients.forEach(function (c) {
                options += `<option value="${c.id}">${c.clientName}</option>`;
            });
            $('#clientSelectInput').html(options);
            $('#clientSelectInput1').html(options);
        },
        error: function (xhr) {
            console.error('Error loading clients:', xhr.responseText);
        }
    });
}

// Load zone list into both dropdowns (Create and Update)
function loadZones1() {
    $.ajax({
        url: baseUrl + '/api/salescrm/zone',
        type: 'GET',
        xhrFields: { withCredentials: true },
        success: function (zones) {
            let options = '<option value="">-- Select Zone --</option>';
            zones.forEach(function (z) {
                options += `<option value="${z.id}">${z.zoneName}</option>`;
            });
            $('#ZoneSelectInput').html(options);
            $('#ZoneSelectInput1').html(options);
        },
        error: function (xhr) {
            console.error('Error loading zones:', xhr.responseText);
        }
    });
}

$(document).ready(function () {

    loadClients();
    loadZones1();

    // ==============================
    // CREATE PROJECT NAME
    // ==============================

    $('#submitproject').on('click', function () {

        const projectName = $('#projectNameInput').val().trim();
        const clientId = $('#clientSelectInput').val();
        const zoneId = $('#ZoneSelectInput').val();

        $('#projectNameInputError').hide();
        $('#clientSelectInputError').hide();
        $('#ZoneSelectInputError').hide();

        let hasError = false;

        if (clientId === '') {
            $('#clientSelectInputError').text('Client is required').show();
            hasError = true;
        }

        if (zoneId === '') {
            $('#ZoneSelectInputError').text('Zone is required').show();
            hasError = true;
        }

        if (projectName === '') {
            $('#projectNameInputError').text('Project Name is required').show();
            hasError = true;
        }

        if (hasError) return;

        $('#exampleModalScrollableProject').modal('hide');
        $('#exampleModalCenter100').modal('show');
    });

    // ==============================
    // CONFIRM CREATE
    // ==============================

    $('#confirmprojectYes').on('click', function () {

        const projectName = $('#projectNameInput').val().trim();
        const clientId = $('#clientSelectInput').val();
        const zoneId = $('#ZoneSelectInput').val();

        $('#exampleModalCenter100').modal('hide');

        $.ajax({
            url: baseUrl + '/api/salescrm/project',
            type: 'POST',
            contentType: 'application/json',
            xhrFields: { withCredentials: true },
            data: JSON.stringify({
                projectName: projectName,
                clientId: clientId,
                zoneId: zoneId,
                status: false,
                createdBy: sessionStorage.getItem('id')
            }),
            success: function (response) {
                console.log('Project Name created successfully', response);
                $('#projectNameInput').val('');
                $('#clientSelectInput').val('');
                $('#ZoneSelectInput').val('');
                showPopup('Project Name created successfully (' + (response.projectCode || '') + ')', 'SaleMaster.jsp');
            },
            error: function (xhr, status, error) {
                console.error('Error creating Project Name:', xhr.responseText);
                alert(xhr.responseText || 'Error creating Project Name');
            }
        });
    });

    // ==============================
    // CLEAR MODAL WHEN CLOSED
    // ==============================

    $('#exampleModalScrollableProject').on('hidden.bs.modal', function () {
        $('#projectNameInputError').hide();
        $('#clientSelectInputError').hide();
        $('#ZoneSelectInputError').hide();
    });

});

async function fetchprojects() {

    const apiUrl = new URL('/api/salescrm/project', baseUrl1);

    try {
        const response = await fetch(apiUrl, {
            method: "GET",
            credentials: "include"
        });

        if (!response.ok) {
            throw new Error("Failed to fetch Project Names");
        }

        const projects = await response.json();

        let tableRows = '';

        for (let index = 0; index < projects.length; index++) {

            const item = projects[index];

            tableRows += `
                <tr id="${item.id}">
                    <td>${index + 1}</td>
                    <td>${item.projectCode || '-'}</td>
                    <td>${item.clientName}</td>
                    <td>${item.zoneName || '-'}</td>
                    <td>${item.projectName}</td>
                
					
					<td>
					    ${item.isUsed
					        ? `<i class="fa fa-pen text-muted"
					              title="Already used in leads, cannot be edited"
					              style="cursor:not-allowed; opacity:0.4;"></i>`
					        : `<i class="fa fa-pen text-primary cursor-pointer"
					              title="Edit"
					              style="cursor:pointer;"
					              onclick="editProject(${item.id})"></i>`}
					</td>
                </tr>
            `;
        }

        document.querySelector("#tableID7 tbody").innerHTML = tableRows;

        if ($.fn.DataTable.isDataTable('#tableID7')) {
            $('#tableID7').DataTable().destroy();
        }

        $('#tableID7').DataTable({
            dom: 'Bfrtip',
            scrollX: false,
            info: true,
            paging: true,
            pageLength: 10,
            lengthMenu: [[10, 25, 50, 100], [10, 25, 50, 100]],
            buttons: [{
                extend: 'excel',
                text: 'Export to Excel',
                title: 'Project Name List'
            }]
        });

    } catch (error) {
        console.error('Error fetching Project Names:', error);
    }
}

let selectedProjectId = null;
let originalProjectName = '';
let originalClientId = '';
let originalZoneId = '';

async function editProject(id) {
	
	
	
	const allowed = allowedActions || [];

	 if (!allowed.includes("Edit")) {
	     alert("You do not have permission to edit.");
	     return;
	 }
	
	

    try {
        const apiUrl = new URL(`/api/salescrm/project/${id}`, baseUrl1);

        const response = await fetch(apiUrl, {
            method: "GET",
            credentials: "include"
        });

        if (!response.ok) {
            throw new Error("Failed to fetch Project Name");
        }

        const data = await response.json();

        selectedProjectId = data.id;
        originalProjectName = data.projectName.trim();
        originalClientId = data.clientId != null ? String(data.clientId) : '';
        originalZoneId = data.projectZone != null ? String(data.projectZone) : '';

        $('#projectNameInput1').val(data.projectName);
        $('#clientSelectInput1').val(originalClientId);
        $('#ZoneSelectInput1').val(originalZoneId);
        $('#projectNameInput1Error').hide();
        $('#clientSelectInput1Error').hide();
        $('#ZoneSelectInput1Error').hide();

        $('#exampleModalScrollableProjectUp').modal('show');

    } catch (error) {
        console.error("Error fetching Project Name:", error);
        alert("Unable to fetch Project Name");
    }
}

$('#projectupd').on('click', function () {

    const projectName = $('#projectNameInput1').val().trim();
    const clientId = $('#clientSelectInput1').val();
    const zoneId = $('#ZoneSelectInput1').val();

    $('#projectNameInput1Error').hide();
    $('#clientSelectInput1Error').hide();
    $('#ZoneSelectInput1Error').hide();

    let hasError = false;

    if (clientId === '') {
        $('#clientSelectInput1Error').text('Client is required').show();
        hasError = true;
    }

    if (zoneId === '') {
        $('#ZoneSelectInput1Error').text('Zone is required').show();
        hasError = true;
    }

    if (projectName === '') {
        $('#projectNameInput1Error').text('Project Name is required').show();
        hasError = true;
    }

    if (hasError) return;

    if (projectName === originalProjectName && clientId === originalClientId && zoneId === originalZoneId) {
        showPopup('No Fields are changes', 'SaleMaster.jsp');
        return;
    }

    $('#exampleModalScrollableProjectUp').modal('hide');
    $('#exampleModalCenter101').modal('show');
});

$('#cancellprojectmodal').on('click', function () {
    $('#exampleModalCenter101').modal('hide');
    $('#exampleModalScrollableProjectUp').modal('show');
});

$('#confirmprojectupd').on('click', function () {

    const projectName = $('#projectNameInput1').val().trim();
    const clientId = $('#clientSelectInput1').val();
    const zoneId = $('#ZoneSelectInput1').val();

    $('#exampleModalCenter101').modal('hide');

    $.ajax({
        url: baseUrl1 + '/api/salescrm/project/' + selectedProjectId,
        type: 'PUT',
        contentType: 'application/json',
        xhrFields: { withCredentials: true },
        data: JSON.stringify({
            projectName: projectName,
            clientId: clientId,
            zoneId: zoneId,
            modifiedBy: sessionStorage.getItem('id')
        }),
        success: function (response) {
            console.log('Project Name updated successfully', response);
            $('#exampleModalScrollableProjectUp').modal('hide');
            $('#projectNameInput1').val('');
            fetchprojects();
            showPopup('Project Name updated successfully', 'SaleMaster.jsp');
        },
        error: function (xhr, status, error) {
            console.error('Error updating Project Name:', xhr.responseText);
            alert(xhr.responseText || 'Error updating Project Name');
        }
    });
});*/


// Load client list into both dropdowns
function loadClients() {
    $.ajax({
        url: baseUrl + '/api/salescrm/client',
        type: 'GET',
        xhrFields: { withCredentials: true },
        success: function (clients) {
            let options = '<option value="">-- Select Client --</option>';
            clients.forEach(function (c) {
                options += `<option value="${c.id}">${c.clientName}</option>`;
            });
            $('#clientSelectInput').html(options);
            $('#clientSelectInput1').html(options);
        },
        error: function (xhr) {
            console.error('Error loading clients:', xhr.responseText);
        }
    });
}

// Load zone list into both dropdowns (Create and Update)
function loadZones1() {
    $.ajax({
        url: baseUrl + '/api/salescrm/zone',
        type: 'GET',
        xhrFields: { withCredentials: true },
        success: function (zones) {
            let options = '<option value="">-- Select Zone --</option>';
            zones.forEach(function (z) {
                options += `<option value="${z.id}">${z.zoneName}</option>`;
            });
            $('#ZoneSelectInput').html(options);
            $('#ZoneSelectInput1').html(options);
        },
        error: function (xhr) {
            console.error('Error loading zones:', xhr.responseText);
        }
    });
}

$(document).ready(function () {

    loadClients();
    loadZones1();

    // ==============================
    // CREATE PROJECT NAME
    // ==============================

    $('#submitproject').on('click', function () {

        const projectName = $('#projectNameInput').val().trim();
        const clientId = $('#clientSelectInput').val();
        const zoneId = $('#ZoneSelectInput').val();
        const projectLocation = $('#projectLocationInput').val().trim();

        $('#projectNameInputError').hide();
        $('#clientSelectInputError').hide();
        $('#ZoneSelectInputError').hide();
        $('#projectLocationInputError').hide();

        let hasError = false;

        if (clientId === '') {
            $('#clientSelectInputError').text('Client is required').show();
            hasError = true;
        }

        if (zoneId === '') {
            $('#ZoneSelectInputError').text('Zone is required').show();
            hasError = true;
        }

        if (projectName === '') {
            $('#projectNameInputError').text('Project Name is required').show();
            hasError = true;
        }

        if (projectLocation === '') {
            $('#projectLocationInputError').text('Project Location is required').show();
            hasError = true;
        }

        if (hasError) return;

        $('#exampleModalScrollableProject').modal('hide');
        $('#exampleModalCenter100').modal('show');
    });

    // ==============================
    // CONFIRM CREATE
    // ==============================

    $('#confirmprojectYes').on('click', function () {

        const projectName = $('#projectNameInput').val().trim();
        const clientId = $('#clientSelectInput').val();
        const zoneId = $('#ZoneSelectInput').val();
        const projectLocation = $('#projectLocationInput').val().trim();

        $('#exampleModalCenter100').modal('hide');

        $.ajax({
            url: baseUrl + '/api/salescrm/project',
            type: 'POST',
            contentType: 'application/json',
            xhrFields: { withCredentials: true },
            data: JSON.stringify({
                projectName: projectName,
                clientId: clientId,
                zoneId: zoneId,
                projectLocation: projectLocation,
                status: false,
                createdBy: sessionStorage.getItem('id')
            }),
            success: function (response) {
                console.log('Project Name created successfully', response);
                $('#projectNameInput').val('');
                $('#clientSelectInput').val('');
                $('#ZoneSelectInput').val('');
                $('#projectLocationInput').val('');
                showPopup('Project Name created successfully (' + (response.projectCode || '') + ')', 'SaleMaster.jsp');
            },
            error: function (xhr, status, error) {
                console.error('Error creating Project Name:', xhr.responseText);
                alert(xhr.responseText || 'Error creating Project Name');
            }
        });
    });

    // ==============================
    // CLEAR MODAL WHEN CLOSED
    // ==============================

    $('#exampleModalScrollableProject').on('hidden.bs.modal', function () {
        $('#projectNameInputError').hide();
        $('#clientSelectInputError').hide();
        $('#ZoneSelectInputError').hide();
        $('#projectLocationInputError').hide();
    });

});

async function fetchprojects() {

    const apiUrl = new URL('/api/salescrm/project', baseUrl1);

    try {
        const response = await fetch(apiUrl, {
            method: "GET",
            credentials: "include"
        });

        if (!response.ok) {
            throw new Error("Failed to fetch Project Names");
        }

        const projects = await response.json();

        let tableRows = '';

        for (let index = 0; index < projects.length; index++) {

            const item = projects[index];

            tableRows += `
                <tr id="${item.id}">
                    <td>${index + 1}</td>
                    <td>${item.projectCode || '-'}</td>
                    <td>${item.clientName}</td>
                    <td>${item.zoneName || '-'}</td>
                    <td>${item.projectLocation || '-'}</td>
                    <td>${item.projectName}</td>
                    <td>
                        ${item.isUsed
                            ? `<i class="fa fa-pen text-muted"
                                  title="Already used in leads, cannot be edited"
                                  style="cursor:not-allowed; opacity:0.4;"></i>`
                            : `<i class="fa fa-pen text-primary cursor-pointer"
                                  title="Edit"
                                  style="cursor:pointer;"
                                  onclick="editProject(${item.id})"></i>`}
                    </td>
                </tr>
            `;
        }

        document.querySelector("#tableID7 tbody").innerHTML = tableRows;

        if ($.fn.DataTable.isDataTable('#tableID7')) {
            $('#tableID7').DataTable().destroy();
        }

        $('#tableID7').DataTable({
            dom: 'Bfrtip',
            scrollX: false,
            info: true,
            paging: true,
            pageLength: 10,
            lengthMenu: [[10, 25, 50, 100], [10, 25, 50, 100]],
            buttons: [{
                extend: 'excel',
                text: 'Export to Excel',
                title: 'Project Name List'
            }]
        });

    } catch (error) {
        console.error('Error fetching Project Names:', error);
    }
}

let selectedProjectId = null;
let originalProjectName = '';
let originalClientId = '';
let originalZoneId = '';
let originalLocation = '';

async function editProject(id) {

    try {
        const apiUrl = new URL(`/api/salescrm/project/${id}`, baseUrl1);

        const response = await fetch(apiUrl, {
            method: "GET",
            credentials: "include"
        });

        if (!response.ok) {
            throw new Error("Failed to fetch Project Name");
        }

        const data = await response.json();

        selectedProjectId = data.id;
        originalProjectName = data.projectName.trim();
        originalClientId = data.clientId != null ? String(data.clientId) : '';
        originalZoneId = data.projectZone != null ? String(data.projectZone) : '';
        originalLocation = (data.projectLocation || '').trim();

        $('#projectNameInput1').val(data.projectName);
        $('#clientSelectInput1').val(originalClientId);
        $('#ZoneSelectInput1').val(originalZoneId);
        $('#projectLocationInput1').val(originalLocation);
        $('#projectLocationInput1Error').hide();
        $('#projectNameInput1Error').hide();
        $('#clientSelectInput1Error').hide();
        $('#ZoneSelectInput1Error').hide();

        $('#exampleModalScrollableProjectUp').modal('show');

    } catch (error) {
        console.error("Error fetching Project Name:", error);
        alert("Unable to fetch Project Name");
    }
}

$('#projectupd').on('click', function () {

    const projectName = $('#projectNameInput1').val().trim();
    const clientId = $('#clientSelectInput1').val();
    const zoneId = $('#ZoneSelectInput1').val();
    const projectLocation = $('#projectLocationInput1').val().trim();

    $('#projectLocationInput1Error').hide();
    $('#projectNameInput1Error').hide();
    $('#clientSelectInput1Error').hide();
    $('#ZoneSelectInput1Error').hide();

    let hasError = false;

    if (clientId === '') {
        $('#clientSelectInput1Error').text('Client is required').show();
        hasError = true;
    }

    if (zoneId === '') {
        $('#ZoneSelectInput1Error').text('Zone is required').show();
        hasError = true;
    }

    if (projectName === '') {
        $('#projectNameInput1Error').text('Project Name is required').show();
        hasError = true;
    }

    if (projectLocation === '') {
        $('#projectLocationInput1Error').text('Project Location is required').show();
        hasError = true;
    }

    if (hasError) return;

    if (projectName === originalProjectName && clientId === originalClientId
        && zoneId === originalZoneId && projectLocation === originalLocation) {
        showPopup('No Fields are changes', 'SaleMaster.jsp');
        return;
    }

    $('#exampleModalScrollableProjectUp').modal('hide');
    $('#exampleModalCenter101').modal('show');
});

$('#cancellprojectmodal').on('click', function () {
    $('#exampleModalCenter101').modal('hide');
    $('#exampleModalScrollableProjectUp').modal('show');
});

$('#confirmprojectupd').on('click', function () {

    const projectName = $('#projectNameInput1').val().trim();
    const clientId = $('#clientSelectInput1').val();
    const zoneId = $('#ZoneSelectInput1').val();
    const projectLocation = $('#projectLocationInput1').val().trim();

    $('#exampleModalCenter101').modal('hide');

    $.ajax({
        url: baseUrl1 + '/api/salescrm/project/' + selectedProjectId,
        type: 'PUT',
        contentType: 'application/json',
        xhrFields: { withCredentials: true },
        data: JSON.stringify({
            projectName: projectName,
            clientId: clientId,
            zoneId: zoneId,
            projectLocation: projectLocation,
            modifiedBy: sessionStorage.getItem('id')
        }),
        success: function (response) {
            console.log('Project Name updated successfully', response);
            $('#exampleModalScrollableProjectUp').modal('hide');
            $('#projectNameInput1').val('');
            fetchprojects();
            showPopup('Project Name updated successfully', 'SaleMaster.jsp');
        },
        error: function (xhr, status, error) {
            console.error('Error updating Project Name:', xhr.responseText);
            alert(xhr.responseText || 'Error updating Project Name');
        }
    });
});

document.getElementById("subZoneBtn").addEventListener("click", function () {
	  const allowed =allowedActions || [];

	if (!allowed.includes("Insert")) {
	  alert(" You do not have permission to Insert.");
	  $('#exampleModalScrollableIN').modal('hide');
	  return;
	}
	
	
    $('#subZoneForm')[0].reset();
    loadZoneDropdownForSubZone('#subZoneParent');
    $('#exampleModalScrollableSubZone').modal('show');
});

// ==============================
// LOAD ZONES INTO A DROPDOWN (reuses /api/salescrm/zone)
// ==============================
async function loadZoneDropdownForSubZone(selector) {

    try {
        const apiUrl = new URL('/api/salescrm/zone', baseUrl1);

        const response = await fetch(apiUrl, {
            method: "GET",
            credentials: "include"
        });

        if (!response.ok) {
            throw new Error("Failed to fetch Zones");
        }

        const zones = await response.json();

        let options = '<option value="">Select Zone</option>';

        zones.forEach(zone => {
            options += `<option value="${zone.id}">${zone.zoneName}</option>`;
        });

        $(selector).html(options);

    } catch (error) {
        console.error('Error fetching Zones for dropdown:', error);
    }
}

$(document).ready(function () {

    // ==============================
    // CREATE SUB ZONE
    // ==============================

    $('#submitsubzone').on('click', function () {

        const zoneId = $('#subZoneParent').val();
        const subZoneName = $('#subZoneName').val().trim();

        let isValid = true;

        $('#exampleModalScrollableSubZone .error-message').hide();

        if (!zoneId) {
            $('#subZoneParentError').text('Zone is required').show();
            isValid = false;
        }

        if (subZoneName === '') {
            $('#subZoneNameError').text('Sub Zone Name is required').show();
            isValid = false;
        }

        if (!isValid) {
            return;
        }

        $('#exampleModalScrollableSubZone').modal('hide');
        $('#exampleModalCenter102').modal('show');
    });

    // ==============================
    // CONFIRM CREATE
    // ==============================

    $('#confirmsubzoneYes').on('click', function () {

        const payload = {
            zoneId: $('#subZoneParent').val(),
            subZoneName: $('#subZoneName').val().trim(),
            status: false,
            createdBy: sessionStorage.getItem('id')
        };

        $('#exampleModalCenter102').modal('hide');

        $.ajax({
            url: baseUrl + '/api/salescrm/subzone',
            type: 'POST',
            contentType: 'application/json',
			xhrFields: { withCredentials: true },
            data: JSON.stringify(payload),
            success: function (response) {
                console.log('Sub Zone created successfully', response);
                $('#subZoneForm')[0].reset();
                showPopup('Sub Zone created successfully', 'SaleMaster.jsp');
            },
            error: function (xhr, status, error) {
                console.error('Error creating Sub Zone:', xhr.responseText);
                alert(xhr.responseText || 'Error creating Sub Zone');
            }
        });
    });

    $('#exampleModalScrollableSubZone').on('hidden.bs.modal', function () {
        $('.error-message').hide();
    });

});

async function fetchsubzones() {

    const apiUrl = new URL('/api/salescrm/subzone', baseUrl1);

    try {
        const response = await fetch(apiUrl, {
            method: "GET",
            credentials: "include"
        });

        if (!response.ok) {
            throw new Error("Failed to fetch Sub Zones");
        }

        const subZones = await response.json();

        let tableRows = '';

        for (let index = 0; index < subZones.length; index++) {

            const item = subZones[index];

            tableRows += `
                <tr id="${item.id}">
                    <td>${index + 1}</td>
                    <td>${item.zoneName || ''}</td>
                    <td>${item.subZoneName}</td>
                    <td>
                        <i class="fa fa-pen text-primary cursor-pointer"
                           title="Edit"
                           style="cursor:pointer;"
                           onclick="editSubZone(${item.id})">
                        </i>
                    </td>
                </tr>
            `;
        }

        document.querySelector("#tableID8 tbody").innerHTML = tableRows;

        if ($.fn.DataTable.isDataTable('#tableID8')) {
            $('#tableID8').DataTable().destroy();
        }

        $('#tableID8').DataTable({
            dom: 'Bfrtip',
            scrollX: false,
            info: true,
            paging: true,
            pageLength: 10,
            lengthMenu: [[10, 25, 50, 100], [10, 25, 50, 100]],
            buttons: [{
                extend: 'excel',
                text: 'Export to Excel',
                title: 'Sub Zone List'
            }]
        });

    } catch (error) {
        console.error('Error fetching Sub Zones:', error);
    }
}

let selectedSubZoneId = null;
let originalSubZoneData = {};

async function editSubZone(id) {
	
	
	
	const allowed = allowedActions || [];

	 if (!allowed.includes("Edit")) {
	     alert("You do not have permission to edit.");
	     return;
	 }

    try {
        const apiUrl = new URL(`/api/salescrm/subzone/${id}`, baseUrl1);

        const response = await fetch(apiUrl, {
            method: "GET",
            credentials: "include"
        });

        if (!response.ok) {
            throw new Error("Failed to fetch Sub Zone");
        }

        const data = await response.json();

        selectedSubZoneId = data.id;

        originalSubZoneData = {
            zoneId: data.zoneId,
            subZoneName: data.subZoneName.trim()
        };

        await loadZoneDropdownForSubZone('#subZoneParent1');
        $('#subZoneParent1').val(data.zoneId);

        $('#subZoneName1').val(data.subZoneName);
        $('#exampleModalScrollableSubZoneUp .error-message').hide();

        $('#exampleModalScrollableSubZoneUp').modal('show');

    } catch (error) {
        console.error("Error fetching Sub Zone:", error);
        alert("Unable to fetch Sub Zone");
    }
}

$('#subzoneupd').on('click', function () {

    const zoneId = $('#subZoneParent1').val();
    const subZoneName = $('#subZoneName1').val().trim();

    let isValid = true;

    $('#exampleModalScrollableSubZoneUp .error-message').hide();

    if (!zoneId) {
        $('#subZoneParent1Error').text('Zone is required').show();
        isValid = false;
    }

    if (subZoneName === '') {
        $('#subZoneName1Error').text('Sub Zone Name is required').show();
        isValid = false;
    }

    if (!isValid) {
        return;
    }

    const noChange =
        String(zoneId) === String(originalSubZoneData.zoneId) &&
        subZoneName === originalSubZoneData.subZoneName;

    if (noChange) {
        showPopup('No Fields are changes', 'SaleMaster.jsp');
        return;
    }

    $('#exampleModalScrollableSubZoneUp').modal('hide');
    $('#exampleModalCenter103').modal('show');
});

$('#cancellsubzonemodal').on('click', function () {
    $('#exampleModalCenter103').modal('hide');
    $('#exampleModalScrollableSubZoneUp').modal('show');
});

$('#confirmsubzoneupd').on('click', function () {

    const payload = {
        zoneId: $('#subZoneParent1').val(),
        subZoneName: $('#subZoneName1').val().trim(),
        modifiedBy: sessionStorage.getItem('id')
    };

    $('#exampleModalCenter103').modal('hide');

    $.ajax({
        url: baseUrl1 + '/api/salescrm/subzone/' + selectedSubZoneId,
        type: 'PUT',
        contentType: 'application/json',
		xhrFields: { withCredentials: true },
        data: JSON.stringify(payload),
        success: function (response) {
            console.log('Sub Zone updated successfully', response);
            $('#exampleModalScrollableSubZoneUp').modal('hide');
            fetchsubzones();
            showPopup('Sub Zone updated successfully', 'SaleMaster.jsp');
        },
        error: function (xhr, status, error) {
            console.error('Error updating Sub Zone:', xhr.responseText);
            alert(xhr.responseText || 'Error updating Sub Zone');
        }
    });
});

async function loadclientsegment(selector) {

    try {
        const apiUrl = new URL('/api/salescrm/segment', baseUrl1);

        const response = await fetch(apiUrl, {
            method: "GET",
            credentials: "include"
        });

        if (!response.ok) {
            throw new Error("Failed to fetch Segments");
        }

        const result = await response.json();

        let options = '<option value="">Select Segment</option>';

        result.forEach(segment => {
            options += `<option value="${segment.id}">${segment.segmentName}</option>`;
        });

        $(selector).html(options);

    } catch (error) {
        console.error("Error fetching Segments:", error);
    }
}

async function loadZones(selector) {

    try {
        const apiUrl = new URL('/api/salescrm/zone', baseUrl1);

        const response = await fetch(apiUrl, {
            method: "GET",
            credentials: "include"
        });

        if (!response.ok) {
            throw new Error("Failed to fetch Zones");
        }

        const result = await response.json();

        let options = '<option value="">Select Zone</option>';

        result.forEach(zone => {
            options += `<option value="${zone.id}">${zone.zoneName}</option>`;
        });

        $(selector).html(options);

    } catch (error) {
        console.error("Error fetching Zones:", error);
    }
}



// ==============================
// OPEN CREATE MODAL
// ==============================
document.getElementById("UserMappingBtn").addEventListener("click", async function () {
	
	
	
	  const allowed =allowedActions || [];

	if (!allowed.includes("Insert")) {
	  alert(" You do not have permission to Insert.");
	  $('#exampleModalScrollableIN').modal('hide');
	  return;
	}

    $("#usermapUserSelect").val("");
	$("#followupAccess").val("");
    $(".error-message, .text-danger").addClass("d-none").hide();

    await loadUsersDropdown("#usermapUserSelect");
    await fetchZonesForUserMapping();

    $("#usermapZoneDropdownMenu .usermap-zone-checkbox").prop("checked", false);
    updateSelectedZones();

    $("#userMappingModal").modal("show");
});

// ==============================
// LOAD USERS INTO A DROPDOWN (userId = value, username = label)
// ==============================
async function loadUsersDropdown(selector) {
    try {
        const apiUrl = new URL("/api/salescrm/user", baseUrl1);
        const response = await fetch(apiUrl, { method: "GET", credentials: "include" });

        if (!response.ok) throw new Error("Failed to fetch Users");

        const users = await response.json();

        let options = '<option value="">Select User</option>';
        users.forEach(u => {
            options += `<option value="${u.userId}">${u.username}</option>`;
        });

        $(selector).html(options);

    } catch (error) {
        console.error("Error fetching Users:", error);
    }
}

// ==============================
// FETCH ZONES AND BUILD CHECKBOX LIST (CREATE)
// ==============================
async function fetchZonesForUserMapping() {
    try {
        const url = new URL("/api/salescrm/zone", baseUrl1);
        const res = await fetch(url, { credentials: "include" });
        const data = await res.json();

        const menu = document.getElementById("usermapZoneDropdownMenu");
        menu.innerHTML = "";

        // ---- custom "All Zone" option (display only, value stored as "all") ----
        const allDiv = document.createElement("div");
        allDiv.innerHTML = `
            <label style="display:block;padding:5px;cursor:pointer;margin:0;">
                <input type="checkbox" class="usermap-zone-checkbox" value="all">
                All Zone's
            </label>`;
        menu.appendChild(allDiv);
        // ---------------------------------------------------------------------

        data.forEach(item => {
            const div = document.createElement("div");
            div.innerHTML = `
                <label style="display:block;padding:5px;cursor:pointer;margin:0;">
                    <input type="checkbox" class="usermap-zone-checkbox" value="${item.id}">
                    ${item.zoneName}
                </label>`;
            menu.appendChild(div);
        });

        menu.removeEventListener("change", updateSelectedZones);
        menu.addEventListener("change", updateSelectedZones);

    } catch (e) {
        console.error("Error fetching Zones:", e);
    }
}

// ==============================
// FETCH ZONES AND BUILD CHECKBOX LIST (UPDATE)
// ==============================
async function fetchZonesForUserMappingUp() {
    try {
        const url = new URL("/api/salescrm/zone", baseUrl1);
        const res = await fetch(url, { credentials: "include" });
        const data = await res.json();

        const menu = document.getElementById("usermapZoneDropdownMenuUp");
        menu.innerHTML = "";

        // ---- custom "All Zone" option ----
        const allDiv = document.createElement("div");
        allDiv.innerHTML = `
            <label style="display:block;padding:5px;cursor:pointer;margin:0;">
                <input type="checkbox" class="usermap-zone-up-checkbox" value="all">
                All Zone
            </label>`;
        menu.appendChild(allDiv);
        // -----------------------------------

        data.forEach(item => {
            const div = document.createElement("div");
            div.innerHTML = `
                <label style="display:block;padding:5px;cursor:pointer;margin:0;">
                    <input type="checkbox" class="usermap-zone-up-checkbox" value="${item.id}">
                    ${item.zoneName}
                </label>`;
            menu.appendChild(div);
        });

        menu.removeEventListener("change", updateSelectedZonesUp);
        menu.addEventListener("change", updateSelectedZonesUp);

    } catch (e) {
        console.error("Error fetching Zones:", e);
    }
}

// ==============================
// LABEL HELPERS
// ==============================
/*function updateSelectedZones() {
    const checked = document.querySelectorAll("#usermapZoneDropdownMenu .usermap-zone-checkbox:checked");
    document.getElementById("usermapZoneDropdown").innerHTML =
        (checked.length ? `${checked.length} selected` : "Select Zone's") +
        ` <span style="float:right;">&#9662;</span>`;
}*/



function updateSelectedZones(e) {
    const allCb = document.querySelector('#usermapZoneDropdownMenu .usermap-zone-checkbox[value="all"]');
    const otherCbs = document.querySelectorAll('#usermapZoneDropdownMenu .usermap-zone-checkbox:not([value="all"])');

    // If the checkbox that just changed is "All Zone" and it's now checked -> uncheck everything else
    if (e && e.target === allCb && allCb.checked) {
        otherCbs.forEach(cb => cb.checked = false);
    }

    // If the checkbox that just changed is an individual zone and it's now checked -> uncheck "All Zone"
    if (e && e.target !== allCb && e.target.checked) {
        if (allCb) allCb.checked = false;
    }

    const checked = document.querySelectorAll("#usermapZoneDropdownMenu .usermap-zone-checkbox:checked");
    document.getElementById("usermapZoneDropdown").innerHTML =
        (checked.length ? `${checked.length} selected` : "Select Zone's") +
        ` <span style="float:right;">&#9662;</span>`;
}

/*function updateSelectedZonesUp() {
    const checked = document.querySelectorAll("#usermapZoneDropdownMenuUp .usermap-zone-up-checkbox:checked");
    document.getElementById("usermapZoneDropdownUp").innerHTML =
        (checked.length ? `${checked.length} selected` : "Select Zone's") +
        ` <span style="float:right;">&#9662;</span>`;
}*/


function updateSelectedZonesUp(e) {
    const allCb = document.querySelector('#usermapZoneDropdownMenuUp .usermap-zone-up-checkbox[value="all"]');
    const otherCbs = document.querySelectorAll('#usermapZoneDropdownMenuUp .usermap-zone-up-checkbox:not([value="all"])');

    if (e && e.target === allCb && allCb.checked) {
        otherCbs.forEach(cb => cb.checked = false);
    }

    if (e && e.target !== allCb && e.target.checked) {
        if (allCb) allCb.checked = false;
    }

    const checked = document.querySelectorAll("#usermapZoneDropdownMenuUp .usermap-zone-up-checkbox:checked");
    document.getElementById("usermapZoneDropdownUp").innerHTML =
        (checked.length ? `${checked.length} selected` : "Select Zone's") +
        ` <span style="float:right;">&#9662;</span>`;
}



// ==============================
// GETTERS — plain arrays ready for backend
// ==============================
function getSelectedZoneIds() {
    return Array.from(document.querySelectorAll("#usermapZoneDropdownMenu .usermap-zone-checkbox:checked"))
        .map(cb => cb.value);
}

function getSelectedZoneIdsUp() {
    return Array.from(document.querySelectorAll("#usermapZoneDropdownMenuUp .usermap-zone-up-checkbox:checked"))
        .map(cb => cb.value);
}

// ==============================
// PRE-SELECT ZONES ON EDIT
// ==============================
async function loadSelectedZonesUp(userMappingId) {
    const res = await fetch(
        new URL(`/api/salescrm/user-mapping/zones/${userMappingId}`, baseUrl1),
        { credentials: "include" }
    );
    const selected = await res.json(); // expected: [{ zoneId: 1 }, { zoneId: 2 }, ...]

    document.querySelectorAll("#usermapZoneDropdownMenuUp .usermap-zone-up-checkbox")
        .forEach(cb => cb.checked = false);

    selected.forEach(item => {
        const cb = document.querySelector(
            `#usermapZoneDropdownMenuUp .usermap-zone-up-checkbox[value="${item.zoneId}"]`
        );
        if (cb) cb.checked = true;
    });

    updateSelectedZonesUp();
}

// ==============================
// TOGGLE ZONE DROPDOWN (CREATE)
// ==============================
$(document).on('click', '#usermapZoneDropdown', function (e) {
    e.stopPropagation();
    $('#usermapZoneDropdownMenuUp').hide();
    $('#usermapZoneDropdownMenu').toggle();
});

// ==============================
// TOGGLE ZONE DROPDOWN (UPDATE)
// ==============================
$(document).on('click', '#usermapZoneDropdownUp', function (e) {
    e.stopPropagation();
    $('#usermapZoneDropdownMenu').hide();
    $('#usermapZoneDropdownMenuUp').toggle();
});

// ==============================
// PREVENT CLICK INSIDE MENU FROM CLOSING IT
// ==============================
$(document).on('click', '#usermapZoneDropdownMenu, #usermapZoneDropdownMenuUp', function (e) {
    e.stopPropagation();
});

// ==============================
// CLICK OUTSIDE -> CLOSE BOTH
// ==============================
$(document).on('click', function () {
    $('#usermapZoneDropdownMenu').hide();
    $('#usermapZoneDropdownMenuUp').hide();
});

// ==============================
// CREATE USER MAPPING
// ==============================
$("#createUserMapping").click(function () {

    $(".error-message, .text-danger").addClass("d-none").hide();

    const userId = $("#usermapUserSelect").val();
    const selectedZones = getSelectedZoneIds();
	const followupAccess = $("#followupAccess").val();  

    let isValid = true;

	if (!userId) {
	    $("#usermapUserError").removeClass("d-none").show().text("Please select a user.");
	    isValid = false;
	}

	if (selectedZones.length === 0) {
	    $("#usermapZoneError").removeClass("d-none").show().text("Please select at least one Zone.");
	    isValid = false;
	}
	if (!followupAccess) {
	    $("#followupAccessError").removeClass("d-none").show().text("Please select Follow-up Access.");
	    isValid = false;
	}


    if (!isValid) return;


	
	const request = {
	    userId: userId,
	    zoneIds: selectedZones,
	    followupAccess: followupAccess,                  // NEW
	    status: false,
	    createdBy: sessionStorage.getItem("id")
	};

    $.ajax({
        url: baseUrl + "/api/salescrm/user-mapping",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(request),
        xhrFields: { withCredentials: true },

        success: function (response) {
            $("#userMappingModal").modal("hide");
            showPopup("User mapped successfully.", "SaleMaster.jsp");
        },

        error: function (xhr) {
            alert(xhr.responseText || "User mapping failed.");
        }
    });
});

// ==============================
// FETCH USER MAPPING LIST
// ==============================
async function fetchusermapping() {

    const apiUrl = new URL("/api/salescrm/user-mapping", baseUrl1);

    try {
        const response = await fetch(apiUrl, { method: "GET", credentials: "include" });
        if (!response.ok) throw new Error("Failed to fetch User Mappings");

        const mappings = await response.json();
        let tableRows = "";

        mappings.forEach((item, index) => {
            tableRows += `
                <tr id="${item.id}">
                    <td>${index + 1}</td>
                    <td>${item.username || ''}</td>
                    <td>${item.zoneNames || ''}</td>
					<td>${item.followupAccess == 1 ? 'Own Follow-up' : item.followupAccess == 2 ? 'Within Zone Follow-up' : ''}</td>
                    <td>
                        <i class="fa fa-pen text-primary cursor-pointer"
                           title="Edit" style="cursor:pointer;"
                           onclick="editUserMapping(${item.id})"></i>
                    </td>
                </tr>`;
        });

        document.querySelector("#tableID9 tbody").innerHTML = tableRows;

        if ($.fn.DataTable.isDataTable('#tableID9')) {
            $('#tableID9').DataTable().destroy();
        }

        $('#tableID9').DataTable({
            dom: 'Bfrtip',
            paging: true,
            pageLength: 10,
            lengthMenu: [[10, 25, 50, 100], [10, 25, 50, 100]],
            buttons: [{ extend: 'excel', text: 'Export to Excel', title: 'User Mapping List' }]
        });

    } catch (error) {
        console.error('Error fetching User Mappings:', error);
    }
}

// ==============================
// EDIT USER MAPPING
// ==============================
let originalUserMappingData = {};
let originalZoneIdsUp = [];

async function editUserMapping(id) {
	
	
	const allowed = allowedActions || [];

	 if (!allowed.includes("Edit")) {
	     alert("You do not have permission to edit.");
	     return;
	 }

    $.ajax({
        url: baseUrl1 + "/api/salescrm/user-mapping/" + id,
        type: "GET",
        xhrFields: { withCredentials: true },

		success: async function (response) {

		    $("#userMappingIdUp").val(response.userId);

		    $("#usermapUserSelectUp").val(response.username);  // display name, readonly
		    $("#usermapUserIdUp").val(response.userId);         // actual id used on submit
			
			$("#followupAccessUp").val(response.followupAccess != null ? String(response.followupAccess) : "");

		    await fetchZonesForUserMappingUp();

		    // ✅ directly use response.zoneIds instead of a separate fetch call

				document.querySelectorAll("#usermapZoneDropdownMenuUp .usermap-zone-up-checkbox")
				    .forEach(cb => {
				        cb.checked = response.zoneIds.includes(cb.value);
				    });
		    updateSelectedZonesUp();

		    
			
			originalUserMappingData = {
			    userId: (response.userId || "").toString(),
			    followupAccess: response.followupAccess != null ? String(response.followupAccess) : ""   // NEW
			};

		    originalZoneIdsUp = Array.from(
		        document.querySelectorAll("#usermapZoneDropdownMenuUp .usermap-zone-up-checkbox:checked")
		    ).map(cb => cb.value).sort();

		    $(".error-message, .text-danger").addClass("d-none").hide();

		    $("#userMappingUpdateModal").modal("show");
		},

        error: function () {
            alert("Unable to fetch User Mapping");
        }
    });
}
// ==============================
// UPDATE USER MAPPING
// ==============================
$("#updateUserMapping").click(function () {

    $(".error-message, .text-danger").addClass("d-none").hide();

 
	
	const userId = $("#usermapUserIdUp").val(); 
    const selectedZones = getSelectedZoneIdsUp();
    const userMappingId = $("#userMappingIdUp").val();
	
	const followupAccess = $("#followupAccessUp").val();   // next to userId / selectedZones

	


    let isValid = true;

	if (!userId) {
	    $("#usermapUserUpError").removeClass("d-none").show().text("Please select a user.");
	    isValid = false;
	}

	if (selectedZones.length === 0) {
	    $("#usermapZoneUpError").removeClass("d-none").show().text("Please select at least one Zone.");
	    isValid = false;
	}

	
	if (!followupAccess) {
		    $("#followupAccessUpError").removeClass("d-none").show().text("Please select Follow-up Access.");
		    isValid = false;
		}
		
		
    if (!isValid) return;

    const currentZoneIds = selectedZones.map(id => String(id)).sort();

    const zonesUnchanged =
        currentZoneIds.length === originalZoneIdsUp.length &&
        currentZoneIds.every((id, i) => id === originalZoneIdsUp[i]);

		const noChange =
		    userId.toString() === originalUserMappingData.userId &&
		    zonesUnchanged &&
		    followupAccess === originalUserMappingData.followupAccess;  

    if (noChange) {
        showPopup("No fields were changed", "SaleMaster.jsp");
        return;
    }

	const request = {
	    id: userMappingId,
	    userId: userId,
	    zoneIds: selectedZones,
	    followupAccess: followupAccess,                  // NEW
	    modifiedBy: sessionStorage.getItem("id")
	};

    $.ajax({
        url: baseUrl1 + "/api/salescrm/user-mapping/" + userMappingId,
        type: "PUT",
        contentType: "application/json",
        data: JSON.stringify(request),
        xhrFields: { withCredentials: true },

        success: function (response) {
            $("#userMappingUpdateModal").modal("hide");
            fetchusermapping();
            showPopup("User Mapping Updated Successfully", "SaleMaster.jsp");
        },

        error: function (xhr) {
            alert(xhr.responseText || "Failed to update user mapping.");
        }
    });
});
