
let allowed = null;


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

document.addEventListener("DOMContentLoaded", function () {
	loadAllowedActions();
    const selectedFactoryId = sessionStorage.getItem("selectedFactoryId"); // Get factory_id from sessionStorage
    if (selectedFactoryId) {
        fetchCont(selectedFactoryId); // Fetch contractor list on page load
			  fetchinvoice();
			  fetchinvoice1();
    } else {
        console.error("No factory ID found in sessionStorage.");
    }
	
	document.getElementById("cont").addEventListener("change", function () {
	    const selectedContractorId = this.value; // Get selected contractor ID
	    const selectedFactoryId = sessionStorage.getItem("selectedFactoryId"); // Get factory ID again

	    if (selectedContractorId) {
	        fetchLoad(selectedFactoryId, selectedContractorId); // Fetch load dropdown
	    } else {
	        console.warn("No contractor selected.");
	        document.getElementById("load").innerHTML = `<option value="">Select load</option>`; // Clear load dropdown
	        document.getElementById("inputFieldsContainer").style.display = "none"; // Hide the input fields container
	    }
	});
	
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
	
						async function fetchQsPackingData(contract_id,loadId) {
						      try {
						          const selectedFactoryId = sessionStorage.getItem("selectedFactoryId"); // Get the factory_id from sessionStorage

						          // Ensure factory_id is available
						          if (!selectedFactoryId) {
						              console.error("No factory ID found in sessionStorage.");
						              return;
						          }

						          const url = new URL(`/jssl/invoice/getconsolidatedpackingdetailsnew`, baseUrl);
						          
						          // Append the parameters to the URL
						          url.searchParams.append("load_id", loadId);
								  url.searchParams.append("contract_id", contract_id);
						          url.searchParams.append("factory_id", selectedFactoryId); // Append factory_id as well

						  		const response = await fetch(url,{
						  						           method: "GET",
						  						           credentials: "include"   // ✅ Always send JSESSIONID cookie
						  						       });
						          if (!response.ok) throw new Error("Failed to fetch QsPacking data");

						          const json = await response.json();
						          
						  
						          if (json.QsPacking_Data && json.QsPacking_Data.length > 0) {
						          const QsPacking = json.QsPacking_Data[0];
						          
						              
						              const pnidValue = QsPacking.conpn_id; // Assuming the bank details ID is inside this property
						              const pnid = document.getElementById("id11");
						              if (pnid) {
						                  pnid.value = pnidValue; // Populate the bank name field
						              }
						              
						          } else {
						              console.warn("No qspacking Data found.");
						          }
						          // Check if QsPacking_Data exists and contains items
						          if (json.QsPacking_Data && json.QsPacking_Data.length > 0) {
						              const container = document.querySelector(".dynamic-row"); // Find the container for dynamic rows
						              container.innerHTML = ""; // Clear any existing rows
								   let grandTotal = 0; // 🔹 Initialize sum
						              // Loop through QsPacking_Data and create input fields dynamically
						              json.QsPacking_Data.forEach((item, index) => {
									const showLabel = index === 0;
						                  const div = document.createElement("div");
						                  div.classList.add("form-group-container", "col-md-12"); // Add classes to style the row
									   
									   // Make sure total is numeric before adding
									         const rowTotal = parseFloat(item.total) || 0;
									         grandTotal += rowTotal; // 🔹 Add to running sum

						                  // Create fields dynamically based on the data
						                  div.innerHTML = `
						                      <div class="form-row">
										   
						                          <div class="col-auto">
						                               ${showLabel ? '<label><b>UOM</b></label>' : ''}
						                              <input type="text" id="uom_${index}" value="${item.uom}" class="form-control form-control-sm small-input" disabled>
						                          </div>
											   <div class="col-auto">
						                               ${showLabel ? '<label><b>Quantity</b></label>' : ''}
						                              <input type="number" id="qty_${index}" value="${item.qty}" class="form-control form-control-sm small-input text-right" disabled>
						                          </div>
											   
											   <div class="col-auto">
						                               ${showLabel ? '<label><b>Kg</b></label>' : ''}
						                              <input type="number" id="kg_${index}" value="${item.per_kgs}" class="form-control form-control-sm small-input text-right" disabled>
						                          </div>
											   
											   <div class="col-auto">
						                              ${showLabel ? '<label><b>Unit Price</b></label>' : ''}
						                              <input type="number" id="unit_price_${index}" value="${item.unit_price}" class="form-control form-control-sm small-input text-right" disabled>
						                          </div>
											   
											   <div class="col-auto">
						                             ${showLabel ? '<label><b>Total</b></label>' : ''}
						                              <input type="number" id="total_${index}" value="${item.total}" class="form-control form-control-sm small-input text-right" disabled>
						                          </div>
											   
											   <div class="col-auto">
						                              ${showLabel ? '<label><b>Invoice Type</b></label>' : ''}
						                              <input type="text" id="intype_${index}" value="${item.scrap_name_type_id}" class="form-control form-control-sm small-input" disabled>
						                          </div>
						                          
						                    </div>
										 
										 ${showLabel ? '<hr>' : ''}
						                  `;
						                  
						                  container.appendChild(div); // Append the new dynamic row
						               });
						          } else {
						              console.warn("No QsPacking data found.");
						          }
								  if (json.tax && json.tax.length > 0) {
								         const taxContainer = document.querySelector(".dynamic-row1"); // Find the container for dynamic tax rows
								         taxContainer.innerHTML = ""; // Clear any existing rows

								         // Loop through tax data and create dynamic rows
								         json.tax.forEach((tax, taxIndex) => {
								             const div = document.createElement("div");
								             div.classList.add("form-group", "col-md-12"); // Add classes to style the tax row

								             // Create fields dynamically based on tax data
								             div.innerHTML = `
								                 <div class="form-row">
								                     <div class="form-group col-md-3 col-sm-12">
								                         <label for="tax_name_${taxIndex}"><b>Tax Name</b></label>
								                         <input type="text" id="tax_name_${taxIndex}" value="${tax.tax_name}" class="form-group col-md-8 col-sm-12" disabled>
								                     </div>
								                     <div class="form-group col-md-3 col-sm-12">
								                         <label for="tax_per_${taxIndex}"><b>Tax Percentage</b></label>
								                         <input type="text" id="tax_per_${taxIndex}" value="${tax.tax_per}" class="form-group col-md-8 col-sm-12" disabled>
								                     </div>
								                     <div class="form-group col-md-3 col-sm-12">
								                         <label for="tax_per_${taxIndex}"><b>Tax Value</b></label>
								                         <input type="text" id="tax_per_${taxIndex}" value="${tax.tax_value}" class="form-group col-md-8 col-sm-12 text-right" disabled>
								                     </div>
								                 </div>
								             `;
								             
								             taxContainer.appendChild(div); // Append the new dynamic tax row
								         });
								     } else {
								         console.warn("No tax data found.");
								     }
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
								            const InvoiceTypeCal = contractor.invoice_type_calculation; // Assuming the work order ID is inside this property
								            const InvoiceTypeCalcu = document.getElementById("intypecal");
								            if (InvoiceTypeCalcu) {
								                InvoiceTypeCalcu.value = InvoiceTypeCal; // Populate the work order field
								            }
								            const InvoiceToValue = contractor.invoice_to_id_value; // Assuming the work order ID is inside this property
								            const InvoiceTo = document.getElementById("ininto");
								            if (InvoiceTo) {
								                InvoiceTo.value = InvoiceToValue; // Populate the work order field
								            }
								            const ProductValue = contractor.product_desc_id; // Assuming the work order ID is inside this property
								            const ProDec = document.getElementById("prodesc");
								            if (ProDec) {
								                ProDec.value = ProductValue; // Populate the work order field
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
								            const TaxPayValye = contractor.tax_payable; // Assuming the work order ID is inside this property
								            const taxpay = document.getElementById("taxres");
								            if (taxpay) {
								                taxpay.value = TaxPayValye; // Populate the work order field
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
						      } catch (error) {
						          console.error("Error fetching QsPacking data:", error);
						      }
						  }
						  
			
						  async function fetchCont(factoryId) {
						      try {
						          const url = new URL(`/jssl/getlistcontractorsfromconsolidatedpackingnew`, baseUrl);
						          url.searchParams.append("factory_id", factoryId);

						          const response = await fetch(url, { method: "GET", credentials: "include" });
						          if (!response.ok) throw new Error("Failed to fetch contractors");

						          const json = await response.json();

						          if (json.status !== "yes" || !json.DATA?.length) {
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

						          // ✅ When contract changes, load the load IDs
						          selectElement.addEventListener("change", function () {
						              const selectedContractId = this.value;
						              const loadSelect = document.getElementById("load");
						              loadSelect.innerHTML = `<option value="">Select load</option>`;  // reset

						              if (selectedContractId) {
						                  fetchLoad(factoryId, selectedContractId);  // ✅ fetch loads for this contract
						              }
						          });

						      } catch (error) {
						          console.error("Error fetching contractors:", error);
						      }
						  }

						  async function fetchLoad(factoryId, contractId) {
						      try {
						          // ✅ new endpoint - only unlocked loads
						          const url = new URL(`/jssl/consolidatedinvoice/getloadsforcontract`, baseUrl);
						          url.searchParams.append("factory_id", factoryId);
						          url.searchParams.append("con_id", contractId);

						          const response = await fetch(url, { method: "GET", credentials: "include" });
						          const json = await response.json();

						          const loadSelect = document.getElementById("load");
						          loadSelect.innerHTML = `<option value="">Select load</option>`;

						          if (json.status !== "yes" || !json.DATA?.length) {
						              console.warn("No unlocked loads found for this contract.");
						              return;
						          }

						          json.DATA.forEach((type) => {
						              if (type.load_id) {
						                  const option = document.createElement("option");
						                  option.value = type.load_id;
						                  option.textContent = type.load_id;
						                  loadSelect.appendChild(option);
						              }
						          });

						      } catch (error) {
						          console.error("Error fetching loads:", error);
						      }
						  }
	
	async function fetchinvoice() {
	    try {
	        
	        // Construct the API URL properly
	        const url = new URL(`/jssl/master/listinvoicetyperemarksnew`, baseUrl);
	        //url.searchParams.append("factory_id", factoryId);

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
	        const selectElement = document.getElementById("intype444");

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
	

			async function fetchinvoice1() {
					    try {
					        
					        // Construct the API URL properly
					        const url = new URL(`/jssl/master/listinvoicetyperemarksnew`, baseUrl);
					        //url.searchParams.append("factory_id", factoryId);

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
					        const selectElement = document.getElementById("intypeeditup");

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
					
					document.addEventListener("DOMContentLoaded", function () {
					    const selectedFactoryId = sessionStorage.getItem("selectedFactoryId"); // Get factory_id from sessionStorage
					    if (selectedFactoryId) {
					        fetchBgType();
					        fetchUserList111(selectedFactoryId);
					        fetchBgTypeedit();
					    } else {
					        console.error("No factory ID found in sessionStorage.");
					    }
					});
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

					
					/*async function fetchUserList111(selectedFactoryId) {
						try {
					        
					        // Construct the API URL
					        const url = new URL(`/jssl/consolidatedinvoice/listnew`, baseUrl);
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
					                    <th>Invoice  Date</th>
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

									     ✅ Print allowed 
									    printIcon = `
									        <td>
									            <i class="fa fa-print" style="color: green; cursor: pointer;"
									               onclick="printRecord('${item.id}', '${item.status}')">
									            </i>
									        </td>
									    `;

									 🟢 VERIFIED 
									} else if (item.status === 'VERIFIED') {
						            editinvoice = `<td><i class="fa fa-edit text-muted"></i></td>`;
					                editIcon = `<td><i class="fa fa-pen text-muted"></i></td>`; // Disabled (greyed out)
					                //viewIcon = `<td><i class="fa fa-eye" style="color: green;" onclick="editRecord11('${item.id}')"></i></td>`; // Enabled
									printIcon = `<td><i id="printvvvtest" class="fa fa-print" style="color: green;" onclick="printRecord('${item.id}')"></i></td>`; // Enabled
									 printIcon = `<td><i class="fa fa-print" style="color: red;" onclick="printRecord('${item.id}')"></i></td>`; // Enabled
					                releaseIcon = `<td><i id="releaseinc"  class="fa fa-box-open" style="color: brown;" onclick="openModal('${item.id}', '${item.conpn_id}')"></i></td>`;
									cancelIcon = ` <td><i class="fa fa-times-circle"style="color: red; cursor: pointer;" onclick="openModalcancel('${item.id}', '${item.conpn_id}')"></i></td> `;

					            } else if (item.status === 'NOT VERIFIED') {
						            editinvoice = `<td><i id="updateinvoice"  class="fa fa-edit" style="color: blue;" onclick="editRecordInvoice('${item.id}', '${item.load_id}')"></i></td>`; // Enabled
									editIcon = `<td><i id="verfiyinc" class="fa fa-pen" style="color: blue;" onclick="editRecord('${item.id}')"></i></td>`; // Enabled
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
					                    <td style="display:none;">${item.conpn_id}</td>
					                    ${editinvoice}
					                    ${editIcon}
					                    <td><i class="fa fa-eye" style="color: green;" onclick="editRecord11('${item.id}', '${item.status}')"></i></td>
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
					
					
					
					
					
					let currentFactoryIdConsolidated = null;

					function fetchUserList111(selectedFactoryId) {

					    currentFactoryIdConsolidated =
					        selectedFactoryId || sessionStorage.getItem("selectedFactoryId");

					    // 🔥 Destroy existing table
					    if ($.fn.DataTable.isDataTable('#tableID')) {
					        $('#tableID').DataTable().clear().destroy();
					    }

					    $('#tableID').DataTable({
					        processing: true,
					        serverSide: true,
					        scrollX: true,
					        searching: true,
					        pageLength: 10,
					        dom: 'Bfrtip',

					        buttons: [
					            {
					                text: 'Export to Excel',
					                action: function () {

					                    const url = new URL(`/jssl/consolidatedinvoice/listnewpaged`, baseUrl);
					                    url.searchParams.append('factory_id', currentFactoryIdConsolidated);
					                    url.searchParams.append('page', 0);
					                    url.searchParams.append('size', 99999);

					                    fetch(url, { credentials: "include" })
					                        .then(res => res.json())
					                        .then(json => {

					                            const formatDate = (d) =>
					                                d ? new Date(d).toLocaleDateString("en-GB").replace(/\//g, '-') : '';

					                            const exportData = json.Data.map(item => [
					                                item.contract_name || '',
					                                item.load_id || '',
					                                item.invoice_number || '',
					                                formatDate(item.created_onlydate),
					                                item.status || ''
					                            ]);

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
					                                        $('<tr>').append(
					                                            row.map(cell => $('<td>').text(cell))
					                                        )
					                                    )
					                                )
					                            ).appendTo('body');

					                            $(tempTable).DataTable({
					                                buttons: [{ extend: 'excelHtml5', title: 'Consolidated Invoice List' }]
					                            }).button(0).trigger();

					                            setTimeout(() => {
					                                $(tempTable).DataTable().destroy();
					                                $(tempTable).remove();
					                            }, 1000);
					                        })
					                        .catch(err => console.error('Export error:', err));
					                }
					            }
					        ],

					        columns: [
					            { title: "Contract Name" },
					            { title: "Lot Number" },
					            { title: "Invoice Number" },
					            { title: "Invoice Date" },
					            { title: "Status" },
					            { title: "pnid", visible: false },
					            { title: "Edit", orderable: false },
					            { title: "Verify", orderable: false },
					            { title: "View", orderable: false },
					            { title: "Release", orderable: false },
					            { title: "Cancel", orderable: false },
					            { title: "Print", orderable: false }
					        ],

					        ajax: function (data, callback) {

					            const page = data.start / data.length;
					            const size = data.length;
								const searchValue = data.search.value;
					            const url = new URL(`/jssl/consolidatedinvoice/listnewpaged`, baseUrl);
					            url.searchParams.append('factory_id', currentFactoryIdConsolidated);
					            url.searchParams.append('page', page);
					            url.searchParams.append('size', size);
								url.searchParams.append('search', searchValue);

					            fetch(url, { credentials: "include" })
					                .then(res => res.json())
					                .then(json => {

					                    if (!json.Data || json.status === 'error') {
					                        callback({
					                            draw: data.draw,
					                            recordsTotal: 0,
					                            recordsFiltered: 0,
					                            data: []
					                        });
					                        return;
					                    }

					                    const formatDate = (d) =>
					                        d ? new Date(d).toLocaleDateString("en-GB").replace(/\//g, '-') : '';

					                    const rows = json.Data.map(item => {

					                        let editInvoice = `<i class="fa fa-edit text-muted"></i>`;
					                        let editIcon = `<i class="fa fa-pen text-muted"></i>`;
					                        let releaseIcon = `<i class="fa fa-box-open text-muted"></i>`;
					                        let cancelIcon = `<i class="fa fa-times-circle text-muted"></i>`;
					                        let printIcon = `<i class="fa fa-print text-muted"></i>`;

					                        if (item.status === 'NOT VERIFIED') {
					                            editInvoice = `<i class="fa fa-edit" style="color:blue;" onclick="editRecordInvoice('${item.id}','${item.load_id}')"></i>`;
					                            editIcon = `<i class="fa fa-pen" style="color:blue;" onclick="editRecord('${item.id}')"></i>`;
					                        }
					                        else if (item.status === 'VERIFIED') {
					                            releaseIcon = `<i class="fa fa-box-open" style="color:brown;" onclick="openModal('${item.id}','${item.conpn_id}')"></i>`;
					                            cancelIcon = `<i class="fa fa-times-circle" style="color:red;cursor:pointer;" onclick="openModalcancel('${item.id}','${item.conpn_id}','${item.load_id}')"></i>`;
					                            printIcon = `<i class="fa fa-print" style="color:green;" onclick="printRecord('${item.id}')"></i>`;
					                        }
					                        else if (item.status === 'CANCELLED') {
					                            /*printIcon = `<i class="fa fa-print" style="color:green;" onclick="printRecord('${item.id}')"></i>`;*/
												
												printIcon = `
																				        <td>
																				            <i class="fa fa-print" style="color: green; cursor: pointer;"
																				               onclick="printRecord('${item.id}', '${item.status}')">
																				            </i>
																				        </td>
																				    `;

					                        }

					                        return [
					                            item.contract_name || '',
					                            item.load_id || '',
					                            item.invoice_number || '',
					                            formatDate(item.created_onlydate),
					                            item.status || '',
					                            item.load_id || '',
					                            editInvoice,
					                            editIcon,
					                            `<i class="fa fa-eye" style="color:green;" onclick="editRecord11('${item.id}','${item.status}')"></i>`,
					                            releaseIcon,
					                            cancelIcon,
					                            printIcon
					                        ];
					                    });

					                    callback({
					                        draw: data.draw,
					                        recordsTotal: json.totalItems,
					                        recordsFiltered: json.totalItems,
					                        data: rows
					                    });

					                })
					                .catch(err => {
					                    console.error('Error fetching Consolidated Invoice data:', err);
					                    callback({
					                        draw: data.draw,
					                        recordsTotal: 0,
					                        recordsFiltered: 0,
					                        data: []
					                    });
					                });
					        }
					    });
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

						
					    var username = document.getElementById('intype444').value.trim();
					    var prodes = document.getElementById('prodes').value.trim();
					    var remark = document.getElementById('remark').value.trim();
					    var showError = false; // Initialize showError variable

					    // Username Validation
					    if (username === '') {
					        document.getElementById('Vehicleerror').innerText = "Please select invoice type.";
					        document.getElementById('Vehicleerror').style.display = "inline-block";
					        showError = true;
					    } else {
					        document.getElementById('Vehicleerror').innerText = "";
					        document.getElementById('Vehicleerror').style.display = "none";
					    }
					    
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
					   
					// Fetch selectedFactoryId from sessionStorage
					const selectedFactoryId = sessionStorage.getItem('selectedFactoryId');
					console.log('selectedFactoryId:', selectedFactoryId);
					
					function addevent() {
					    // Validate role code and role description
					    const selectedCOnt = document.getElementById("cont").selectedOptions[0]; // Get the selected option
					    const contid = selectedCOnt ? selectedCOnt.value : ''; // Get the contract_id
					    const contname = selectedCOnt ? selectedCOnt.textContent : ''; // Get the contract_name
					    
					    $.ajax({
					        url: new URL('/jssl/invoice/addconsolidatednew', baseUrl),
					        type: 'POST',
							xhrFields: {
								    withCredentials: true
								},
					        dataType: 'json',
					        data: jQuery.param({
					            contract_id: contid,
					            created_by: createdById,
					            load_id: load.value,
					            invoice_type: "CIN",
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
					            inc_type: intype444.value,
					            pn_id: id11.value
					        }),
					        success: function (data) {
					            var result = data.message;

					            if (result === "Success") {
					                const popup = $('<div class="popup">Consolidated Invoice Created Successfully!</div>')
					                    .appendTo('body').hide().fadeIn(400);

					                setTimeout(function () {
					                    popup.fadeOut(400, function () {
					                        $(this).remove();
					                        window.location = 'ConsolidatedInvoice.jsp';
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
					function setInputValue(selector, value) {
					    $(selector).val(value ? value : ""); // Set value or empty string if undefined/null
					}
					async function editRecordInvoice(id,load_id) {
								//  const allowed = window.allowedActions || [];

						if (!allowed.includes("Edit")) {
						  alert(" You do not have permission to edit.");
						  return;
						}
						console.log(" edit record with ID:", id);
					    try 
						{
					        const url = new URL(`/jssl/invoice/searchconsolidatedidnew`, baseUrl);
					        url.searchParams.append('id', id);
							url.searchParams.append('load_id', load_id);

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
							setInputValue("#vcontract11up", invoiceData.load_id);
					        setInputValue("#vidverifyup", invoiceData.id);

					        // Set "freight" value
					        setInputValue("#vfreight11up", packingData.length > 0 ? packingData[0].freight : "");
					        setInputValue("#pnverifywwup", packingData.length > 0 ? packingData[0].conpn_id : "");
					        setInputValue("#intypeeditup", packingData.length > 0 ? packingData[0].inc_type : "");

					        // Set grand total value
					        setInputValue("#grandvup", GrandValue.length > 0 ? GrandValue[0].Grand_Total_tax : "");

					        // Set contractor data fields
					        const contractorFields = {
					            "#bunitvup": "business_unit_name",
					            "#intypevup": "invoice_type_calculation",
					            "#intovup": "invoice_to_id_value",
					            "#prodesvup": "product_desc_id",
					            "#shipmodevup": "shipment_mode_id_value",
					            "#workordervup": "work_id_value",
					            "#exptvup": "export",
					            "#taxresvup": "tax_payable",
					            "#percenvup": "percentage_value",
					            "#nandconvup": "consignee_id_value",
					            "#banknamevup": "bank_details_id_value",
					            "#deliveryconvup": "delivery_condition_id_value",
					            "#officevvup": "reg_office_id_value",
					            "#vingrandvup": "tax_ex_inc",
					            "#advFup": "freight_advance_recovery",
					            "#arevup": "area_no",
					            "#lutvup": "lot_no",
					            "#connumvup": "containter_no",
					            "#epogvup": "epcgno",
					            "#exptitlevup": "export_title",
					            "#newhcode": "h_code_value",
					            "#newscode": "s_code_value",
					        };
					        
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
					      /*  packingData.forEach((item) => {
					            $(".dynamic-row11uptest").append(`
					                <div class="row align-items-center mb-1">
					                    <div class="col-auto"><label class="small-label">UOM</label>
					                        <input type="text" class="form-control form-control-sm small-input" value="${item.uom_name}" readonly>
					                    </div>
					                    <div class="col-auto"><label class="small-label">Quantity</label>
					                        <input type="text" class="form-control form-control-sm small-input" value="${item.qty}" readonly>
					                    </div>
					                    <div class="col-auto"><label class="small-label">Kg</label>
					                        <input type="text" class="form-control form-control-sm small-input" value="${item.per_kgs}" readonly>
					                    </div>
					                    <div class="col-auto"><label class="small-label">Unit Price</label>
					                        <input type="text" class="form-control form-control-sm small-input" value="${item.unit_price}" readonly>
					                    </div>
					                    <!--  <div class="col-auto"><label class="small-label">pices</label>
					                        <input type="text" class="form-control form-control-sm small-input" value="${item.pice}" readonly>
					                    </div> -->
					                    <div class="col-auto"><label class="small-label">Total</label>
					                        <input type="text" class="form-control form-control-sm small-input" value="${item.total}" readonly>
					                    </div>
					                    <div class="col-auto"><label class="small-label">Invoice Type</label>
					                        <input type="text" class="form-control form-control-sm small-input" value="${item.scrap_name_type_id}" readonly>
					                    </div>
					                    <div class="col-auto"><label class="small-label">Milestone</label>
					                        <input type="text" class="form-control form-control-sm small-input" value="${item.milestone_name}" readonly>
					                    </div>
					                  <!--   <div class="col-auto"><label class="small-label">Service Code</label>
					                        <input type="text" class="form-control form-control-sm small-input" value="${item.scode}" readonly>
					                    </div>
					                    <div class="col-auto"><label class="small-label">HSN Code</label>
					                        <input type="text" class="form-control form-control-sm small-input" value="${item.hcode}" readonly>
					                    </div> -->
					                </div>
					                <hr style="width:100%;border-top:1px solid #ccc;">
					            `);
					        });*/
							packingData.forEach((item, index) => {

							    const showLabel = index === 0;   // true only for first item

							    $(".dynamic-row11uptest").append(`
							        <div class="row align-items-center mb-1">
							            <div class="col-auto">
							                ${showLabel ? '<label class="small-label">UOM</label>' : ''}
							                <input type="text" class="form-control form-control-sm small-input" value="${item.uom}" readonly>
							            </div>

							            <div class="col-auto">
							                ${showLabel ? '<label class="small-label">Quantity</label>' : ''}
							                <input type="text" class="form-control form-control-sm small-input text-right" value="${item.qty}" readonly>
							            </div>

							            <div class="col-auto">
							                ${showLabel ? '<label class="small-label">Kg</label>' : ''}
							                <input type="text" class="form-control form-control-sm small-input text-right" value="${item.per_kgs}" readonly>
							            </div>

							            <div class="col-auto">
							                ${showLabel ? '<label class="small-label">Unit Price</label>' : ''}
							                <input type="text" class="form-control form-control-sm small-input text-right" value="${item.unit_price}" readonly>
							            </div>

							            <div class="col-auto">
							                ${showLabel ? '<label class="small-label">Total</label>' : ''}
							                <input type="text" class="form-control form-control-sm small-input text-right" value="${item.total}" readonly>
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

							        ${showLabel ? '<hr>' : ''}
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
					                    <div class="col-auto"><label class="small-label1">PTD</label>
					                        <input type="text" class="form-control form-control-sm small-input1 text-right" value="${tax.ptd}" readonly>
					                    </div>
					                    <div class="col-auto"><label class="small-label1">PBC</label>
					                        <input type="text" class="form-control form-control-sm small-input1 text-right" value="${tax.ptc}" readonly>
					                    </div>
					                    <div class="col-auto" style="display:none;"><label class="small-label1">Tax Id</label>
					                        <input type="text" class="form-control form-control-sm small-input1" value="${tax.tax_id}">
					                    </div>
					                </div>
					                <hr>
					            `);
					        });

					        // Show the modal
					        $("#exampleModalScrollableEditUp").modal("show");

					    } catch (error) {
					        console.error('Error fetching invoice data:', error);
					    }
					}
						
					function openModalUpdate() {
					    var username = document.getElementById('intypeeditup').value.trim();
					    var username1 = document.getElementById('prodesv11up').value.trim();
					    var username12 = document.getElementById('remarkvup').value.trim();
					    var showError = false; // Initialize showError variable

					    // Username Validation
					    if (username === '') {
					        document.getElementById('intype').innerText = "Please select Invoice type.";
					        document.getElementById('intype').style.display = "inline-block";
					        showError = true;
					    } else {
					        document.getElementById('intype').innerText = "";
					        document.getElementById('intype').style.display = "none";
					    }
					    
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
					
					function addeventudate() {
					    $.ajax({
					        url: new URL('/jssl/invoice/consolidatedupdatenew', baseUrl),
					        type: 'POST',
							xhrFields: {
								    withCredentials: true
								},
					        dataType: 'json',
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
					            inc_type:intypeeditup.value
					        }),
					        success: function (data) {
					            var result = data.message;

					            if (result === "Success") {
					                const popup = $('<div class="popup">Consolidated Invoice updated Successfully!</div>')
					                    .appendTo('body').hide().fadeIn(400);

					                setTimeout(function () {
					                    popup.fadeOut(400, function () {
					                        $(this).remove();
					                        window.location = 'ConsolidatedInvoice.jsp';
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

					async function editRecord(id) {
						//  const allowed = window.allowedActions || [];

						if (!allowed.includes("Verify")) {
						  alert(" You do not have permission to Verify.");
						  return;
						}
						console.log(" verify record with ID:", id);
					    try {
					        const url = new URL(`/jssl/invoice/searchconsolidatedidnew`, baseUrl);
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
					        setInputValue("#pnverifyww", packingData.length > 0 ? packingData[0].conpn_id : "");
							setInputValue("#vcontract11vv", packingData.length > 0 ? packingData[0].load_id : "");
							setInputValue("#vintypeedityww", packingData.length > 0 ? packingData[0].invoice_remarks_type_name : "");
							
					        // Set grand total value
					        setInputValue("#grandv", GrandValue.length > 0 ? GrandValue[0].Grand_Total_tax : "");

					        // Set contractor data fields
					        const contractorFields = {
					            "#bunitv": "business_unit_name",
					            "#intypev": "invoice_type_calculation",
					            "#intov": "invoice_to_id_value",
					            "#prodesv": "product_desc_id",
					            "#shipmodev": "shipment_mode_id_value",
					            "#workorderv": "work_id_value",
					            "#exptv": "export",
					            "#taxresv": "tax_payable",
					            "#percenv": "percentage_value",
					            "#nandconv": "consignee_id_value",
					            "#banknamev": "bank_details_id_value",
					            "#deliveryconv": "delivery_condition_id_value",
					            "#officevv": "reg_office_id_value",
					            "#vingrandv": "tax_ex_inc",
					            "#advF": "freight_advance_recovery",
					            "#arev": "area_no",
					            "#lutv": "lot_no",
					            "#connumv": "containter_no",
					            "#epogv": "epcgno",
					            "#exptitlev": "export_title",
					            "#newscode2": "s_code_value",
					            "#newhcode2": "h_code_value",
					            
					        };
					        
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
					     /*   packingData.forEach((item) => {
					            $(".dynamic-row11").append(`
					                <div class="row align-items-center mb-1">
					                    <div class="col-auto"><label class="small-label">UOM</label>
					                        <input type="text" class="form-control form-control-sm small-input" value="${item.uom_name}" readonly>
					                    </div>
					                    <div class="col-auto"><label class="small-label">Quantity</label>
					                        <input type="text" class="form-control form-control-sm small-input" value="${item.qty}" readonly>
					                    </div>
					                    <div class="col-auto"><label class="small-label">Kg</label>
					                        <input type="text" class="form-control form-control-sm small-input" value="${item.per_kgs}" readonly>
					                    </div>
					                    <div class="col-auto"><label class="small-label">Unit Price</label>
					                        <input type="text" class="form-control form-control-sm small-input" value="${item.unit_price}" readonly>
					                    </div>
					                    <!-- <div class="col-auto"><label class="small-label">pices</label>
					                        <input type="text" class="form-control form-control-sm small-input" value="${item.pice}" readonly>
					                    </div> -->
					                    <div class="col-auto"><label class="small-label">Total</label>
					                        <input type="text" class="form-control form-control-sm small-input" value="${item.total}" readonly>
					                    </div>
					                    <div class="col-auto"><label class="small-label">Invoice Type</label>
					                        <input type="text" class="form-control form-control-sm small-input" value="${item.scrap_name_type_id}" readonly>
					                    </div>
					                    <div class="col-auto"><label class="small-label">Milestone</label>
					                        <input type="text" class="form-control form-control-sm small-input" value="${item.milestone_name}" readonly>
					                    </div>
					                    <!-- <div class="col-auto"><label class="small-label">Service Code</label>
					                        <input type="text" class="form-control form-control-sm small-input" value="${item.scode}" readonly>
					                    </div>
					                    <div class="col-auto"><label class="small-label">HSN Code</label>
					                        <input type="text" class="form-control form-control-sm small-input" value="${item.hcode}" readonly>
					                    </div> -->
					                </div>
					                <hr style="width:100%;border-top:1px solid #ccc;">
					            `);
					        });*/
							packingData.forEach((item, index) => {

							    const showLabel = index === 0;

							    $(".dynamic-row11").append(`
							        <div class="row align-items-center mb-1">

							            <div class="col-auto">
							                ${showLabel ? '<label class="small-label">UOM</label>' : ''}
							                <input type="text" class="form-control form-control-sm small-input text-right" value="${item.uom}" readonly>
							            </div>

							            <div class="col-auto">
							                ${showLabel ? '<label class="small-label">Quantity</label>' : ''}
							                <input type="text" class="form-control form-control-sm small-input text-right" value="${item.qty}" readonly>
							            </div>

							            <div class="col-auto">
							                ${showLabel ? '<label class="small-label">Kg</label>' : ''}
							                <input type="text" class="form-control form-control-sm small-input text-right" value="${item.per_kgs}" readonly>
							            </div>

							            <div class="col-auto">
							                ${showLabel ? '<label class="small-label">Unit Price</label>' : ''}
							                <input type="text" class="form-control form-control-sm small-input text-right" value="${item.unit_price}" readonly>
							            </div>

							            <div class="col-auto">
							                ${showLabel ? '<label class="small-label">Total</label>' : ''}
							                <input type="text" class="form-control form-control-sm small-input text-right" value="${item.total}" readonly>
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

							        ${showLabel ? '<hr>' : ''}
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
					                    <div class="col-auto"><label class="small-label1">PTD</label>
					                        <input type="text" class="form-control form-control-sm small-input1 text-right" value="${tax.ptd}" readonly>
					                    </div>
					                    <div class="col-auto"><label class="small-label1">PBC</label>
					                        <input type="text" class="form-control form-control-sm small-input1 text-right" value="${tax.ptc}" readonly>
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
					
					function openModalVerify() {
					    var username = document.getElementById('remarkvvei').value.trim();
					    var showError = false;

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
					        $('#exampleModalCenter66Verify').modal('show');
					    }
					}
					
					
					function addeventVerify() {
					    let taxIds = [], taxPers = [], taxValues = [],
					        taxAdv = [], taxPtd = [], taxPbc = [],
					        qsPackingItemSlno = [], taxAdvList = [], nonTaxAdvList = [];

					    $(".dynamic-row122 .row").each(function () {
					        let inputs = $(this).find("input[value][type='text']");
					        let slno = inputs.eq(0).val();
					        let taxPer = inputs.eq(1).val();
					        let taxAdven = inputs.eq(2).val();
					        let taxValue = inputs.eq(3).val();
					        let taxPtdValue = inputs.eq(4).val();
					        let taxPbcValue = inputs.eq(5).val();
					        let taxId = inputs.eq(6).val();
					        let nonTaxAdv = inputs.eq(7).val();

					        if (slno) qsPackingItemSlno.push(slno);
					        if (taxId) taxIds.push(taxId);
					        if (taxPer) taxPers.push(taxPer);
					        if (taxValue) taxValues.push(taxValue);
					        if (taxAdven) {
					            taxAdv.push(taxAdven);
					            taxAdvList.push(taxAdven);
					        }
					        if (nonTaxAdv) nonTaxAdvList.push(nonTaxAdv);
					        if (taxPtdValue) taxPtd.push(taxPtdValue);
					        if (taxPbcValue) taxPbc.push(taxPbcValue);
					    });

					    // Validate baseUrl
					    if (typeof baseUrl === 'undefined' || !baseUrl) {
					        console.error('baseUrl is not defined or empty.');
					        alert('Internal configuration error: baseUrl not set.');
					        return;
					    }

					    const requestUrl = new URL('/jssl/invoice/consolidatedverificationnew', baseUrl);
					    console.log("Posting to:", requestUrl.href);

					    $.ajax({
					        url: requestUrl.href,
					        type: 'POST',
							xhrFields: {
								    withCredentials: true
								},
					        dataType: 'json',
					        data: jQuery.param({
					            verified_by: createdById,
					            factory_id: selectedFactoryId,
					            payable_by_customer: pdptcv.value,
					            payable_to_dept: pdptv.value,
					            open_tax_adv: advA.value,
					            open_non_tax_adv: advan.value,
					            total: bvaue.value,
					            recovery_amt: "",
					            t_adv: "",
					            adv_tax: taxAdv.join(","),
					            tax_adv: taxAdvList.join(","),
					            non_tax_adv: nonTaxAdvList.join(","),
					            tax_payable_by_customer: taxPbc.join(","),
					            tax_payable_to_dept: taxPtd.join(","),
					            id: vidverify.value,
					            gst_remarks: remarkvvei.value,
					            pn_id: pnverifyww.value,
					            tax_id: taxIds.join(","),
					            tax_per: taxPers.join(","),
					            tax_value: taxValues.join(","),
					            qs_packing_item_slno: qsPackingItemSlno.join(",") 
					        }),
					        success: function (data) {
					            if (data.message === "Success") {
					                const popup = $('<div class="popup">consolidated Invoice Verified Successfully!</div>')
					                    .appendTo('body').hide().fadeIn(400);

					                setTimeout(function () {
					                    popup.fadeOut(400, function () {
					                        $(this).remove();
					                        window.location = 'ConsolidatedInvoice.jsp';
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
					        error: function (xhr, status, error) {
					            console.error('AJAX request failed:', error);
					            console.error('Status:', status);
					            console.error('Response:', xhr.responseText);
					            alert("Verification request failed. Check console for details.");
					        }
					    });
					}

					
					async function editRecord11(id,status) {
											if(status!='CANCELLED')
												{
													//const allowed = window.allowedActions || [];

														if (!allowed.includes("view")) {
														  alert(" You do not have permission to view.");
														    $("#exampleModalScrollableVerified").modal("hide");
														  return;
														}
										    try {
											    const url = new URL(`/jssl/invoice/searchconsolidatedidnew`, baseUrl);
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
												setInputValue("#contract11vvv", packingData.length > 0 ? packingData[0].load_id : "");
										        // Set grand total value
										        setInputValue("#grandvv", GrandValue.length > 0 ? GrandValue[0].Grand_Total_tax : "");
												setInputValue("#vintypeeditvv", packingData.length > 0 ? packingData[0].invoice_remarks_type_name : "");

										        // Set contractor data fields
										        const contractorFields = {
										            "#bunitvv": "business_unit_name",
										            "#intypevv": "invoice_type_calculation",
										            "#intovv": "invoice_to_id_value",
										            "#prodesvv": "product_desc_id",
										            "#shipmodevv": "shipment_mode_id_value",
										            "#workordervv": "work_id_value",
										            "#exptvv": "export",
										            "#taxresvv": "tax_payable",
										            "#percenvv": "percentage_value",
										            "#nandconvv": "consignee_id_value",
										            "#banknamevv": "bank_details_id_value",
										            "#deliveryconvv": "delivery_condition_id_value",
										            "#officevvv": "reg_office_id_value",
										            "#vingrandvv": "tax_ex_inc",
										            "#advFv": "freight_advance_recovery",
										            "#arevv": "area_no",
										            "#lutvv": "lot_no",
										            "#connumvv": "containter_no",
										            "#epogvv": "epcgno",
										            "#exptitlevv": "export_title",
										            "#newscode1": "s_code_value",
										            "#newhcode1": "h_code_value",
										        };
										        
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

										        // Append packing data
										     /*   packingData.forEach((item) => {
										            $(".dynamic-row11test").append(`
										                <div class="row align-items-center mb-1">
										                    <div class="col-auto"><label class="small-label">UOM</label>
										                        <input type="text" class="form-control form-control-sm small-input" value="${item.uom_name}" readonly>
										                    </div>
										                    <div class="col-auto"><label class="small-label">Quantity</label>
										                        <input type="text" class="form-control form-control-sm small-input" value="${item.qty}" readonly>
										                    </div>
										                    <div class="col-auto"><label class="small-label">Kg</label>
										                        <input type="text" class="form-control form-control-sm small-input" value="${item.per_kgs}" readonly>
										                    </div>
										                    <div class="col-auto"><label class="small-label">Unit Price</label>
										                        <input type="text" class="form-control form-control-sm small-input" value="${item.unit_price}" readonly>
										                    </div>
										                    <!-- <div class="col-auto"><label class="small-label">pices</label>
										                        <input type="text" class="form-control form-control-sm small-input" value="${item.pice}" readonly>
										                    </div> -->
										                    <div class="col-auto"><label class="small-label">Total</label>
										                        <input type="text" class="form-control form-control-sm small-input" value="${item.total}" readonly>
										                    </div>
										                    <div class="col-auto"><label class="small-label">Invoice Type</label>
										                        <input type="text" class="form-control form-control-sm small-input" value="${item.scrap_name_type_id}" readonly>
										                    </div>
										                    <div class="col-auto"><label class="small-label">Milestone</label>
										                        <input type="text" class="form-control form-control-sm small-input" value="${item.milestone_name}" readonly>
										                    </div>
										                   <!--  <div class="col-auto"><label class="small-label">Service Code</label>
										                        <input type="text" class="form-control form-control-sm small-input" value="${item.scode}" readonly>
										                    </div>
										                    <div class="col-auto"><label class="small-label">HSN Code</label>
										                        <input type="text" class="form-control form-control-sm small-input" value="${item.hcode}" readonly>
										                    </div> -->
										                </div>
										                <hr style="width:100%;border-top:1px solid #ccc;">
										            `);
										        });*/
												packingData.forEach((item, index) => {

												    const showLabel = index === 0;

												    $(".dynamic-row11test").append(`
												        <div class="row align-items-center mb-1">

												            <div class="col-auto">
												                ${showLabel ? '<label class="small-label">UOM</label>' : ''}
												                <input type="text" class="form-control form-control-sm small-input" value="${item.uom}" readonly>
												            </div>

												            <div class="col-auto">
												                ${showLabel ? '<label class="small-label">Quantity</label>' : ''}
												                <input type="text" class="form-control form-control-sm small-input text-right" value="${item.qty}" readonly>
												            </div>

												            <div class="col-auto">
												                ${showLabel ? '<label class="small-label">Kg</label>' : ''}
												                <input type="text" class="form-control form-control-sm small-input text-right" value="${item.per_kgs}" readonly>
												            </div>

												            <div class="col-auto">
												                ${showLabel ? '<label class="small-label">Unit Price</label>' : ''}
												                <input type="text" class="form-control form-control-sm small-input text-right" value="${item.unit_price}" readonly>
												            </div>

												            <div class="col-auto">
												                ${showLabel ? '<label class="small-label">Total</label>' : ''}
												                <input type="text" class="form-control form-control-sm small-input text-right" value="${item.total}" readonly>
												            </div>

												            <div class="col-auto">
												                ${showLabel ? '<label class="small-label">Invoice Type</label>' : ''}
												                <input type="text" class="form-control form-control-sm small-input" value="${item.invoice_remarks_type_name}" readonly>
												            </div>

												            <div class="col-auto">
												                ${showLabel ? '<label class="small-label">Milestone</label>' : ''}
												                <input type="text" class="form-control form-control-sm small-input" value="${item.milestone_name}" readonly>
												            </div>

												        </div>

												        ${showLabel ? '<hr>' : ''}
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
										                    <div class="col-auto"><label class="small-label1">PTD</label>
										                        <input type="text" class="form-control form-control-sm small-input1 text-right" value="${tax.ptd}" readonly>
										                    </div>
										                    <div class="col-auto"><label class="small-label1">PBC</label>
										                        <input type="text" class="form-control form-control-sm small-input1 text-right" value="${tax.ptc}" readonly>
										                    </div>
										                    <div class="col-auto" style="display:none;"><label class="small-label1">Tax Id</label>
										                        <input type="text" class="form-control form-control-sm small-input1" value="${tax.tax_id}">
										                    </div>
										                </div>
										                <hr>
										            `);
										        });

										        // Show the modal
										        $("#exampleModalScrollableVerified").modal("show");

										    } catch (error) {
										        console.error('Error fetching invoice data:', error);
										    }
										}
										else{
											try {
																	    const url = new URL(`/jssl/invoice/searchconsolidatedidcancel`, baseUrl);
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
																		setInputValue("#contract11vvv", packingData.length > 0 ? packingData[0].load_id : "");
																        // Set grand total value
																        setInputValue("#grandvv", GrandValue.length > 0 ? GrandValue[0].Grand_Total_tax : "");
																		setInputValue("#vintypeeditvv", packingData.length > 0 ? packingData[0].invoice_remarks_type_name : "");

																        // Set contractor data fields
																        const contractorFields = {
																            "#bunitvv": "business_unit_name",
																            "#intypevv": "invoice_type_calculation",
																            "#intovv": "invoice_to_id_value",
																            "#prodesvv": "product_desc_id",
																            "#shipmodevv": "shipment_mode_id_value",
																            "#workordervv": "work_id_value",
																            "#exptvv": "export",
																            "#taxresvv": "tax_payable",
																            "#percenvv": "percentage_value",
																            "#nandconvv": "consignee_id_value",
																            "#banknamevv": "bank_details_id_value",
																            "#deliveryconvv": "delivery_condition_id_value",
																            "#officevvv": "reg_office_id_value",
																            "#vingrandvv": "tax_ex_inc",
																            "#advFv": "freight_advance_recovery",
																            "#arevv": "area_no",
																            "#lutvv": "lot_no",
																            "#connumvv": "containter_no",
																            "#epogvv": "epcgno",
																            "#exptitlevv": "export_title",
																            "#newscode1": "s_code_value",
																            "#newhcode1": "h_code_value",
																        };
																        
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

																        // Append packing data
																     /*   packingData.forEach((item) => {
																            $(".dynamic-row11test").append(`
																                <div class="row align-items-center mb-1">
																                    <div class="col-auto"><label class="small-label">UOM</label>
																                        <input type="text" class="form-control form-control-sm small-input" value="${item.uom_name}" readonly>
																                    </div>
																                    <div class="col-auto"><label class="small-label">Quantity</label>
																                        <input type="text" class="form-control form-control-sm small-input" value="${item.qty}" readonly>
																                    </div>
																                    <div class="col-auto"><label class="small-label">Kg</label>
																                        <input type="text" class="form-control form-control-sm small-input" value="${item.per_kgs}" readonly>
																                    </div>
																                    <div class="col-auto"><label class="small-label">Unit Price</label>
																                        <input type="text" class="form-control form-control-sm small-input" value="${item.unit_price}" readonly>
																                    </div>
																                    <!-- <div class="col-auto"><label class="small-label">pices</label>
																                        <input type="text" class="form-control form-control-sm small-input" value="${item.pice}" readonly>
																                    </div> -->
																                    <div class="col-auto"><label class="small-label">Total</label>
																                        <input type="text" class="form-control form-control-sm small-input" value="${item.total}" readonly>
																                    </div>
																                    <div class="col-auto"><label class="small-label">Invoice Type</label>
																                        <input type="text" class="form-control form-control-sm small-input" value="${item.scrap_name_type_id}" readonly>
																                    </div>
																                    <div class="col-auto"><label class="small-label">Milestone</label>
																                        <input type="text" class="form-control form-control-sm small-input" value="${item.milestone_name}" readonly>
																                    </div>
																                   <!--  <div class="col-auto"><label class="small-label">Service Code</label>
																                        <input type="text" class="form-control form-control-sm small-input" value="${item.scode}" readonly>
																                    </div>
																                    <div class="col-auto"><label class="small-label">HSN Code</label>
																                        <input type="text" class="form-control form-control-sm small-input" value="${item.hcode}" readonly>
																                    </div> -->
																                </div>
																                <hr style="width:100%;border-top:1px solid #ccc;">
																            `);
																        });*/
																		packingData.forEach((item, index) => {

																		    const showLabel = index === 0;

																		    $(".dynamic-row11test").append(`
																		        <div class="row align-items-center mb-1">

																		            <div class="col-auto">
																		                ${showLabel ? '<label class="small-label">UOM</label>' : ''}
																		                <input type="text" class="form-control form-control-sm small-input" value="${item.uom}" readonly>
																		            </div>

																		            <div class="col-auto">
																		                ${showLabel ? '<label class="small-label">Quantity</label>' : ''}
																		                <input type="text" class="form-control form-control-sm small-input text-right" value="${item.qty}" readonly>
																		            </div>

																		            <div class="col-auto">
																		                ${showLabel ? '<label class="small-label">Kg</label>' : ''}
																		                <input type="text" class="form-control form-control-sm small-input text-right" value="${item.per_kgs}" readonly>
																		            </div>

																		            <div class="col-auto">
																		                ${showLabel ? '<label class="small-label">Unit Price</label>' : ''}
																		                <input type="text" class="form-control form-control-sm small-input text-right" value="${item.unit_price}" readonly>
																		            </div>

																		            <div class="col-auto">
																		                ${showLabel ? '<label class="small-label">Total</label>' : ''}
																		                <input type="text" class="form-control form-control-sm small-input text-right" value="${item.total}" readonly>
																		            </div>

																		            <div class="col-auto">
																		                ${showLabel ? '<label class="small-label">Invoice Type</label>' : ''}
																		                <input type="text" class="form-control form-control-sm small-input" value="${item.invoice_remarks_type_name}" readonly>
																		            </div>

																		            <div class="col-auto">
																		                ${showLabel ? '<label class="small-label">Milestone</label>' : ''}
																		                <input type="text" class="form-control form-control-sm small-input" value="${item.milestone_name}" readonly>
																		            </div>

																		        </div>

																		        ${showLabel ? '<hr>' : ''}
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
																                    <div class="col-auto"><label class="small-label1">PTD</label>
																                        <input type="text" class="form-control form-control-sm small-input1 text-right" value="${tax.ptd}" readonly>
																                    </div>
																                    <div class="col-auto"><label class="small-label1">PBC</label>
																                        <input type="text" class="form-control form-control-sm small-input1 text-right" value="${tax.ptc}" readonly>
																                    </div>
																                    <div class="col-auto" style="display:none;"><label class="small-label1">Tax Id</label>
																                        <input type="text" class="form-control form-control-sm small-input1" value="${tax.tax_id}">
																                    </div>
																                </div>
																                <hr>
																            `);
																        });

																        // Show the modal
																        $("#exampleModalScrollableVerified").modal("show");

																    } catch (error) {
																        console.error('Error fetching invoice data:', error);
																    }	
										}
										}
					function openModal(id, conpn_id) {
						//const allowed = window.allowedActions || [];

						if (!allowed.includes("Release")) {
						  alert(" You do not have permission to release.");
						  return;
						}
						console.log(" release record with ID:", id);
					    // Open the modal
					    $('#exampleModalCenter1').modal('show');

					    // Store the id and pn_id in the modal's data attributes
					    $('#exampleModalCenter1').attr('data-id', id);
					    $('#exampleModalCenter1').attr('data-pn-id', conpn_id);
					}
					
					function addeventrelease() {
					    // Retrieve the id and pn_id from the modal
					    var id = $('#exampleModalCenter1').attr('data-id');
					    var pn_id = $('#exampleModalCenter1').attr('data-pn-id');

					    // Perform release action
					    $.ajax({
					        url: new URL('/jssl/invoice/consolidatedreleasebyidnew', baseUrl),
					        type: 'POST',
							xhrFields: {
								    withCredentials: true
								},
					        dataType: 'json',
					        data: jQuery.param({
					            id: id, 
					            factory_id: selectedFactoryId, 
					            released_by: createdById, 
					            pn_id: pn_id // Pass the pn_id here
					        }),
					        success: function (data) {
					            var result = data.message;

					            if (result === "Success") {
					                const popup = $('<div class="popup">Consolidated Invoice Released Successfully!</div>')
					                    .appendTo('body').hide().fadeIn(400);

					                setTimeout(function () {
					                    popup.fadeOut(400, function () {
					                        $(this).remove();
					                        window.location = 'ConsolidatedInvoice.jsp';
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
					
					
					

					async function printRecord(id,status) {
						  //  const allowed = window.allowedActions || [];
						if (!allowed.includes("Print")) {
						    alert(" You do not have permission to print.");
						    return;
						}
						showLoader();
					    // Your actual print logic here
					    try {
							const endpoint =
							    status === "CANCELLED"
							      ? `/jssl/invoice/searchconsolidatedidcancel?id=${id}`
							      : `/jssl/invoice/searchconsolidatedidnew?id=${id}`;

							  const url = new URL(endpoint, baseUrl);

							  const response = await fetch(url, {
							    method: "GET",
							    credentials: "include"
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
							const factory_id = Invoice_Data.factory_id;
							
							const productdesc = Invoice_Data.product_desc;
							
							
							
							
							const url_factory = new URL(`/jssl/factory/getAllFactoryListSS`, baseUrl);
							     const response_factory = await fetch(url_factory, {
							         method: "GET",
							         credentials: "include"   // ✅ Always send JSESSIONID cookie
							     });
								 if (!response_factory.ok) throw new Error("Failed to fetch data");
								 const factory_json = await response_factory.json();
								 
							const factory_data_map =	 factory_json.FactoryDetails;
					console.log("this the factory_data_map"+factory_data_map);
							
							
							const FactoryDataBasedById = factory_data_map.find(f => f.id === factory_id);
							const MumbaiAddress = factory_data_map.find(f=>f.id=== "4");
							console.log(FactoryDataBasedById);
						/*	console.log(factory_data_map);
								 
								 
								 console.log(factory_json);*/
								 
								 const reg_addresss = MumbaiAddress.address;
								 
								 const factory_Address = FactoryDataBasedById.address;
								 const state_Code = FactoryDataBasedById.stateCode;
								 const Gst_Code = FactoryDataBasedById.gstNo;

					        //const product_desc = json.Invoice_Data?.product_desc || ''; // Fix reference

					        const invoice_to_id_value = Contractor_Data[0].invoice_to_id_value;
					    /*    const tax_payable = Contractor_Data[0].tax_payable;*/
						const tax_payable = Contractor_Data[0].tax_payable == 1 ? "No" :"Yes";
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
					        const bankName = Contractor_Data[0].org_name;
					        const account_number = Contractor_Data[0].account_number;
					        const branch_address =Contractor_Data[0].bankName +' '+ Contractor_Data[0].branch_address;
					        const branch_code = Contractor_Data[0].branch_code;
					        const swift_code = Contractor_Data[0].swift_code;
					        const ifsc_code = Contractor_Data[0].ifsc_code;
							const work_date = Contractor_Data[0].work_date;
					        const transport_name = QsPacking_Data[0].transport_name;
					        const vechile_no = QsPacking_Data[0].vechile_no;
					        const con_code_with_lot_no = QsPacking_Data[0].con_code_with_lot_no;

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
					        const maxRows = 9;// 👈 adjust invoice height here
					        let tableRows = "";

					        // real product rows
					        items.forEach((item, index) => {
					            tableRows += `
							        <tr class="product-row ">
							            <td  colspan="1" style="text-align: right;">${index + 1}</td>
							            <td colspan="4" class="desc-col descri">${item.scrap_name_type_id || ''}</td>
							        
										<td colspan="1" style="text-align: right;">
																											    ${Math.max(
																											        Number(Contractor_Data[0].s_code_value) || 0,
																											        Number(Contractor_Data[0].h_code_value) || 0
																											    ) || ''}
																											</td>
							            <td colspan="1" style="text-align:left !important;">${item.uom || ''}</td>
							            <td colspan="1" class="qtys">${item.qty || ''}</td>
							            <td colspan="2" class="weits">${item.per_kgs || ''}</td>
							            <td colspan="1" class="prs">${item.unit_price || ''}</td>
							            <td  colspan="2" class="tols">${item.total || ''}</td>
							        </tr>`;
					        });

							const emptyCount = Math.max(0, maxRows - items.length);

									for (let i = 0; i < emptyCount; i++) {

									    if (i === 1) { // 👈 only once (3rd empty row)
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

					        // Generate dynamic tax rows
					        /*  let taxRows = taxData.map(tax => `
					              <tr>
					                  <td colspan="10" class="tax-name" style="border-bottom:none;">${tax.tax_name || ''}</td>
					                  <td colspan="1" class="tax-per">${tax.tax_per || ''}</td>
					                  <td colspan="2" class="tax-per"  style= "border-bottom: 0.25px solid #000;">${tax.tax_value || ''}</td>
					              </tr>
					          `).join('');*/



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
							                ${tax.tax_value || ''}
							            </td>
							        </tr>
							    `;
					        }).join('');


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
					        const htmlContent = `
							    <style>
							        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');

							        * {
							            box-sizing: border-box;
							        }
									
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

									               .watermark.cancelled {
									                   color: #ff0000;
									               }

									               .watermark.verified {
									                   color: #4CAF50;
									               }

									               .page {
									                   position: relative;
									               }

							        /* --- Global Reset --- */
							        html, body {
							            margin: 0;  /* FIXED: Removed top and left margins */
							            padding: 0;
							           font-family: "Times New Roman", Times, serif;
							            color: black !important;
							            background-color: #fff !important;
							            font-size: 10px;
							            line-height: 2;
							        }

							        /* --- Page Container --- */
							        .page {
							            width: 202mm;
							             height: 297mm;   
							            overflow: visible;
							          /*  page-break-after: always;*/
									  page-break-after: avoid !important;
							            margin: 0;
							            padding: 0;
							        }

							 
									.page:last-child {
									     page-break-after: avoid !important;
									}

							        /* --- Invoice Container --- */
							        .invoice-container {
							            width: 100%;
							            height: auto;
							            overflow: visible;
							            -webkit-font-smoothing: antialiased;
							            text-rendering: geometricPrecision;
							            page-break-inside: avoid;
							            margin: 0;
							            padding: 1mm;  /* Add small padding instead of margins */
							        }

							        table {
							            border-collapse: collapse;
							            page-break-inside: avoid;
							            width: 100%;
							            margin: 0;
							            padding: 0;
							        }

							        /* remove default borders */
							        td, th {
							            border: none;
							        }

							        /* draw grid using single lines */
							        td, th {
							            border-right: 0.5px solid #000;
							            border-bottom: 0.5px solid #000;
							            padding: 2px 4px;
							            vertical-align: top;
							            font-size: 10px;
							            line-height: 1.05;
							            word-wrap: break-word;
							        }

							        tr {
							            page-break-inside: avoid;
							        }

							        /* top border only for first row */
							        tr:first-child th {
							            border-top: 0.5px solid #000;
							        }

							        /* left border only for first column */
							        td:first-child,
							        th:first-child {
							            border-left: 0.5px solid #000;
							        }

							        .company-details-table {
							            border-top: 0.5px solid #000 !important;
							        }

							        /* --- Header & Footer --- */
							        .header, .footer {
							            text-align: center;
							            margin: 0;
							            padding: 0;
							        }

							        .invoice-header {
							            display: flex;
							            justify-content: space-between;
							            align-items: center;
							            margin-bottom: 2mm;
							        }

							    
									
									.gst-text {
														   						   		            font-size: 15px;
														   						   		            font-weight:500;
														   						   		            text-align: center;
														   											margin-left:100px !important;
														   						   		        }


							        .copy-label {
							            font-size: 12px;
							            font-weight: normal;
							        }

							        /* --- Tables --- */
							        table {
							            border-collapse: collapse !important;
							            table-layout: fixed;
							        }

							        td br, th br {
							            display: block;
							            margin: 0;
							            line-height: 1;
							        }

							        .company-details-table td {
							            padding: 4px;
							            font-size: 11px !important;
							        }

							        /* --- Logo --- */
							        .company-logo img {
							            width: 60px;
							            height: auto;
							            display: block;
							            margin-bottom: 2px;
							        }

							        .product-row td:nth-child(n+4) {
							            text-align: right !important;
							        }

							        .product-row td,
							        .empty-row td {
							            height: 22px;
							        }

							        .empty-row td {
							            border-top: none !important;
							            border-bottom: none !important;
							        }

							        .last-product td {
							            border-bottom: none !important;
							        }

							        .product-table .desc-col {
							            line-height: 1.5 !important;
							            white-space: normal;
							            word-break: break-word;
							        }

							        .product-table .fright-row .fright-data {
							            line-height: 1.6 !important;
							            padding: 5px !important;
							        }

							        .total-body .total-datatd {
							            line-height: 1.6 !important;
							            padding: 5px !important;
							        }

							        .total-body .total-datatds {
							            line-height: 2.5 !important;
							            text-align: right !important;
							        }

							        .desc-col.descri {
							            font-size: 7px !important;
							            padding: 1px !important;
							        }

							        .desc-col.tols {
							            text-align: right !important;
							        }

							        .desc-col.prs {
							            text-align: right !important;
							        }

							        .desc-col.weits {
							            text-align: right !important;
							        }

							        .desc-col.qtys {
							            text-align: right !important;
							        }

							        .product-table th,
							        .product-table td {
							            padding: 3px 5px;
							            line-height: 1.2;
							        }

							        .product-row td {
							            border-bottom: none;
							        }

							        .freight-vlaue {
							            text-align: right !important;
							        }

							        .fright-row {
							            border: 0.5px solid #000 !important;
							        }
									.totalww-row{
										border: 0.5px solid #000 !important;
									}
									
							        .tax-row .tax-name {
							            line-height: 0.8 !important;
							            text-align: right !important;
										padding:5px !important;
							        }

							        .tax-row .tax-per {
							            text-align: right !important;
							            vertical-align: middle !important;
							        }

							        .total-word .total-words-des {
							            line-height: 1.2 !important;
							            font-size: 8px !important;
							            padding: 0 0 5px 5px !important;
							        }

							        .total-words-des.ss {
							            vertical-align: middle !important;
							        }

							        .total-word .total-words-val {
							            text-align: right !important;
							            vertical-align: middle !important;
							        }

							        .particulars-row {
							            line-height: 1 !important;
							        }

							        .particulars-row td {
							            padding-top: 5px !important;
							        }

							        .particulars-row .particulars-row-prtd {
							            font-size: 8px !important;
							        }

							        .particulars-row-body {
							            padding-top: 5px !important;
							        }

							        .particulars-row-body .particulars-row-body-td {
							            text-align: right !important;
							            font-size: 8px !important;
							        }

							        .td-body-tax {
							            text-align: right !important;
							            line-height: 2 !important;
							        }

							        .Bank_details {
							            line-height: 1.8 !important;
							            font-size: 8px !important;
							        }

							        .last-data td {
							            line-height: 1.5 !important;
							            font-size: 9px !important;
							            padding-top: 6px !important;
							        }

							        .last-data td:last-child {
							            text-align: center !important;
							            vertical-align: middle !important;
							        }

							        .last-data td:last-child span {
							            display: block;
							            text-align: center;
							        }

							        .footer {
							            padding-top: 6px !important;
							        }

							        .invoice-line {
							            display: flex;
							            justify-content: space-between;
							            width: 80%;
							        }

							        .fixed-8px td {
							            font-size: 8px !important;
							            line-height: 1.1 !important;
							        }

							        /* --- Terms & Footer --- */
							        .terms {
							            margin-top: 2mm;
							        }

							        .footer p {
							            font-size: 9px;
							            line-height: 1.2;
							            margin: 0;
							            padding: 0;
							        }

							        /* --- Text & Alignment --- */
							        .header, .footer, .gst-text, .copy-label {
							            text-align: center;
							        }
							    </style>

							    <div class="invoice-container">
								${status === 'CANCELLED' ? `
								           <div class="watermark cancelled">
								               CANCELLED
								           </div>
								       ` : ''}
							        <div class="invoice-header">
							            <b>   </b>
							            <div class="gst-text">GST TAX INVOICE</div>
							            <div class="gst-text1 copy-label">Original For Recipient</div>
							        </div>
							        
							        <table class="company-details-table">
							            <tr>
							                <td colspan="6">
							                    <div class="company-logo">
							                        <img src="img/logo/download.png" alt="Company Logo" style="width:100px;">
							                    </div>
							                    <strong>JSW Severfield Structures Limited</strong><br>
							                   <p style="width :70%" class="facotry_address"> 
							                   
							                    <p>
							                   <b> State Code</b>:<span class="state_code"></span><br>
							                   <b> GSTIN :</b> <span class="gst_code"> </span>    <b style="margin-left: 20px;">PAN </b>: AACCJ1473D<br>
							                  <b>  ICE No:</b> 0309033152   <b style="margin-left: 40px;">CIN No:</b> U28112MH2009PLC191045<br>
							                    <b>Email:</b> invoice@jssl.in   <b style="margin-left: 30px;"> Website:</b> www.jssl.in<br>
							                </td>
							                <td colspan="6">
							                    <br>
							                    <div class="invoice-line">
							                        <div style="font-size:14px;"><b>Invoice No: <span class="invoiceNumber"></span> </b></div>
							                        <div><b>Date:</b> <span class="date"></span></div>
							                    </div>
							                    <br>
							                    <b>Contract No Reference No:</b> <span class="contrefno"></span><br>
							                 
							                    <b>Date & Time of supply:</b> <span class="datetime"></span><br>
							                    <br>
							                    <b>Work/Purchase Order No:</b> <span class="workor"></span><br>
							             
							                    <b>Date of Order:</b> <span class="dateor"></span><br>
							                </td>
							            </tr>
										<tr>
														<td colspan="6" style="font-size:10px; line-height:1.4;">
														    
														    <b>
														        Invoice To :<br>

														        <span class="shipto11" style="text-transform:uppercase;"></span></b><br>
														        <span class="projectname"></span><br>
														   

														    <!-- Address (NOT bold) -->
														    <span class="fulladdress" style="white-space: pre-line;"></span><br>

														    <b>
														        Name of the State : <span class="statename"></span><br>
														        State Code : <span class="stcode11"></span><br>
														        GSTIN : <span class="ingst"></span><br>
														        PAN : <span class="panin"></span><br>
														    </b>

														</td>
														<td colspan="6" style="font-size:10px; line-height:1.4;">
														    
														    <b>Name & Address of consignee:<br>

														    <span class="conname" style="text-transform:uppercase;"></span></b><br>
														    <span class="conproject"></span><br>

														    <!-- Address -->
														    <span class="conaddress" style="white-space: pre-line;"></span><br>

															<b>
														    Name of the State: <span class="state"></span><br>
														    State Code: <span class="stateco"></span><br>
														    GSTIN: <span class="congst"></span><br>
														    PAN: <span class="pancon"></span><br>
														   </b>
														   
														</td>
											            </tr>
							            <tr class="fixed-8px">
							                <td  colspan="3" class="notif-cell"> <strong>Date of Notification</strong><br>
							                    <strong>Exempted note under:</strong><br>
							                    <strong>Tax is Payble on revese charge:(Yes/No):</strong><span class="taxpayre"></span><br>
							                </td>
							                <td  colspan="3" style="font-size:7px;">  <strong>Export Details:</strong><br>
							                    <strong>ARE No:</strong><span class="areano"></span><br>
							                    <strong>LUT No:</strong><span class="lutno"></span><br>
							                    <strong>Container No:</strong><span class="contlo"></span><br>
							                    <strong>EPCG License No:</strong><span class="epoglo"></span><br>
							                </td>
							                <td  colspan="3" style="font-size:7px;">  <b>Transporter:</b> <span class="trans"></span><br>
							                    <b>Vehicle No:</b><span class="vehino"></span><br>
							                    <b>LR/DOCKET No:</b><span class="lrdoc"></span><br>
							                    <b>Date:</b><span class="lrdate"></span><br>
							                </td>
							                <td  colspan="3" style="font-size:7px;">   <b>Shipment Mode:</b> <span class="shipmo"></span><br>
							                    <b>Delivery Condition:</b> <span class="delcon"></span><br>
							                </td>
							            </tr>
							        </table>
							        
							        <table class="product-table">
							            <thead>
							                <tr>
							                    <th class="desc-col" colspan="1" style="width: 5%;">Sr No.</th>
							                    <th  class="desc-col" colspan="4" >Product Description</th>
							                   
							                    <th  class="desc-col" colspan="1" style="width: 10%;" >Service/HSN Code</th>
							                    <th  class="desc-col" colspan="1"  >UOM</th>
							                    <th class="desc-col"  colspan="1" >Qty/Nos</th>
							                    <th class="desc-col" colspan="2"  style="text-align:center">Weight<br>(Kgs/Mt/Sq Mts)</th>
							                    <th class="desc-col" colspan="1" style="width: 10%;" >Unit Price</th>
							                    <th  class="desc-col" colspan="2" >Value (INR)</th>
							                </tr>
							            </thead>
							            <tbody id="product_table_data">
							                ${tableRows} 
							            </tbody>
							            <tbody>
							                <tr class="fright-row" Style="display:none">
							                    <td class="fright-data"  colspan="11">
							                        <span>Freight</span><br>
							                    </td>
							                    <td class="fright-data freight-vlaue" colspan="2">
							                        <span class="freight"></span><br>
							                    </td>
							                </tr>
							            </tbody>
							            <tbody class="total-body">
							                <tr class="totalww-row">
							                    <td  colspan="7" class="total-datatd">
							                        <span>TOTAL</span><br>
							                    </td>
							                   
							                   
							                    <td class="total-datatds" >
							                        <span class="qtytotal"></span><br>
							                    </td>
							                    <td  colspan="2" class="total-datatds" >
							                        <span class="wiegtotal"></span><br>
							                    </td>
							                    <td ></td>
							                    <td colspan="2"  class="total-datatds" >
							                        <span class="val11"></span><br>
							                    </td>
							                </tr>
							            </tbody>
							            <tbody class="tax-row">
							                ${taxRows}
							            </tbody>
							            <tbody class="total-word">
							                <tr>
							                    <td colspan="9" class="total-words-des">
							                        <b>Note:</b><span>Identification Marks & Serial No. of Goods: As per packing list attached</span><br>
							                        ${taxDetails}
							                        <br>
							                        <b>Gross total in words:</b> ${grandTotalInWords}<br>
							                    </td>
							                    <td  colspan="2" class="total-words-des ss">
							                        <b>Total Invoice Value:</b><br>
							                    </td>
							                    <td  colspan="2" class="total-words-val">
							                        <span>${grandTotalTax}</span><br>
							                    </td>              
							                </tr>
							            </tbody>
							            <tbody>
							                <tr class="particulars-row">
							                    <td colspan="3" class="particulars-row-prtd">
							                        <span>Particulars</span><br>
							                    </td>
							                    <td colspan="1" class="particulars-row-prtd">
							                        <span>Tax Application</span><br>
							                    </td>
							                    <td colspan="1" class="particulars-row-prtd">
							                        <span>Tax %</span><br>
							                    </td>
							                    <td colspan="1" class="particulars-row-prtd">
							                        <span>Adv Recovery (Taxable)</span><br>
							                    </td>
							                    <td colspan="1" class="particulars-row-prtd">
							                        <span>Adv Recovery (NonTax)</span><br>
							                    </td>
							                    <td colspan="2" class="particulars-row-prtd">
							                        <span>Invoice Value</span><br>
							                    </td>
							                    <td colspan="2" class="particulars-row-prtd">
							                        <span>Payable to dept</span><br>
							                    </td>
							                    <td  colspan="2" class="particulars-row-prtd">
							                        <span>Payable by Customer</span><br>
							                    </td>
							                </tr>
							            </tbody>
							            <tbody>
							                <tr class="particulars-row-body">
							                    <td colspan="3">
							                        <span>${gstremarks}</span><br>
							                    </td>
							                    <td colspan="1">
							                        <span>Basic</span><br>
							                        ${taxDetailsNew}
							                    </td>
							                    <td colspan="1" class="particulars-row-body-td"> <br>
							                        ${taxPerValue}
							                    </td>
							                    <td colspan="1" class="particulars-row-body-td"> 
							                        <span>${advremarks}</span><br>
							                        ${taxadvanceValue}
							                    </td>
							                    <td colspan="1"class="particulars-row-body-td">
							                        <span>${advremarksnon}</span><br>
							                    </td>
							                    <td colspan="2"class="particulars-row-body-td">
							                        <span>${basicValue}</span><br>
							                        ${taxValue}
							                    </td>
							                    <td colspan="2"class="particulars-row-body-td"><br>
							                        ${taxValuedept}
							                    </td>
							                    <td colspan="2"class="particulars-row-body-td">
							                        <span>${basicValuecos}</span><br>
							                        ${taxValuecos}
							                    </td>
							                </tr>
							            </tbody>
							            <tbody>
							                <tr>
							                    <td  colspan="3">
							                        <span>Total</span><br>
							                    </td>
							                    <td colspan="1"></td>
							                    <td colspan="1"></td>
							                    <td colspan="1" class="td-body-tax">
							                        <span class="taxbasic"></span><br>
							                    </td>
							                    <td colspan="1"></td>
							                    <td colspan="2" class="td-body-tax">
							                        <span class="grandlast"></span><br>
							                    </td>
							                    <td colspan="2"class="td-body-tax">
							                        <span class="taxtotal"></span><br>
							                    </td>
							                    <td  colspan="2"class="td-body-tax">
							                        <span class="grandlast12new"></span><br>
							                    </td>
							                </tr>
							            </tbody>
							            <tbody>
							                <tr>
							                    <td colspan="13" class="Bank_details">
							                        <span>BANK ACCOUNT DETAILS:</span><span>BANK ACCOUNT NAME:</span><b class="bankname"></b><br>
							                        <span>ACCOUNT NUMBER:</span><b class="acc"></b><span>,BANK NAME & ADDRESS:</span><b class="bname"></b><b class="add"></b>
							                        <span>BRANCH CODE:</span><b class="code"></b>, <br><span>SWIFT CODE:</span><b class="scode"></b>,<span>IFSC CODE:</span><b class="ifsc"></b><br>
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
							                  
							                    <td  colspan="4">
							                        <span>For JSW SEVERFIELD STRUCTURES LTD.</span><br>
							                        <span style="margin-top: 20px; display: inline-block;">(Authorised signature)</span><br>
							                    </td>
							                </tr>
							            </tbody>
							        </table>
							        <div class="footer">
							            <b>Regd Office:</b><span class="reg_add"></span>
							           <p> (All disputes subject to Karnataka Jurisdiction)E&OE </p>
							        </div>
							    </div>
							`;

					        function fillInvoice(container) {
								container.querySelector(".reg_add").textContent = reg_addresss;
								container.querySelector(".gst_code").textContent=Gst_Code;
								container.querySelector(".state_code").textContent = state_Code;
								container.querySelector('.facotry_address').innerHTML = formatAddress(factory_Address);
					            container.querySelector('.datetime').textContent = formattedDateTime;
					            container.querySelector('.dateor').textContent = work_date;
					            container.querySelector('.date').textContent = currentDate;
					            container.querySelector('.invoiceNumber').textContent = invoiceno;
					            //container.querySelector('.shipto11').textContent = invoice_to_id_value;
								const fullText = invoice_to_id_value || "";

										   // Normalize spaces
										   const cleanText = fullText.replace(/\s+/g, " ").trim();

										   // Split: COMPANY | PROJECT | ADDRESS
										   const match = cleanText.match(/^(.*?)\s*(PROJECT\s*[:\-]\s*[^,]+)(.*)$/i);

										   if (match) {
										       const company = match[1].trim();      // JSW STEEL LIMITED
										       const project = match[2].trim();      // PROJECT: Utility Structure...
										       const address = match[3].trim();      // FULL remaining address

										       container.querySelector('.shipto11').textContent = company;
										       container.querySelector('.projectname').textContent = project;
										       container.querySelector('.fulladdress').textContent = address;

										   } else {
										       // fallback (if PROJECT not found)
										       container.querySelector('.shipto11').textContent = fullText;
										       container.querySelector('.projectname').textContent = "";
										       container.querySelector('.fulladdress').textContent = "";
										   }
					            container.querySelector('.taxpayre').textContent = tax_payable;
					            container.querySelector('.areano').textContent = area_no;
					            container.querySelector('.contlo').textContent = containter_no;
					            container.querySelector('.lutno').textContent = lot_no;
					            container.querySelector('.epoglo').textContent = epcgno;
					            container.querySelector('.trans').textContent = transport_name;
					            container.querySelector('.lrdoc').textContent = lr_docketno;
					            container.querySelector('.lrdate').textContent = date_val;
					            container.querySelector('.shipmo').textContent = shipment_mode_id_value;
					            container.querySelector('.delcon').textContent = delivery_condition_id_value;
					            //container.querySelector('.conadd').textContent = consignee_id_value;
								const fullConsignee = consignee_id_value || "";

											// Normalize
											const cleanConsignee = fullConsignee.replace(/\s+/g, " ").trim();

											// Split using PROJECT
											const matchCon = cleanConsignee.match(/(.*?)(PROJECT\s*[:\-]\s*.*)/i);

											if (matchCon) {
											    container.querySelector('.conname').textContent = matchCon[1].trim();
											    container.querySelector('.conproject').textContent = matchCon[2].trim();

											    // Extract address (remaining part after project)
											    const remaining = cleanConsignee.replace(matchCon[0], "").trim();
											    container.querySelector('.conaddress').textContent = remaining;

											} else {
											    container.querySelector('.conname').textContent = fullConsignee;
											    container.querySelector('.conproject').textContent = "";
											    container.querySelector('.conaddress').textContent = "";
											}
					            container.querySelector('.workor').textContent = work_id_value;
					            container.querySelector('.vehino').textContent = vechile_no;
					            container.querySelector('.contrefno').textContent = con_code_with_lot_no;
					            container.querySelector('.statename').textContent = invoiceStateName;
					            container.querySelector('.state').textContent = consigneeStateName;
					            container.querySelector('.stateco').textContent = consigneeStateCode;
					            container.querySelector('.stcode11').textContent = invoiceStateCode;
					            container.querySelector('.congst').textContent = consigneeGstNo;
					            container.querySelector('.ingst').textContent = invoiceGstNo;
					            container.querySelector('.pancon').textContent = consigneePanNo;
					            container.querySelector('.panin').textContent = invoicePanNo;
					         /*   container.querySelector('.pitotal').textContent = total_pices;*/
					            container.querySelector('.qtytotal').textContent = total_qty;
					            container.querySelector('.wiegtotal').textContent = total_kgs;
					            container.querySelector('.val11').textContent = basic_value;
					            container.querySelector('.grandlast').textContent = Grand_Total_tax;
					            container.querySelector('.grandlast12new').textContent = PBC_Final_total;
					            container.querySelector('.bankname').textContent = bankName;
					            container.querySelector('.acc').textContent = account_number;
					            container.querySelector('.bname').textContent = branch_address;
					            container.querySelector('.code').textContent = branch_code;
					            container.querySelector('.scode').textContent = swift_code;
					            container.querySelector('.ifsc').textContent = ifsc_code;
					            container.querySelector('.taxbasic').textContent = Total_adv_tax_Taxable;
					            container.querySelector('.taxtotal').textContent = Tax_Final_total;
					        }

					        function autoFitInvoice(container) {
					            const invoice = container.querySelector(".invoice-container");
					            const maxHeight = 1000;
					            let fontSize = 9;

					            function applySize(size) {
					                invoice.style.fontSize = size + "px";
					                invoice.querySelectorAll("td, th").forEach(el => {
					                    el.style.fontSize = size + "px";
					                    el.style.padding = "1px 2px";
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

					        function shrinkLongDescriptions(container) {
					            container.querySelectorAll(".desc-col").forEach(td => {
					                const textLength = td.textContent.length;
					                if (textLength > 200) {
					                    td.classList.add("desc-small");
					                    td.classList.add("desc-xsmall");
					                }
					            });
					        }

							function downloadInvoicePDF(htmlContent, fillInvoice, hideLoader) {
									    const prange = [
									        "Original For Recipient",
									        "Duplicate For Transporter",
									        "Triplicate For Supplier"
									    ];

									    // Open new window
									    const printWindow = window.open('', '_blank');

									    if (!printWindow) {
									        alert("Popup blocked! Please allow popups.");
									        hideLoader();
									        return;
									    }

									    // Build full HTML
									    let fullHTML = `
									        <html>
									        <head>
									            <title>Invoice PDF</title>
									            <style>
									                @page {
									                    size: A4;
									                    margin: 10mm;
									                }

									                body {
									                    margin: 0;
									                    padding: 0;
									                    font-family: Calibri, Arial, sans-serif;
									                }

									                .page {
									                    width: 100%;
									                    max-width: 210mm;
									                    margin: 0 auto;
									                    page-break-after: always;
									                }

									                .page:last-child {
									                    page-break-after: avoid;
									                }

									                @media print {
									                    body {
									                        margin: 0;
									                    }

									                    .page {
									                        page-break-after: always;
									                    }

									                    .page:last-child {
									                        page-break-after: avoid;
									                    }
									                }
									            </style>
									        </head>
									        <body>
									    `;

									    // Create pages dynamically
									    prange.forEach(label => {
									        const temp = document.createElement("div");
									        temp.classList.add("page");
									        temp.innerHTML = htmlContent;

									        // Set copy label
									        const labelEl = temp.querySelector(".copy-label");
									        if (labelEl) labelEl.textContent = label;

									        // Fill dynamic data
									        fillInvoice(temp);

									        fullHTML += temp.outerHTML;
									    });

									    fullHTML += `
									        </body>
									        </html>
									    `;

									    // Write to new window
									    printWindow.document.open();
									    printWindow.document.write(fullHTML);
									    printWindow.document.close();

									    // Wait for rendering then print
									    printWindow.onload = () => {
									        setTimeout(() => {
									            printWindow.focus();
									            printWindow.print();
									            printWindow.close();
									            hideLoader();
									        }, 500); // small delay ensures styles/fonts load
									    };
									}

							       downloadInvoicePDF(htmlContent, fillInvoice, hideLoader);

					    } catch (error) {
							hideLoader();  
					        console.error('Error generating PDF:', error);
					    }

					}
					function showLoader() {
					  document.getElementById("pdfLoader").style.display = "flex";
					}

					function hideLoader() {
					  document.getElementById("pdfLoader").style.display = "none";
					}
					
					function openModalcancel(id,conpn_id,load_id) {
							//  const allowed = window.allowedActions || [];

						if (!allowed.includes("Cancel")) {
						  alert(" You do not have permission to Cancel.");
						  $('#exampleModalCenter16').modal('hide');
						  return;
						}
						console.log("CIN:", load_id);
						   console.log("ID:", id);
						   console.log("PN_ID:", conpn_id);
						   console.log("LOAD_ID:", load_id);

						   // ✅ SET attributes first
						   $('#exampleModalCenter16').attr('data-id',       id);
						   $('#exampleModalCenter16').attr('data-pn-id',    conpn_id);
						   $('#exampleModalCenter16').attr('data-load-ids', load_id);

						   // ✅ Then show modal
						   $('#exampleModalCenter16').modal('show');
					}
				
					
					function cancelRecord() {
						// ✅ READ attributes after they are set
						    var id      = $('#exampleModalCenter16').attr('data-id');
						    var pn_id   = $('#exampleModalCenter16').attr('data-pn-id');
						    var load_id = $('#exampleModalCenter16').attr('data-load-ids');

						    console.log("ID:", id);
						    console.log("PN_ID:", pn_id);
						    console.log("LOAD_ID:", load_id);

						    $.ajax({
						        url: new URL('/jssl/invoice/cancelconsolidatedbyidnew', baseUrl),
						        type: 'POST',
						        dataType: 'json',
						        xhrFields: { withCredentials: true },
						        data: jQuery.param({
						            id:           id,
						            cancelled_by: createdById,
						            factory_id:   selectedFactoryId,
						            pn_id:        pn_id,
						            load_id:      load_id    // ✅ now sends CIN-00002
						        }),
						        success: function (data) {
						            if (data.message === "Success") {
						                const popup = $('<div class="popup">Consolidated Cancelled Successfully!</div>')
						                    .appendTo('body').hide().fadeIn(400);

						                setTimeout(function () {
						                    popup.fadeOut(400, function () {
						                        $(this).remove();
						                        window.location = 'ConsolidatedInvoice.jsp';
						                    });
						                }, 800);
						            } else {
						                alert(data.message || "Cancel failed");
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
						
					