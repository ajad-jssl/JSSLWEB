document.addEventListener("DOMContentLoaded", function () {
    const selectedFactoryId = sessionStorage.getItem("selectedFactoryId"); // Get factory_id from sessionStorage
    if (selectedFactoryId) {
        fetchSalework1(selectedFactoryId);
        fetchSalebank1(selectedFactoryId);
        fetchSalebusunit1(selectedFactoryId);
        fetchhsn1(selectedFactoryId);
        fetchservice1(selectedFactoryId);
        fetchShipping1(selectedFactoryId);
        fetchdelivery1(selectedFactoryId);
        fetchcont1(selectedFactoryId);
        fetchtax1();
        fetchexptitle1();
        fetchorg1(selectedFactoryId);
        fetchinvoiceto1(selectedFactoryId);
        fetchconname1(selectedFactoryId);
    } else {
        console.error("No factory ID found in sessionStorage.");
    }
});

async function fetchSalework1() {
    try {
        
        // Construct the API URL properly
        const url = new URL(`/jssl/contract/listworkordernew`, baseUrl);
      //  url.searchParams.append("factory_id", factoryId);

        // Fetch data from API
		const response = await fetch(url,{
						           method: "GET",
						           credentials: "include"   // ✅ Always send JSESSIONID cookie
						       });
        if (!response.ok) throw new Error("Failed to fetch sale order types");

        const json = await response.json();

        // Check if the API response has valid data
        if (json.status !== "yes" || !json.Data.length) {
            console.warn("No sale order types found.");
            return;
        }

        // Get the select element
        const selectElement = document.getElementById("work1");

        // Clear existing options
        selectElement.innerHTML = `<option value="">Select work order</option>`;

        // Populate dropdown options using SalesOrderTypeDetails array
        json.Data.forEach((type) => {
            if (type.work_id && type.workorder_no) { // Ensure both values exist
                const option = document.createElement("option");
                option.value = type.work_id; // Backend keeps saleorder_id
                option.textContent = type.workorder_no; // Display saleorder_typename
                selectElement.appendChild(option);
            }
        });
		
		initSelect2('work1', 'exampleModalScrollableEdit', 'Select work order');
    } catch (error) {
        console.error("Error fetching sale order types:", error);
    }
}

async function fetchSalebank1() {
    try {
        
        // Construct the API URL properly
        const url = new URL(`/jssl/contract/listbanknamenew`, baseUrl);
       // url.searchParams.append("factory_id", factoryId);

        // Fetch data from API
		const response = await fetch(url,{
						           method: "GET",
						           credentials: "include"   // ✅ Always send JSESSIONID cookie
						       });
        if (!response.ok) throw new Error("Failed to fetch sale order types");

        const json = await response.json();

        // Check if the API response has valid data
        if (json.status !== "yes" || !json.Data.length) {
            console.warn("No sale order types found.");
            return;
        }

        // Get the select element
        const selectElement = document.getElementById("bank1");

        // Clear existing options
        selectElement.innerHTML = `<option value="">Select bank</option>`;

        // Populate dropdown options using SalesOrderTypeDetails array
        json.Data.forEach((type) => {
            if (type.account_id && type.bank_name) { // Ensure both values exist
                const option = document.createElement("option");
                option.value = type.account_id; // Backend keeps saleorder_id
                option.textContent = type.bank_name; // Display saleorder_typename
                selectElement.appendChild(option);
            }
        });
    } catch (error) {
        console.error("Error fetching sale order types:", error);
    }
}

async function fetchSalebusunit1() {
    try {
        
        // Construct the API URL properly
        const url = new URL(`/jssl/contract/listbusinessunitnew`, baseUrl);
        //url.searchParams.append("factory_id", factoryId);

        // Fetch data from API
		const response = await fetch(url,{
						           method: "GET",
						           credentials: "include"   // ✅ Always send JSESSIONID cookie
						       });
        if (!response.ok) throw new Error("Failed to fetch sale order types");

        const json = await response.json();

        // Check if the API response has valid data
        if (json.status !== "yes" || !json.Data.length) {
            console.warn("No sale order types found.");
            return;
        }

        // Get the select element
        const selectElement = document.getElementById("bus1");

        // Clear existing options
        selectElement.innerHTML = `<option value="">Select Business Unit</option>`;

        // Populate dropdown options using SalesOrderTypeDetails array
        json.Data.forEach((type) => {
            if (type.business_unit_id && type.business_unit_name) { // Ensure both values exist
				let bindaddress = type.business_unit_name +' '+type.orgName +',' +type.location+','+type.stateName +'('+type.gst_number +')';
                const option = document.createElement("option");
                option.value = type.business_unit_id; // Backend keeps saleorder_id
                option.textContent =bindaddress; // Display saleorder_typename
                selectElement.appendChild(option);
            }
        });
		
		initSelect2('bus1', 'exampleModalScrollableEdit', 'Select Business Unit');
    } catch (error) {
        console.error("Error fetching sale order types:", error);
    }
}

