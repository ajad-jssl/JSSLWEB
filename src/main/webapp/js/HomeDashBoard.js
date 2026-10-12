function initHomeDashboard() {
    let today = new Date().toISOString().split('T')[0];
    $("#dateFrom").val(today);
    $("#dateTo").val(today);

    const uid = sessionStorage.getItem('username') || sessionStorage.getItem('user_id') || 'User';
    const el  = document.getElementById('usernameDisplay');
    if (el) el.textContent = uid;

    loadContracts('All').then(() => {
        buildAll();
    });
}

window.initHomeDashboard = initHomeDashboard;
async function loadContracts(factory) {
    try {
        const url = new URL(
            `/jssl/HomeDashBoard/contracts/byfactory?factory=${encodeURIComponent(factory)}`,
            baseUrl
        );
        const response = await fetch(url.toString(), {
            method: 'GET',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' }
        });
        if (!response.ok) throw new Error('Failed to fetch contracts');
        const data = await response.json();
        const contractDropdown = document.getElementById('contractFilter');
        contractDropdown.innerHTML = '<option value="ALL">All</option>';
        const contracts = data.Data || [];
        contracts.forEach(contract => {
            contractDropdown.innerHTML += `
                <option value="${contract.contract_id}">${contract.jobcode}</option>
            `;
        });
    } catch (error) {
        console.error('Error loading contracts:', error);
    }
}

async function loadShipmentData(factory, contract) {
    try {
        const url = new URL(
            `/jssl/HomeDashBoard/shipment?factory=${encodeURIComponent(factory)}&contract=${encodeURIComponent(contract)}`,
            baseUrl
        );
        const response = await fetch(url.toString(), {
            method: 'GET',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' }
        });
        if (!response.ok) throw new Error('Failed to fetch shipment data');
        const data = await response.json();
        return { items: data.Data || [], total: data.total || 0 };  // ✅ return both
    } catch (error) {
        console.error('Error loading shipment data:', error);
        return { items: [], total: 0 };
    }
}

async function loadRawMaterialData(factory, contract) {
    try {
        const response = await fetch(
            `${baseUrl}/jssl/HomeDashBoard/rawmaterial?factory=${factory}&contract=${contract}`,
            {
                method: "GET",
                credentials: "include",
                headers: { "Content-Type": "application/json" }
            }
        );
        const data = await response.json();
		return { items: data.Data || [], total: data.total || 0 }; 
        //return data.Data || [];
    } catch (error) {
        console.error('Error loading raw material data:', error);
       return { items: [], total: 0 };
    }
}

async function loadProductionData(factory, contract) {
    try {

        const fromDate = document.getElementById("dateFrom").value;
        const toDate   = document.getElementById("dateTo").value;

        const response = await fetch(
            `${baseUrl}/jssl/HomeDashBoard/production`
            + `?factory=${factory}`
            + `&contract=${contract}`
            + `&fromDate=${fromDate}`
            + `&toDate=${toDate}`,
            {
                method: "GET",
                credentials: "include"
            }
        );

        const data = await response.json();

		return {
		    items: data.Data || [],
		    total: data.total?.assembled ?? 0
		};

    } catch (error) {

        console.error('Error loading production data:', error);

        return {
            Data: [],
            total: {}
        };
    }
}

async function loadDispatchData(factory, contract) {
    try {
        const fromDate = document.getElementById("dateFrom").value;
        const toDate   = document.getElementById("dateTo").value;
        const response = await fetch(
            `${baseUrl}/jssl/HomeDashBoard/dispatch`
            + `?factory=${factory}`
            + `&contract=${contract}`
            + `&fromDate=${fromDate}`
            + `&toDate=${toDate}`,
            { method: "GET", credentials: "include" }
        );
        const data = await response.json();
		return {
			    items: data.Data || [],
			    total: data.total?.dispatched ?? 0
			};
    } catch (error) {
        console.error('Error loading dispatch data:', error);
		return {
		            Data: [],
		            total: {}
		        };
    }
}

async function loadInvoiceData(factory, contract) {
    try {
        const fromDate = document.getElementById("dateFrom").value;
        const toDate   = document.getElementById("dateTo").value;
        const response = await fetch(
            `${baseUrl}/jssl/HomeDashBoard/invoice`
            + `?factory=${factory}`
            + `&contract=${encodeURIComponent(contract.trim())}` // ← .trim()
            + `&fromDate=${fromDate}`
            + `&toDate=${toDate}`,
            { method: "GET", credentials: "include" }
        );
        const data = await response.json();
        return {
            items: data.Data || [],
            total: data.total?.invoiceValue ?? 0
        };
    } catch (error) {
        console.error('Error loading invoice data:', error);
        return { items: [], total: 0 };
    }
}


function formatToLakhs(value) {
    if (value === null || value === undefined || isNaN(value)) {
        return "0 L";
    }

    const lakhs = value / 100000;

    return lakhs.toLocaleString('en-IN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }) + " L";
}
