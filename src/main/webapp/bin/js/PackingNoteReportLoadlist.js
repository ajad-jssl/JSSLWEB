document.addEventListener("DOMContentLoaded", async function () {
    await loadActions();

    if (!allowedActions.includes("view")) {
        blockUI();   // 🔒 permanent block
        return;
    }

    
});


const MainPage = 'PackingNoteReport.jsp';
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





const supplierId = localStorage.getItem('selectedSupplierId')
const selectedFactoryId = localStorage.getItem('selectedFactoryId');
const selecteduserId = sessionStorage.getItem('id')

async function getSupplierId() {
	const url = new URL(
	    `/api/usersupplier/supplierid?uid=${selecteduserId}&factory_id=${selectedFactoryId}`,
	    baseUrl1
	);

    const response = await fetch(url, { credentials: "include" });
    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    if (Array.isArray(data) && data.length > 0) {
        const supid = data[0].supid; // assuming one supplier per user
		localStorage.setItem("selectedSupplierId", supid);
		return supid;
    }

	
    throw new Error("Supplier ID not found");
}
let factoryList = [];


async function fetchFactory() {
    try {
        const res = await fetch(`${baseUrl1}/jssl/factory/getAllFactoryListSS`, {
            method: "GET",
            credentials: "include"
        });

        const data = await res.json();

        if (data.status === "yes") {
            factoryList = data.FactoryDetails;

            console.log("Factory Loaded:", factoryList);

            // ✅ AUTO SET ADDRESS AFTER LOAD
            const selectedFactoryId = localStorage.getItem('selectedFactoryId');
            setFactoryDetails(selectedFactoryId);
        }

    } catch (err) {
        console.error("Factory API Error:", err);
    }
}

function setFactoryDetails(factoryId) {

    const factory = factoryList.find(f => f.id == factoryId);
    if (!factory) return;

    const formattedAddress = formatAddressThreeLines(factory.address);

    document.getElementById("dynaddress").innerHTML = formattedAddress;
    document.getElementById("gstno").innerText = factory.gstNo || "";
}
function formatAddressThreeLines(address) {

    if (!address) return "";

    // 🔹 Clean existing line breaks
    address = address.replace(/\r?\n/g, ",");

    // 🔹 Split by comma
    let parts = address
        .split(",")
        .map(p => p.trim())
        .filter(p => p !== "");

    // 🔹 Divide into 3 roughly equal parts
    let total = parts.length;
    let perLine = Math.ceil(total / 3);

    let line1 = parts.slice(0, perLine).join(", ");
    let line2 = parts.slice(perLine, perLine * 2).join(", ");
    let line3 = parts.slice(perLine * 2).join(", ");

    return `${line1}<br>${line2}<br>${line3}`;
}

