document.addEventListener("DOMContentLoaded", async function () {
    await loadActions();

    if (!allowedActions.includes("view")) {
        blockUI();   // 🔒 permanent block
        return;
    }

    
});


const MainPage = 'Invoice_audit.jsp';
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


document.addEventListener("DOMContentLoaded", function() {
	
    fetch(new URL('/jssl/history/invoice', baseUrl1), {
        credentials: "include"
    })
    .then(response => response.json())
    .then(data => {

        const tableBody = document.querySelector("#TableID2 tbody");
        tableBody.innerHTML = ''; // Clear old rows

        data.forEach((item, index) => {
            const row = document.createElement('tr');

            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${item.code || ''}</td>
                <td>${item.address || ''}</td>
                <td>${item.city || ''}</td>
                <td>${item.district || ''}</td>
                <td>${item.state_name || ''}</td>
                <td>${item.country_name || ''}</td>
                <td>${item.pin_no || ''}</td>
                <td>${item.gst_no || ''}</td>
                <td>${item.pan_no || ''} </td>
                <td>${item.createdby || ''}</td>
                <td>${item.created_date || ''}</td>
				<td>${item.modifiedby || ''}</td>
                <td>${item.modified_date || ''}</td>
                <td>${item.deletedby || ''}</td>
				<td>${item.deleted_date || ''}</td>
                <td>${item.action || ''}</td>
                <td>${item.transaction_date || ''}</td>
            `;

            tableBody.appendChild(row);
        });

    })
    .catch(error => console.error('Error fetching data:', error));
});

document.addEventListener("DOMContentLoaded", function() {
	
    fetch(new URL('/jssl/history/consignee', baseUrl1), {
        credentials: "include"
    })
    .then(response => response.json())
    .then(data => {

        const tableBody = document.querySelector("#TableID3 tbody");
        tableBody.innerHTML = ''; // Clear old rows

        data.forEach((item, index) => {
            const row = document.createElement('tr');

            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${item.code || ''}</td>
                <td>${item.address || ''}</td>
                <td>${item.city || ''}</td>
                <td>${item.district || ''}</td>
                <td>${item.state_name || ''}</td>
                <td>${item.country_name || ''}</td>
                <td>${item.pin_no || ''}</td>
                <td>${item.gst_no || ''}</td>
                <td>${item.pan_no || ''}</td>
                <td>${item.createdby || ''}</td>
                <td>${item.created_date || ''}</td>
				<td>${item.modifiedby || ''}</td>
                <td>${item.modified_date || ''}</td>
                <td>${item.deletedby || ''}</td>
				<td>${item.deleted_date || ''}</td>
                <td>${item.action || ''}</td>
                <td>${item.transaction_date || ''}</td>
            `;

            tableBody.appendChild(row);
        });

    })
    .catch(error => console.error('Error fetching data:', error));
});

document.addEventListener("DOMContentLoaded", function() {
	
    fetch(new URL('/jssl/history/bank', baseUrl1), {
        credentials: "include"
    })
    .then(response => response.json())
    .then(data => {

        const tableBody = document.querySelector("#TableID4 tbody");
        tableBody.innerHTML = ''; // Clear old rows

        data.forEach((item, index) => {
            const row = document.createElement('tr');

            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${item.business_unit_name || ''}</td>
                <td>${item.bank_name || ''}</td>
                <td>${item.account_number || ''}</td>
                <td>${item.branch_address || ''}</td>
                <td>${item.branch_code || ''}</td>
                <td>${item.swift_code || ''}</td>
                <td>${item.ifsc_code || ''}</td>
                <td>${item.city || ''}</td>
                <td>${item.state_name || ''}</td>
				<td>${item.country_name || ''}</td>
                <td>${item.createdby || ''}</td>
                <td>${item.created_date || ''}</td>
				<td>${item.modifiedby || ''}</td>
                <td>${item.modified_date || ''}</td>
                <td>${item.deletedby || ''}</td>
				<td>${item.deleted_date || ''}</td>
                <td>${item.action || ''}</td>
                <td>${item.transaction_date || ''}</td>
            `;

            tableBody.appendChild(row);
        });

    })
    .catch(error => console.error('Error fetching data:', error));
});

document.addEventListener("DOMContentLoaded", function() {
	
    fetch(new URL('/jssl/history/tax', baseUrl1), {
        credentials: "include"
    })
    .then(response => response.json())
    .then(data => {

        const tableBody = document.querySelector("#TableID5 tbody");
        tableBody.innerHTML = ''; // Clear old rows

        data.forEach((item, index) => {
            const row = document.createElement('tr');

            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${item.tax_name || ''}</td>
                <td>${item.tax_per || ''}</td>
                <td>${item.createdby || ''}</td>
                <td>${item.created_date || ''}</td>
				<td>${item.modifiedby || ''}</td>
                <td>${item.modified_date || ''}</td>
                <td>${item.deletedby || ''}</td>
				<td>${item.deleted_date || ''}</td>
                <td>${item.action || ''}</td>
                <td>${item.transaction_date || ''}</td>
            `;

            tableBody.appendChild(row);
        });

    })
    .catch(error => console.error('Error fetching data:', error));
});