async function fetchhsn1() {
    try {
        
        // Construct the API URL properly
        const url = new URL(`/jssl/master/listHsncodemasternew`, baseUrl);
       // url.searchParams.append("factory_id", factoryId);

        // Fetch data from API
		const response = await fetch(url,{
						           method: "GET",
						           credentials: "include"   // ✅ Always send JSESSIONID cookie
						       });
        if (!response.ok) throw new Error("Failed to fetch sale order types");

        const json = await response.json();

        // Check if the API response has valid data
        if (json.status !== "yes" || !json.Data.length) {
            console.warn("No sale order types found.");
            return;
        }

        // Get the select element
        const selectElement = document.getElementById("hsncode1");

        // Clear existing options
        selectElement.innerHTML = `<option value="">Select hsn code</option>`;

        // Populate dropdown options using SalesOrderTypeDetails array
        json.Data.forEach((type) => {
            if (type.servicecode_id && type.service_code) { // Ensure both values exist
                const option = document.createElement("option");
                option.value = type.servicecode_id; // Backend keeps saleorder_id
                option.textContent = type.service_code; // Display saleorder_typename
                selectElement.appendChild(option);
            }
        });
    } catch (error) {
        console.error("Error fetching sale order types:", error);
    }
}

async function fetchservice1() {
    try {
        
        // Construct the API URL properly
        const url = new URL(`/jssl/master/listservicecodemasternew`, baseUrl);
      //  url.searchParams.append("factory_id", factoryId);

        // Fetch data from API
		const response = await fetch(url,{
						           method: "GET",
						           credentials: "include"   // ✅ Always send JSESSIONID cookie
						       });
        if (!response.ok) throw new Error("Failed to fetch sale order types");

        const json = await response.json();

        // Check if the API response has valid data
        if (json.status !== "yes" || !json.Data.length) {
            console.warn("No sale order types found.");
            return;
        }

        // Get the select element
        const selectElement = document.getElementById("serco1");

        // Clear existing options
        selectElement.innerHTML = `<option value="">Select service code</option>`;

        // Populate dropdown options using SalesOrderTypeDetails array
        json.Data.forEach((type) => {
            if (type.servicecode_id && type.service_code) { // Ensure both values exist
                const option = document.createElement("option");
                option.value = type.servicecode_id; // Backend keeps saleorder_id
                option.textContent = type.service_code; // Display saleorder_typename
                selectElement.appendChild(option);
            }
        });
    } catch (error) {
        console.error("Error fetching sale order types:", error);
    }
}

async function fetchShipping1() {
    try {
        
        // Construct the API URL properly
        const url = new URL(`/jssl/master/listshipmentdeliverynew`, baseUrl);
       // url.searchParams.append("factory_id", factoryId);

        // Fetch data from API
		const response = await fetch(url,{
						           method: "GET",
						           credentials: "include"   // ✅ Always send JSESSIONID cookie
						       });
        if (!response.ok) throw new Error("Failed to fetch sale order types");

        const json = await response.json();

        // Check if the API response has valid data
        if (json.status !== "yes" || !json.Data.length) {
            console.warn("No sale order types found.");
            return;
        }

        // Get the select element
        const selectElement = document.getElementById("ship1");

        // Clear existing options
        selectElement.innerHTML = `<option value="">Select shipment mode</option>`;

        // Populate dropdown options using SalesOrderTypeDetails array
        json.Data.forEach((type) => {
            if (type.si_id && type.shipment_mode) { // Ensure both values exist
                const option = document.createElement("option");
                option.value = type.si_id; // Backend keeps saleorder_id
                option.textContent = type.shipment_mode; // Display saleorder_typename
                selectElement.appendChild(option);
            }
        });
    } catch (error) {
        console.error("Error fetching sale order types:", error);
    }
}