document.addEventListener("DOMContentLoaded", function () {
	let today = new Date().toISOString().split('T')[0];

	    // Apply it as min value for all required date fields
	    $("#toDate").attr("max",today);
		
		fetchFactory();
		

    //const supplierId = 168; // set dynamically if needed
	const supplierId = localStorage.getItem('selectedSupplierId');
	const selectedFactoryId = localStorage.getItem('selectedFactoryId');
    const contractSelect = document.getElementById("contractload");
    const phaseSelect = document.getElementById("phaseSelect");
    const loadSelect = document.getElementById("loadSelect");
    const tbody = document.querySelector("#Table_1 tbody");
	
	
	
	

    // -------------------------------------------
    // 1️⃣ Load Contracts on Page Load
    // -------------------------------------------
    function loadContracts() {
	
	getSupplierId();
	/*	fetch(`${baseUrl1}/api/subcontractor/contracts?supplierId=${supplierId}`, {*/
        fetch(`${baseUrl1}/api/subconlistcontracts?supplierId=${supplierId}&factory_id=${selectedFactoryId}`, {
            credentials: "include"
        })
        .then(res => res.json())
        .then(data => {
            contractSelect.innerHTML = '<option value="">Select</option>';
            data.forEach(d => {
                contractSelect.add(new Option(d.contractName, d.contractId));
            });
        })
        .catch(err => console.error("Error fetching contracts:", err));
    }

    loadContracts(); // call on page load

    // -------------------------------------------
    // 2️⃣ Load PZones when contract changes
    // -------------------------------------------
    contractSelect.addEventListener("change", function () {
        const contractId = this.value;

        phaseSelect.innerHTML = '<option value="">Select</option>';
        loadSelect.innerHTML = '<option value="">Select</option>';

        if (!contractId) return;

        fetch(`${baseUrl1}/api/subcontractor/pzones?contractId=${contractId}&supplierId=${supplierId}`, {
            credentials: "include"
        })
        .then(res => res.json())
        .then(data => {
            data.forEach(pzone => {
                phaseSelect.add(new Option(pzone, pzone));
            });
        })
        .catch(err => console.error("Error fetching PZones:", err));
    });

    // -------------------------------------------
    // 3️⃣ Load Loads when phase changes
    // -------------------------------------------
    phaseSelect.addEventListener("change", function () {
        const contractId = contractSelect.value;
        const pzone = this.value;

        loadSelect.innerHTML = '<option value="">Select</option>';

        if (!contractId || !pzone) return;

      /*  fetch(`${baseUrl1}/api/subcontractor/ploads?contractId=${contractId}&supplierId=${supplierId}&pzone=${pzone}`, {*/
		fetch(`${baseUrl1}/api/loads/distinct-ploads-subcon?contractId=${contractId}&supplierId=${supplierId}&pzone=${pzone}&factory_id=${selectedFactoryId}`, {
            credentials: "include"
        })
        .then(res => res.json())
        .then(data => {
            data.forEach(load => {
                loadSelect.add(new Option(load.pload, load.load_id));
            });
        })
        .catch(err => console.error("Error fetching Loads:", err));
    });

    // -------------------------------------------
    // 4️⃣ Fetch Load Details on Button Click
    // -------------------------------------------
    document.getElementById("fetchloadHistory").addEventListener("click", function () {
        const contractId = contractSelect.value;
        const phase = phaseSelect.value;
        const loadId = loadSelect.value;

        document.getElementById("contractError2").style.display = contractId ? "none" : "block";
        document.getElementById("phaseError2").style.display = phase ? "none" : "block";
        document.getElementById("loadError2").style.display = loadId ? "none" : "block";

        if (!contractId || !phase || !loadId) return;

        tbody.innerHTML = "";

      /*  fetch(`${baseUrl1}/api/subcontractor/details?contractId=${contractId}&pzone=${phase}&loadId=${loadId}&supplierId=${supplierId}`, {*/
		fetch(`${baseUrl1}/api/subcontractor/details?contractId=${contractId}&pzone=${phase}&loadId=${loadId}&supplierId=${supplierId}&factory_id=${selectedFactoryId}`, {
            credentials: "include"
        })
        .then(res => res.json())
        .then(data => {
            let sl = 1;
            data.forEach(row => {
                tbody.innerHTML += `
                    <tr>
                        <td>${sl++}</td>
                        <td>${row.contract}</td>
                        <td>${row.pzone}</td>
                        <td>${row.pload}</td>
                        <td>${row.mark}</td>
                        <td>${row.pdescr}</td>
                        <td>${row.pqty}</td>
                        <td>${row.weight}</td>
                        <td>${row.tweight}</td>
                        <td>${row.area}</td>
                        <td>${row.tarea}</td>
                    </tr>
                `;
            });
        })
        .catch(err => console.error("Error fetching load details:", err));
    });

    // =================================================
    // ⭐ SECOND SECTION — LOT DROPDOWN LOGIC
    // =================================================

    function loadContractsForLot() {
		
   /*     fetch(`${baseUrl1}/api/subcontractor/contracts?supplierId=${supplierId}`, {*/
	fetch(`${baseUrl1}/api/subconlistcontracts?supplierId=${supplierId}&factory_id=${selectedFactoryId}`, {
            credentials: "include"
        })
        .then(res => res.json())
        .then(data => {
            const contractDropdown = document.getElementById("contractSelect");
            contractDropdown.innerHTML = '<option value="">Select</option>';

            data.forEach(item => {
                contractDropdown.add(new Option(item.contractName, item.contractId));
            });
        })
        .catch(err => console.error("Error loading contracts for lot:", err));
    }

    function loadLotNumbers(contractId) {
        if (!contractId) return;

      /*  fetch(`${baseUrl1}/api/subcontractor/contractloads?contract_id=${contractId}&supid=${supplierId}`, {*/
		fetch(`${baseUrl1}/api/loads/by-contract-supplier?contractId=${contractId}&supId=${supplierId}&factory_id=${selectedFactoryId}`, {
            credentials: "include"
        })
        .then(res => res.json())
        .then(data => {
            const lotDropdown = document.getElementById("lotSelect");
            lotDropdown.innerHTML = '<option value="">Select</option>';

            data.forEach(item => {
                lotDropdown.add(new Option(item.loadno, item.tload_id));
            });
        })
        .catch(err => console.error("Error loading load numbers:", err));
    }

    // 🔥 FIX: This should NOT be inside another DOMContentLoaded
    loadContractsForLot();

    document.getElementById("contractSelect").addEventListener("change", function () {
        loadLotNumbers(this.value);
    });
	
	// ==============================
	// 3️⃣ Fetch HEADER + ITEM LIST
	// ==============================
	function loadChallanDetails(contractId, loadId) {

	    // --------- FETCH HEADER ---------
	/*    fetch(`${baseUrl1}/api/subcontractor/header?contractId=${contractId}&loadId=${loadId}`, {*/
		fetch(`${baseUrl1}/api/loads/print-headers?contractId=${contractId}&loadId=${loadId}&factory_id=${selectedFactoryId}`, {
	        credentials: 'include'
	    })
	        .then(res => res.json())
				.then(data => {

				    if (!Array.isArray(data) || data.length === 0) {
				        console.error("No header data received");
				        return;
				    }

				    const header = data[0]; // ✅ THIS IS THE FIX

				    document.getElementById("contract").innerText = header.contract?.trim() || "";
				    document.getElementById("lot").innerText = header.loadNo?.trim() || "";
				    document.getElementById("vehicleNo").innerText = header.vehicle?.trim() || "";
					document.getElementById("totalWeight").innerText = header.weight || "";
				    document.getElementById("invoiceRef").innerText = header.invoiceNo?.trim() || "";
				    document.getElementById("clientPO").innerText = header.clientPO?.trim() || "";
				    document.getElementById("notes").innerText = header.notes?.trim() || "";
				    document.getElementById("transporter").innerText = header.haulier?.trim() || "";

				    document.getElementById("dcDate").innerText =
				        header.despatchDate
				            ? new Date(header.despatchDate).toLocaleDateString()
				            : "";

				    document.getElementById("toAddress").innerHTML = `
				        <strong>Consigned To:</strong><br>
				        ${header.del1?.trim() || ""}<br>
				        ${header.del2?.trim() || ""}<br>
				        ${header.del3?.trim() || ""}<br>
				        ${header.del4?.trim() || ""}<br>
				        Phone: ${header.phone?.trim() || ""}<br>
				        Contact: ${header.contact?.trim() || ""}
				    `;
				})
	        .catch(err => console.error("Error header:", err));


	    // --------- FETCH ITEMS ---------
	   /* fetch(`${baseUrl1}/api/subcontractor/items?contractId=${contractId}&loadId=${loadId}`, {*/
		fetch(`${baseUrl1}/api/loads/items?contractId=${contractId}&loadId=${loadId}&factory_id=${selectedFactoryId}`, {
	        credentials: 'include'
	    })
	        .then(res => res.json())
			.then(items => {
			    const tbody = document.getElementById("itemList");
			    tbody.innerHTML = "";

			    let totalQty = 0;
			    let index = 1;

			    const rows = items.map(item => {
			        totalQty += Number(item.qty) || 0; // ✅ safe conversion

			        return `
			            <tr>
			                <td>${index++}</td>
			                <td>${item.productDescr}</td>
			                <td>${item.pload}</td>
			                <td>${item.mark}</td>
			                <td>${item.ssize}</td>
			                <td style="text-align:right;">${item.qty}</td>
			            </tr>
			        `;
			    }).join("");

			    // ✅ Add total row dynamically
			    const totalRow = `
			        <tr>
			            <td colspan="5" style="text-align:right;"><strong>Total</strong></td>
			            <td style="text-align:right;"><strong>${totalQty}</strong></td>
			        </tr>
			    `;

			    // ✅ Final render
			    tbody.innerHTML = rows + totalRow;

			    // ✅ Update count
			    document.getElementById("itemCount").innerText = items.length;
			})
	        .catch(err => console.error("Error fetching items:", err));
	}

	// ==============================
	// EVENT LISTENERS
	// ==============================

	// Correct element references
	const contractDropdown = document.getElementById("contractSelect");
	const lotDropdown = document.getElementById("lotSelect");

	// When user selects Contract → Load Lots
	contractDropdown.addEventListener("change", function () {
	    loadLotNumbers(this.value);
	});

	// When user selects Lot → Fetch Header + Items
	lotDropdown.addEventListener("change", function () {
	    const contractId = contractDropdown.value;
	    const loadId = this.value;

	    if (contractId && loadId) {
	        loadChallanDetails(contractId, loadId);
	    }
	});
});