document.addEventListener("DOMContentLoaded", function() {
	
    fetch(new URL('/jssl/history/shipment-delivery', baseUrl1), {
        credentials: "include"
    })
    .then(response => response.json())
    .then(data => {

        const tableBody = document.querySelector("#TableID6 tbody");
        tableBody.innerHTML = ''; // Clear old rows

        data.forEach((item, index) => {
            const row = document.createElement('tr');

            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${item.shipment_mode || ''}</td>
                <td>${item.delivery_condition || ''}</td>
                <td>${item.createdby || ''}</td>
                <td>${item.created_date || ''}</td>
				<td>${item.modifiedby || ''}</td>
                <td>${item.modified_date || ''}</td>
                <td>${item.deletedby || ''}</td>
				<td>${item.deleted_date || ''}</td>
                <td>${item.action || ''}</td>
                <td>${item.transaction_date || ''}</td>
            `;

            tableBody.appendChild(row);
        });

    })
    .catch(error => console.error('Error fetching data:', error));
});

document.addEventListener("DOMContentLoaded", function() {
	
    fetch(new URL('/jssl/history/workorder', baseUrl1), {
        credentials: "include"
    })
    .then(response => response.json())
    .then(data => {

        const tableBody = document.querySelector("#TableID8 tbody");
        tableBody.innerHTML = ''; // Clear old rows

        data.forEach((item, index) => {
            const row = document.createElement('tr');

            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${item.workorder_no || ''}</td>
                <td>${item.work_date || ''}</td>
                <td>${item.createdby || ''}</td>
                <td>${item.created_date || ''}</td>
				<td>${item.modifiedby || ''}</td>
                <td>${item.modified_date || ''}</td>
                <td>${item.deletedby || ''}</td>
				<td>${item.deleted_date || ''}</td>
                <td>${item.action || ''}</td>
                <td>${item.transaction_date || ''}</td>
            `;

            tableBody.appendChild(row);
        });

    })
    .catch(error => console.error('Error fetching data:', error));
});

document.addEventListener("DOMContentLoaded", function() {
	
    fetch(new URL('/jssl/history/gst', baseUrl1), {
        credentials: "include"
    })
    .then(response => response.json())
    .then(data => {

        const tableBody = document.querySelector("#TableID9 tbody");
        tableBody.innerHTML = ''; // Clear old rows

        data.forEach((item, index) => {
            const row = document.createElement('tr');

            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${item.sap_bucode || ''}</td>
                <td>${item.state_gstno || ''}</td>
                <td>${item.createdby || ''}</td>
                <td>${item.created_date || ''}</td>
				<td>${item.modifiedby || ''}</td>
                <td>${item.modified_date || ''}</td>
                <td>${item.deletedby || ''}</td>
				<td>${item.deleted_date || ''}</td>
                <td>${item.action || ''}</td>
                <td>${item.transaction_date || ''}</td>
            `;

            tableBody.appendChild(row);
        });

    })
    .catch(error => console.error('Error fetching data:', error));
});

document.addEventListener("DOMContentLoaded", function() {
	
    fetch(new URL('/jssl/history/invoice-type', baseUrl1), {
        credentials: "include"
    })
    .then(response => response.json())
    .then(data => {

        const tableBody = document.querySelector("#TableID10 tbody");
        tableBody.innerHTML = ''; // Clear old rows

        data.forEach((item, index) => {
            const row = document.createElement('tr');

            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${item.remarks_type || ''}</td>
                <td>${item.createdby || ''}</td>
                <td>${item.created_date || ''}</td>
				<td>${item.modifiedby || ''}</td>
                <td>${item.modified_date || ''}</td>
                <td>${item.deletedby || ''}</td>
				<td>${item.deleted_date || ''}</td>
                <td>${item.action || ''}</td>
                <td>${item.transaction_date || ''}</td>
            `;

            tableBody.appendChild(row);
        });

    })
    .catch(error => console.error('Error fetching data:', error));
});

