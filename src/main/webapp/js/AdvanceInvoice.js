
let allowed = null;
function loadAllowedActions() {
    // Get current JSP page name dynamically
    const rawPageName = window.location.pathname.split("/").pop();

    const pageName = rawPageName.endsWith(".jsp")
        ? rawPageName
        : rawPageName + ".jsp";

    // Get userId from sessionStorage
    const userId = sessionStorage.getItem("user_id");

    if (!userId) {
        console.warn("User ID not found in sessionStorage");
        return;
    }

    // Build URL with baseUrl
    const url = new URL(`/api/user-tab-actions-by-page`, baseUrl);
    url.searchParams.append("userId", userId);
    url.searchParams.append("pageName", pageName);

    // API call
    fetch(url, {
        method: "GET",
        credentials: "include" // ✅ Important for session
    })
        .then(res => {
            if (!res.ok) {
                throw new Error("Failed to fetch allowed actions");
            }
            return res.json();
        })
        .then(actions => {
            console.log("Allowed Actions:", actions);

            // Store globally
           allowed = actions || [];
        })
        .catch(err => {
            console.error("Error fetching actions:", err);
           allowed = []; // fallback
        });
}


document.getElementById("modalScroll1").addEventListener("click", function () {
    // show custom message instead of opening modal
	  //const allowed = window.allowedActions || [];

	if (!allowed.includes("Insert")) {
	  alert(" You do not have permission to Insert.");
	  $('#exampleModalScrollable').modal('hide');
	  return;
	}
	$('#exampleModalScrollable').modal('show');
});

document.addEventListener("DOMContentLoaded", function () {
	loadAllowedActions();
    const selectedFactoryId = localStorage.getItem("selectedFactoryId"); // Get factory_id from localStorage
    if (selectedFactoryId) {
        fetchCont(selectedFactoryId); // Fetch contractor list on page load
    } else {
        console.error("No factory ID found in localStorage.");
    }

    // Add event listener for contractor dropdown change
    document.getElementById("cont").addEventListener("change", function () {
        const selectedContractorId = this.value; // Get selected contractor ID
        const selectedFactoryId = localStorage.getItem("selectedFactoryId"); // Get factory ID again

        if (selectedContractorId) {
            fetchLoad(selectedFactoryId, selectedContractorId); // Fetch load dropdown
        } else {
            console.warn("No contractor selected.");
            document.getElementById("load").innerHTML = `<option value="">Select load</option>`; // Clear load dropdown
            document.getElementById("inputFieldsContainer").style.display = "none"; // Hide the input fields container
        }
    });
    
  // Add event listener for load dropdown change
    document.getElementById("load").addEventListener("change", function () {
        const selectedContractorId = document.getElementById("cont").value; // Get selected contractor ID
        const selectedLoadId = this.value; // Get selected load ID

        if (selectedContractorId && selectedLoadId) {
            document.getElementById("inputFieldsContainer").style.display = "block"; // Show the input fields container
            fetchQsPackingData(selectedContractorId, selectedLoadId); // Fetch the QsPacking data and populate the fields
        } else {
            document.getElementById("inputFieldsContainer").style.display = "none"; // Hide if not selected
        }
    });
});

// Fetch the contractor list
async function fetchCont(factoryId) {
    try {
        const url = new URL(`/jssl/getlistcontractorsfromqsadvpackingnew`, baseUrl);
        url.searchParams.append("factory_id", selectedFactoryId);

        const response = await fetch(url,{
		           method: "GET",
		           credentials: "include"   // ✅ Always send JSESSIONID cookie
		       });
        if (!response.ok) throw new Error("Failed to fetch contractors");

        const json = await response.json(); // ✅ This line defines `json`

        if (json.status !== "yes" || !json.DATA || !json.DATA.length) {
            console.warn("No contractors found.");
            return;
        }

        const selectElement = document.getElementById("cont");
        selectElement.innerHTML = `<option value="">Select contractor</option>`;

        json.DATA.forEach((type) => {
            if (type.contract_id && type.contract_name) {
                const option = document.createElement("option");
                option.value = type.contract_id;
                option.textContent = type.contract_name;
                selectElement.appendChild(option);
            }
        });
    } catch (error) {
        console.error("Error fetching contractors:", error);
    }
}

// Fetch the load list based on factoryId and selected contractorId (con_id)
async function fetchLoad(factoryId, contractId) {
    try {
        const url = new URL(`/jssl/getlistloadidforthatcontractorsfromqsadvpackingnew`, baseUrl);
        url.searchParams.append("factory_id", factoryId);
        url.searchParams.append("contract_id", contractId); // Pass selected contractor ID

        const response = await fetch(url,{
		           method: "GET",
		           credentials: "include"   // ✅ Always send JSESSIONID cookie
		       });
        if (!response.ok) throw new Error("Failed to fetch loads");

        const json = await response.json();

        if (json.status !== "yes" || !json.DATA.length) {
            console.warn("No loads found.");
            return;
        }

        const selectElement = document.getElementById("load");
        selectElement.innerHTML = `<option value="">Select load</option>`;

		json.DATA.forEach((type) => {
		    if (type.load_id) {
		        const option = document.createElement("option");
		        option.value = type.load_id;
		        option.textContent = type.load_id;  // <-- Add this line
		        selectElement.appendChild(option);
		    }
		});
    } catch (error) {
        console.error("Error fetching loads:", error);
    }
}

// Fetch the QsPacking data using contractor_id and load_id
async function fetchQsPackingData(contractId, loadId) {
    try {
        const selectedFactoryId = localStorage.getItem("selectedFactoryId"); // Get the factory_id from localStorage

        // Ensure factory_id is available
        if (!selectedFactoryId) {
            console.error("No factory ID found in localStorage.");
            return;
        }

        const url = new URL(`/jssl/invoice/getcontractqsadvancepackingdetailsnew`, baseUrl);
        
        // Append the parameters to the URL
        url.searchParams.append("contract_id", contractId);
        url.searchParams.append("load_id", loadId);
        url.searchParams.append("factory_id", selectedFactoryId); // Append factory_id as well

        const response = await fetch(url,{
				           method: "GET",
				           credentials: "include"   // ✅ Always send JSESSIONID cookie
				       });
        if (!response.ok) throw new Error("Failed to fetch QsPacking data");

        const json = await response.json();
        
        if (json.Grand_Total_value && json.Grand_Total_value.length > 0) {
        const Grand_Total_value = json.Grand_Total_value[0];
        
            const grandvalue = Grand_Total_value.Grand_Total_tax; // Assuming the bank details ID is inside this property
            const grand1 = document.getElementById("ingrandv");
            if (grand1) {
                grand1.value = grandvalue; // Populate the bank name field
            }
         } else {
            console.warn("No Contractor Data found.");
        }
        
        if (json.QsPacking_Data && json.QsPacking_Data.length > 0) {
        const QsPacking = json.QsPacking_Data[0];
        
            const freightValue = QsPacking.freight; // Assuming the bank details ID is inside this property
            const frie = document.getElementById("freight");
            if (frie) {
                frie.value = freightValue; // Populate the bank name field
            }
            
            const pnidValue = QsPacking.pn_id; // Assuming the bank details ID is inside this property
            const pnid = document.getElementById("id11");
            if (pnid) {
                pnid.value = pnidValue; // Populate the bank name field
            }
            
        } else {
            console.warn("No Contractor Data found.");
        }
        // Check if Contractor_Data exists and contains items
        if (json.Contractor_Data && json.Contractor_Data.length > 0) {
            // Get the first item (or iterate if needed)
            const contractor = json.Contractor_Data[0];

            // Set the bank name from the contractor data
            const bankDetailsIdValue = contractor.bank_details_id_value; // Assuming the bank details ID is inside this property
            const bankInput = document.getElementById("bank");
            if (bankInput) {
                bankInput.value = bankDetailsIdValue; // Populate the bank name field
            }
        // Set the work order from the contractor data
            const workIdValue = contractor.work_id_value; // Assuming the work order ID is inside this property
            const workInput = document.getElementById("work");
            if (workInput) {
                workInput.value = workIdValue; // Populate the work order field
            }
            /*const InvoiceTypeCal = contractor.invoice_type_calculation; // Assuming the work order ID is inside this property
            const InvoiceTypeCalcu = document.getElementById("intypecal");
            if (InvoiceTypeCalcu) {
                InvoiceTypeCalcu.value = InvoiceTypeCal; // Populate the work order field
            }*/
			const InvoiceTypeCal = contractor.invoice_type_calculation; // 1 or 2
			const InvoiceTypeCalcu = document.getElementById("intypecal");
			const InvoiceTypeCalDb = document.getElementById("intypecal_db");

			if (InvoiceTypeCalcu && InvoiceTypeCalDb) {

			    // store DB value
			    InvoiceTypeCalDb.value = InvoiceTypeCal;

			    // show user-friendly text
			    if (InvoiceTypeCal == 1) {
			        InvoiceTypeCalcu.value = "Amount";
			    } else if (InvoiceTypeCal == 2) {
			        InvoiceTypeCalcu.value = "Percentage";
			    } else {
			        InvoiceTypeCalcu.value = "";
			    }
			}
            const InvoiceToValue = contractor.invoice_to_id_value; // Assuming the work order ID is inside this property
            const InvoiceTo = document.getElementById("ininto");
            if (InvoiceTo) {
                InvoiceTo.value = InvoiceToValue; // Populate the work order field
            }
            /*const ProductValue = contractor.product_desc_id; // Assuming the work order ID is inside this property
            const ProDec = document.getElementById("prodesc");
            if (ProDec) {
                ProDec.value = ProductValue; // Populate the work order field
            }*/
			const ProductValue = contractor.product_desc_id; // 1 or 2
			const ProDec = document.getElementById("prodesc");
			const ProDecDb = document.getElementById("prodesc_db");

			if (ProDec && ProDecDb) {

			// store DB value
			ProDecDb.value = ProductValue;

			// show user-friendly text
			if (ProductValue == 1) {
			ProDec.value = "Product desc";
			} else if (ProductValue == 2) {
			ProDec.value = "pd";
			} else {
			ProDec.value = "";
			}
			}
            const ShipmentValue = contractor.shipment_mode_id_value; // Assuming the work order ID is inside this property
            const Ship = document.getElementById("shipmode");
            if (Ship) {
                Ship.value = ShipmentValue; // Populate the work order field
            }
            const ExportValue = contractor.export; // Assuming the work order ID is inside this property
            const exp = document.getElementById("expt");
            if (exp) {
                exp.value = ExportValue; // Populate the work order field
            }
           /* const TaxPayValye = contractor.tax_payable; // Assuming the work order ID is inside this property
            const taxpay = document.getElementById("taxres");
            if (taxpay) {
                taxpay.value = TaxPayValye; // Populate the work order field
            }*/
			const TaxPayValye = contractor.tax_payable; // 1 or 2
			const taxpay = document.getElementById("taxres");
			const taxpayDb = document.getElementById("taxres_db");

			if (taxpay && taxpayDb) {

			// store DB value
			taxpayDb.value = TaxPayValye;

			// show user-friendly text
			if (TaxPayValye == 1) {
			taxpay.value = "No";
				} else if (TaxPayValye == 2) {
			taxpay.value = "Yes";
				} else {
			taxpay.value = "";
				}
			}
            const PercenValue = contractor.percentage_value; // Assuming the work order ID is inside this property
            const per = document.getElementById("percen");
            if (per) {
                per.value = PercenValue; // Populate the work order field
            }
            const ConValue = contractor.consignee_id_value; // Assuming the work order ID is inside this property
            const conadd = document.getElementById("billing");
            if (conadd) {
                conadd.value = ConValue; // Populate the work order field
            }
            const DelValue = contractor.delivery_condition_id_value; // Assuming the work order ID is inside this property
            const del = document.getElementById("delivery");
            if (del) {
                del.value = DelValue; // Populate the work order field
            }
            const RegValue = contractor.reg_office_id_value; // Assuming the work order ID is inside this property
            const reg = document.getElementById("office");
            if (reg) {
                reg.value = RegValue; // Populate the work order field
            }
            if (contractor.export === 'yes') {
                    $('#exportFields1').show();
                } else {
                    $('#exportFields1').hide();
                }
            const AreaValue = contractor.area_no; // Assuming the work order ID is inside this property
            const area = document.getElementById("are");
            if (area) {
                area.value = AreaValue; // Populate the work order field
            }
            const LotValue = contractor.lot_no; // Assuming the work order ID is inside this property
            const lot = document.getElementById("lut");
            if (lot) {
                lot.value = LotValue; // Populate the work order field
            }
            const contValue = contractor.containter_no; // Assuming the work order ID is inside this property
            const cont = document.getElementById("connum");
            if (cont) {
                cont.value = contValue; // Populate the work order field
            }
            const epcgnoValue = contractor.epcgno; // Assuming the work order ID is inside this property
            const epcgno = document.getElementById("epog");
            if (epcgno) {
                epcgno.value = epcgnoValue; // Populate the work order field
            }
            const exptitelvalue = contractor.export_title; // Assuming the work order ID is inside this property
            const expval = document.getElementById("exptitle");
            if (expval) {
                expval.value = exptitelvalue; // Populate the work order field
            }
            const ServiceValue = contractor.s_code_value; // Assuming the work order ID is inside this property
            const Scode = document.getElementById("service");
            if (Scode) {
                Scode.value = ServiceValue; // Populate the work order field
            }
            const HsnValue = contractor.h_code_value; // Assuming the work order ID is inside this property
            const Hcode = document.getElementById("hsncode");
            if (Hcode) {
                Hcode.value = HsnValue; // Populate the work order field
            }
            const BNameValue = contractor.businessUnitName; // Assuming the work order ID is inside this property
            const Bname = document.getElementById("inbusunit");
            if (Bname) {
                Bname.value = BNameValue; // Populate the work order field
            }
            const ScodeNameValue = contractor.s_code_value; // Assuming the work order ID is inside this property
            const Scodename = document.getElementById("officeservice");
            if (Scodename) {
                Scodename.value = ScodeNameValue; // Populate the work order field
            }
            const HcodeNameValue = contractor.h_code_value; // Assuming the work order ID is inside this property
            const Hcodename = document.getElementById("officehsn");
            if (Hcodename) {
                Hcodename.value = HcodeNameValue; // Populate the work order field
            }
            const con_slnoValue = contractor.con_slno; // Assuming the work order ID is inside this property
            const con_slno = document.getElementById("id11con");
            if (con_slno) {
                con_slno.value = con_slnoValue; // Populate the work order field
            }
        } else {
            console.warn("No Contractor Data found.");
        }
        

        // Check if QsPacking_Data exists and contains items
        /*if (json.QsPacking_Data && json.QsPacking_Data.length > 0) {
            const container = document.querySelector(".dynamic-row"); // Find the container for dynamic rows
            container.innerHTML = ""; // Clear any existing rows

            // Loop through QsPacking_Data and create input fields dynamically
            json.QsPacking_Data.forEach((item, index) => {
                const div = document.createElement("div");
                div.classList.add("form-group-container", "col-md-12"); // Add classes to style the row

                // Create fields dynamically based on the data
                div.innerHTML = `
                    <div class="form-row">
                        <div class="form-group col-md-1 col-sm-12">
                            <label for="uom_${index}"><b>UOM</b></label>
                            <input type="text" id="uom_${index}" value="${item.uom_name}" class="form-control" disabled>
                        </div>
                        <div class="form-group col-md-1 col-sm-12">
                            <label for="qty_${index}"><b>Quantity</b></label>
                            <input type="number" id="qty_${index}" value="${item.qty}" class="form-control" disabled>
                        </div>
                        <div class="form-group col-md-1 col-sm-12">
                            <label for="kg_${index}"><b>Kg</b></label>
                            <input type="number" id="kg_${index}" value="${item.per_kgs}" class="form-control" disabled>
                        </div>
                        <div class="form-group col-md-1 col-sm-12">
                            <label for="unit_price_${index}"><b>Unit Price</b></label>
                            <input type="number" id="unit_price_${index}" value="${item.unit_price}" class="form-control" disabled>
                        </div>
                        <div class="form-group col-md-1 col-sm-12">
                            <label for="total_${index}"><b>Total</b></label>
                            <input type="number" id="total_${index}" value="${item.total}" class="form-control" disabled>
                        </div>
                        <div class="form-group col-md-2 col-sm-12">
                            <label for="mile_${index}"><b>Milestone</b></label>
                            <input type="text" id="mile_${index}" value="${item.milestone_name}" class="form-control" disabled>
                        </div>
                        <div class="form-group col-md-2 col-sm-12">
                            <label for="intype_${index}"><b>Invoice Type</b></label>
                            <input type="text" id="intype_${index}" value="${item.scrap_name_type_id}" class="form-control" disabled>
                        </div>
                        
                        </div>
                `;*/
				if (json.QsPacking_Data && json.QsPacking_Data.length > 0) {

						    const container = document.querySelector(".dynamic-row");
						    container.innerHTML = "";   // clear only THIS panel

						    json.QsPacking_Data.forEach((item, index) => {

						        const showLabel = index === 0;

						        container.insertAdjacentHTML("beforeend", `
						            <div class="row align-items-center mb-1">

						                <div class="col-auto">
						                    ${showLabel ? '<label class="small-label d-block">UOM</label>' : ''}
						                    <input type="text" class="form-control form-control-sm small-input"
						                           value="${item.uom_name}" readonly>
						                </div>

						                <div class="col-auto">
						                    ${showLabel ? '<label class="small-label d-block">Quantity</label>' : ''}
						                    <input type="text" class="form-control form-control-sm small-input text-right"
						                           value="${Number(item.qty).toFixed(2)}" readonly>
						                </div>

						                <div class="col-auto">
						                    ${showLabel ? '<label class="small-label d-block">Kg</label>' : ''}
						                    <input type="text" class="form-control form-control-sm small-input text-right"
						                           value="${Number(item.per_kgs).toFixed(2)}" readonly>
						                </div>

						                <div class="col-auto">
						                    ${showLabel ? '<label class="small-label d-block">Unit Price</label>' : ''}
						                    <input type="text" class="form-control form-control-sm small-input text-right"
						                           value="${Number(item.unit_price).toFixed(2)}" readonly>
						                </div>

						                <div class="col-auto">
						                    ${showLabel ? '<label class="small-label d-block">Total</label>' : ''}
						                    <input type="text" class="form-control form-control-sm small-input text-right"
						                           value="${Number(item.total).toFixed(2)}" readonly>
						                </div>

						                <div class="col-auto">
						                    ${showLabel ? '<label class="small-label d-block">Invoice Type</label>' : ''}
						                    <input type="text" class="form-control form-control-sm small-input"
						                           value="${item.scrap_name_type_id}" readonly>
						                </div>

						                <div class="col-auto">
						                    ${showLabel ? '<label class="small-label d-block">Milestone</label>' : ''}
						                    <input type="text" class="form-control form-control-sm small-input"
						                           value="${item.milestone_name}" readonly>
						                </div>

						            </div>
						            <hr style="width:100%;border-top:1px solid #ccc;">
						        `);
						    });
						} else {
            console.warn("No QsPacking data found.");
        }
       // Now, handle tax data and append it to .dynamic-row1
        if (json.tax && json.tax.length > 0) {
            const taxContainer = document.querySelector(".dynamic-row1"); // Find the container for dynamic tax rows
            taxContainer.innerHTML = ""; // Clear any existing rows

            // Loop through tax data and create dynamic rows
			json.tax.forEach((tax, taxIndex) => {
					    $(".dynamic-row1").append(`
					        <div class="row align-items-center mb-2">
					            <div class="col-auto">
					                <label class="small-label1">Tax Name</label>
					                <input type="text"
					                       class="form-control form-control-sm small-input1"
					                       value="${tax.tax_name}"
					                       readonly>
					            </div>

					            <div class="col-auto">
					                <label class="small-label1">Tax %</label>
					                <input type="text"
					                       class="form-control form-control-sm small-input1 text-right"
					                       value="${tax.tax_per}"
					                       readonly>
					            </div>

					            <div class="col-auto">
					                <label class="small-label1">Tax Value</label>
					                <input type="text"
					                       class="form-control form-control-sm small-input1 text-right"
					                       value="${tax.tax_value}"
					                       readonly>
					            </div>
					        </div>

					        <hr class="my-1" style="width:100%;border-top:1px solid #ddd;">
					    `);
					});
        } else {
            console.warn("No tax data found.");
        }
    } catch (error) {
        console.error("Error fetching QsPacking data:", error);
    }
}

document.addEventListener("DOMContentLoaded", function () {
    const selectedFactoryId = localStorage.getItem("selectedFactoryId"); // Get factory_id from localStorage
    if (selectedFactoryId) {
        fetchinvoice(selectedFactoryId);
        fetchBgType();
        fetchUserList111(selectedFactoryId);
        fetchinvoiceEdit(selectedFactoryId);
        fetchBgTypeedit();
    } else {
        console.error("No factory ID found in localStorage.");
    }
});

/*async function fetchUserList111(selectedFactoryId) {
	try {
        
        // Construct the API URL
        const url = new URL(`/jssl/invoice/advlistnew`, baseUrl);
        url.searchParams.append('factory_id', selectedFactoryId);

        // Fetch vendor data
        const response = await fetch(url,{
						           method: "GET",
						           credentials: "include"   // ✅ Always send JSESSIONID cookie
						       });
        if (!response.ok) throw new Error("Failed to fetch data");
        const json = await response.json();
        
        // Function to format date to "dd-mm-yyyy"
        const formatDate = (dateStr) => {
            if (!dateStr) return ''; // Handle empty/null values
            const dateObj = new Date(dateStr);
            if (isNaN(dateObj)) return dateStr; // Return original if invalid
            return dateObj.toLocaleDateString("en-GB").replace(/\//g, '-'); // Replace / with -
        };

        // Prepare table content
        let tableContent = `
            <thead>
                <tr>
                    <th>Contract Name</th>
					<th>Lot Number</th>
                    <th>Invoice Number</th>
                    <th>Invoice Date</th>
                    <th>Status</th>
                    <th style="display:none;">pnid</th>
                    <th>Edit</th>
                    <th>Verify</th>
                    <th>View</th>
                    <th>Release</th>	
					<th>Cancel</th>				
                    <th>Print</th>
                </tr>
            </thead>
            <tbody>
        `;

        json.Data.forEach(item => { 
	        let editinvoice = '';
	        let editIcon = '';
            //let viewIcon = '';
            let releaseIcon ='';;
            let printIcon = ''; // Print Icon
			let cancelIcon = '';
            
			if (item.status === 'CANCELLED') {

							  editinvoice = `<td><i class="fa fa-edit text-muted"></i></td>`;
							  editIcon    = `<td><i class="fa fa-pen text-muted"></i></td>`;
						      releaseIcon = `<td><i class="fa fa-box-open text-muted"></i></td>`;
						      cancelIcon  = `<td><i class="fa fa-times-circle text-muted"></i></td>`;

										     
							   printIcon = `
							     <td>
								    <i class="fa fa-print" style="color: green; cursor: pointer;"
							     onclick="printRecord('${item.id}')">
						      </i>
					    </td>
					    `;

				 
				} else if (item.status === 'VERIFIED') {
	            editinvoice = `<td><i class="fa fa-edit text-muted"></i></td>`;
                editIcon = `<td><i class="fa fa-pen text-muted"></i></td>`; // Disabled (greyed out)
                //viewIcon = `<td><i class="fa fa-eye" style="color: green;" onclick="editRecord11('${item.id}')"></i></td>`; // Enabled
                printIcon = `<td><i class="fa fa-print" style="color: green;" onclick="printRecord('${item.id}')"></i></td>`; // Enabled
                releaseIcon = `<td><i class="fa fa-box-open" style="color: brown;" onclick="openModal('${item.id}', '${item.pn_id}')"></i></td>`;
				cancelIcon = ` <td>  <i class="fa fa-times-circle"style="color: red; cursor: pointer;" onclick="openModalcancel('${item.id}', '${item.pn_id}')"> </i>  </td> `;

            } else if (item.status === 'NOT VERIFIED') {
	            editinvoice = `<td><i class="fa fa-edit" style="color: blue;" onclick="editRecordInvoice('${item.id}')"></i></td>`; // Enabled
                editIcon = `<td><i class="fa fa-pen" style="color: blue;" onclick="editRecord('${item.id}')"></i></td>`; // Enabled
                //viewIcon = `<td><i class="fa fa-eye text-muted"></i></td>`; // Disabled (greyed out)
                printIcon = `<td><i class="fa fa-print text-muted"></i></td>`; // Disabled (greyed out)
                releaseIcon = `<td><i class="fa fa-box-open text-muted"></i></td>`;
				cancelIcon = `<td><i class="fa fa-times-circle text-muted"></i></td>`;
            } else {
	            editinvoice = `<td><i class="fa fa-edit text-muted"></i></td>`;
                editIcon = `<td><i class="fa fa-pen text-muted"></i></td>`;
                //viewIcon = `<td><i class="fa fa-eye text-muted"></i></td>`;
                printIcon = `<td><i class="fa fa-print text-muted"></i></td>`;
                releaseIcon = `<td><i class="fa fa-box-open text-muted"></i></td>`;
				cancelIcon = `<td><i class="fa fa-times-circle text-muted"></i></td>`;
            }
            tableContent += `
                <tr>
                    <td>${item.contract_name}</td>
					<td>${item.load_id}</td>
                    <td>${item.invoice_number}</td>
                    <td>${formatDate(item.created_onlydate)}</td>  <!-- Formatted Date -->
                    <td>${item.status}</td>
                    <td style="display:none;">${item.pn_id}</td>
                    ${editinvoice}
                    ${editIcon}
                    <td><i class="fa fa-eye" style="color: green;" onclick="editRecord11('${item.id}')"></i></td>
                    ${releaseIcon}
					${cancelIcon}
                    ${printIcon}
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

*/




let currentFactoryId = null;