document.getElementById("reportType").addEventListener("change", function () {
    const reportType = this.value;
	$("#detailsTableContainer").hide();
	$("#summaryTableContainer").hide();
	$("#secondaryTableContainersss").hide();
	$("#HistoryDetailsContainer").hide();
	
    if (reportType === "summary") {
		loadContractssumdetail(); 
    } else if (reportType === "details") {
        loadContractssumdetail();
    }
});

document.getElementById("contractsd").addEventListener("change", function () {
	
	$("#secondaryTableContainersss").hide();
		$("#HistoryDetailsContainer").hide();
	
	});
	document.getElementById("lotsd").addEventListener("change", function () {
		
		$("#secondaryTableContainersss").hide();
			$("#HistoryDetailsContainer").hide();
		
		});
		
		
		
		document.getElementById("lotSelect").addEventListener("change", function () {

		    let lotValue = this.value;

		    if (lotValue && lotValue.trim() !== "") {
		        $("#deliveryChallanContainer").show();
		    } else {
		        $("#deliveryChallanContainer").hide(); // optional (good practice)
		    }

		});

function loadContractssumdetail() {
	const contractSelect = document.getElementById("contractsd");
	
/*	fetch(`${baseUrl1}/api/subcontractor/contracts?supplierId=${supplierId}`, {*/
    fetch(`${baseUrl1}/api/subconlistcontracts?supplierId=${supplierId}&factory_id=${selectedFactoryId}`, {
        credentials: "include"
    })
    .then(res => res.json())
    .then(data => {
        contractSelect.innerHTML = '<option value="">Select</option>';
		contractSelect.add(new Option("All","ALL"));
		        data.forEach(d => {
            contractSelect.add(new Option(d.contractName, d.contractId));
        });
    })
    .catch(err => console.error("Error fetching contracts:", err));
	contractSelect.addEventListener("change", function () {
	const reportType = document.getElementById("reportType").value
	const contract = this.value
	if (reportType === "summary" && contract!=null) {
		loadLotNumberssumdetail(contract); 
	} else if (reportType === "details"&& contract!=null) {
	    loadLotNumberssumdetail(contract);
	}
	});
}