document.addEventListener("DOMContentLoaded", function() {
	
    fetch(new URL('/jssl/history/milestone-contract', baseUrl1), {
        credentials: "include"
    })
    .then(response => response.json())
    .then(data => {

        const tableBody = document.querySelector("#milestoneHistoryTable tbody");
        tableBody.innerHTML = ''; // Clear old rows

        data.forEach((item, index) => {
            const row = document.createElement('tr');

            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${item.contract_name || ''}</td>
				<td>${item.milestone_code || ''}</td>
				<td>${item.milestone_name || ''}</td>
                <td>${item.createdby || ''}</td>
                <td>${item.created_date || ''}</td>
				<td>${item.modifiedby || ''}</td>
                <td>${item.modified_date || ''}</td>
                <td>${item.deletedby || ''}</td>
				<td>${item.deleted_date || ''}</td>
                <td>${item.action || ''}</td>
                <td>${item.transaction_date || ''}</td>
            `;

            tableBody.appendChild(row);
        });

    })
    .catch(error => console.error('Error fetching data:', error));
});

// ============================================================
// CONTRACT HISTORY - Factory + Contract filter with table show
// ============================================================

let allContractHistoryData = []; // Store all data globally

document.addEventListener("DOMContentLoaded", function () {

    // STEP 1: Load Factory Dropdown
    fetch(new URL('/jssl/factory/getAllFactoryList', baseUrl1), {
        credentials: "include"
    })
    .then(response => response.json())
    .then(data => {
        const factorySelect = document.getElementById('factory');
        factorySelect.innerHTML = `<option value="">Select Factory</option>
                                   <option value="ALL">ALL</option>`;

        if (Array.isArray(data.FactoryDetails)) {
            data.FactoryDetails.forEach(factory => {
                const option = document.createElement('option');
                option.value = factory.id;
                option.textContent = factory.factory_name;
                factorySelect.appendChild(option);
            });
        } else {
            console.error("FactoryDetails is not an array:", data.FactoryDetails);
        }
    })
    .catch(error => console.error('Error fetching factory:', error));


    // STEP 2: Factory Change → Load Contracts + Reset table
	document.getElementById('factory').addEventListener('change', function () {
	    const factoryId = this.value;
	    const contractSelect = document.getElementById('selectContract');

	    contractSelect.innerHTML = '<option value="">Select Contract</option>';
	    document.querySelector("#TableID tbody").innerHTML = '';
	    $("#container1").hide();

	    if (!factoryId) return;

	    fetch(new URL(`/jssl/contracts/by-factory?factoryId=${factoryId}`, baseUrl1), {
	        credentials: "include"
	    })
	    .then(response => response.json())
	    .then(data => {
	        // ✅ Add ALL option at the top
	        const allOption = document.createElement('option');
	        allOption.value = "ALL";
	        allOption.textContent = "ALL";
	        contractSelect.appendChild(allOption);

	        data.forEach(contract => {
	            const option = document.createElement('option');
	            option.value = contract.contract_id;
	            option.textContent = contract.contract_name;
	            contractSelect.appendChild(option);
	        });
	    })
	    .catch(error => console.error('Error fetching contracts:', error));
	});


    // STEP 3: Contract Change → Fetch history and populate table
	document.getElementById('selectContract').addEventListener('change', function () {
	    const selectedContractId = this.value;
	    const tableBody = document.querySelector("#TableID tbody");
	    tableBody.innerHTML = '';

	    if (!selectedContractId) {
	        $("#container1").hide();
	        return;
	    }

	    $("#container1").show();

	    fetch(new URL('/jssl/history/contract', baseUrl1), {
	        credentials: "include"
	    })
	    .then(response => response.json())
	    .then(data => {
	        // ✅ If ALL selected, skip filtering — show everything
	        const filtered = selectedContractId === "ALL"
	            ? data
	            : data.filter(item => String(item.contract_id) === String(selectedContractId));

	        if (filtered.length === 0) {
	            tableBody.innerHTML = `<tr><td colspan="28" class="text-center">No records found</td></tr>`;
	            return;
	        }

	        filtered.forEach((item, index) => {
	            const row = document.createElement('tr');
	            row.innerHTML = `
	                <td>${index + 1}</td>
	                <td>${item.contract_name || ''}</td>
	                <td>${item.invoice_address || ''}</td>
	                <td>${item.consignee_address || ''}</td>
	                <td>${item.registered_address || ''}</td>
	                <td>${item.shipment_mode || ''}</td>
	                <td>${item.delivery_condition || ''}</td>
	                <td>${item.workorder_no || ''}</td>
	                <td>${item.bank_name || ''}</td>
	                <td>${item.percentage_value || ''}</td>
	                <td>${item.export || ''}</td>
	                <td>${item.s_code_value || ''}</td>
	                <td>${item.hsn_code || ''}</td>
	                <td>${item.business_unit_name || ''}</td>
	                <td>${item.taxable || ''}</td>
	                <td>${item.export || ''}</td>
	                <td>${item.non_taxable || ''}</td>
	                <td>${item.tax_ex_inc || ''}</td>
	                <td>${item.freight_advance_recovery || ''}</td>
	                <td>${item.createdby || ''}</td>
	                <td>${item.created_date || ''}</td>
	                <td>${item.modifiedby || ''}</td>
	                <td>${item.modified_date || ''}</td>
	                <td>${item.deletedby || ''}</td>
	                <td>${item.deleted_date || ''}</td>
	                <td>${item.action || ''}</td>
	                <td>${item.transaction_date || ''}</td>
	                <td>${item.factory || ''}</td>
	            `;
	            tableBody.appendChild(row);
	        });
	    })
	    .catch(error => console.error('Error fetching contract history:', error));
	});

});

document.addEventListener("DOMContentLoaded", function () {

    // STEP 1: Load Factory Dropdown
    fetch(new URL('/jssl/factory/getAllFactoryList', baseUrl1), {
        credentials: "include"
    })
    .then(response => response.json())
    .then(data => {
        const factorySelect = document.getElementById('factory11');
        factorySelect.innerHTML = `<option value="">Select Factory</option>
                                   <option value="ALL">ALL</option>`;

        if (Array.isArray(data.FactoryDetails)) {
            data.FactoryDetails.forEach(factory => {
                const option = document.createElement('option');
                option.value = factory.id;
                option.textContent = factory.factory_name;
                factorySelect.appendChild(option);
            });
        }
    })
    .catch(error => console.error('Error fetching factory:', error));


    // STEP 2: Factory Change → Load Contracts
    document.getElementById("factory11").addEventListener("change", function () {
        const factoryId = this.value;
        const contractDropdown = document.getElementById("selectContract12");
        const lotDropdown = document.getElementById("selectLot12");

        contractDropdown.innerHTML = `<option value="">Select Contract</option>`;
        lotDropdown.innerHTML = `<option value="">Select LOT</option>`;
        document.querySelector("#container12Table tbody").innerHTML = '';

        if (!factoryId) return;

        // Pass factoryId as-is (ALL or specific id) — backend handles both
        fetch(new URL(`/jssl/contracts/by-factory-packing?factoryId=${factoryId}`, baseUrl1), {
            credentials: "include"
        })
        .then(res => res.json())
        .then(data => {
            // Always add ALL at top
            const allOption = document.createElement("option");
            allOption.value = "ALL";
            allOption.textContent = "ALL";
            contractDropdown.appendChild(allOption);

            data.forEach(contract => {
                const option = document.createElement("option");
                option.value = contract.contract_id;
                option.textContent = contract.contract_name;
                contractDropdown.appendChild(option);
            });
        })
        .catch(err => console.error("Error loading contracts:", err));
    });


    // STEP 3: Contract Change → Load Lots
    document.getElementById("selectContract12").addEventListener("change", function () {
        const contractId = this.value;
        const factoryId = document.getElementById("factory11").value;
        const lotDropdown = document.getElementById("selectLot12");

        lotDropdown.innerHTML = `<option value="">Select LOT</option>`;
        document.querySelector("#container12Table tbody").innerHTML = '';

        if (!contractId) return;

        // If ALL contracts → fetch lots by factory, else fetch by contract
        const fetchUrl = contractId === "ALL"
            ? new URL(`/jssl/lots/by-factory?factoryId=${factoryId === "ALL" ? "all" : factoryId}`, baseUrl1)
            : new URL(`/jssl/lots/by-contract?contractId=${contractId}`, baseUrl1);

        fetch(fetchUrl, { credentials: "include" })
        .then(res => res.json())
        .then(data => {
            // Always add ALL at top
            const allOption = document.createElement("option");
            allOption.value = "ALL";
            allOption.textContent = "ALL";
            lotDropdown.appendChild(allOption);

            data.forEach(lot => {
                const option = document.createElement("option");
                option.value = lot.load_id;
                option.textContent = lot.load_id;
                lotDropdown.appendChild(option);
            });
        })
        .catch(err => console.error("Error loading lots:", err));
    });


    // STEP 4: Lot Change → Fetch Table Data
    document.getElementById("selectLot12").addEventListener("change", function () {
        const factoryId = document.getElementById("factory11").value;
        const contractId = document.getElementById("selectContract12").value;
        const loadId = this.value;
        const tableBody = document.querySelector("#container12Table tbody");

        tableBody.innerHTML = '';

        if (!factoryId || !contractId || !loadId) return;

        const params = new URLSearchParams({
            factoryId: factoryId === "ALL" ? "all" : factoryId,
            contractId: contractId === "ALL" ? "all" : contractId,
            loadId: loadId === "ALL" ? "all" : loadId
        });

        fetch(new URL(`/jssl/history/invoice/adv?${params.toString()}`, baseUrl1), {
            credentials: "include"
        })
        .then(res => res.json())
        .then(data => {
            if (!data || data.length === 0) {
                tableBody.innerHTML = `<tr><td colspan="19" class="text-center">No records found</td></tr>`;
                return;
            }

            data.forEach((item, index) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${item.contract_name || ''}</td>
                    <td>${item.load_id || ''}</td>
                    <td>${item.invoice_no || ''}</td>
                    <td>${item.product_desc || ''}</td>
                    <td>${item.invoice_to || ''}</td>
                    <td>${item.consignee_add || ''}</td>
                    <td>${item.shipment_mode || ''}</td>
                    <td>${item.delivery_condition || ''}</td>
                    <td>${item.workorder_no || ''}</td>
                    <td>${item.bank_name || ''}</td>
                    <td>${item.export || ''}</td>
                    <td>${item.s_code_value || ''}</td>
                    <td>${item.hsn_code || ''}</td>
                    <td>${item.reference_no || ''}</td>
                    <td>${item.createdby || ''}</td>
                    <td>${item.transaction_date || ''}</td>
                    <td>${item.action || ''}</td>
                    <td>${item.factory || ''}</td>
                `;
                tableBody.appendChild(row);
            });
        })
        .catch(err => console.error("Error loading invoice history:", err));
    });

}); 