async function fetchdelivery1() {
    try {
        
        // Construct the API URL properly
        const url = new URL(`/jssl/master/listshipmentdeliverynew`, baseUrl);
       // url.searchParams.append("factory_id", factoryId);

        // Fetch data from API
		const response = await fetch(url,{
						           method: "GET",
						           credentials: "include"   // ✅ Always send JSESSIONID cookie
						       });
        if (!response.ok) throw new Error("Failed to fetch sale order types");

        const json = await response.json();

        // Check if the API response has valid data
        if (json.status !== "yes" || !json.Data.length) {
            console.warn("No sale order types found.");
            return;
        }

        // Get the select element
        const selectElement = document.getElementById("del1");

        // Clear existing options
        selectElement.innerHTML = `<option value="">Select delivery condition</option>`;

        // Populate dropdown options using SalesOrderTypeDetails array
        json.Data.forEach((type) => {
            if (type.si_id && type.delivery_condition) { // Ensure both values exist
                const option = document.createElement("option");
                option.value = type.si_id; // Backend keeps saleorder_id
                option.textContent = type.delivery_condition; // Display saleorder_typename
                selectElement.appendChild(option);
            }
        });
    } catch (error) {
        console.error("Error fetching sale order types:", error);
    }
}

async function fetchcont1(factoryId) {
    try {
        // Construct the API URL properly
        const url = new URL(`/jssl/contract/listcontractfromcontractornew`, baseUrl);
        url.searchParams.append("factory_id", factoryId);

        // Fetch data from API
		const response = await fetch(url,{
						           method: "GET",
						           credentials: "include"   // ✅ Always send JSESSIONID cookie
						       });
        if (!response.ok) throw new Error("Failed to fetch contractors");

        const json = await response.json();

        // Check if the API response has valid data
        if (!json.Data.length) {
            console.warn("No contractors found.");
            return;
        }

        // Get the select element
        const selectElement = document.getElementById("cont1");

        // Clear existing options
        selectElement.innerHTML = `<option value="">Select contractor</option>`;

        // Populate dropdown options using the contractor list
        json.Data.forEach((contractor) => {
            if (contractor.contract_id && contractor.contract_name) { // Ensure both values exist
                const option = document.createElement("option");
                option.value = contractor.contract_id; // Contractor ID
                option.textContent = contractor.contract_name; // Contractor Name
                selectElement.appendChild(option);
            }
        });
		
		initSelect2('cont1', 'exampleModalScrollableEdit', 'Select contractor');
    } catch (error) {
        console.error("Error fetching contractors:", error);
    }
}

async function fetchorg1() {
    try {
        
        // Construct the API URL properly
        const url = new URL(`/jssl/organization/listorganization`, baseUrl);
       // url.searchParams.append("factory_id", factoryId);

        // Fetch data from API
		const response = await fetch(url,{
						           method: "GET",
						           credentials: "include"   // ✅ Always send JSESSIONID cookie
						       });
        if (!response.ok) throw new Error("Failed to fetch sale order types");

        const json = await response.json();

        // Check if the API response has valid data
        if (json.status !== "yes" || !json.Data.length) {
            console.warn("No sale order types found.");
            return;
        }

        // Get the select element
        const selectElement = document.getElementById("reoffice1");

        // Clear existing options
        selectElement.innerHTML = `<option value="">Select</option>`;

		json.Data.forEach((type) => {
				            if (type.org_id && type.org_name) { 
							let bindorg1 = type.org_name+'-'+type.registered_address +' ,'+type.location +' '+'('+type.gst_number +')';
        // Populate dropdown options using SalesOrderTypeDetails array
        /*json.Data.forEach((type) => {
            if (type.org_id && type.org_name) { // Ensure both values exist*/
                const option = document.createElement("option");
                option.value = type.org_id; // Backend keeps saleorder_id
                option.textContent = bindorg1; // Display saleorder_typename
                selectElement.appendChild(option);
            }
        });
    } catch (error) {
        console.error("Error fetching sale order types:", error);
    }
}

async function fetchinvoiceto1() {
    try {

        const url = new URL(`/jssl/invoiceConsigneeAddress/getInvoiceAddress`, baseUrl);

        const response = await fetch(url, {
            method: "GET",
            credentials: "include"
        });

        if (!response.ok) throw new Error("Failed to fetch invoice addresses");

        const json = await response.json();

        if (json.status !== "yes" || !json.InvoiceAddress?.length) {
            console.warn("No invoice addresses found.");
            return;
        }

        const selectElement = document.getElementById("into1");

        selectElement.innerHTML = `<option value="">Select invoice to</option>`;

        json.InvoiceAddress.forEach((type) => {

            // ✅ ONLY VERIFIED
            if (type.is_verified == 1 && type.id && type.address) {

                const option = document.createElement("option");
                option.value = type.id;
                option.textContent = type.address;

                selectElement.appendChild(option);
            }
        });
		
		initSelect2('into1', 'exampleModalScrollableEdit', 'Select invoice to');

    } catch (error) {
        console.error("Error fetching invoice addresses:", error);
    }
}