function loadLotNumberssumdetail(contractId) {
    if (!contractId) return;

  /*  fetch(`${baseUrl1}/api/subcontractor/contractloads?contract_id=${contractId}&supid=${supplierId}`, {*/
	fetch(`${baseUrl1}/api/loads/by-contract-supplier/summary?contractId=${contractId}&supId=${supplierId}&factory_id=${selectedFactoryId}`, {
        credentials: "include"
    })
    .then(res => res.json())
    .then(data => {
        const lotDropdown = document.getElementById("lotsd");
        lotDropdown.innerHTML = '<option value="">Select</option>';
		
		lotDropdown.add(new Option("ALL","All"));

        data.forEach(item => {
            lotDropdown.add(new Option(item.loadno, item.tload_id));
        });
    })
    .catch(err => console.error("Error loading load numbers:", err));
}



const MAX_MONTH_RANGE = 24;

$("#fetchsummaryOrdetails").click(async function () {

    const btn = $(this); // 👈 button reference

    let reportType = $("#reportType").val();
    let contractId = $("#contractsd").val();
    let tloadId = $("#lotsd").val();
    let fromDate = $("#fromDate").val();
    let toDate = $("#toDate").val();
    let factory_ids = localStorage.getItem('selectedFactoryId');

    // 🔴 VALIDATION
	let errorMessage = "";

	if (!reportType) {
	    errorMessage = "Please select Report Type";
	} else if (!contractId) {
	    errorMessage = "Please select Contract";
	} else if (!tloadId) {
	    errorMessage = "Please select Lot";
	} else if (!fromDate) {
	    errorMessage = "Please select Start Date";
	} else if (!toDate) {
	    errorMessage = "Please select End Date";
	} else if (fromDate > toDate) {
	    errorMessage = "Start Date cannot be greater than End Date";
	} else {

	    const start = new Date(fromDate);
	    const end = new Date(toDate);

	    let monthsDiff = (end.getFullYear() - start.getFullYear()) * 12 +
	                     (end.getMonth() - start.getMonth());

	    if (end.getDate() >= start.getDate()) {
	        monthsDiff += 1;
	    }

	    if (monthsDiff > MAX_MONTH_RANGE) {
	        errorMessage = `Date range should not exceed ${MAX_MONTH_RANGE} months`;
	    }
	}
	
	

    if (errorMessage) {
        alert(errorMessage);
        return;
    }

    // 🔒 PREVENT DOUBLE CLICK
    if (btn.prop("disabled")) return;
    btn.prop("disabled", true);
    btn.text("Loading...");
	

    try {

        if (reportType === "summary") {

            const url = `${baseUrl1}/api/loads/by-contract-supplier/summarys
                ?supId=${supplierId}
                &sd=${fromDate}
                &ed=${toDate}
                &contractId=${contractId}
                &tloadId=${tloadId}
                &factory_id=${factory_ids}`
                .replace(/\s+/g, '');

            const res = await fetch(url, {
                method: "GET",
                credentials: "include",
                headers: { "Content-Type": "application/json" }
            });

            const data = await res.json();

            fillSummaryTable(data);

            $("#summaryTableContainer").show();
            $("#detailsTableContainer").hide();

        } else {

            const url = `${baseUrl1}/api/loads/by-contract-supplier/details
                ?supId=${supplierId}
                &sd=${fromDate}
                &ed=${toDate}
                &contractId=${contractId}
                &tloadId=${tloadId}
                &factory_id=${factory_ids}`
                .replace(/\s+/g, '');

            const res = await fetch(url, {
                method: "GET",
                credentials: "include",
                headers: { "Content-Type": "application/json" }
            });

            const data = await res.json();

            fillDetailTable(data);

            $("#detailsTableContainer").show();
            $("#summaryTableContainer").hide();
        }

    } catch (err) {
        console.error("API Error:", err);
        alert("Something went wrong!");
    } finally {
        // 🔓 ENABLE BUTTON AGAIN AFTER API CALL
        btn.prop("disabled", false);
        btn.text("Fetch Report");
    }
});