document.addEventListener("DOMContentLoaded", function () {

    // STEP 1: Load Factory Dropdown
    fetch(new URL('/jssl/factory/getAllFactoryList', baseUrl1), {
        credentials: "include"
    })
    .then(response => response.json())
    .then(data => {
        const factorySelect = document.getElementById('factoryQS');
        factorySelect.innerHTML = `<option value="">Select Factory</option>
                                   <option value="ALL">ALL</option>`;
        if (Array.isArray(data.FactoryDetails)) {
            data.FactoryDetails.forEach(factory => {
                const option = document.createElement('option');
                option.value = factory.id;
                option.textContent = factory.factory_name;
                factorySelect.appendChild(option);
            });
        }
    })
    .catch(error => console.error('Error fetching factory:', error));


    // STEP 2: Factory Change → Show Type div
    document.getElementById("factoryQS").addEventListener("change", function () {
        const factoryId = this.value;

        document.getElementById("selectTypeQS").value = "";
        document.getElementById("selectContractQS").innerHTML = `<option value="">Select Contract</option>`;
        document.getElementById("selectLotQS").innerHTML = `<option value="">Select LOT</option>`;
        document.getElementById("contractDivQS").style.display = "none";
        document.getElementById("lotDivQS").style.display = "none";
        document.querySelector("#TableID10 tbody").innerHTML = '';
        document.querySelector("#invoicePackingHistory tbody").innerHTML = '';

        if (factoryId) {
            document.getElementById("typeDiv").style.display = "block";
        } else {
            document.getElementById("typeDiv").style.display = "none";
        }
    });

    // STEP 4: Contract Change → Load Lots
    document.getElementById("selectContractQS").addEventListener("change", function () {
        const contractId = this.value;
        const factoryId = document.getElementById("factoryQS").value;
        const lotSelect = document.getElementById("selectLotQS");

        lotSelect.innerHTML = `<option value="">Select LOT</option>`;
        document.querySelector("#TableID10 tbody").innerHTML = '';
        document.querySelector("#invoicePackingHistory tbody").innerHTML = '';

        if (!contractId) {
            document.getElementById("lotDivQS").style.display = "none";
            return;
        }

        document.getElementById("lotDivQS").style.display = "block";

        fetch(new URL(`/jssl/lots/by-factory-qs?factoryId=${factoryId}&contractId=${contractId}`, baseUrl1), {
            credentials: "include"
        })
        .then(res => res.json())
        .then(data => {
            const allOption = document.createElement("option");
            allOption.value = "ALL";
            allOption.textContent = "ALL";
            lotSelect.appendChild(allOption);

            data.forEach(lot => {
                const option = document.createElement("option");
                option.value = lot.lot_no;
                option.textContent = lot.lot_no;
                lotSelect.appendChild(option);
            });
        })
        .catch(err => console.error("Error loading QS lots:", err));
    });


    // ✅ STEP 5: Lot Change → Fetch BOTH tables  ← NOW INSIDE DOMContentLoaded
	document.getElementById("selectLotQS").addEventListener("change", function () {
	    const factoryId = document.getElementById("factoryQS").value;
	    const contractId = document.getElementById("selectContractQS").value;
	    const lotNo = this.value;

	    const masterTableBody = document.querySelector("#qsPackingMasterTable tbody"); // ← updated
	    const itemTableBody = document.querySelector("#invoicePackingHistory tbody");

	    masterTableBody.innerHTML = '';
	    itemTableBody.innerHTML = '';

	    if (!factoryId || !contractId || !lotNo) return;

	    const params = new URLSearchParams({
	        factoryId: factoryId === "ALL" ? "all" : factoryId,
	        contractId: contractId === "ALL" ? "all" : contractId,
	        lotNo: lotNo === "ALL" ? "all" : lotNo
	    });

	    // TABLE 1: QS Packing Master History
	    fetch(new URL(`/jssl/history/qs-packing?${params.toString()}`, baseUrl1), {
	        credentials: "include"
	    })
	    .then(res => res.json())
	    .then(data => {
	        if (!data || data.length === 0) {
	            masterTableBody.innerHTML = `<tr><td colspan="11" class="text-center">No records found</td></tr>`;
	            return;
	        }
	        data.forEach((item, index) => {
	            const row = document.createElement('tr');
	            row.innerHTML = `
	                <td>${index + 1}</td>
	                <td>${item.contract_name || ''}</td>
	                <td>${item.load_id || ''}</td>
	                <td>${item.filepath || ''}</td>
					<td></td>
					<td></td>
	                <td>${item.transport_name || ''}</td>
	                <td>${item.vechile_no || ''}</td>
	                <td>${item.milestone_name || ''}</td>
	                <td>${item.createdby || ''}</td>
	                <td>${item.transaction_date || ''}</td>
	                <td>${item.action || ''}</td>
					<td>${item.factory || ''}</td>
	            `;
	            masterTableBody.appendChild(row);
	        });
	    })
	    .catch(err => {
	        console.error("Error loading QS packing master history:", err);
	        masterTableBody.innerHTML = `<tr><td colspan="11" class="text-center text-danger">Error loading data</td></tr>`;
	    });

	    // TABLE 2: QS Packing Item History
	    fetch(new URL(`/jssl/history/qs-packing-items?${params.toString()}`, baseUrl1), {
	        credentials: "include"
	    })
	    .then(res => res.json())
	    .then(data => {
	        if (!data || data.length === 0) {
	            itemTableBody.innerHTML = `<tr><td colspan="8" class="text-center">No records found</td></tr>`;
	            return;
	        }
	        data.forEach((item, index) => {
	            const row = document.createElement('tr');
	            row.innerHTML = `
	                <td>${index + 1}</td>
	                <td>${item.qty || ''}</td>
	                <td>${item.per_kgs || ''}</td>
	                <td>${item.unit_price || ''}</td>
	                <td>${item.total || ''}</td>
	                <td>${item.transaction_date || ''}</td>
	                <td>${item.createdby || ''}</td>
	                <td>${item.action || ''}</td>
					<td>${item.factory || ''}</td>
	            `;
	            itemTableBody.appendChild(row);
	        });
	    })
	    .catch(err => {
	        console.error("Error loading QS packing items history:", err);
	        itemTableBody.innerHTML = `<tr><td colspan="8" class="text-center text-danger">Error loading data</td></tr>`;
	    });

	});

	// STEP 3: Type Change → Load Contracts OR fetch Scrap data directly
	document.getElementById("selectTypeQS").addEventListener("change", function () {
	    const type = this.value;
	    const factoryId = document.getElementById("factoryQS").value;
	    const contractSelect = document.getElementById("selectContractQS");
	    const lotSelect = document.getElementById("selectLotQS");

	    contractSelect.innerHTML = `<option value="">Select Contract</option>`;
	    lotSelect.innerHTML = `<option value="">Select LOT</option>`;
	    document.getElementById("contractDivQS").style.display = "none";
	    document.getElementById("lotDivQS").style.display = "none";
	    document.querySelector("#qsPackingMasterTable tbody").innerHTML = '';
	    document.querySelector("#invoicePackingHistory tbody").innerHTML = '';

	    if (type === "Contract") {
	        document.getElementById("contractDivQS").style.display = "block";

	        fetch(new URL(`/jssl/contracts/by-factory-qs?factoryId=${factoryId}`, baseUrl1), {
	            credentials: "include"
	        })
	        .then(res => res.json())
	        .then(data => {
	            const allOption = document.createElement("option");
	            allOption.value = "ALL";
	            allOption.textContent = "ALL";
	            contractSelect.appendChild(allOption);

	            data.forEach(contract => {
	                const option = document.createElement("option");
	                option.value = contract.con_id;
	                option.textContent = contract.contract_name;
	                contractSelect.appendChild(option);
	            });
	        })
	        .catch(err => console.error("Error loading QS contracts:", err));

	    } else if (type === "Scrap") {
	        // Scrap: no contract/lot needed — fetch directly using factoryId
	        const masterTableBody = document.querySelector("#qsPackingMasterTable tbody");
	        const itemTableBody = document.querySelector("#invoicePackingHistory tbody");

	        const resolvedFactoryId = factoryId === "ALL" ? "all" : factoryId;
	        const params = new URLSearchParams({ factoryId: resolvedFactoryId });

	        // TABLE 1: Scrap Packing Master History
	        fetch(new URL(`/jssl/history/scrap-packing?${params.toString()}`, baseUrl1), {
	            credentials: "include"
	        })
	        .then(res => res.json())
	        .then(data => {
	            if (!data || data.length === 0) {
	                masterTableBody.innerHTML = `<tr><td colspan="13" class="text-center">No records found</td></tr>`;
	                return;
	            }
	            data.forEach((item, index) => {
	                const row = document.createElement('tr');
	                row.innerHTML = `
	                    <td>${index + 1}</td>
	                    <td>${item.contract_id || ''}</td>
	                    <td>${item.scp_load || ''}</td>
						<td></td>
						<td>${item.buyer_ref_no || ''}</td>
						<td>${item.weighbridge_no || ''}</td>
	                    <td>${item.transportername || ''}</td>
	                    <td>${item.vehicleno || ''}</td>
						<td></td>
	                    <td>${item.createdby || ''}</td>
	                    <td>${item.transaction_date || ''}</td>
	                    <td>${item.action || ''}</td>
	                    <td>${item.factory || ''}</td>
	                `;
	                masterTableBody.appendChild(row);
	            });
	        })
	        .catch(err => {
	            console.error("Error loading scrap packing master history:", err);
	            masterTableBody.innerHTML = `<tr><td colspan="13" class="text-center text-danger">Error loading data</td></tr>`;
	        });

	        // TABLE 2: Scrap Packing Items History
	        fetch(new URL(`/jssl/history/scrap-packing-items?${params.toString()}`, baseUrl1), {
	            credentials: "include"
	        })
	        .then(res => res.json())
	        .then(data => {
	            if (!data || data.length === 0) {
	                itemTableBody.innerHTML = `<tr><td colspan="9" class="text-center">No records found</td></tr>`;
	                return;
	            }
	            data.forEach((item, index) => {
	                const row = document.createElement('tr');
	                row.innerHTML = `
	                    <td>${index + 1}</td>
	                    <td>${item.quantity || ''}</td>
	                    <td>${item.kg || ''}</td>
	                    <td>${item.unit_price || ''}</td>
	                    <td>${item.total || ''}</td>
	                    <td>${item.transaction_date || ''}</td>
	                    <td>${item.createdby || ''}</td>
	                    <td>${item.action || ''}</td>
	                    <td>${item.factory || ''}</td>
	                `;
	                itemTableBody.appendChild(row);
	            });
	        })
	        .catch(err => {
	            console.error("Error loading scrap packing items history:", err);
	            itemTableBody.innerHTML = `<tr><td colspan="9" class="text-center text-danger">Error loading data</td></tr>`;
	        });

			} else if (type === "Other") {
			    // Other: no contract/lot needed — fetch directly using factoryId
			    const masterTableBody = document.querySelector("#qsPackingMasterTable tbody");
			    const itemTableBody = document.querySelector("#invoicePackingHistory tbody");

			    const resolvedFactoryId = factoryId === "ALL" ? "all" : factoryId;
			    const params = new URLSearchParams({ factoryId: resolvedFactoryId });

			    // TABLE 1: Other Packing Master History
			    fetch(new URL(`/jssl/history/other-packing?${params.toString()}`, baseUrl1), {
			        credentials: "include"
			    })
			    .then(res => res.json())
			    .then(data => {
			        if (!data || data.length === 0) {
			            masterTableBody.innerHTML = `<tr><td colspan="13" class="text-center">No records found</td></tr>`;
			            return;
			        }
			        data.forEach((item, index) => {
			            const row = document.createElement('tr');
			            row.innerHTML = `
			                <td>${index + 1}</td>
			                <td>${item.con_id || ''}</td>
							<td>${item.other_Pn_no || ''}</td>
							<td></td>
			                <td>${item.buyer_ref || ''}</td>
							<td></td>
			                <td>${item.Transporter_name || ''}</td>
			                <td>${item.vechile_no || ''}</td>
			                <td></td>
			                <td>${item.createdby || ''}</td>
			                <td>${item.action_date || ''}</td>
			                <td>${item.action_type || ''}</td>
			                <td>${item.factory || ''}</td>
			            `;
			            masterTableBody.appendChild(row);
			        });
			    })
			    .catch(err => {
			        console.error("Error loading other packing master history:", err);
			        masterTableBody.innerHTML = `<tr><td colspan="13" class="text-center text-danger">Error loading data</td></tr>`;
			    });

			    // TABLE 2: Other Packing Items History
			    fetch(new URL(`/jssl/history/other-packing-items?${params.toString()}`, baseUrl1), {
			        credentials: "include"
			    })
			    .then(res => res.json())
			    .then(data => {
			        if (!data || data.length === 0) {
			            itemTableBody.innerHTML = `<tr><td colspan="9" class="text-center">No records found</td></tr>`;
			            return;
			        }
			        data.forEach((item, index) => {
			            const row = document.createElement('tr');
			            row.innerHTML = `
			                <td>${index + 1}</td>
			                <td>${item.quantities || ''}</td>
			                <td>${item.kgs || ''}</td>
			                <td>${item.unit_price || ''}</td>
			                <td>${item.total || ''}</td>
			                <td>${item.transaction_date || ''}</td>
			                <td>${item.createdby || ''}</td>
			                <td>${item.action || ''}</td>
			                <td>${item.factory || ''}</td>
			            `;
			            itemTableBody.appendChild(row);
			        });
			    })
			    .catch(err => {
			        console.error("Error loading other packing items history:", err);
			        itemTableBody.innerHTML = `<tr><td colspan="9" class="text-center text-danger">Error loading data</td></tr>`;
			    });
				
				} else if (type === "DeliveryChallan") {
				    // Delivery Challan: no contract/lot needed — fetch directly using factoryId
				    const masterTableBody = document.querySelector("#qsPackingMasterTable tbody");
				    const itemTableBody = document.querySelector("#invoicePackingHistory tbody");

				    const resolvedFactoryId = factoryId === "ALL" ? "all" : factoryId;
				    const params = new URLSearchParams({ factoryId: resolvedFactoryId });

				    // TABLE 1: QS Challan Packing Master History
				    fetch(new URL(`/jssl/history/qs-challan-packing?${params.toString()}`, baseUrl1), {
				        credentials: "include"
				    })
				    .then(res => res.json())
				    .then(data => {
				        if (!data || data.length === 0) {
				            masterTableBody.innerHTML = `<tr><td colspan="13" class="text-center">No records found</td></tr>`;
				            return;
				        }
				        data.forEach((item, index) => {
				            const row = document.createElement('tr');
				            row.innerHTML = `
				                <td>${index + 1}</td>
				                <td>${item.contract_name || ''}</td>
				                <td>${item.load_id || ''}</td>
				                <td>${item.filepath || ''}</td>
				                <td></td>
				                <td></td>
				                <td>${item.transport_name || ''}</td>
				                <td>${item.vechile_no || ''}</td>
				                <td>${item.milestone_name || ''}</td>
				                <td>${item.createdby || ''}</td>
				                <td>${item.operation_timestamp || ''}</td>
				                <td>${item.operation_type || ''}</td>
				                <td>${item.factory || ''}</td>
				            `;
				            masterTableBody.appendChild(row);
				        });
				    })
				    .catch(err => {
				        console.error("Error loading delivery challan packing master history:", err);
				        masterTableBody.innerHTML = `<tr><td colspan="13" class="text-center text-danger">Error loading data</td></tr>`;
				    });

				    // TABLE 2: QS Challan Packing Items History
				    fetch(new URL(`/jssl/history/qs-challan-packing-items?${params.toString()}`, baseUrl1), {
				        credentials: "include"
				    })
				    .then(res => res.json())
				    .then(data => {
				        if (!data || data.length === 0) {
				            itemTableBody.innerHTML = `<tr><td colspan="9" class="text-center">No records found</td></tr>`;
				            return;
				        }
				        data.forEach((item, index) => {
				            const row = document.createElement('tr');
				            row.innerHTML = `
				                <td>${index + 1}</td>
				                <td>${item.qty || ''}</td>
				                <td>${item.per_kgs || ''}</td>
				                <td>${item.unit_price || ''}</td>
				                <td>${item.total || ''}</td>
								<td>${item.operation_timestamp || ''}</td>
								<td>${item.createdby || ''}</td>
				                <td>${item.operation_type || ''}</td>
				                <td>${item.factory || ''}</td>
				            `;
				            itemTableBody.appendChild(row);
				        });
				    })
				    .catch(err => {
				        console.error("Error loading delivery challan packing items history:", err);
				        itemTableBody.innerHTML = `<tr><td colspan="9" class="text-center text-danger">Error loading data</td></tr>`;
				    });
					} else if (type === "DBT/CRD") {
					    // DBT/CRD: no contract/lot needed — fetch directly using factoryId
					    const masterTableBody = document.querySelector("#qsPackingMasterTable tbody");
					    const itemTableBody = document.querySelector("#invoicePackingHistory tbody");

					    const resolvedFactoryId = factoryId === "ALL" ? "all" : factoryId;
					    const params = new URLSearchParams({ factoryId: resolvedFactoryId });

					    // TABLE 1: Debit/Credit Packing Master History
					    fetch(new URL(`/jssl/history/debit-credit-packing?${params.toString()}`, baseUrl1), {
					        credentials: "include"
					    })
					    .then(res => res.json())
					    .then(data => {
					        if (!data || data.length === 0) {
					            masterTableBody.innerHTML = `<tr><td colspan="13" class="text-center">No records found</td></tr>`;
					            return;
					        }
					        data.forEach((item, index) => {
					            const row = document.createElement('tr');
					            row.innerHTML = `
					                <td>${index + 1}</td>
					                <td>${item.contract_name || ''}</td>
					                <td>${item.dcPn_no || ''}</td>
					                <td>${item.filepath || ''}</td>
					                <td></td>
					                <td></td>
					                <td></td>
					                <td></td>
					                <td>${item.milestone_name || ''}</td>
					                <td>${item.createdby || ''}</td>
					                <td>${item.operation_timestamp || ''}</td>
					                <td>${item.operation_type || ''}</td>
					                <td>${item.factory || ''}</td>
					            `;
					            masterTableBody.appendChild(row);
					        });
					    })
					    .catch(err => {
					        console.error("Error loading DBT/CRD packing master history:", err);
					        masterTableBody.innerHTML = `<tr><td colspan="13" class="text-center text-danger">Error loading data</td></tr>`;
					    });

					    // TABLE 2: Debit/Credit Packing Items History
					    fetch(new URL(`/jssl/history/debit-credit-packing-items?${params.toString()}`, baseUrl1), {
					        credentials: "include"
					    })
					    .then(res => res.json())
					    .then(data => {
					        if (!data || data.length === 0) {
					            itemTableBody.innerHTML = `<tr><td colspan="11" class="text-center">No records found</td></tr>`;
					            return;
					        }
					        data.forEach((item, index) => {
					            const row = document.createElement('tr');
					            row.innerHTML = `
					                <td>${index + 1}</td>
					                <td>${item.quantities || ''}</td>
					                <td>${item.kgs || ''}</td>
					                <td>${item.unit_price || ''}</td>
					                <td>${item.total || ''}</td>
					                <td>${item.scrap_name || ''}</td>
					                <td>${item.unit_name || ''}</td>
					                <td>${item.operation_timestamp || ''}</td>
					                <td>${item.createdby || ''}</td>
					                <td>${item.operation_type || ''}</td>
					                <td>${item.factory || ''}</td>
					            `;
					            itemTableBody.appendChild(row);
					        });
					    })
					    .catch(err => {
					        console.error("Error loading DBT/CRD packing items history:", err);
					        itemTableBody.innerHTML = `<tr><td colspan="11" class="text-center text-danger">Error loading data</td></tr>`;
					    });
						} else if (type === "AdvanceInvoice") {
						    // Advance Invoice: no contract/lot needed — fetch directly using factoryId
						    const masterTableBody = document.querySelector("#qsPackingMasterTable tbody");
						    const itemTableBody = document.querySelector("#invoicePackingHistory tbody");

						    const resolvedFactoryId = factoryId === "ALL" ? "all" : factoryId;
						    const params = new URLSearchParams({ factoryId: resolvedFactoryId });

						    // TABLE 1: QS Advance Packing Master History
						    fetch(new URL(`/jssl/history/qs-advance-packing?${params.toString()}`, baseUrl1), {
						        credentials: "include"
						    })
						    .then(res => res.json())
						    .then(data => {
						        if (!data || data.length === 0) {
						            masterTableBody.innerHTML = `<tr><td colspan="13" class="text-center">No records found</td></tr>`;
						            return;
						        }
						        data.forEach((item, index) => {
						            const row = document.createElement('tr');
						            row.innerHTML = `
						                <td>${index + 1}</td>
						                <td>${item.contract_name || ''}</td>
						                <td>${item.load_id || ''}</td>
						                <td>${item.filepath || ''}</td>
						                <td></td>
						                <td></td>
						                <td></td>
						                <td></td>
						                <td>${item.milestone_name || ''}</td>
						                <td>${item.createdby || ''}</td>
						                <td>${item.operation_timestamp || ''}</td>
						                <td>${item.operation_type || ''}</td>
						                <td>${item.factory || ''}</td>
						            `;
						            masterTableBody.appendChild(row);
						        });
						    })
						    .catch(err => {
						        console.error("Error loading advance invoice packing master history:", err);
						        masterTableBody.innerHTML = `<tr><td colspan="13" class="text-center text-danger">Error loading data</td></tr>`;
						    });

						    // TABLE 2: QS Advance Packing Items History
						    fetch(new URL(`/jssl/history/qs-advance-packing-items?${params.toString()}`, baseUrl1), {
						        credentials: "include"
						    })
						    .then(res => res.json())
						    .then(data => {
						        if (!data || data.length === 0) {
						            itemTableBody.innerHTML = `<tr><td colspan="11" class="text-center">No records found</td></tr>`;
						            return;
						        }
						        data.forEach((item, index) => {
						            const row = document.createElement('tr');
						            row.innerHTML = `
						                <td>${index + 1}</td>
						                <td>${item.qty || ''}</td>
						                <td>${item.per_kgs || ''}</td>
						                <td>${item.unit_price || ''}</td>
						                <td>${item.total || ''}</td>
						                <td>${item.operation_timestamp || ''}</td>
						                <td>${item.createdby || ''}</td>
						                <td>${item.operation_type || ''}</td>
						                <td>${item.factory || ''}</td>
						            `;
						            itemTableBody.appendChild(row);
						        });
						    })
						    .catch(err => {
						        console.error("Error loading advance invoice packing items history:", err);
						        itemTableBody.innerHTML = `<tr><td colspan="11" class="text-center text-danger">Error loading data</td></tr>`;
						    });
							}
		else {
	        document.getElementById("contractDivQS").style.display = "none";
	    }
	});
}); 

function blockUI() {

    const container = document.getElementById("container-wrapper");

    if (!container) return;

    // Disable interaction only inside main content
    container.style.pointerEvents = "none";
    container.style.userSelect = "none";
    container.style.opacity = "0.5";
    container.style.position = "relative";

    // Create overlay dynamically
    const overlay = document.createElement("div");
    overlay.id = "contentBlockOverlay";

    overlay.style.position = "absolute";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.background = "rgba(0,0,0,0.6)";
    overlay.style.zIndex = "999";
    overlay.style.display = "flex";
    overlay.style.justifyContent = "center";
    overlay.style.alignItems = "center";
    overlay.style.color = "white";
    overlay.style.fontSize = "22px";
    overlay.style.textAlign = "center";

    overlay.innerHTML = `
        <div>
            🚫 Access Denied <br>
            <small>You don’t have permission to view this page</small>
        </div>
    `;

    container.appendChild(overlay);
}