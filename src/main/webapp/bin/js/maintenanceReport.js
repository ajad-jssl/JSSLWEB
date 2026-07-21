
$(document).ready(function () {
    loadFactories();
	MachineCategory();
});

function loadFactories() {

    $.ajax({
        url: `${baseUrl}/jssl/factory/getAllFactoryList`,
        type: 'GET',
	   xhrFields: { withCredentials: true },
        success: function(response) {

            var $factory = $('#FactoryId');

            $factory.empty();
            $factory.append('<option value="">Select</option>');
            $factory.append('<option value="All">All</option>');

            if (response.status === 'yes' && response.FactoryDetails) {

                $.each(response.FactoryDetails, function(index, factory) {

                    $factory.append(
                        '<option value="' + factory.id + '">' +
                        factory.factory_name +
                        '</option>'
                    );

                });
            }
        },
        error: function(xhr) {
            console.log('Failed to load factories', xhr);
        }
    });
}




function MachineCategory() {

    $.ajax({
        url: `${baseUrl}/api/machine-description/getAll`,
        type: 'GET',
        xhrFields: { withCredentials: true },

        success: function(response) {

            var $category = $('#machineCategory');

            $category.empty();
            $category.append('<option value="">Select</option>');
            $category.append('<option value="All">All</option>');

            $.each(response, function(index, machine) {

                $category.append(
                    '<option value="' + machine.machineDescId + '">' +
                    machine.machineDescription +
                    '</option>'
                );

            });
        },

        error: function(xhr) {
            console.log('Failed to load machine categories', xhr);
        }
    });
}



function loadMachines() {

    var factoryId = $('#FactoryId').val();
    var machineDescId = $('#machineCategory').val();

    // Don't call API until both are selected
    if (!factoryId || !machineDescId) {
        return;
    }

    $.ajax({
        url: `${baseUrl}/api/report/machines`,
        type: 'GET',
        data: {
            factoryId: factoryId === 'All' ? 0 : factoryId,
            machineDescId: machineDescId === 'All' ? 0 : machineDescId
        },
        xhrFields: { withCredentials: true },

        success: function(response) {

            var $machine = $('#machineType');

            $machine.empty();
            $machine.append('<option value="">Select</option>');
            $machine.append('<option value="All">All</option>');

            $.each(response, function(index, item) {

                $machine.append(
                    '<option value="' + item.MACHINE_ID + '">' +
                    item.MACHINE_SUBCODE +
                    '</option>'
                );

            });
        },

        error: function(xhr) {
            console.log('Failed to load machines', xhr);
        }
    });
}


$('#machineCategory').on('change', function () {
    loadMachines();
});


$('#FactoryId').on('change', function () {
    loadMachines();
});





$('#fetchsummaryOrdetails').on('click', function () {

    $.ajax({
        url: `${baseUrl}/api/report/details`,
        type: 'GET',
        data: {
            factoryId: $('#FactoryId').val() === 'All' ? 0 : $('#FactoryId').val(),
            machineDescId: $('#machineCategory').val() === 'All' ? 0 : $('#machineCategory').val(),
            machineId: $('#machineType').val() === 'All' ? 0 : $('#machineType').val(),
            fromDate: $('#fromDate').val(),
            toDate: $('#toDate').val()
        },
		xhrFields: { withCredentials: true },
        success: function(response) {
            renderDetailsTable(response);
        },
        error: function(err) {
            console.log(err);
        }
    });

});




function renderDetailsTable(data) {

    let tbody = $('#detailsTable tbody');
    tbody.empty();

    $.each(data, function(index, row) {

        tbody.append(`
            <tr>
                <td>${index + 1}</td>
                <td>${row.TICKET_NO || ''}</td>
                <td>${row.MACHINE_CATEGORY || ''}</td>
                <td>${row.MACHINE_SUBCODE || ''}</td>
                <td>${row.REPORTED_BY || ''}</td>
                <td>${formatDate(row.REPORTED_DATE)}</td>
                <td>${row.PROBLEM_DESC || ''}</td>
                <td>${row.WHAT_BROKE || ''}</td>
                <td>${row.STATUS_NAME || ''}</td>
                <td>${row.DOWNTIME || ''}</td>
                <td>${row.CLOSED_BY || ''}</td>
                <td>${formatDate(row.CLOSED_DATE)}</td>
                <td>${row.CLOSE_REMARKS || ''}</td>
				<td>${row.factory_name || ''}</td>
				
            </tr>
        `);

    });

    $('#detailsTableContainer').show();
}


function formatDate(dateString) {

    if (!dateString) return '';

    const d = new Date(dateString);

    return d.toLocaleString('en-IN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}