function fillSummaryTable(data) {

    const tbody = document.querySelector("#summaryTable tbody");
    tbody.innerHTML = "";

    let totalOtherWeight = 0;
    let totalTWeight = 0;

	let rows = "";

	data.forEach((item) => {

	    totalOtherWeight += Number(item.otherweight ?? 0);
	    totalTWeight += Number(item.tweight ?? 0);

	    rows += `
	        <tr>
	            <td>${item.JobCode ?? ''}</td>
	            <td>${item.loadno?.trim() ?? ''}</td>
	            <td>${item.descr ?? ''}</td>
	            <td>${item.trailerref?.trim() ?? ''}</td>
	            <td>${item.trackingref ?? ''}</td>
	            <td>${item.created ?? ''}</td>
	            <td>${item.pieceweight ?? 0}</td>
	            <td>${item.otherweight ?? 0}</td>
	            <td>${item.tweight ?? 0}</td>
	            <td>${item.fabloads ?? ''}</td>
	            <td>
	                <button class="btn btn-sm btn-info" onclick="buildload(${item.tload_id})">BildDetails</button>
	                <button class="btn btn-sm btn-info"onclick="buildHistory(${item.tload_id})">History</button>
	            </td>
	        </tr>
	    `;
	});

	// ✅ Add total row
	rows += `
	<tr style="font-weight:bold; background:#f2f2f2;">
	    <td colspan="8" style="text-align:right;">TOTAL:</td>
	    <td>${totalTWeight.toFixed(2)}</td>
	    <td></td>
	    <td></td>
	</tr>
	`;

	// ✅ ONE TIME render
	tbody.innerHTML = rows;
}



