
async function fetchInvoiceExitData() {
	const selectedFactoryId = localStorage.getItem('selectedFactoryId');
    const apiUrl = new URL('/api/invoiceexit/jims/getinvoicexitrejecttable',baseUrl1); // Update if your backend port differs
	apiUrl.searchParams.append('factoryid', selectedFactoryId);
    try {
		const response = await fetch(apiUrl,{
						           method: "GET",
						           credentials: "include"   // ✅ Always send JSESSIONID cookie
						       });
        if (!response.ok) throw new Error("Failed to fetch invoice exit data");

        const data = await response.json();
        let tableRows = '';

        data.forEach((item, index) => {
            tableRows += `
                <tr id="row_${item.ine_id}">
                    <td>${item.vechile_id || ''}</td>
                    <td>${item.vecno || ''}</td>
                    <td>${item.dname || ''}</td>
                    <td>${item.dmbno || ''}</td>
                    <td>${item.dl || ''}</td>
                    <td>${item.helper || ''}</td>
                    <td>${item.description || ''}</td>
                    <td>${item.outremarks || ''}</td>
                    <td>
                   <i class="fa fa-pen text-muted" style="cursor: pointer;" onclick="editInvoice('${item.ine_id}','${item.vechile_id}')"></i>
                    </td>
                </tr>
            `;
        });

        // Inject rows into the table body
        document.querySelector("#Table tbody").innerHTML = tableRows;

        // Reinitialize DataTable
        if ($.fn.DataTable.isDataTable('#Table')) {
            $('#Table').DataTable().destroy();
        }

        $('#Table').DataTable({
            dom: 'Bfrtip',
            scrollX: true,
            info: false,
            paging: false,
            buttons: [
                {
                    extend: 'excel',
                    text: 'Export to Excel',
                    title: 'Vehicle Invoice Exit'
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

document.addEventListener('DOMContentLoaded', fetchInvoiceExitData);
   
async function editInvoice(id,vechile_id) {

    try {
        // Step 1: Fetch invoice details
        const response = await fetch(new URL(`/api/invoiceexit/${id}`,baseUrl1), {
		    credentials: "include"
		});
		const response1 = await fetch(new URL(`api/invoiceexit/jims/vehicleDetails?filterType=byVehicleId&vechile_id=${vechile_id}`,baseUrl1)		, {
		    credentials: "include"
		});
		if (!response.ok) throw new Error('Failed to fetch invoice details (invoiceexit)');
		if (!response1.ok) throw new Error('Failed to fetch vehicle details');
        const data = await response.json();
		const data1 = await response1.json();
        // Fill basic invoice fields
        document.getElementById('vehicleN_1').value = data.vecno || '';
        document.getElementById('dname_1').value = data.dname || '';
        document.getElementById('dmno_1').value = data.dmbno || '';
        document.getElementById('dlno_1').value = data.dl || '';
        document.getElementById('hname_1').value = data.helper || '';
        document.getElementById('whom_1').value = data1[0].user_id || '';
        document.getElementById('department_1').value = data1[0].Department_name || '';
        document.getElementById('content_1').value = data.description || '';
        document.getElementById('remarks_1').value = data.outremarks || '';
        document.getElementById('description_1').value = data.description || '';
        document.getElementById('rejected_remarks').value = data.rejected_remarks || '';
/*        document.getElementById('whom_1').value = data.whomtomeet || '';
        document.getElementById('department_1').value = data.department || '';*/
		document.getElementById('tname_1').value = data1[0]?.Company_name || '';
		document.getElementById('tlocation_1').value = data1[0]?.State_name || '';
		document.getElementById('taddress_1').value = data1[0]?.City_name || '';
/*        // Transporter dropdown
        const tnameSelect = document.getElementById('tname_1');
        tnameSelect.innerHTML = `<option selected>${data.transname || 'Select'}</option>`;*/
	
        // Step 2: Fetch PO line items using vehicle_id
        const tableBody = document.querySelector("#TableID tbody");
		tableBody.innerHTML = '';
        const vechileId = data.vechile_id;
        if (vechileId) {
            const poResponse = await fetch(new URL(`/api/incponumber/jims/vehiclepo?filterType=byVehicleId&vechile_id=${vechileId}`,baseUrl1)			, {
			    credentials: "include"
			});
            if (!poResponse.ok) throw new Error('Failed to fetch PO details');
            const poData = await poResponse.json();
		
			if (poData && poData.length > 0) {
			            poData.forEach((item, index) => {
			                const rowCount = index + 1; // Start rowCount at 1
			                console.log(`Adding row ${rowCount} with data:`, item); // Log each item
			                addNewRow(rowCount, item,id); // Add row with data
			            });
        }
		
		}
		
		        
        // Step 3: Show the modal
        $('#exampleModalScrollable1').modal('show');

    } catch (error) {
        console.error('Error loading invoice details:', error);
    }
}

// Initialize rejectedRows as a global array
let rejectedRows = [];

// Add a new row dynamically
function addNewRow(rowCount, item, ine_id) {
    const tableBody = document.querySelector("#Table_ID tbody");

    // Prevent duplicate rows by checking for pono_id
    const existingRow = tableBody.querySelector(`tr[data-pono-id="${item.pono_id}"]`);
    if (existingRow) {
        console.log(`Row for pono_id ${item.pono_id} already exists, skipping.`);
        return;
    }

    const row = document.createElement('tr');
    row.setAttribute('data-pono-id', item.pono_id); // Add unique identifier
    row.innerHTML = `
        <td>${rowCount}</td>
        <td>
            <select class="form-control form-control-sm" id="cname_${rowCount}" disabled>
                <option selected>${item.Company_name || 'Select'}</option>
            </select>
        </td>
        <td>
            <input type="text" class="form-control form-control-sm" id="clocation_${rowCount}" readonly value="${item.City_name || ''}">
        </td>
        <td>
            <input type="text" class="form-control form-control-sm" id="caddress_${rowCount}" readonly value="${item.Address || ''}">
        </td>
        <td>
            <input type="text" class="form-control form-control-sm" id="ponum_${rowCount}" readonly value="${item.Po_number || ''}">
        </td>
        <td>
            <input type="date" class="form-control form-control-sm" id="podate_${rowCount}" readonly value="${item.Po_date || ''}">
        </td>
        <td>
            <input type="text" class="form-control form-control-sm" id="invoicenum_${rowCount}" readonly value="${item.Inv_no || ''}">
        </td>
        <td>
            <input type="date" class="form-control form-control-sm" id="invoicedate_${rowCount}" readonly value="${item.Inv_date || ''}">
        </td>
        <td>
            <input type="text" class="form-control form-control-sm" id="dcnum_${rowCount}" readonly value="${item.DC_no || ''}">
        </td>
        <td>
            <input type="date" class="form-control form-control-sm" id="dcdate_${rowCount}" readonly value="${item.DC_date || ''}">
        </td>
        <td>
            <input type="text" class="form-control form-control-sm" id="quantity_${rowCount}" readonly value="${item.qty || ''}">
        </td>
        <td>
            <input type="text" class="form-control form-control-sm" id="weight_${rowCount}" readonly value="${item.weight || ''}">
        </td>
        <td>
            <input type="text" class="form-control form-control-sm" id="description_${rowCount}" readonly value="${item.Descp || ''}">
        </td>
        <td>
            <button type="button" class="btn btn-sm btn-danger" onclick="deleteRow(this, '${item.pono_id}', '${ine_id}')">Reject</button>
        </td>
    `;
    tableBody.appendChild(row);
}

function addNewRow1(rowCount, item, ine_id) {
    const tableBody = document.querySelector("#Table_ID1 tbody");

    // Prevent duplicate rows by checking for pono_id
    const existingRow = tableBody.querySelector(`tr[data-pono-id="${item.pono_id}"]`);
    if (existingRow) {
        console.log(`Row for pono_id ${item.pono_id} already exists in Table_ID1, skipping.`);
        return;
    }

    const row = document.createElement('tr');
    row.setAttribute('data-pono-id', item.pono_id); // Add unique identifier
    row.innerHTML = `
        <td>${rowCount}</td>
        <td>
            <select class="form-control form-control-sm" id="cname_${rowCount}" disabled>
                <option selected>${item.Company_name || 'Select'}</option>
            </select>
        </td>
        <td>
            <input type="text" class="form-control form-control-sm" id="clocation_${rowCount}" readonly value="${item.City_name || ''}">
        </td>
        <td>
            <input type="text" class="form-control form-control-sm" id="caddress_${rowCount}" readonly value="${item.Address || ''}">
        </td>
        <td>
            <input type="text" class="form-control form-control-sm" id="ponum_${rowCount}" readonly value="${item.Po_number || ''}">
        </td>
        <td>
            <input type="date" class="form-control form-control-sm" id="podate_${rowCount}" readonly value="${item.Po_date || ''}">
        </td>
        <td>
            <input type="text" class="form-control form-control-sm" id="invoicenum_${rowCount}" readonly value="${item.Inv_no || ''}">
        </td>
        <td>
            <input type="date" class="form-control form-control-sm" id="invoicedate_${rowCount}" readonly value="${item.Inv_date || ''}">
        </td>
        <td>
            <input type="text" class="form-control form-control-sm" id="dcnum_${rowCount}" readonly value="${item.DC_no || ''}">
        </td>
        <td>
            <input type="date" class="form-control form-control-sm" id="dcdate_${rowCount}" readonly value="${item.DC_date || ''}">
        </td>
        <td>
            <input type="text" class="form-control form-control-sm" id="quantity_${rowCount}" readonly value="${item.qty || ''}">
        </td>
        <td>
            <input type="text" class="form-control form-control-sm" id="weight_${rowCount}" readonly value="${item.weight || ''}">
        </td>
        <td>
            <input type="text" class="form-control form-control-sm" id="description_${rowCount}" readonly value="${item.Descp || ''}">
        </td>
    `;
    tableBody.appendChild(row);
}

function deleteRow(button, pono_id,ine_id) {
    const row = button.closest('tr');
    
    if (button.textContent === 'Reject') {
        // Mark as rejected
        rejectedRows.push({ pono_id, row,ine_id,button });
        button.textContent = 'Undo';
        button.classList.remove('btn-danger');
        button.classList.add('btn-warning');
        row.style.backgroundColor = '#ffebee'; // Light red background for rejected rows
    } else {
        // Undo reject
        rejectedRows = rejectedRows.filter(item => item.pono_id !== pono_id);
        button.textContent = 'Reject';
        button.classList.remove('btn-warning');
        button.classList.add('btn-danger');
        row.style.backgroundColor = ''; // Reset background
    }
}

async function saveRejectedRows() {
    try {
        for (const { pono_id, ine_id, button } of rejectedRows) {
            await submit_Function(button, pono_id, ine_id);
        }
        // Clear rejectedRows after successful submission
        rejectedRows = [];
        // Hide the modal
        $('#exampleModalScrollable1').modal('hide');
        alert('All rejected rows processed successfully!');
		tableBody.innerHTML = '';
    } catch (error) {
        console.error('Error saving rejected rows:', error);
        alert('Failed to process rejected rows: ' + error.message);
    }
}

async function submit_Function(button, pono_id,ine_id) {
    try {
        // Get the row containing the reject button
        const row = button.closest('tr');
        const rowCount = row.cells[0].textContent;
        
        // Get rejected remarks from the modal
        const rejectedRemarks = document.getElementById('rejected_remarks').value || 'Rejected';

        // API 1: Update invoice exit with rejected status
        const invoiceExitUpdate = {
            reject_remarks:rejectedRemarks,
            reject: 1
        };

        const invoiceExitResponse = await fetch(new URL(`/api/invoiceexit/${ine_id}`,baseUrl1), {
            method: 'PUT',
			credentials: 'include', 
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(invoiceExitUpdate)
        });

        if (!invoiceExitResponse.ok) {
            throw new Error('Failed to update invoice exit status');
        }

        // API 2: Update PO status
        const poUpdate = {
            reject: 1
          
        };

        const poResponse = await fetch(new URL(`/api/incponumber/${pono_id}`,baseUrl1), {
            method: 'PUT',
			credentials: 'include', 
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(poUpdate)
        });

        if (!poResponse.ok) {
            throw new Error('Failed to update PO status');
        }

        // Remove the row from the table
        row.remove();

        // Show success message
        alert('Row rejected successfully!');
        

    } catch (error) {
        console.error('Error in submit_Function:', error);
        alert('Failed to reject row: ' + error.message);
    }
}

document.addEventListener("DOMContentLoaded", function() {
	const selectedFactoryId = localStorage.getItem('selectedFactoryId');
    // Fetch data from your Spring Boot API
    fetch(new URL(`/api/invoiceexit/jims/vehicleDetails?filterType=byReject&factory_id=${selectedFactoryId}`,baseUrl1), {
	    credentials: "include"
	})
        .then(response => response.json()) // Parse JSON response
        .then(data => {
            // Get the select element by ID
            const selectElement = document.getElementById("Vehicle_id");

            // Loop through the data and create option elements
            data.forEach(item => {
                const option = document.createElement("option");
                option.value = item.vechile_id; // Set the value of the option to 'tid'
                option.textContent = item.vechile_id; // Set the text of the option to 'regtype'
                selectElement.appendChild(option); // Append the option to the select element
            });

            // Enable the select element after populating it
            selectElement.disabled = false;
			selectElement.addEventListener("change", function() {
			                const selectedIneId = this.value; // Get the selected ine_id
			                if (selectedIneId) {
			                    editrejectsecurityInvoice(selectedIneId); // Call the function with ine_id
			                }
			            });
        })
        .catch(error => {
            console.error("Error fetching data:", error);
        });
});
/*document.addEventListener("DOMContentLoaded", function() {
    fetch('http://localhost:8004/api/Regtype/filter?include=true')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const registerSelect = document.getElementById("register1");

            // Clear existing options
            registerSelect.innerHTML = "<option value=''>Select</option>";

            // Add new options
            data.forEach(vehicle => {
                const option = document.createElement("option");
                option.value = vehicle.tid;
                option.textContent = vehicle.regtype;
                registerSelect.appendChild(option);
            });

            // Add change event to clear all form values inside container1
            registerSelect.addEventListener("change", () => {
                const container1 = document.getElementById("container1");

                if (container1) {
                    // Clear all inputs, textareas, selects inside container1
                    const inputs = container1.querySelectorAll("input, textarea, select");
                    inputs.forEach(input => {
                        if (input.type === "checkbox" || input.type === "radio") {
                            input.checked = false;
                        } else {
                            input.value = "";
                        }
                    });
                }
            });
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
});
document.addEventListener("DOMContentLoaded", function() {
    fetch('http://localhost:8004/api/vtype')
        .then(response => response.json())
        .then(data => {
            const vehicleSelect = document.getElementById('v_type');
            vehicleSelect.innerHTML = '<option value="">Select</option>';

            data.forEach(vehicle => {
                const option = document.createElement('option');
                option.value = vehicle.vid; // assuming 'vtype' is what user selects
                option.textContent = vehicle.vtype;
                vehicleSelect.appendChild(option);
            });

        })
        .catch(error => {
            console.error('Error fetching vehicle types:', error);
        });
});

document.addEventListener("DOMContentLoaded", function() {
  fetch('http://localhost:8004/api/VMScompany')
    .then(response => response.json())
    .then(data => {
		const tnameSelect = document.getElementById('t_name');
      tnameSelect.innerHTML = '<option value="">Select</option>';
      if (data && Array.isArray(data)) {
        data.forEach(item => {
          const option = document.createElement('option');
          option.value = item.company_id;
          option.textContent = item.company_name;
          tnameSelect.appendChild(option);
        });
      } else {
        console.error('No transporter names found.');
      }
    })
    .catch(error => {
      console.error('Error fetching transporter names:', error);
    });
});*/
window.ine_id = null;
async function editrejectsecurityInvoice(vechile_id) {

    try {
        // Step 1: Fetch invoice details
        const response = await fetch(new URL(`/api/invoiceexit/jims/vehicleDetails?filterType=byVehicleId&vechile_id=${vechile_id}`,baseUrl1)		, {
		    credentials: "include"
		});
        if (!response.ok) throw new Error('Failed to fetch invoice details');
        const data = await response.json();
 		const rejectdata=data[0];
        // Fill basic invoice fields
        document.getElementById('vehicle_no').value = rejectdata.vecno || '';
        document.getElementById('driver1').value = rejectdata.dname || '';
        document.getElementById('dm_no').value = rejectdata.dmbno || '';
        document.getElementById('dl_no').value = rejectdata.dl || '';
        document.getElementById('hname1').value = rejectdata.helper || '';
		document.getElementById('t_name').value = rejectdata.Company_name || '';
		document.getElementById("v_type").value = rejectdata.Vtype || "";
		document.getElementById("register1").value = rejectdata.regtype || "";
		document.getElementById('lr_no').value = rejectdata.lr_no || '';
		document.getElementById('out_remarks').value = rejectdata.outremarks || '';
        document.getElementById('whom1').value = rejectdata.user_id || '';
        document.getElementById('department1').value = rejectdata.Department_name || '';
		document.getElementById('vehicle_in').value = rejectdata.intime || '';
	
        // Step 2: Fetch PO line items using vehicle_id
        const tableBody = document.querySelector("#Table_ID1 tbody");
		tableBody.innerHTML = '';
        const id = rejectdata.ine_id;
		window.ine_id = id;
        if (vechile_id) {
            const poResponse = await fetch(new URL(`/api/incponumber/jims/vehiclepo?filterType=byReject&vechile_id=${vechile_id}`,baseUrl1)			, {
			    credentials: "include"
			});
            if (!poResponse.ok) throw new Error('Failed to fetch PO details');
            const poData = await poResponse.json();
		
			if (poData && poData.length > 0) {
			            poData.forEach((item, index) => {
			                const rowCount = index + 1; // Start rowCount at 1
			                console.log(`Adding row ${rowCount} with data:`, item); // Log each item
			                addNewRow1(rowCount, item,id); // Add row with data
			            });
			
        }
		
		}
		
    } catch (error) {
        console.error('Error loading invoice details:', error);
    }
}


async function  reject(){
	
	try {
		let currentDate = new Date();
		let securityremarks=document.getElementById('rejectedout').value;
		let currentTimeOnly = getIndianTimeOnly(currentDate); 
	        // Collect form data
	        const formData = {
				intime:currentTimeOnly,
				securityreject_remarks:securityremarks,
				outtime:currentTimeOnly
				};
				const response = await fetch(new URL(`/api/invoiceexit/${window.ine_id}`,baseUrl1), {
				            method: 'PUT',
							credentials: 'include', 
				            headers: {
				                'Content-Type': 'application/json'
				            },
				            body: JSON.stringify(formData)
				        });

				        if (!response.ok) {
				            throw new Error('Failed to submit invoice details');
				        }

				        const result = await response.json();
				        console.log('Successfully submitted  details:', result);
				        alert(' Details submitted successfully');
						window.location = "RejectedOut.jsp";
						window.ine_id = null;
				    } catch (error) {
				        console.error('Error submitting  details:', error);
				        alert('Error submitting details: ' + error.message);
				    }
					}

function getIndianTimeOnly(date) {
    const options = {
        timeZone: 'Asia/Kolkata',
        hour12: false,
    };

    const istDate = new Date(date.toLocaleString('en-US', options));

    const hours = istDate.getHours().toString().padStart(2, '0');
    const minutes = istDate.getMinutes().toString().padStart(2, '0');
    const seconds = istDate.getSeconds().toString().padStart(2, '0');

    // Return the time in HH:mm:ss format, which Java can easily deserialize
    return `${hours}:${minutes}:${seconds}`;
}

