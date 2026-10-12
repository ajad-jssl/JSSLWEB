const MainPage =  "InvoiceMasters.jsp";
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

document.getElementById("#modalScroll").addEventListener("click", function () {
    // show custom message instead of opening modal
	  const allowed = allowedActions || [];

	if (!allowed.includes("Insert")) {
	  alert(" You do not have permission to Insert.");
	  $('#exampleModalScrollable').modal('hide');
	  return;
	}
	$('#exampleModalScrollable').modal('show');
});

// Fetch selectedFactoryId from sessionStorage
const selectedFactoryId = sessionStorage.getItem('selectedFactoryId');
console.log('selectedFactoryId:', selectedFactoryId);

document.addEventListener("DOMContentLoaded", function () {
	loadActions();
});
// Ensure the ID is available before making the API call
if (selectedFactoryId) {
    fetchUserList(selectedFactoryId);
} else {
    console.error('No factory ID found in sessionStorage.');
}

// Function to fetch the list of users/vendors based on the selected factory ID
async function fetchUserList(selectedFactoryId) {
	fetchtax();
	fetchexptitle();
    try {
        
        // Construct the API URL
        const url = new URL(`/jssl/contract/listcontractnew`, baseUrl);
        url.searchParams.append('factory_id', selectedFactoryId);

        // Fetch vendor data
		const response = await fetch(url,{
						           method: "GET",
						           credentials: "include"   // ✅ Always send JSESSIONID cookie
						       });
        if (!response.ok) throw new Error("Failed to fetch data");
        const json = await response.json();

        // Prepare table content
        let tableContent = `
            <thead>
                <tr>
                    <th>Contract Name</th>
                    <th>Business Unit</th>
                    <th>Edit</th>
                </tr>
            </thead>
            <tbody>
        `;

        json.Data.forEach(item => {
            tableContent += `
                <tr>
                    <td>${item.contract_name}</td>
                    <td>${item.businessUnitName}</td>
                    <td><i class="fa fa-pen" onclick="editRecord('${item.con_slno}')"></i></td>
                </tr>
            `;
        });

        tableContent += `</tbody>`;

        // Update table content
        $("#tableID").html(tableContent);

        // Initialize DataTable with custom configuration
        $("#tableID").DataTable({
            dom: 'Bfrtip',
            scrollX: true,
            info: false,
            paging: false,
            destroy: true, // Prevent duplication
            buttons: [
                {
                    extend: 'excel',
                    text: 'Export to Excel',
                    title: 'List',
                },
            ]
        });
    } catch (error) {
        console.error('Error fetching vendor data:', error);
    }
}

document.addEventListener("DOMContentLoaded", function () {
    const selectedFactoryId = sessionStorage.getItem("selectedFactoryId"); // Get factory_id from sessionStorage
    if (selectedFactoryId) {
        fetchSalework(selectedFactoryId);
        fetchSalebank(selectedFactoryId);
        fetchSalebusunit(selectedFactoryId);
        fetchhsn(selectedFactoryId);
        fetchservice(selectedFactoryId);
        fetchShipping(selectedFactoryId);
        fetchdelivery(selectedFactoryId);
        fetchcont(selectedFactoryId);
        fetchorg(selectedFactoryId);
        fetchinvoiceto(selectedFactoryId);
        fetchconname(selectedFactoryId);
        
    } else {
        console.error("No factory ID found in sessionStorage.");
    }
});

async function fetchSalework() {
    try {
        
        // Construct the API URL properly
        const url = new URL(`/jssl/contract/listworkordernew`, baseUrl);
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
        const selectElement = document.getElementById("work");

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
		initSelect2('work', 'exampleModalScrollable', 'Select work order'); // ADD
    } catch (error) {
        console.error("Error fetching sale order types:", error);
    }
}