function   fillDetailTable(data) {

    const tbody = document.querySelector("#detailsTable tbody");
    tbody.innerHTML = "";

  

	let rows = "";
let index =1;
	data.forEach((item) => {



	    rows += `
	        <tr>
			<td>${index++}</td>
	            <td>${item.jobcode ?? ''}</td>
	            <td>${item.phases  ?? ''}</td>
	            <td>${item.loadno ?? ''}</td>
	            <td>${item.qty ?? ''}</td>
	            <td>${item.mark ?? ''}</td>
	            <td>${item.descr ?? ''}</td>
	            <td>${item.tweight ?? 0}</td>
	            <td>${item.ssize ?? 0}</td>
	            <td>${item.dims ?? 0}</td>
	            <td>${item.pload ?? ''}</td>
				<td>${item.fab ?? ''}</td>
				<td>${item.vehicleref ?? ''}</td>
				<td>${item.waybridgref ?? ''}</td>
				<td>${item.created ?? ''}</td>
	            
	        </tr>
	    `;
	});

	

	// ✅ ONE TIME render
	tbody.innerHTML = rows;
}



async function buildload(load_id) {
   // alert("the build load is clicked");

    let factory_ids = localStorage.getItem('selectedFactoryId');

    const url = `${baseUrl1}/api/lotdetail/load/pieces-in-loadss?tLoadId=${load_id}&factory_id=${factory_ids}`;

    try {
        const res = await fetch(url, {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            }
        });

        const data = await res.json();

        renderBuildTable(data);   // ✅ call render function

    } catch (err) {
        console.error("API Error:", err);
    }
}



function renderBuildTable(data) {

    const tbody = document.querySelector("#secondaryTable tbody");
    tbody.innerHTML = "";   // clear old data

    data.forEach(item => {

        const row = `
            <tr>
                <td>${item.pzone ?? ''}</td>
                <td>${item.qty ?? 0}</td>
                <td>${item.mark?.trim() ?? ''}</td>
                <td>${item.tweight ?? 0}</td>
                <td>${item.ssize ?? ''}</td>
                <td>${item.dims ?? ''}</td>
                <td>${item.descr?.trim() ?? ''}</td>
                <td>${item.pload ?? ''}</td>
                <td>${item.fab ?? ''}</td>
                <td>${item.finishedGoodsLocation?.trim() ?? ''}</td>
            </tr>
        `;

        tbody.innerHTML += row;
    });

    // ✅ show the table
	document.getElementById("summaryTableContainer").style.display = "block";
    document.getElementById("secondaryTableContainersss").style.display = "block";
	document.getElementById("HistoryDetailsContainer").style.display = "none";
}





async function buildHistory(load_id) {
   // alert("the build load is clicked");

    let factory_ids = localStorage.getItem('selectedFactoryId');

    const url = `${baseUrl1}/api/traloads/runs-subcon?tloadId=${load_id}&factory_id=${factory_ids}`;

    try {
        const res = await fetch(url, {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            }
        });

        const data = await res.json();

        renderBuildTableHistory(data);   // ✅ call render function

    } catch (err) {
        console.error("API Error:", err);
    }
}

function renderBuildTableHistory(data)
{
	const tbody = document.querySelector("#haulierDetailsTable tbody");
    tbody.innerHTML = "";   // clear old data
let index =1;
    data.forEach(item => {

        const row = `
            <tr>
                <td>${index ++ }</td>
                <td>${item.haulier ?? ''}</td>
                <td>${item.destination ?? ''}</td>
                <td>${item.country ?? ''}</td>
                <td>${item.county ?? ''}</td>
                <td>${item.loadType ?? ''}</td>
             <td>${''}</td>
               
            </tr>
        `;

        tbody.innerHTML += row;
    });

    // ✅ show the table
	document.getElementById("summaryTableContainer").style.display = "block";
    document.getElementById("HistoryDetailsContainer").style.display = "block";
	document.getElementById("secondaryTableContainersss").style.display = "none";
}

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