async function fetchconname1() {
    try {
        
        // Construct the API URL properly
        const url = new URL(`/jssl/invoiceConsigneeAddress/getConsigneeAddressNew`, baseUrl);
       // url.searchParams.append("factory_id", factoryId);

        // Fetch data from API
		const response = await fetch(url,{
						           method: "GET",
						           credentials: "include"   // ✅ Always send JSESSIONID cookie
						       });
        if (!response.ok) throw new Error("Failed to fetch sale order types");

        const json = await response.json();

        // Check if the API response has valid data
        if (json.status !== "yes" || !json.ConsigneeAddress.length) {
            console.warn("No sale order types found.");
            return;
        }

        // Get the select element
        const selectElement = document.getElementById("consig1");

        // Clear existing options
        selectElement.innerHTML = `<option value="">Select</option>`;

        // Populate dropdown options using SalesOrderTypeDetails array
        json.ConsigneeAddress.forEach((type) => {
            //if (type.id && type.address) { // Ensure both values exist
				if (type.is_verified == 1 && type.id && type.address) {
                const option = document.createElement("option");
                option.value = type.id; // Backend keeps saleorder_id
                option.textContent = type.address; // Display saleorder_typename
                selectElement.appendChild(option);
            }
        });
		
		initSelect2('consig1', 'exampleModalScrollableEdit', 'Select');
    } catch (error) {
        console.error("Error fetching sale order types:", error);
    }
}

async function fetchexptitle1() {
    try {
        
        // Construct the API URL properly
        const url = new URL(`/jssl/master/allExportTitleList`, baseUrl);
        
        // Fetch data from API
		const response = await fetch(url,{
						           method: "GET",
						           credentials: "include"   // ✅ Always send JSESSIONID cookie
						       });
        if (!response.ok) throw new Error("Failed to fetch sale order types");

        const json = await response.json();

        // Check if the API response has valid data
        if (json.status !== "yes" || !json.ExportTitleDetails.length) {
            console.warn("No sale order types found.");
            return;
        }

        // Get the select element
        const selectElement = document.getElementById("extitle1");

        // Clear existing options
        selectElement.innerHTML = `<option value="">Select</option>`;

        // Populate dropdown options using SalesOrderTypeDetails array
        json.ExportTitleDetails.forEach((type) => {
            if (type.id && type.export_title) { // Ensure both values exist
                const option = document.createElement("option");
                option.value = type.id; // Backend keeps saleorder_id
                option.textContent = type.export_title; // Display saleorder_typename
                selectElement.appendChild(option);
            }
        });
    } catch (error) {
        console.error("Error fetching sale order types:", error);
    }
}

async function fetchtax1() {
    try {
        const url = new URL(`/jssl/contract/listtaxmasternew`, baseUrl);
        
		const response = await fetch(url,{
						           method: "GET",
						           credentials: "include"   // ✅ Always send JSESSIONID cookie
						       });
        if (!response.ok) throw new Error("Failed to fetch tax data");

        const json = await response.json();

        if (json.status !== "yes" || !json.Data || json.Data.length === 0) {
            console.warn("No tax data found.");
            return;
        }

        const dropdownMenu = document.getElementById("taxDropdownMenu1");
        dropdownMenu.innerHTML = ""; // Clear previous options

        json.Data.forEach((tax) => {
            if (tax.tax_id && tax.tax_name) {
                const listItem = document.createElement("li");
				taxnameper = tax.tax_name+'-'+tax.tax_per +'%';
                listItem.innerHTML = `
                    <label class="dropdown-item">
                        <input type="checkbox" class="tax-checkbox1" value="${tax.tax_id}" data-name="${tax.tax_name}">
                        ${taxnameper}
                    </label>`;
                dropdownMenu.appendChild(listItem);
            }
        });

        // Event listener to update button text when checkboxes are selected
        dropdownMenu.addEventListener("change", function () {
            updateSelectedTaxes1();
        });

    } catch (error) {
        console.error("Error fetching tax data:", error);
    }
}