async function fetchSalebank() {
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
        const selectElement = document.getElementById("bank");

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

async function fetchSalebusunit() {
    try {
        
        // Construct the API URL properly
        const url = new URL(`/jssl/contract/listbusinessunitnew`, baseUrl);
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
        const selectElement = document.getElementById("bus");

        // Clear existing options
        selectElement.innerHTML = `<option value="">Select Business Unit</option>`;

        // Populate dropdown options using SalesOrderTypeDetails array
        json.Data.forEach((type) => {
            if (type.business_unit_id && type.business_unit_name) { 
			let bindaddress = type.business_unit_name +',' +type.location +'('+type.gst_number +')';
				
				// Ensure both values exist
                const option = document.createElement("option");
                option.value = type.business_unit_id; // Backend keeps saleorder_id
                option.textContent =bindaddress; // Display saleorder_typename
                selectElement.appendChild(option);
            }
        });
		initSelect2('bus', 'exampleModalScrollable', 'Select Business Unit'); // ADD
    } catch (error) {
        console.error("Error fetching sale order types:", error);
    }
}

async function fetchhsn() {
    try {
        
        // Construct the API URL properly
        const url = new URL(`/jssl/master/listHsncodemasternew`, baseUrl);
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
        const selectElement = document.getElementById("hsncode");

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

async function fetchservice() {
    try {
        
        // Construct the API URL properly
        const url = new URL(`/jssl/master/listservicecodemasternew`, baseUrl);
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
        const selectElement = document.getElementById("serco");

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

async function fetchShipping() {
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
        const selectElement = document.getElementById("ship");

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

async function fetchdelivery() {
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
        const selectElement = document.getElementById("del");

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

async function fetchcont() {
    try {
        const factoryId = sessionStorage.getItem("selectedFactoryId");
        console.log("factoryId =", factoryId);
		
        const url = new URL("/jssl/contractfrom/g2/listcontractorsbasedonfactory", baseUrl);
        url.searchParams.set("factoryId", factoryId);

        const response = await fetch(url, {
            method: "GET",
            credentials: "include"
        });

        if (!response.ok) {
            throw new Error("Failed to fetch contractors");
        }

        const json = await response.json();

        if (!json.Data || json.Data.length === 0) {
            console.warn("No contractors found.");
            return;
        }

        const selectElement = document.getElementById("cont");
        selectElement.innerHTML = `<option value="">Select contractor</option>`;

        json.Data.forEach(contractor => {
            if (contractor.contract_id && contractor.contract_name) {
                const option = document.createElement("option");
                option.value = contractor.contract_id;
                option.textContent = contractor.contract_name;
                selectElement.appendChild(option);
            }
        });
		initSelect2('cont', 'exampleModalScrollable', 'Select contractor');

    } catch (error) {
        console.error("Error fetching contractors:", error);
    }
}

async function fetchtax() {
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

        const dropdownMenu = document.getElementById("taxDropdownMenu");
        dropdownMenu.innerHTML = ""; // Clear previous options

        json.Data.forEach((tax) => {
            if (tax.tax_id && tax.tax_name) {
                const listItem = document.createElement("li");
				taxnameper = tax.tax_name+'-'+tax.tax_per +'%';
                listItem.innerHTML = `
                    <label class="dropdown-item">
                        <input type="checkbox" class="tax-checkbox" value="${tax.tax_id}" data-name="${tax.tax_name}">
                        ${taxnameper}
                    </label>`;
                dropdownMenu.appendChild(listItem);
            }
        });

        // Event listener to update button text when checkboxes are selected
        dropdownMenu.addEventListener("change", function () {
            updateSelectedTaxes();
        });

    } catch (error) {
        console.error("Error fetching tax data:", error);
    }
}

// Function to update dropdown button text
function updateSelectedTaxes() {
    const selected = [];
    document.querySelectorAll(".tax-checkbox:checked").forEach((checkbox) => {
        selected.push(checkbox.getAttribute("data-name"));
    });

    document.getElementById("taxDropdown").textContent = selected.length > 0 ? selected.join(", ") : "Select tax";
}

async function fetchorg() {
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
        const selectElement = document.getElementById("reoffice");

        // Clear existing options
        selectElement.innerHTML = `<option value="">Select</option>`;

		// Populate dropdown options using SalesOrderTypeDetails array
		        json.Data.forEach((type) => {
		            if (type.org_id && type.org_name) { 
					let bindorg = type.org_name+'-'+type.registered_address +' ,'+type.location +' '+'('+type.gst_number +')';
        // Populate dropdown options using SalesOrderTypeDetails array
       /* json.Data.forEach((type) => {
            if (type.org_id && type.org_name) { // Ensure both values exist*/
                const option = document.createElement("option");
                option.value = type.org_id; // Backend keeps saleorder_id
                option.textContent = bindorg; // Display saleorder_typename
                selectElement.appendChild(option);
            }
        });
    } catch (error) {
        console.error("Error fetching sale order types:", error);
    }
}

async function fetchinvoiceto() {
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

        const selectElement = document.getElementById("into");

        // reset dropdown
        selectElement.innerHTML = `<option value="">Select invoice to</option>`;

        json.InvoiceAddress.forEach((type) => {

            // ✅ only show verified records
            if (type.is_verified == 1 && type.id && type.address) {

                const option = document.createElement("option");
                option.value = type.id;
                option.textContent = type.address;

                selectElement.appendChild(option);
            }
        });
		initSelect2('into', 'exampleModalScrollable', 'Select invoice to'); // ADD

    } catch (error) {
        console.error("Error fetching invoice addresses:", error);
    }
}

async function fetchconname() {
    try {

        const url = new URL(`/jssl/invoiceConsigneeAddress/getConsigneeAddressNew`, baseUrl);

        const response = await fetch(url, {
            method: "GET",
            credentials: "include"
        });

        if (!response.ok) throw new Error("Failed to fetch consignee addresses");

        const json = await response.json();

        if (json.status !== "yes" || !json.ConsigneeAddress?.length) {
            console.warn("No consignee addresses found.");
            return;
        }

        const selectElement = document.getElementById("consig");

        selectElement.innerHTML = `<option value="">Select</option>`;

        json.ConsigneeAddress.forEach((type) => {

            // ✅ only verified records
            if (type.is_verified == 1 && type.id && type.address) {

                const option = document.createElement("option");
                option.value = type.id;
                option.textContent = type.address;

                selectElement.appendChild(option);
            }
			
        });
		initSelect2('consig', 'exampleModalScrollable', 'Select'); // ADD

    } catch (error) {
        console.error("Error fetching consignee addresses:", error);
    }
}

async function fetchexptitle() {
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
        const selectElement = document.getElementById("extitle");

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

function openModalAdd() {
    var username = document.getElementById('cont').value.trim();
    var password = document.getElementById('bus').value.trim();
    var code = document.getElementById('intypecal').value.trim();
    var state = document.getElementById('per').value.trim();
    var state1 = document.getElementById('into').value.trim();
    var pan = document.getElementById('consig').value.trim();
    var gst = document.getElementById('ship').value.trim();
    var stateDropdown = document.getElementById('del').value.trim();
    //var per0des = document.getElementById('per0des').value.trim();
    var bank = document.getElementById('bank').value.trim();
    var work = document.getElementById('work').value.trim();
    var reoffice = document.getElementById('reoffice').value.trim();
	var factory = document.getElementById('factory').value.trim();
	
    //var serco = document.getElementById('serco').value.trim();
    //var hsncode = document.getElementById('hsncode').value.trim();
    var taxein = document.getElementById('taxein').value.trim();
    var yesno = document.getElementById('yesno').value.trim();
    var nonyesno = document.getElementById('nonyesno').value.trim();
    var payre11 = document.getElementById('payre11').value.trim();
    var fread = document.getElementById('fread').value.trim();
    var showError = false; // Initialize showError variable
    var taxCheckboxes = document.querySelectorAll('.tax-checkbox:checked');
    if (taxCheckboxes.length === 0) {
        document.getElementById('productCodeErrorcredit19').innerText = "Please select at least one tax.";
        document.getElementById('productCodeErrorcredit19').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeErrorcredit19').innerText = "";
        document.getElementById('productCodeErrorcredit19').style.display = "none";
    }

    // Username Validation
    if (username === '') {
        document.getElementById('productCodeErrorcredit').innerText = "Please select contractor.";
        document.getElementById('productCodeErrorcredit').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeErrorcredit').innerText = "";
        document.getElementById('productCodeErrorcredit').style.display = "none";
    }
    
    // Password Validation
    if (password === '') {
        document.getElementById('productCodeErrorcredit1').innerText = "Please select Business unit.";
        document.getElementById('productCodeErrorcredit1').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeErrorcredit1').innerText = "";
        document.getElementById('productCodeErrorcredit1').style.display = "none";
    }
    
    if (code === '') {
        document.getElementById('productCodeErrorcredit2').innerText = "Please enter invoice type calculation .";
        document.getElementById('productCodeErrorcredit2').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeErrorcredit2').innerText = "";
        document.getElementById('productCodeErrorcredit2').style.display = "none";
    }
    
    if (state === '') {
        document.getElementById('productCodeErrorcredit3').innerText = "Please enter percentage.";
        document.getElementById('productCodeErrorcredit3').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeErrorcredit3').innerText = "";
        document.getElementById('productCodeErrorcredit3').style.display = "none";
    }
    
    if (state1 === '') {
        document.getElementById('productCodeErrorcredit4').innerText = "Please select invoice to.";
        document.getElementById('productCodeErrorcredit4').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeErrorcredit4').innerText = "";
        document.getElementById('productCodeErrorcredit4').style.display = "none";
    }
    
    if (pan === '') {
        document.getElementById('productCodeErrorcredit5').innerText = "Please select address.";
        document.getElementById('productCodeErrorcredit5').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeErrorcredit5').innerText = "";
        document.getElementById('productCodeErrorcredit5').style.display = "none";
    }
    
    if (gst === '') {
        document.getElementById('productCodeErrorcredit6').innerText = "Please select shipment mode.";
        document.getElementById('productCodeErrorcredit6').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeErrorcredit6').innerText = "";
        document.getElementById('productCodeErrorcredit6').style.display = "none";
    }
    
    if (stateDropdown === '') {
        document.getElementById('productCodeErrorcredit7').innerText = "Please select delivery condition.";
        document.getElementById('productCodeErrorcredit7').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeErrorcredit7').innerText = "";
        document.getElementById('productCodeErrorcredit7').style.display = "none";
    }
    
    /*if (per0des === '') {
        document.getElementById('productCodeErrorcredit8').innerText = "Please enter description.";
        document.getElementById('productCodeErrorcredit8').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeErrorcredit8').innerText = "";
        document.getElementById('productCodeErrorcredit8').style.display = "none";
    }*/
    
    if (bank === '') {
        document.getElementById('productCodeErrorcredit9').innerText = "Please select bank.";
        document.getElementById('productCodeErrorcredit9').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeErrorcredit9').innerText = "";
        document.getElementById('productCodeErrorcredit9').style.display = "none";
    }
    
    if (work === '') {
        document.getElementById('productCodeErrorcredit10').innerText = "Please select work order.";
        document.getElementById('productCodeErrorcredit10').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeErrorcredit10').innerText = "";
        document.getElementById('productCodeErrorcredit10').style.display = "none";
    }
    
    if (reoffice === '') {
        document.getElementById('productCodeErrorcredit11').innerText = "Please select registered office.";
        document.getElementById('productCodeErrorcredit11').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeErrorcredit11').innerText = "";
        document.getElementById('productCodeErrorcredit11').style.display = "none";
    }
    
	if (factory === '') {
	    document.getElementById('factoryerror').innerText = "Please select any factory.";
	    document.getElementById('factoryerror').style.display = "inline-block";
	    showError = true;
	} else {
	    document.getElementById('factoryerror').innerText = "";
	    document.getElementById('factoryerror').style.display = "none";
	}
    /*if (serco === '') {
        document.getElementById('productCodeErrorcredit12').innerText = "Please select service code.";
        document.getElementById('productCodeErrorcredit12').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeErrorcredit12').innerText = "";
        document.getElementById('productCodeErrorcredit12').style.display = "none";
    }*/
    
    /*if (hsncode === '') {
        document.getElementById('productCodeErrorcredit13').innerText = "Please select hsn code.";
        document.getElementById('productCodeErrorcredit13').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeErrorcredit13').innerText = "";
        document.getElementById('productCodeErrorcredit13').style.display = "none";
    }*/
    
    if (taxein === '') {
        document.getElementById('productCodeErrorcredit14').innerText = "Please select.";
        document.getElementById('productCodeErrorcredit14').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeErrorcredit14').innerText = "";
        document.getElementById('productCodeErrorcredit14').style.display = "none";
    }
    
    if (yesno === '') {
        document.getElementById('productCodeErrorcredit15').innerText = "Please select.";
        document.getElementById('productCodeErrorcredit15').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeErrorcredit15').innerText = "";
        document.getElementById('productCodeErrorcredit15').style.display = "none";
    }
    
    if (nonyesno === '') {
        document.getElementById('productCodeErrorcredit16').innerText = "Please select.";
        document.getElementById('productCodeErrorcredit16').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeErrorcredit16').innerText = "";
        document.getElementById('productCodeErrorcredit16').style.display = "none";
    }
    
    if (payre11 === '') {
        document.getElementById('productCodeErrorcredit17').innerText = "Please select.";
        document.getElementById('productCodeErrorcredit17').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeErrorcredit17').innerText = "";
        document.getElementById('productCodeErrorcredit17').style.display = "none";
    }
    
    if (fread === '') {
        document.getElementById('productCodeErrorcredit18').innerText = "Please select.";
        document.getElementById('productCodeErrorcredit18').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeErrorcredit18').innerText = "";
        document.getElementById('productCodeErrorcredit18').style.display = "none";
    }
    
    // If no errors, proceed
    if (!showError) {
        $('#exampleModalCenter66').modal('show'); // Show the next modal (Ensure this modal exists)
    }
}

function addevent() {
	
	$("#exampleModalCenter66").modal("hide");
	// Validate role code and role description
	 const selectedTaxes = [];
    $('.tax-checkbox:checked').each(function() {
        selectedTaxes.push($(this).val()); // Add tax_id (value of the checkbox) to the array
    });

    // Join the array into a comma-separated string
    const taxAdd = selectedTaxes.join(','); 
    
    const selectedContract = document.getElementById("cont").selectedOptions[0]; // Get the selected option
    const contractId = selectedContract ? selectedContract.value : ''; // Get the contract_id
    const contractName = selectedContract ? selectedContract.textContent : ''; // Get the contract_name
	const factory =  document.getElementById('factory').value; 

	$.ajax({
		url: new URL('/jssl/contract/addnew', baseUrl), // Move 'const' to the correct place
		type: 'POST',
		dataType: 'json',
		xhrFields: {
			    withCredentials: true
			},
		data: jQuery.param({created_by:createdById, 
		factory_id: factory,
		area_no:are.value,
		bank_details_id:bank.value,
		bid:bus.value,
		consignee_id:consig.value,
		containter_no:connum.value,
		contract_id:contractId,
		delivery_condition_id:del.value,
		epcgno:epog.value,
		export:exportSelect.value,
		export_title_text:extitle.value,
		freight_advance_recovery:fread.value,
		h_code: hsncode.value,
		invoice_to_id:into.value,
		invoice_type_calculation:2,
		lot_no:lut.value,
		non_taxable:nonyesno.value,
		percentage_value:per.value,
		product_desc_id:1,
		regd_office_id:reoffice.value,
		s_code: serco.value,
		shipment_mode_id:ship.value,
		tax_ex_inc:taxein.value,
		tax_payable:payre11.value,
		taxable:yesno.value,
		work_id:work.value,
		taxAdd:taxAdd,
		contract_name:contractName
		}),
		success: function(data) {
			var result = data.message; // No need to stringify

			if (result === "Success") {
				// Store permissions in sessionStorage
				const popup = $('<div class="popup">Contractor Created Successfully!</div>')
					.appendTo('body').hide().fadeIn(400);

				setTimeout(function() {
					popup.fadeOut(400, function() {
						$(this).remove();
						window.location = 'Contractorlist.jsp'; // Redirect to role list page
					});
				}, 800);
			} else {
				 const errorMessage = data.message || 'Failed to create contractor.';
                $('#errorMessage').text(errorMessage); // Set the error message dynamically
                $('#exampleModalCenterDup').modal('show'); // Show the modal with the error message
			}
		},
		error: function() {
			// Handle AJAX error
			console.error('Request failed.');
		}
	});
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
            const departmentSelect = document.getElementById('factory');
            
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


// Reusable Select2 initializer — safe to call multiple times on the same select
function initSelect2(selectId, modalId, placeholder) {
    var $el = $('#' + selectId);
    if ($el.hasClass('select2-hidden-accessible')) {
        $el.select2('destroy'); // rebuild so newly fetched options are picked up
    }
    $el.select2({
        dropdownParent: $('#' + modalId), // required so it renders correctly inside a Bootstrap modal
        width: '100%',
        placeholder: placeholder,
        allowClear: false
    });
}