function fetchUserList111(selectedFactoryId) {

    currentFactoryId = selectedFactoryId;

    // 🔥 Destroy existing DataTable
    if ($.fn.DataTable.isDataTable('#tableID')) {
        $('#tableID').DataTable().clear().destroy();
    }

    // ✅ Server-side DataTable
    $('#tableID').DataTable({
        processing: true,
        serverSide: true,          //  tells DataTable to call ajax on every page change
        scrollX: true,
        searching: true,
        dom: 'Bfrtip',
       pageLength: 10,
	   buttons: [
	       {
	           text: 'Export to Excel',
	           action: function (e, dt, button, config) {

	               // ✅ Fetch ALL records then export
	               const url = new URL(`/jssl/invoice/advlistnewss`, baseUrl);
	               url.searchParams.append('factory_id', currentFactoryId);
	               url.searchParams.append('page', 0);
	               url.searchParams.append('size', 99999); // all records

	               fetch(url, { credentials: "include" })
	                   .then(response => response.json())
	                   .then(json => {

	                       const formatDate = (dateStr) => {
	                           if (!dateStr) return '';
	                           const dateObj = new Date(dateStr);
	                           if (isNaN(dateObj)) return dateStr;
	                           return dateObj.toLocaleDateString("en-GB").replace(/\//g, '-');
	                       };

	                       // Build export data
	                       const exportData = json.data.map(item => [
	                           item.contract_name || '',
	                           item.load_id || '',
	                           item.invoice_number || '',
	                           formatDate(item.created_onlydate),
	                           item.status || ''
	                           // ❌ don't export action columns (edit/delete icons)
	                       ]);

	                       // Create temporary table for export
	                       let tempTable = $('<table>').append(
	                           $('<thead>').append(
	                               $('<tr>').append(
	                                   '<th>Contract Name</th>',
	                                   '<th>Lot Number</th>',
	                                   '<th>Invoice Number</th>',
	                                   '<th>Invoice Date</th>',
	                                   '<th>Status</th>'
	                               )
	                           ),
	                           $('<tbody>').append(
	                               exportData.map(row =>
	                                   $('<tr>').append(row.map(cell => $('<td>').text(cell)))
	                               )
	                           )
	                       ).appendTo('body');

	                       // Export using DataTable on temp table
	                       $(tempTable).DataTable({
	                           buttons: [{
	                               extend: 'excelHtml5',
	                               title: 'Invoice List'
	                           }]
	                       }).button(0).trigger();

	                       // Cleanup
	                       setTimeout(() => {
	                           $(tempTable).DataTable().destroy();
	                           $(tempTable).remove();
	                       }, 1000);
	                   });
	           }
	       }
	   ],
        columns: [
            { title: "Contract Name" },
            { title: "Lot Number" },
            { title: "Invoice Number" },
            { title: "Invoice Date" },
            { title: "Status" },
            { title: "pnid", visible: false },   // hidden column
            { title: "Edit Invoice" },
            { title: "Verify" },
            { title: "View" },
            { title: "Release" },
            { title: "Cancel" },
            { title: "Print" }
        ],
        ajax: function (data, callback, settings) {

            // ✅ DataTable sends start + length, convert to page + size
            const page = data.start / data.length;
            const size = data.length;
			const searchValue = data.search.value; 

            const url = new URL(`/jssl/invoice/advlistnewss`, baseUrl);
            url.searchParams.append('factory_id', currentFactoryId);
            url.searchParams.append('page', page);
            url.searchParams.append('size', size);
			url.searchParams.append('search', searchValue); 

            fetch(url, {
                method: "GET",
                credentials: "include"
            })
            .then(response => response.json())
            .then(json => {

                const formatDate = (dateStr) => {
                    if (!dateStr) return '';
                    const dateObj = new Date(dateStr);
                    if (isNaN(dateObj)) return dateStr;
                    return dateObj.toLocaleDateString("en-GB").replace(/\//g, '-');
                };

                const rows = json.data.map(item => {

                    let editinvoice = '';
                    let editIcon = '';
                    let releaseIcon = '';
                    let cancelIcon = '';
                    let printIcon = '';
					let viewIcon   = '';

                    if (item.status === 'CANCELLED') {
                        editinvoice = `<i class="fa fa-edit text-muted"></i>`;
                        editIcon    = `<i class="fa fa-pen text-muted"></i>`;
                        releaseIcon = `<i class="fa fa-box-open text-muted"></i>`;
                        cancelIcon  = `<i class="fa fa-times-circle text-muted"></i>`;
                        printIcon   = `<i class="fa fa-print" style="color:green;" onclick="printRecord('${item.id}')"></i>`;
						// ✅ Enable view icon
						viewIcon = `<i class="fa fa-eye" style="color:green;" onclick="editRecord11('${item.id}')"></i>`;

                    } else if (item.status === 'VERIFIED') {
                        editinvoice = `<i class="fa fa-edit text-muted"></i>`;
                        editIcon    = `<i class="fa fa-pen text-muted"></i>`;
                        releaseIcon = `<i class="fa fa-box-open" style="color:brown;" onclick="openModal('${item.id}','${item.pn_id}')"></i>`;
                        cancelIcon  = `<i class="fa fa-times-circle" style="color:red;" onclick="openModalcancel('${item.id}','${item.pn_id}')"></i>`;
                        printIcon   = `<i class="fa fa-print" style="color:green;" onclick="printRecord('${item.id}')"></i>`;
						viewIcon = `<i class="fa fa-eye" style="color:green;" onclick="editRecord11('${item.id}')"></i>`;

                    } else if (item.status === 'NOT VERIFIED') {
                        editinvoice = `<i class="fa fa-edit" style="color:blue;" onclick="editRecordInvoice('${item.id}')"></i>`;
                        editIcon    = `<i class="fa fa-pen" style="color:blue;" onclick="editRecord('${item.id}')"></i>`;
                        releaseIcon = `<i class="fa fa-box-open text-muted"></i>`;
                        cancelIcon  = `<i class="fa fa-times-circle text-muted"></i>`;
                        printIcon   = `<i class="fa fa-print text-muted"></i>`;
						viewIcon    = `<i class="fa fa-eye text-muted"></i>`;

                    } else {
                        editinvoice = `<i class="fa fa-edit text-muted"></i>`;
                        editIcon    = `<i class="fa fa-pen text-muted"></i>`;
                        releaseIcon = `<i class="fa fa-box-open text-muted"></i>`;
                        cancelIcon  = `<i class="fa fa-times-circle text-muted"></i>`;
                        printIcon   = `<i class="fa fa-print text-muted"></i>`;
						viewIcon    = `<i class="fa fa-eye text-muted"></i>`;
                    }

                    return [
                        item.contract_name || '',
                        item.load_id || '',
                        item.invoice_number || '',
                        formatDate(item.created_onlydate),
                        item.status || '',
                        item.pn_id || '',              // col 5 - hidden
                        editinvoice,                   // col 6
                        editIcon,                      // col 7
                        viewIcon,                      // col 8
                        releaseIcon,                   // col 9
                        cancelIcon,                    // col 10
                        printIcon                      // col 11
                    ];
                });

                callback({
                    draw: data.draw,
                    recordsTotal: json.totalItems,      // ✅ total count from backend
                    recordsFiltered: json.totalItems,   // ✅ same as total (no search filter)
                    data: rows
                });
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
        }
    });
}
/*function fetchUserList111(selectedFactoryId) {

    $('#tableID').DataTable({
        processing: true,
        serverSide: true,
        destroy: true,
        scrollX: true,

        ajax: function (data, callback) {

            const page = data.start / data.length;
            const size = data.length;

            const url = new URL(`/jssl/invoice/advlistnewss`, baseUrl);
            url.searchParams.append('factory_id', selectedFactoryId);
            url.searchParams.append('page', page);
            url.searchParams.append('size', size);

            fetch(url, {
                method: "GET",
                credentials: "include"
            })
            .then(response => response.json())
            .then(json => {

                callback({
                    draw: data.draw,
                    recordsTotal: json.totalItems,
                    recordsFiltered: json.totalItems,
                    data: json.data
                });

            })
            .catch(error => console.error("Error:", error));
        },

        columns: [

            { data: 'contract_name' },
            { data: 'load_id' },
            { data: 'invoice_number' },

            {
                data: 'created_onlydate',
                render: function (data) {
                    if (!data) return '';
                    const dateObj = new Date(data);
                    if (isNaN(dateObj)) return data;
                    return dateObj.toLocaleDateString("en-GB").replace(/\//g, '-');
                }
            },

            { data: 'status' },
            { data: 'pn_id', visible: false },

            // Edit Invoice
            {
                data: null,
                render: function (data, type, row) {

                    if (row.status === 'NOT VERIFIED') {
                        return `<i class="fa fa-edit" style="color: blue;" onclick="editRecordInvoice('${row.id}')"></i>`;
                    }
                    return `<i class="fa fa-edit text-muted"></i>`;
                }
            },

            // Edit
            {
                data: null,
                render: function (data, type, row) {

                    if (row.status === 'NOT VERIFIED') {
                        return `<i class="fa fa-pen" style="color: blue;" onclick="editRecord('${row.id}')"></i>`;
                    }
                    return `<i class="fa fa-pen text-muted"></i>`;
                }
            },

            // View
            {
                data: 'id',
                render: function (data) {
                    return `<i class="fa fa-eye" style="color: green;" onclick="editRecord11('${data}')"></i>`;
                }
            },

            // Release
            {
                data: null,
                render: function (data, type, row) {

                    if (row.status === 'VERIFIED') {
                        return `<i class="fa fa-box-open" style="color: brown;" onclick="openModal('${row.id}', '${row.pn_id}')"></i>`;
                    }
                    return `<i class="fa fa-box-open text-muted"></i>`;
                }
            },

            // Cancel
            {
                data: null,
                render: function (data, type, row) {

                    if (row.status === 'VERIFIED') {
                        return `<i class="fa fa-times-circle" style="color: red;" onclick="openModalcancel('${row.id}', '${row.pn_id}')"></i>`;
                    }
                    return `<i class="fa fa-times-circle text-muted"></i>`;
                }
            },

            // Print
            {
                data: null,
                render: function (data, type, row) {

                    if (row.status === 'VERIFIED' || row.status === 'CANCELLED') {
                        return `<i class="fa fa-print" style="color: green;" onclick="printRecord('${row.id}')"></i>`;
                    }
                    return `<i class="fa fa-print text-muted"></i>`;
                }
            }
        ],

        dom: 'Bfrtip',
        buttons: [
            {
                extend: 'excel',
                text: 'Export to Excel',
                title: 'List'
            }
        ]
    });
}
*/
async function fetchinvoice(factoryId) {
    try {
        
        // Construct the API URL properly
        const url = new URL(`/jssl/master/listinvoicetyperemarksnew`, baseUrl);
        url.searchParams.append("factory_id", factoryId);

        // Fetch data from API
        const response = await fetch(url,{
						           method: "GET",
						           credentials: "include"   // ✅ Always send JSESSIONID cookie
						       });
        if (!response.ok) throw new Error("Failed to fetch sale order types");

        const json = await response.json();

        // Check if the API response has valid data
        if (json.status !== "yes" || !json.INVOICE_TYPE_LIST.length) {
            console.warn("No sale order types found.");
            return;
        }

        // Get the select element
       // const selectElement = document.getElementById("intype444");

        // Clear existing options
        selectElement.innerHTML = `<option value="">Select invoice type</option>`;

        // Populate dropdown options using SalesOrderTypeDetails array
        json.INVOICE_TYPE_LIST.forEach((type) => {
            if (type.slno && type.remarks_type) { // Ensure both values exist
                const option = document.createElement("option");
                option.value = type.slno; // Backend keeps saleorder_id
                option.textContent = type.remarks_type; // Display saleorder_typename
                selectElement.appendChild(option);
            }
        });
    } catch (error) {
        console.error("Error fetching sale order types:", error);
    }
}

async function fetchinvoiceEdit(factoryId) {
    try {
        
        // Construct the API URL properly
        const url = new URL(`/jssl/master/listinvoicetyperemarksnew`, baseUrl);
        url.searchParams.append("factory_id", factoryId);

        // Fetch data from API
        const response = await fetch(url,		{
						           method: "GET",
						           credentials: "include"   // ✅ Always send JSESSIONID cookie
						       });
        if (!response.ok) throw new Error("Failed to fetch sale order types");

        const json = await response.json();

        // Check if the API response has valid data
        if (json.status !== "yes" || !json.INVOICE_TYPE_LIST.length) {
            console.warn("No sale order types found.");
            return;
        }

        // Get the select element
       // const selectElement = document.getElementById("intypeeditup");

        // Clear existing options
        selectElement.innerHTML = `<option value="">Select invoice type</option>`;

        // Populate dropdown options using SalesOrderTypeDetails array
        json.INVOICE_TYPE_LIST.forEach((type) => {
            if (type.slno && type.remarks_type) { // Ensure both values exist
                const option = document.createElement("option");
                option.value = type.slno; // Backend keeps saleorder_id
                option.textContent = type.remarks_type; // Display saleorder_typename
                selectElement.appendChild(option);
            }
        });
    } catch (error) {
        console.error("Error fetching sale order types:", error);
    }
}

async function fetchBgType() {
    try {
        
        // Construct the API URL properly
        const url = new URL(`/jssl/master/listbgtypenew`, baseUrl);
        
        // Fetch data from API
        const response = await fetch(url,{
						           method: "GET",
						           credentials: "include"   // ✅ Always send JSESSIONID cookie
						       });
        if (!response.ok) throw new Error("Failed to fetch sale order types");

        const json = await response.json();

        // Check if the API response has valid data
        if (json.status !== "yes" || !json.BGTYPE.length) {
            console.warn("No sale order types found.");
            return;
        }

        // Get the select element
        const selectElement = document.getElementById("bg");

        // Clear existing options
        selectElement.innerHTML = `<option value="">Select BG type</option>`;

        // Populate dropdown options using SalesOrderTypeDetails array
        json.BGTYPE.forEach((type) => {
            if (type.bgid && type.description) { // Ensure both values exist
                const option = document.createElement("option");
                option.value = type.bgid; // Backend keeps saleorder_id
                option.textContent = type.description; // Display saleorder_typename
                selectElement.appendChild(option);
            }
        });
    } catch (error) {
        console.error("Error fetching sale order types:", error);
    }
}

async function fetchBgTypeedit() {
    try {
        
        // Construct the API URL properly
        const url = new URL(`/jssl/master/listbgtypenew`, baseUrl);
        
        // Fetch data from API
        const response = await fetch(url,{
						           method: "GET",
						           credentials: "include"   // ✅ Always send JSESSIONID cookie
						       });
        if (!response.ok) throw new Error("Failed to fetch sale order types");

        const json = await response.json();

        // Check if the API response has valid data
        if (json.status !== "yes" || !json.BGTYPE.length) {
            console.warn("No sale order types found.");
            return;
        }

        // Get the select element
        const selectElement = document.getElementById("bgvaerifyup");

        // Clear existing options
        selectElement.innerHTML = `<option value="">Select BG type</option>`;

        // Populate dropdown options using SalesOrderTypeDetails array
        json.BGTYPE.forEach((type) => {
            if (type.bgid && type.description) { // Ensure both values exist
                const option = document.createElement("option");
                option.value = type.bgid; // Backend keeps saleorder_id
                option.textContent = type.description; // Display saleorder_typename
                selectElement.appendChild(option);
            }
        });
    } catch (error) {
        console.error("Error fetching sale order types:", error);
    }
}

function openModalAdd() {
   // var username = document.getElementById('intype444').value.trim();
    var prodes = document.getElementById('prodes').value.trim();
    var remark = document.getElementById('remark').value.trim();
    var showError = false; // Initialize showError variable

    // Username Validation
    /*if (username === '') {
        document.getElementById('Vehicleerror').innerText = "Please select invoice type.";
        document.getElementById('Vehicleerror').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('Vehicleerror').innerText = "";
        document.getElementById('Vehicleerror').style.display = "none";
    }*/
    
    if (prodes === '') {
        document.getElementById('productCodeError3').innerText = "Please enter product description.";
        document.getElementById('productCodeError3').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeError3').innerText = "";
        document.getElementById('productCodeError3').style.display = "none";
    }
    
    if (remark === '') {
        document.getElementById('productCodeError4').innerText = "Please enter remarks.";
        document.getElementById('productCodeError4').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeError4').innerText = "";
        document.getElementById('productCodeError4').style.display = "none";
    }
   
   // If no errors, proceed
    if (!showError) {
        $('#exampleModalCenter66').modal('show'); // Show the next modal (Ensure this modal exists)
    }
}
   
// Fetch selectedFactoryId from localStorage
const selectedFactoryId = localStorage.getItem('selectedFactoryId');
console.log('selectedFactoryId:', selectedFactoryId);

function addevent() {
	$('#exampleModalCenter66').modal('hide');
    // Validate role code and role description
    const selectedCOnt = document.getElementById("cont").selectedOptions[0]; // Get the selected option
    const contid = selectedCOnt ? selectedCOnt.value : ''; // Get the contract_id
    const contname = selectedCOnt ? selectedCOnt.textContent : ''; // Get the contract_name
    
    $.ajax({
        url: new URL('/jssl/invoice/advnew', baseUrl),
        type: 'POST',
        dataType: 'json',
		xhrFields: {
		    withCredentials: true
		},
        data: jQuery.param({
            contract_id: contid,
            created_by: createdById,
            load_id: load.value,
            invoice_type: "ADV",
            con_slno: id11con.value,
            product_desc: prodes.value,
            remarks: remark.value,
            date_of_notification: date.value,
            date_val: date1.value,
            bg_type: bg.value,
            date_of_issue: dissue.value,
            reference_no: ref.value,
            lc_number: lc.value,
            supply_place: sup.value,
            s_t_exempted: exe.value,
            lr_docketno: dock.value,
            bg_no: bgno.value,
            date_of_expiry: dateexp.value,
            date_of_ref: dateref.value,
            lc_issue_date: lcdate.value,
            contract_name: contname,
            factory_id: selectedFactoryId,
           // type_id: intype444.value,
            pn_id: id11.value
        }),
        success: function (data) {
            var result = data.message;

            if (result === "Success") {
                const popup = $('<div class="popup">Advance Invoice Created Successfully!</div>')
                    .appendTo('body').hide().fadeIn(400);

                setTimeout(function () {
                    popup.fadeOut(400, function () {
                        $(this).remove();
                        window.location = 'AdvanceInvoiceEntry.jsp';
                    });
                }, 800);
            } else {
                const errorMessage = data.message || 'Failed to create invoice.';
                $('#errorMessage').text(errorMessage);
                $('#exampleModalCenterDup').modal('show');
                $('#exampleModalCenter66').modal('hide');
                $('#exampleModalScrollable').modal('hide');
            }
        },
        error: function () {
            console.error('Request failed.');
        }
    });
}

// Function to safely set values in input fields
function setInputValue(selector, value) {
    $(selector).val(value ? value : ""); // Set value or empty string if undefined/null
}

async function editRecord(id) {
	 // const allowed = window.allowedActions || [];

	if (!allowed.includes("Verify")) {
	  alert(" You do not have permission to Verify.");
	  return;
	}
    try {
        const url = new URL(`/jssl/invoice/searchadvidnew`, baseUrl);
        url.searchParams.append('id', id);

		const response = await fetch(url,{
						           method: "GET",
						           credentials: "include"   // ✅ Always send JSESSIONID cookie
						       });
        if (!response.ok) throw new Error("Failed to fetch data");
        const json = await response.json();

        const packingData = json.QsPacking_Data || [];
        const taxData = json.tax || [];
        const invoiceData = json.Invoice_Data || {};
        const GrandValue = json.Grand_Total_value || [];
        const ContData = json.Contractor_Data || [];

        $(".dynamic-row11, .dynamic-row122").empty(); // Clear previous content

        // Set values in form fields
        setInputValue("#remarkv", invoiceData.remarks);
        setInputValue("#datev", invoiceData.date_of_notification);
        setInputValue("#date1v", invoiceData.date_val);
        setInputValue("#dissuev", invoiceData.date_of_issue);
        setInputValue("#refv", invoiceData.reference_no);
        setInputValue("#lcv", invoiceData.lc_number);
        setInputValue("#supv", invoiceData.supply_place);
        setInputValue("#exev", invoiceData.s_t_exempted);
        setInputValue("#dockv", invoiceData.lr_docketno);
        setInputValue("#bgnov", invoiceData.bg_no);
        setInputValue("#dateexpv", invoiceData.date_of_expiry);
        setInputValue("#daterefv", invoiceData.date_of_ref);
        setInputValue("#lcdatev", invoiceData.lc_issue_date);
        setInputValue("#prodesv11", invoiceData.product_desc);
        setInputValue("#bgvaerify", invoiceData.bgDescription);
        setInputValue("#vidverify", invoiceData.id);

        // Set "freight" value
        setInputValue("#vfreight11", packingData.length > 0 ? packingData[0].freight : "");
        setInputValue("#pnverifyww", packingData.length > 0 ? packingData[0].pn_id : "");
		setInputValue("#contarctsv", packingData.length > 0 ? packingData[0].con_code_with_lot_no : "");

        // Set grand total value
        setInputValue("#grandv", GrandValue.length > 0 ? GrandValue[0].Grand_Total_tax : "");

        // Set contractor data fields
        const contractorFields = {
            "#bunitv": "business_unit_name",
           // "#intypev": "invoice_type_calculation",
            "#intov": "invoice_to_id_value",
           // "#prodesv": "product_desc_id",
            "#shipmodev": "shipment_mode_id_value",
            "#workorderv": "work_id_value",
            "#exptv": "export",
           // "#taxresv": "tax_payable",
            "#percenv": "percentage_value",
            "#nandconv": "consignee_id_value",
            "#banknamev": "bank_details_id_value",
            "#deliveryconv": "delivery_condition_id_value",
            "#officevv": "reg_office_id_value",
           // "#vingrandv": "tax_ex_inc",
           // "#advF": "freight_advance_recovery",
            "#arev": "area_no",
            "#lutv": "lot_no",
            "#connumv": "containter_no",
            "#epogv": "epcgno",
            "#exptitlev": "export_title",
            "#newscode2": "s_code_value",
            "#newhcode2": "h_code_value",
            
        };
		
		const InvoiceTypeCall =
						    ContData.length > 0 ? ContData[0].invoice_type_calculation : null;

						const InvoiceTypeVupp = document.getElementById("intypev");

						if (InvoiceTypeVupp) {
						    if (InvoiceTypeCall == 1) {
						        InvoiceTypeVupp.value = "Amount";
						    } else if (InvoiceTypeCall == 2) {
						        InvoiceTypeVupp.value = "Percentage";
						    } else {
						        InvoiceTypeVupp.value = "";
						    }
						}
						
						const Producttypee =
								    ContData.length > 0 ? ContData[0].product_desc_id : null;

								const Producttypeupp = document.getElementById("prodesv");

								if (Producttypeupp) {
								    if (Producttypee == 1) {
								        Producttypeupp.value = "Product desc";
								    } else if (Producttypee == 2) {
								        Producttypeupp.value = "pd";
								    } else {
								        Producttypeupp.value = "";
								    }
								}
								
							const Taxpayablee =
								ContData.length > 0 ? ContData[0].tax_payable : null;

							    const Taxpayableupp = document.getElementById("taxresv");

							if (Taxpayableupp) {
							if (Taxpayablee == 1) {
							Taxpayableupp.value = "No";
							} else if (Taxpayablee == 2) {
							Taxpayableupp.value = "Yes";
							} else {
								 Taxpayableupp.value = "";
							}
								}
								
								const Taxexinn =
									ContData.length > 0 ? ContData[0].tax_ex_inc : null;

									const Taxexinupp = document.getElementById("vingrandv");

									if (Taxexinupp) {
									if (Taxexinn == 1) {
									Taxexinupp.value = "Exclusive";
									} else if (Taxexinn == 2) {
									Taxexinupp.value = "Inclusive";
									} else {
										Taxexinupp.value = "";
									}
									   }
									   
								const Freightadrecc =
									ContData.length > 0 ? ContData[0].freight_advance_recovery : null;

									const Freightadrecupp = document.getElementById("advF");

								if (Freightadrecupp) {
								if (Freightadrecc == 1) {
								Freightadrecupp.value = "Inclusive";
									} else if (Freightadrecc == 2) {
								Freightadrecupp.value = "Exclusive";
									} else {
								Freightadrecupp.value = "";
									}
								 }
        
        const TaxFields = {
	        "#bvaue": "basic_value",
	        "#pdptv": "optd",
	        "#pdptcv": "optc",
	        "#advA": "taxable",
	        "#advan": "non_taxable"
	      };

        Object.keys(contractorFields).forEach(selector => {
            setInputValue(selector, ContData.length > 0 ? ContData[0][contractorFields[selector]] : "");
        });
        
        Object.keys(TaxFields).forEach(selector => {
            setInputValue(selector, taxData.length > 0 ? taxData[0][TaxFields[selector]] : "");
        });

        // Show/hide export field based on "export" value
        $('#exportFields1verify').toggle(ContData.length > 0 && ContData[0].export === 'yes');

        // Append packing data
		packingData.forEach((item, index) => {
		    const showLabel = index === 0;

		    $(".dynamic-row11").append(`
		        <div class="row align-items-center mb-1">
		            <div class="col-auto">
		                ${showLabel ? '<label class="small-label">UOM</label>' : ''}
		                <input type="text" class="form-control form-control-sm small-input" value="${item.uom_name}" readonly>
		            </div>

		            <div class="col-auto">
		                ${showLabel ? '<label class="small-label">Quantity</label>' : ''}
		                <input type="text" class="form-control form-control-sm small-input text-right" value="${Number(item.qty).toFixed(2)}" readonly>
		            </div>

		            <div class="col-auto">
		                ${showLabel ? '<label class="small-label">Kg</label>' : ''}
		                <input type="text" class="form-control form-control-sm small-input text-right" value="${Number(item.per_kgs).toFixed(2)}" readonly>
		            </div>

		            <div class="col-auto">
		                ${showLabel ? '<label class="small-label">Unit Price</label>' : ''}
		                <input type="text" class="form-control form-control-sm small-input text-right" value="${Number(item.unit_price).toFixed(2)}" readonly>
		            </div>

		            <div class="col-auto">
		                ${showLabel ? '<label class="small-label">Total</label>' : ''}
		                <input type="text" class="form-control form-control-sm small-input text-right" value="${Number(item.total).toFixed(2)}" readonly>
		            </div>

		            <div class="col-auto">
		                ${showLabel ? '<label class="small-label">Invoice Type</label>' : ''}
		                <input type="text" class="form-control form-control-sm small-input" value="${item.scrap_name_type_id}" readonly>
		            </div>

		            <div class="col-auto">
		                ${showLabel ? '<label class="small-label">Milestone</label>' : ''}
		                <input type="text" class="form-control form-control-sm small-input" value="${item.milestone_name}" readonly>
		            </div>
		        </div>
		        <hr style="width:100%;border-top:1px solid #ccc;">
		    `);
		});

        // Append tax data
        taxData.forEach((tax) => {
            $(".dynamic-row122").append(`
                <div class="row align-items-center mb-1">
                    <div class="col-auto"><label class="small-label1">Tax Name</label>
                        <input type="text" class="form-control form-control-sm small-input1" value="${tax.tax_name}" readonly>
                    </div>
                    <div class="col-auto"><label class="small-label1">Tax %</label>
                        <input type="text" class="form-control form-control-sm small-input1 text-right" value="${tax.tax_per}" readonly>
                    </div>
                    <div class="col-auto"><label class="small-label1">Advance Tax</label>
                        <input type="text" class="form-control form-control-sm small-input1 text-right" value="${tax.adv_tax}" readonly>
                    </div>
                    <div class="col-auto"><label class="small-label1">Tax Value</label>
                        <input type="text" class="form-control form-control-sm small-input1 text-right" value="${tax.tax_value}" readonly>
                    </div>
                    <div class="col-auto" style="display:none;"><label class="small-label1">Tax Id</label>
                        <input type="text" class="form-control form-control-sm small-input1" value="${tax.tax_id}">
                    </div>
                </div>
                <hr style="width:120%;border-top:1px solid #ccc;">
            `);
        });

        // Show the modal
        $("#exampleModalScrollableVerify").modal("show");

    } catch (error) {
        console.error('Error fetching invoice data:', error);
    }
}

async function editRecord11(id) {
	// const allowed = window.allowedActions || [];

		if (!allowed.includes("view")) {
		  alert(" You do not have permission to view.");
		    $("#exampleModalScrollableVerified").modal("hide");
		  return;
		}
    try {
	    const url = new URL(`/jssl/invoice/searchadvidnew`, baseUrl);
        url.searchParams.append('id', id);

		const response = await fetch(url,{
						           method: "GET",
						           credentials: "include"   // ✅ Always send JSESSIONID cookie
						       });
        if (!response.ok) throw new Error("Failed to fetch data");
        const json = await response.json();

        const packingData = json.QsPacking_Data || [];
        const taxData = json.tax || [];
        const invoiceData = json.Invoice_Data || {};
        const GrandValue = json.Grand_Total_value || [];
        const ContData = json.Contractor_Data || [];

        $(".dynamic-row11test, .dynamic-row122test").empty(); // Clear previous content

        // Set values in form fields
        setInputValue("#remarkvvtest", invoiceData.remarks);
        setInputValue("#datevv", invoiceData.date_of_notification);
        setInputValue("#date1vv", invoiceData.date_val);
        setInputValue("#dissuevv", invoiceData.date_of_issue);
        setInputValue("#refvv", invoiceData.reference_no);
        setInputValue("#lcvv", invoiceData.lc_number);
        setInputValue("#supvv", invoiceData.supply_place);
        setInputValue("#exevv", invoiceData.s_t_exempted);
        setInputValue("#dockvv", invoiceData.lr_docketno);
        setInputValue("#bgnovv", invoiceData.bg_no);
        setInputValue("#dateexpvv", invoiceData.date_of_expiry);
        setInputValue("#daterefvv", invoiceData.date_of_ref);
        setInputValue("#lcdatevv", invoiceData.lc_issue_date);
        setInputValue("#prodesv11v", invoiceData.product_desc);
        setInputValue("#bgvaerifyv", invoiceData.bgDescription);
        setInputValue("#remarkvvvtest", invoiceData.gst_remarks);
        setInputValue("#vidverifyv", invoiceData.id);

        // Set "freight" value
        setInputValue("#vfreight11v", packingData.length > 0 ? packingData[0].freight : "");
        setInputValue("#pnverifywwv", packingData.length > 0 ? packingData[0].pn_id : "");
		setInputValue("#contarctsvv", packingData.length > 0 ? packingData[0].con_code_with_lot_no : "");

        // Set grand total value
        setInputValue("#grandvv", GrandValue.length > 0 ? GrandValue[0].Grand_Total_tax : "");

        // Set contractor data fields
        const contractorFields = {
            "#bunitvv": "business_unit_name",
            //"#intypevv": "invoice_type_calculation",
            "#intovv": "invoice_to_id_value",
            //"#prodesvv": "product_desc_id",
            "#shipmodevv": "shipment_mode_id_value",
            "#workordervv": "work_id_value",
            "#exptvv": "export",
           //"#taxresvv": "tax_payable",
            "#percenvv": "percentage_value",
            "#nandconvv": "consignee_id_value",
            "#banknamevv": "bank_details_id_value",
            "#deliveryconvv": "delivery_condition_id_value",
            "#officevvv": "reg_office_id_value",
            //"#vingrandvv": "tax_ex_inc",
            //"#advFv": "freight_advance_recovery",
            "#arevv": "area_no",
            "#lutvv": "lot_no",
            "#connumvv": "containter_no",
            "#epogvv": "epcgno",
            "#exptitlevv": "export_title",
            "#newscode1": "s_code_value",
            "#newhcode1": "h_code_value",
        };
        
		const InvoiceTypeCal1 =
				    ContData.length > 0 ? ContData[0].invoice_type_calculation : null;

				const InvoiceTypeVup1 = document.getElementById("intypevv");

				if (InvoiceTypeVup1) {
				    if (InvoiceTypeCal1 == 1) {
				        InvoiceTypeVup1.value = "Amount";
				    } else if (InvoiceTypeCal1 == 2) {
				        InvoiceTypeVup1.value = "Percentage";
				    } else {
				        InvoiceTypeVup1.value = "";
				    }
				}
				
				const Producttype1 =
						    ContData.length > 0 ? ContData[0].product_desc_id : null;

						const Producttypeup1 = document.getElementById("prodesvv");

						if (Producttypeup1) {
						    if (Producttype1 == 1) {
						        Producttypeup1.value = "Product desc";
						    } else if (Producttype1 == 2) {
						        Producttypeup1.value = "pd";
						    } else {
						        Producttypeup1.value = "";
						    }
						}
						
					const Taxpayable1 =
						ContData.length > 0 ? ContData[0].tax_payable : null;

					    const Taxpayableup1 = document.getElementById("taxresvv");

					if (Taxpayableup1) {
					if (Taxpayable1 == 1) {
					Taxpayableup1.value = "No";
					} else if (Taxpayable1 == 2) {
					Taxpayableup1.value = "Yes";
					} else {
						 Taxpayableup1.value = "";
					}
						}
						
						const Taxexin1 =
							ContData.length > 0 ? ContData[0].tax_ex_inc : null;

							const Taxexinup1 = document.getElementById("vingrandvv");

							if (Taxexinup1) {
							if (Taxexin1 == 1) {
							Taxexinup1.value = "Exclusive";
							} else if (Taxexin1 == 2) {
							Taxexinup1.value = "Inclusive";
							} else {
								Taxexinup1.value = "";
							}
							   }
							   
						const Freightadrec1 =
							ContData.length > 0 ? ContData[0].freight_advance_recovery : null;

							const Freightadrecup1 = document.getElementById("advFv");

						if (Freightadrecup1) {
						if (Freightadrec1 == 1) {
						Freightadrecup1.value = "Inclusive";
							} else if (Freightadrec1 == 2) {
						Freightadrecup1.value = "Exclusive";
							} else {
						Freightadrecup1.value = "";
							}
						 }
		
        const TaxFields = {
	        "#bvauev": "basic_value",
	        "#pdptvv": "optd",
	        "#pdptcvv": "optc",
	        "#advAv": "taxable",
	        "#advanv": "non_taxable"
	      };

        Object.keys(contractorFields).forEach(selector => {
            setInputValue(selector, ContData.length > 0 ? ContData[0][contractorFields[selector]] : "");
        });
        
        Object.keys(TaxFields).forEach(selector => {
            setInputValue(selector, taxData.length > 0 ? taxData[0][TaxFields[selector]] : "");
        });

        // Show/hide export field based on "export" value
        $('#exportFields1verified').toggle(ContData.length > 0 && ContData[0].export === 'yes');

		packingData.forEach((item, index) => {
		    const showLabel = index === 0;

		    $(".dynamic-row11test").append(`
		        <div class="row align-items-center mb-1">
		            <div class="col-auto">
		                ${showLabel ? '<label class="small-label">UOM</label>' : ''}
		                <input type="text" class="form-control form-control-sm small-input" value="${item.uom_name}" readonly>
		            </div>

		            <div class="col-auto">
		                ${showLabel ? '<label class="small-label">Quantity</label>' : ''}
		                <input type="text" class="form-control form-control-sm small-input text-right" value="${Number(item.qty).toFixed(2)}" readonly>
		            </div>

		            <div class="col-auto">
		                ${showLabel ? '<label class="small-label">Kg</label>' : ''}
		                <input type="text" class="form-control form-control-sm small-input text-right" value="${Number(item.per_kgs).toFixed(2)}" readonly>
		            </div>

		            <div class="col-auto">
		                ${showLabel ? '<label class="small-label">Unit Price</label>' : ''}
		                <input type="text" class="form-control form-control-sm small-input text-right" value="${Number(item.unit_price).toFixed(2)}" readonly>
		            </div>

		            <div class="col-auto">
		                ${showLabel ? '<label class="small-label">Total</label>' : ''}
		                <input type="text" class="form-control form-control-sm small-input text-right"  value="${Number(item.total).toFixed(2)}" readonly>
		            </div>

		            <div class="col-auto">
		                ${showLabel ? '<label class="small-label">Invoice Type</label>' : ''}
		                <input type="text" class="form-control form-control-sm small-input" value="${item.scrap_name_type_id}" readonly>
		            </div>

		            <div class="col-auto">
		                ${showLabel ? '<label class="small-label">Milestone</label>' : ''}
		                <input type="text" class="form-control form-control-sm small-input" value="${item.milestone_name}" readonly>
		            </div>
		        </div>
		        <hr style="width:100%;border-top:1px solid #ccc;">
		    `);
		});

        // Append tax data
        taxData.forEach((tax) => {
            $(".dynamic-row122test").append(`
                <div class="row align-items-center mb-1">
                    <div class="col-auto"><label class="small-label1">Tax Name</label>
                        <input type="text" class="form-control form-control-sm small-input1" value="${tax.tax_name}" readonly>
                    </div>
                    <div class="col-auto"><label class="small-label1">Tax %</label>
                        <input type="text" class="form-control form-control-sm small-input1 text-right" value="${tax.tax_per}" readonly>
                    </div>
                    <div class="col-auto"><label class="small-label1">Advance Tax</label>
                        <input type="text" class="form-control form-control-sm small-input1 text-right" value="${tax.adv_tax}" readonly>
                    </div>
                    <div class="col-auto"><label class="small-label1">Tax Value</label>
                        <input type="text" class="form-control form-control-sm small-input1 text-right" value="${tax.tax_value}" readonly>
                    </div>
                    <div class="col-auto" style="display:none;"><label class="small-label1">Tax Id</label>
                        <input type="text" class="form-control form-control-sm small-input1" value="${tax.tax_id}">
                    </div>
                </div>
                <hr style="width:120%;border-top:1px solid #ccc;">
            `);
        });

        // Show the modal
        $("#exampleModalScrollableVerified").modal("show");

    } catch (error) {
        console.error('Error fetching invoice data:', error);
    }
}

async function editRecordInvoice(id) {
    try {
        const url = new URL(`/jssl/invoice/searchadvidnew`, baseUrl);
        url.searchParams.append('id', id);

		const response = await fetch(url,{
						           method: "GET",
						           credentials: "include"   // ✅ Always send JSESSIONID cookie
						       });
        if (!response.ok) throw new Error("Failed to fetch data");
        const json = await response.json();

        const packingData = json.QsPacking_Data || [];
        const taxData = json.tax || [];
        const invoiceData = json.Invoice_Data || {};
        const GrandValue = json.Grand_Total_value || [];
        const ContData = json.Contractor_Data || [];

        $(".dynamic-row11uptest, .dynamic-row122up").empty(); // Clear previous content
        
        // Set values in form fields
        setInputValue("#remarkvup", invoiceData.remarks);
        setInputValue("#datevup", invoiceData.date_of_notification);
        setInputValue("#date1vup", invoiceData.date_val);
        setInputValue("#dissuevup", invoiceData.date_of_issue);
        setInputValue("#refvup", invoiceData.reference_no);
        setInputValue("#lcvup", invoiceData.lc_number);
        setInputValue("#supvup", invoiceData.supply_place);
        setInputValue("#exevup", invoiceData.s_t_exempted);
        setInputValue("#dockvup", invoiceData.lr_docketno);
        setInputValue("#bgnovup", invoiceData.bg_no);
        setInputValue("#dateexpvup", invoiceData.date_of_expiry);
        setInputValue("#daterefvup", invoiceData.date_of_ref);
        setInputValue("#lcdatevup", invoiceData.lc_issue_date);
        setInputValue("#prodesv11up", invoiceData.product_desc);
        setInputValue("#bgvaerifyup", invoiceData.bg_type);
        setInputValue("#vidverifyup", invoiceData.id);

        // Set "freight" value
        setInputValue("#vfreight11up", packingData.length > 0 ? packingData[0].freight : "");
        setInputValue("#pnverifywwup", packingData.length > 0 ? packingData[0].pn_id : "");
		setInputValue("#contarcts", packingData.length > 0 ? packingData[0].con_code_with_lot_no : "");
       // setInputValue("#intypeeditup", packingData.length > 0 ? packingData[0].inc_type : "");

        // Set grand total value
        setInputValue("#grandvup", GrandValue.length > 0 ? GrandValue[0].Grand_Total_tax : "");

        // Set contractor data fields
        const contractorFields = {
            "#bunitvup": "business_unit_name",
            //"#intypevup": "invoice_type_calculation",
            "#intovup": "invoice_to_id_value",
            //"#prodesvup": "product_desc_id",
            "#shipmodevup": "shipment_mode_id_value",
            "#workordervup": "work_id_value",
            "#exptvup": "export",
            //"#taxresvup": "tax_payable",
            "#percenvup": "percentage_value",
            "#nandconvup": "consignee_id_value",
            "#banknamevup": "bank_details_id_value",
            "#deliveryconvup": "delivery_condition_id_value",
            "#officevvup": "reg_office_id_value",
            //"#vingrandvup": "tax_ex_inc",
            //"#advFup": "freight_advance_recovery",
            "#arevup": "area_no",
            "#lutvup": "lot_no",
            "#connumvup": "containter_no",
            "#epogvup": "epcgno",
            "#exptitlevup": "export_title",
            "#newhcode": "h_code_value",
            "#newscode": "s_code_value",
        };

		const InvoiceTypeCal =
		    ContData.length > 0 ? ContData[0].invoice_type_calculation : null;

		const InvoiceTypeVup = document.getElementById("intypevup");

		if (InvoiceTypeVup) {
		    if (InvoiceTypeCal == 1) {
		        InvoiceTypeVup.value = "Amount";
		    } else if (InvoiceTypeCal == 2) {
		        InvoiceTypeVup.value = "Percentage";
		    } else {
		        InvoiceTypeVup.value = "";
		    }
		}
		
		const Producttype =
				    ContData.length > 0 ? ContData[0].product_desc_id : null;

				const Producttypeup = document.getElementById("prodesvup");

				if (Producttypeup) {
				    if (Producttype == 1) {
				        Producttypeup.value = "Product desc";
				    } else if (Producttype == 2) {
				        Producttypeup.value = "pd";
				    } else {
				        Producttypeup.value = "";
				    }
				}
				
			const Taxpayable =
				ContData.length > 0 ? ContData[0].tax_payable : null;

			    const Taxpayableup = document.getElementById("taxresvup");

			if (Taxpayableup) {
			if (Taxpayable == 1) {
			Taxpayableup.value = "No";
			} else if (Taxpayable == 2) {
			Taxpayableup.value = "Yes";
			} else {
				 Taxpayableup.value = "";
			}
				}
				
				const Taxexin =
					ContData.length > 0 ? ContData[0].tax_ex_inc : null;

					const Taxexinup = document.getElementById("vingrandvup");

					if (Taxexinup) {
					if (Taxexin == 1) {
					Taxexinup.value = "Exclusive";
					} else if (Taxexin == 2) {
					Taxexinup.value = "Inclusive";
					} else {
						Taxexinup.value = "";
					}
					   }
					   
				const Freightadrec =
					ContData.length > 0 ? ContData[0].freight_advance_recovery : null;

					const Freightadrecup = document.getElementById("advFup");

				if (Freightadrecup) {
				if (Freightadrec == 1) {
				Freightadrecup.value = "Inclusive";
					} else if (Freightadrec == 2) {
				Freightadrecup.value = "Exclusive";
					} else {
				Freightadrecup.value = "";
					}
				 }
        
        const TaxFields = {
	        "#bvaueup": "basic_value",
	        "#pdptvup": "optd",
	        "#pdptcvup": "optc",
	        "#advAup": "taxable",
	        "#advanup": "non_taxable"
	      };

        Object.keys(contractorFields).forEach(selector => {
            setInputValue(selector, ContData.length > 0 ? ContData[0][contractorFields[selector]] : "");
        });
        
        Object.keys(TaxFields).forEach(selector => {
            setInputValue(selector, taxData.length > 0 ? taxData[0][TaxFields[selector]] : "");
        });

        // Show/hide export field based on "export" value
        $('#exportFields1verifyup').toggle(ContData.length > 0 && ContData[0].export === 'yes');

        // Append packing data
		packingData.forEach((item, index) => {
		    const showLabel = index === 0;

		    $(".dynamic-row11uptest").append(`
		        <div class="row align-items-center mb-1">
		            <div class="col-auto">
		                ${showLabel ? '<label class="small-label">UOM</label>' : ''}
		                <input type="text" class="form-control form-control-sm small-input" value="${item.uom_name}" readonly>
		            </div>

		            <div class="col-auto">
		                ${showLabel ? '<label class="small-label">Quantity</label>' : ''}
		                <input type="text" class="form-control form-control-sm small-input text-right" value="${Number(item.qty).toFixed(2)}" readonly>
		            </div>

		            <div class="col-auto">
		                ${showLabel ? '<label class="small-label">Kg</label>' : ''}
		                <input type="text" class="form-control form-control-sm small-input text-right" value="${Number(item.per_kgs).toFixed(2)}" readonly>
		            </div>

		            <div class="col-auto">
		                ${showLabel ? '<label class="small-label">Unit Price</label>' : ''}
		                <input type="text" class="form-control form-control-sm small-input text-right" value="${Number(item.unit_price).toFixed(2)}" readonly>
		            </div>

		            <div class="col-auto">
		                ${showLabel ? '<label class="small-label">Total</label>' : ''}
		                <input type="text" class="form-control form-control-sm small-input text-right" value="${Number(item.total).toFixed(2)}" readonly>
		            </div>

		            <div class="col-auto">
		                ${showLabel ? '<label class="small-label">Invoice Type</label>' : ''}
		                <input type="text" class="form-control form-control-sm small-input" value="${item.scrap_name_type_id}" readonly>
		            </div>

		            <div class="col-auto">
		                ${showLabel ? '<label class="small-label">Milestone</label>' : ''}
		                <input type="text" class="form-control form-control-sm small-input" value="${item.milestone_name}" readonly>
		            </div>
		        </div>
		        <hr style="width:100%;border-top:1px solid #ccc;">
		    `);
		});

        // Append tax data
        taxData.forEach((tax) => {
            $(".dynamic-row122up").append(`
                <div class="row align-items-center mb-1">
                    <div class="col-auto"><label class="small-label1">Tax Name</label>
                        <input type="text" class="form-control form-control-sm small-input1" value="${tax.tax_name}" readonly>
                    </div>
                    <div class="col-auto"><label class="small-label1">Tax %</label>
                        <input type="text" class="form-control form-control-sm small-input1 text-right" value="${tax.tax_per}" readonly>
                    </div>
                    <div class="col-auto"><label class="small-label1">Advance Tax</label>
                        <input type="text" class="form-control form-control-sm small-input1 text-right" value="${tax.adv_tax}" readonly>
                    </div>
                    <div class="col-auto"><label class="small-label1">Tax Value</label>
                        <input type="text" class="form-control form-control-sm small-input1 text-right" value="${tax.tax_value}" readonly>
                    </div>
                    <div class="col-auto" style="display:none;"><label class="small-label1">Tax Id</label>
                        <input type="text" class="form-control form-control-sm small-input1" value="${tax.tax_id}">
                    </div>
                </div>
                <hr style="width:120%;border-top:1px solid #ccc;">
            `);
        });

        // Show the modal
        $("#exampleModalScrollableEditUp").modal("show");

    } catch (error) {
        console.error('Error fetching invoice data:', error);
    }
}


function openModalVerify() {
    var username = document.getElementById('remarkvvei').value.trim();
    var showError = false; // Initialize showError variable

    // Username Validation
    if (username === '') {
        document.getElementById('gstem').innerText = "Please enter GST remarks.";
        document.getElementById('gstem').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('gstem').innerText = "";
        document.getElementById('gstem').style.display = "none";
    }
    
    // If no errors, proceed
    if (!showError) {
        $('#exampleModalCenter66Verify').modal('show'); // Show the next modal (Ensure this modal exists)
    }
}

function addeventVerify() {
	const val = (id, fallback = "0") => {
	    const el = document.getElementById(id);
	    return (el && el.value !== "") ? el.value : fallback;
	};
	$('#exampleModalCenter66Verify').modal('hide');
    // Collect tax_id, tax_per, and tax_value as comma-separated values
    let taxIds = [];
    let taxPers = [];
    let taxValues = [];
    let taxAdv = [];
    let taxPtd = [];
    let taxPbc = [];

    $(".dynamic-row122 .row").each(function () {
        let taxId = $(this).find("input[value][type='text']").eq(6).val(); // Getting tax_id (hidden input)
        let taxPer = $(this).find("input[value][type='text']").eq(1).val(); // Getting tax percentage
        let taxValue = $(this).find("input[value][type='text']").eq(3).val(); // Getting tax amount
        let taxAdven = $(this).find("input[value][type='text']").eq(2).val();
        let taxPtdValue = $(this).find("input[value][type='text']").eq(4).val();
        let taxPbcValue = $(this).find("input[value][type='text']").eq(5).val();

        if (taxId) taxIds.push(taxId);
        if (taxPer) taxPers.push(taxPer);
        if (taxValue) taxValues.push(taxValue);
        if (taxAdven) taxAdv.push(taxAdven);
        if (taxPtdValue) taxPtd.push(taxPtdValue);
        if (taxPbcValue) taxPbc.push(taxPbcValue);
    });

    $.ajax({
        url: new URL('/jssl/invoice/advverificationnew', baseUrl),
        type: 'POST',
        dataType: 'json',
		xhrFields: {
		    withCredentials: true
		},
		data: jQuery.param({
		    verified_by: createdById,
		    factory_id: selectedFactoryId,
		    payable_by_customer: val("pdptcv"),
		    payable_to_dept: val("pdptv"),
		    open_tax_adv: val("advA"),
		    open_non_tax_adv: val("advan"),
		    total: val("bvaue"),
		    recovery_amt: "",
		    t_adv: "",
		    adv_tax: taxAdv.join(","),
		    tax_payable_by_customer: taxPbc.join(","),
		    tax_payable_to_dept: taxPtd.join(","),
		    id: vidverify.value,
		    gst_remarks: remarkvvei.value,
		    pn_id: pnverifyww.value,
		    tax_id: taxIds.join(","),
		    tax_per: taxPers.join(","),
		    tax_value: taxValues.join(",")
		}),
        success: function (data) {
            var result = data.message;

            if (result === "Success") {
                const popup = $('<div class="popup">Advance Invoice Verified Successfully!</div>')
                    .appendTo('body').hide().fadeIn(400);

                setTimeout(function () {
                    popup.fadeOut(400, function () {
                        $(this).remove();
                        window.location = 'AdvanceInvoiceEntry.jsp';
                    });
                }, 800);
            } else {
                const errorMessage = data.message || 'Failed to verify invoice.';
                $('#errorMessage').text(errorMessage);
                $('#exampleModalCenterDup').modal('show');
                $('#exampleModalCenter66Verify').modal('hide');
                $('#exampleModalScrollableVerify').modal('hide');
            }
        },
        error: function () {
            console.error('Request failed.');
        }
    });
}

function openModalUpdate() {
   // var username = document.getElementById('intypeeditup').value.trim();
    var username1 = document.getElementById('prodesv11up').value.trim();
    var username12 = document.getElementById('remarkvup').value.trim();
    var showError = false; // Initialize showError variable

    // Username Validation
   /* if (username === '') {
        document.getElementById('intype').innerText = "Please select Invoice type.";
        document.getElementById('intype').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('intype').innerText = "";
        document.getElementById('intype').style.display = "none";
    }*/
    
    if (username1 === '') {
        document.getElementById('intypedes').innerText = "Please enter product description.";
        document.getElementById('intypedes').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('intypedes').innerText = "";
        document.getElementById('intypedes').style.display = "none";
    }
    
    if (username12 === '') {
        document.getElementById('intyperem').innerText = "Please enter remarks.";
        document.getElementById('intyperem').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('intyperem').innerText = "";
        document.getElementById('intyperem').style.display = "none";
    }
    
    // If no errors, proceed
    if (!showError) {
        $('#exampleModalCenter66Editup').modal('show'); // Show the next modal (Ensure this modal exists)
    }
}

function addeventupdate() {
	$('#exampleModalCenter66Editup').modal('hide');
    $.ajax({
        url: new URL('/jssl/invoice/updateadvnew', baseUrl),
        type: 'POST',
        dataType: 'json',
		xhrFields: {
			    withCredentials: true
			},
        data: jQuery.param({
            modified_by: createdById,
            product_desc: prodesv11up.value,
            remarks: remarkvup.value,
            date_of_notification: datevup.value,
            date_val: date1vup.value,
            pn_id: pnverifywwup.value,
            bg_type: bgvaerifyup.value,
            date_of_issue: dissuevup.value,
            reference_no: refvup.value,
            lc_number: lcvup.value,
            supply_place: supvup.value,
            s_t_exempted: exevup.value,
            lr_docketno: dockvup.value,
            bg_no: bgnovup.value,
            date_of_expiry: dateexpvup.value,
            date_of_ref: daterefvup.value,   
            lc_issue_date: lcdatevup.value, 
            id: vidverifyup.value,
           // invoice_type_id:intypeeditup.value
        }),
        success: function (data) {
            var result = data.message;

            if (result === "Success") {
                const popup = $('<div class="popup">Advance Invoice updated Successfully!</div>')
                    .appendTo('body').hide().fadeIn(400);

                setTimeout(function () {
                    popup.fadeOut(400, function () {
                        $(this).remove();
                        window.location = 'AdvanceInvoiceEntry.jsp';
                    });
                }, 800);
            } else {
                const errorMessage = data.message || 'Failed to update invoice.';
                $('#errorMessage').text(errorMessage);
                $('#exampleModalCenterDup').modal('show');
                $('#exampleModalCenter66Editup').modal('hide');
                $('#exampleModalScrollableEditUp').modal('hide');
                
            }
        },
        error: function () {
            console.error('Request failed.');
        }
    });
}

function openModal(id, pn_id) {
	 // const allowed = window.allowedActions || [];

	if (!allowed.includes("Release")) {
	  alert(" You do not have permission to release.");
	  console.warn("Blocked edit attempt. User lacks release permission.");
	  return;
	}

    // Open the modal
    $('#exampleModalCenter1').modal('show');

    // Store the id and pn_id in the modal's data attributes
    $('#exampleModalCenter1').attr('data-id', id);
    $('#exampleModalCenter1').attr('data-pn-id', pn_id);
}

function addeventrelease() {

	$('#exampleModalCenter1').modal('hide');
    // Retrieve the id and pn_id from the modal
    var id = $('#exampleModalCenter1').attr('data-id');
    var pn_id = $('#exampleModalCenter1').attr('data-pn-id');

    // Perform release action
    $.ajax({
        url: new URL('/jssl/invoice/advreleasebyidnew', baseUrl),
        type: 'POST',
        dataType: 'json',
		xhrFields: {
			    withCredentials: true
			},
        data: jQuery.param({
            id: id, 
            factory_id: selectedFactoryId, 
            released_by: createdById, 
            pn_id: pn_id // Pass the pn_id here
        }),
        success: function (data) {
            var result = data.message;

            if (result === "Success") {
                const popup = $('<div class="popup">Advance Invoice Released Successfully!</div>')
                    .appendTo('body').hide().fadeIn(400);

                setTimeout(function () {
                    popup.fadeOut(400, function () {
                        $(this).remove();
                        window.location = 'AdvanceInvoiceEntry.jsp';
                    });
                }, 800);
            } else {
            }
        },
        error: function () {
            console.error('Request failed.');
        }
    });
}

/*async function printRecord(id) {
    try {
	    const url = new URL(`/jssl/invoice/searchadvidnew?id=${id}`, baseUrl);
		const response = await fetch(url,{
						           method: "GET",
						           credentials: "include"   // ✅ Always send JSESSIONID cookie
						       });
        if (!response.ok) throw new Error("Failed to fetch data");

         const json = await response.json();
         const Invoice_Data = json.Invoice_Data;
         const Contractor_Data = json.Contractor_Data;
         const QsPacking_Data = json.QsPacking_Data;
         const tax = json.tax;
         const Grand_Total_value = json.Grand_Total_value;
         
         const Grand_Total_tax = Grand_Total_value[0].Grand_Total_tax;
         const Total_adv_tax_Taxable = Grand_Total_value[0].Total_adv_tax_Taxable;
         const Tax_Final_total = Grand_Total_value[0].Tax_Final_total;
         const PBC_Final_total = Grand_Total_value[0].PBC_Final_total;
         
         const invoiceno = Invoice_Data.invoice_no;
         const lr_docketno = Invoice_Data.lr_docketno;
         const date_val = Invoice_Data.date_val;
         //const product_desc = json.Invoice_Data?.product_desc || ''; // Fix reference
         
         const invoice_to_id_value = Contractor_Data[0].invoice_to_id_value;
         const tax_payable = Contractor_Data[0].tax_payable;
         const area_no = Contractor_Data[0].area_no;
         const lot_no = Contractor_Data[0].lot_no;
         const containter_no = Contractor_Data[0].containter_no;
         const epcgno = Contractor_Data[0].epcgno;
         const shipment_mode_id_value = Contractor_Data[0].shipment_mode_id_value;
         const delivery_condition_id_value = Contractor_Data[0].delivery_condition_id_value;
         const consignee_id_value = Contractor_Data[0].consignee_id_value;
         const work_id_value = Contractor_Data[0].work_id_value;
         const invoiceStateName = Contractor_Data[0].invoiceStateName;
         const consigneeStateName = Contractor_Data[0].consigneeStateName;
         const invoiceStateCode = Contractor_Data[0].invoiceStateCode;
         const consigneeStateCode = Contractor_Data[0].consigneeStateCode;
         const invoiceGstNo = Contractor_Data[0].invoiceGstNo;
         const consigneeGstNo = Contractor_Data[0].consigneeGstNo;
         const invoicePanNo = Contractor_Data[0].invoicePanNo;
         const consigneePanNo = Contractor_Data[0].consigneePanNo;
         const bankName = Contractor_Data[0].bankName;
         const account_number = Contractor_Data[0].account_number;
         const branch_address = Contractor_Data[0].branch_address;
         const branch_code = Contractor_Data[0].branch_code;
         const swift_code = Contractor_Data[0].swift_code;
         const ifsc_code = Contractor_Data[0].ifsc_code;
		 const work_date = Contractor_Data[0].work_date;
         const transport_name = QsPacking_Data[0].transport_name;
         const vechile_no = QsPacking_Data[0].vechile_no;
         const con_code_with_lot_no = QsPacking_Data[0].con_code_with_lot_no;
         
         const freight = tax[0].freight;
         const total_pices = tax[0].total_pices;
         const total_kgs = tax[0].total_kgs;
         const total_qty = tax[0].total_qty;
         const basic_value = tax[0].basic_value;
         
		 const items = json.QsPacking_Data || []; 
		 const taxData = json.tax || [];
		 const InvoiceData = json.Invoice_Data || [];
		 const grandTotalData = json.Grand_Total_value?.[0] || {};
         const grandTotalInWords = grandTotalData.GrandTotalInWords || '';
		 const grandTotalTax = grandTotalData.Grand_Total_tax || '';
		 const gstremarks = InvoiceData.gst_remarks || '';
		 const advremarks = taxData[0].taxable || '';
		 const advremarksnon = taxData[0].non_taxable || '';
		 const basicValue = taxData[0].basic_value || '';
		 const basicValuecos = taxData[0].optc || '';

        // Generate dynamic rows based on QsPacking_Data
        let tableRows = items.map((item, index) => `
            <tr>
                <td>${index + 1}</td>
                <td>${item.scrap_name_type_id || ''}</td>
                <td>${item.pice || ''}</td>
                <td>${item.hcode || ''}</td>
                <td>${item.uom_name || ''}</td>
                <td>${item.qty || ''}</td>
                <td>${item.per_kgs || ''}</td>
                <td>${item.unit_price || ''}</td>
                <td>${item.total || ''}</td>
            </tr>
        `).join('');
        
        // Generate dynamic tax rows
        let taxRows = taxData.map(tax => `
            <tr>
                <td colspan="7" style="border: 1px solid #000;">${tax.tax_name || ''}</td>
                <td style="border: 1px solid #000;">${tax.tax_per || ''}</td>
                <td style="border: 1px solid #000;">${tax.tax_value || ''}</td>
            </tr>
        `).join('');
        
        // Generate dynamic tax descriptions with tax_name and tax_value_in_words
		let taxDetails = taxData.map(tax => `
		    <b>${tax.tax_name}:</b> ${tax.tax_value_in_words}<br>
		`).join('');
		
		let taxDetailsNew = taxData.map(tax => `
		    <b>${tax.tax_name}</b><br>
		`).join('');
		
		let taxPerValue = taxData.map(tax => `
		    <b>${tax.tax_per}</b><br>
		`).join('');
		
		let taxValue = taxData.map(tax => `
		    <b>${tax.tax_value}</b><br>
		`).join('');
		
		let taxValuedept = taxData.map(tax => `
		    <b>${tax.ptc}</b><br>
		`).join('');
		
		let taxValuecos = taxData.map(tax => `
		    <b>${tax.ptc}</b><br>
		`).join('');
		
		let taxadvanceValue = taxData.map(tax => `
		    <b>${tax.adv_tax}</b><br>
		`).join('');

        const currentDate = new Date().toLocaleDateString('en-GB', {
		  day: '2-digit',
		  month: '2-digit',
		  year: 'numeric'
		}).replace(/\//g, '-'); // Replace '/' with '-'
		
		console.log(currentDate); // Output: "21-02-2025" (DD-MM-YYYY)
        const currentDate1 = new Date();
        const formattedDateTime = String(currentDate1.getDate()).padStart(2, '0') + '-' + 
                          String(currentDate1.getMonth() + 1).padStart(2, '0') + '-' + 
                          currentDate1.getFullYear() + ' ' + 
                          String(currentDate1.getHours()).padStart(2, '0') + ':' + 
                          String(currentDate1.getMinutes()).padStart(2, '0') + ':' + 
                          String(currentDate1.getSeconds()).padStart(2, '0');
                          
       // const htmlContent = await (await fetch('print-content.html')).text()
            const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tally Invoice</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 20px;
        }
        .invoice-container {
            width: 100vw;
            max-width: 1200px;
            border: 1px solid #000;
            padding: 5px;
			margin-top:12%;
        }
        .invoice-container1 {
            width: 100vw;
            max-width: 1200px;
            border: 1px solid #000;
            padding: 5px;
            margin-top:35%;
        }
        .invoice-container2 {
            width: 100vw;
            max-width: 1200px;
            border: 1px solid #000;
            padding: 5px;
            margin-top:34%;
        }
        .header, .footer {
            text-align: center;
        }
        .invoice-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .gst-text {
            text-align: center;
            font-size: 18px;
            font-weight: bold;
        }
        .company-details-table {
            width: 100%;
            border-collapse: collapse;
        }
        .company-details-table td {
            border: 1px solid #000;
            padding: 15px;
            vertical-align: top;
        }
        .company-logo {
            width: 80px;
            height: 50px;
            display: block;
            margin-bottom: 10px;
        }
        .product-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 0px;
        }
        .product-table th, .product-table td {
            border: 1px solid #000;
            padding: 10px;
            text-align: center;
        }
        .terms {
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="invoice-container">
        <div class="invoice-header">
            <b><span id="topdate"></span></b>
            <div class="gst-text">RECEIPT VOUCHER</div>
            <div class="gst-text1">Original For Recipient</div>
        </div>
        
        <table class="company-details-table">
            <tr>
                <td colspan="2">
                    <div class="company-logo">
                    <img src="img/logo/download.png" alt="Company Logo" style="width: 80px;">
                      </div>
                    <strong>JSW Serverfiled Structures Limited</strong><br>
                    Near 10 MT Gate, Beside Cement Plant-2<br>
                    Vidyanagar P.O. Torangallu<br>
                    Torangallu-583275<br>
                    Ballari, Karnataka, India<br>
                    State Code:29<br>
                    GSTIN : 29AACCJ1473D1ZQ     PAN : AACCJ1473D<br>
                    ICE No: 0309033152   CIN No: U28112MH2009PLC191045<br>
                    Email: invoice@jssl.in    Website: www.jssl.in<br>
                </td>
                <td colspan="2">
                <b>Invoice No:</b> <span id="invoiceNumber"></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b>Date:</b> <span id="date"></span><br>
                <b>Contract No Reference No:</b> <span id="contrefno"></span><br>
                <b>Date & Time of supply:</b> <span id="datetime"></span><br>
                <b>Work/Purchase Order No:</b> <span id="workor"></span><br>
                <b>Date of Order:</b> <span id="dateor"></span><br>
            </tr>
            <tr>
                <td colspan="2"><strong>Invoice To:</strong><br>
                <span id="shipto11"></span><br>
                <b>Name of the state:</b> <span id="statename"></span><br>
                <b>State Code:</b> <span id="stcode11"></span><br>
                <b>GSTIN:</b><span id="ingst"></span><br>
                <b>PAN:</b><span id="panin"></span><br>
                </td>
                <td colspan="2"><strong>Name & Address of consignee:</strong><br>
                <span id="conadd"></span><br>
                <b>State Name:</b> <span id="state"></span><br>
                <b>State Code:</b> <span id="stateco"></span><br>
                <b>GSTIN:</b><span id="congst"></span><br>
                <b>PAN:</b><span id="pancon"></span><br>
                </td>
            </tr>
            <tr>
                <td><strong>Date of Notification</strong><br>
                 <strong>Exempted note under:</strong><br>
                 <strong>Tax is Payble on revese charge:(Yes/No):<span id="taxpayre"></span></strong><br>
                 </td>
                <td><strong>Export Details:</strong><br>
                <strong>ARE No:<span id="areano"></span></strong><br>
                <strong>LUT No:<span id="lutno"></span></strong><br>
                <strong>Container No:<span id="contlo"></span></strong><br>
                <strong>EPCG License No:<span id="epoglo"></span></strong><br>
                </td>
                <td><b>Transporter:</b> <span id="trans"></span><br>
                <b>Vehicle No:</b><span id="vehino"></span><br>
                <b>LR/DOCKET No:<span id="lrdoc"></span></b><br>
                <b>Date:<span id="lrdate"></span></b><br>
                </td>
                <td><b>Shipment Mode:</b> <span id="shipmo"></span><br>
                <b>Delivery Condition:</b> <span id="delcon"></span><br>
                </td>
            </tr>
        </table>
        
        <table class="product-table">
            <thead>
                <tr>
                    <th>Sr No.</th>
                    <th>Product Description</th>
                    <th>Pieces</th>
                    <th>Service/HSN Code</th>
                    <th>UOM</th>
                    <th>Qty</th>
                    <th>Weight</th>
                    <th>Unit Price</th>
                    <th>Value (INR)</th>
                </tr>
            </thead>
            <tbody>
                ${tableRows} 
            </tbody>
            <tbody>
                <tr>
                    <td style="border: 1px solid #000; height: 10px;"" colspan="4">
                    <span>Freight</span><br>
                    </td>
                    <td style="border: 1px solid #000; height: 10px;" colspan="4"></td>
                    <td style="border: 1px solid #000; height: 10px;">
                    <span id="freight"></span><br>
                    </td>
                </tr>
            </tbody>
            <tbody>
                <tr>
                    <td style="border: 1px solid #000; height: 10px;"" colspan="2">
                    <span>TOTAL</span><br>
                    </td>
                    <td style="border: 1px solid #000; height: 10px;">
                    <span id="pitotal"></span><br></td>
                    </td>
                    <td style="border: 1px solid #000; height: 10px;"></td>
                    <td style="border: 1px solid #000; height: 10px;">
                    <td style="border: 1px solid #000; height: 10px;">
                    <span id="qtytotal"></span><br></td>
                    </td>
                    <td style="border: 1px solid #000; height: 10px;">
                    <span id="wiegtotal"></span><br>
                    </td>
                    <td style="border: 1px solid #000; height: 10px;"></td>
                    <td style="border: 1px solid #000; height: 10px;">
                    <span id="val11"></span><br>
                    </td>
                 </tr>
            </tbody>
            <tbody>
                ${taxRows}
            </tbody>
            <tbody>
                <tr>
                    <td style="border: 1px solid #000; height: 20px; width: 200px;" colspan="4">
                        <b>Note:</b><span>Identification Marks & Serial No. of Goods: As per packing list attached</span><br>
                        ${taxDetails} <!-- Dynamic Tax Name & Value in Words -->
                        <b>Gross total in words:</b> <b>${grandTotalInWords}</b><br>
                    </td>
                    <td style="border: 1px solid #000; height: 20px; width: 200px;" colspan="3">
                        <b>TOTAL INVOICE VALUE:</b><br>
                    </td>
                    <td style="border: 1px solid #000; height: 10px;" colspan="2">
                        <span>${grandTotalTax}</span><br> <!-- Dynamic Grand Total Tax -->
                    </td>              
                </tr> 
            </tbody>
            <tbody>
                <tr>
                    <td style="border: 1px solid #000; height: 20px;width: 200px;">
                    <span>Particulars</span><br>
                    </td>
                    <td style="border: 1px solid #000; height: 20px;">
                    <span>Tax Application</span><br>
                    </td>
                    <td style="border: 1px solid #000; height: 20px;">
                    <span>Tax %</span><br>
                    </td>
                    <td style="border: 1px solid #000; height: 20px;">
                    <span>Adv Recovery (Taxable)</span><br>
                    </td>
                    <td style="border: 1px solid #000; height: 20px;">
                    <span>Adv Recovery (NonTax)</span><br>
                    </td>
                    <td style="border: 1px solid #000; height: 20px;">
                    <span>Invoice Value</span><br>
                    </td>
                    <td style="border: 1px solid #000; height: 20px;">
                    <span>Payable to dept</span><br>
                    </td>
                    <td style="border: 1px solid #000; height: 20px;" colspan="2">
                    <span>Payable by Customer</span><br>
                    </td>
                    </tr>
            </tbody>
            <tbody>
                <tr>
                    <td style="border: 1px solid #000; height: 20px;">
                    <span>${gstremarks}</span><br>
                    </td>
                    <td style="border: 1px solid #000; height: 20px;">
                    <span>Basic</span><br>
                    ${taxDetailsNew}
                    </td>
                    <td style="border: 1px solid #000; height: 20px;">
                    ${taxPerValue}
                    </td>
                    <td style="border: 1px solid #000; height: 20px;">
                    <span>${advremarks}</span><br>
                    ${taxadvanceValue}
                    </td>
                    <td style="border: 1px solid #000; height: 20px;">
                    <span>${advremarksnon}</span><br>
                    </td>
                    <td style="border: 1px solid #000; height: 20px;">
                    <span>${basicValue}</span><br>
                    ${taxValue}
                    </td>
                    <td style="border: 1px solid #000; height: 20px;">
                    ${taxValuedept}
                    </td>
                    <td style="border: 1px solid #000; height: 20px;" colspan="2">
                    <span>${basicValuecos}</span><br>
                    ${taxValuecos}
                    </td>
                    </tr>
            </tbody>
            <tbody>
                <tr>
                    <td style="border: 1px solid #000; height: 20px;" colspan="2">
                    <span>Total</span><br>
                    </td>
                    <td style="border: 1px solid #000; height: 20px;">
                    </td>
                    <td style="border: 1px solid #000; height: 20px;">
                    <span id="taxbasic"></span><br>
                    </td>
                    <td style="border: 1px solid #000; height: 20px;">
                    </td>
                    <td style="border: 1px solid #000; height: 20px;">
                    <span id="grandlast"></span><br>
                    </td>
                    <td style="border: 1px solid #000; height: 20px;">
                    <span id="taxtotal"></span><br>
                    </td>
                    <td style="border: 1px solid #000; height: 20px;" colspan="2">
                    <span id="grandlast12new"></span><br>
                    </td>
                </tr>
            </tbody>
            <tbody>
                <tr>
                    <td style="border: 1px solid #000; height: 20px; width: 100%;"colspan="9">
                    <span>BANK ACCOUNT DETAILS:</span><span>BANK ACCOUNT NAME:</span><b id="bankname"></b>,
                    <span>ACCOUNT NUMBER:</span><b id="acc"></b>,<span>BANK NAME & ADDRESS:</span><b id="bname"></b>,<b id="add"></b>
                    <span>BRANCH CODE:</span><b id="code"></b>,<span>SWIFT CODE:</span><b id="scode"></b>,<span>IFSC CODE:</span><b id="ifsc"></b><br>
                   </td>
                </tr>
            </tbody>
            <tbody>
                <tr>
                    <td style="border: 1px solid #000; height: 20px; width: 100%;"colspan="5">
                    <span>Certified that the particulars given above are the true and correct and the amount indicated represents the price</span><br>
                    <span>actually charged from the consignee and that there is no additional consideration following directly or</span><br>
                    <span>indirectly over and above what has been declared herein.</span><br>
                    </td>
                    <td style="border: 1px solid #000; height: 20px; width: 100%;"></td>
		                    <td style="border: 1px solid #000; height: 20px; width: 100%;font-size:15px;" colspan="3">
		    <span>For JSW SEVERFIELD STRUCTURES LTD.</span><br>
		    <span style="margin-top: 20px; display: inline-block;">(Authorised signature)</span><br>
		</td>
        </tr>
            </tbody>
        </table>
       <div class="footer">
            <p>Regd Office:No.401,Grand Palladium,175 CST Road,Kalina,santacruz(East),Mumbai,IDIA-400 098 Ph:+91-22--67317000
            (All disputes subject to Karnataka Jurisdiction)E&OE</p>
        </div>
    </div>
    
    <div class="invoice-container1">
        <div class="invoice-header">
            <b><span id="topdate1"></span></b>
            <div class="gst-text">RECEIPT VOUCHER</div>
            <div class="gst-text1">Duplicate for Transporter</div>
        </div>
        
        <table class="company-details-table">
            <tr>
                <td colspan="2">
                    <div class="company-logo">
                    <img src="img/logo/download.png" alt="Company Logo" style="width: 80px;">
                      </div>
                    <strong>JSW Serverfiled Structures Limited</strong><br>
                    Near 10 MT Gate, Beside Cement Plant-2<br>
                    Vidyanagar P.O. Torangallu<br>
                    Torangallu-583275<br>
                    Ballari, Karnataka, India<br>
                    State Code:29<br>
                    GSTIN : 29AACCJ1473D1ZQ     PAN : AACCJ1473D<br>
                    ICE No: 0309033152   CIN No: U28112MH2009PLC191045<br>
                    Email: invoice@jssl.in    Website: www.jssl.in<br>
                </td>
                <td colspan="2">
                <b>Invoice No:</b> <span id="invoiceNumber1"></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b>Date:</b> <span id="date1"></span><br>
                <b>Contract No Reference No:</b> <span id="contrefno1"></span><br>
                <b>Date & Time of supply:</b> <span id="datetime1"></span><br>
                <b>Work/Purchase Order No:</b> <span id="workor1"></span><br>
                <b>Date of Order:</b> <span id="dateor1"></span><br>
            </tr>
            <tr>
                <td colspan="2"><strong>Invoice To:</strong><br>
                <span id="shipto111"></span><br>
                <b>Name of the state:</b> <span id="statename1"></span><br>
                <b>State Code:</b> <span id="stcode111"></span><br>
                <b>GSTIN:</b><span id="ingst1"></span><br>
                <b>PAN:</b><span id="panin1"></span><br>
                </td>
                <td colspan="2"><strong>Name & Address of consignee:</strong><br>
                <span id="conadd1"></span><br>
                <b>State Name:</b> <span id="state1"></span><br>
                <b>State Code:</b> <span id="stateco1"></span><br>
                <b>GSTIN:</b><span id="congst1"></span><br>
                <b>PAN:</b><span id="pancon1"></span><br>
                </td>
            </tr>
            <tr>
                <td><strong>Date of Notification</strong><br>
                 <strong>Exempted note under:</strong><br>
                 <strong>Tax is Payble on revese charge:(Yes/No):<span id="taxpayre1"></span></strong><br>
                 </td>
                <td><strong>Export Details:</strong><br>
                <strong>ARE No:<span id="areano1"></span></strong><br>
                <strong>LUT No:<span id="lutno1"></span></strong><br>
                <strong>Container No:<span id="contlo1"></span></strong><br>
                <strong>EPCG License No:<span id="epoglo1"></span></strong><br>
                </td>
                <td><b>Transporter:</b> <span id="trans1"></span><br>
                <b>Vehicle No:</b><span id="vehino1"></span><br>
                <b>LR/DOCKET No:<span id="lrdoc1"></span></b><br>
                <b>Date:<span id="lrdate1"></span></b><br>
                </td>
                <td><b>Shipment Mode:</b> <span id="shipmo1"></span><br>
                <b>Delivery Condition:</b> <span id="delcon1"></span><br>
                </td>
            </tr>
        </table>
        
        <table class="product-table">
            <thead>
                <tr>
                    <th>Sr No.</th>
                    <th>Product Description</th>
                    <th>Pieces</th>
                    <th>Service/HSN Code</th>
                    <th>UOM</th>
                    <th>Qty</th>
                    <th>Weight</th>
                    <th>Unit Price</th>
                    <th>Value (INR)</th>
                </tr>
            </thead>
            <tbody>
                ${tableRows} 
            </tbody>
            <tbody>
                <tr>
                    <td style="border: 1px solid #000; height: 10px;"" colspan="4">
                    <span>Freight</span><br>
                    </td>
                    <td style="border: 1px solid #000; height: 10px;" colspan="4"></td>
                    <td style="border: 1px solid #000; height: 10px;">
                    <span id="freight1"></span><br>
                    </td>
                </tr>
            </tbody>
            <tbody>
                <tr>
                    <td style="border: 1px solid #000; height: 10px;"" colspan="2">
                    <span>TOTAL</span><br>
                    </td>
                    <td style="border: 1px solid #000; height: 10px;">
                    <span id="pitotal1"></span><br></td>
                    </td>
                    <td style="border: 1px solid #000; height: 10px;"></td>
                    <td style="border: 1px solid #000; height: 10px;">
                    <td style="border: 1px solid #000; height: 10px;">
                    <span id="qtytotal1"></span><br></td>
                    </td>
                    <td style="border: 1px solid #000; height: 10px;">
                    <span id="wiegtotal1"></span><br>
                    </td>
                    <td style="border: 1px solid #000; height: 10px;"></td>
                    <td style="border: 1px solid #000; height: 10px;">
                    <span id="val111"></span><br>
                    </td>
                 </tr>
            </tbody>
            <tbody>
                ${taxRows}
            </tbody>
            <tbody>
                <tr>
                    <td style="border: 1px solid #000; height: 20px; width: 200px;" colspan="4">
                        <b>Note:</b><span>Identification Marks & Serial No. of Goods: As per packing list attached</span><br>
                        ${taxDetails} <!-- Dynamic Tax Name & Value in Words -->
                        <b>Gross total in words:</b> <b>${grandTotalInWords}</b><br>
                    </td>
                    <td style="border: 1px solid #000; height: 20px; width: 200px;" colspan="3">
                        <b>TOTAL INVOICE VALUE:</b><br>
                    </td>
                    <td style="border: 1px solid #000; height: 10px;" colspan="2">
                        <span>${grandTotalTax}</span><br> <!-- Dynamic Grand Total Tax -->
                    </td>              
                </tr>
            </tbody>
            <tbody>
                <tr>
                    <td style="border: 1px solid #000; height: 20px;width: 200px;">
                    <span>Particulars</span><br>
                    </td>
                    <td style="border: 1px solid #000; height: 20px;">
                    <span>Tax Application</span><br>
                    </td>
                    <td style="border: 1px solid #000; height: 20px;">
                    <span>Tax %</span><br>
                    </td>
                    <td style="border: 1px solid #000; height: 20px;">
                    <span>Adv Recovery (Taxable)</span><br>
                    </td>
                    <td style="border: 1px solid #000; height: 20px;">
                    <span>Adv Recovery (NonTax)</span><br>
                    </td>
                    <td style="border: 1px solid #000; height: 20px;">
                    <span>Invoice Value</span><br>
                    </td>
                    <td style="border: 1px solid #000; height: 20px;">
                    <span>Payable to dept</span><br>
                    </td>
                    <td style="border: 1px solid #000; height: 20px;" colspan="2">
                    <span>Payable by Customer</span><br>
                    </td>
                    </tr>
            </tbody>
            <tbody>
                <tr>
                    <td style="border: 1px solid #000; height: 20px;">
                    <span>${gstremarks}</span><br>
                    </td>
                    <td style="border: 1px solid #000; height: 20px;">
                    <span>Basic</span><br>
                    ${taxDetailsNew}
                    </td>
                    <td style="border: 1px solid #000; height: 20px;">
                    ${taxPerValue}
                    </td>
                    <td style="border: 1px solid #000; height: 20px;">
                    <span>${advremarks}</span><br>
                    ${taxadvanceValue}
                    </td>
                    <td style="border: 1px solid #000; height: 20px;">
                    <span>${advremarksnon}</span><br>
                    </td>
                    <td style="border: 1px solid #000; height: 20px;">
                    <span>${basicValue}</span><br>
                    ${taxValue}
                    </td>
                    <td style="border: 1px solid #000; height: 20px;">
                    ${taxValuedept}
                    </td>
                    <td style="border: 1px solid #000; height: 20px;" colspan="2">
                    <span>${basicValuecos}</span><br>
                    ${taxValuecos}
                    </td>
                    </tr>
            </tbody>
            <tbody>
                <tr>
                    <td style="border: 1px solid #000; height: 20px;" colspan="2">
                    <span>Total</span><br>
                    </td>
                    <td style="border: 1px solid #000; height: 20px;">
                    </td>
                    <td style="border: 1px solid #000; height: 20px;">
                    <span id="taxbasic1"></span><br>
                    </td>
                    <td style="border: 1px solid #000; height: 20px;">
                    </td>
                    <td style="border: 1px solid #000; height: 20px;">
                    <span id="grandlast1"></span><br>
                    </td>
                    <td style="border: 1px solid #000; height: 20px;">
                    <span id="taxtotal1"></span><br>
                    </td>
                    <td style="border: 1px solid #000; height: 20px;" colspan="2">
                    <span id="grandlast121"></span><br>
                    </td>
                </tr>
            </tbody>
            <tbody>
                <tr>
                    <td style="border: 1px solid #000; height: 20px; width: 100%;"colspan="9">
                    <span>BANK ACCOUNT DETAILS:</span><span>BANK ACCOUNT NAME:</span><b id="bankname1"></b>,
                    <span>ACCOUNT NUMBER:</span><b id="acc1"></b>,<span>BANK NAME & ADDRESS:</span><b id="bname1"></b>,<b id="add1"></b>
                    <span>BRANCH CODE:</span><b id="code1"></b>,<span>SWIFT CODE:</span><b id="scode1"></b>,<span>IFSC CODE:</span><b id="ifsc1"></b><br>
                   </td>
                </tr>
            </tbody>
            <tbody>
                <tr>
                    <td style="border: 1px solid #000; height: 20px; width: 100%;"colspan="5">
                    <span>Certified that the particulars given above are the true and correct and the amount indicated represents the price</span><br>
                    <span>actually charged from the consignee and that there is no additional consideration following directly or</span><br>
                    <span>indirectly over and above what has been declared herein.</span><br>
                    </td>
                    <td style="border: 1px solid #000; height: 20px; width: 100%;"></td>
		                    <td style="border: 1px solid #000; height: 20px; width: 100%;font-size:15px;" colspan="3">
		    <span>For JSW SEVERFIELD STRUCTURES LTD.</span><br>
		    <span style="margin-top: 20px; display: inline-block;">(Authorised signature)</span><br>
		</td>
        </tr>
            </tbody>
        </table>
       <div class="footer">
            <p>Regd Office:No.401,Grand Palladium,175 CST Road,Kalina,santacruz(East),Mumbai,IDIA-400 098 Ph:+91-22--67317000
            (All disputes subject to Karnataka Jurisdiction)E&OE</p>
        </div>
    </div>
    
    <div class="invoice-container2">
        <div class="invoice-header">
            <b><span id="topdate12"></span></b>
            <div class="gst-text">RECEIPT VOUCHER</div>
            <div class="gst-text1">Duplicate for Supplier</div>
        </div>
        
        <table class="company-details-table">
            <tr>
                <td colspan="2">
                    <div class="company-logo">
                    <img src="img/logo/download.png" alt="Company Logo" style="width: 80px;">
                      </div>
                    <strong>JSW Serverfiled Structures Limited</strong><br>
                    Near 10 MT Gate, Beside Cement Plant-2<br>
                    Vidyanagar P.O. Torangallu<br>
                    Torangallu-583275<br>
                    Ballari, Karnataka, India<br>
                    State Code:29<br>
                    GSTIN : 29AACCJ1473D1ZQ     PAN : AACCJ1473D<br>
                    ICE No: 0309033152   CIN No: U28112MH2009PLC191045<br>
                    Email: invoice@jssl.in    Website: www.jssl.in<br>
                </td>
                <td colspan="2">
                <b>Invoice No:</b> <span id="invoiceNumber12"></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b>Date:</b> <span id="date12"></span><br>
                <b>Contract No Reference No:</b> <span id="contrefno12"></span><br>
                <b>Date & Time of supply:</b> <span id="datetime12"></span><br>
                <b>Work/Purchase Order No:</b> <span id="workor12"></span><br>
                <b>Date of Order:</b> <span id="dateor12"></span><br>
            </tr>
            <tr>
                <td colspan="2"><strong>Invoice To:</strong><br>
                <span id="shipto1112"></span><br>
                <b>Name of the state:</b> <span id="statename12"></span><br>
                <b>State Code:</b> <span id="stcode1112"></span><br>
                <b>GSTIN:</b><span id="ingst12"></span><br>
                <b>PAN:</b><span id="panin12"></span><br>
                </td>
                <td colspan="2"><strong>Name & Address of consignee:</strong><br>
                <span id="conadd12"></span><br>
                <b>State Name:</b> <span id="state12"></span><br>
                <b>State Code:</b> <span id="stateco12"></span><br>
                <b>GSTIN:</b><span id="congst12"></span><br>
                <b>PAN:</b><span id="pancon12"></span><br>
                </td>
            </tr>
            <tr>
                <td><strong>Date of Notification</strong><br>
                 <strong>Exempted note under:</strong><br>
                 <strong>Tax is Payble on revese charge:(Yes/No):<span id="taxpayre12"></span></strong><br>
                 </td>
                <td><strong>Export Details:</strong><br>
                <strong>ARE No:<span id="areano12"></span></strong><br>
                <strong>LUT No:<span id="lutno12"></span></strong><br>
                <strong>Container No:<span id="contlo12"></span></strong><br>
                <strong>EPCG License No:<span id="epoglo12"></span></strong><br>
                </td>
                <td><b>Transporter:</b> <span id="trans12"></span><br>
                <b>Vehicle No:</b><span id="vehino12"></span><br>
                <b>LR/DOCKET No:<span id="lrdoc12"></span></b><br>
                <b>Date:<span id="lrdate12"></span></b><br>
                </td>
                <td><b>Shipment Mode:</b> <span id="shipmo12"></span><br>
                <b>Delivery Condition:</b> <span id="delcon12"></span><br>
                </td>
            </tr>
        </table>
        
        <table class="product-table">
            <thead>
                <tr>
                    <th>Sr No.</th>
                    <th>Product Description</th>
                    <th>Pieces</th>
                    <th>Service/HSN Code</th>
                    <th>UOM</th>
                    <th>Qty</th>
                    <th>Weight</th>
                    <th>Unit Price</th>
                    <th>Value (INR)</th>
                </tr>
            </thead>
            <tbody>
                ${tableRows} 
            </tbody>
            <tbody>
                <tr>
                    <td style="border: 1px solid #000; height: 10px;"" colspan="4">
                    <span>Freight</span><br>
                    </td>
                    <td style="border: 1px solid #000; height: 10px;" colspan="4"></td>
                    <td style="border: 1px solid #000; height: 10px;">
                    <span id="freight12"></span><br>
                    </td>
                </tr>
            </tbody>
            <tbody>
                <tr>
                    <td style="border: 1px solid #000; height: 10px;"" colspan="2">
                    <span>TOTAL</span><br>
                    </td>
                    <td style="border: 1px solid #000; height: 10px;">
                    <span id="pitotal12"></span><br></td>
                    </td>
                    <td style="border: 1px solid #000; height: 10px;"></td>
                    <td style="border: 1px solid #000; height: 10px;">
                    <td style="border: 1px solid #000; height: 10px;">
                    <span id="qtytotal12"></span><br></td>
                    </td>
                    <td style="border: 1px solid #000; height: 10px;">
                    <span id="wiegtotal12"></span><br>
                    </td>
                    <td style="border: 1px solid #000; height: 10px;"></td>
                    <td style="border: 1px solid #000; height: 10px;">
                    <span id="val1112"></span><br>
                    </td>
                 </tr>
            </tbody>
            <tbody>
                ${taxRows}
            </tbody>
            <tbody>
                <tr>
                    <td style="border: 1px solid #000; height: 20px; width: 200px;" colspan="4">
                        <b>Note:</b><span>Identification Marks & Serial No. of Goods: As per packing list attached</span><br>
                        ${taxDetails} <!-- Dynamic Tax Name & Value in Words -->
                        <b>Gross total in words:</b> <b>${grandTotalInWords}</b><br>
                    </td>
                    <td style="border: 1px solid #000; height: 20px; width: 200px;" colspan="3">
                        <b>TOTAL INVOICE VALUE:</b><br>
                    </td>
                    <td style="border: 1px solid #000; height: 10px;" colspan="2">
                        <span>${grandTotalTax}</span><br> <!-- Dynamic Grand Total Tax -->
                    </td>              
                </tr>
            </tbody>
            <tbody>
                <tr>
                    <td style="border: 1px solid #000; height: 20px;width: 200px;">
                    <span>Particulars</span><br>
                    </td>
                    <td style="border: 1px solid #000; height: 20px;">
                    <span>Tax Application</span><br>
                    </td>
                    <td style="border: 1px solid #000; height: 20px;">
                    <span>Tax %</span><br>
                    </td>
                    <td style="border: 1px solid #000; height: 20px;">
                    <span>Adv Recovery (Taxable)</span><br>
                    </td>
                    <td style="border: 1px solid #000; height: 20px;">
                    <span>Adv Recovery (NonTax)</span><br>
                    </td>
                    <td style="border: 1px solid #000; height: 20px;">
                    <span>Invoice Value</span><br>
                    </td>
                    <td style="border: 1px solid #000; height: 20px;">
                    <span>Payable to dept</span><br>
                    </td>
                    <td style="border: 1px solid #000; height: 20px;" colspan="2">
                    <span>Payable by Customer</span><br>
                    </td>
                    </tr>
            </tbody>
            <tbody>
                <tr>
                    <td style="border: 1px solid #000; height: 20px;">
                    <span>${gstremarks}</span><br>
                    </td>
                    <td style="border: 1px solid #000; height: 20px;">
                    <span>Basic</span><br>
                    ${taxDetailsNew}
                    </td>
                    <td style="border: 1px solid #000; height: 20px;">
                    ${taxPerValue}
                    </td>
                    <td style="border: 1px solid #000; height: 20px;">
                    <span>${advremarks}</span><br>
                    ${taxadvanceValue}
                    </td>
                    <td style="border: 1px solid #000; height: 20px;">
                    <span>${advremarksnon}</span><br>
                    </td>
                    <td style="border: 1px solid #000; height: 20px;">
                    <span>${basicValue}</span><br>
                    ${taxValue}
                    </td>
                    <td style="border: 1px solid #000; height: 20px;">
                    ${taxValuedept}
                    </td>
                    <td style="border: 1px solid #000; height: 20px;" colspan="2">
                    <span>${basicValuecos}</span><br>
                    ${taxValuecos}
                    </td>
                    </tr>
            </tbody>
            <tbody>
                <tr>
                    <td style="border: 1px solid #000; height: 20px;" colspan="2">
                    <span>Total</span><br>
                    </td>
                    <td style="border: 1px solid #000; height: 20px;">
                    </td>
                    <td style="border: 1px solid #000; height: 20px;">
                    <span id="taxbasic12"></span><br>
                    </td>
                    <td style="border: 1px solid #000; height: 20px;">
                    </td>
                    <td style="border: 1px solid #000; height: 20px;">
                    <span id="grandlast12"></span><br>
                    </td>
                    <td style="border: 1px solid #000; height: 20px;">
                    <span id="taxtotal12"></span><br>
                    </td>
                    <td style="border: 1px solid #000; height: 20px;" colspan="2">
                    <span id="grandlast1212"></span><br>
                    </td>
                </tr>
            </tbody>
            <tbody>
                <tr>
                    <td style="border: 1px solid #000; height: 20px; width: 100%;"colspan="9">
                    <span>BANK ACCOUNT DETAILS:</span><span>BANK ACCOUNT NAME:</span><b id="bankname12"></b>,
                    <span>ACCOUNT NUMBER:</span><b id="acc12"></b>,<span>BANK NAME & ADDRESS:</span><b id="bname12"></b>,<b id="add12"></b>
                    <span>BRANCH CODE:</span><b id="code12"></b>,<span>SWIFT CODE:</span><b id="scode12"></b>,<span>IFSC CODE:</span><b id="ifsc12"></b><br>
                   </td>
                </tr>
            </tbody>
            <tbody>
                <tr>
                    <td style="border: 1px solid #000; height: 20px; width: 100%;"colspan="5">
                    <span>Certified that the particulars given above are the true and correct and the amount indicated represents the price</span><br>
                    <span>actually charged from the consignee and that there is no additional consideration following directly or</span><br>
                    <span>indirectly over and above what has been declared herein.</span><br>
                    </td>
                    <td style="border: 1px solid #000; height: 20px; width: 100%;"></td>
		                    <td style="border: 1px solid #000; height: 20px; width: 100%;font-size:15px;" colspan="3">
		    <span>For JSW SEVERFIELD STRUCTURES LTD.</span><br>
		    <span style="margin-top: 20px; display: inline-block;">(Authorised signature)</span><br>
		</td>
        </tr>
            </tbody>
        </table>
       <div class="footer">
            <p>Regd Office:No.401,Grand Palladium,175 CST Road,Kalina,santacruz(East),Mumbai,IDIA-400 098 Ph:+91-22--67317000
            (All disputes subject to Karnataka Jurisdiction)E&OE</p>
        </div>
    </div>
   </body>
</html>
` 
    const printElement = document.createElement('div');
        printElement.innerHTML = htmlContent;
        console.log(printElement)
        // page1
     printElement.querySelector('#datetime').textContent = formattedDateTime;
     printElement.querySelector('#topdate').textContent = formattedDateTime;
     printElement.querySelector('#dateor').textContent = work_date;
     printElement.querySelector('#date').textContent = currentDate;
     printElement.querySelector('#invoiceNumber').textContent = invoiceno;
     printElement.querySelector('#shipto11').textContent = invoice_to_id_value;
     printElement.querySelector('#taxpayre').textContent = tax_payable;
     printElement.querySelector('#areano').textContent = area_no;
     printElement.querySelector('#contlo').textContent = containter_no;
     printElement.querySelector('#lutno').textContent = lot_no;
     printElement.querySelector('#epoglo').textContent = epcgno;
     printElement.querySelector('#trans').textContent = transport_name;
     printElement.querySelector('#lrdoc').textContent = lr_docketno;
     printElement.querySelector('#lrdate').textContent = date_val;
     printElement.querySelector('#shipmo').textContent = shipment_mode_id_value;
     printElement.querySelector('#delcon').textContent = delivery_condition_id_value;
     printElement.querySelector('#conadd').textContent = consignee_id_value;
     printElement.querySelector('#workor').textContent = work_id_value;
     printElement.querySelector('#vehino').textContent = vechile_no;
     printElement.querySelector('#contrefno').textContent = con_code_with_lot_no;
     printElement.querySelector('#statename').textContent = invoiceStateName;
     printElement.querySelector('#state').textContent = consigneeStateName;
     printElement.querySelector('#stateco').textContent = consigneeStateCode;
     printElement.querySelector('#stcode11').textContent = invoiceStateCode;
     printElement.querySelector('#congst').textContent = consigneeGstNo;
     printElement.querySelector('#ingst').textContent = invoiceGstNo;
     printElement.querySelector('#pancon').textContent = consigneePanNo;
     printElement.querySelector('#panin').textContent = invoicePanNo;
     printElement.querySelector('#freight').textContent = freight;
     printElement.querySelector('#pitotal').textContent = total_pices;
     printElement.querySelector('#qtytotal').textContent = total_qty;
     printElement.querySelector('#wiegtotal').textContent = total_kgs;
     printElement.querySelector('#val11').textContent = basic_value;
     printElement.querySelector('#grandlast').textContent = Grand_Total_tax;
     printElement.querySelector('#grandlast12new').textContent = PBC_Final_total;
     printElement.querySelector('#bankname').textContent = bankName;
     printElement.querySelector('#acc').textContent = account_number;
     printElement.querySelector('#bname').textContent = branch_address;
     printElement.querySelector('#code').textContent = branch_code;
     printElement.querySelector('#scode').textContent = swift_code;
     printElement.querySelector('#ifsc').textContent = ifsc_code;
     printElement.querySelector('#taxbasic').textContent = Total_adv_tax_Taxable;
     printElement.querySelector('#taxtotal').textContent = Tax_Final_total;
     //printElement.querySelector('#prodesc').textContent = product_desc;
     
     //page 2
     printElement.querySelector('#datetime1').textContent = formattedDateTime;
     printElement.querySelector('#topdate1').textContent = formattedDateTime;
     printElement.querySelector('#dateor1').textContent = currentDate;
     printElement.querySelector('#date1').textContent = currentDate;
     printElement.querySelector('#invoiceNumber1').textContent = invoiceno;
     printElement.querySelector('#shipto111').textContent = invoice_to_id_value;
     printElement.querySelector('#taxpayre1').textContent = tax_payable;
     printElement.querySelector('#areano1').textContent = area_no;
     printElement.querySelector('#contlo1').textContent = containter_no;
     printElement.querySelector('#lutno1').textContent = lot_no;
     printElement.querySelector('#epoglo1').textContent = epcgno;
     printElement.querySelector('#trans1').textContent = transport_name;
     printElement.querySelector('#lrdoc1').textContent = lr_docketno;
     printElement.querySelector('#lrdate1').textContent = date_val;
     printElement.querySelector('#shipmo1').textContent = shipment_mode_id_value;
     printElement.querySelector('#delcon1').textContent = delivery_condition_id_value;
     printElement.querySelector('#conadd1').textContent = consignee_id_value;
     printElement.querySelector('#workor1').textContent = work_id_value;
     printElement.querySelector('#vehino1').textContent = vechile_no;
     printElement.querySelector('#contrefno1').textContent = con_code_with_lot_no;
     printElement.querySelector('#statename1').textContent = invoiceStateName;
     printElement.querySelector('#state1').textContent = consigneeStateName;
     printElement.querySelector('#stateco1').textContent = consigneeStateCode;
     printElement.querySelector('#stcode111').textContent = invoiceStateCode;
     printElement.querySelector('#congst1').textContent = consigneeGstNo;
     printElement.querySelector('#ingst1').textContent = invoiceGstNo;
     printElement.querySelector('#pancon1').textContent = consigneePanNo;
     printElement.querySelector('#panin1').textContent = invoicePanNo;
     printElement.querySelector('#freight1').textContent = freight;
     printElement.querySelector('#pitotal1').textContent = total_pices;
     printElement.querySelector('#qtytotal1').textContent = total_qty;
     printElement.querySelector('#wiegtotal1').textContent = total_kgs;
     printElement.querySelector('#val111').textContent = basic_value;
     printElement.querySelector('#grandlast1').textContent = Grand_Total_tax;
     printElement.querySelector('#grandlast121').textContent = PBC_Final_total;
     printElement.querySelector('#bankname1').textContent = bankName;
     printElement.querySelector('#acc1').textContent = account_number;
     printElement.querySelector('#bname1').textContent = branch_address;
     printElement.querySelector('#code1').textContent = branch_code;
     printElement.querySelector('#scode1').textContent = swift_code;
     printElement.querySelector('#ifsc1').textContent = ifsc_code;
     printElement.querySelector('#taxbasic1').textContent = Total_adv_tax_Taxable;
     printElement.querySelector('#taxtotal1').textContent = Tax_Final_total;
     
     //page 3
     printElement.querySelector('#datetime12').textContent = formattedDateTime;
     printElement.querySelector('#topdate12').textContent = formattedDateTime;
     printElement.querySelector('#dateor12').textContent = currentDate;
     printElement.querySelector('#date12').textContent = currentDate;
     printElement.querySelector('#invoiceNumber12').textContent = invoiceno;
     printElement.querySelector('#shipto1112').textContent = invoice_to_id_value;
     printElement.querySelector('#taxpayre12').textContent = tax_payable;
     printElement.querySelector('#areano12').textContent = area_no;
     printElement.querySelector('#contlo12').textContent = containter_no;
     printElement.querySelector('#lutno12').textContent = lot_no;
     printElement.querySelector('#epoglo12').textContent = epcgno;
     printElement.querySelector('#trans12').textContent = transport_name;
     printElement.querySelector('#lrdoc12').textContent = lr_docketno;
     printElement.querySelector('#lrdate12').textContent = date_val;
     printElement.querySelector('#shipmo12').textContent = shipment_mode_id_value;
     printElement.querySelector('#delcon12').textContent = delivery_condition_id_value;
     printElement.querySelector('#conadd12').textContent = consignee_id_value;
     printElement.querySelector('#workor12').textContent = work_id_value;
     printElement.querySelector('#vehino12').textContent = vechile_no;
     printElement.querySelector('#contrefno12').textContent = con_code_with_lot_no;
     printElement.querySelector('#statename12').textContent = invoiceStateName;
     printElement.querySelector('#state12').textContent = consigneeStateName;
     printElement.querySelector('#stateco12').textContent = consigneeStateCode;
     printElement.querySelector('#stcode1112').textContent = invoiceStateCode;
     printElement.querySelector('#congst12').textContent = consigneeGstNo;
     printElement.querySelector('#ingst12').textContent = invoiceGstNo;
     printElement.querySelector('#pancon12').textContent = consigneePanNo;
     printElement.querySelector('#panin12').textContent = invoicePanNo;
     printElement.querySelector('#freight12').textContent = freight;
     printElement.querySelector('#pitotal12').textContent = total_pices;
     printElement.querySelector('#qtytotal12').textContent = total_qty;
     printElement.querySelector('#wiegtotal12').textContent = total_kgs;
     printElement.querySelector('#val1112').textContent = basic_value;
     printElement.querySelector('#grandlast12').textContent = Grand_Total_tax;
     printElement.querySelector('#grandlast1212').textContent = PBC_Final_total;
     printElement.querySelector('#bankname12').textContent = bankName;
     printElement.querySelector('#acc12').textContent = account_number;
     printElement.querySelector('#bname12').textContent = branch_address;
     printElement.querySelector('#code12').textContent = branch_code;
     printElement.querySelector('#scode12').textContent = swift_code;
     printElement.querySelector('#ifsc12').textContent = ifsc_code;
     printElement.querySelector('#taxbasic12').textContent = Total_adv_tax_Taxable;
     printElement.querySelector('#taxtotal12').textContent = Tax_Final_total;
     
    const doc = new window.jspdf.jsPDF();

        doc.html(printElement, {
            callback: function (doc) {
               doc.save(`Advance_Invoice_${invoiceno}.pdf`);
            },
            x: 6,
            y: 6,
            width: 165,
            windowWidth: 1000
         });
         

    } catch (error) {
        console.error('Error generating PDF:', error);
    }
   
} */


async function printRecord(id) {
    if (!allowed.includes("Print")) {
        alert("You do not have permission to print.");
        console.warn("Blocked print attempt. User lacks Print permission.");
        return;
    }

    showLoader();

    // ─── HELPER: Format numbers with Indian comma style ───────────────────────
    function formatAmount(value) {
        if (!value && value !== 0) return '';
        const num = parseFloat(String(value).replace(/,/g, ''));
        if (isNaN(num)) return value;
        return num.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    try {
        const url = new URL(`/jssl/invoice/searchadvidnew?id=${id}`, baseUrl);
        const response = await fetch(url, { method: "GET", credentials: "include" });
        if (!response.ok) throw new Error("Failed to fetch data");

        const json = await response.json();
        const Invoice_Data      = json.Invoice_Data;
        const Contractor_Data   = json.Contractor_Data;
        const QsPacking_Data    = json.QsPacking_Data;
        const tax               = json.tax;
        const Grand_Total_value = json.Grand_Total_value;

        const Grand_Total_tax        = Grand_Total_value[0].Grand_Total_tax;
        const Total_adv_tax_Taxable  = Grand_Total_value[0].Total_adv_tax_Taxable;
        const Tax_Final_total        = Grand_Total_value[0].Tax_Final_total;
        const PBC_Final_total        = Grand_Total_value[0].PBC_Final_total;

        const invoiceno   = Invoice_Data.invoice_no;
        const lr_docketno = Invoice_Data.lr_docketno;
        const date_val    = Invoice_Data.date_val;
        //const factory_id  = Invoice_Data.factory_id;
        const cancel      = Invoice_Data.cancel;
        const productdesc = Invoice_Data.product_desc;

        // ── Factory Data ──────────────────────────────────────────────────────
        const url_factory      = new URL(`/jssl/factory/getAllFactoryListSS`, baseUrl);
        const response_factory = await fetch(url_factory, { method: "GET", credentials: "include" });
        if (!response_factory.ok) throw new Error("Failed to fetch factory data");
        const factory_json = await response_factory.json();

        const factory_data_map     = factory_json.FactoryDetails;
       // const FactoryDataBasedById = factory_data_map.find(f => f.id === factory_id);
        const MumbaiAddress        = factory_data_map.find(f => f.id === "4");

        const reg_addresss    = MumbaiAddress.address;
		// ── Business Unit Address (cleaned, trimmed, no stray commas) ──────────
		        const address = Contractor_Data[0].businessUnitName
		            .split(',')
		            .slice(1)
		            .map(x => x.trim())
		            .filter(x => x !== "")
		            .join(', ');
		const factory_Address = address;
       // const factory_Address = FactoryDataBasedById.address;
	   // ── Business Unit State Code / GSTIN / PAN (pulled from Contractor_Data) ─
	    const state_Code     = Contractor_Data[0].businessStateName;
	    const Gst_Code       = Contractor_Data[0].businessgstNumber;
	   	const Pan_Code       = Contractor_Data[0].businesspanNumber;
        // ── Contractor / Invoice Fields ───────────────────────────────────────
        const invoice_to_id_value         = Contractor_Data[0].invoice_to_id_value;
        const tax_payable                 = Contractor_Data[0].tax_payable == 1 ? "No" : "Yes";
        const area_no                     = Contractor_Data[0].area_no;
        const lot_no                      = Contractor_Data[0].lot_no;
        const containter_no               = Contractor_Data[0].containter_no;
        const epcgno                      = Contractor_Data[0].epcgno;
        const shipment_mode_id_value      = Contractor_Data[0].shipment_mode_id_value;
        const delivery_condition_id_value = Contractor_Data[0].delivery_condition_id_value;
        const consignee_id_value          = Contractor_Data[0].consignee_id_value;
        const work_id_value               = Contractor_Data[0].work_id_value;
        const invoiceStateName            = Contractor_Data[0].invoiceStateName;
        const consigneeStateName          = Contractor_Data[0].consigneeStateName;
        const invoiceStateCode            = Contractor_Data[0].invoiceStateCode;
        const consigneeStateCode          = Contractor_Data[0].consigneeStateCode;
        const invoiceGstNo                = Contractor_Data[0].invoiceGstNo;
        const consigneeGstNo              = Contractor_Data[0].consigneeGstNo;
        const invoicePanNo                = Contractor_Data[0].invoicePanNo;
        const consigneePanNo              = Contractor_Data[0].consigneePanNo;
        const bankName                    = Contractor_Data[0].org_name;
        const account_number              = Contractor_Data[0].account_number;
        const branch_address              = Contractor_Data[0].bankName + ' ' + Contractor_Data[0].branch_address;
        const branch_code                 = Contractor_Data[0].branch_code;
        const swift_code                  = Contractor_Data[0].swift_code;
        const ifsc_code                   = Contractor_Data[0].ifsc_code;
        const work_date                   = Contractor_Data[0].work_date;

        const transport_name       = QsPacking_Data[0].transport_name;
        const vechile_no           = QsPacking_Data[0].vechile_no;
        const con_code_with_lot_no = QsPacking_Data[0].con_code_with_lot_no;

        const freight     = tax[0].freight;
        const total_kgs   = tax[0].total_kgs;
        const total_qty   = tax[0].total_qty;
        const basic_value = tax[0].basic_value;

        const items          = json.QsPacking_Data || [];
        const taxData        = json.tax || [];
        const InvoiceData    = json.Invoice_Data || [];
        const grandTotalData = json.Grand_Total_value?.[0] || {};

        const grandTotalInWords = grandTotalData.GrandTotalInWords || '';
        const grandTotalTax     = grandTotalData.Grand_Total_tax   || '';
        const gstremarks        = InvoiceData.gst_remarks          || '';
        const advremarks        = taxData[0]?.taxable              || '';
        const advremarksnon     = taxData[0]?.non_taxable          || '';
        const basicValue        = taxData[0]?.basic_value          || '';
        const basicValuecos     = taxData[0]?.optc                 || '';

        // ── Product Table Rows ────────────────────────────────────────────────
        const maxRows = 10;
        let tableRows = "";

        items.forEach((item, index) => {
            tableRows += `
                <tr class="product-row">
                    <td colspan="1" style="text-align:right;">${index + 1}</td>
                    <td colspan="4" class="desc-col descri">${item.scrap_name_type_id || ''}</td>
                    <td colspan="1" style="text-align:right !important;">${item.serviceCode || ''}</td>
                    <td colspan="1" style="text-align:left !important;">${item.uom_name || ''}</td>
                    <td colspan="1" class="qtys">${item.qty || ''}</td>
                    <td colspan="2" class="weits">${item.per_kgs || ''}</td>
                    <td colspan="1" class="prs">${formatAmount(item.unit_price) || ''}</td>
                    <td colspan="2" class="tols">${formatAmount(item.total) || ''}</td>
                </tr>`;
        });

        const emptyCount = Math.max(0, maxRows - items.length);
        for (let i = 0; i < emptyCount; i++) {
            if (i === 1) {
                tableRows += `
                    <tr class="empty-row">
                        <td colspan="1">&nbsp;</td>
                        <td colspan="4" style="font-weight:550;">${productdesc || ''}</td>
                        <td colspan="1"></td>
                        <td colspan="1"></td>
                        <td colspan="1"></td>
                        <td colspan="2"></td>
                        <td colspan="1"></td>
                        <td colspan="2"></td>
                    </tr>`;
            } else {
                tableRows += `
                    <tr class="empty-row">
                        <td colspan="1">&nbsp;</td>
                        <td colspan="4"></td>
                        <td colspan="1"></td>
                        <td colspan="1"></td>
                        <td colspan="1"></td>
                        <td colspan="2"></td>
                        <td colspan="1"></td>
                        <td colspan="2"></td>
                    </tr>`;
            }
        }

        // ── Tax Rows ──────────────────────────────────────────────────────────
        let taxRows = taxData.map((tax, i, arr) => {
            const isLast = i === arr.length - 1;
            return `
                <tr>
                    <td colspan="10" class="tax-name" style="${isLast ? '' : 'border-bottom:none;'}">
                        ${tax.tax_name || ''}
                    </td>
                    <td colspan="1" class="tax-per" style="${isLast ? '' : 'border-bottom:none;'}">
                        ${tax.tax_per || ''} %
                    </td>
                    <td colspan="2" class="tax-per" style="${isLast ? '' : 'border-bottom:none;'}">
                        ${formatAmount(tax.tax_value)}
                    </td>
                </tr>`;
        }).join('');

        // ── Tax Description Blocks ────────────────────────────────────────────
        let taxDetails      = taxData.map(tax => `<b>${tax.tax_name}:</b> ${tax.tax_value_in_words}<br>`).join('');
        let taxDetailsNew   = taxData.map(tax => `<b>${tax.tax_name}</b><br>`).join('');
        let taxPerValue     = taxData.map(tax => `<b>${tax.tax_per}</b><br>`).join('');
        let taxValue        = taxData.map(tax => `<b>${formatAmount(tax.tax_value)}</b><br>`).join('');
        let taxValuedept    = taxData.map(tax => `<b>${formatAmount(tax.ptc)}</b><br>`).join('');
        let taxValuecos     = taxData.map(tax => `<b>${formatAmount(tax.ptc)}</b><br>`).join('');
        let taxadvanceValue = taxData.map(tax => `<b>${formatAmount(tax.adv_tax)}</b><br>`).join('');

        // ── Date Formatting ───────────────────────────────────────────────────
        const currentDate = new Date().toLocaleDateString('en-GB', {
            day: '2-digit', month: '2-digit', year: 'numeric'
        }).replace(/\//g, '-');

        const currentDate1 = new Date();
        const formattedDateTime =
            String(currentDate1.getDate()).padStart(2, '0') + '-' +
            String(currentDate1.getMonth() + 1).padStart(2, '0') + '-' +
            currentDate1.getFullYear() + ' ' +
            String(currentDate1.getHours()).padStart(2, '0') + ':' +
            String(currentDate1.getMinutes()).padStart(2, '0') + ':' +
            String(currentDate1.getSeconds()).padStart(2, '0');

        // ── HTML Template ─────────────────────────────────────────────────────
        const htmlContent = `
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');

                * { box-sizing: border-box; }

                .watermark {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%) rotate(-45deg);
                    font-size: 120px;
                    font-weight: bold;
                    opacity: 0.15;
                    pointer-events: none;
                    z-index: 9999;
                    white-space: nowrap;
                    letter-spacing: 10px;
                }
                .watermark.cancelled { color: #ff0000; }
                .watermark.verified  { color: #4CAF50; }

                .page { position: relative; }

                html, body {
                    margin: 0;
                    padding: 0;
                    font-family: "Times New Roman", Times, serif;
                    color: black !important;
                    background-color: #fff !important;
                    font-size: 10px;
                    line-height: 2;
                }

                .page {
                    width: 202mm;
                    height: 297mm;
                    overflow: visible;
                    page-break-after: avoid !important;
                    margin: 0;
                    padding: 0;
                }
                .page:last-child { page-break-after: avoid !important; }

                .invoice-container {
                    width: 100%;
                    height: auto;
                    overflow: visible;
                    -webkit-font-smoothing: antialiased;
                    text-rendering: geometricPrecision;
                    page-break-inside: avoid;
                    margin: 0;
                    padding: 1mm;
                }

                table {
                    border-collapse: collapse !important;
                    table-layout: fixed;
                    page-break-inside: avoid;
                    width: 100%;
                    margin: 0;
                    padding: 0;
                }

                td, th {
                    border-right: 0.5px solid #000;
                    border-bottom: 0.5px solid #000;
                    padding: 2px 4px;
                    vertical-align: top;
                    font-size: 10px;
                    line-height: 1.05;
                    word-wrap: break-word;
                }

                tr { page-break-inside: avoid; }
                tr:first-child th { border-top: 0.5px solid #000; }

                td:first-child,
                th:first-child { border-left: 0.5px solid #000; }

                .company-details-table { border-top: 0.5px solid #000 !important; }

                .header, .footer { text-align: center; margin: 0; padding: 0; }

                .invoice-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 2mm;
                }

                .gst-text {
                    font-size: 15px;
                    font-weight: 500;
                    text-align: center;
                    margin-left: 300px !important;
                }

                .copy-label { font-size: 12px; font-weight: normal; }

                td br, th br { display: block; margin: 0; line-height: 1; }

                .company-details-table td { padding: 4px; font-size: 11px !important; }

                .company-logo img { width: 60px; height: auto; display: block; margin-bottom: 2px; }

                .product-row td:nth-child(n+4) { text-align: right !important; }

                .product-row td,
                .empty-row td { height: 22px; }

                .empty-row td { border-top: none !important; border-bottom: none !important; }

                .last-product td { border-bottom: none !important; }

                .product-table .desc-col {
                    line-height: 1.5 !important;
                    white-space: normal;
                    word-break: break-word;
                }

                .product-table .fright-row .fright-data { line-height: 1.6 !important; padding: 5px !important; }

                .total-body .total-datatd  { line-height: 1.6 !important; padding: 5px !important; }
                .total-body .total-datatds { line-height: 2.5 !important; text-align: right !important; }

                .desc-col.descri { font-size: 7px !important; padding: 1px !important; }
                .desc-col.tols   { text-align: right !important; }
                .desc-col.prs    { text-align: right !important; }
                .desc-col.weits  { text-align: right !important; }
                .desc-col.qtys   { text-align: right !important; }

                .product-table th,
                .product-table td { padding: 3px 5px; line-height: 1.2; }

                .product-row td { border-bottom: none; }

                .freight-vlaue { text-align: right !important; }
                .fright-row    { border: 0.5px solid #000 !important; }

                .tax-row .tax-name {
                    line-height: 0.8 !important;
                    text-align: right !important;
                    padding: 5px !important;
                }
                .tax-row .tax-per { text-align: right !important; vertical-align: middle !important; }

                .total-word .total-words-des {
                    line-height: 1.2 !important;
                    font-size: 8px !important;
                    padding: 0 0 5px 5px !important;
                }
                .total-words-des.ss { vertical-align: middle !important; }
                .total-word .total-words-val { text-align: right !important; vertical-align: middle !important; }

                .particulars-row { line-height: 1 !important; }
                .particulars-row td { padding-top: 5px !important; }
                .particulars-row .particulars-row-prtd { font-size: 8px !important; }

                .particulars-row-body { padding-top: 5px !important; }
                .particulars-row-body .particulars-row-body-td {
                    text-align: right !important;
                    font-size: 8px !important;
                }

                .td-body-tax { text-align: right !important; line-height: 2 !important; }

                .Bank_details { line-height: 1.8 !important; font-size: 8px !important; }

                .last-data td {
                    line-height: 1.5 !important;
                    font-size: 9px !important;
                    padding-top: 6px !important;
                }
                .last-data td:last-child { text-align: center !important; vertical-align: middle !important; }
                .last-data td:last-child span { display: block; text-align: center; }

                .footer { padding-top: 6px !important; }
                .footer p { font-size: 9px; line-height: 1.2; margin: 0; padding: 0; }

                .invoice-line { display: flex; justify-content: space-between; width: 80%; }

                .fixed-8px td { font-size: 8px !important; line-height: 1.1 !important; }

                .terms { margin-top: 2mm; }

                .header, .footer, .gst-text, .copy-label { text-align: center; }

                .samefontweight { font-weight: 550; }

                .fulladdress,
                .conaddress,
                .facotry_address {
                    white-space: pre-line;
                    display: inline-block;
                    line-height: 1.5;
                }
            </style>

            <div class="invoice-container">
                ${cancel === 'true' ? `<div class="watermark cancelled">CANCELLED</div>` : ''}

                <div class="invoice-header">
                    <b>   </b>
                    <div class="gst-text">RECEIPT VOUCHER</div>
                    <div class="gst-text1 copy-label">Original For Recipient</div>
                </div>

                <table class="company-details-table">
                    <tr>
					<td colspan="6">
					    <div class="company-logo">
					        <img src="img/logo/download.png" alt="Company Logo" style="width:100px;">
					        </div>
					      <strong>JSW Serverfiled Structures Limited</strong><br>
					      <span class="facotry_address"></span>
					       <p>
					        <b>State Code:</b> <span class="state_code"></span><br>
					        <b>GSTIN:</b> <span class="gst_code"></span> &nbsp; 
							<b>PAN:</b> <span class="pan_code"></span><br>
					        <b>ICE No:</b> 0309033152 &nbsp; <b>CIN No:</b> U28112MH2009PLC191045<br>
					        <b>Email:</b> invoice@jssl.in &nbsp; <b>Website:</b> www.jssl.in<br>
					         </td>
                        <td colspan="6">
                            <br>
                            <div class="invoice-line">
                                <div style="font-size:12px;"><span class="samefontweight">Invoice No: </span><span class="invoiceNumber"></span></div>
                                <div><span class="samefontweight">Date:</span> <span class="date"></span></div>
                            </div>
                            <br>
                            <span class="samefontweight">Contract No Reference No:</span> <span class="contrefno"></span><br>
                            <span class="samefontweight">Date &amp; Time of supply:</span> <span class="datetime"></span><br>
                            <br>
                            <span class="samefontweight">Work/Purchase Order No:</span> <span class="workor"></span><br>
                            <span class="samefontweight">Date of Order:</span> <span class="dateor"></span><br>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="6" style="font-size:10px; line-height:1.3;">
                            <b>Invoice To :<br>
                            <span class="shipto11"></span></b><br>
                            <span class="shipto11add2"></span><br>
                            <span class="shipto11add3"></span>
                            <span class="fulladdress" style="white-space:pre-line;"></span><br><br>
                            <b>Place of Supply : <span class="placeofsupply"></span></b><br><br>
                            <b>
                                Name of the State : <span class="statename"></span><br>
                                State Code : <span class="stcode11"></span><br>
                                GSTIN : <span class="ingst"></span><br>
                                PAN : <span class="panin"></span><br>
                            </b>
                        </td>
                        <td colspan="6" style="font-size:10px; line-height:1.3;">
                            <b>Name &amp; Address of consignee:<br>
                            <span class="conname"></span></b><br>
                            <span class="conname1"></span><br>
                            <span class="conname2"></span><br>
                            <span class="conaddress" style="white-space:pre-line;"></span><br><br>
                            <b>
                                Name of the State: <span class="state"></span><br>
                                State Code: <span class="stateco"></span><br>
                                GSTIN: <span class="congst"></span><br>
                                PAN: <span class="pancon"></span><br>
                            </b>
                        </td>
                    </tr>
                    <tr class="fixed-8px">
                        <td colspan="3" class="notif-cell">
                            <span class="samefontweight">Date of Notification</span><br>
                            <span class="samefontweight">Exempted note under:</span><br>
                            <span class="samefontweight">Tax is Payable on reverse charge (Yes/No):</span> <span class="taxpayre"></span><br>
                        </td>
                        <td colspan="3" style="font-size:7px;">
                            <span class="samefontweight">Export Details:</span><br>
                            <span class="samefontweight">ARE No:</span> <span class="areano"></span><br>
                            <span class="samefontweight">LUT No:</span> <span class="lutno"></span><br>
                            <span class="samefontweight">Container No:</span> <span class="contlo"></span><br>
                            <span class="samefontweight">EPCG License No:</span> <span class="epoglo"></span><br>
                        </td>
                        <td colspan="3" style="font-size:7px;">
                            <span class="samefontweight">Transporter:</span> <span class="trans"></span><br>
                            <span class="samefontweight">Vehicle No:</span> <span class="vehino"></span><br>
                            <span class="samefontweight">LR/DOCKET No:</span> <span class="lrdoc"></span><br>
                            <span class="samefontweight">Date:</span> <span class="lrdate"></span><br>
                        </td>
                        <td colspan="3" style="font-size:7px;">
                            <span class="samefontweight">Shipment Mode:</span> <span class="shipmo"></span><br>
                            <span class="samefontweight">Delivery Condition:</span> <span class="delcon"></span><br>
                        </td>
                    </tr>
                </table>

                <table class="product-table">
                    <thead>
                        <tr>
                            <th class="desc-col" colspan="1" style="width:5%;">Sr No.</th>
                            <th class="desc-col" colspan="4">Product Description</th>
                            <th class="desc-col" colspan="1" style="width:10%;">Service/HSN Code</th>
                            <th class="desc-col" colspan="1">UOM</th>
                            <th class="desc-col" colspan="1">Qty/Nos</th>
                            <th class="desc-col" colspan="2" style="text-align:center;">Weight<br>(Kgs/Mt/Sq Mts)</th>
                            <th class="desc-col" colspan="1" style="width:10%;">Unit Price</th>
                            <th class="desc-col" colspan="2">Value (INR)</th>
                        </tr>
                    </thead>
                    <tbody id="product_table_data">
                        ${tableRows}
                    </tbody>
                    <tbody>
                        <tr class="fright-row">
                            <td class="fright-data" colspan="11"><span>Freight</span><br></td>
                            <td class="fright-data freight-vlaue" colspan="2"><span class="freight"></span><br></td>
                        </tr>
                    </tbody>
                    <tbody class="total-body">
                        <tr>
                            <td colspan="7" class="total-datatd"><span>TOTAL</span><br></td>
                            <td class="total-datatds"><span class="qtytotal"></span><br></td>
                            <td colspan="2" class="total-datatds"><span class="wiegtotal"></span><br></td>
                            <td></td>
                            <td colspan="2" class="total-datatds"><span class="val11"></span><br></td>
                        </tr>
                    </tbody>
                    <tbody class="tax-row">
                        ${taxRows}
                    </tbody>
                    <tbody class="total-word">
                        <tr>
                            <td colspan="9" class="total-words-des">
                                <b>Note:</b> <span>Identification Marks &amp; Serial No. of Goods: As per packing list attached</span><br>
                                ${taxDetails}
                                <br>
                                <b>Gross total in words:</b> ${grandTotalInWords}<br>
                            </td>
                            <td colspan="2" class="total-words-des ss"><b>Total Invoice Value:</b><br></td>
                            <td colspan="2" class="total-words-val"><span>${formatAmount(grandTotalTax)}</span><br></td>
                        </tr>
                    </tbody>
                    <tbody style="display:none;">
                        <tr class="particulars-row">
                            <td colspan="3" class="particulars-row-prtd"><span>Particulars</span><br></td>
                            <td colspan="1" class="particulars-row-prtd"><span>Tax Application</span><br></td>
                            <td colspan="1" class="particulars-row-prtd"><span>Tax %</span><br></td>
                            <td colspan="1" class="particulars-row-prtd"><span>Adv Recovery (Taxable)</span><br></td>
                            <td colspan="1" class="particulars-row-prtd"><span>Adv Recovery (NonTax)</span><br></td>
                            <td colspan="2" class="particulars-row-prtd"><span>Invoice Value</span><br></td>
                            <td colspan="2" class="particulars-row-prtd"><span>Payable to dept</span><br></td>
                            <td colspan="2" class="particulars-row-prtd"><span>Payable by Customer</span><br></td>
                        </tr>
                    </tbody>
                    <tbody style="display:none;">
                        <tr class="particulars-row-body">
                            <td colspan="3"><span>${gstremarks}</span><br></td>
                            <td colspan="1">
                                <span>Basic</span><br>
                                ${taxDetailsNew}
                            </td>
                            <td colspan="1" class="particulars-row-body-td"><br>${taxPerValue}</td>
                            <td colspan="1" class="particulars-row-body-td">
                                <span>${formatAmount(advremarks)}</span><br>
                                ${taxadvanceValue}
                            </td>
                            <td colspan="1" class="particulars-row-body-td">
                                <span>${formatAmount(advremarksnon)}</span><br>
                            </td>
                            <td colspan="2" class="particulars-row-body-td">
                                <span>${formatAmount(basicValue)}</span><br>
                                ${taxValue}
                            </td>
                            <td colspan="2" class="particulars-row-body-td"><br>${taxValuedept}</td>
                            <td colspan="2" class="particulars-row-body-td">
                                <span>${formatAmount(basicValuecos)}</span><br>
                                ${taxValuecos}
                            </td>
                        </tr>
                    </tbody>
                    <tbody style="display:none;">
                        <tr>
                            <td colspan="3"><span>Total</span><br></td>
                            <td colspan="1"></td>
                            <td colspan="1"></td>
                            <td colspan="1" class="td-body-tax"><span class="taxbasic"></span><br></td>
                            <td colspan="1"></td>
                            <td colspan="2" class="td-body-tax"><span class="grandlast"></span><br></td>
                            <td colspan="2" class="td-body-tax"><span class="taxtotal"></span><br></td>
                            <td colspan="2" class="td-body-tax"><span class="grandlast12new"></span><br></td>
                        </tr>
                    </tbody>
                    <tbody>
                        <tr>
                            <td colspan="13" class="Bank_details">
                                <span>BANK ACCOUNT DETAILS: &nbsp; BANK ACCOUNT NAME: </span><b class="bankname"></b><br>
                                <span>ACCOUNT NUMBER: </span><b class="acc"></b>
                                <span> &nbsp; BANK NAME &amp; ADDRESS: </span><b class="bname"></b>
                                <span> &nbsp; BRANCH CODE: </span><b class="code"></b><br>
                                <span>SWIFT CODE: </span><b class="scode"></b>
                                <span> &nbsp; IFSC CODE: </span><b class="ifsc"></b><br>
                            </td>
                        </tr>
                    </tbody>
                    <tbody>
                        <tr class="last-data">
                            <td colspan="9">
                                <span>Certified that the particulars given above are the true and correct and the amount indicated represents the price</span><br>
                                <span>actually charged from the consignee and that there is no additional consideration following directly or</span><br>
                                <span>indirectly over and above what has been declared herein.</span><br>
                            </td>
                            <td colspan="4">
                                <span>For JSW SEVERFIELD STRUCTURES LTD.</span><br>
                                <span style="margin-top:20px; display:inline-block;">(Authorised signature)</span><br>
                            </td>
                        </tr>
                    </tbody>
                </table>

                <div class="footer">
                    <b>Regd Office: </b><span class="reg_add"></span>
                    <p>(All disputes subject to Karnataka Jurisdiction) E&amp;OE</p>
                </div>
            </div>
        `;

        // ── Fill Invoice Data into DOM ─────────────────────────────────────────
             function fillInvoice(container) {

            // FACTORY DETAILS
            container.querySelector(".reg_add").textContent    = reg_addresss;
            container.querySelector(".gst_code").textContent   = Gst_Code;
            container.querySelector(".state_code").textContent = state_Code;
			container.querySelector(".pan_code").textContent   = Pan_Code;
            container.querySelector('.facotry_address').textContent = factory_Address;

            // INVOICE HEADER
            container.querySelector('.datetime').textContent     = formattedDateTime;
            container.querySelector('.dateor').textContent       = work_date;
            container.querySelector('.date').textContent         = currentDate;
            container.querySelector('.invoiceNumber').textContent = invoiceno;

            // INVOICE TO DETAILS
			const invoiceToValue = invoice_to_id_value || '';
			 
						// Split using \r\n
						const invoiceLines = invoiceToValue.split(/\r?\n/);
			 
						// First line
						const line1 = invoiceLines[0] || '';
			 
						// Second line
						const line2 = invoiceLines[1] || '';
			 
						// Third line → remove ", Thane, Maharashtra"
						const line3 = (invoiceLines[2] || '')
						    ;
			 
						// Set values
						container.querySelector('.shipto11').textContent = line1;
			 
						container.querySelector('.shipto11add2').textContent = line2;
			 
						container.querySelector('.shipto11add3').textContent = line3;
						const districtAndPin = [
						    Contractor_Data[0].invoiceDistrict,
						    Contractor_Data[0].invoicePinNo
						]
						.filter(x => x && x.toString().trim() !== "")
						.join("-");
			 
						const invoiceAddress = [
						    Invoice_Data.addressLine1up,
						    Invoice_Data.addressLine2up,
						    Invoice_Data.addressLine3up,
						    districtAndPin
						]
						.filter(x => x && x.toString().trim() !== "")
						.join("\n");
			 
						console.log("the the invoice address is this2 ", invoiceAddress);
			 
						container.querySelector('.fulladdress').textContent = invoiceAddress;
			 
					    container.querySelector('.statename').textContent =
					        invoiceStateName || '';
			 
					    container.querySelector('.stcode11').textContent =
					        invoiceStateCode || '';
			 
					    container.querySelector('.placeofsupply').textContent =
					        Invoice_Data.supply_place || '';
			 
					    container.querySelector('.ingst').textContent =
					        invoiceGstNo || '';
			 
					    container.querySelector('.panin').textContent =
					        invoicePanNo || '';
			 
					    // =========================
					    // CONSIGNEE DETAILS
					    // =========================
			 
						console.log("the consignee value is this ", consignee_id_value);
			 
						const consigneeValue = consignee_id_value || '';
			 
						// Split using \r\n
						const consigneeLines = consigneeValue.split(/\r?\n/);
			 
						// First line
						const conLine1 = consigneeLines[0] || '';
			 
						// Second line
						const conLine2 = consigneeLines[1] || '';
			 
						// Third line
						const conLine3 = consigneeLines[2] || '';
			 
						// Set values
						container.querySelector('.conname').textContent = conLine1;
			 
						container.querySelector('.conname1').textContent = conLine2;
			 
						container.querySelector('.conname2').textContent = conLine3;
			 
							const consigneeDistrictAndPin = [
							    Contractor_Data[0].consigneeDistrict,
							    Contractor_Data[0].consigneePinNo
							]
							.filter(x => x && x.toString().trim() !== "")
							.join("-");
			 
							const consigneeAddress = [
							    Invoice_Data.conaddressLine1,
							    Invoice_Data.conaddressLine2,
							    Invoice_Data.conaddressLine3,
							    consigneeDistrictAndPin
							]
							.filter(x => x && x.toString().trim() !== "")
							.join("\n");
			 
							container.querySelector('.conaddress').textContent =
							    consigneeAddress;

            container.querySelector('.state').textContent          = consigneeStateName || '';
            container.querySelector('.stateco').textContent        = consigneeStateCode || '';
            //container.querySelector('.conplaceofsupply').textContent = Contractor_Data[0].supply_place || '';
            container.querySelector('.congst').textContent         = consigneeGstNo || '';
            container.querySelector('.pancon').textContent         = consigneePanNo || '';

            // TRANSPORT DETAILS
            container.querySelector('.taxpayre').textContent  = tax_payable;
            container.querySelector('.areano').textContent    = area_no || '';
            container.querySelector('.contlo').textContent    = containter_no || '';
            container.querySelector('.lutno').textContent     = lot_no || '';
            container.querySelector('.epoglo').textContent    = epcgno || '';
            container.querySelector('.trans').textContent     = transport_name || '';
            container.querySelector('.lrdoc').textContent     = lr_docketno || '';
            container.querySelector('.lrdate').textContent    = date_val || '';
            container.querySelector('.shipmo').textContent    = shipment_mode_id_value || '';
            container.querySelector('.delcon').textContent    = delivery_condition_id_value || '';
            container.querySelector('.workor').textContent    = work_id_value || '';
            container.querySelector('.vehino').textContent    = vechile_no || '';
            container.querySelector('.contrefno').textContent = con_code_with_lot_no || '';

            // TOTALS  ← all formatted with commas
            //container.querySelector('.freight').textContent       = formatAmount(freight);
            container.querySelector('.qtytotal').textContent      = total_qty || '';
            container.querySelector('.wiegtotal').textContent     = total_kgs || '';
            container.querySelector('.val11').textContent         = formatAmount(basic_value);
            container.querySelector('.grandlast').textContent     = formatAmount(Grand_Total_tax);
            container.querySelector('.grandlast12new').textContent = formatAmount(PBC_Final_total);
            container.querySelector('.taxbasic').textContent      = formatAmount(Total_adv_tax_Taxable);
            container.querySelector('.taxtotal').textContent      = formatAmount(Tax_Final_total);

            // BANK DETAILS
            container.querySelector('.bankname').textContent = bankName || '';
            container.querySelector('.acc').textContent      = account_number || '';
            container.querySelector('.bname').textContent    = branch_address || '';
            container.querySelector('.code').textContent     = branch_code || '';
            container.querySelector('.scode').textContent    = swift_code || '';
            container.querySelector('.ifsc').textContent     = ifsc_code || '';
        }

        // ── Auto-fit font size ────────────────────────────────────────────────
        function autoFitInvoice(container) {
            const invoice   = container.querySelector(".invoice-container");
            const maxHeight = 1000;
            let fontSize    = 9;

            function applySize(size) {
                invoice.style.fontSize = size + "px";
                invoice.querySelectorAll("td, th").forEach(el => {
                    el.style.fontSize   = size + "px";
                    el.style.padding    = "1px 2px";
                    el.style.lineHeight = "1.05";
                });
            }

            applySize(fontSize);
            if (invoice.scrollHeight === 0) return;

            while (invoice.scrollHeight > maxHeight && fontSize > 6) {
                fontSize--;
                applySize(fontSize);
            }
            console.log("Final font size:", fontSize);
        }

        // ── Shrink long descriptions ──────────────────────────────────────────
        function shrinkLongDescriptions(container) {
            container.querySelectorAll(".desc-col").forEach(td => {
                if (td.textContent.length > 200) {
                    td.classList.add("desc-small", "desc-xsmall");
                }
            });
        }

        // ── Print / PDF ───────────────────────────────────────────────────────
        function downloadInvoicePDF(htmlContent, fillInvoice, hideLoader) {
            const prange = [
                "Original For Recipient",
                "Duplicate For Transporter",
                "Triplicate For Supplier"
            ];

            const printWindow = window.open('', '_blank');
            if (!printWindow) {
                alert("Popup blocked! Please allow popups.");
                hideLoader();
                return;
            }

            let fullHTML = `
                <html>
                <head>
                    <title>Invoice PDF</title>
                    <style>
                        @page { size: A4; margin: 10mm; }
                        body { margin: 0; padding: 0; font-family: Calibri, Arial, sans-serif; }
                        .page {
                            width: 100%;
                            max-width: 210mm;
                            margin: 0 auto;
                            page-break-after: always;
                        }
                        .page:last-child { page-break-after: avoid; }
                        @media print {
                            body { margin: 0; }
                            .page { page-break-after: always; }
                            .page:last-child { page-break-after: avoid; }
                        }
                    </style>
                </head>
                <body>
            `;

            prange.forEach(label => {
                const temp = document.createElement("div");
                temp.classList.add("page");
                temp.innerHTML = htmlContent;

                const labelEl = temp.querySelector(".copy-label");
                if (labelEl) labelEl.textContent = label;

                fillInvoice(temp);
                fullHTML += temp.outerHTML;
            });

            fullHTML += `</body></html>`;

            printWindow.document.open();
            printWindow.document.write(fullHTML);
            printWindow.document.close();

            printWindow.onload = () => {
                setTimeout(() => {
                    printWindow.focus();
                    printWindow.print();
                    printWindow.close();
                    hideLoader();
                }, 500);
            };
        }

        downloadInvoicePDF(htmlContent, fillInvoice, hideLoader);

    } catch (error) {
        hideLoader();
        console.error('Error generating PDF:', error);
    }
}

/*async function printRecordView(id) {

    try {
	    const url = new URL(`/jssl/invoice/searchadvidnew?id=${id}`, baseUrl);
		const response = await fetch(url,{
						           method: "GET",
						           credentials: "include"   // ✅ Always send JSESSIONID cookie
						       });
        if (!response.ok) throw new Error("Failed to fetch data");

         const json = await response.json();
         const Invoice_Data = json.Invoice_Data;
         const Contractor_Data = json.Contractor_Data;
         const QsPacking_Data = json.QsPacking_Data;
         const tax = json.tax;
         const Grand_Total_value = json.Grand_Total_value;
         
         const Grand_Total_tax = Grand_Total_value[0].Grand_Total_tax;
         const Total_adv_tax_Taxable = Grand_Total_value[0].Total_adv_tax_Taxable;
         const Tax_Final_total = Grand_Total_value[0].Tax_Final_total;
         const PBC_Final_total = Grand_Total_value[0].PBC_Final_total;
         
         const invoiceno = Invoice_Data.invoice_no;
         const lr_docketno = Invoice_Data.lr_docketno;
         const date_val = Invoice_Data.date_val;
         //const product_desc = json.Invoice_Data?.product_desc || ''; // Fix reference
         
         const invoice_to_id_value = toTitleCase(Contractor_Data[0].invoice_to_id_value);
		 const formattedValue = toTitleCase(invoice_to_id_value);

		 console.log(formattedValue);
         const tax_payable = Contractor_Data[0].tax_payable;
         const area_no = Contractor_Data[0].area_no;
         const lot_no = Contractor_Data[0].lot_no;
         const containter_no = Contractor_Data[0].containter_no;
         const epcgno = Contractor_Data[0].epcgno;
         const shipment_mode_id_value = Contractor_Data[0].shipment_mode_id_value;
         const delivery_condition_id_value = Contractor_Data[0].delivery_condition_id_value;
         const consignee_id_value = Contractor_Data[0].consignee_id_value;
         const work_id_value = Contractor_Data[0].work_id_value;
         const invoiceStateName = Contractor_Data[0].invoiceStateName;
         const consigneeStateName = Contractor_Data[0].consigneeStateName;
         const invoiceStateCode = Contractor_Data[0].invoiceStateCode;
         const consigneeStateCode = Contractor_Data[0].consigneeStateCode;
         const invoiceGstNo = Contractor_Data[0].invoiceGstNo;
         const consigneeGstNo = Contractor_Data[0].consigneeGstNo;
         const invoicePanNo = Contractor_Data[0].invoicePanNo;
         const consigneePanNo = Contractor_Data[0].consigneePanNo;
         const bankName = Contractor_Data[0].bankName;
         const account_number = Contractor_Data[0].account_number;
         const branch_address = Contractor_Data[0].branch_address;
         const branch_code = Contractor_Data[0].branch_code;
         const swift_code = Contractor_Data[0].swift_code;
         const ifsc_code = Contractor_Data[0].ifsc_code;
         
         const transport_name = QsPacking_Data[0].transport_name;
         const vechile_no = QsPacking_Data[0].vechile_no;
         const con_code_with_lot_no = QsPacking_Data[0].con_code_with_lot_no;
         
         const freight = tax[0].freight;
         const total_pices = tax[0].total_pices;
         const total_kgs = tax[0].total_kgs;
         const total_qty = tax[0].total_qty;
         const basic_value = tax[0].basic_value;
         
		 const items = json.QsPacking_Data || []; 
		 const taxData = json.tax || [];
		 const InvoiceData = json.Invoice_Data || [];
		 const grandTotalData = json.Grand_Total_value?.[0] || {};
         const grandTotalInWords = grandTotalData.GrandTotalInWords || '';
		 const grandTotalTax = grandTotalData.Grand_Total_tax || '';
		 const gstremarks = InvoiceData.gst_remarks || '';
		 const advremarks = taxData[0].taxable || '';
		 const advremarksnon = taxData[0].non_taxable || '';
		 const basicValue = taxData[0].basic_value || '';
		 const basicValuecos = taxData[0].optc || '';

        // Generate dynamic rows based on QsPacking_Data
        let tableRows = items.map((item, index) => `
            <tr>
                <td>${index + 1}</td>
                <td>${item.scrap_name_type_id || ''}</td>
                <td>${item.pice || ''}</td>
                <td>${item.hcode || ''}</td>
                <td>${item.uom_name || ''}</td>
                <td>${item.qty || ''}</td>
                <td>${item.per_kgs || ''}</td>
                <td>${item.unit_price || ''}</td>
                <td>${item.total || ''}</td>
            </tr>
        `).join('');
        
        // Generate dynamic tax rows
        let taxRows = taxData.map(tax => `
            <tr>
                <td colspan="7" style="border: 1px solid #000;">${tax.tax_name || ''}</td>
                <td style="border: 1px solid #000;">${tax.tax_per || ''}</td>
                <td style="border: 1px solid #000;">${tax.tax_value || ''}</td>
            </tr>
        `).join('');
        
        // Generate dynamic tax descriptions with tax_name and tax_value_in_words
		let taxDetails = taxData.map(tax => `
		    <b>${tax.tax_name}:</b> ${tax.tax_value_in_words}<br>
		`).join('');
		
		let taxDetailsNew = taxData.map(tax => `
		    <b>${tax.tax_name}</b><br>
		`).join('');
		
		let taxPerValue = taxData.map(tax => `
		    <b>${tax.tax_per}</b><br>
		`).join('');
		
		let taxValue = taxData.map(tax => `
		    <b>${tax.tax_value}</b><br>
		`).join('');
		
		let taxValuedept = taxData.map(tax => `
		    <b>${tax.ptc}</b><br>
		`).join('');
		
		let taxValuecos = taxData.map(tax => `
		    <b>${tax.ptc}</b><br>
		`).join('');
		
		let taxadvanceValue = taxData.map(tax => `
		    <b>${tax.adv_tax}</b><br>
		`).join('');

        const currentDate = new Date().toLocaleDateString('en-GB', {
		  day: '2-digit',
		  month: '2-digit',
		  year: 'numeric'
		}).replace(/\//g, '-'); // Replace '/' with '-'
		
		console.log(currentDate); // Output: "21-02-2025" (DD-MM-YYYY)
        const currentDate1 = new Date();
        const formattedDateTime = String(currentDate1.getDate()).padStart(2, '0') + '-' + 
                          String(currentDate1.getMonth() + 1).padStart(2, '0') + '-' + 
                          currentDate1.getFullYear() + ' ' + 
                          String(currentDate1.getHours()).padStart(2, '0') + ':' + 
                          String(currentDate1.getMinutes()).padStart(2, '0') + ':' + 
                          String(currentDate1.getSeconds()).padStart(2, '0');
                          
                          // Declare and open new window BEFORE doing heavy logic
        const newWindow = window.open('', '_blank');
        if (!newWindow) {
            //alert("Popup blocked. Please allow popups from this site.");
            return;
        }
                          
       // const htmlContent = await (await fetch('print-content.html')).text()
            const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tally Invoice</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 20px;
        }
        .invoice-container {
            width: 100vw;
            max-width: 1200px;
            border: 1px solid #000;
            padding: 15px;
        }
        .invoice-container1 {
            width: 100vw;
            max-width: 1200px;
            border: 1px solid #000;
            padding: 15px;
            margin-top:80px;
        }
        .invoice-container2 {
            width: 100vw;
            max-width: 1200px;
            border: 1px solid #000;
            padding: 15px;
            margin-top:50px;
        }
        .header, .footer {
            text-align: center;
        }
        .invoice-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .gst-text {
            text-align: center;
            font-size: 18px;
            font-weight: bold;
        }
        .company-details-table {
            width: 100%;
            border-collapse: collapse;
        }
        .company-details-table td {
            border: 1px solid #000;
            padding: 15px;
            vertical-align: top;
        }
        .company-logo {
            width: 80px;
            height: 50px;
            display: block;
            margin-bottom: 10px;
        }
        .product-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 0px;
        }
        .product-table th, .product-table td {
            border: 1px solid #000;
            padding: 10px;
            text-align: center;
        }
        .terms {
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="invoice-container">
        <div class="invoice-header">
            <b><span id="topdate"></span></b>
            <div class="gst-text">RECEIPT VOUCHER</div>
            <div class="gst-text1">Original For Recipient</div>
        </div>
        
        <table class="company-details-table">
            <tr>
                <td colspan="2">
                    <div class="company-logo">
                    <img src="img/logo/download.png" alt="Company Logo" style="width: 80px;">
                      </div>
                    <strong>JSW Serverfiled Structures Limited</strong><br>
                    Near 10 MT Gate, Beside Cement Plant-2<br>
                    Vidyanagar P.O. Torangallu<br>
                    Torangallu-583275<br>
                    Ballari, Karnataka, India<br>
                    State Code:29<br>
                    GSTIN : 29AACCJ1473D1ZQ     PAN : AACCJ1473D<br>
                    ICE No: 0309033152   CIN No: U28112MH2009PLC191045<br>
                    Email: invoice@jssl.in    Website: www.jssl.in<br>
                </td>
                <td colspan="2">
                <b>Invoice No:</b> <span id="invoiceNumber"></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b>Date:</b> <span id="date"></span><br>
                <b>Contract No Reference No:</b> <span id="contrefno"></span><br>
                <b>Date & Time of supply:</b> <span id="datetime"></span><br>
                <b>Work/Purchase Order No:</b> <span id="workor"></span><br>
                <b>Date of Order:</b> <span id="dateor"></span><br>
            </tr>
            <tr>
                <td colspan="2"><strong>Invoice To:</strong><br>
                <span id="shipto11"></span><br>
                <b>Name of the state:</b> <span id="statename"></span><br>
                <b>State Code:</b> <span id="stcode11"></span><br>
                <b>GSTIN:</b><span id="ingst"></span><br>
                <b>PAN:</b><span id="panin"></span><br>
                </td>
                <td colspan="2"><strong>Name & Address of consignee:</strong><br>
                <span id="conadd"></span><br>
                <b>State Name:</b> <span id="state"></span><br>
                <b>State Code:</b> <span id="stateco"></span><br>
                <b>GSTIN:</b><span id="congst"></span><br>
                <b>PAN:</b><span id="pancon"></span><br>
                </td>
            </tr>
            <tr>
                <td><strong>Date of Notification</strong><br>
                 <strong>Exempted note under:</strong><br>
                 <strong>Tax is Payble on revese charge:(Yes/No):<span id="taxpayre"></span></strong><br>
                 </td>
                <td><strong>Export Details:</strong><br>
                <strong>ARE No:<span id="areano"></span></strong><br>
                <strong>LUT No:<span id="lutno"></span></strong><br>
                <strong>Container No:<span id="contlo"></span></strong><br>
                <strong>EPCG License No:<span id="epoglo"></span></strong><br>
                </td>
                <td><b>Transporter:</b> <span id="trans"></span><br>
                <b>Vehicle No:</b><span id="vehino"></span><br>
                <b>LR/DOCKET No:<span id="lrdoc"></span></b><br>
                <b>Date:<span id="lrdate"></span></b><br>
                </td>
                <td><b>Shipment Mode:</b> <span id="shipmo"></span><br>
                <b>Delivery Condition:</b> <span id="delcon"></span><br>
                </td>
            </tr>
        </table>
        
        <table class="product-table">
            <thead>
                <tr>
                    <th>Sr No.</th>
                    <th>Product Description</th>
                    <th>Pieces</th>
                    <th>Service/HSN Code</th>
                    <th>UOM</th>
                    <th>Qty</th>
                    <th>Weight</th>
                    <th>Unit Price</th>
                    <th>Value (INR)</th>
                </tr>
            </thead>
            <tbody>
                ${tableRows} 
            </tbody>
            <tbody>
                <tr>
                    <td style="border: 1px solid #000; height: 10px;"" colspan="4">
                    <span>Freight</span><br>
                    </td>
                    <td style="border: 1px solid #000; height: 10px;" colspan="4"></td>
                    <td style="border: 1px solid #000; height: 10px;">
                    <span id="freight"></span><br>
                    </td>
                </tr>
            </tbody>
            <tbody>
                <tr>
                    <td style="border: 1px solid #000; height: 10px;"" colspan="2">
                    <span>TOTAL</span><br>
                    </td>
                    <td style="border: 1px solid #000; height: 10px;">
                    <span id="pitotal"></span><br></td>
                    </td>
                    <td style="border: 1px solid #000; height: 10px;"></td>
                    <td style="border: 1px solid #000; height: 10px;">
                    <td style="border: 1px solid #000; height: 10px;">
                    <span id="qtytotal"></span><br></td>
                    </td>
                    <td style="border: 1px solid #000; height: 10px;">
                    <span id="wiegtotal"></span><br>
                    </td>
                    <td style="border: 1px solid #000; height: 10px;"></td>
                    <td style="border: 1px solid #000; height: 10px;">
                    <span id="val11"></span><br>
                    </td>
                 </tr>
            </tbody>
            <tbody>
                ${taxRows}
            </tbody>
            <tbody>
                <tr>
                    <td style="border: 1px solid #000; height: 20px; width: 200px;" colspan="4">
                        <b>Note:</b><span>Identification Marks & Serial No. of Goods: As per packing list attached</span><br>
                        ${taxDetails} <!-- Dynamic Tax Name & Value in Words -->
                        <b>Gross total in words:</b> <b>${grandTotalInWords}</b><br>
                    </td>
                    <td style="border: 1px solid #000; height: 20px; width: 200px;" colspan="3">
                        <b>TOTAL INVOICE VALUE:</b><br>
                    </td>
                    <td style="border: 1px solid #000; height: 10px;" colspan="2">
                        <span>${grandTotalTax}</span><br> <!-- Dynamic Grand Total Tax -->
                    </td>              
                </tr>
            </tbody>
            <tbody>
                <tr>
                    <td style="border: 1px solid #000; height: 20px;width: 200px;">
                    <span>Particulars</span><br>
                    </td>
                    <td style="border: 1px solid #000; height: 20px;">
                    <span>Tax Application</span><br>
                    </td>
                    <td style="border: 1px solid #000; height: 20px;">
                    <span>Tax %</span><br>
                    </td>
                    <td style="border: 1px solid #000; height: 20px;">
                    <span>Adv Recovery (Taxable)</span><br>
                    </td>
                    <td style="border: 1px solid #000; height: 20px;">
                    <span>Adv Recovery (NonTax)</span><br>
                    </td>
                    <td style="border: 1px solid #000; height: 20px;">
                    <span>Invoice Value</span><br>
                    </td>
                    <td style="border: 1px solid #000; height: 20px;">
                    <span>Payable to dept</span><br>
                    </td>
                    <td style="border: 1px solid #000; height: 20px;" colspan="2">
                    <span>Payable by Customer</span><br>
                    </td>
                    </tr>
            </tbody>
            <tbody>
                <tr>
                    <td style="border: 1px solid #000; height: 20px;">
                    <span>${gstremarks}</span><br>
                    </td>
                    <td style="border: 1px solid #000; height: 20px;">
                    <span>Basic</span><br>
                    ${taxDetailsNew}
                    </td>
                    <td style="border: 1px solid #000; height: 20px;">
                    ${taxPerValue}
                    </td>
                    <td style="border: 1px solid #000; height: 20px;">
                    <span>${advremarks}</span><br>
                    ${taxadvanceValue}
                    </td>
                    <td style="border: 1px solid #000; height: 20px;">
                    <span>${advremarksnon}</span><br>
                    </td>
                    <td style="border: 1px solid #000; height: 20px;">
                    <span>${basicValue}</span><br>
                    ${taxValue}
                    </td>
                    <td style="border: 1px solid #000; height: 20px;">
                    ${taxValuedept}
                    </td>
                    <td style="border: 1px solid #000; height: 20px;" colspan="2">
                    <span>${basicValuecos}</span><br>
                    ${taxValuecos}
                    </td>
                    </tr>
            </tbody>
            <tbody>
                <tr>
                    <td style="border: 1px solid #000; height: 20px;" colspan="2">
                    <span>Total</span><br>
                    </td>
                    <td style="border: 1px solid #000; height: 20px;">
                    </td>
                    <td style="border: 1px solid #000; height: 20px;">
                    <span id="taxbasic"></span><br>
                    </td>
                    <td style="border: 1px solid #000; height: 20px;">
                    </td>
                    <td style="border: 1px solid #000; height: 20px;">
                    <span id="grandlast"></span><br>
                    </td>
                    <td style="border: 1px solid #000; height: 20px;">
                    <span id="taxtotal"></span><br>
                    </td>
                    <td style="border: 1px solid #000; height: 20px;" colspan="2">
                    <span id="grandlast12new"></span><br>
                    </td>
                </tr>
            </tbody>
            <tbody>
                <tr>
                    <td style="border: 1px solid #000; height: 20px; width: 100%;"colspan="9">
                    <span>BANK ACCOUNT DETAILS:</span><span>BANK ACCOUNT NAME:</span><b id="bankname"></b>,
                    <span>ACCOUNT NUMBER:</span><b id="acc"></b>,<span>BANK NAME & ADDRESS:</span><b id="bname"></b>,<b id="add"></b>
                    <span>BRANCH CODE:</span><b id="code"></b>,<span>SWIFT CODE:</span><b id="scode"></b>,<span>IFSC CODE:</span><b id="ifsc"></b><br>
                   </td>
                </tr>
            </tbody>
            <tbody>
                <tr>
                    <td style="border: 1px solid #000; height: 20px; width: 100%;"colspan="5">
                    <span>Certified that the particulars given above are the true and correct and the amount indicated represents the price</span><br>
                    <span>actually charged from the consignee and that there is no additional consideration following directly or</span><br>
                    <span>indirectly over and above what has been declared herein.</span><br>
                    </td>
                    <td style="border: 1px solid #000; height: 20px; width: 100%;"></td>
		                    <td style="border: 1px solid #000; height: 20px; width: 100%;font-size:15px;" colspan="3">
		    <span>For JSW SEVERFIELD STRUCTURES LTD.</span><br>
		    <span style="margin-top: 20px; display: inline-block;">(Authorised signature)</span><br>
		</td>
        </tr>
            </tbody>
        </table>
       <div class="footer">
            <p>Regd Office:No.401,Grand Palladium,175 CST Road,Kalina,santacruz(East),Mumbai,IDIA-400 098 Ph:+91-22--67317000
            (All disputes subject to Karnataka Jurisdiction)E&OE</p>
        </div>
    </div>
    
    <div class="invoice-container1">
        <div class="invoice-header">
            <b><span id="topdate1"></span></b>
            <div class="gst-text">RECEIPT VOUCHER</div>
            <div class="gst-text1">Duplicate for Transporter</div>
        </div>
        
        <table class="company-details-table">
            <tr>
                <td colspan="2">
                    <div class="company-logo">
                    <img src="img/logo/download.png" alt="Company Logo" style="width: 80px;">
                      </div>
                    <strong>JSW Serverfiled Structures Limited</strong><br>
                    Near 10 MT Gate, Beside Cement Plant-2<br>
                    Vidyanagar P.O. Torangallu<br>
                    Torangallu-583275<br>
                    Ballari, Karnataka, India<br>
                    State Code:29<br>
                    GSTIN : 29AACCJ1473D1ZQ     PAN : AACCJ1473D<br>
                    ICE No: 0309033152   CIN No: U28112MH2009PLC191045<br>
                    Email: invoice@jssl.in    Website: www.jssl.in<br>
                </td>
                <td colspan="2">
                <b>Invoice No:</b> <span id="invoiceNumber1"></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b>Date:</b> <span id="date1"></span><br>
                <b>Contract No Reference No:</b> <span id="contrefno1"></span><br>
                <b>Date & Time of supply:</b> <span id="datetime1"></span><br>
                <b>Work/Purchase Order No:</b> <span id="workor1"></span><br>
                <b>Date of Order:</b> <span id="dateor1"></span><br>
            </tr>
            <tr>
                <td colspan="2"><strong>Invoice To:</strong><br>
                <span id="shipto111"></span><br>
                <b>Name of the state:</b> <span id="statename1"></span><br>
                <b>State Code:</b> <span id="stcode111"></span><br>
                <b>GSTIN:</b><span id="ingst1"></span><br>
                <b>PAN:</b><span id="panin1"></span><br>
                </td>
                <td colspan="2"><strong>Name & Address of consignee:</strong><br>
                <span id="conadd1"></span><br>
                <b>State Name:</b> <span id="state1"></span><br>
                <b>State Code:</b> <span id="stateco1"></span><br>
                <b>GSTIN:</b><span id="congst1"></span><br>
                <b>PAN:</b><span id="pancon1"></span><br>
                </td>
            </tr>
            <tr>
                <td><strong>Date of Notification</strong><br>
                 <strong>Exempted note under:</strong><br>
                 <strong>Tax is Payble on revese charge:(Yes/No):<span id="taxpayre1"></span></strong><br>
                 </td>
                <td><strong>Export Details:</strong><br>
                <strong>ARE No:<span id="areano1"></span></strong><br>
                <strong>LUT No:<span id="lutno1"></span></strong><br>
                <strong>Container No:<span id="contlo1"></span></strong><br>
                <strong>EPCG License No:<span id="epoglo1"></span></strong><br>
                </td>
                <td><b>Transporter:</b> <span id="trans1"></span><br>
                <b>Vehicle No:</b><span id="vehino1"></span><br>
                <b>LR/DOCKET No:<span id="lrdoc1"></span></b><br>
                <b>Date:<span id="lrdate1"></span></b><br>
                </td>
                <td><b>Shipment Mode:</b> <span id="shipmo1"></span><br>
                <b>Delivery Condition:</b> <span id="delcon1"></span><br>
                </td>
            </tr>
        </table>
        
        <table class="product-table">
            <thead>
                <tr>
                    <th>Sr No.</th>
                    <th>Product Description</th>
                    <th>Pieces</th>
                    <th>Service/HSN Code</th>
                    <th>UOM</th>
                    <th>Qty</th>
                    <th>Weight</th>
                    <th>Unit Price</th>
                    <th>Value (INR)</th>
                </tr>
            </thead>
            <tbody>
                ${tableRows} 
            </tbody>
            <tbody>
                <tr>
                    <td style="border: 1px solid #000; height: 10px;"" colspan="4">
                    <span>Freight</span><br>
                    </td>
                    <td style="border: 1px solid #000; height: 10px;" colspan="4"></td>
                    <td style="border: 1px solid #000; height: 10px;">
                    <span id="freight1"></span><br>
                    </td>
                </tr>
            </tbody>
            <tbody>
                <tr>
                    <td style="border: 1px solid #000; height: 10px;"" colspan="2">
                    <span>TOTAL</span><br>
                    </td>
                    <td style="border: 1px solid #000; height: 10px;">
                    <span id="pitotal1"></span><br></td>
                    </td>
                    <td style="border: 1px solid #000; height: 10px;"></td>
                    <td style="border: 1px solid #000; height: 10px;">
                    <td style="border: 1px solid #000; height: 10px;">
                    <span id="qtytotal1"></span><br></td>
                    </td>
                    <td style="border: 1px solid #000; height: 10px;">
                    <span id="wiegtotal1"></span><br>
                    </td>
                    <td style="border: 1px solid #000; height: 10px;"></td>
                    <td style="border: 1px solid #000; height: 10px;">
                    <span id="val111"></span><br>
                    </td>
                 </tr>
            </tbody>
            <tbody>
                ${taxRows}
            </tbody>
            <tbody>
                <tr>
                    <td style="border: 1px solid #000; height: 20px; width: 200px;" colspan="4">
                        <b>Note:</b><span>Identification Marks & Serial No. of Goods: As per packing list attached</span><br>
                        ${taxDetails} <!-- Dynamic Tax Name & Value in Words -->
                        <b>Gross total in words:</b> <b>${grandTotalInWords}</b><br>
                    </td>
                    <td style="border: 1px solid #000; height: 20px; width: 200px;" colspan="3">
                        <b>TOTAL INVOICE VALUE:</b><br>
                    </td>
                    <td style="border: 1px solid #000; height: 10px;" colspan="2">
                        <span>${grandTotalTax}</span><br> <!-- Dynamic Grand Total Tax -->
                    </td>              
                </tr>
            </tbody>
            <tbody>
                <tr>
                    <td style="border: 1px solid #000; height: 20px;width: 200px;">
                    <span>Particulars</span><br>
                    </td>
                    <td style="border: 1px solid #000; height: 20px;">
                    <span>Tax Application</span><br>
                    </td>
                    <td style="border: 1px solid #000; height: 20px;">
                    <span>Tax %</span><br>
                    </td>
                    <td style="border: 1px solid #000; height: 20px;">
                    <span>Adv Recovery (Taxable)</span><br>
                    </td>
                    <td style="border: 1px solid #000; height: 20px;">
                    <span>Adv Recovery (NonTax)</span><br>
                    </td>
                    <td style="border: 1px solid #000; height: 20px;">
                    <span>Invoice Value</span><br>
                    </td>
                    <td style="border: 1px solid #000; height: 20px;">
                    <span>Payable to dept</span><br>
                    </td>
                    <td style="border: 1px solid #000; height: 20px;" colspan="2">
                    <span>Payable by Customer</span><br>
                    </td>
                    </tr>
            </tbody>
            <tbody>
                <tr>
                    <td style="border: 1px solid #000; height: 20px;">
                    <span>${gstremarks}</span><br>
                    </td>
                    <td style="border: 1px solid #000; height: 20px;">
                    <span>Basic</span><br>
                    ${taxDetailsNew}
                    </td>
                    <td style="border: 1px solid #000; height: 20px;">
                    ${taxPerValue}
                    </td>
                    <td style="border: 1px solid #000; height: 20px;">
                    <span>${advremarks}</span><br>
                    ${taxadvanceValue}
                    </td>
                    <td style="border: 1px solid #000; height: 20px;">
                    <span>${advremarksnon}</span><br>
                    </td>
                    <td style="border: 1px solid #000; height: 20px;">
                    <span>${basicValue}</span><br>
                    ${taxValue}
                    </td>
                    <td style="border: 1px solid #000; height: 20px;">
                    ${taxValuedept}
                    </td>
                    <td style="border: 1px solid #000; height: 20px;" colspan="2">
                    <span>${basicValuecos}</span><br>
                    ${taxValuecos}
                    </td>
                    </tr>
            </tbody>
            <tbody>
                <tr>
                    <td style="border: 1px solid #000; height: 20px;" colspan="2">
                    <span>Total</span><br>
                    </td>
                    <td style="border: 1px solid #000; height: 20px;">
                    </td>
                    <td style="border: 1px solid #000; height: 20px;">
                    <span id="taxbasic1"></span><br>
                    </td>
                    <td style="border: 1px solid #000; height: 20px;">
                    </td>
                    <td style="border: 1px solid #000; height: 20px;">
                    <span id="grandlast1"></span><br>
                    </td>
                    <td style="border: 1px solid #000; height: 20px;">
                    <span id="taxtotal1"></span><br>
                    </td>
                    <td style="border: 1px solid #000; height: 20px;" colspan="2">
                    <span id="grandlast121"></span><br>
                    </td>
                </tr>
            </tbody>
            <tbody>
                <tr>
                    <td style="border: 1px solid #000; height: 20px; width: 100%;"colspan="9">
                    <span>BANK ACCOUNT DETAILS:</span><span>BANK ACCOUNT NAME:</span><b id="bankname1"></b>,
                    <span>ACCOUNT NUMBER:</span><b id="acc1"></b>,<span>BANK NAME & ADDRESS:</span><b id="bname1"></b>,<b id="add1"></b>
                    <span>BRANCH CODE:</span><b id="code1"></b>,<span>SWIFT CODE:</span><b id="scode1"></b>,<span>IFSC CODE:</span><b id="ifsc1"></b><br>
                   </td>
                </tr>
            </tbody>
            <tbody>
                <tr>
                    <td style="border: 1px solid #000; height: 20px; width: 100%;"colspan="5">
                    <span>Certified that the particulars given above are the true and correct and the amount indicated represents the price</span><br>
                    <span>actually charged from the consignee and that there is no additional consideration following directly or</span><br>
                    <span>indirectly over and above what has been declared herein.</span><br>
                    </td>
                    <td style="border: 1px solid #000; height: 20px; width: 100%;"></td>
		                    <td style="border: 1px solid #000; height: 20px; width: 100%;font-size:15px;" colspan="3">
		    <span>For JSW SEVERFIELD STRUCTURES LTD.</span><br>
		    <span style="margin-top: 20px; display: inline-block;">(Authorised signature)</span><br>
		</td>
        </tr>
            </tbody>
        </table>
       <div class="footer">
            <p>Regd Office:No.401,Grand Palladium,175 CST Road,Kalina,santacruz(East),Mumbai,IDIA-400 098 Ph:+91-22--67317000
            (All disputes subject to Karnataka Jurisdiction)E&OE</p>
        </div>
    </div>
    
    <div class="invoice-container2">
        <div class="invoice-header">
            <b><span id="topdate12"></span></b>
            <div class="gst-text">RECEIPT VOUCHER</div>
            <div class="gst-text1">Duplicate for Supplier</div>
        </div>
        
        <table class="company-details-table">
            <tr>
                <td colspan="2">
                    <div class="company-logo">
                    <img src="img/logo/download.png" alt="Company Logo" style="width: 80px;">
                      </div>
                    <strong>JSW Serverfiled Structures Limited</strong><br>
                    Near 10 MT Gate, Beside Cement Plant-2<br>
                    Vidyanagar P.O. Torangallu<br>
                    Torangallu-583275<br>
                    Ballari, Karnataka, India<br>
                    State Code:29<br>
                    GSTIN : 29AACCJ1473D1ZQ     PAN : AACCJ1473D<br>
                    ICE No: 0309033152   CIN No: U28112MH2009PLC191045<br>
                    Email: invoice@jssl.in    Website: www.jssl.in<br>
                </td>
                <td colspan="2">
                <b>Invoice No:</b> <span id="invoiceNumber12"></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b>Date:</b> <span id="date12"></span><br>
                <b>Contract No Reference No:</b> <span id="contrefno12"></span><br>
                <b>Date & Time of supply:</b> <span id="datetime12"></span><br>
                <b>Work/Purchase Order No:</b> <span id="workor12"></span><br>
                <b>Date of Order:</b> <span id="dateor12"></span><br>
            </tr>
            <tr>
                <td colspan="2"><strong>Invoice To:</strong><br>
                <span id="shipto1112"></span><br>
                <b>Name of the state:</b> <span id="statename12"></span><br>
                <b>State Code:</b> <span id="stcode1112"></span><br>
                <b>GSTIN:</b><span id="ingst12"></span><br>
                <b>PAN:</b><span id="panin12"></span><br>
                </td>
                <td colspan="2"><strong>Name & Address of consignee:</strong><br>
                <span id="conadd12"></span><br>
                <b>State Name:</b> <span id="state12"></span><br>
                <b>State Code:</b> <span id="stateco12"></span><br>
                <b>GSTIN:</b><span id="congst12"></span><br>
                <b>PAN:</b><span id="pancon12"></span><br>
                </td>
            </tr>
            <tr>
                <td><strong>Date of Notification</strong><br>
                 <strong>Exempted note under:</strong><br>
                 <strong>Tax is Payble on revese charge:(Yes/No):<span id="taxpayre12"></span></strong><br>
                 </td>
                <td><strong>Export Details:</strong><br>
                <strong>ARE No:<span id="areano12"></span></strong><br>
                <strong>LUT No:<span id="lutno12"></span></strong><br>
                <strong>Container No:<span id="contlo12"></span></strong><br>
                <strong>EPCG License No:<span id="epoglo12"></span></strong><br>
                </td>
                <td><b>Transporter:</b> <span id="trans12"></span><br>
                <b>Vehicle No:</b><span id="vehino12"></span><br>
                <b>LR/DOCKET No:<span id="lrdoc12"></span></b><br>
                <b>Date:<span id="lrdate12"></span></b><br>
                </td>
                <td><b>Shipment Mode:</b> <span id="shipmo12"></span><br>
                <b>Delivery Condition:</b> <span id="delcon12"></span><br>
                </td>
            </tr>
        </table>
        
        <table class="product-table">
            <thead>
                <tr>
                    <th>Sr No.</th>
                    <th>Product Description</th>
                    <th>Pieces</th>
                    <th>Service/HSN Code</th>
                    <th>UOM</th>
                    <th>Qty</th>
                    <th>Weight</th>
                    <th>Unit Price</th>
                    <th>Value (INR)</th>
                </tr>
            </thead>
            <tbody>
                ${tableRows} 
            </tbody>
            <tbody>
                <tr>
                    <td style="border: 1px solid #000; height: 10px;"" colspan="4">
                    <span>Freight</span><br>
                    </td>
                    <td style="border: 1px solid #000; height: 10px;" colspan="4"></td>
                    <td style="border: 1px solid #000; height: 10px;">
                    <span id="freight12"></span><br>
                    </td>
                </tr>
            </tbody>
            <tbody>
                <tr>
                    <td style="border: 1px solid #000; height: 10px;"" colspan="2">
                    <span>TOTAL</span><br>
                    </td>
                    <td style="border: 1px solid #000; height: 10px;">
                    <span id="pitotal12"></span><br></td>
                    </td>
                    <td style="border: 1px solid #000; height: 10px;"></td>
                    <td style="border: 1px solid #000; height: 10px;">
                    <td style="border: 1px solid #000; height: 10px;">
                    <span id="qtytotal12"></span><br></td>
                    </td>
                    <td style="border: 1px solid #000; height: 10px;">
                    <span id="wiegtotal12"></span><br>
                    </td>
                    <td style="border: 1px solid #000; height: 10px;"></td>
                    <td style="border: 1px solid #000; height: 10px;">
                    <span id="val1112"></span><br>
                    </td>
                 </tr>
            </tbody>
            <tbody>
                ${taxRows}
            </tbody>
            <tbody>
                <tr>
                    <td style="border: 1px solid #000; height: 20px; width: 200px;" colspan="4">
                        <b>Note:</b><span>Identification Marks & Serial No. of Goods: As per packing list attached</span><br>
                        ${taxDetails} <!-- Dynamic Tax Name & Value in Words -->
                        <b>Gross total in words:</b> <b>${grandTotalInWords}</b><br>
                    </td>
                    <td style="border: 1px solid #000; height: 20px; width: 200px;" colspan="3">
                        <b>TOTAL INVOICE VALUE:</b><br>
                    </td>
                    <td style="border: 1px solid #000; height: 10px;" colspan="2">
                        <span>${grandTotalTax}</span><br> <!-- Dynamic Grand Total Tax -->
                    </td>              
                </tr>
            </tbody>
            <tbody>
                <tr>
                    <td style="border: 1px solid #000; height: 20px;width: 200px;">
                    <span>Particulars</span><br>
                    </td>
                    <td style="border: 1px solid #000; height: 20px;">
                    <span>Tax Application</span><br>
                    </td>
                    <td style="border: 1px solid #000; height: 20px;">
                    <span>Tax %</span><br>
                    </td>
                    <td style="border: 1px solid #000; height: 20px;">
                    <span>Adv Recovery (Taxable)</span><br>
                    </td>
                    <td style="border: 1px solid #000; height: 20px;">
                    <span>Adv Recovery (NonTax)</span><br>
                    </td>
                    <td style="border: 1px solid #000; height: 20px;">
                    <span>Invoice Value</span><br>
                    </td>
                    <td style="border: 1px solid #000; height: 20px;">
                    <span>Payable to dept</span><br>
                    </td>
                    <td style="border: 1px solid #000; height: 20px;" colspan="2">
                    <span>Payable by Customer</span><br>
                    </td>
                    </tr>
            </tbody>
            <tbody>
                <tr>
                    <td style="border: 1px solid #000; height: 20px;">
                    <span>${gstremarks}</span><br>
                    </td>
                    <td style="border: 1px solid #000; height: 20px;">
                    <span>Basic</span><br>
                    ${taxDetailsNew}
                    </td>
                    <td style="border: 1px solid #000; height: 20px;">
                    ${taxPerValue}
                    </td>
                    <td style="border: 1px solid #000; height: 20px;">
                    <span>${advremarks}</span><br>
                    ${taxadvanceValue}
                    </td>
                    <td style="border: 1px solid #000; height: 20px;">
                    <span>${advremarksnon}</span><br>
                    </td>
                    <td style="border: 1px solid #000; height: 20px;">
                    <span>${basicValue}</span><br>
                    ${taxValue}
                    </td>
                    <td style="border: 1px solid #000; height: 20px;">
                    ${taxValuedept}
                    </td>
                    <td style="border: 1px solid #000; height: 20px;" colspan="2">
                    <span>${basicValuecos}</span><br>
                    ${taxValuecos}
                    </td>
                    </tr>
            </tbody>
            <tbody>
                <tr>
                    <td style="border: 1px solid #000; height: 20px;" colspan="2">
                    <span>Total</span><br>
                    </td>
                    <td style="border: 1px solid #000; height: 20px;">
                    </td>
                    <td style="border: 1px solid #000; height: 20px;">
                    <span id="taxbasic12"></span><br>
                    </td>
                    <td style="border: 1px solid #000; height: 20px;">
                    </td>
                    <td style="border: 1px solid #000; height: 20px;">
                    <span id="grandlast12"></span><br>
                    </td>
                    <td style="border: 1px solid #000; height: 20px;">
                    <span id="taxtotal12"></span><br>
                    </td>
                    <td style="border: 1px solid #000; height: 20px;" colspan="2">
                    <span id="grandlast1212"></span><br>
                    </td>
                </tr>
            </tbody>
            <tbody>
                <tr>
                    <td style="border: 1px solid #000; height: 20px; width: 100%;"colspan="9">
                    <span>BANK ACCOUNT DETAILS:</span><span>BANK ACCOUNT NAME:</span><b id="bankname12"></b>,
                    <span>ACCOUNT NUMBER:</span><b id="acc12"></b>,<span>BANK NAME & ADDRESS:</span><b id="bname12"></b>,<b id="add12"></b>
                    <span>BRANCH CODE:</span><b id="code12"></b>,<span>SWIFT CODE:</span><b id="scode12"></b>,<span>IFSC CODE:</span><b id="ifsc12"></b><br>
                   </td>
                </tr>
            </tbody>
            <tbody>
                <tr>
                    <td style="border: 1px solid #000; height: 20px; width: 100%;"colspan="5">
                    <span>Certified that the particulars given above are the true and correct and the amount indicated represents the price</span><br>
                    <span>actually charged from the consignee and that there is no additional consideration following directly or</span><br>
                    <span>indirectly over and above what has been declared herein.</span><br>
                    </td>
                    <td style="border: 1px solid #000; height: 20px; width: 100%;"></td>
		                    <td style="border: 1px solid #000; height: 20px; width: 100%;font-size:15px;" colspan="3">
		    <span>For JSW SEVERFIELD STRUCTURES LTD.</span><br>
		    <span style="margin-top: 20px; display: inline-block;">(Authorised signature)</span><br>
		</td>
        </tr>
            </tbody>
        </table>
       <div class="footer">
            <p>Regd Office:No.401,Grand Palladium,175 CST Road,Kalina,santacruz(East),Mumbai,IDIA-400 098 Ph:+91-22--67317000
            (All disputes subject to Karnataka Jurisdiction)E&OE</p>
        </div>
    </div>
   </body>
</html>
` 
    const printElement = document.createElement('div');
        printElement.innerHTML = htmlContent;
        console.log(printElement)
        // page1
     printElement.querySelector('#datetime').textContent = formattedDateTime;
     printElement.querySelector('#topdate').textContent = formattedDateTime;
     printElement.querySelector('#dateor').textContent = currentDate;
     printElement.querySelector('#date').textContent = currentDate;
     printElement.querySelector('#invoiceNumber').textContent = invoiceno;
     printElement.querySelector('#shipto11').textContent = invoice_to_id_value;
     printElement.querySelector('#taxpayre').textContent = tax_payable;
     printElement.querySelector('#areano').textContent = area_no;
     printElement.querySelector('#contlo').textContent = containter_no;
     printElement.querySelector('#lutno').textContent = lot_no;
     printElement.querySelector('#epoglo').textContent = epcgno;
     printElement.querySelector('#trans').textContent = transport_name;
     printElement.querySelector('#lrdoc').textContent = lr_docketno;
     printElement.querySelector('#lrdate').textContent = date_val;
     printElement.querySelector('#shipmo').textContent = shipment_mode_id_value;
     printElement.querySelector('#delcon').textContent = delivery_condition_id_value;
     printElement.querySelector('#conadd').textContent = consignee_id_value;
     printElement.querySelector('#workor').textContent = work_id_value;
     printElement.querySelector('#vehino').textContent = vechile_no;
     printElement.querySelector('#contrefno').textContent = con_code_with_lot_no;
     printElement.querySelector('#statename').textContent = invoiceStateName;
     printElement.querySelector('#state').textContent = consigneeStateName;
     printElement.querySelector('#stateco').textContent = consigneeStateCode;
     printElement.querySelector('#stcode11').textContent = invoiceStateCode;
     printElement.querySelector('#congst').textContent = consigneeGstNo;
     printElement.querySelector('#ingst').textContent = invoiceGstNo;
     printElement.querySelector('#pancon').textContent = consigneePanNo;
     printElement.querySelector('#panin').textContent = invoicePanNo;
     printElement.querySelector('#freight').textContent = freight;
     printElement.querySelector('#pitotal').textContent = total_pices;
     printElement.querySelector('#qtytotal').textContent = total_qty;
     printElement.querySelector('#wiegtotal').textContent = total_kgs;
     printElement.querySelector('#val11').textContent = basic_value;
     printElement.querySelector('#grandlast').textContent = Grand_Total_tax;
     printElement.querySelector('#grandlast12new').textContent = PBC_Final_total;
     printElement.querySelector('#bankname').textContent = bankName;
     printElement.querySelector('#acc').textContent = account_number;
     printElement.querySelector('#bname').textContent = branch_address;
     printElement.querySelector('#code').textContent = branch_code;
     printElement.querySelector('#scode').textContent = swift_code;
     printElement.querySelector('#ifsc').textContent = ifsc_code;
     printElement.querySelector('#taxbasic').textContent = Total_adv_tax_Taxable;
     printElement.querySelector('#taxtotal').textContent = Tax_Final_total;
     //printElement.querySelector('#prodesc').textContent = product_desc;
     
     //page 2
     printElement.querySelector('#datetime1').textContent = formattedDateTime;
     printElement.querySelector('#topdate1').textContent = formattedDateTime;
     printElement.querySelector('#dateor1').textContent = currentDate;
     printElement.querySelector('#date1').textContent = currentDate;
     printElement.querySelector('#invoiceNumber1').textContent = invoiceno;
     printElement.querySelector('#shipto111').textContent = invoice_to_id_value;
     printElement.querySelector('#taxpayre1').textContent = tax_payable;
     printElement.querySelector('#areano1').textContent = area_no;
     printElement.querySelector('#contlo1').textContent = containter_no;
     printElement.querySelector('#lutno1').textContent = lot_no;
     printElement.querySelector('#epoglo1').textContent = epcgno;
     printElement.querySelector('#trans1').textContent = transport_name;
     printElement.querySelector('#lrdoc1').textContent = lr_docketno;
     printElement.querySelector('#lrdate1').textContent = date_val;
     printElement.querySelector('#shipmo1').textContent = shipment_mode_id_value;
     printElement.querySelector('#delcon1').textContent = delivery_condition_id_value;
     printElement.querySelector('#conadd1').textContent = consignee_id_value;
     printElement.querySelector('#workor1').textContent = work_id_value;
     printElement.querySelector('#vehino1').textContent = vechile_no;
     printElement.querySelector('#contrefno1').textContent = con_code_with_lot_no;
     printElement.querySelector('#statename1').textContent = invoiceStateName;
     printElement.querySelector('#state1').textContent = consigneeStateName;
     printElement.querySelector('#stateco1').textContent = consigneeStateCode;
     printElement.querySelector('#stcode111').textContent = invoiceStateCode;
     printElement.querySelector('#congst1').textContent = consigneeGstNo;
     printElement.querySelector('#ingst1').textContent = invoiceGstNo;
     printElement.querySelector('#pancon1').textContent = consigneePanNo;
     printElement.querySelector('#panin1').textContent = invoicePanNo;
     printElement.querySelector('#freight1').textContent = freight;
     printElement.querySelector('#pitotal1').textContent = total_pices;
     printElement.querySelector('#qtytotal1').textContent = total_qty;
     printElement.querySelector('#wiegtotal1').textContent = total_kgs;
     printElement.querySelector('#val111').textContent = basic_value;
     printElement.querySelector('#grandlast1').textContent = Grand_Total_tax;
     printElement.querySelector('#grandlast121').textContent = PBC_Final_total;
     printElement.querySelector('#bankname1').textContent = bankName;
     printElement.querySelector('#acc1').textContent = account_number;
     printElement.querySelector('#bname1').textContent = branch_address;
     printElement.querySelector('#code1').textContent = branch_code;
     printElement.querySelector('#scode1').textContent = swift_code;
     printElement.querySelector('#ifsc1').textContent = ifsc_code;
     printElement.querySelector('#taxbasic1').textContent = Total_adv_tax_Taxable;
     printElement.querySelector('#taxtotal1').textContent = Tax_Final_total;
     
     //page 3
     printElement.querySelector('#datetime12').textContent = formattedDateTime;
     printElement.querySelector('#topdate12').textContent = formattedDateTime;
     printElement.querySelector('#dateor12').textContent = currentDate;
     printElement.querySelector('#date12').textContent = currentDate;
     printElement.querySelector('#invoiceNumber12').textContent = invoiceno;
     printElement.querySelector('#shipto1112').textContent = invoice_to_id_value;
     printElement.querySelector('#taxpayre12').textContent = tax_payable;
     printElement.querySelector('#areano12').textContent = area_no;
     printElement.querySelector('#contlo12').textContent = containter_no;
     printElement.querySelector('#lutno12').textContent = lot_no;
     printElement.querySelector('#epoglo12').textContent = epcgno;
     printElement.querySelector('#trans12').textContent = transport_name;
     printElement.querySelector('#lrdoc12').textContent = lr_docketno;
     printElement.querySelector('#lrdate12').textContent = date_val;
     printElement.querySelector('#shipmo12').textContent = shipment_mode_id_value;
     printElement.querySelector('#delcon12').textContent = delivery_condition_id_value;
     printElement.querySelector('#conadd12').textContent = consignee_id_value;
     printElement.querySelector('#workor12').textContent = work_id_value;
     printElement.querySelector('#vehino12').textContent = vechile_no;
     printElement.querySelector('#contrefno12').textContent = con_code_with_lot_no;
     printElement.querySelector('#statename12').textContent = invoiceStateName;
     printElement.querySelector('#state12').textContent = consigneeStateName;
     printElement.querySelector('#stateco12').textContent = consigneeStateCode;
     printElement.querySelector('#stcode1112').textContent = invoiceStateCode;
     printElement.querySelector('#congst12').textContent = consigneeGstNo;
     printElement.querySelector('#ingst12').textContent = invoiceGstNo;
     printElement.querySelector('#pancon12').textContent = consigneePanNo;
     printElement.querySelector('#panin12').textContent = invoicePanNo;
     printElement.querySelector('#freight12').textContent = freight;
     printElement.querySelector('#pitotal12').textContent = total_pices;
     printElement.querySelector('#qtytotal12').textContent = total_qty;
     printElement.querySelector('#wiegtotal12').textContent = total_kgs;
     printElement.querySelector('#val1112').textContent = basic_value;
     printElement.querySelector('#grandlast12').textContent = Grand_Total_tax;
     printElement.querySelector('#grandlast1212').textContent = PBC_Final_total;
     printElement.querySelector('#bankname12').textContent = bankName;
     printElement.querySelector('#acc12').textContent = account_number;
     printElement.querySelector('#bname12').textContent = branch_address;
     printElement.querySelector('#code12').textContent = branch_code;
     printElement.querySelector('#scode12').textContent = swift_code;
     printElement.querySelector('#ifsc12').textContent = ifsc_code;
     printElement.querySelector('#taxbasic12').textContent = Total_adv_tax_Taxable;
     printElement.querySelector('#taxtotal12').textContent = Tax_Final_total;
     
    newWindow.document.write(htmlContent);
        newWindow.document.close();

    } catch (error) {
        console.error("Error:", error);
        //alert("Failed to load invoice data.");
    }
}*/

function openModalcancel(id,pn_id) {
    // Open the modal
		//  const allowed = window.allowedActions || [];

	if (!allowed.includes("Cancel")) {
	  alert(" You do not have permission to Cancel.");
	  $('#exampleModalCenter16').modal('hide');
	  return;
	}
    $('#exampleModalCenter16').modal('show');

    // Store the id and pn_id in the modal's data attributes
    $('#exampleModalCenter16').attr('data-id', id);
	$('#exampleModalCenter16').attr('data-pn-id', pn_id);
}

function cancelRecord(id) {
	$('#exampleModalCenter16').modal('hide');
	// Store the id and pn_id in the modal's data attributes
	var id =$('#exampleModalCenter16').attr('data-id');
	var pn_id = $('#exampleModalCenter16').attr('data-pn-id');
	$.ajax({
	    url: new URL('/jssl/invoice/advancecancelbyidnew', baseUrl),   // cancel endpoint
	    type: 'POST',
	    dataType: 'json',
	    xhrFields: {
	        withCredentials: true
	    },
	    data: jQuery.param({
	        id: id,    
	        cancelled_by: createdById,
			factory_id:selectedFactoryId,
			pn_id:pn_id
	    }),
	    success: function (data) {

	        var result = data.message;

	        if (result === "Success") {

	            const popup = $('<div class="popup"> Advance Invoice Cancelled Successfully!</div>')
	                .appendTo('body')
	                .hide()
	                .fadeIn(400);

	            setTimeout(function () {
	                popup.fadeOut(400, function () {
	                    $(this).remove();
	                    window.location = 'AdvanceInvoiceEntry.jsp';
	                });
	            }, 800);

	        } else {
				const errorMessage = data.message || 'Failed to create invoice.';
				              $('#errorMessage').text(errorMessage);
				              $('#exampleModalCenter16').modal('hide');
	        }
	    },
	    error: function () {
	        console.error('Cancel request failed.');
	    }
	});
	
	}

	function formatAddress(address) {
	    if (!address) return '';

	    return address
	        .split(',')
	        .map(part => part.trim())
	        .join('<br>');
	}



	
	function showLoader() {
	  document.getElementById("pdfLoader").style.display = "flex";
	}

	function hideLoader() {
	  document.getElementById("pdfLoader").style.display = "none";
	}

	function toTitleCase(str) {
	    return str
	        .toLowerCase()
	        .replace(/\b\w/g, function(char) {
	            return char.toUpperCase();
	        });
	}