document.addEventListener("DOMContentLoaded", function() {
    // Fetch departments from the backend
	fetch(new URL('/jssl/factory/getAllFactoryList', baseUrl1), {
	    credentials: "include"
	})
  /*  fetch('http://localhost:8004/api/employee/all')*/
        .then(response => response.json())
        .then(data => {
            // Get the select element
            const departmentSelect = document.getElementById('updfacid');
            
            // Clear any existing options (if any)
            departmentSelect.innerHTML = `<option value="">Select</option>
		   								  <option value="all">ALL</option>`;
            
            // Loop through the data and create new option elements
			if (Array.isArray(data.FactoryDetails)) {
			          data.FactoryDetails.forEach(factory => {
                const option = document.createElement('option');
                option.value = factory.id;  // Assuming 'deptID' is the value for option
                option.textContent = factory.factory_name;  // Assuming 'deptname' is the text for option
                departmentSelect.appendChild(option);
            });
			} else {
			           console.error("FactoryDetails is not an array:", data.FactoryDetails);
			       }
        })
        .catch(error => {
            console.error('Error fetching factory:', error);
        });
});

// Function to update dropdown button text
function updateSelectedTaxes1() {
    const selected = [];
    document.querySelectorAll(".tax-checkbox1:checked").forEach((checkbox) => {
        selected.push(checkbox.getAttribute("data-name"));
    });

    document.getElementById("taxDropdown1").textContent = selected.length > 0 ? selected.join(", ") : "Select tax";
}

// ✅ Fixed
document.addEventListener("DOMContentLoaded", async function () {
    await loadActions(); // wait for it to finish
});

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

        const data = await response.json();

        // Handle both plain array and wrapped object response
        allowedActions = Array.isArray(data) ? data : (data.actions || data.Actions || []);

        console.log("Loaded actions:", allowedActions); // ✅ Check this in browser console

    } catch (error) {
        console.error("Error loading actions:", error);
        allowedActions = []; // ensure it stays an empty array on failure
    }
}

function editRecord(con_slno) {
    // Construct the URL with the query parameter
	  const allowed = allowedActions || [];
	  
	  if (allowed.length === 0) {
	          alert("Permissions not yet loaded. Please try again.");
	          return;
	      }

	      if (!allowed.includes("Edit")) {
	          alert("You do not have permission to edit.");
	          return;
	      }
    const url = new URL(`/jssl/contract/searchcontractnew`, baseUrl);
    const params = [['con_slno', con_slno]];
    url.search = new URLSearchParams(params).toString();

 fetch(url, { credentials: "include" })
        .then(response => response.json())
        .then(response => {
            if (response.status === 'yes' && response.DATA && response.DATA.length > 0) {
                const data = response.DATA[0];

                // Populate form fields with the data from the response
                //$('#cont1').val(data.contract_id);
                //$('#bus1').val(data.bid);
				// set hidden value (actual)
				
				$('#cont1').val(data.contract_id).trigger('change');
				$('#bus1').val(data.bid).trigger('change');
				$('#into1').val(data.invoice_to_id).trigger('change');
				$('#consig1').val(data.consignee_id).trigger('change');
				$('#work1').val(data.work_id).trigger('change');
				$('#intypecal1_hidden').val(data.invoice_type_calculation);

				// set visible text (display only)
				if (data.invoice_type_calculation == 2) {
				    $('#intypecal1').val("Percentage");
				} else if (data.invoice_type_calculation == 1) {
				    $('#intypecal1').val("Amount");
				} else {
				    $('#intypecal1').val("");
				}
                //$('#intypecal1').val(data.invoice_type_calculation);
                $('#per1').val(data.percentage_value);
               // $('#into1').val(data.invoice_to_id);
              //  $('#consig1').val(data.consignee_id);
                $('#ship1').val(data.shipment_mode_id);
                $('#del1').val(data.delivery_condition_id);
				$('#per0des1_hidden').val(data.product_desc_id);

				// set visible text (display only)
				if (data.product_desc_id == 2) {
				$('#per0des1').val("Product");
				} else if (data.product_desc_id == 1) {
				$('#per0des1').val("Productdesc");
				} else {
				$('#per0des1').val("");
				}
               // $('#per0des1').val(data.product_desc_id);
                $('#bank1').val(data.bank_details_id);
               // $('#work1').val(data.work_id);
                $('#reoffice1').val(data.regd_office_id);
                $('#serco1').val(data.s_code);
                $('#hsncode1').val(data.h_code);
                $('#taxein1').val(data.tax_ex_inc);
                $('#yesno1').val(data.taxable);
                $('#nonyesno1').val(data.non_taxable);
                $('#payre111').val(data.tax_payable);
                $('#fread1').val(data.freight_advance_recovery);
                $('#are1').val(data.area_no);
                $('#connum1').val(data.containter_no);
                $('#epog1').val(data.epcgno);
                $('#lut1').val(data.lot_no);
                $('#exportSelect1').val(data.export);
                $('#extitle1').val(data.export_title_text);
                $('#id').val(data.con_slno);
				let factoryValue = data.factory_id;

				if (factoryValue === "1,2" || factoryValue === "2,1") {
				    factoryValue = "all";   // must match dropdown value
				}

				$('#updfacid').val(factoryValue).trigger('change');
				//$('#updfacid').val(data.factory_id);
                
                // Show/hide the export fields based on the value of 'data.export'
                if (data.export === 'yes') {
                    $('#exportFields1').show();
                } else {
                    $('#exportFields1').hide();
                }

                // Clear all checkboxes before updating the selection for this modal
                const checkboxes = document.querySelectorAll(".tax-checkbox1");
                checkboxes.forEach(checkbox => {
                    checkbox.checked = false; // Uncheck all checkboxes
                });

                // Check if 'tax' is defined and is an array
                const selectedTaxes = Array.isArray(response.tax) ? response.tax : [];
				
				
				console.log("teh selected taxes are:",selectedTaxes);

                // Check the checkboxes corresponding to the tax values in the response
                selectedTaxes.forEach(taxId => {
                    const checkbox = document.querySelector(`.tax-checkbox1[value="${taxId}"]`);
                    if (checkbox) {
                        checkbox.checked = true;
                    }
                });

                // Open the modal
                $('#exampleModalScrollableEdit').modal('show');
            } else {
                console.error('Error: No valid data found.');
            }
        })
        .catch(error => {
            // Handle error
            console.error('Error:', error);
        });
}

function getParameterByName(name, url = window.location.href) {
	name = name.replace(/[\[\]]/g, '\\$&');
	var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
		results = regex.exec(url);
	if (!results) return null;
	if (!results[2]) return '';
	return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

function openModalUp() {
    var username = document.getElementById('cont1').value.trim();
    var password = document.getElementById('bus1').value.trim();
    var code = document.getElementById('intypecal1').value.trim();
    var state = document.getElementById('per1').value.trim();
    var state1 = document.getElementById('into1').value.trim();
    var pan = document.getElementById('consig1').value.trim();
    var gst = document.getElementById('ship1').value.trim();
    var stateDropdown = document.getElementById('del1').value.trim();
    //var per0des = document.getElementById('per0des1').value.trim();
    var bank = document.getElementById('bank1').value.trim();
    var work = document.getElementById('work1').value.trim();
    var reoffice = document.getElementById('reoffice1').value.trim();
    //var serco = document.getElementById('serco1').value.trim();
    //var hsncode = document.getElementById('hsncode1').value.trim();
    var taxein = document.getElementById('taxein1').value.trim();
    var yesno = document.getElementById('yesno1').value.trim();
    var nonyesno = document.getElementById('nonyesno1').value.trim();
    var payre11 = document.getElementById('payre111').value.trim();
    var fread = document.getElementById('fread1').value.trim();
    var showError = false; // Initialize showError variable
    var taxCheckboxes = document.querySelectorAll('.tax-checkbox1:checked');
    if (taxCheckboxes.length === 0) {
        document.getElementById('productCodeErrorcredit191').innerText = "Please select at least one tax.";
        document.getElementById('productCodeErrorcredit191').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeErrorcredit191').innerText = "";
        document.getElementById('productCodeErrorcredit191').style.display = "none";
    }

    // Username Validation
    if (username === '') {
        document.getElementById('productCodeErrorcredit1').innerText = "Please select contractor.";
        document.getElementById('productCodeErrorcredit1').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeErrorcredit1').innerText = "";
        document.getElementById('productCodeErrorcredit1').style.display = "none";
    }
    
    // Password Validation
    if (password === '') {
        document.getElementById('productCodeErrorcredit11').innerText = "Please select Business unit.";
        document.getElementById('productCodeErrorcredit11').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeErrorcredit11').innerText = "";
        document.getElementById('productCodeErrorcredit11').style.display = "none";
    }
    
    if (code === '') {
        document.getElementById('productCodeErrorcredit21').innerText = "Please enter invoice type calculation .";
        document.getElementById('productCodeErrorcredit21').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeErrorcredit21').innerText = "";
        document.getElementById('productCodeErrorcredit21').style.display = "none";
    }
    
    if (state === '') {
        document.getElementById('productCodeErrorcredit31').innerText = "Please enter percentage.";
        document.getElementById('productCodeErrorcredit31').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeErrorcredit31').innerText = "";
        document.getElementById('productCodeErrorcredit31').style.display = "none";
    }
    
    if (state1 === '') {
        document.getElementById('productCodeErrorcredit41').innerText = "Please select invoice to.";
        document.getElementById('productCodeErrorcredit41').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeErrorcredit41').innerText = "";
        document.getElementById('productCodeErrorcredit41').style.display = "none";
    }
    
    if (pan === '') {
        document.getElementById('productCodeErrorcredit5').innerText = "Please select address.";
        document.getElementById('productCodeErrorcredit5').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeErrorcredit51').innerText = "";
        document.getElementById('productCodeErrorcredit51').style.display = "none";
    }
    
    if (gst === '') {
        document.getElementById('productCodeErrorcredit61').innerText = "Please select shipment mode.";
        document.getElementById('productCodeErrorcredit61').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeErrorcredit61').innerText = "";
        document.getElementById('productCodeErrorcredit61').style.display = "none";
    }
    
    if (stateDropdown === '') {
        document.getElementById('productCodeErrorcredit71').innerText = "Please select delivery condition.";
        document.getElementById('productCodeErrorcredit71').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeErrorcredit71').innerText = "";
        document.getElementById('productCodeErrorcredit71').style.display = "none";
    }
    
    /*if (per0des === '') {
        document.getElementById('productCodeErrorcredit81').innerText = "Please enter description.";
        document.getElementById('productCodeErrorcredit81').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeErrorcredit81').innerText = "";
        document.getElementById('productCodeErrorcredit81').style.display = "none";
    }*/
    
    if (bank === '') {
        document.getElementById('productCodeErrorcredit91').innerText = "Please select bank.";
        document.getElementById('productCodeErrorcredit91').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeErrorcredit91').innerText = "";
        document.getElementById('productCodeErrorcredit91').style.display = "none";
    }
    
    if (work === '') {
        document.getElementById('productCodeErrorcredit101').innerText = "Please select work order.";
        document.getElementById('productCodeErrorcredit101').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeErrorcredit101').innerText = "";
        document.getElementById('productCodeErrorcredit101').style.display = "none";
    }
    
    if (reoffice === '') {
        document.getElementById('productCodeErrorcredit111').innerText = "Please select registered office.";
        document.getElementById('productCodeErrorcredit111').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeErrorcredit111').innerText = "";
        document.getElementById('productCodeErrorcredit111').style.display = "none";
    }
    
    /*if (serco === '') {
        document.getElementById('productCodeErrorcredit121').innerText = "Please select service code.";
        document.getElementById('productCodeErrorcredit121').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeErrorcredit121').innerText = "";
        document.getElementById('productCodeErrorcredit121').style.display = "none";
    }*/
    
    /*if (hsncode === '') {
        document.getElementById('productCodeErrorcredit131').innerText = "Please select hsn code.";
        document.getElementById('productCodeErrorcredit131').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeErrorcredit131').innerText = "";
        document.getElementById('productCodeErrorcredit131').style.display = "none";
    }*/
    
    if (taxein === '') {
        document.getElementById('productCodeErrorcredit141').innerText = "Please select.";
        document.getElementById('productCodeErrorcredit141').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeErrorcredit141').innerText = "";
        document.getElementById('productCodeErrorcredit141').style.display = "none";
    }
    
    if (yesno === '') {
        document.getElementById('productCodeErrorcredit151').innerText = "Please select.";
        document.getElementById('productCodeErrorcredit151').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeErrorcredit151').innerText = "";
        document.getElementById('productCodeErrorcredit151').style.display = "none";
    }
    
    if (nonyesno === '') {
        document.getElementById('productCodeErrorcredit161').innerText = "Please select.";
        document.getElementById('productCodeErrorcredit161').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeErrorcredit161').innerText = "";
        document.getElementById('productCodeErrorcredit161').style.display = "none";
    }
    
    if (payre11 === '') {
        document.getElementById('productCodeErrorcredit171').innerText = "Please select.";
        document.getElementById('productCodeErrorcredit171').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeErrorcredit171').innerText = "";
        document.getElementById('productCodeErrorcredit171').style.display = "none";
    }
    
    if (fread === '') {
        document.getElementById('productCodeErrorcredit181').innerText = "Please select.";
        document.getElementById('productCodeErrorcredit181').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeErrorcredit181').innerText = "";
        document.getElementById('productCodeErrorcredit181').style.display = "none";
    }
    
    // If no errors, proceed
    if (!showError) {
        $('#exampleModalCenteredit').modal('show'); // Show the next modal (Ensure this modal exists)
    }
}

function editvent() {
	$("#exampleModalCenteredit").modal("hide");
	
	// Validate role code and role description
	 const selectedTaxes = [];
    $('.tax-checkbox1:checked').each(function() {
        selectedTaxes.push($(this).val()); // Add tax_id (value of the checkbox) to the array
    });
    
    // Get unchecked (unselected) tax IDs
        const unselectedTaxes = [];
        $('.tax-checkbox1:not(:checked)').each(function () {
            unselectedTaxes.push($(this).val());  // Add tax_id (value of the checkbox) to the array
        });

    // Join the array into a comma-separated string
    const taxAdd1 = selectedTaxes.join(','); 
    const taxRemoved = unselectedTaxes.length > 0 ? unselectedTaxes.join(',') : null;
    const selectedContract = document.getElementById("cont1").selectedOptions[0]; // Get the selected option
    const contractId1 = selectedContract ? selectedContract.value : ''; // Get the contract_id
    const contractName1 = selectedContract ? selectedContract.textContent : ''; // Get the contract_name
	

	$.ajax({
		url: new URL('/jssl/contract/updatenew', baseUrl), // Move 'const' to the correct place
		type: 'POST',
		dataType: 'json',
		xhrFields: {
			    withCredentials: true
			},
		data: jQuery.param({modified_by:createdById, 
		factory_id: updfacid.value,
		area_no:are1.value,
		bank_details_id:bank1.value,
		bid:bus1.value,
		consignee_id:consig1.value,
		containter_no:connum1.value,
		contract_id:contractId1,
		delivery_condition_id:del1.value,
		epcgno:epog1.value,
		export:exportSelect1.value,
		export_title_text:extitle1.value,
		freight_advance_recovery:fread1.value,
		h_code: hsncode1.value,
		invoice_to_id:into1.value,
		invoice_type_calculation: document.getElementById("intypecal1_hidden").value,
		lot_no:lut1.value,
		non_taxable:nonyesno1.value,
		percentage_value:per1.value,
		product_desc_id:document.getElementById("per0des1_hidden").value,
		regd_office_id:reoffice1.value,
		s_code: serco1.value,
		shipment_mode_id:ship1.value,
		tax_ex_inc:taxein1.value,
		tax_payable:payre111.value,
		taxable:yesno1.value,
		work_id:work1.value,
		taxAdd:taxAdd1,
		contract_name:contractName1,
		con_slno:id.value,
		taxRemoved:taxRemoved
		}),
		success: function (data) {

		    var result = data.message;

		    if (result === "Success") {

		        const popup = $('<div class="popup">Contractor Updated Successfully!</div>')
		            .appendTo('body')
		            .hide()
		            .fadeIn(400);

		        setTimeout(function () {
		            popup.fadeOut(400, function () {
		                $(this).remove();
		                window.location = 'Contractorlist.jsp';
		            });
		        }, 800);

		    }
		    else if (result === "No fields were changed.") {

		        const popup = $('<div class="popup">No fields were changed.</div>')
		            .appendTo('body')
		            .hide()
		            .fadeIn(400);

		        setTimeout(function () {
		            popup.fadeOut(400, function () {
		                $(this).remove();
		                $('#exampleModalCenteredit').modal('hide');
		                $('#exampleModalScrollableEdit').modal('hide');
		            });
		        }, 1000);

		    }
		    else {

		        const errorMessage = data.message || 'Failed to update contractor.';
		        $('#errorMessageup').text(errorMessage);
		        $('#exampleModalCenteredit').modal('hide');
		        $('#exampleModalScrollableEdit').modal('hide');
		        $('#exampleModalCenterDupUP').modal('show');
		    }
		},
		error: function() {
			// Handle AJAX error
			console.error('Request failed.');
		}
	});
}