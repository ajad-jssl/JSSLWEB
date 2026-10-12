

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

// ---------- Shared helper ----------
function normalizeText(str) {
    return (str || "").replace(/\s+/g, " ").trim().toLowerCase();
}

/**
 * Dedupe a list of {id, label} records by normalized label text.
 * If a duplicate is found, prefer the one whose id matches selectedId
 * (so pre-selection still works correctly even if the backend has
 * two different ids pointing to the same display text).
 */
function dedupeByLabel(records, selectedId) {
    const map = new Map(); // key: normalized label -> record
    records.forEach((rec) => {
        const key = normalizeText(rec.label);
        if (!key) return;
        const existing = map.get(key);
        if (!existing) {
            map.set(key, rec);
        } else if (selectedId && String(rec.id) === String(selectedId)) {
            // incoming one is the actual selected record — prefer it
            map.set(key, rec);
        }
        // else: keep the first one seen, drop this duplicate
    });
    return Array.from(map.values());
}

function populateSelect(selectElement, records, selectedId, placeholder, fallbackText) {
    selectElement.innerHTML = `<option value="">${placeholder}</option>`;

    let matched = false;
    records.forEach((rec) => {
        const option = document.createElement("option");
        option.value = rec.id;
        option.textContent = rec.label;
        if (selectedId && String(rec.id) === String(selectedId)) {
            option.selected = true;
            matched = true;
        }
        selectElement.appendChild(option);
    });

    if (!matched && fallbackText) {
        const fallbackOption = document.createElement("option");
        fallbackOption.value = fallbackText;
        fallbackOption.textContent = fallbackText;
        fallbackOption.selected = true;
        selectElement.insertBefore(fallbackOption, selectElement.children[1] || null);
    }
}


document.addEventListener("DOMContentLoaded", function () {
	
	loadAllowedActions();
/*	// First, check if there's already an initial row
	   addRow(); // Initially add a row
	   // Populate the dropdowns for the first row
	   fetchuom(1);
	   fetctype(1);*/
	fetchinvoicetype();
	fetchtaxadd1();
	   fetchtaxadd2();
	   fetchtaxadd3();
	   fetchinvoice();
	   fetchSalebusunit(selectedFactoryId);
	   fetchinvoiceto();
	   fetchconname();
	   fetchShipping();
	   fetchdelivery();
	   fetchSalebank();
	   fetchSalework();
	   fetchorg1();
	   fetchservice();
	   fetchhsn();
	   fetchservice1();
	   fetchhsn1();
	   fetchexptitle();
	   fetchBgType();
	   fetchBgType1();
	   fetchtaxadd1up();
	   fetchtaxadd2up();
	   fetchtaxadd3up();
	   fetchinvoice1();
	   fetchBusinessUnitList();       
	   fetchInvoiceAddressList();     
	   fetchWorkOrderList();          
	   fetchConsigneeAddressList();  
	   fetchServiceCodeList();   
	   fetchHsnCodeList();   
	});
	
	function fetchtaxadd1up() {
	    fetchTaxData("tax1adduppscrap", "tax11uppscrap", "tax1valueuppscrap");
	}

	function fetchtaxadd2up() {
	    fetchTaxData("tax2adduppscrap", "tax12uppscrap", "tax2valueuppscrap");
	}

	function fetchtaxadd3up() {
	    fetchTaxData("tax3adduppscrap", "tax13uppscrap", "tax3valueuppscrap");
	}

	async function fetchTaxData(selectId, taxPercentId, taxValueId) {
			    try {
			        const url = new URL(`/jssl/taxmasters/list`, baseUrl);
					const response = await fetch(url,{
									           method: "GET",
									           credentials: "include"   // ✅ Always send JSESSIONID cookie
									       });
			        if (!response.ok) throw new Error("Failed to fetch tax data");

			        const json = await response.json();
			        if (json.status !== "yes" || !json.Data?.length) {
			            console.warn("No tax data found.");
			            return;
			        }

			        const selectElement = document.getElementById(selectId);
			        selectElement.innerHTML = `<option value="">Select tax</option>`;

			        const taxMap = {};
			        json.Data.forEach(({ tax_id, tax_name, tax_per }) => {
			            if (tax_id && tax_name) {
			                taxMap[tax_id] = tax_per;
			                const option = document.createElement("option");
			                option.value = tax_id;
			                option.textContent = tax_name;
			                selectElement.appendChild(option);
			            }
			        });

			        selectElement.addEventListener("change", () => {
			            const selectedTaxId = selectElement.value;
			            const taxPercent = selectedTaxId ? taxMap[selectedTaxId] || 0 : 0;
			            const totalAmount = parseFloat(document.getElementById("netAmountuppscrap").value) || 0;
			            const taxValue = ((taxPercent / 100) * totalAmount).toFixed(2);

			            document.getElementById(taxPercentId).value = taxPercent;
			            document.getElementById(taxValueId).value = taxValue;

			            calculateGrandTotal();
			        });
			    } catch (error) {
			        console.error("Error fetching tax data:", error);
			    }
			}

			function calculateGrandTotal() {
					   const netAmount = parseFloat(document.getElementById("netAmountuppscrap").value) || 0;
					    const tax1 = parseFloat(document.getElementById("tax1valueuppscrap").value) || 0;
					    const tax2 = parseFloat(document.getElementById("tax2valueuppscrap").value) || 0;
					    const tax3 = parseFloat(document.getElementById("tax3valueuppscrap").value) || 0;

					    const totalTax = tax1 + tax2 + tax3;
					    document.getElementById("totalTaxuppscrap").value = totalTax.toFixed(2);
					    document.getElementById("grandTotaluppscrap").value = (netAmount + totalTax).toFixed(2);
			}

	
			async function fetchtaxadd1() {
			      try {
			          const url = new URL(`/jssl/taxmasters/list`, baseUrl);
			  		const response = await fetch(url,{
			  						           method: "GET",
			  						           credentials: "include"   // ✅ Always send JSESSIONID cookie
			  						       });
			          if (!response.ok) throw new Error("Failed to fetch tax data");

			          const json = await response.json();
			          const taxData = json?.Data || [];

			          const selectElement = document.getElementById("tax1addupscrap");
			          const taxInput = document.getElementById("tax11upscrap");
			          const taxValueInput = document.getElementById("tax1valueupscrap");
			          const totalNoInput = document.getElementById("grandTotalscrap"); // Total Amount Field

			          if (!selectElement || !taxInput || !taxValueInput || !totalNoInput) {
			              console.error("Some required elements not found.");
			              return;
			          }

			          if (taxData.length === 0) {
			              console.warn("No tax records found.");
			              selectElement.innerHTML = `<option value="">No Tax Records Found</option>`;
			              return;
			          }

			          selectElement.innerHTML = `<option value="">Select Tax</option>`;

			          taxData.forEach((type) => {
			              if (type.tax_id && type.tax_name && type.tax_per !== undefined) {
			                  const option = document.createElement("option");
			                  option.value = type.tax_id;
			                  option.dataset.taxPer = type.tax_per; // Store tax_per as a data attribute
			                  option.textContent = type.tax_name;
			                  selectElement.appendChild(option);
			              }
			          });

			          // Function to calculate and update tax value
			          function updateTaxValue() {
			              const taxPer = parseFloat(taxInput.value) || 0;
			              const totalNo = parseFloat(totalNoInput.value) || 0;
			              const taxAmount = (totalNo * taxPer) / 100;
			              taxValueInput.value = taxAmount.toFixed(2); // Show result with 2 decimal places
			              updateTotalTax();
			              updateGrandTotal();
			          }

			          // Event listener to update tax percentage and value
			          selectElement.addEventListener("change", function () {
			              const selectedOption = selectElement.options[selectElement.selectedIndex];
			              taxInput.value = selectedOption.dataset.taxPer || "";
			              updateTaxValue(); // Update tax value immediately after selection
			          });

			          // Recalculate tax value when totalNo changes
			          totalNoInput.addEventListener("input", updateTaxValue);

			      } catch (error) {
			          console.error("Error fetching tax data:", error);
			      }
			  }
				   
				   
				   
				   async function fetchtaxadd2() {
				       try {
				           const url = new URL(`/jssl/taxmasters/list`, baseUrl);
				   		const response = await fetch(url,{
				   						           method: "GET",
				   						           credentials: "include"   // ✅ Always send JSESSIONID cookie
				   						       });
				           if (!response.ok) throw new Error("Failed to fetch tax data");

				           const json = await response.json();
				           const taxData = json?.Data || [];

				           const selectElement = document.getElementById("tax2addupscrap");
				           const taxInput = document.getElementById("tax12upscrap");
				           const taxValueInput = document.getElementById("tax2valueupscrap");
				           const totalNoInput = document.getElementById("grandTotalscrap"); // Total Amount Field

				           if (!selectElement || !taxInput || !taxValueInput || !totalNoInput) {
				               console.error("Some required elements not found.");
				               return;
				           }

				           if (taxData.length === 0) {
				               console.warn("No tax records found.");
				               selectElement.innerHTML = `<option value="">No Tax Records Found</option>`;
				               return;
				           }

				           selectElement.innerHTML = `<option value="">Select Tax</option>`;

				           taxData.forEach((type) => {
				               if (type.tax_id && type.tax_name && type.tax_per !== undefined) {
				                   const option = document.createElement("option");
				                   option.value = type.tax_id;
				                   option.dataset.taxPer = type.tax_per; // Store tax_per as a data attribute
				                   option.textContent = type.tax_name;
				                   selectElement.appendChild(option);
				               }
				           });

				           // Function to calculate and update tax value
				           function updateTaxValue() {
				               const taxPer = parseFloat(taxInput.value) || 0;
				               const totalNo = parseFloat(totalNoInput.value) || 0;
				               const taxAmount = (totalNo * taxPer) / 100;
				               taxValueInput.value = taxAmount.toFixed(2); // Show result with 2 decimal places
				               updateTotalTax();
				               updateGrandTotal();
				           }

				           // Event listener to update tax percentage and value
				           selectElement.addEventListener("change", function () {
				               const selectedOption = selectElement.options[selectElement.selectedIndex];
				               taxInput.value = selectedOption.dataset.taxPer || "";
				               updateTaxValue(); // Update tax value immediately after selection
				           });

				           // Recalculate tax value when totalNo changes
				           totalNoInput.addEventListener("input", updateTaxValue);

				       } catch (error) {
				           console.error("Error fetching tax data:", error);
				       }
				   }

				   async function fetchtaxadd3() {
				       try {
				           const url = new URL(`/jssl/taxmasters/list`, baseUrl);
				   		const response = await fetch(url,{
				   						           method: "GET",
				   						           credentials: "include"   // ✅ Always send JSESSIONID cookie
				   						       });
				           if (!response.ok) throw new Error("Failed to fetch tax data");

				           const json = await response.json();
				           const taxData = json?.Data || [];

				           const selectElement = document.getElementById("tax3addupscrap");
				           const taxInput = document.getElementById("tax13upscrap");
				           const taxValueInput = document.getElementById("tax3valueupscrap");
				           const totalNoInput = document.getElementById("grandTotalscrap"); // Total Amount Field

				           if (!selectElement || !taxInput || !taxValueInput || !totalNoInput) {
				               console.error("Some required elements not found.");
				               return;
				           }

				           if (taxData.length === 0) {
				               console.warn("No tax records found.");
				               selectElement.innerHTML = `<option value="">No Tax Records Found</option>`;
				               return;
				           }

				           selectElement.innerHTML = `<option value="">Select Tax</option>`;

				           taxData.forEach((type) => {
				               if (type.tax_id && type.tax_name && type.tax_per !== undefined) {
				                   const option = document.createElement("option");
				                   option.value = type.tax_id;
				                   option.dataset.taxPer = type.tax_per; // Store tax_per as a data attribute
				                   option.textContent = type.tax_name;
				                   selectElement.appendChild(option);
				               }
				           });

				           // Function to calculate and update tax value
				           function updateTaxValue() {
				               const taxPer = parseFloat(taxInput.value) || 0;
				               const totalNo = parseFloat(totalNoInput.value) || 0;
				               const taxAmount = (totalNo * taxPer) / 100;
				               taxValueInput.value = taxAmount.toFixed(2); // Show result with 2 decimal places
				                updateTotalTax();
				           }

				           // Event listener to update tax percentage and value
				           selectElement.addEventListener("change", function () {
				               const selectedOption = selectElement.options[selectElement.selectedIndex];
				               taxInput.value = selectedOption.dataset.taxPer || "";
				               updateTaxValue(); // Update tax value immediately after selection
				               updateGrandTotal();
				           });

				           // Recalculate tax value when totalNo changes
				           totalNoInput.addEventListener("input", updateTaxValue);

				       } catch (error) {
				           console.error("Error fetching tax data:", error);
				       }
				   }
				   
				   function updateTotalTax() {
				       const tax1 = parseFloat(document.getElementById("tax1valueupscrap").value) || 0;
				       const tax2 = parseFloat(document.getElementById("tax2valueupscrap").value) || 0;
				       const tax3 = parseFloat(document.getElementById("tax3valueupscrap").value) || 0;
				       const totalTax = tax1 + tax2 + tax3;

				       document.getElementById("totalTaxupscrap").value = totalTax.toFixed(2); // Show result with 2 decimal places
				   }

				   function updateGrandTotal() {
				       const totalTax = parseFloat(document.getElementById("totalTaxupscrap").value) || 0;
				       const netAmount = parseFloat(document.getElementById("netAmountupscrap").value) || 0;
				       const total = totalTax + netAmount;
				       document.getElementById("grandTotalupscrap").value = total.toFixed(2);
				    }
async function fetchinvoicetype() {
    try {
        // Construct the API URL properly
        const url = new URL(`/jssl/master/listinvoicetypenew`, baseUrl1);

		const selectedFactoryId = sessionStorage.getItem("selectedFactoryId");

        // Fetch data from API
		const response = await fetch(url,{
						           method: "GET",
						           credentials: "include"   // ✅ Always send JSESSIONID cookie
						       });
        if (!response.ok) throw new Error("Failed to fetch invoicetype");

        const json = await response.json();

        // Check if the API response has valid data
        if (json.status !== "yes" || !json.INVOICE_TYPE_LIST.length) {
            console.warn("No invoicetype found.");
            return;
        }

        // Get the select element for contractors
        const selectElement = document.getElementById("invoice");

        // Clear existing options
        selectElement.innerHTML = `<option value="">Select invoicetype</option>`;

        // Populate dropdown options using contractor data
		// Populate dropdown options using invoice type data
		json.INVOICE_TYPE_LIST.forEach((invoicetype) => {
		    // Skip GP invoice type
		    if (
		        invoicetype.type_no &&
		        invoicetype.type &&
		        invoicetype.type.trim().toUpperCase() !== "GP"
		    ) {
		        const option = document.createElement("option");
		        option.value = invoicetype.type_no;
		        option.textContent = invoicetype.type;
		        selectElement.appendChild(option);
		    }
		});

        // Add event listener for contractor selection change
        selectElement.addEventListener("change", function() {
            const selectedinvoicetype = selectElement.value;
			const contractsel = document.getElementById("cont");
			if (selectedinvoicetype == "1") {
			      // Clear contract dropdown first
			      contractsel.innerHTML = '<option value="">Select Contract</option>';

			      // Fetch and populate contracts (scrap should not appear)
			      fetchcont(selectedFactoryId);
			  } else {
			      // Clear and add only Scrap
			      contractsel.innerHTML = "";

			      const scrapOption = document.createElement("option");
			      scrapOption.value = "Scrap";
			      scrapOption.textContent = "Scrap";
			      contractsel.appendChild(scrapOption);
			  }
                // If no contractor is selected, clear the milestone dropdown
                const mileSelect = document.getElementById("mile");
                mileSelect.innerHTML = `<option value="">Select milestone</option>`;
        });

    } catch (error) {
        console.error("Error fetching contractors:", error);
    }
}

// Fetch the contractor list
async function fetchcont(factoryId) {
    try {
        const url = new URL(`/jssl/steelDebitCredit/getContractorDetails`, baseUrl1);
        url.searchParams.append("factory_id", factoryId);

		const response = await fetch(url,{
						           method: "GET",
						           credentials: "include"   // ✅ Always send JSESSIONID cookie
						       });
        if (!response.ok) throw new Error("Failed to fetch contractors");

        const json = await response.json();

        if (json.status !== "yes" || !json.DATA.length) {
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

document.getElementById("invoice_type").addEventListener("change", function () {
	   const selectedcontract = document.getElementById("cont");
	   const selectednotetype = document.getElementById("invoice_type");
       const selectedContractorId = selectedcontract.value; // Get selected contractor ID
	   const selectednotetext = selectednotetype.value;
       const selectedFactoryId = sessionStorage.getItem("selectedFactoryId"); // Get factory ID again

       if (selectedContractorId) {
			document.getElementById("load").innerHTML = `<option value="">Select load</option>`; // Clear load dropdown
           fetchLoad(selectedFactoryId, selectedContractorId,selectednotetext); // Fetch load dropdown
       } else {
           console.warn("No contractor selected.");
           document.getElementById("load").innerHTML = `<option value="">Select load</option>`; // Clear load dropdown
           document.getElementById("inputFieldsContainer").style.display = "none"; // Hide the input fields container
       }
   });

// Fetch the load list based on factoryId and selected contractorId (con_id)
async function fetchLoad(factoryId, contractId,notetype) {
	if(contractId!="Scrap")
		{
    try {
		const url = new URL(`/jssl/steelDebitCredit/getLoadListForTheContractor`, baseUrl1);
        url.searchParams.append("factory_id", factoryId);
        url.searchParams.append("con_id", contractId); // Pass selected contractor ID
		url.searchParams.append("note_type", notetype);
		const response = await fetch(url,{
						           method: "GET",
						           credentials: "include"   // ✅ Always send JSESSIONID cookie
						       });
        if (!response.ok) throw new Error("Failed to fetch loads");

        const json = await response.json();

        if (json.status !== "yes" || !json.DATA.length) {
			selectElement.innerHTML = `<option value="">Select load</option>`;
            console.warn("No loads found.");
            return;
        }

        const selectElement = document.getElementById("load");
        selectElement.innerHTML = `<option value="">Select load</option>`;

        json.DATA.forEach((type) => {
            if (type.dcpn_no) {
                const option = document.createElement("option");
                option.value = type.dcpn_no;
                option.textContent = type.dcpn_no;
                selectElement.appendChild(option);
            }
        });
    } catch (error) {
        console.error("Error fetching loads:", error);
    }
}
else{
	  try {
	        const url = new URL(`/jssl/scrapDebitCredit/getLoadListForTheContractor`, baseUrl1);
	        url.searchParams.append("factory_id", factoryId);
	        url.searchParams.append("con_id", contractId); // Pass selected contractor ID
			url.searchParams.append("note_type", notetype);
			const response = await fetch(url,{
							           method: "GET",
							           credentials: "include"   // ✅ Always send JSESSIONID cookie
							       });
	        if (!response.ok) throw new Error("Failed to fetch loads");

	        const json = await response.json();

	        if (json.status !== "yes" || !json.DATA.length) {
	            console.warn("No loads found.");
				const selectElement = document.getElementById("load");
				        selectElement.innerHTML = `<option value="">Select load</option>`;
	            return;
				
	        }

	        const selectElement = document.getElementById("load");
	        selectElement.innerHTML = `<option value="">Select load</option>`;

	        json.DATA.forEach((type) => {
	            if (type.dcpn_no) {
	                const option = document.createElement("option");
	                option.value = type.dcpn_no;
	                option.textContent = type.dcpn_no;
	                selectElement.appendChild(option);
	            }
	        });
	    } catch (error) {
	        console.error("Error fetching loads:", error);
	    }
	}
	}
document.getElementById("load").addEventListener("change", function () {
	   const loadselected =this.value;
	   const selectedcontract = document.getElementById("cont");
       const selectedContractorId = selectedcontract.value; // Get selected contractor ID
	   
		if(selectedContractorId!="Scrap"){
         if (selectedContractorId && loadselected) {
		document.getElementById("inputFieldsContainer").style.display = "block"; // Show the input fields container
		document.getElementById("inputFieldsContainerscrap").style.display = "none"; 
		         fetchQsPackingData(selectedContractorId, loadselected); // Fetch the QsPacking data and populate the fields
		     } else {
				
		         document.getElementById("inputFieldsContainer").style.display = "none"; // Hide if not selected
				 document.getElementById("inputFieldsContainerscrap").style.display = "none"; 
		     }
			 
			 }
			 else{
				if (selectedContractorId && loadselected) {
				document.getElementById("inputFieldsContainerscrap").style.display = "block"; // Show the input fields container
				document.getElementById("inputFieldsContainer").style.display = "none"; 
				         fetchQsPackingData(selectedContractorId, loadselected); // Fetch the QsPacking data and populate the fields
				     } else {
						
				         document.getElementById("inputFieldsContainerscrap").style.display = "none"; // Hide if not selected
						 document.getElementById("inputFieldsContainer").style.display = "none"; 
				     }
			 }
			 
			 
			 
   });
   async function fetchSalebusunit1(targetId = "bus", currentValueText = null) {
       try {
           const url = new URL(`/jssl/contract/listbusinessunitnew`, baseUrl);

           const response = await fetch(url, {
               method: "GET",
               credentials: "include"
           });
           if (!response.ok) throw new Error("Failed to fetch sale order types");

           const json = await response.json();

           if (json.status !== "yes" || !json.Data.length) {
               console.warn("No sale order types found.");
               return;
           }

           const selectElement = document.getElementById(targetId);
           if (!selectElement) return;

           selectElement.innerHTML = `<option value="">Select Business Unit</option>`;

           //let matchFound = false;

   		json.Data.forEach((type) => {
   		    if (type.business_unit_id && type.business_unit_name) {
   		        const bindaddress = type.business_unit_name + type.location + '(' + type.gst_number + ')';

   		        const option = document.createElement("option");
   		        option.value = type.business_unit_id;
   		        option.textContent = bindaddress;

   		        // Loosen the match — check if currentValueText starts with the business unit name
   		        if (currentValueText && currentValueText.startsWith(type.business_unit_name)) {
   		            option.selected = true;
   		            matchFound = true;
   		        }

   		        selectElement.appendChild(option);
   		    }
   		});

           // Only add currentValueText as a fallback option if it wasn't found in the API list
           /*if (currentValueText && !matchFound) {
               const currentOption = document.createElement("option");
               currentOption.value = currentValueText;
               currentOption.textContent = currentValueText;
               currentOption.selected = true;
               selectElement.insertBefore(currentOption, selectElement.firstChild.nextSibling);
           }*/
       } catch (error) {
           console.error("Error fetching sale order types:", error);
       }
   }
   
async function fetchinvoiceto1(targetId = "into", currentValueText = null) {
    try {
        const url = new URL(`/jssl/invoiceConsigneeAddress/getInvoiceAddress`, baseUrl);
        const response = await fetch(url, { method: "GET", credentials: "include" });
        if (!response.ok) throw new Error("Failed to fetch invoice addresses");
        const json = await response.json();
        if (json.status !== "yes" || !json.InvoiceAddress?.length) {
            console.warn("No invoice addresses found.");
            return;
        }

        const selectElement = document.getElementById(targetId);
        if (!selectElement) return;

        const records = json.InvoiceAddress
            .filter(t => t.is_verified == 1 && t.id && t.address)
            .map(t => ({ id: t.id, label: t.address }));

        // find id matching currentValueText by exact address text, if any
        let matchedId = null;
        const match = records.find(r => normalizeText(r.label) === normalizeText(currentValueText));
        if (match) matchedId = match.id;

        const deduped = dedupeByLabel(records, matchedId);
        populateSelect(selectElement, deduped, matchedId, "Select invoice to", matchedId ? null : currentValueText);
    } catch (error) {
        console.error("Error fetching invoice addresses:", error);
    }
}

async function fetchSalework1(targetId = "work", currentValueText = null) {
    try {
        const url = new URL(`/jssl/contract/listworkordernew`, baseUrl);
        const response = await fetch(url, { method: "GET", credentials: "include" });
        if (!response.ok) throw new Error("Failed to fetch work orders");
        const json = await response.json();
        if (json.status !== "yes" || !json.Data.length) {
            console.warn("No work orders found.");
            return;
        }

        const selectElement = document.getElementById(targetId);
        if (!selectElement) return;

        const records = json.Data
            .filter(t => t.work_id && t.workorder_no)
            .map(t => ({ id: t.work_id, label: t.workorder_no }));

        let matchedId = null;
        const match = records.find(r => normalizeText(r.label) === normalizeText(currentValueText));
        if (match) matchedId = match.id;

        const deduped = dedupeByLabel(records, matchedId);
        populateSelect(selectElement, deduped, matchedId, "Select work order", matchedId ? null : currentValueText);
    } catch (error) {
        console.error("Error fetching work orders:", error);
    }
}

async function fetchconname1(targetId = "consig", currentValueText = null) {
    try {
        const url = new URL(`/jssl/invoiceConsigneeAddress/getConsigneeAddressNew`, baseUrl);
        const response = await fetch(url, { method: "GET", credentials: "include" });
        if (!response.ok) throw new Error("Failed to fetch consignee addresses");
        const json = await response.json();
        if (json.status !== "yes" || !json.ConsigneeAddress?.length) {
            console.warn("No consignee addresses found.");
            return;
        }

        const selectElement = document.getElementById(targetId);
        if (!selectElement) return;

        const records = json.ConsigneeAddress
            .filter(t => t.is_verified == 1 && t.id && t.address)
            .map(t => ({ id: t.id, label: t.address }));

        let matchedId = null;
        const match = records.find(r => normalizeText(r.label) === normalizeText(currentValueText));
        if (match) matchedId = match.id;

        const deduped = dedupeByLabel(records, matchedId);
        populateSelect(selectElement, deduped, matchedId, "Select", matchedId ? null : currentValueText);
    } catch (error) {
        console.error("Error fetching consignee addresses:", error);
    }
}

// ---------- Shared helpers (reuse if already defined elsewhere in your file) ----------
function normalizeText(str) {
    return (str || "").replace(/\s+/g, " ").trim().toLowerCase();
}

function dedupeByLabel(records, selectedId) {
    const map = new Map();
    records.forEach((rec) => {
        const key = normalizeText(rec.label);
        if (!key) return;
        const existing = map.get(key);
        if (!existing) {
            map.set(key, rec);
        } else if (selectedId && String(rec.id) === String(selectedId)) {
            map.set(key, rec);
        }
    });
    return Array.from(map.values());
}

function populateSelect(selectElement, records, selectedId, placeholder, fallbackText) {
    selectElement.innerHTML = `<option value="">${placeholder}</option>`;

    let matched = false;
    records.forEach((rec) => {
        const option = document.createElement("option");
        option.value = rec.id;
        option.textContent = rec.label;
        if (selectedId && String(rec.id) === String(selectedId)) {
            option.selected = true;
            matched = true;
        }
        selectElement.appendChild(option);
    });

    if (!matched && fallbackText) {
        const fallbackOption = document.createElement("option");
        fallbackOption.value = fallbackText;
        fallbackOption.textContent = fallbackText;
        fallbackOption.selected = true;
        selectElement.insertBefore(fallbackOption, selectElement.children[1] || null);
    }
}
   
async function fetchservice1(targetId = "officeservice", currentValueText = null) {
    try {
        const url = new URL(`/jssl/master/listservicecodemasternew`, baseUrl);
        const response = await fetch(url, { method: "GET", credentials: "include" });
        if (!response.ok) throw new Error("Failed to fetch service codes");
        const json = await response.json();
        if (json.status !== "yes" || !json.Data.length) {
            console.warn("No service codes found.");
            return;
        }

        const selectElement = document.getElementById(targetId);
        if (!selectElement) return;

        const records = json.Data
            .filter(t => t.servicecode_id && t.service_code)
            .map(t => ({ id: t.servicecode_id, label: t.service_code }));

        let matchedId = null;
        const match = records.find(r => normalizeText(r.label) === normalizeText(currentValueText));
        if (match) matchedId = match.id;

        const deduped = dedupeByLabel(records, matchedId);
        populateSelect(selectElement, deduped, matchedId, "Select service code", matchedId ? null : currentValueText);
    } catch (error) {
        console.error("Error fetching service codes:", error);
    }
}

async function fetchhsn1(targetId = "officehsn", currentValueText = null) {
    try {
        const url = new URL(`/jssl/master/listHsncodemasternew`, baseUrl);
        const response = await fetch(url, { method: "GET", credentials: "include" });
        if (!response.ok) throw new Error("Failed to fetch hsn codes");
        const json = await response.json();
        if (json.status !== "yes" || !json.Data.length) {
            console.warn("No hsn codes found.");
            return;
        }

        const selectElement = document.getElementById(targetId);
        if (!selectElement) return;

        const records = json.Data
            .filter(t => t.servicecode_id && t.service_code)
            .map(t => ({ id: t.servicecode_id, label: t.service_code }));

        let matchedId = null;
        const match = records.find(r => normalizeText(r.label) === normalizeText(currentValueText));
        if (match) matchedId = match.id;

        const deduped = dedupeByLabel(records, matchedId);
        populateSelect(selectElement, deduped, matchedId, "Select hsn code", matchedId ? null : currentValueText);
    } catch (error) {
        console.error("Error fetching hsn codes:", error);
    }
}
// Fetch the QsPacking data using contractor_id and load_id
async function fetchQsPackingData(contractId, loadId) {
	if(contractId!="Scrap")
		{
    try {
        const selectedFactoryId = sessionStorage.getItem("selectedFactoryId"); // Get the factory_id from sessionStorage

        // Ensure factory_id is available
        if (!selectedFactoryId) {
            console.error("No factory ID found in sessionStorage.");
            return;
        }

        const url = new URL(`/jssl/invoice/getcontractdcpackingdetailsnew`, baseUrl1);
	 /*  const url = new URL(`http://localhost:8004/jssl/invoice/getcontractdcpackingdetailsnew`);*/
        
        // Append the parameters to the URL
        url.searchParams.append("contract_id", contractId);
        url.searchParams.append("DcPn_no", loadId);
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
        
     	if (json.status === "yes" && json.QsPacking_Data)
			{
        	const QsPacking = json.QsPacking_Data[0];
        
            const freightValue = QsPacking.freight; // Assuming the bank details ID is inside this property
            const frie = document.getElementById("freight");
            if (frie) {
                frie.value = freightValue; // Populate the bank name field
            }
            
            const pnidValue = QsPacking.dc_pn_id; // Assuming the bank details ID is inside this property
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
            /*const workIdValue = contractor.work_id_value; // Assuming the work order ID is inside this property
            const workInput = document.getElementById("work");
            if (workInput) {
                workInput.value = workIdValue; // Populate the work order field
            }*/
			fetchSalework1("work", contractor.work_id_value);
            const InvoiceTypeCal = contractor.invoice_type_calculation; // Assuming the work order ID is inside this property
            const InvoiceTypeCalcu = document.getElementById("intypecal");
            if (InvoiceTypeCalcu) {
                InvoiceTypeCalcu.value = InvoiceTypeCal; // Populate the work order field
            }
            /*const InvoiceToValue = contractor.invoice_to_id_value; // Assuming the work order ID is inside this property
            const InvoiceTo = document.getElementById("ininto");
            if (InvoiceTo) {
                InvoiceTo.value = InvoiceToValue; // Populate the work order field
            }*/
			fetchinvoiceto1("ininto", contractor.invoice_to_id_value);
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
            /*const ConValue = contractor.consignee_id_value; // Assuming the work order ID is inside this property
            const conadd = document.getElementById("billing");
            if (conadd) {
                conadd.value = ConValue; // Populate the work order field
            }*/
			fetchconname1("billing", contractor.consignee_id_value);
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
			fetchservice1("officeservice", contractor.s_code_value);
			fetchhsn1("officehsn", contractor.h_code_value);
            /*const ServiceValue = contractor.s_code_value; // Assuming the work order ID is inside this property
            const Scode = document.getElementById("service");
            if (Scode) {
                Scode.value = ServiceValue; // Populate the work order field
            }
            const HsnValue = contractor.h_code_value; // Assuming the work order ID is inside this property
            const Hcode = document.getElementById("hsncode");
            if (Hcode) {
                Hcode.value = HsnValue; // Populate the work order field
            }*/
            /*const BNameValue = contractor.businessUnitName; // Assuming the work order ID is inside this property
            const Bname = document.getElementById("inbusunit");
            if (Bname) {
                Bname.value = BNameValue; // Populate the work order field
            }*/
			fetchSalebusunit1("inbusunit", contractor.businessUnitName);
            /*const ScodeNameValue = contractor.s_code_value; // Assuming the work order ID is inside this property
            const Scodename = document.getElementById("officeservice");
            if (Scodename) {
                Scodename.value = ScodeNameValue; // Populate the work order field
            }
            const HcodeNameValue = contractor.h_code_value; // Assuming the work order ID is inside this property
            const Hcodename = document.getElementById("officehsn");
            if (Hcodename) {
                Hcodename.value = HcodeNameValue; // Populate the work order field
            }*/
            const con_slnoValue = contractor.con_slno; // Assuming the work order ID is inside this property
            const con_slno = document.getElementById("id11con");
            if (con_slno) {
                con_slno.value = con_slnoValue; // Populate the work order field
            }
        } else {
            console.warn("No Contractor Data found.");
        }
        

        // Check if QsPacking_Data exists and contains items
        if (json.QsPacking_Data && json.QsPacking_Data.length > 0) {
            const container = document.querySelector(".dynamic-row"); // Find the container for dynamic rows
            container.innerHTML = ""; // Clear any existing rows

            // Loop through QsPacking_Data and create input fields dynamically
	/*		let itemRecords = json.QsPacking_Data || [];
							itemRecords.forEach((record, index) => {
                const div = document.createElement("div");
                div.classList.add("form-group-container", "col-md-12"); // Add classes to style the row*/
				json.QsPacking_Data.forEach((item, index) => {
					const showLabel = index === 0;
				             const div = document.createElement("div");
				             div.classList.add("form-group-container", "col-md-12"); // Add classes to style the row

                // Create fields dynamically based on the data
                div.innerHTML = `
                    <div class="form-row">
                        <div class="form-group col-md-1 col-sm-12">
						${showLabel ? '<label class="small-label">UOM</label>' : ''}
                            <input type="text" id="uom_${index}" value="${item.uom_name}" class="form-control form-control-sm" disabled>
                        </div>
                        <div class="form-group col-md-1 col-sm-12">
						${showLabel ? '<label class="small-label">Quantity</label>' : ''}
                            <input type="number" id="qty_${index}" value="${item.quantities}" class="form-control form-control-sm text-right" disabled>
                        </div>
                        <div class="form-group col-md-1 col-sm-12">
						${showLabel ? '<label class="small-label">Kg</label>' : ''}
                            <input type="number" id="kg_${index}" value="${item.kgs}" class="form-control form-control-sm text-right" disabled>
                        </div>
                        <div class="form-group col-md-1 col-sm-12">
						${showLabel ? '<label class="small-label">Unit Price</label>' : ''}
                            <input type="number" id="unit_price_${index}" value="${item.unit_price}" class="form-control form-control-sm text-right" disabled>
                        </div>
                        <div class="form-group col-md-1 col-sm-12">
						${showLabel ? '<label class="small-label">Total</label>' : ''}
                            <input type="number" id="total_${index}" value="${item.total}" class="form-control form-control-sm text-right" disabled>
                        </div>
                        <div class="form-group col-md-2 col-sm-12">
						${showLabel ? '<label class="small-label">Milestone</label>' : ''}
                            <input type="text" id="mile_${index}" value="${item.milestone_name}" class="form-control form-control-sm" disabled>
                        </div>
                        <div class="form-group col-md-2 col-sm-12">
						${showLabel ? '<label class="small-label">Invoice Type</label>' : ''}
                            <input type="text" id="intype_${index}" value="${item.scrap_name_type_id}" class="form-control form-control-sm" disabled>
                        </div>
                        
                        </div>
						
                `;
                
                container.appendChild(div); // Append the new dynamic row
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
                            <input type="text" id="tax_per_${taxIndex}" value="${tax.tax_per}" class="form-group col-md-6 col-sm-12 text-right" disabled>
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
    } catch (error) {
        console.error("Error fetching QsPacking data:", error);
    }
}
else{
	 try {
	        const selectedFactoryId = sessionStorage.getItem("selectedFactoryId"); // Get the factory_id from sessionStorage

	        // Ensure factory_id is available
	        if (!selectedFactoryId) {
	            console.error("No factory ID found in sessionStorage.");
	            return;
	        }

	        const url = new URL(`/jssl/invoice/getdbtcrdspackingdetailsnewscrap`, baseUrl);
	        
	        // Append the parameters to the URL
		/*	url.searchParams.append("contract_id", contractId);*/
			    url.searchParams.append("load_id", loadId);
			    url.searchParams.append("factory_id", selectedFactoryId); // Append factory_id as well

				const response = await fetch(url,{
								           method: "GET",
								           credentials: "include"   // ✅ Always send JSESSIONID cookie
								       });
	        if (!response.ok) throw new Error("Failed to fetch QsPacking data");

	        const json = await response.json();
	        
	  
	        
	        if (json.QsPacking_Data && json.QsPacking_Data.length > 0) {
	        const QsPacking = json.QsPacking_Data[0];
	        
	            const freightValue = QsPacking.freight; // Assuming the bank details ID is inside this property
	            const frie = document.getElementById("freightscrap");
	            if (frie) {
	                frie.value = freightValue; // Populate the bank name field
	            }
	            
	            const pnidValue = QsPacking.dc_pn_id; // Assuming the bank details ID is inside this property
	            const dc_pn_id = document.getElementById("id11scrap");
	            if (dc_pn_id) {
	                dc_pn_id.value = pnidValue; // Populate the bank name field
	            }
	            
	        } else {
	            console.warn("No qspacking Data found.");
	        }


	        // Check if QsPacking_Data exists and contains items
	        if (json.QsPacking_Data && json.QsPacking_Data.length > 0) {
	            const container = document.querySelector(".dynamic-rowscrap"); // Find the container for dynamic rows
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
	                        <div class="form-group col-md-1 col-sm-12">
							${showLabel ? '<label><b>UOM</b></label>' : ''}
	                            <input type="text" id="uom_${index}" value="${item.uom_name}" class="form-control form-control-sm" disabled>
	                        </div>
	                        <div class="form-group col-md-1 col-sm-12">
							${showLabel ? '<label><b>Quantity</b></label>' : ''}
	                            <input type="number" id="qty_${index}" value="${item.quantities}" class="form-control form-control-sm text-right" disabled>
	                        </div>
	                        <div class="form-group col-md-1 col-sm-12">
							${showLabel ? '<label><b>Kg</b></label>' : ''}
	                            <input type="number" id="kg_${index}" value="${item.kgs}" class="form-control form-control-sm text-right" disabled>
	                        </div>
	                        <div class="form-group col-md-1 col-sm-12">
							${showLabel ? '<label><b>Unit Price</b></label>' : ''}
	                            <input type="number" id="unit_price_${index}" value="${item.unit_price}" class="form-control form-control-sm text-right" disabled>
	                        </div>
	                        <div class="form-group col-md-1 col-sm-12">
							${showLabel ? '<label><b>Total</b></label>' : ''}
	                            <input type="number" id="total_${index}" value="${item.total}" class="form-control form-control-sm text-right" disabled>
	                        </div>
	                        <div class="form-group col-md-2 col-sm-12">
							${showLabel ? '<label><b>Invoice Type</b></label>' : ''}
	                            <input type="text" id="intype_${index}" value="${item.scrap_name_type_id}" class="form-control form-control-sm" disabled>
	                        </div>
	                        
	                        </div>
	                `;
	                
	                container.appendChild(div); // Append the new dynamic row
					// 🔹 After loop, show the grand total in a textbox
							   const grandTotalBox = document.getElementById("grandTotalscrap");
							   if (grandTotalBox) {
							       grandTotalBox.value = grandTotal.toFixed(2); // 2 decimals
								   netAmountupscrap.value = grandTotal.toFixed(2);
							   }
	             });
	        } else {
	            console.warn("No QsPacking data found.");
	        }
	    } catch (error) {
	        console.error("Error fetching QsPacking data:", error);
	    }
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
							        const selectElement = document.getElementById("inbusunitscrap");

							        // Clear existing options
							        selectElement.innerHTML = `<option value="">Select Business Unit</option>`;

							        // Populate dropdown options using SalesOrderTypeDetails array
							        json.Data.forEach((type) => {
							            if (type.business_unit_id && type.business_unit_name) { // Ensure both values exist
							                const option = document.createElement("option");
							                option.value = type.business_unit_id; // Backend keeps saleorder_id
							                option.textContent = type.business_unit_name; // Display saleorder_typename
							                selectElement.appendChild(option);
							            }
							        });
							    } catch (error) {
							        console.error("Error fetching sale order types:", error);
							    }
		        }
				async function fetchinvoiceto() {
							    try {
							        
							        // Construct the API URL properly
							        const url = new URL(`/jssl/invoiceConsigneeAddress/getInvoiceAddress`, baseUrl);
							      //  url.searchParams.append("factory_id", factoryId);

							        // Fetch data from API
									const response = await fetch(url,{
													           method: "GET",
													           credentials: "include"   // ✅ Always send JSESSIONID cookie
													       });
							        if (!response.ok) throw new Error("Failed to fetch sale order types");

							        const json = await response.json();

							        // Check if the API response has valid data
							        if (json.status !== "yes" || !json.InvoiceAddress.length) {
							            console.warn("No sale order types found.");
							            return;
							        }

							        // Get the select element
							        const selectElement = document.getElementById("inintoscrap");

							        // Clear existing options
							        selectElement.innerHTML = `<option value="">Select invoice to</option>`;

							        // Populate dropdown options using SalesOrderTypeDetails array
							        json.InvoiceAddress.forEach((type) => {
							            if (type.id && type.address && type.is_verified == 1) { // Ensure both values exist
							                const option = document.createElement("option");
							                option.value = type.id; // Backend keeps saleorder_id
							                option.textContent = type.address; // Display saleorder_typename
							                selectElement.appendChild(option);
							            }
							        });
							    } catch (error) {
							        console.error("Error fetching sale order types:", error);
							    }
				}
				async function fetchconname() {
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
							        const selectElement = document.getElementById("billingscrap");

							        // Clear existing options
							        selectElement.innerHTML = `<option value="">Select</option>`;

							        // Populate dropdown options using SalesOrderTypeDetails array
							        json.ConsigneeAddress.forEach((type) => {
							            if (type.id && type.address && type.is_verified == 1) { // Ensure both values exist
							                const option = document.createElement("option");
							                option.value = type.id; // Backend keeps saleorder_id
							                option.textContent = type.address; // Display saleorder_typename
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
						        const selectElement = document.getElementById("shipmodescrap");

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
								        const selectElement = document.getElementById("deliveryscrap");

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
							        const selectElement = document.getElementById("bankscrap");

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
							        const selectElement = document.getElementById("workscrap");

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
							    } catch (error) {
							        console.error("Error fetching sale order types:", error);
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
																           credentials: "include"   // âœ… Always send JSESSIONID cookie
																       });
										        if (!response.ok) throw new Error("Failed to fetch sale order types");

										        const json = await response.json();

										        // Check if the API response has valid data
										        if (json.status !== "yes" || !json.Data.length) {
										            console.warn("No sale order types found.");
										            return;
										        }

										        // Get the select element
										        const selectElement = document.getElementById("officescrap");

										        // Clear existing options
										        selectElement.innerHTML = `<option value="">Select</option>`;

										        // Populate dropdown options using SalesOrderTypeDetails array
										        json.Data.forEach((type) => {
										            if (type.org_id && type.org_name) { // Ensure both values exist
										                const option = document.createElement("option");
										                option.value = type.org_id; // Backend keeps saleorder_id
										                option.textContent = type.org_name; // Display saleorder_typename
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
													        const selectElement = document.getElementById("officeservicescrap");

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
												        const selectElement = document.getElementById("officehsnscrap");

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
												        const selectElement = document.getElementById("extitlescrap");

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
						
						document.getElementById("exptscrap").addEventListener("change", function () {
								const expo = document.getElementById("exptscrap");
								const selectedexpo = expo.value;
							if (selectedexpo === 'yes') {
							             $('#exportFieldsscrap').show();
							         } else {
							             $('#exportFieldsscrap').hide();
							         }
									 });	
									 
												
									 async function fetchBgType1() {
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
									 	         const selectElement = document.getElementById("bgscrap");

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


document.addEventListener("DOMContentLoaded", function () {
    const selectedFactoryId = sessionStorage.getItem("selectedFactoryId"); // Get factory_id from sessionStorage
    if (selectedFactoryId) {
        fetchinvoice(selectedFactoryId);
        fetchBgType();
        fetchUserList111(selectedFactoryId);
        fetchinvoiceEdit(selectedFactoryId);
        fetchBgTypeedit();
    } else {
        console.error("No factory ID found in sessionStorage.");
    }
});

document.addEventListener("DOMContentLoaded", function () {
	fetchtaxadd1v();
	fetchtaxadd2v();
	fetchtaxadd3v();
	});
	function fetchtaxadd1v() {
	    fetchTaxData1("tax1addVerifyscrap", "tax11Verifyscrap", "tax1valueVerifyscrap");
		fetchTaxData1("tax1addVerifiedscrap", "tax11Verifiedscrap", "tax1valueVerifiedscrap");
	}

	function fetchtaxadd2v() {
	    fetchTaxData1("tax2addVerifyscrap", "tax12Verifyscrap", "tax2valueVerifyscrap");
		fetchTaxData1("tax2addVerifiedscrap", "tax12Verifiedscrap", "tax2valueVerifiedscrap");
	}

	function fetchtaxadd3v() {
	    fetchTaxData1("tax3addVerifyscrap", "tax13Verifyscrap", "tax3valueVerifyscrap");
		fetchTaxData1("tax3addVerifiedscrap", "tax13Verifiedscrap", "tax3valueVerifiedscrap");
	}

	async function fetchTaxData1(selectId) {
		    try {
		        const url = new URL(`/jssl/taxmasters/list`, baseUrl);
				const response = await fetch(url,{
								           method: "GET",
								           credentials: "include"   // ✅ Always send JSESSIONID cookie
								       });
		        if (!response.ok) throw new Error("Failed to fetch tax data");

		        const json = await response.json();
		        if (json.status !== "yes" || !json.Data?.length) {
		            console.warn("No tax data found.");
		            return;
		        }

		        const selectElement = document.getElementById(selectId);
		        selectElement.innerHTML = `<option value="">Select tax</option>`;

		        const taxMap = {};
		        json.Data.forEach(({ tax_id, tax_name, tax_per }) => {
		            if (tax_id && tax_name) {
		                taxMap[tax_id] = tax_per;
		                const option = document.createElement("option");
		                option.value = tax_id;
		                option.textContent = tax_name;
		                selectElement.appendChild(option);
		            }
		        });
				    } catch (error) {
				        console.error("Error fetching tax data:", error);
				    }
				}
/*
async function fetchUserList111(selectedFactoryId) {
	try {
        
        // Construct the API URL
        const url = new URL(`/jssl/invoice/dbtcrdlistnew`, baseUrl);
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
                    <th>Note type</th>
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
            let releaseIcon ='';
            //let printIconView = '';
            let printIcon = ''; // Print Icon
			let cancelIcon = '';

            if (item.status === 'CANCELLED') {

									  editinvoice = `<td><i class="fa fa-edit text-muted"></i></td>`;
									  editIcon    = `<td><i class="fa fa-pen text-muted"></i></td>`;
								      releaseIcon = `<td><i class="fa fa-box-open text-muted"></i></td>`;
								      cancelIcon  = `<td><i class="fa fa-times-circle text-muted"></i></td>`;

												     //✅ Print allowed 
									   printIcon = `
									     <td>
										    <i class="fa fa-print" style="color: green; cursor: pointer;"
									     onclick="printRecord('${item.id}')">
								      </i>
							    </td>
							    `;

						 //🟢 VERIFIED 
				} else if (item.status === 'VERIFIED') {
	            editinvoice = `<td><i class="fa fa-edit text-muted"></i></td>`;
                editIcon = `<td><i class="fa fa-pen text-muted"></i></td>`; // Disabled (greyed out)
                //viewIcon = `<td><i class="fa fa-eye" style="color: green;" onclick="editRecord11('${item.id}')"></i></td>`; // Enabled
                printIcon = `<td><i class="fa fa-print" style="color: green;" onclick="printRecord('${item.id}','${item.con_id}')"></i></td>`; // Enabled
                releaseIcon = `<td><i class="fa fa-box-open" style="color: brown;" onclick="openModal('${item.id}', '${item.dc_pn_id}', '${item.con_id}')"></i></td>`;
				cancelIcon = ` <td>  <i class="fa fa-times-circle"style="color: red; cursor: pointer;" onclick="openModalcancel('${item.id}','${item.dc_pn_id}')"> </i>  </td> `;
                //printIconView = `<td><i class="fa fa-eye" style="color: red;" onclick="printRecordView('${item.id}')"></i></td>`; // Enabled
            } else if (item.status === 'NOT VERIFIED') {
	            editinvoice = `<td><i class="fa fa-edit" style="color: blue;" onclick="editRecordInvoice('${item.id}','${item.con_id}','${item.note_type}')"></i></td>`; // Enabled
                editIcon = `<td><i class="fa fa-pen" style="color: blue;" onclick="editRecord('${item.id}','${item.con_id}','${item.note_type}')"></i></td>`; // Enabled
                //viewIcon = `<td><i class="fa fa-eye text-muted"></i></td>`; // Disabled (greyed out)
                printIcon = `<td><i class="fa fa-print text-muted"></i></td>`; // Disabled (greyed out)
                //printIconView = `<td><i class="fa fa-eye"></i></td>`;
                releaseIcon = `<td><i class="fa fa-box-open text-muted"></i></td>`;
				cancelIcon = `<td><i class="fa fa-times-circle text-muted"></i></td>`;
            } else {
	            editinvoice = `<td><i class="fa fa-edit text-muted"></i></td>`;
                editIcon = `<td><i class="fa fa-pen text-muted"></i></td>`;
                //viewIcon = `<td><i class="fa fa-eye text-muted"></i></td>`;
                printIcon = `<td><i class="fa fa-print text-muted"></i></td>`;
                releaseIcon = `<td><i class="fa fa-box-open text-muted"></i></td>`;
				cancelIcon = `<td><i class="fa fa-times-circle text-muted"></i></td>`;
                //printIconView = `<td><i class="fa fa-eye"></i></td>`;
            }
            tableContent += `
                <tr>
                    <td>${item.contract_name}</td>
					<td>${item.note_type}</td>
					<td>${item.load_id}</td>
                    <td>${item.invoice_number}</td>
                    <td>${formatDate(item.created_onlydate)}</td>  <!-- Formatted Date -->
                    <td>${item.status}</td>
                    <td style="display:none;">${item.id}</td>
                    ${editinvoice}
                    ${editIcon}
                    <td><i class="fa fa-eye" style="color: green;" onclick="editRecord11('${item.id}','${item.con_id}')"></i></td>
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








function fetchUserList111(selectedFactoryId) {

   

    // 🔥 Destroy existing DataTable
    if ($.fn.DataTable.isDataTable('#tableID')) {
        $('#tableID').DataTable().clear().destroy();
    }

    // ✅ Server-side DataTable
    $('#tableID').DataTable({
        processing: false,
        serverSide: true,
        scrollX: true,
        searching: true,
        dom: 'Bfrtip',
        pageLength: 10,
        buttons: [
            {
                text: 'Export to Excel',
                action: function () {

                    // ✅ Fetch ALL records for export
                    const url = new URL(`/jssl/invoice/dbtcrdlistnewpaged`, baseUrl);
                    url.searchParams.append('factory_id', selectedFactoryId);
                    url.searchParams.append('page', 0);
                    url.searchParams.append('size', 99999);

                    fetch(url, { credentials: "include" })
                        .then(response => response.json())
                        .then(json => {

                            const formatDate = (dateStr) => {
                                if (!dateStr) return '';
                                const dateObj = new Date(dateStr);
                                if (isNaN(dateObj)) return dateStr;
                                return dateObj.toLocaleDateString("en-GB").replace(/\//g, '-');
                            };

                            const exportData = json.Data.map(item => [
                                item.contract_name  || '',
                                item.note_type      || '',
                                item.load_id        || '',
                                item.invoice_number || '',
                                formatDate(item.created_onlydate),
                                item.status         || ''
                            ]);

                            let tempTable = $('<table>').append(
                                $('<thead>').append(
                                    $('<tr>').append(
                                        '<th>Contract Name</th>',
                                        '<th>Note Type</th>',
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

                            $(tempTable).DataTable({
                                buttons: [{
                                    extend: 'excelHtml5',
                                    title: 'Debit Credit Invoice List'
                                }]
                            }).button(0).trigger();

                            setTimeout(() => {
                                $(tempTable).DataTable().destroy();
                                $(tempTable).remove();
                            }, 1000);
                        })
                        .catch(error => console.error('Export error:', error));
                }
            }
        ],
        columns: [
            { title: "Contract Name"   },
            { title: "Note Type"       },
            { title: "Lot Number"      },
            { title: "Invoice Number"  },
            { title: "Invoice Date"    },
            { title: "Status"          },
            { title: "pnid", visible: false },   // col 6 - hidden
            { title: "Edit Invoice",   orderable: false },
            { title: "Verify",         orderable: false },
            { title: "View",           orderable: false },
            { title: "Release",        orderable: false },
            { title: "Cancel",         orderable: false },
            { title: "Print",          orderable: false }
        ],
        ajax: function (data, callback, settings) {

            const page = data.start / data.length;
            const size = data.length;
			const searchValue = data.search.value;

            const formatDate = (dateStr) => {
                if (!dateStr) return '';
                const dateObj = new Date(dateStr);
                if (isNaN(dateObj)) return dateStr;
                return dateObj.toLocaleDateString("en-GB").replace(/\//g, '-');
            };

            const url = new URL(`/jssl/invoice/dbtcrdlistnewpaged`, baseUrl);
            url.searchParams.append('factory_id', selectedFactoryId);
            url.searchParams.append('page', page);
            url.searchParams.append('size', size);
			url.searchParams.append('search', searchValue);

            fetch(url, { credentials: "include" })
                .then(response => response.json())
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

                    const rows = json.Data.map(item => {

                        let editinvoice = '';
                        let editIcon    = '';
                        let releaseIcon = '';
                        let cancelIcon  = '';
                        let printIcon   = '';
						let viewIcon   = '';

                        if (item.status === 'CANCELLED') {
							editinvoice = `<td><i class="fa fa-edit text-muted"></i></td>`;
														  editIcon    = `<td><i class="fa fa-pen text-muted"></i></td>`;
													      releaseIcon = `<td><i class="fa fa-box-open text-muted"></i></td>`;
													      cancelIcon  = `<td><i class="fa fa-times-circle text-muted"></i></td>`;

																	  
														   printIcon = `
														     <td>
															    <i class="fa fa-print" style="color: green; cursor: pointer;"
														     onclick="printRecord('${item.id}','${item.con_id}')">
													      </i>
												    </td>
												    `;
												          viewIcon =`<i class="fa fa-eye" style="color:green;" onclick="editRecord11('${item.id}','${item.con_id}')"></i>`;

                        } else if (item.status === 'VERIFIED') {
							editinvoice = `<td><i class="fa fa-edit text-muted"></i></td>`;
							                editIcon = `<td><i class="fa fa-pen text-muted"></i></td>`; // Disabled (greyed out)
							                //viewIcon = `<td><i class="fa fa-eye" style="color: green;" onclick="editRecord11('${item.id}')"></i></td>`; // Enabled
							                printIcon = `<td><i class="fa fa-print" style="color: green;" onclick="printRecord('${item.id}','${item.con_id}')"></i></td>`; // Enabled
							                releaseIcon = `<td><i class="fa fa-box-open" style="color: brown;" onclick="openModal('${item.id}', '${item.dc_pn_id}', '${item.con_id}','${item.note_type}')"></i></td>`;
											cancelIcon = ` <td>  <i class="fa fa-times-circle"style="color: red; cursor: pointer;" onclick="openModalcancel('${item.id}','${item.dc_pn_id}','${item.con_id}','${item.note_type}')"> </i>  </td> `;
							                //printIconView = `<td><i class="fa fa-eye" style="color: red;" onclick="printRecordView('${item.id}')"></i></td>`; // Enabled
											viewIcon =`<i class="fa fa-eye" style="color:green;" onclick="editRecord11('${item.id}','${item.con_id}')"></i>`;

                        } else if (item.status === 'NOT VERIFIED') {
							editinvoice = `<td><i class="fa fa-edit" style="color: blue;" onclick="editRecordInvoice('${item.id}','${item.con_id}','${item.note_type}')"></i></td>`; // Enabled
							               editIcon = `<td><i class="fa fa-pen" style="color: blue;" onclick="editRecord('${item.id}','${item.con_id}','${item.note_type}')"></i></td>`; // Enabled
							               //viewIcon = `<td><i class="fa fa-eye text-muted"></i></td>`; // Disabled (greyed out)
							               printIcon = `<td><i class="fa fa-print text-muted"></i></td>`; // Disabled (greyed out)
							               //printIconView = `<td><i class="fa fa-eye"></i></td>`;
							               releaseIcon = `<td><i class="fa fa-box-open text-muted"></i></td>`;
										cancelIcon = `<td><i class="fa fa-times-circle text-muted"></i></td>`;
										viewIcon = `<td><i class="fa fa-eye text-muted"></i></td>`;

                        } else {
							editinvoice = `<td><i class="fa fa-edit text-muted"></i></td>`;
							               editIcon = `<td><i class="fa fa-pen text-muted"></i></td>`;
							               //viewIcon = `<td><i class="fa fa-eye text-muted"></i></td>`;
							               printIcon = `<td><i class="fa fa-print text-muted"></i></td>`;
							               releaseIcon = `<td><i class="fa fa-box-open text-muted"></i></td>`;
										cancelIcon = `<td><i class="fa fa-times-circle text-muted"></i></td>`;
							               //printIconView = `<td><i class="fa fa-eye"></i></td>`;
										   viewIcon = `<td><i class="fa fa-eye text-muted"></i></td>`;
                        }

                        return [
                            item.contract_name  || '',                // col 0
                            item.note_type      || '',                // col 1
                            item.load_id        || '',                // col 2
                            item.invoice_number || '',                // col 3
                            formatDate(item.created_onlydate),        // col 4
                            item.status         || '',                // col 5
                            item.id             || '',                // col 6 - hidden
                            editinvoice,                              // col 7
                            editIcon,                                 // col 8
                            viewIcon,                                 // col 9
                            releaseIcon,                              // col 10
                            cancelIcon,                               // col 11
                            printIcon                                 // col 12
                        ];
                    });

                    callback({
                        draw: data.draw,
                        recordsTotal: json.totalItems,
                        recordsFiltered: json.totalItems,
                        data: rows
                    });
                })
                .catch(error => {
                    console.error('Error fetching invoice data:', error);
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



async function fetchinvoice(factoryId) {
    try {
        
        // Construct the API URL properly
        const url = new URL(`/jssl/master/listinvoicetyperemarksnew`, baseUrl);
     
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

async function fetchinvoiceEdit(factoryId) {
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
	const selectedcontract = document.getElementById("cont");
	     const selectedContractorId = selectedcontract.value; // Get selected contractor ID  
	   
		if(selectedContractorId!="Scrap"){
/*    var username = document.getElementById('intype444').value.trim();*/
    var prodes = document.getElementById('prodes').value.trim();
    var remark = document.getElementById('remark').value.trim();
	var servicecode = document.getElementById('officeservice').value.trim();
	var hsncode = document.getElementById('officehsn').value.trim();
    var showError = false; // Initialize showError variable

    // Username Validation
/*    if (username === '') {
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
	
	if (servicecode === '' && hsncode === '') {
	   document.getElementById('servicecodedcError4').innerText = "Please enter service/HSN code.";
	   document.getElementById('servicecodedcError4').style.display = "inline-block";
	        showError = true;
	    } else {
	   document.getElementById('servicecodedcError4').innerText = "";
	   document.getElementById('servicecodedcError4').style.display = "none";
	    }
   
   // If no errors, proceed
    if (!showError) {
        $('#exampleModalCenter66').modal('show'); // Show the next modal (Ensure this modal exists)
    }
}
else{
			
							var bussunit = document.getElementById('inbusunitscrap').value.trim();
							var invoiceto = document.getElementById('inintoscrap').value.trim();
							var shipmode = document.getElementById('shipmodescrap').value.trim();
							var workorder = document.getElementById('workscrap').value.trim();
							var expo = document.getElementById('exptscrap').value.trim();
							var taxres = document.getElementById('taxresscrap').value.trim();
							var percen = document.getElementById('percenscrap').value.trim();
							var consignee = document.getElementById('billingscrap').value.trim();
							var bank = document.getElementById('bankscrap').value.trim();
							var deliv = document.getElementById('deliveryscrap').value.trim();
							var regoffice = document.getElementById('officescrap').value.trim();
							var sercode = document.getElementById('officeservicescrap').value.trim();
							var hsncode = document.getElementById('officehsnscrap').value.trim();
							var prodes = document.getElementById('prodesscrap').value.trim();
							var prodesc = document.getElementById('prodescscrap').value.trim();
							var remark = document.getElementById('remarkscrap').value.trim();

							var showError = false; // Initialize showError variable

							// Helper function
							function validateField(value, errorId, message) {
							    if (value === '') {
							        document.getElementById(errorId).innerText = message;
							        document.getElementById(errorId).style.display = "inline-block";
							        showError = true;
							    } else {
							        document.getElementById(errorId).innerText = "";
							        document.getElementById(errorId).style.display = "none";
							    }
							}

							// Validation rules
						/*	validateField(username, "Vehicleerror", "Please select invoice type.");*/
							validateField(bussunit, "inbusunitscrapError", "Please select business unit.");
							validateField(invoiceto, "inintoscrapError", "Please select invoice to.");
							validateField(shipmode, "shipmodescrapError", "Please select shipment mode.");
							validateField(workorder, "workscrapError", "Please select work order.");
							validateField(expo, "exptscrapError", "Please select export option.");
							validateField(taxres, "taxresscrapError", "Please select tax reverse charge option.");
							validateField(percen, "percenscrapError", "Please enter percentage.");
							validateField(consignee, "billingscrapError", "Please select consignee.");
							validateField(bank, "bankscrapError", "Please select bank.");
							validateField(deliv, "deliveryscrapError", "Please select delivery condition.");
							validateField(regoffice, "officescrapError", "Please select registered office.");
							//validateField(sercode, "officeservicescrapError", "Please select service code.");
							//validateField(hsncode, "officehsnscrapError", "Please select HSN code.");
							validateField(prodesc, "prodescscrapError", "Please enter product description.");
							validateField(remark, "productCodeError4", "Please enter remarks.");

							// Extra check (prodes - since you had it separately)
							validateField(prodes, "productCodeError3", "Please enter product description.");

							// If no errors, proceed
							if (!showError) {
							    $('#exampleModalCenter66').modal('show'); // Show the next modal
							}
	}
}
   
// Fetch selectedFactoryId from sessionStorage
const selectedFactoryId = sessionStorage.getItem('selectedFactoryId');
console.log('selectedFactoryId:', selectedFactoryId);

function addevent() {
	$('#exampleModalCenter66').modal('hide');
	const selectedcontract = document.getElementById("cont");
		     const selectedContractorId = selectedcontract.value; // Get selected contractor ID
		   
			if(selectedContractorId!="Scrap"){
    // Validate role code and role description
    const selectedCOnt = document.getElementById("cont").selectedOptions[0]; // Get the selected option
/*	const selectedinvoicetype = document.getElementById("intype444").selectedOptions[0];*/
	const selecetednotetype = document.getElementById("invoice_type").selectedOptions[0];
	const selectedload_id = document.getElementById("load").selectedOptions[0];
/*	const invoice_type = selectedinvoicetype ? selectedinvoicetype.value : '';*/
	const notetype = selecetednotetype ?selecetednotetype.textContent  : '';
	const load_id = selectedload_id? selectedload_id.value : '';
    const contid = selectedCOnt ? selectedCOnt.value : ''; // Get the contract_id
    const contname = selectedCOnt ? selectedCOnt.textContent : ''; // Get the contract_name
    
    $.ajax({
   /*     url: new URL('/jssl/steelDebitCredit/addSteelDebitCreditInvoice', baseUrl),*/
  		 url: new URL('/jssl/steelDebitCredit/addSteelDebitCreditInvoice',baseUrl),
        type: 'POST',
        dataType: 'json',
		xhrFields: {
				    withCredentials: true
				},
				data: jQuery.param({
				    invoice_type_id: "1",
				    con_id: contid,
				    contract_id: contid,   // <-- ADD THIS: same value, matches controller's contract_id param
				    note_type: notetype,
				    created_by: createdById,
				    load_id: load_id,
				    grand_total: ingrandv.value,
				    product_desc: prodes.value,
				    remarks: remark.value,
				    contract_name: contname,
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
				    factory_id: selectedFactoryId,

				    // ---- Contract Details modal fields ----
				    business_unit_id: document.getElementById("inbusunit").value,
				    invoice_type_calculation: document.getElementById("intypecal").value,
				    invoice_to_id: document.getElementById("ininto").value,
				    product_desc_id: document.getElementById("prodesc").value,
				    shipment_mode_id: document.getElementById("shipmode").value,
				    work_id: document.getElementById("work").value,
				    export: document.getElementById("expt").value,
				    tax_ex_inc: document.getElementById("taxres").value,
				    percentage_value: document.getElementById("percen").value,
				    consignee_id: document.getElementById("billing").value,
				    bank_details_id: document.getElementById("bank").value,
				    delivery_condition_id: document.getElementById("delivery").value,
				    regd_office_id: document.getElementById("office").value,
					s_code: document.getElementById("officeservice").value,
					h_code: document.getElementById("officehsn").value
				}),
        success: function (data) {
            var result = data.message;

            if (result === "Success") {
                const popup = $('<div class="popup"> Invoice Created Successfully!</div>')
                    .appendTo('body').hide().fadeIn(400);

                setTimeout(function () {
                    popup.fadeOut(400, function () {
                        $(this).remove();
                        window.location = 'DebitCreditInvoiceEntry.jsp';
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
else{
	const selecetednotetype = document.getElementById("invoice_type").selectedOptions[0];
	const notetype = selecetednotetype ?selecetednotetype.textContent  : '';
	const selectedloadid = document.getElementById("load").selectedOptions[0]; // Get the selected option
					  
					     const loadname = selectedloadid ? selectedloadid.textContent : ''; // Get the contract_name
	 $.ajax({
	/*     url: new URL('/jssl/steelDebitCredit/addSteelDebitCreditInvoice', baseUrl),*/
		 url: new URL('/jssl/steelDebitCredit/addSteelDebitCreditInvoicescrap',baseUrl),
	     type: 'POST',
	     dataType: 'json',
		xhrFields: {
				    withCredentials: true
				},
	     data: jQuery.param({
			invoice_type_id: "1",
	         con_id: "Scrap",
			note_type: notetype,
	         created_by: createdById,
	         load_id: loadname,
			grand_total:grandTotalupscrap.value,
	         product_desc: prodesscrap.value,
	         remarks: remarkscrap.value,
			contract_name: "Scrap",
	         date_of_notification: datescrap.value,
	         date_val: date1scrap.value,
	         bg_type: bgscrap.value,
	         date_of_issue: dissuescrap.value,
	         reference_no: refscrap.value,
	         lc_number: lcscrap.value,
	         supply_place: supscrap.value,
	         s_t_exempted: exescrap.value,
	         lr_docketno: dockscrap.value,
	         bg_no: bgnoscrap.value,
	         date_of_expiry: dateexpscrap.value,
	         date_of_ref: daterefscrap.value,
	         lc_issue_date: lcdatescrap.value,
			 export: exptscrap.value,
			 tax1: tax1addupscrap.value,
			 tax1_per: tax11upscrap.value,
			 tax1_value: tax1valueupscrap.value,
			 tax2: tax2addupscrap.value,
			 tax2_per: tax12upscrap.value,
			 tax2_value: tax2valueupscrap.value,
			 tax3: tax3addupscrap.value,
			 tax3_per: tax13upscrap.value,
			 tax3_value: tax3valueupscrap.value,
			 total_tax: totalTaxupscrap.value,
			 net_amount: netAmountupscrap.value,
			 business_unit_id: inbusunitscrap.value,
			 invoice_to_id: inintoscrap.value,
			 ship_mode_id: shipmodescrap.value,
			 workorder_id: workscrap.value,
			 area_number: arescrap.value,
			 lot_number: lutscrap.value,
			 container_name: connumscrap.value,
			 epcg_license: epogscrap.value,
			 export_title_text_id: extitlescrap.value,
			 tax_onpayable_rev: taxresscrap.value,
			 percentage: percenscrap.value,
			 consignee_id: billingscrap.value,
			 bank_id: bankscrap.value,
			 deliverycondition_id: deliveryscrap.value,
			 registered_office_id: officescrap.value,
			 servicecode_id: officeservicescrap.value,
			 hsncode_id: officehsnscrap.value,
			 prod_desc: prodescscrap.value,
		/*	 con_slno: id11conscrap.value,*/
	         factory_id: selectedFactoryId,
	     }),
	     success: function (data) {
	         var result = data.message;

	         if (result === "Success") {
	             const popup = $('<div class="popup"> Invoice Created Successfully!</div>')
	                 .appendTo('body').hide().fadeIn(400);

	             setTimeout(function () {
	                 popup.fadeOut(400, function () {
	                     $(this).remove();
	                     window.location = 'DebitCreditInvoiceEntry.jsp';
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
}

// Function to safely set values in input fields
function setInputValue(selector, value) {
    $(selector).val(value ? value : ""); // Set value or empty string if undefined/null
}

async function fetchBusinessUnitList() {
    try {
        const url = new URL(`/jssl/contract/listbusinessunitnew`, baseUrl);
        const response = await fetch(url, { method: "GET", credentials: "include" });
        const json = await response.json();
        businessUnitList = (json.status === "yes" && json.Data) ? json.Data : [];
    } catch (error) {
        console.error("Error fetching business unit list:", error);
    }
}

async function fetchInvoiceAddressList() {
    try {
        const url = new URL(`/jssl/invoiceConsigneeAddress/getInvoiceAddress`, baseUrl);
        const response = await fetch(url, { method: "GET", credentials: "include" });
        const json = await response.json();
        invoiceAddressList = (json.status === "yes" && json.InvoiceAddress) ? json.InvoiceAddress : [];
    } catch (error) {
        console.error("Error fetching invoice address list:", error);
    }
}

async function fetchWorkOrderList() {
    try {
        const url = new URL(`/jssl/contract/listworkordernew`, baseUrl);
        const response = await fetch(url, { method: "GET", credentials: "include" });
        const json = await response.json();
        workOrderList = (json.status === "yes" && json.Data) ? json.Data : [];
    } catch (error) {
        console.error("Error fetching work order list:", error);
    }
}

async function fetchConsigneeAddressList() {
    try {
        const url = new URL(`/jssl/invoiceConsigneeAddress/getConsigneeAddressNew`, baseUrl);
        const response = await fetch(url, { method: "GET", credentials: "include" });
        const json = await response.json();
        consigneeAddressList = (json.status === "yes" && json.ConsigneeAddress) ? json.ConsigneeAddress : [];
    } catch (error) {
        console.error("Error fetching consignee address list:", error);
    }
}

async function fetchServiceCodeList() {
    try {
        const url = new URL(`/jssl/master/listservicecodemasternew`, baseUrl);
        const response = await fetch(url, { method: "GET", credentials: "include" });
        const json = await response.json();
        servicecodelist = (json.status === "yes" && json.Data) ? json.Data : [];
    } catch (error) {
        console.error("Error fetching service code list:", error);
    }
}

async function fetchHsnCodeList() {
    try {
        const url = new URL(`/jssl/master/listHsncodemasternew`, baseUrl);
        const response = await fetch(url, { method: "GET", credentials: "include" });
        const json = await response.json();
        hsncodelist = (json.status === "yes" && json.Data) ? json.Data : [];
    } catch (error) {
        console.error("Error fetching HSN code list:", error);
    }
}

async function editRecord(id,con_id,note_type) {
	 // const allowed = window.allowedActions || [];

	if (!allowed.includes("Verify")) {
	  alert(" You do not have permission to Verify.");
	  return;
	}

	const conId=con_id
	sessionStorage.setItem("selectednote_type",note_type)
/*	const conId = sessionStorage.getItem("selectedConId");*/
	sessionStorage.setItem("selectedConId",con_id)
	if(conId!="Scrap"){
    try {
        const url = new URL(`/jssl/invoicedbtcrd/searchidnew`, baseUrl);
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
		
		// ---- Resolve Contract Details display text from InvoiceContractMaster, fallback to ContData ----
		const ContractMasterData = json.InvoiceContractMaster || {};

		const matchedBU = businessUnitList.find(b => String(b.business_unit_id) === String(ContractMasterData.bid));
		const buDisplay = matchedBU
		    ? `${matchedBU.business_unit_name} ${matchedBU.orgName},${matchedBU.location},${matchedBU.stateName}(${matchedBU.gst_number})`
		   : (ContData.length > 0 ? ContData[0].business_unit_name : "");

		const matchedInvoiceTo = invoiceAddressList.find(a => String(a.id) === String(ContractMasterData.invoice_to_id));
		const invoiceToDisplay = matchedInvoiceTo
		   ? matchedInvoiceTo.address
		   : (ContData.length > 0 ? ContData[0].invoice_to_id_value : "");

		const matchedWork = workOrderList.find(w => String(w.work_id) === String(ContractMasterData.work_id));
		const workDisplay = matchedWork
		    ? matchedWork.workorder_no
		   : (ContData.length > 0 ? ContData[0].work_id_value : "");

		const matchedConsignee = consigneeAddressList.find(c => String(c.id) === String(ContractMasterData.consignee_id));
		const consigneeDisplay = matchedConsignee
		    ? matchedConsignee.address
		    : (ContData.length > 0 ? ContData[0].consignee_id_value : "");
			
		const matchedService = servicecodelist.find(s => String(s.servicecode_id) === String(ContractMasterData.s_code));
		const serviceDisplay = matchedService ? matchedService.service_code : (ContData.length > 0 ? ContData[0].s_code_value : "");

		const matchedHsn = hsncodelist.find(h => String(h.servicecode_id) === String(ContractMasterData.h_code));
		const hsnDisplay = matchedHsn ? matchedHsn.service_code : (ContData.length > 0 ? ContData[0].h_code_value : "");

		setInputValue("#bunitv",     buDisplay);
		setInputValue("#intov",      invoiceToDisplay);
		setInputValue("#workorderv", workDisplay);
		setInputValue("#nandconv",   consigneeDisplay);
		setInputValue("#newscode2", serviceDisplay);
		setInputValue("#newhcode2", hsnDisplay);
		        // ---- END Contract Details resolution ----

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
        setInputValue("#pnverifyww", packingData.length > 0 ? packingData[0].dc_pn_id : "");
		setInputValue("#contract11vv", packingData.length > 0 ? packingData[0].dcPn_no : "");
		

        // Set grand total value
        setInputValue("#grandv", GrandValue.length > 0 ? GrandValue[0].Grand_Total_tax : "");

        // Set contractor data fields
        const contractorFields = {
            //"#bunitv": "business_unit_name",
            "#intypev": "invoice_type_calculation",
            //"#intov": "invoice_to_id_value",
            "#prodesv": "product_desc_id",
            "#shipmodev": "shipment_mode_id_value",
            //"#workorderv": "work_id_value",
            "#exptv": "export",
            "#taxresv": "tax_payable",
            "#percenv": "percentage_value",
            //"#nandconv": "consignee_id_value",
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
            //"#newscode2": "s_code_value",
            //"#newhcode2": "h_code_value",
            
        };
        
        const TaxFields = {
	        "#bvaue": "basic_value",
	        "#pdptv": "optd",
	        "#pdptcv": "optc_dp",
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
        packingData.forEach((item,index) => {
			const showLabel = index === 0;
            $(".dynamic-row11").append(`
                <div class="row align-items-center mb-1">
                    <div class="col-auto">
					${showLabel ? '<label class="small-label">UOM</label>' : ''}
                        <input type="text" class="form-control form-control-sm small-input" value="${item.uom_name}" readonly>
                    </div>
                    <div class="col-auto">
					${showLabel ? '<label class="small-label">Quantity</label>' : ''}
                        <input type="text" class="form-control form-control-sm small-input text-right" value="${item.quantities}" readonly>
                    </div>
                    <div class="col-auto">
					${showLabel ? '<label class="small-label">Kg</label>' : ''}
                        <input type="text" class="form-control form-control-sm small-input text-right" value="${item.kgs}" readonly>
                    </div>
                    <div class="col-auto">
					${showLabel ? '<label class="small-label">Unit Price</label>' : ''}
                        <input type="text" class="form-control form-control-sm small-input text-right" value="${item.unit_price}" readonly>
                    </div>
                    <!-- <div class="col-auto">
					${showLabel ? '<label class="small-label">pices</label>' : ''}
                        <input type="text" class="form-control form-control-sm small-input" value="${item.pice}" readonly>
                    </div> -->
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
                    <!-- <div class="col-auto"><label class="small-label">Service Code</label>
                        <input type="text" class="form-control form-control-sm small-input" value="${item.scode}" readonly>
                    </div>
                    <div class="col-auto"><label class="small-label">HSN Code</label>
                        <input type="text" class="form-control form-control-sm small-input" value="${item.hcode}" readonly>
                    </div> -->
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
else
{
	console.log(" verify record with ID:", id);
	    try {
	        const url = new URL(`/jssl/invoice/searchdbtcrdsidnewscrap`, baseUrl);
	        url.searchParams.append('id', id);

			const response = await fetch(url,{
							           method: "GET",
							           credentials: "include"   // ✅ Always send JSESSIONID cookie
							       });
	        if (!response.ok) throw new Error("Failed to fetch data");
	        const json = await response.json();

	        const packingData = json.QsPacking_Data || [];
	     
	        const invoiceData = json.Invoice_Data[0] || {};
	    
	       
	          $(".dynamic-row11 ").empty(); // Clear previous content

	        // Set values in form fields
	        setInputValue("#remarkvscrap", invoiceData.remarks);
	        setInputValue("#datevscrap", invoiceData.date_of_notification);
	        setInputValue("#date1vscrap", invoiceData.date_val);
	        setInputValue("#dissuevscrap", invoiceData.date_of_issue);
	        setInputValue("#refvscrap", invoiceData.reference_no);
	        setInputValue("#lcvscrap", invoiceData.lc_number);
	        setInputValue("#supvscrap", invoiceData.supply_place);
	        setInputValue("#exevscrap", invoiceData.s_t_exempted);
	        setInputValue("#dockvscrap", invoiceData.lr_docketno);
	        setInputValue("#bgnovscrap", invoiceData.bg_no);
	        setInputValue("#dateexpvscrap", invoiceData.date_of_expiry);
	        setInputValue("#daterefvscrap", invoiceData.date_of_ref);
	        setInputValue("#lcdatevscrap", invoiceData.lc_issue_date);
	        setInputValue("#prodesv11scrap", invoiceData.product_desc);
	        setInputValue("#bgvaerifscrap", invoiceData.bgDescription);
	        setInputValue("#vidverifyscrap", invoiceData.id);
			setInputValue("#vcontract11upscrapv", invoiceData.load_id);
	        // Set "freight" value
	/*        setInputValue("#vfreight11", packingData.length > 0 ? packingData[0].freight : "");
	        setInputValue("#pnverifyww", packingData.length > 0 ? packingData[0].pn_id : "");*/

	        // Set grand total value
	     /*   setInputValue("#grandv", GrandValue.length > 0 ? GrandValue[0].Grand_Total_tax : "");*/
			
			// Set "freight" value
			setInputValue("#vfreight11scrap", packingData.length > 0 ? packingData[0].freight : "");
			setInputValue("#bvauescrap", packingData.length > 0 ? packingData[0].totalpnAmount : "");
			setInputValue("#netAmountVerifyscrap", packingData.length > 0 ? packingData[0].totalpnAmount : "");
			setInputValue("#pnverifywwscrap", packingData.length > 0 ? packingData[0].dcPnId : "");

	        // Set contractor data fields
			    const contractorFields = {
	/*					 "#bunitvv": "business_unit_name",
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
					     "#newhcode1": "h_code_value",*/
			        "#bunitvscrap": "business_unit_name",
			        "#intypevupscrap": "invoice_type_calculation",
			        "#intovscrap": "invoice_to_id_value",
			        "#prodesvscrap": "prod_desc",
			        "#shipmodevscrap": "shipment_mode_id_value",
			        "#workordervscrap": "work_id_value",
			        "#exptvscrap": "export",
			        "#taxresvscrap": "tax_onpayable_rev",
			        "#percenvscrap": "percentage",
			        "#nandconvscrap": "consignee_id_value",
			        "#banknamevscrap": "bank_details_id_value",
			        "#deliveryconvscrap": "delivery_condition_id_value",
			        "#officevvscrap": "reg_office_id_value",
			        "#vingrandvscrap": "tax_ex_inc",
			        "#advFscrap": "freight_advance_recovery",
			        "#arevscrap": "area_no",
			        "#lutvscrap": "lot_no",
			        "#connumvscrap": "containter_no",
			        "#epogvscrap": "epcgno",
			        "#exptitlevscrap": "export_title",
			        "#newscode2scrap": "s_code_value",
			        "#newhcode2scrap": "h_code_value",
					"#totalTaxVerifyscrap": "total_tax",
					'#tax1addVerifyscrap': "tax1",
					'#tax11Verifyscrap': "tax1_per",
					'#tax1valueVerifyscrap': "tax1_value",
					'#tax2addVerifyscrap': "tax2",
					'#tax12Verifyscrap': "tax2_per",
					'#tax2valueVerifyscrap': "tax2_value",
					'#tax3addVerifyscrap': "tax3",
					'#tax13Verifyscrap': "tax3_per",
					'#tax3valueVerifyscrap': "tax3_value",
					'#grandTotalVerifyscrap':"grand_total"

			    };
	        
	/*        const TaxFields = {
		        "#bvaue": "basic_value",
		        "#pdptv": "optd",
		        "#pdptcv": "optc",
		        "#advA": "taxable",
		        "#advan": "non_taxable"
		      };*/

			  Object.keys(contractorFields).forEach(selector => {
			      setInputValue(selector, invoiceData[contractorFields[selector]] || "");
			  });
	        
	 /*       Object.keys(TaxFields).forEach(selector => {
	            setInputValue(selector, taxData.length > 0 ? taxData[0][TaxFields[selector]] : "");
	        });
	*/
	        // Show/hide export field based on "export" value
	        $('#exportFields1scrapverify').toggle(invoiceData.length > 0 && invoiceData[0].export === 'yes');

	        // Append packing data
	        packingData.forEach((item,index) => {
				const showLabel = index === 0;
				   $(".dynamic-row11").append(`
				        <div class="row align-items-center mb-1">
				            <div class="col-auto">
							${showLabel ? '<label><b>UOM</b></label>' : ''}
				                <input type="text" class="form-control form-control-sm small-input" value="${item.uom_name}" readonly>
				            </div>
				            <div class="col-auto">
							<label class="small-label">Quantity</label>
				                <input type="text" class="form-control form-control-sm small-input text-right" value="${item.quantities}" readonly>
				            </div>
				            <div class="col-auto">
							${showLabel ? '<label class="small-label">Kg</label>' : ''}
				                <input type="text" class="form-control form-control-sm small-input text-right" value="${item.kgs}" readonly>
				            </div>
				            <div class="col-auto">
							${showLabel ? '<label class="small-label">Unit Price</label>' : ''}
				                <input type="text" class="form-control form-control-sm small-input text-right" value="${item.unitPrice}" readonly>
				            </div>
				            <!--  <div class="col-auto">
							${showLabel ? '<label class="small-label">pices</label>' : ''}
				                <input type="text" class="form-control form-control-sm small-input" value="${item.pice}" readonly>
				            </div> -->
				            <div class="col-auto">
							${showLabel ? '<label class="small-label">Total</label>' : ''}
				                <input type="text" class="form-control form-control-sm small-input text-right" value="${item.total}" readonly>
				            </div>
				            <div class="col-auto">
							${showLabel ? '<label class="small-label">Invoice Type</label>' : ''}
				                <input type="text" class="form-control form-control-sm small-input" value="${item.scrapNameTypeId}" readonly>
				            </div>
				          <!--   <div class="col-auto">
						  <label class="small-label">Service Code</label>
				                <input type="text" class="form-control form-control-sm small-input" value="${item.scode}" readonly>
				            </div>
				            <div class="col-auto">
							<label class="small-label">HSN Code</label>
				                <input type="text" class="form-control form-control-sm small-input" value="${item.hcode}" readonly>
				            </div> -->
				        </div>
				      
				    `);
				});

				var selectedTaxId1= document.getElementById('tax11Verifyscrap').value.trim();
										var selectedTaxId2= document.getElementById('tax12Verifyscrap').value.trim();
										var selectedTaxId3= document.getElementById('tax13Verifyscrap').value.trim();
												        
												            const totalAmount = parseFloat(document.getElementById("netAmountVerifyscrap").value) || 0;
												            const taxValue1 = ((selectedTaxId1 / 100) * totalAmount).toFixed(2);
															const taxValue2 = ((selectedTaxId2 / 100) * totalAmount).toFixed(2);
															const taxValue3 = ((selectedTaxId3 / 100) * totalAmount).toFixed(2);
															const totaltax = (parseFloat(taxValue1) || 0) + (parseFloat(taxValue2) || 0) + (parseFloat(taxValue3) || 0);

												         
												            document.getElementById('tax1valueVerifyscrap').value = taxValue1;
															document.getElementById('tax2valueVerifyscrap').value = taxValue2;
															document.getElementById('tax3valueVerifyscrap').value = taxValue3;
															document.getElementById('totalTaxVerifyscrap').value = totaltax.toFixed(2);
															document.getElementById('grandTotalVerifyscrap').value = totalAmount + totaltax
	        // Show the modal
	        $("#exampleModalScrollablescrapVerify").modal("show");

	    } catch (error) {
	        console.error('Error fetching invoice data:', error);
	   }
}
}


async function editRecord11(id,con_id) {
	//const allowed = window.allowedActions || [];

	if (!allowed.includes("view")) {
	  alert(" You do not have permission to view.");
	    $("#exampleModalScrollableVerified").modal("hide");
	  return;
	}
	const conId = con_id
	if(conId!="Scrap"){
    try {
	    const url = new URL(`/jssl/invoicedbtcrd/searchidnew`, baseUrl);
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
		
		// ---- NEW: resolve Contract Details display text from InvoiceContractMaster, fallback to ContData ----
		const ContractMasterData = json.InvoiceContractMaster || {};

		const matchedBU = businessUnitList.find(b => String(b.business_unit_id) === String(ContractMasterData.bid));
		const buDisplay = matchedBU
		          ? `${matchedBU.business_unit_name} ${matchedBU.orgName},${matchedBU.location},${matchedBU.stateName}(${matchedBU.gst_number})`
		          : (ContData.length > 0 ? ContData[0].business_unit_name : "");

		const matchedInvoiceTo = invoiceAddressList.find(a => String(a.id) === String(ContractMasterData.invoice_to_id));
		const invoiceToDisplay = matchedInvoiceTo
		          ? matchedInvoiceTo.address
		          : (ContData.length > 0 ? ContData[0].invoice_to_id_value : "");

		const matchedWork = workOrderList.find(w => String(w.work_id) === String(ContractMasterData.work_id));
		const workDisplay = matchedWork
		          ? matchedWork.workorder_no
		          : (ContData.length > 0 ? ContData[0].work_id_value : "");

		const matchedConsignee = consigneeAddressList.find(c => String(c.id) === String(ContractMasterData.consignee_id));
		const consigneeDisplay = matchedConsignee
		          ? matchedConsignee.address
		          : (ContData.length > 0 ? ContData[0].consignee_id_value : "");
				  
		const matchedService = servicecodelist.find(s => String(s.servicecode_id) === String(ContractMasterData.s_code));
		const serviceDisplay = matchedService ? matchedService.service_code : (ContData.length > 0 ? ContData[0].s_code_value : "");

		const matchedHsn = hsncodelist.find(h => String(h.servicecode_id) === String(ContractMasterData.h_code));
		const hsnDisplay = matchedHsn ? matchedHsn.service_code : (ContData.length > 0 ? ContData[0].h_code_value : "");

		setInputValue("#bunitvv",     buDisplay);
		setInputValue("#intovv",      invoiceToDisplay);
		setInputValue("#workordervv", workDisplay);
		setInputValue("#nandconvv",   consigneeDisplay);
		setInputValue("#newscode1", serviceDisplay);
		setInputValue("#newhcode1", hsnDisplay);
		      // ---- END NEW ----

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
		setInputValue("#vcontract11vv", packingData.length > 0 ? packingData[0].dcPn_no : "");

        // Set grand total value
        setInputValue("#grandvv", GrandValue.length > 0 ? GrandValue[0].Grand_Total_tax : "");

        // Set contractor data fields
        const contractorFields = {
            //"#bunitvv": "business_unit_name",
            "#intypevv": "invoice_type_calculation",
            //"#intovv": "invoice_to_id_value",
            "#prodesvv": "product_desc_id",
            "#shipmodevv": "shipment_mode_id_value",
            //"#workordervv": "work_id_value",
            "#exptvv": "export",
            "#taxresvv": "tax_payable",
            "#percenvv": "percentage_value",
            //"#nandconvv": "consignee_id_value",
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
            //"#newscode1": "s_code_value",
            //"#newhcode1": "h_code_value",
        };
        
        const TaxFields = {
	        "#bvauev": "basic_value",
	        "#pdptvv": "optd",
	        "#pdptcvv": "optc_dp",
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
        packingData.forEach((item,index) => {
			const showLabel = index === 0;
            $(".dynamic-row11test").append(`
                <div class="row align-items-center mb-1">
                    <div class="col-auto">
					${showLabel ? '<label class="small-label">UOM</label>' : ''}
                        <input type="text" class="form-control form-control-sm small-input" value="${item.uom_name}" readonly>
                    </div>
                    <div class="col-auto">
					${showLabel ? '<label class="small-label">Quantity</label>' : ''}
                        <input type="text" class="form-control form-control-sm small-input text-right" value="${item.quantities}" readonly>
                    </div>
                    <div class="col-auto">
					${showLabel ? '<label class="small-label">Kg</label>' : ''}
                        <input type="text" class="form-control form-control-sm small-input text-right" value="${item.kgs}" readonly>
                    </div>
                    <div class="col-auto">
					${showLabel ? '<label class="small-label">Unit Price</label>' : ''}
                        <input type="text" class="form-control form-control-sm small-input text-right" value="${item.unit_price}" readonly>
                    </div>
                    <!-- <div class="col-auto">
					${showLabel ? '<label class="small-label">pices</label>' : ''}
                        <input type="text" class="form-control form-control-sm small-input" value="${item.pice}" readonly>
                    </div> -->
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
                   <!--  <div class="col-auto"><label class="small-label">Service Code</label>
                        <input type="text" class="form-control form-control-sm small-input" value="${item.scode}" readonly>
                    </div>
                    <div class="col-auto"><label class="small-label">HSN Code</label>
                        <input type="text" class="form-control form-control-sm small-input" value="${item.hcode}" readonly>
                    </div> -->
                </div>
               
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
		    const url = new URL(`/jssl/invoice/searchdbtcrdsidnewscrap`, baseUrl);
	        url.searchParams.append('id', id);

			const response = await fetch(url,{
							           method: "GET",
							           credentials: "include"   // ✅ Always send JSESSIONID cookie
							       });
	        if (!response.ok) throw new Error("Failed to fetch data");
	        const json = await response.json();

	        const packingData = json.QsPacking_Data || [];
	      /*  const taxData = json.tax || [];*/
	        const invoiceData = json.Invoice_Data[0] || {};
	  
	    

	        $(".dynamic-row11test ").empty(); // Clear previous content

	        // Set values in form fields
	        setInputValue("#remarkvvtestscrap", invoiceData.remarks);
	        setInputValue("#datevvscrap", invoiceData.date_of_notification);
	        setInputValue("#date1vvscrap", invoiceData.date_val);
	        setInputValue("#dissuevvscrap", invoiceData.date_of_issue);
	        setInputValue("#refvvscrap", invoiceData.reference_no);
	        setInputValue("#lcvvscrap", invoiceData.lc_number);
	        setInputValue("#supvvscrap", invoiceData.supply_place);
	        setInputValue("#exevvscrap", invoiceData.s_t_exempted);
	        setInputValue("#dockvvscrap", invoiceData.lr_docketno);
	        setInputValue("#bgnovvscrap", invoiceData.bg_no);
	        setInputValue("#dateexpvvscrap", invoiceData.date_of_expiry);
	        setInputValue("#daterefvvscrap", invoiceData.date_of_ref);
	        setInputValue("#lcdatevvscrap", invoiceData.lc_issue_date);
	        setInputValue("#prodesv11vscrap", invoiceData.product_desc);
	        setInputValue("#bgvaerifyvscrap", invoiceData.bgDescription);
	        setInputValue("#remarkvvvtestscrap", invoiceData.gst_remarks);
	        setInputValue("#vidverifyvscrap", invoiceData.id);
			setInputValue("#vcontract11upvv", invoiceData.load_id);


	        // Set "freight" value
	        setInputValue("#vfreight11vscrap", packingData.length > 0 ? packingData[0].freight : "");
			setInputValue("#bvauevscrap", packingData.length > 0 ? packingData[0].totalpnAmount : "");
			setInputValue("#netAmountVerifiedscrap", packingData.length > 0 ? packingData[0].totalpnAmount : "");
	        setInputValue("#pnverifywwvscrap", packingData.length > 0 ? packingData[0].dcPnId : "");

	        // Set grand total value
	   /*     setInputValue("#grandvv", GrandValue.length > 0 ? GrandValue[0].Grand_Total_tax : "");*/

	        // Set contractor data fields
	        const contractorFields = {
				
					"#bunitvvscrap": "business_unit_name",
					//'#intypevvscrap': "invoice_remarks_id",
				    "#intypevupscrap": "invoice_type_calculation",
				    "#intovvscrap": "invoice_to_id_value",
				    //"#prodesvvscrap": "prod_desc",
				    "#shipmodevvscrap": "shipment_mode_id_value",
				    "#workordervvscrap": "work_id_value",
				    "#exptvvscrap": "export",
				    "#taxresvvscrap": "tax_onpayable_rev",
				    "#percenvvscrap": "percentage",
				    "#nandconvvscrap": "consignee_id_value",
				    "#banknamevvscrap": "bank_details_id_value",
				    "#deliveryconvvscrap": "delivery_condition_id_value",
				    "#officevvvscrap": "reg_office_id_value",
				    "#vingrandvvscrap": "tax_ex_inc",
				    "#advFvscrap": "freight_advance_recovery",
				    "#arevvscrap": "area_no",
				    "#lutvvscrap": "lot_no",
				    "#connumvvscrap": "containter_no",
				    "#epogvvscrap": "epcgno",
				    "#exptitlevvscrap": "export_title",
				    "#newscode1scrap": "s_code_value",
				    "#newhcode1scrap": "h_code_value",
					"#totalTaxVerifiedscrap": "total_tax",
					'#tax1addVerifiedscrap': "tax1",
					'#tax11Verifiedscrap': "tax1_per",
					'#tax1valueVerifiedscrap': "tax1_value",
					'#tax2addVerifiedscrap': "tax2",
					'#tax12Verifiedscrap': "tax2_per",
					'#tax2valueVerifiedscrap': "tax2_value",
					'#tax3addVerifiedscrap': "tax3",
					'#tax13Verifiedscrap': "tax3_per",
					'#tax3valueVerifiedscrap': "tax3_value",
					'#grandTotalVerifiedscrap': "grand_total",
	        };
	        
	  /*      const TaxFields = {
		        "#bvauev": "basic_value",
		        "#pdptvv": "optd",
		        "#pdptcvv": "optc",
		        "#advAv": "taxable",
		        "#advanv": "non_taxable"
		      };
	*/
	Object.keys(contractorFields).forEach(selector => {
	    setInputValue(selector, invoiceData[contractorFields[selector]] || "");
	});
	        
	        // Show/hide export field based on "export" value
	        $('#exportFields1verifiedscrap').toggle(invoiceData.length > 0 && invoiceData[0].export === 'yes');

	        // Append packing data
	        packingData.forEach((item) => {
	            $(".dynamic-row11test").append(`
					        <div class="row align-items-center mb-1">
					            <div class="col-auto"><label class="small-label">UOM</label>
					                <input type="text" class="form-control form-control-sm small-input" value="${item.uom_name}" readonly>
					            </div>
					            <div class="col-auto"><label class="small-label">Quantity</label>
					                <input type="text" class="form-control form-control-sm small-input text-right" value="${item.quantities}" readonly>
					            </div>
					            <div class="col-auto"><label class="small-label">Kg</label>
					                <input type="text" class="form-control form-control-sm small-input text-right" value="${item.kgs}" readonly>
					            </div>
					            <div class="col-auto"><label class="small-label">Unit Price</label>
					                <input type="text" class="form-control form-control-sm small-input text-right" value="${item.unitPrice}" readonly>
					            </div>
					            <!--  <div class="col-auto"><label class="small-label">pices</label>
					                <input type="text" class="form-control form-control-sm small-input" value="${item.pice}" readonly>
					            </div> -->
					            <div class="col-auto"><label class="small-label">Total</label>
					                <input type="text" class="form-control form-control-sm small-input text-right" value="${item.total}" readonly>
					            </div>
					            <div class="col-auto"><label class="small-label">Invoice Type</label>
					                <input type="text" class="form-control form-control-sm small-input" value="${item.scrapNameTypeId}" readonly>
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
					});
					
					var selectedTaxId1= document.getElementById('tax11Verifiedscrap').value.trim();
														var selectedTaxId2= document.getElementById('tax12Verifiedscrap').value.trim();
														var selectedTaxId3= document.getElementById('tax13Verifiedscrap').value.trim();
																        
																            const totalAmount = parseFloat(document.getElementById("netAmountVerifiedscrap").value) || 0;
																            const taxValue1 = ((selectedTaxId1 / 100) * totalAmount).toFixed(2);
																			const taxValue2 = ((selectedTaxId2 / 100) * totalAmount).toFixed(2);
																			const taxValue3 = ((selectedTaxId3 / 100) * totalAmount).toFixed(2);
																			const totaltax = (parseFloat(taxValue1) || 0) + (parseFloat(taxValue2) || 0) + (parseFloat(taxValue3) || 0);

																         
																            document.getElementById('tax1valueVerifiedscrap').value = taxValue1;
																			document.getElementById('tax2valueVerifiedscrap').value = taxValue2;
																			document.getElementById('tax3valueVerifiedscrap').value = taxValue3;
																			document.getElementById('totalTaxVerifiedscrap').value = totaltax.toFixed(2);
																			document.getElementById('grandTotalVerifiedscrap').value = totalAmount + totaltax

	        // Show the modal
	        $("#exampleModalScrollableVerifiedscrap").modal("show");

	    } catch (error) {
	        console.error('Error fetching invoice data:', error);
	    }
}
}

async function fetchSalebusunitEdit(targetId, selectedId, fallbackText, verified_status) {
    try {
        const url = new URL(`/jssl/contract/listbusinessunitnew`, baseUrl);
        const response = await fetch(url, { method: "GET", credentials: "include" });
        const json = await response.json();
        if (json.status !== "yes" || !json.Data.length) return;

        const selectElement = document.getElementById(targetId);
        if (!selectElement) return;

        const records = json.Data
            .filter(t => t.business_unit_id && t.business_unit_name)
            .map(t => ({
                id: t.business_unit_id,
                label: `${t.business_unit_name}${t.location}(${t.gst_number})`
            }));

        const deduped = dedupeByLabel(records, selectedId);
        populateSelect(selectElement, deduped, selectedId, "Select Business Unit", fallbackText);

        // ✅ Make it read-only once verified
        if (verified_status === "true" || verified_status === "1" || verified_status === 1) {
            selectElement.setAttribute("disabled", "disabled");
        } else {
            selectElement.removeAttribute("disabled");
        }
    } catch (err) {
        console.error("Error fetching business units:", err);
    }
}

async function fetchinvoicetoEdit(targetId, selectedId, fallbackText) {
	try {
	        const url = new URL(`/jssl/invoiceConsigneeAddress/getInvoiceAddress`, baseUrl);
	        const response = await fetch(url, { method: "GET", credentials: "include" });
	        const json = await response.json();
	        if (json.status !== "yes" || !json.InvoiceAddress?.length) return;

	        const selectElement = document.getElementById(targetId);
	        if (!selectElement) return;

	        const records = json.InvoiceAddress
	            .filter(t => t.is_verified == 1 && t.id)
	            .map(t => ({ id: t.id, label: t.address }));

	        let matchedId = selectedId;
	        if (!records.some(r => String(r.id) === String(selectedId)) && fallbackText) {
	            const normFallback = normalizeText(fallbackText);
	            const match = records.find(r => {
	                const normLabel = normalizeText(r.label);
	                return normLabel.includes(normFallback) || normFallback.includes(normLabel);
	            });
	            if (match) matchedId = match.id;
	        }

	        const deduped = dedupeByLabel(records, matchedId);
	        populateSelect(selectElement, deduped, matchedId, "Select invoice to", matchedId ? null : fallbackText);
	    } catch (err) {
	        console.error("Error fetching invoice addresses:", err);
	    }
}

async function fetchSaleworkEdit(targetId, selectedId, fallbackText) {
	try {
	        const url = new URL(`/jssl/contract/listworkordernew`, baseUrl);
	        const response = await fetch(url, { method: "GET", credentials: "include" });
	        const json = await response.json();
	        if (json.status !== "yes" || !json.Data.length) return;

	        const selectElement = document.getElementById(targetId);
	        if (!selectElement) return;

	        const records = json.Data
	            .filter(t => t.work_id)
	            .map(t => ({ id: t.work_id, label: t.workorder_no }));

	        let matchedId = selectedId;
	        if (!records.some(r => String(r.id) === String(selectedId)) && fallbackText) {
	            const normFallback = normalizeText(fallbackText);
	            const match = records.find(r => {
	                const normLabel = normalizeText(r.label);
	                return normLabel.includes(normFallback) || normFallback.includes(normLabel);
	            });
	            if (match) matchedId = match.id;
	        }

	        const deduped = dedupeByLabel(records, matchedId);
	        populateSelect(selectElement, deduped, matchedId, "Select work order", matchedId ? null : fallbackText);
	    } catch (err) {
	        console.error("Error fetching work orders:", err);
	    }
}

async function fetchconnameEdit(targetId, selectedId, fallbackText) {
	try {
	       const url = new URL(`/jssl/invoiceConsigneeAddress/getConsigneeAddressNew`, baseUrl);
	       const response = await fetch(url, { method: "GET", credentials: "include" });
	       const json = await response.json();
	       if (json.status !== "yes" || !json.ConsigneeAddress?.length) return;

	       const selectElement = document.getElementById(targetId);
	       if (!selectElement) return;

	       const records = json.ConsigneeAddress
	           .filter(t => t.is_verified == 1 && t.id)
	           .map(t => ({ id: t.id, label: t.address }));

	       let matchedId = selectedId;
	       if (!records.some(r => String(r.id) === String(selectedId)) && fallbackText) {
	           const normFallback = normalizeText(fallbackText);
	           const match = records.find(r => {
	               const normLabel = normalizeText(r.label);
	               return normLabel.includes(normFallback) || normFallback.includes(normLabel);
	           });
	           if (match) matchedId = match.id;
	       }

	       const deduped = dedupeByLabel(records, matchedId);
	       populateSelect(selectElement, deduped, matchedId, "Select", matchedId ? null : fallbackText);
	   } catch (err) {
	       console.error("Error fetching consignee addresses:", err);
	   }
}

async function fetchservicecodeEdit(targetId, selectedId, fallbackText) {
    const url = new URL(`/jssl/master/listservicecodemasternew`, baseUrl);
    const response = await fetch(url, { method: "GET", credentials: "include" });
    const json = await response.json();
    if (json.status !== "yes" || !json.Data.length) return;

    const selectElement = document.getElementById(targetId);
    selectElement.innerHTML = `<option value="">Select Service Code</option>`;

    let matchedOption = null;

    json.Data.forEach((type) => {
        const option = document.createElement("option");
        option.value = type.servicecode_id;
        option.textContent = type.service_code;

        // Match by ID first (the reliable case).
        if (selectedId && String(type.servicecode_id) === String(selectedId)) {
            option.selected = true;
            matchedOption = option;
        }

        selectElement.appendChild(option);
    });

    // If no ID match, check whether fallbackText matches an existing
    // option's TEXT before inserting a new one — otherwise you get a
    // duplicate-looking entry (real option + synthetic option with the
    // same label but a different value).
    if (!matchedOption && fallbackText) {
        const existingByText = Array.from(selectElement.options)
            .find(opt => opt.textContent === fallbackText);

        if (existingByText) {
            existingByText.selected = true;
        } else {
            const fallbackOption = document.createElement("option");
            fallbackOption.value = fallbackText;
            fallbackOption.textContent = fallbackText;
            fallbackOption.selected = true;
            selectElement.insertBefore(fallbackOption, selectElement.firstChild.nextSibling);
        }
    }
}

async function fetchhsncodeEdit(targetId, selectedId, fallbackText) {
    const url = new URL(`/jssl/master/listHsncodemasternew`, baseUrl);
    const response = await fetch(url, { method: "GET", credentials: "include" });
    const json = await response.json();
    if (json.status !== "yes" || !json.Data.length) return;

    const selectElement = document.getElementById(targetId);
    selectElement.innerHTML = `<option value="">Select HSN Code</option>`;

    let matchedOption = null;

    json.Data.forEach((type) => {
        const option = document.createElement("option");
        option.value = type.servicecode_id;
        option.textContent = type.service_code;

        if (selectedId && String(type.servicecode_id) === String(selectedId)) {
            option.selected = true;
            matchedOption = option;
        }

        selectElement.appendChild(option);
    });

    if (!matchedOption && fallbackText) {
        const existingByText = Array.from(selectElement.options)
            .find(opt => opt.textContent === fallbackText);

        if (existingByText) {
            existingByText.selected = true;
        } else {
            const fallbackOption = document.createElement("option");
            fallbackOption.value = fallbackText;
            fallbackOption.textContent = fallbackText;
            fallbackOption.selected = true;
            selectElement.insertBefore(fallbackOption, selectElement.firstChild.nextSibling);
        }
    }
}

async function fetchSalebusunitEditscp(targetId, selectedId, fallbackText, verified_status) {
    try {
        const url = new URL(`/jssl/contract/listbusinessunitnew`, baseUrl);
        const response = await fetch(url, { method: "GET", credentials: "include" });
        const json = await response.json();
        if (json.status !== "yes" || !json.Data.length) return;

        const selectElement = document.getElementById(targetId);
        if (!selectElement) return;

        const records = json.Data
            .filter(t => t.business_unit_id && t.business_unit_name)
            .map(t => ({
                id: t.business_unit_id,
                label: `${t.business_unit_name} ${t.location} (${t.gst_number})`.trim()
            }));

        // find id matching fallbackText fuzzily, if selectedId doesn't hit directly
        let matchedId = selectedId;
        if (!records.some(r => String(r.id) === String(selectedId)) && fallbackText) {
            const normFallback = normalizeText(fallbackText);
            const match = records.find(r => {
                const normLabel = normalizeText(r.label);
                return normLabel.includes(normFallback) || normFallback.includes(normLabel);
            });
            if (match) matchedId = match.id;
        }

        const deduped = dedupeByLabel(records, matchedId);
        populateSelect(selectElement, deduped, matchedId, "Select Business Unit", matchedId ? null : fallbackText);

        if (verified_status === "true" || verified_status === "1" || verified_status === 1) {
            selectElement.setAttribute("disabled", "disabled");
        } else {
            selectElement.removeAttribute("disabled");
        }
    } catch (err) {
        console.error("Error fetching business units:", err);
    }
}

async function fetchinvoicetoEditscp(targetId, selectedId, fallbackText) {
    try {
        const url = new URL(`/jssl/invoiceConsigneeAddress/getInvoiceAddress`, baseUrl);
        const response = await fetch(url, { method: "GET", credentials: "include" });
        const json = await response.json();
        if (json.status !== "yes" || !json.InvoiceAddress?.length) return;

        const selectElement = document.getElementById(targetId);
        if (!selectElement) return;

        const records = json.InvoiceAddress
            .filter(t => t.is_verified == 1 && t.id)
            .map(t => ({ id: t.id, label: t.address }));

        let matchedId = selectedId;
        if (!records.some(r => String(r.id) === String(selectedId)) && fallbackText) {
            const normFallback = normalizeText(fallbackText);
            const match = records.find(r => {
                const normLabel = normalizeText(r.label);
                return normLabel.includes(normFallback) || normFallback.includes(normLabel);
            });
            if (match) matchedId = match.id;
        }

        const deduped = dedupeByLabel(records, matchedId);
        populateSelect(selectElement, deduped, matchedId, "Select invoice to", matchedId ? null : fallbackText);
    } catch (err) {
        console.error("Error fetching invoice addresses:", err);
    }
}

async function fetchSaleworkEditscp(targetId, selectedId, fallbackText) {
    try {
        const url = new URL(`/jssl/contract/listworkordernew`, baseUrl);
        const response = await fetch(url, { method: "GET", credentials: "include" });
        const json = await response.json();
        if (json.status !== "yes" || !json.Data.length) return;

        const selectElement = document.getElementById(targetId);
        if (!selectElement) return;

        const records = json.Data
            .filter(t => t.work_id)
            .map(t => ({ id: t.work_id, label: t.workorder_no }));

        let matchedId = selectedId;
        if (!records.some(r => String(r.id) === String(selectedId)) && fallbackText) {
            const normFallback = normalizeText(fallbackText);
            const match = records.find(r => {
                const normLabel = normalizeText(r.label);
                return normLabel.includes(normFallback) || normFallback.includes(normLabel);
            });
            if (match) matchedId = match.id;
        }

        const deduped = dedupeByLabel(records, matchedId);
        populateSelect(selectElement, deduped, matchedId, "Select work order", matchedId ? null : fallbackText);
    } catch (err) {
        console.error("Error fetching work orders:", err);
    }
}

async function fetchconnameEditscp(targetId, selectedId, fallbackText) {
    try {
        const url = new URL(`/jssl/invoiceConsigneeAddress/getConsigneeAddressNew`, baseUrl);
        const response = await fetch(url, { method: "GET", credentials: "include" });
        const json = await response.json();
        if (json.status !== "yes" || !json.ConsigneeAddress?.length) return;

        const selectElement = document.getElementById(targetId);
        if (!selectElement) return;

        const records = json.ConsigneeAddress
            .filter(t => t.is_verified == 1 && t.id)
            .map(t => ({ id: t.id, label: t.address }));

        let matchedId = selectedId;
        if (!records.some(r => String(r.id) === String(selectedId)) && fallbackText) {
            const normFallback = normalizeText(fallbackText);
            const match = records.find(r => {
                const normLabel = normalizeText(r.label);
                return normLabel.includes(normFallback) || normFallback.includes(normLabel);
            });
            if (match) matchedId = match.id;
        }

        const deduped = dedupeByLabel(records, matchedId);
        populateSelect(selectElement, deduped, matchedId, "Select", matchedId ? null : fallbackText);
    } catch (err) {
        console.error("Error fetching consignee addresses:", err);
    }
}

async function fetchservicecodeEdit(targetId, selectedId, fallbackText) {
    try {
        const url = new URL(`/jssl/master/listservicecodemasternew`, baseUrl);
        const response = await fetch(url, { method: "GET", credentials: "include" });
        const json = await response.json();
        if (json.status !== "yes" || !json.Data.length) return;

        const selectElement = document.getElementById(targetId);
        if (!selectElement) return;

        const records = json.Data
            .filter(t => t.servicecode_id)
            .map(t => ({ id: t.servicecode_id, label: t.service_code }));

        const deduped = dedupeByLabel(records, selectedId);
        populateSelect(selectElement, deduped, selectedId, "Select Service Code", fallbackText);
    } catch (err) {
        console.error("Error fetching service codes:", err);
    }
}

async function fetchhsncodeEdit(targetId, selectedId, fallbackText) {
    try {
        const url = new URL(`/jssl/master/listHsncodemasternew`, baseUrl);
        const response = await fetch(url, { method: "GET", credentials: "include" });
        const json = await response.json();
        if (json.status !== "yes" || !json.Data.length) return;

        const selectElement = document.getElementById(targetId);
        if (!selectElement) return;

        const records = json.Data
            .filter(t => t.servicecode_id)
            .map(t => ({ id: t.servicecode_id, label: t.service_code }));

        const deduped = dedupeByLabel(records, selectedId);
        populateSelect(selectElement, deduped, selectedId, "Select HSN Code", fallbackText);
    } catch (err) {
        console.error("Error fetching hsn codes:", err);
    }
}

async function editRecordInvoice(id,con_id) {
	
    sessionStorage.setItem("selectedConId", con_id);
	if(con_id!="Scrap")
		{
						  //const allowed = window.allowedActions || [];

			if (!allowed.includes("Edit")) {
			  alert(" You do not have permission to edit.");
			  return;
			}
    try {
        const url = new URL(`/jssl/invoicedbtcrd/searchidnew`, baseUrl);
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
		
		// ---- NEW: populate Contract Details from INVOICE_CONTRACT_MASTER ----
		const ContractMasterData = json.InvoiceContractMaster || {};

		setInputValue("#vconslnoupdate", ContractMasterData.con_slno || invoiceData.contract_slno || "");

		//fetchSalebusunitEdit("bunitvup", ContractMasterData.bid || (ContData.length > 0 ? ContData[0].business_unit_name : ""));
		fetchSalebusunitEdit("bunitvup",ContractMasterData.bid,ContData.length > 0 ? ContData[0].business_unit_name : "",ContData.length > 0 ? ContractMasterData.verified_status : undefined);
		document.getElementById("intypevup").value = ContractMasterData.invoice_type_calculation || "2";
		//fetchinvoicetoEdit("intovup", ContractMasterData.invoice_to_id || (ContData.length > 0 ? ContData[0].invoice_to_id_value : ""));
		fetchinvoicetoEdit("intovup",ContractMasterData.invoice_to_id,ContData.length > 0 ? ContData[0].invoice_to_id_value : "");
		document.getElementById("prodesvup").value = ContractMasterData.product_desc_id || "1";
		setInputValue("#shipmodevup", ContData.length > 0 ? ContData[0].shipment_mode_id_value : "");
		//fetchSaleworkEdit("workordervup", ContractMasterData.work_id || (ContData.length > 0 ? ContData[0].work_id_value : ""));
		fetchSaleworkEdit("workordervup",ContractMasterData.work_id,ContData.length > 0 ? ContData[0].work_id_value : "");
		setInputValue("#exptvup", ContractMasterData.export);
		document.getElementById("taxresvup").value = ContractMasterData.tax_ex_inc || "0";
		setInputValue("#percenvup", ContractMasterData.percentage_value);
		//fetchconnameEdit("nandconvup", ContractMasterData.consignee_id || (ContData.length > 0 ? ContData[0].consignee_id_value : ""));
		fetchconnameEdit("nandconvup",ContractMasterData.consignee_id,ContData.length > 0 ? ContData[0].consignee_id_value : "");
		setInputValue("#banknamevup", ContData.length > 0 ? ContData[0].bank_details_id_value : "");
		setInputValue("#deliveryconvup", ContData.length > 0 ? ContData[0].delivery_condition_id_value : "");
		setInputValue("#officevvup", ContData.length > 0 ? ContData[0].reg_office_id_value : "");
		fetchservicecodeEdit("newscode",ContractMasterData.s_code,ContData.length > 0 ? ContData[0].s_code_value : "");
		fetchhsncodeEdit("newhcode",ContractMasterData.h_code,ContData.length > 0 ? ContData[0].h_code_value : "");
		        // ---- END NEW ----

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
        setInputValue("#pnverifywwup", packingData.length > 0 ? packingData[0].dc_pn_items_id : "");
        setInputValue("#intypeeditup", packingData.length > 0 ? packingData[0].type_id : "");
		setInputValue("#vcontract11up", packingData.length > 0 ? packingData[0].dcPn_no : "");

        // Set grand total value
        setInputValue("#grandvup", GrandValue.length > 0 ? GrandValue[0].Grand_Total_tax : "");

        // Set contractor data fields
        const contractorFields = {
            "#bunitvup": "business_unit_name",
            //"#intypevup": "invoice_type_calculation",
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
            //"#newhcode": "h_code_value",
            //"#newscode": "s_code_value",
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
        
        const TaxFields = {
	        "#bvaueup": "basic_value",
	        "#pdptvup": "optd",
	        "#pdptcvup": "optc_dp",
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
        packingData.forEach((item,index) => {
			const showLabel = index === 0;   // true only for first item
            $(".dynamic-row11uptest").append(`
                <div class="row align-items-center mb-1">
                    <div class="col-auto">
					${showLabel ? '<label class="small-label">UOM</label>' : ''}
                        <input type="text" class="form-control form-control-sm small-input" value="${item.uom_name}" readonly>
                    </div>
                    <div class="col-auto">
					${showLabel ? '<label class="small-label">Quantity</label>' : ''}
                        <input type="text" class="form-control form-control-sm small-input text-right" value="${item.quantities}" readonly>
                    </div>
                    <div class="col-auto">
					${showLabel ? '<label class="small-label">Kg</label>' : ''}
                        <input type="text" class="form-control form-control-sm small-input text-right" value="${item.kgs}" readonly>
                    </div>
                    <div class="col-auto">
					${showLabel ? '<label class="small-label">Unit Price</label>' : ''}
                        <input type="text" class="form-control form-control-sm small-input text-right" value="${item.unit_price}" readonly>
                    </div>
                    <!--  <div class="col-auto">
					${showLabel ? '<label class="small-label">pices</label>' : ''}
                        <input type="text" class="form-control form-control-sm small-input" value="${item.pice}" readonly>
                    </div> -->
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
                  <!--   <div class="col-auto">
				  <label class="small-label">Service Code</label>
                        <input type="text" class="form-control form-control-sm small-input" value="${item.scode}" readonly>
                    </div>
                    <div class="col-auto">
					<label class="small-label">HSN Code</label>
                        <input type="text" class="form-control form-control-sm small-input" value="${item.hcode}" readonly>
                    </div> -->
                </div>
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
            `);
        });

        // Show the modal
        $("#exampleModalScrollableEditUp").modal("show");

    } catch (error) {
        console.error('Error fetching invoice data:', error);
    }
}
else{
	    console.log("Edit record with ID:", id);

	    try {
	        const url = new URL(`/jssl/invoice/searchdbtcrdsidnewscrap`, baseUrl);
	        url.searchParams.append('id', id);

	        const response = await fetch(url, {
	            method: "GET",
	            credentials: "include"   // ✅ Always send JSESSIONID cookie
	        });
	        if (!response.ok) throw new Error("Failed to fetch data");
	        const json = await response.json();

	        const packingData = json.QsPacking_Data || [];
	        const taxData = json.tax || [];
	        const invoiceData = json.Invoice_Data[0] || {};   
			
			fetchSalebusunitEditscp("bunitvupscrap", invoiceData.business_unit_id, invoiceData.business_unit_name, invoiceData.verified_status);
			fetchinvoicetoEditscp("intovupscrap", invoiceData.invoice_to_id, invoiceData.invoice_to_id_value);
			fetchSaleworkEditscp("workordervupscrap", invoiceData.workorder_id, invoiceData.work_id_value);
			fetchconnameEditscp("nandconvupscrap", invoiceData.consignee_id, invoiceData.consignee_id_value);
			fetchservicecodeEdit("newscodescrap", invoiceData.servicecode_id, invoiceData.s_code_value);
			fetchhsncodeEdit("newhcodescrap", invoiceData.hsncode_id, invoiceData.h_code_value);

	        // Clear previous content
	        $(".dynamic-row11uptest, .dynamic-row122up").empty();

	        // Helper to set value safely
	        const setInputValue = (selector, value) => {
	            const el = document.querySelector(selector);
	            if (el) el.value = value !== undefined && value !== null ? value : "";
	        };

	        // Set invoice-level fields
	        setInputValue("#remarkvupscrap", invoiceData.remarks);
	        setInputValue("#datescrap", invoiceData.date_of_notification);
	        setInputValue("#date1scrap", invoiceData.date_val);
	        setInputValue("#dissuescrap", invoiceData.date_of_issue);
	        setInputValue("#refscrap", invoiceData.reference_no);
	        setInputValue("#lcscrap", invoiceData.lc_number);
	        setInputValue("#supscrap", invoiceData.supply_place);
	        setInputValue("#exescrap", invoiceData.s_t_exempted);
	        setInputValue("#dockscrap", invoiceData.lr_docketno);
	        setInputValue("#bgnoscrap", invoiceData.bg_no);
	        setInputValue("#dateexpscrap", invoiceData.date_of_expiry);
	        setInputValue("#daterefscrap", invoiceData.date_of_ref);
	        setInputValue("#lcdatescrap", invoiceData.lc_issue_date);
	        setInputValue("#prodesv11upscrap", invoiceData.product_desc);
	        setInputValue("#bgscrap", invoiceData.bg_type);
	        setInputValue("#vidverifyupscrap", invoiceData.id);
			setInputValue("#vcontract11upscrap", invoiceData.load_id);

	        // Packing data values
	        setInputValue("#vfreight11upscrap", packingData.length > 0 ? packingData[0].freight : "");
			setInputValue("#bvaueupscrap", packingData.length > 0 ? packingData[0].totalpnAmount : "");
	        setInputValue("#netAmountuppscrap", packingData.length > 0 ? packingData[0].totalpnAmount : "");
	        setInputValue("#pnverifywwupscrap", packingData.length > 0 ? packingData[0].dcPnId : "");
			

	        // Contractor & tax fields mapping
	        const contractorFields = {
	            //"#bunitvupscrap": "business_unit_name",
	            "#intypevupscrap": "invoice_type_calculation",
	           // "#intovupscrap": "invoice_to_id_value",
	            "#prodesvupscrap": "prod_desc",
	            "#shipmodevupscrap": "shipment_mode_id_value",
	            //"#workordervupscrap": "work_id_value",
	            "#exptvupscrap": "export",
	            "#taxresvupscrap": "tax_onpayable_rev",
	            "#percenvupscrap": "percentage",
	            //"#nandconvupscrap": "consignee_id_value",
	            "#banknamevupscrap": "bank_details_id_value",
	            "#deliveryconvupscrap": "delivery_condition_id_value",
	            "#officevvupscrap": "reg_office_id_value",
	            "#vingrandvupscrap": "tax_ex_inc",
	            "#freightscrap": "freight_advance_recovery",
	            "#arevupscrap": "area_no",
	            "#lutvupscrap": "lot_no",
	            "#connumvupscrap": "containter_no",
	            "#epogvupscrap": "epcgno",
	            "#exptitlevupscrap": "export_title",
	            "#newhcodescrap": "h_code_value",
	            //"#newscodescrap": "s_code_value",
	            "#totalTaxuppscrap": "total_tax",
	            "#tax1adduppscrap": "tax1",
	            "#tax11uppscrap": "tax1_per",
	            "#tax1valueuppscrap": "tax1_value",
	            "#tax2adduppscrap": "tax2",
	            "#tax12uppscrap": "tax2_per",
	            "#tax2valueuppscrap": "tax2_value",
	            "#tax3adduppscrap": "tax3",
	            "#tax13uppscrap": "tax3_per",
	            "#tax3valueuppscrap": "tax3_value",
	            "#grandTotaluppscrap": "grand_total"
	        };

	        Object.keys(contractorFields).forEach(selector => {
	            setInputValue(selector, invoiceData[contractorFields[selector]] || "");
	        });

	        // Show/hide export fields
	        $('#exportFieldsscrap').toggle(invoiceData.export === 'yes');

	        // Append packing data dynamically
	        packingData.forEach((item,index) => {
				const showLabel = index === 0;
	            $(".dynamic-row11uptest").append(`
	                <div class="row align-items-center mb-1">
	                    <div class="col-auto">
						${showLabel ? '<label><b>UOM</b></label>' : ''}
	                        <input type="text" class="form-control form-control-sm small-input" value="${item.uom_name}" readonly>
	                    </div>
	                    <div class="col-auto">
						${showLabel ? '<label><b>Quantity</b></label>' : ''}
	                        <input type="text" class="form-control form-control-sm small-input text-right" value="${item.quantities}" readonly>
	                    </div>
	                    <div class="col-auto">
						${showLabel ? '<label><b>Kg</b></label>' : ''}
	                        <input type="text" class="form-control form-control-sm small-input text-right" value="${item.kgs}" readonly>
	                    </div>
	                    <div class="col-auto">
						${showLabel ? '<label><b>Unit Price</b></label>' : ''}
	                        <input type="text" class="form-control form-control-sm small-input text-right" value="${item.unitPrice}" readonly>
	                    </div>
	                    <div class="col-auto">
						${showLabel ? '<label><b>Total</b></label>' : ''}
	                        <input type="text" class="form-control form-control-sm small-input text-right" value="${item.total}" readonly>
	                    </div>
	                    <div class="col-auto">
						${showLabel ? '<label><b>Invoice Type</b></label>' : ''}
	                        <input type="text" class="form-control form-control-sm small-input" value="${item.scrapNameTypeId}" readonly>
	                    </div>
	                </div>
	            
	            `);
	        });

			var selectedTaxId1= document.getElementById('tax11uppscrap').value.trim();
									var selectedTaxId2= document.getElementById('tax12uppscrap').value.trim();
									var selectedTaxId3= document.getElementById('tax13uppscrap').value.trim();
											        
											            const totalAmount = parseFloat(document.getElementById("netAmountuppscrap").value) || 0;
											            const taxValue1 = ((selectedTaxId1 / 100) * totalAmount).toFixed(2);
														const taxValue2 = ((selectedTaxId2 / 100) * totalAmount).toFixed(2);
														const taxValue3 = ((selectedTaxId3 / 100) * totalAmount).toFixed(2);
														const totaltax = (parseFloat(taxValue1) || 0) + (parseFloat(taxValue2) || 0) + (parseFloat(taxValue3) || 0);

											         
											            document.getElementById('tax1valueuppscrap').value = taxValue1;
														document.getElementById('tax2valueuppscrap').value = taxValue2;
														document.getElementById('tax3valueuppscrap').value = taxValue3;
														document.getElementById('totalTaxuppscrap').value = totaltax.toFixed(2);
														document.getElementById('grandTotaluppscrap').value = totalAmount + totaltax
	        // Show the modal
	        $("#exampleModalScrollableEditUpscrap").modal("show");

	    } catch (error) {
	        console.error('Error fetching invoice data:', error);
	    }
		
}
}



function openModalVerify() {
	const conId = sessionStorage.getItem("selectedConId");
	if(conId!="Scrap"){
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
else
{
	var username = document.getElementById('remarkvveiscrap').value.trim();
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
}

function addeventVerify() {
	$('#exampleModalCenter66Verify').modal('hide');
	const conId = sessionStorage.getItem("selectedConId");
	const note_type = sessionStorage.getItem("selectednote_type");
	if(conId!="Scrap")
		{
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
        url: new URL('/jssl/invoicedbtcrd/verificationnew', baseUrl1),
        type: 'POST',
        dataType: 'json',
		xhrFields: {
				    withCredentials: true
				},
        data: jQuery.param({
            verified_by: createdById,
            factory_id: selectedFactoryId,
            payable_by_customer: pdptcv.value,
            payable_to_dept: pdptv.value,
            open_tax_adv: advA.value,
            open_non_tax_adv:advan.value,
            total: bvaue.value,
            recovery_amt: "",
            t_adv: "",
            adv_tax: taxAdv.join(","),
            tax_payable_by_customer:taxPbc.join(","),
            tax_payable_to_dept:taxPtd.join(","),
            id: vidverify.value,
            gst_remarks:remarkvvei.value,
            pn_id: pnverifyww.value,
            tax_id: taxIds.join(","),   // Pass as comma-separated values
            tax_per: taxPers.join(","), // Pass as comma-separated values
            tax_value: taxValues.join(","), // Pass as comma-separated values
			note_type: note_type
        }),
        success: function (data) {
            var result = data.message;

            if (result === "Success") {
                const popup = $('<div class="popup"> Invoice Verified Successfully!</div>')
                    .appendTo('body').hide().fadeIn(400);

                setTimeout(function () {
                    popup.fadeOut(400, function () {
                        $(this).remove();
                        window.location = 'DebitCreditInvoiceEntry.jsp';
                    });
                }, 800);
            } else {
                const errorMessage = data.message || 'Failed to create invoice.';
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
	else{
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

		const requestUrl = new URL('/jssl/invoicedbtcrd/dbtcrdverificationnewscrap', baseUrl);
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
		        gst_remarks: remarkvveiscrap.value,
		        pn_id: pnverifywwscrap.value,
				id: vidverifyscrap.value,
				note_type: note_type,
				grand_total:grandTotalVerifyscrap.value,
				tax1: tax1addVerifyscrap.value,
			    tax1_per: tax11Verifyscrap.value,
				tax1_value: tax1valueVerifyscrap.value,
				tax2: tax2addVerifyscrap.value,
				tax2_per: tax12Verifyscrap.value,
			    tax2_value: tax2valueVerifyscrap.value,
				tax3: tax3addVerifyscrap.value,
				tax3_per: tax13Verifyscrap.value,
				tax3_value: tax3valueVerifyscrap.value,
			    total_tax: totalTaxVerifyscrap.value,
			    net_amount: netAmountVerifyscrap.value,
		    
		    }),
		    success: function (data) {
		        if (data.message === "Success") {
		            const popup = $('<div class="popup"> Invoice Verified Successfully!</div>')
		                .appendTo('body').hide().fadeIn(400);

		            setTimeout(function () {
		                popup.fadeOut(400, function () {
		                    $(this).remove();
		                    window.location = 'DebitCreditInvoiceEntry.jsp';
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
}

function openModalUpdate() {
const conId = sessionStorage.getItem("selectedConId");
	   
		if(conId!="Scrap"){
  /*  var username = document.getElementById('intypeeditup').value.trim();*/
    var username1 = document.getElementById('prodesv11up').value.trim();
    var username12 = document.getElementById('remarkvup').value.trim();
    var showError = false; // Initialize showError variable

    // Username Validation
/*    if (username === '') {
        document.getElementById('intype').innerText = "Please select Invoice type.";
        document.getElementById('intype').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('intype').innerText = "";
        document.getElementById('intype').style.display = "none";
    }
    */
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
else{
	  var username1 = document.getElementById('prodesv11upscrap').value.trim();
	    var username12 = document.getElementById('remarkvupscrap').value.trim();
	    var showError = false; // Initialize showError variable

	    // Username Validation
	/*    if (username === '') {
	        document.getElementById('intype').innerText = "Please select Invoice type.";
	        document.getElementById('intype').style.display = "inline-block";
	        showError = true;
	    } else {
	        document.getElementById('intype').innerText = "";
	        document.getElementById('intype').style.display = "none";
	    }
	    */
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
}

function addeventudate() {
	$('#exampleModalCenter66Editup').modal('hide');
const conId = sessionStorage.getItem("selectedConId");
  var intype = document.getElementById('intypeeditup').value.trim();
		if(conId!="Scrap"){
    $.ajax({
        url: new URL('/jssl/invoicedbtcrd/updatenew', baseUrl1),
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
            invoice_type_id:intype,
			reference_no:refvup.value,
			
			// ---- Contract Details modal fields ----
			con_slno: document.getElementById("vconslnoupdate").value,
			factory_id: selectedFactoryId,
			business_unit_id: document.getElementById("bunitvup").value,
			invoice_type_calculation: document.getElementById("intypevup").value,
			invoice_to_id: document.getElementById("intovup").value,
			product_desc_id: document.getElementById("prodesvup").value,
			shipment_mode_id: document.getElementById("shipmodevup").value,
			work_id: document.getElementById("workordervup").value,
			export: document.getElementById("exptvup").value,
			tax_ex_inc: document.getElementById("taxresvup").value,
			percentage_value: document.getElementById("percenvup").value,
			consignee_id: document.getElementById("nandconvup").value,   // ✅ FIXED
			bank_details_id: document.getElementById("banknamevup").value,
			delivery_condition_id: document.getElementById("deliveryconvup").value,
			regd_office_id: document.getElementById("officevvup").value,
			s_code: document.getElementById("newscode").value,
			h_code: document.getElementById("newhcode").value,
        }),
        success: function (data) {
            var result = data.message;

            if (result === "Success") {
                const popup = $('<div class="popup"> Invoice updated Successfully!</div>')
                    .appendTo('body').hide().fadeIn(400);

                setTimeout(function () {
                    popup.fadeOut(400, function () {
                        $(this).remove();
                        window.location = 'DebitCreditInvoiceEntry.jsp';
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
else{
	$.ajax({
	       url: new URL('/jssl/scrapDebitCredit/dbtcrdupdateadvnewscrap', baseUrl1),
	       type: 'POST',
	       dataType: 'json',
		xhrFields: {
				    withCredentials: true
				},
	       data: jQuery.param({
	           modified_by: createdById,
	           product_desc: prodesv11upscrap.value,
	           remarks: remarkvupscrap.value,
	           date_of_notification: datevupscrap.value,
	           date_val: date1vupscrap.value,
	           pn_id: pnverifywwupscrap.value,
	           bg_type: bgvaerifyupscrap.value,
	           date_of_issue: dissuevupscrap.value,
	           reference_no: refvupscrap.value,
	           lc_number: lcvupscrap.value,
	           supply_place: supvupscrap.value,
	           s_t_exempted: exevupscrap.value,
	           lr_docketno: dockvupscrap.value,
	           bg_no: bgnovupscrap.value,
	           date_of_expiry: dateexpvupscrap.value,
	           date_of_ref: daterefvupscrap.value,   
	           lc_issue_date: lcdatevupscrap.value, 
	           id: vidverifyupscrap.value,
	           invoice_type_id:intypeeditupscrap.value,
			   grand_total: grandTotaluppscrap.value,
			   tax1: tax1adduppscrap.value,
			   tax1_per: tax11uppscrap.value,
			   tax1_value: tax1valueuppscrap.value,
			   tax2: tax2adduppscrap.value,
			   tax2_per: tax12uppscrap.value,
			   tax2_value: tax2valueuppscrap.value,
			   tax3: tax3adduppscrap.value,
			   tax3_per: tax13uppscrap.value,
			   tax3_value: tax3valueuppscrap.value,
			   total_tax: totalTaxuppscrap.value,
			   Business_Unit_id: document.getElementById("bunitvupscrap").value,
			   Invoice_to_id: document.getElementById("intovupscrap").value,
			   workorder_id: document.getElementById("workordervupscrap").value,
			   consignee_id: document.getElementById("nandconvupscrap").value,
			   serviceCode_id: document.getElementById("newscodescrap").value,
			   hsnCode_id: document.getElementById("newhcodescrap").value
			   
	       }),
	       success: function (data) {
	           var result = data.message;

	           if (result === "Success") {
	               const popup = $('<div class="popup"> Invoice updated Successfully!</div>')
	                   .appendTo('body').hide().fadeIn(400);

	               setTimeout(function () {
	                   popup.fadeOut(400, function () {
	                       $(this).remove();
	                       window.location = 'DebitCreditInvoiceEntry.jsp';
	                   });
	               }, 800);
	           } else {
	               const errorMessage = data.message || 'Failed to create invoice.';
	               $('#errorMessage').text(errorMessage);
	               $('#exampleModalCenterDup').modal('show');
	               $('#exampleModalCenter66Editup').modal('hide');
	               $('#exampleModalScrollableEditUpscrap').modal('hide');
	               
	           }
	       },
	       error: function () {
	           console.error('Request failed.');
	       }
	   });
}
}

function openModal(id, pn_id,con_id,note_type) {
	 // const allowed = window.allowedActions || [];

	if (!allowed.includes("Release")) {
	  alert(" You do not have permission to release.");
	  return;
	}

    // Open the modal
    $('#exampleModalCenter1').modal('show');
    // Store the id and pn_id in the modal's data attributes
    $('#exampleModalCenter1').attr('data-id', id);
    $('#exampleModalCenter1').attr('data-pn-id', pn_id);
	$('#exampleModalCenter1').attr('data-con-id', con_id); 
	$('#exampleModalCenter1').attr('data-note_type', note_type); 
}

function addeventrelease() {
	$('#exampleModalCenter1').modal('hide');
	/*const conId = sessionStorage.getItem("selectedConId");*/
	var conId = $('#exampleModalCenter1').attr('data-con-id');
	var note_type = $('#exampleModalCenter1').attr('data-note_type');
	
		   
			if(conId!="Scrap"){
    // Retrieve the id and pn_id from the modal
    var id = $('#exampleModalCenter1').attr('data-id');
    var pn_id = $('#exampleModalCenter1').attr('data-pn-id');

    // Perform release action
    $.ajax({
        url: new URL('/jssl/invoicedbtcrd/releasebyidnew', baseUrl),
        type: 'POST',
        dataType: 'json',
		xhrFields: {
				    withCredentials: true
				},
        data: jQuery.param({
            id: id, 
            factory_id: selectedFactoryId, 
            released_by: createdById, 
            pn_id: pn_id, // Pass the pn_id here
			note_type: note_type
        }),
        success: function (data) {
            var result = data.message;

            if (result === "Success") {
                const popup = $('<div class="popup"> Invoice Released Successfully!</div>')
                    .appendTo('body').hide().fadeIn(400);

                setTimeout(function () {
                    popup.fadeOut(400, function () {
                        $(this).remove();
                        window.location = 'DebitCreditInvoiceEntry.jsp';
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
else{
	
	// Retrieve the id and pn_id from the modal
	var id = $('#exampleModalCenter1').attr('data-id');
	var pn_id = $('#exampleModalCenter1').attr('data-pn-id');

	// Perform release action
	$.ajax({
	    url: new URL('/jssl/invoicedbtcrd/releasebyidnewscrap', baseUrl),
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
	            const popup = $('<div class="popup"> Invoice Released Successfully!</div>')
	                .appendTo('body').hide().fadeIn(400);

	            setTimeout(function () {
	                popup.fadeOut(400, function () {
	                    $(this).remove();
	                    window.location = 'DebitCreditInvoiceEntry.jsp';
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
}
/* async function printRecord(id,con_id) {

			if(con_id!="Scrap"){
    try {
	    const url = new URL(`/jssl/invoicedbtcrd/searchidnew?id=${id}`, baseUrl);
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
	       margin-top:20px;
		}
		.invoice-container1 {
		   width: 100vw;
		   max-width: 1200px;
		   border: 1px solid #000;
		   padding: 5px;
		   margin-top:350px;
		}
	    .invoice-container2 {
		   width: 100vw;
		   max-width: 1200px;
		   border: 1px solid #000;
		   padding: 5px;
	       margin-top:365px;
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
            <div class="gst-text">Debit Credit</div>
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
            <div class="gst-text">Debit Credit</div>
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
            <div class="gst-text">Debit Credit</div>
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
               doc.save(`Debit_credit_${invoiceno}.pdf`);
            },
            x: 6,
            y: 6,
            width: 165,
            windowWidth: 1000
         });
         

    } catch (error) {
        console.error('Error generating PDF:', error);
    }
 }
 else
 {
	  try {
		    const url = new URL(`/jssl/invoice/searchdbtcrdsidnewscrap?id=${id}`, baseUrl);
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
	         const Tax_Final_total = Invoice_Data[0].total_tax;
	         const PBC_Final_total = Invoice_Data[0].grand_total;
	         
	         const invoiceno = Invoice_Data[0].invoice_no;
	         const lr_docketno = Invoice_Data.lr_docketno;
	         const date_val = Invoice_Data.date_val;
	         //const product_desc = json.Invoice_Data?.product_desc || ''; // Fix reference
	         
	         const invoice_to_id_value = Invoice_Data[0].invoice_to_id_value;
	         const tax_payable = Invoice_Data[0].tax_onpayable_rev;
	         const area_no = Invoice_Data[0].area_no;
	         const lot_no = Invoice_Data[0].lot_no;
	         const containter_no = Invoice_Data[0].containter_no;
	         const epcgno = Invoice_Data[0].epcgno;
	         const shipment_mode_id_value = Invoice_Data[0].shipment_mode_id_value;
	         const delivery_condition_id_value = Invoice_Data[0].delivery_condition_id_value;
	         const consignee_id_value = Invoice_Data[0].consignee_id_value;
	         const work_id_value = Invoice_Data[0].work_id_value;
	         const invoiceStateName = Invoice_Data[0].invoiceStateName;
	         const consigneeStateName = Invoice_Data[0].consigneeStateName;
	         const invoiceStateCode = Invoice_Data[0].invoiceStateCode;
	         const consigneeStateCode = Invoice_Data[0].consigneeStateCode;
	         const invoiceGstNo = Invoice_Data[0].invoiceGstNo;
	         const consigneeGstNo = Invoice_Data[0].consigneeGstNo;
	         const invoicePanNo = Invoice_Data[0].invoicePanNo;
	         const consigneePanNo = Invoice_Data[0].consigneePanNo;
	         const bankName = Invoice_Data[0].bankName;
	         const account_number = Invoice_Data[0].account_number;
	         const branch_address = Invoice_Data[0].branch_address;
	         const branch_code = Invoice_Data[0].branch_code;
	         const swift_code = Invoice_Data[0].swift_code;
	         const ifsc_code = Invoice_Data[0].ifsc_code;
	         
	         const transport_name = QsPacking_Data[0].transporterName;
	         const vechile_no = QsPacking_Data[0].vechileNo;
	         const con_code_with_lot_no = Invoice_Data[0].load_id;
	         
	         const freight = QsPacking_Data[0].freight;
	         const total_pices = QsPacking_Data[0].total_pices;
	         const total_kgs = QsPacking_Data[0].total_kgs;
	         const total_qty = QsPacking_Data[0].total_qty;
	         const basic_value = tax[0].basic_value;
	         
			 const items = json.QsPacking_Data || []; 
			 const taxData = json.tax || [];
			 const InvoiceData = json.Invoice_Data || [];
			 const grandTotalData = json.Grand_Total_value?.[0] || {};
	         const grandTotalInWords = grandTotalData.GrandTotalInWords || '';
			 const grandTotalTax = Invoice_Data[0].grand_total || '';
			 const basic_value = Invoice_Data[0].grand_total || '';
			 const gstremarks = InvoiceData[0].gst_remarks || '';
			 const advremarks = taxData[0].taxable || '';
			 const advremarksnon = taxData[0].non_taxable || '';
			 const basicValue = QsPacking_Data[0].totalpnAmount || '';
			 const taxValuedept = InvoiceData[0].total_tax || '';
			 
			 const basicValuecos = taxData[0].optc || '';

	        // Generate dynamic rows based on QsPacking_Data
	        let tableRows = items.map((item, index) => `
	            <tr>
	                <td>${index + 1}</td>
	                <td>${item.scrapNameTypeId || ''}</td>
	                <td>${item.pice || ''}</td>
	                <td>${item.hcode || ''}</td>
	                <td>${item.uom_name || ''}</td>
	                <td>${item.quantities || ''}</td>
	                <td>${item.kgs || ''}</td>
	                <td>${item.unitPrice || ''}</td>
	                <td>${item.total || ''}</td>
	            </tr>
	        `).join('');
	        
	        // Generate dynamic tax rows
	        let taxRows = InvoiceData.map(tax => `
	            <tr>
	                <td colspan="7" style="border: 1px solid #000;">${tax.tax_name || ''}</td>
	                <td style="border: 1px solid #000;">${tax.tax_per || ''}</td>
	                <td style="border: 1px solid #000;">${tax.tax_value || ''}</td>
	            </tr>
	        `).join('');
	        
	        // Generate dynamic tax descriptions with tax_name and tax_value_in_words
			let taxDetails = InvoiceData.map(tax => `
			    <b>${tax.tax_name}:</b> ${tax.tax_value_in_words}<br>
			`).join('');
			
			let taxDetailsNew = InvoiceData.map(tax => `
			    <b>${tax.tax_name}</b><br>
			`).join('');
			
			let taxPerValue = InvoiceData.map(tax => `
			    <b>${tax.tax_per}</b><br>
			`).join('');
			
			let taxValue = InvoiceData.map(tax => `
			    <b>${tax.tax_value}</b><br>
			`).join('');
			
			let taxValuedept = InvoiceData.map(tax => `
			    <b>${tax.ptc}</b><br>
			`).join('');
			
			let taxValuecos = InvoiceData.map(tax => `
			    <b>${tax.ptc}</b><br>
			`).join('');
			
			let taxadvanceValue = taxData.map(tax => `
			    <b>${tax.adv_tax}</b><br>
			`).join('');

			
			let taxNames = "", taxPers = "", taxValues = "";

			let taxNameKeys = Object.keys(InvoiceData[0])
			    .filter(k => /^tax_\d+$/.test(k))
			    .sort((a, b) => parseInt(a.split("_")[1]) - parseInt(b.split("_")[1]));

			taxNameKeys.forEach(key => {
			    let num = key.split("_")[1];          // get the number, e.g., "2"
			    let name = InvoiceData[0][key];           
			    let per  = InvoiceData[0] [`tax${num}_per`];   
			    let val  = InvoiceData[0] [`tax${num}_value`]; 

			    if (name) { // only include if name exists
			        taxNames  += `<b>${name}</b><br>`;
			        taxPers   += (per != null && per != "0.00") ? `<b>${per}%</b><br>` : `<br>`;
			        taxValues += (val != null && val != "0.00") ? `<b>${val}</b><br>` : `<br>`;
			    }
			});

			console.log(taxNames, taxPers, taxValues);

			
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
	            padding: 15px;
				margin-top:16%;
	        }
	        .invoice-container1 {
	            width: 100vw;
	            max-width: 1200px;
	            border: 1px solid #000;
	            padding: 15px;
	            margin-top:40%;
	        }
	        .invoice-container2 {
	            width: 100vw;
	            max-width: 1200px;
	            border: 1px solid #000;
	            padding: 15px;
	            margin-top:42%;
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
	            <div class="gst-text">Debit Credit</div>
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
	                    <td style="border: 1px solid #000; height: 10px;"" colspan="4">
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
	            
	            </tbody>
	            <tbody>
	                <tr>
	                    <td style="border: 1px solid #000; height: 20px; width: 200px;" colspan="4">
	                        <b>Note:</b><span>Identification Marks & Serial No. of Goods: As per packing list attached</span><br>
	                   
	                     
	                    </td>
	                    <td style="border: 1px solid #000; height: 20px; width: 200px;" colspan="3">
	                        <b>TOTAL INVOICE VALUE:</b><br>
	                    </td>
						<td style="border: 1px solid #000; height: 10px;" colspan="2">
						                     <span>${grandTotalTax}</span><br> <!-- Dynamic Grand Total Tax -->
						                 </td>     
	                    <td style="border: 1px solid #000; height: 10px;" colspan="2">
	                      
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
	                    ${taxNames}
	                    </td>
	                    <td style="border: 1px solid #000; height: 20px;">
	                     ${taxPers}
	                    </td>
	                    <td style="border: 1px solid #000; height: 20px;">
	                    <span>${basicValue}</span><br>
	                     ${taxValues}
	                    </td>
						<td style="border: 1px solid #000; height: 20px;">
						                  ${taxValuedept}
						                  </td>
										  <td style="border: 1px solid #000; height: 20px;" colspan="2">
										                 <span>${basicValue}</span><br>
										                 ${taxValuedept}
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
	            <div class="gst-text">Debit Credit</div>
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
	         
	            </tbody>
	            <tbody>
	                <tr>
	                    <td style="border: 1px solid #000; height: 20px; width: 200px;" colspan="4">
	                        <b>Note:</b><span>Identification Marks & Serial No. of Goods: As per packing list attached</span><br>
	                   
	                     
	                    </td>
	                    <td style="border: 1px solid #000; height: 20px; width: 200px;" colspan="3">
	                        <b>TOTAL INVOICE VALUE:</b><br>
	                    </td>
	                    <td style="border: 1px solid #000; height: 10px;" colspan="2">
	                      
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
	                    <span>Invoice Value</span><br>
	                    </td>
	                    <td style="border: 1px solid #000; height: 20px;" colspan="3">
	                    <span>Payable to dept</span><br>
	                    </td>
	                    <td style="border: 1px solid #000; height: 20px;" colspan="3">
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
						           ${taxNames}
						           </td>
						           <td style="border: 1px solid #000; height: 20px;">
						            ${taxPers}
						           </td>
						           <td style="border: 1px solid #000; height: 20px;">
						           <span>${basicValue}</span><br>
						            ${taxValues}
						           </td>
								   <td style="border: 1px solid #000; height: 20px;" colspan="3">
								                     ${taxValuedept}
								                     </td>
													 <td style="border: 1px solid #000; height: 20px;" colspan="3">
												  <span>${basicValue}</span><br>
											    ${taxValuedept}
											    </td>
						           </tr>
						   </tbody>
	            <tbody>
	                <tr>
	                    <td style="border: 1px solid #000; height: 20px;">
	                    <span>Total</span><br>
	                    </td>
	                    <td style="border: 1px solid #000; height: 20px;">
	                    </td>	                   
	                    <td style="border: 1px solid #000; height: 20px;">
	                    </td>
	                    <td style="border: 1px solid #000; height: 20px;">
	                    <span id="grandlast1"></span><br>
	                    </td>
	                    <td style="border: 1px solid #000; height: 20px;" colspan="3">
	                    <span id="taxtotal1"></span><br>
	                    </td>
	                    <td style="border: 1px solid #000; height: 20px;" colspan="3">
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
	            <div class="gst-text">Debit Credit</div>
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
	            
	            </tbody>
	            <tbody>
	                <tr>
	                    <td style="border: 1px solid #000; height: 20px; width: 200px;" colspan="4">
	                        <b>Note:</b><span>Identification Marks & Serial No. of Goods: As per packing list attached</span><br>
	                    
	                     
	                    </td>
	                    <td style="border: 1px solid #000; height: 20px; width: 200px;" colspan="3">
	                        <b>TOTAL INVOICE VALUE:</b><br>
	                    </td>
	                    <td style="border: 1px solid #000; height: 10px;" colspan="2">
	                     
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
	                    <span>Invoice Value</span><br>
	                    </td>
	                    <td style="border: 1px solid #000; height: 20px; colspan="3">
	                    <span>Payable to dept</span><br>
	                    </td>
	                    <td style="border: 1px solid #000; height: 20px;" colspan="3">
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
						           ${taxNames}
						           </td>
						           <td style="border: 1px solid #000; height: 20px;">
						            ${taxPers}
						           </td>
						           <td style="border: 1px solid #000; height: 20px;">
						           <span>${basicValue}</span><br>
						            ${taxValues}
						           </td>
								   <td style="border: 1px solid #000; height: 20px;" colspan="3">
								                     ${taxValuedept}
								                     </td>
							 <td style="border: 1px solid #000; height: 20px;" colspan="3">
								 <span>${basicValue}</span><br>
								    ${taxValuedept}
									  </td>
						           </tr>
						   </tbody>
	            <tbody>
	                <tr>
	                    <td style="border: 1px solid #000; height: 20px;">
	                    <span>Total</span><br>
	                    </td>
	                    <td style="border: 1px solid #000; height: 20px;">
	                    </td>	                   
	                    <td style="border: 1px solid #000; height: 20px;">
	                    </td>
	                    <td style="border: 1px solid #000; height: 20px;">
	                    <span id="grandlast12"></span><br>
	                    </td>
	                    <td style="border: 1px solid #000; height: 20px;" colspan="3">
	                    <span id="taxtotal12"></span><br>
	                    </td>
	                    <td style="border: 1px solid #000; height: 20px;" colspan="3">
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
	     printElement.querySelector('#val11').textContent = basicValue;
	     printElement.querySelector('#grandlast').textContent = grandTotalTax;
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
	     printElement.querySelector('#val111').textContent = basicValue;
	     printElement.querySelector('#grandlast1').textContent = grandTotalTax;
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
	     printElement.querySelector('#val1112').textContent = basicValue;
	     printElement.querySelector('#grandlast12').textContent = grandTotalTax;
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
	               doc.save(`Debit_credit_Invoice_${invoiceno}.pdf`);
	            },
	            x: 6,
	            y: 6,
	            width: 165,
	            windowWidth: 1000
	         });
	         

	    } catch (error) {
	        console.error('Error generating PDF:', error);
	    }
	    
 }   
}*/




async function printRecord(id, con_id) {
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

    // ═══════════════════════════════════════════════════════════════════════════
    // BRANCH 1 — Non-Scrap (Debit/Credit Note)
    // ═══════════════════════════════════════════════════════════════════════════
    if (con_id != "Scrap") {

        try {
            const url = new URL(`/jssl/invoicedbtcrd/searchidnew?id=${id}`, baseUrl);
            const response = await fetch(url, { method: "GET", credentials: "include" });
            if (!response.ok) throw new Error("Failed to fetch data");

            const json = await response.json();
            const Invoice_Data    = json.Invoice_Data;
            const Contractor_Data = json.Contractor_Data;
            const QsPacking_Data  = json.QsPacking_Data;
            const tax             = json.tax;
            const Grand_Total_value = json.Grand_Total_value;
			
			// ---- NEW: resolve Invoice To / Consignee / Work Order from InvoiceContractMaster, fallback to Contractor_Data ----
			       const ContractMasterData = json.InvoiceContractMaster || {};

			       const matchedInvoiceTo = invoiceAddressList.find(a => String(a.id) === String(ContractMasterData.invoice_to_id));
			       const resolvedInvoiceTo = matchedInvoiceTo
			           ? matchedInvoiceTo.address
			           : Contractor_Data[0].invoice_to_id_value;

			       const matchedConsignee = consigneeAddressList.find(c => String(c.id) === String(ContractMasterData.consignee_id));
			       const resolvedConsignee = matchedConsignee
			           ? matchedConsignee.address
			           : Contractor_Data[0].consignee_id_value;

			       const matchedWork = workOrderList.find(w => String(w.work_id) === String(ContractMasterData.work_id));
			       const resolvedWork = matchedWork
			           ? matchedWork.workorder_no
			           : Contractor_Data[0].work_id_value;
					
					function cleanBusinessUnitAddress(name) {
					    if (!name) return '';
					    return name
					        .replace(/^JBU-\d+\s*/i, '')                                    // remove "JBU-16 "
					        .replace(/^JSW\s+Severfield\s+Structures\s+Limited\s*/i, '')    // remove company name
					        .trim();
					}

					const matchedBU = businessUnitList.find(b => String(b.business_unit_id) === String(ContractMasterData.bid));
					const resolvedbudisplay = matchedBU
					    ? `${cleanBusinessUnitAddress(matchedBU.business_unit_name)},${matchedBU.district || ''}-${matchedBU.pinNo || ''}<br>${matchedBU.location || ''}`
					    : (ContData.length > 0 ? cleanBusinessUnitAddress(ContData[0].business_unit_name) : "");
			       // ---- END NEW ----
				   // ---- NEW: resolve Service Code / HSN Code from InvoiceContractMaster, fallback to Contractor_Data ----
				           const matchedService = servicecodelist.find(s => String(s.servicecode_id) === String(ContractMasterData.s_code));
				           const serviceDisplay = matchedService
				               ? matchedService.service_code
				               : (Contractor_Data.length > 0 ? Contractor_Data[0].s_code_value : "");

				           const matchedHsn = hsncodelist.find(h => String(h.servicecode_id) === String(ContractMasterData.h_code));
				           const hsnDisplay = matchedHsn
				               ? matchedHsn.service_code
				               : (Contractor_Data.length > 0 ? Contractor_Data[0].h_code_value : "");

				           // combine — show whichever is present, "Service / HSN" if both exist
				   		const serviceHsnDisplay = [serviceDisplay, hsnDisplay]
				   		    .filter(x => x && x.toString().trim() !== "" && x.toString().trim().toLowerCase() !== "null")
				   		    .join(" / ");
				           // ---- END NEW ----

            const noteNumber = QsPacking_Data[0].dcPn_no || "";
            let gstLabel = "DEBIT NOTE";
            if (noteNumber.toUpperCase().startsWith("CRD"))      gstLabel = "CREDIT NOTE";
            else if (noteNumber.toUpperCase().startsWith("DBT")) gstLabel = "DEBIT NOTE";

            const Grand_Total_tax       = Grand_Total_value[0].Grand_Total_tax;
            const Total_adv_tax_Taxable = Grand_Total_value[0].Total_adv_tax_Taxable;
            const Tax_Final_total       = Grand_Total_value[0].Tax_Final_total;
            const PBC_Final_total       = Grand_Total_value[0].PBC_Final_total;

            const invoiceno   = Invoice_Data.invoice_no;
            const lr_docketno = Invoice_Data.lr_docketno;
            const date_val    = Invoice_Data.date_val;
            //const factory_id  = Invoice_Data.factory_id;
            const cancel      = Invoice_Data.cancel;
            const product_desc = Invoice_Data.product_desc || '';

            // ── Factory Data ──────────────────────────────────────────────────
            const url_factory      = new URL(`/jssl/factory/getAllFactoryListSS`, baseUrl);
            const response_factory = await fetch(url_factory, { method: "GET", credentials: "include" });
            if (!response_factory.ok) throw new Error("Failed to fetch factory data");
            const factory_json = await response_factory.json();

            const factory_data_map     = factory_json.FactoryDetails;
            //const FactoryDataBasedById = factory_data_map.find(f => f.id === factory_id);
            const MumbaiAddress        = factory_data_map.find(f => f.id === "4");

            const reg_addresss    = MumbaiAddress.address;
			
			// ── Business Unit Address (cleaned, trimmed, no stray commas) ──────────
			const address = Contractor_Data[0].businessUnitName
			            .split(',')
			            .slice(1)
			            .map(x => x.trim())
			            .filter(x => x !== "")
			            .join(', ');
			//const factory_Address = address;
			const bid =resolvedbudisplay;
						// ── Business Unit State Code / GSTIN / PAN (pulled from Contractor_Data) ─
			const state_Code     = Contractor_Data[0].businessStateName;
			const Gst_Code       = Contractor_Data[0].businessgstNumber;
			const Pan_Code       = Contractor_Data[0].businesspanNumber;

            // ── Contractor / Invoice Fields ───────────────────────────────────
            const invoice_to_id_value         = resolvedInvoiceTo;
            const tax_payable                 = Contractor_Data[0].tax_payable == 1 ? "No" : "Yes";
            const area_no                     = Contractor_Data[0].area_no;
            const lot_no                      = Contractor_Data[0].lot_no;
            const containter_no               = Contractor_Data[0].containter_no;
            const epcgno                      = Contractor_Data[0].epcgno;
            const shipment_mode_id_value      = Contractor_Data[0].shipment_mode_id_value;
            const delivery_condition_id_value = Contractor_Data[0].delivery_condition_id_value;
            const consignee_id_value          = resolvedConsignee;
            const work_id_value               = resolvedWork;
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
            const branch_address              = Contractor_Data[0].bank_name + '' + Contractor_Data[0].branch_address;
            const branch_code                 = Contractor_Data[0].branch_code;
            const swift_code                  = Contractor_Data[0].swift_code;
            const ifsc_code                   = Contractor_Data[0].ifsc_code;
            const work_date                   = Contractor_Data[0].work_date;

            const transport_name       = QsPacking_Data[0].transport_name;
            const vechile_no           = QsPacking_Data[0].vechile_no;
            const contractName         = QsPacking_Data[0].contract_name || '';
            const contractCode         = contractName.split(' - ')[0];
            const dcPnNo               = QsPacking_Data[0].dcPn_no || '';
			const refNo                = Invoice_Data.reference_no || '';
            const con_code_with_lot_no = `${contractCode}/${dcPnNo}/${refNo}`;

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

            //const Service_Code = `${Contractor_Data[0].s_code_value ?? ''} \\  ${Contractor_Data[0].h_code_value ?? ''}`;

            // ── Product Table Rows ────────────────────────────────────────────
            const maxRows = 9;
            let tableRows = "";

            items.forEach((item, index) => {
                tableRows += `
                    <tr class="product-row">
                        <td colspan="1" style="text-align:right;">${index + 1}</td>
                        <td colspan="4" class="desc-col descri">${item.scrap_name_type_id || ''}</td>
                         <td colspan="1" style="text-align:right !important;">${serviceHsnDisplay}</td>
                        <td colspan="1" style="text-align:left !important;">${item.uom_name || ''}</td>
                        <td colspan="1" class="qtys">${item.quantities || ''}</td>
                        <td colspan="2" class="weits">${item.kgs || ''}</td>
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
                            <td colspan="4" style="font-weight:550;">${product_desc || ''}</td>
                            <td colspan="1"></td><td colspan="1"></td><td colspan="1"></td>
                            <td colspan="2"></td><td colspan="1"></td><td colspan="2"></td>
                        </tr>`;
                } else {
                    tableRows += `
                        <tr class="empty-row">
                            <td colspan="1">&nbsp;</td>
                            <td colspan="4"></td>
                            <td colspan="1"></td><td colspan="1"></td><td colspan="1"></td>
                            <td colspan="2"></td><td colspan="1"></td><td colspan="2"></td>
                        </tr>`;
                }
            }

            // ── Tax Rows ──────────────────────────────────────────────────────
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

            // ── Tax Description Blocks ────────────────────────────────────────
            let taxDetails      = taxData.map(tax => `<b>${tax.tax_name}:</b> ${tax.tax_value_in_words}<br>`).join('');
            let taxDetailsNew   = taxData.map(tax => `<b>${tax.tax_name}</b><br>`).join('');
            let taxPerValue     = taxData.map(tax => `<b>${tax.tax_per}</b><br>`).join('');
            let taxValue        = taxData.map(tax => `<b>${formatAmount(tax.tax_value)}</b><br>`).join('');
            let taxValuedept    = taxData.map(tax => `<b>${formatAmount(tax.ptc)}</b><br>`).join('');
            let taxValuecos     = taxData.map(tax => `<b>${formatAmount(tax.ptc)}</b><br>`).join('');
            let taxadvanceValue = taxData.map(tax => `<b>${formatAmount(tax.adv_tax)}</b><br>`).join('');

            // ── Date Formatting ───────────────────────────────────────────────
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

            // ── HTML Template ─────────────────────────────────────────────────
            const htmlContent = `
                <style>
                    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');
                    * { box-sizing: border-box; }

                    .watermark {
                        position: absolute; top: 50%; left: 50%;
                        transform: translate(-50%, -50%) rotate(-45deg);
                        font-size: 120px; font-weight: bold; opacity: 0.15;
                        pointer-events: none; z-index: 9999;
                        white-space: nowrap; letter-spacing: 10px;
                    }
                    .watermark.cancelled { color: #ff0000; }
                    .watermark.verified  { color: #4CAF50; }
                    .page { position: relative; }

                    html, body {
                        margin: 0; padding: 0;
                        font-family: "Times New Roman", Times, serif;
                        color: black !important; background-color: #fff !important;
                        font-size: 10px; line-height: 2;
                    }
                    .page {
                        width: 202mm; height: 297mm; overflow: visible;
                        page-break-after: avoid !important; margin: 0; padding: 0;
                    }
                    .page:last-child { page-break-after: avoid !important; }
                    .invoice-container {
                        width: 100%; height: auto; overflow: visible;
                        -webkit-font-smoothing: antialiased;
                        text-rendering: geometricPrecision;
                        page-break-inside: avoid; margin: 0; padding: 1mm;
                    }
                    table {
                        border-collapse: collapse !important; table-layout: fixed;
                        page-break-inside: avoid; width: 100%; margin: 0; padding: 0;
                    }
                    td, th {
                        border-right: 0.5px solid #000; border-bottom: 0.5px solid #000;
                        padding: 2px 4px; vertical-align: top;
                        font-size: 10px; line-height: 1.05; word-wrap: break-word;
                    }
                    tr { page-break-inside: avoid; }
                    tr:first-child th { border-top: 0.5px solid #000; }
                    td:first-child, th:first-child { border-left: 0.5px solid #000; }
                    .company-details-table { border-top: 0.5px solid #000 !important; }
                    .header, .footer { text-align: center; margin: 0; padding: 0; }
                    .invoice-header {
                        display: flex; justify-content: space-between;
                        align-items: center; margin-bottom: 2mm;
                    }
                    .gst-text { font-size: 15px; font-weight: 500; text-align: center; margin-left: 330px !important; }
                    .copy-label { font-size: 12px; font-weight: normal; }
                    td br, th br { display: block; margin: 0; line-height: 1; }
                    .company-details-table td { padding: 4px; font-size: 11px !important; }
                    .company-logo img { width: 60px; height: auto; display: block; margin-bottom: 2px; }
                    .product-row td:nth-child(n+4) { text-align: right !important; }
                    .product-row td, .empty-row td { height: 22px; }
                    .empty-row td { border-top: none !important; border-bottom: none !important; }
                    .last-product td { border-bottom: none !important; }
                    .product-table .desc-col { line-height: 1.5 !important; white-space: normal; word-break: break-word; }
                    .product-table .fright-row .fright-data { line-height: 1.6 !important; padding: 5px !important; }
                    .total-body .total-datatd  { line-height: 1.6 !important; padding: 5px !important; }
                    .total-body .total-datatds { line-height: 2.5 !important; text-align: right !important; }
                    .desc-col.descri { font-size: 7px !important; padding: 1px !important; }
                    .desc-col.tols { text-align: right !important; }
                    .desc-col.prs  { text-align: right !important; }
                    .desc-col.weits { text-align: right !important; }
                    .desc-col.qtys  { text-align: right !important; }
                    .product-table th, .product-table td { padding: 3px 5px; line-height: 1.2; }
                    .product-row td { border-bottom: none; }
                    .freight-vlaue { text-align: right !important; }
                    .fright-row { border: 0.5px solid #000 !important; }
                    .tax-row .tax-name { line-height: 0.8 !important; text-align: right !important; padding: 5px !important; }
                    .tax-row .tax-per  { text-align: right !important; vertical-align: middle !important; }
                    .total-word .total-words-des { line-height: 1.2 !important; font-size: 8px !important; padding: 0 0 5px 5px !important; }
                    .total-words-des.ss { vertical-align: middle !important; }
                    .total-word .total-words-val { text-align: right !important; vertical-align: middle !important; }
                    .particulars-row { line-height: 1 !important; }
                    .particulars-row td { padding-top: 5px !important; }
                    .particulars-row .particulars-row-prtd { font-size: 8px !important; }
                    .particulars-row-body { padding-top: 5px !important; }
                    .particulars-row-body .particulars-row-body-td { text-align: right !important; font-size: 8px !important; }
                    .td-body-tax { text-align: right !important; line-height: 2 !important; }
                    .Bank_details { line-height: 1.8 !important; font-size: 8px !important; }
                    .last-data td { line-height: 1.5 !important; font-size: 9px !important; padding-top: 6px !important; }
                    .last-data td:last-child { text-align: center !important; vertical-align: middle !important; }
                    .last-data td:last-child span { display: block; text-align: center; }
                    .footer { padding-top: 6px !important; }
                    .footer p { font-size: 9px; line-height: 1.2; margin: 0; padding: 0; }
                    .invoice-line { display: flex; justify-content: space-between; width: 80%; }
                    .fixed-8px td { font-size: 8px !important; line-height: 1.1 !important; }
                    .terms { margin-top: 2mm; }
                    .header, .footer, .gst-text, .copy-label { text-align: center; }
                    .fulladdress, .conaddress, .facotry_address {
                        white-space: pre-line; display: inline-block; line-height: 1.5;
                    }
                    b      { font-weight: 550 !important; }
                    strong { font-weight: 550 !important; }
                </style>

                <div class="invoice-container">
                    ${cancel === 'true' ? `<div class="watermark cancelled">CANCELLED</div>` : ''}

                    <div class="invoice-header">
                        <b>   </b>
                        <div class="gst-text">${gstLabel}</div>
                        <div class="gst-text1 copy-label">Original For Recipient</div>
                    </div>

                    <table class="company-details-table">
                        <tr>
						<td colspan="6">
						   <div class="company-logo">
						    <img src="img/logo/download.png" alt="Company Logo" style="width:100px;">
						       </div>
						        <strong>JSW Serverfiled Structures Limited</strong><br>
						         <span class="bid"></span>
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
                                    <div style="font-size:12px;"><b>Invoice No: </b><span class="invoiceNumber"></span></div>
                                    <div><b>Date:</b> <span class="date"></span></div>
                                </div>
                                <br>
                                <b>Contract No Reference No:</b> <span class="contrefno"></span><br>
                                <b>Date &amp; Time of supply:</b> <span class="datetime"></span><br>
                                <br>
                                <b>Work/Purchase Order No:</b> <span class="workor"></span><br>
                                <b>Date of Order:</b> <span class="dateor"></span><br>
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
                                <b>Date of Notification</b><br>
                                <b>Exempted note under:</b><br>
                                <b>Tax is Payable on reverse charge (Yes/No):</b> <span class="taxpayre"></span><br>
                            </td>
                            <td colspan="3" style="font-size:7px;">
                                <b>Export Details:</b><br>
                                <b>ARE No:</b> <span class="areano"></span><br>
                                <b>LUT No:</b> <span class="lutno"></span><br>
                                <b>Container No:</b> <span class="contlo"></span><br>
                                <b>EPCG License No:</b> <span class="epoglo"></span><br>
                            </td>
                            <td colspan="3" style="font-size:7px;">
                                <b>Transporter:</b> <span class="trans"></span><br>
                                <b>Vehicle No:</b> <span class="vehino"></span><br>
                                <b>LR/DOCKET No:</b> <span class="lrdoc"></span><br>
                                <b>Date:</b> <span class="lrdate"></span><br>
                            </td>
                            <td colspan="3" style="font-size:7px;">
                                <b>Shipment Mode:</b> <span class="shipmo"></span><br>
                                <b>Delivery Condition:</b> <span class="delcon"></span><br>
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
                        <tbody id="product_table_data">${tableRows}</tbody>
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
                        <tbody class="tax-row">${taxRows}</tbody>
                        <tbody class="total-word">
                            <tr>
                                <td colspan="9" class="total-words-des">
                                    <b>Note:</b> <span>Identification Marks &amp; Serial No. of Goods: As per packing list attached</span><br>
                                    ${taxDetails}<br>
                                    <b>Gross total in words:</b> ${grandTotalInWords}<br>
                                </td>
                                <td colspan="2" class="total-words-des ss"><b>Total Invoice Value:</b><br></td>
                                <td colspan="2" class="total-words-val"><span>${formatAmount(grandTotalTax)}</span><br></td>
                            </tr>
                        </tbody>
                        <tbody>
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
                        <tbody>
                            <tr class="particulars-row-body">
                                <td colspan="3"><span>${gstremarks}</span><br></td>
                                <td colspan="1"><span>Basic</span><br>${taxDetailsNew}</td>
                                <td colspan="1" class="particulars-row-body-td"><br>${taxPerValue}</td>
                                <td colspan="1" class="particulars-row-body-td">
                                    <span>${formatAmount(advremarks)}</span><br>${taxadvanceValue}
                                </td>
                                <td colspan="1" class="particulars-row-body-td">
                                    <span>${formatAmount(advremarksnon)}</span><br>
                                </td>
                                <td colspan="2" class="particulars-row-body-td">
                                    <span>${formatAmount(basicValue)}</span><br>${taxValue}
                                </td>
                                <td colspan="2" class="particulars-row-body-td"><br>${taxValuedept}</td>
                                <td colspan="2" class="particulars-row-body-td">
                                    <span>${formatAmount(basicValuecos)}</span><br>${taxValuecos}
                                </td>
                            </tr>
                        </tbody>
                        <tbody>
                            <tr>
                                <td colspan="3"><span>Total</span><br></td>
                                <td colspan="1"></td><td colspan="1"></td>
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

            // ── Fill Invoice Data into DOM ─────────────────────────────────────
            function fillInvoice(container) {

                const setContent = (selector, value) => {
                    const el = container.querySelector(selector);
                    if (el) el.textContent = value || '';
                };

                // FACTORY DETAILS
				container.querySelector(".reg_add").textContent    = reg_addresss;
				container.querySelector(".gst_code").textContent   = Gst_Code;
				container.querySelector(".state_code").textContent = state_Code;
				container.querySelector(".pan_code").textContent   = Pan_Code;
				  container.querySelector('.bid').innerHTML = bid;  

                // INVOICE HEADER
                setContent('.datetime',      formattedDateTime);
                setContent('.dateor',        work_date);
                setContent('.date',          currentDate);
                setContent('.invoiceNumber', invoiceno);

                // ── INVOICE TO — split by line breaks ────────────────────────
                const invoiceToValue = invoice_to_id_value || '';
                const invoiceLines   = invoiceToValue.split(/\r?\n/);

                setContent('.shipto11',     invoiceLines[0] || '');
                setContent('.shipto11add2', invoiceLines[1] || '');
                setContent('.shipto11add3', invoiceLines[2] || '');

                const districtAndPin = [
                    Contractor_Data[0].invoiceDistrict,
                    Contractor_Data[0].invoicePinNo
                ].filter(x => x && x.toString().trim() !== "").join("-");

                const invoiceAddress = [
                    Invoice_Data.addressLine1up,
                    Invoice_Data.addressLine2up,
                    Invoice_Data.addressLine3up,
                    districtAndPin
                ].filter(x => x && x.toString().trim() !== "").join("\n");

                container.querySelector('.fulladdress').textContent = invoiceAddress;

                setContent('.placeofsupply', Invoice_Data.supply_place || '');
                setContent('.statename',     invoiceStateName  || '');
                setContent('.stcode11',      invoiceStateCode  || '');
                setContent('.ingst',         invoiceGstNo      || '');
                setContent('.panin',         invoicePanNo      || '');

                // ── CONSIGNEE — split by line breaks ─────────────────────────
                const consigneeValue = consignee_id_value || '';
                const consigneeLines = consigneeValue.split(/\r?\n/);

                setContent('.conname',  consigneeLines[0] || '');
                setContent('.conname1', consigneeLines[1] || '');
                setContent('.conname2', consigneeLines[2] || '');

                const consigneeDistrictAndPin = [
                    Contractor_Data[0].consigneeDistrict,
                    Contractor_Data[0].consigneePinNo
                ].filter(x => x && x.toString().trim() !== "").join("-");

                const consigneeAddress = [
                    Invoice_Data.conaddressLine1,
                    Invoice_Data.conaddressLine2,
                    Invoice_Data.conaddressLine3,
                    consigneeDistrictAndPin
                ].filter(x => x && x.toString().trim() !== "").join("\n");

                container.querySelector('.conaddress').textContent = consigneeAddress;

                setContent('.state',   consigneeStateName || '');
                setContent('.stateco', consigneeStateCode || '');
                setContent('.congst',  consigneeGstNo     || '');
                setContent('.pancon',  consigneePanNo     || '');

                // TRANSPORT DETAILS
                setContent('.taxpayre',  tax_payable);
                setContent('.areano',    area_no            || '');
                setContent('.contlo',    containter_no      || '');
                setContent('.lutno',     lot_no             || '');
                setContent('.epoglo',    epcgno             || '');
                setContent('.trans',     transport_name     || '');
                setContent('.lrdoc',     lr_docketno        || '');
                setContent('.lrdate',    date_val           || '');
                setContent('.shipmo',    shipment_mode_id_value      || '');
                setContent('.delcon',    delivery_condition_id_value || '');
                setContent('.workor',    work_id_value      || '');
                setContent('.vehino',    vechile_no         || '');
                setContent('.contrefno', con_code_with_lot_no || '');

                // TOTALS — all formatted with Indian commas
                setContent('.freight',        formatAmount(freight));
                setContent('.qtytotal',       total_qty || '');
                setContent('.wiegtotal',      total_kgs || '');
                setContent('.val11',          formatAmount(basic_value));
                setContent('.grandlast',      formatAmount(Grand_Total_tax));
                setContent('.grandlast12new', formatAmount(PBC_Final_total));
                setContent('.taxbasic',       formatAmount(Total_adv_tax_Taxable));
                setContent('.taxtotal',       formatAmount(Tax_Final_total));

                // BANK DETAILS
                setContent('.bankname', bankName       || '');
                setContent('.acc',      account_number || '');
                setContent('.bname',    branch_address || '');
                setContent('.code',     branch_code    || '');
                setContent('.scode',    swift_code     || '');
                setContent('.ifsc',     ifsc_code      || '');
            }

            function downloadInvoicePDF(htmlContent, fillInvoice, hideLoader) {
                const prange = ["Original For Recipient", "Duplicate For Transporter", "Triplicate For Supplier"];
                const printWindow = window.open('', '_blank');
                if (!printWindow) { alert("Popup blocked! Please allow popups."); hideLoader(); return; }

                let fullHTML = `<html><head><title>Invoice PDF</title><style>
                    @page { size: A4; margin: 10mm; }
                    body { margin: 0; padding: 0; font-family: Calibri, Arial, sans-serif; }
                    .page { width: 100%; max-width: 210mm; margin: 0 auto; page-break-after: always; }
                    .page:last-child { page-break-after: avoid; }
                    @media print { body { margin: 0; } .page { page-break-after: always; } .page:last-child { page-break-after: avoid; } }
                </style></head><body>`;

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
                    setTimeout(() => { printWindow.focus(); printWindow.print(); printWindow.close(); hideLoader(); }, 500);
                };
            }

            downloadInvoicePDF(htmlContent, fillInvoice, hideLoader);

        } catch (error) {
            hideLoader();
            console.error('Error generating PDF:', error);
        }

    // ═══════════════════════════════════════════════════════════════════════════
    // BRANCH 2 — Scrap Debit/Credit Note
    // ═══════════════════════════════════════════════════════════════════════════
    } else {

        try {
            const url = new URL(`/jssl/invoice/searchdbtcrdsidnewscrap?id=${id}`, baseUrl);
            const response = await fetch(url, { method: "GET", credentials: "include" });
            if (!response.ok) throw new Error("Failed to fetch data");

            const json = await response.json();
            const Invoice_Data   = json.Invoice_Data;
            const Contractor_Data = json.Contractor_Data;
            const QsPacking_Data = json.QsPacking_Data;

            const invoiceno   = Invoice_Data[0].invoice_no;
            const lr_docketno = Invoice_Data[0].lr_docketno;
            const date_val    = Invoice_Data[0].date_val;
            const factory_id  = Invoice_Data[0].factory_id;
            const cancel      = Invoice_Data[0].cancel;
            const productdesc = Invoice_Data[0].product_desc;

            const noteNumber = Invoice_Data[0].note_type || "";
            let gstLabel = "DEBIT NOTE";
            if (noteNumber === "Credit")      gstLabel = "CREDIT NOTE";
            else if (noteNumber === "Debit")  gstLabel = "DEBIT NOTE";

            // ── Factory Data ──────────────────────────────────────────────────
            const url_factory      = new URL(`/jssl/factory/getAllFactoryListSS`, baseUrl);
            const response_factory = await fetch(url_factory, { method: "GET", credentials: "include" });
            if (!response_factory.ok) throw new Error("Failed to fetch factory data");
            const factory_json = await response_factory.json();

            const factory_data_map     = factory_json.FactoryDetails;
            const FactoryDataBasedById = factory_data_map.find(f => f.id === factory_id);
            const MumbaiAddress        = factory_data_map.find(f => f.id === "4");

            const reg_addresss    = MumbaiAddress.address;
            const factory_Address = FactoryDataBasedById.address;
            const state_Code      = FactoryDataBasedById.stateCode;
            const Gst_Code        = FactoryDataBasedById.gstNo;

            // ── Invoice Fields ────────────────────────────────────────────────
            const invoice_to_id_value         = Invoice_Data[0].invoice_to_id_value;
            const tax_payable                 = Invoice_Data[0].tax_payable == 1 ? "No" : "Yes";
            const area_no                     = Invoice_Data[0].area_no;
            const lot_no                      = Invoice_Data[0].lot_no;
            const containter_no               = Invoice_Data[0].containter_no;
            const epcgno                      = Invoice_Data[0].epcgno;
            const shipment_mode_id_value      = Invoice_Data[0].shipment_mode_id_value;
            const delivery_condition_id_value = Invoice_Data[0].delivery_condition_id_value;
            const consignee_id_value          = Invoice_Data[0].consignee_id_value;
            const work_id_value               = Invoice_Data[0].work_id_value;
            const invoiceStateName            = Invoice_Data[0].invoiceStateName;
            const consigneeStateName          = Invoice_Data[0].consigneestateName;
            const invoiceStateCode            = Invoice_Data[0].invoiceStateCode;
            const consigneeStateCode          = Invoice_Data[0].consigneestatecode;
            const invoiceGstNo                = Invoice_Data[0].invoiceGstNo;
            const consigneeGstNo              = Invoice_Data[0].consigneeGstNo;
            const invoicePanNo                = Invoice_Data[0].invoicePanNo;
            const consigneePanNo              = Invoice_Data[0].consigneePanNo;
            const bankaccountName             = Invoice_Data[0].org_name;
            const account_number              = Invoice_Data[0].account_number;
            const branch_address              = Invoice_Data[0].bank_details_id_value + ',' + Invoice_Data[0].branch_address;
            const branch_code                 = Invoice_Data[0].branch_code;
            const swift_code                  = Invoice_Data[0].swift_code;
            const ifsc_code                   = Invoice_Data[0].ifsc_code;
            const work_date                   = Invoice_Data[0].work_date;

            const transport_name       = QsPacking_Data[0].transport_name;
            const vechile_no           = QsPacking_Data[0].vechile_no;
            const freight              = QsPacking_Data[0].freight;
            const con_code_with_lot_no = Invoice_Data[0].con_id + '/' + Invoice_Data[0].load_id;

            const basic_value = QsPacking_Data[0].totalpnAmount;
            const total_kgs   = QsPacking_Data[0].totalKgs;
            const total_qty   = QsPacking_Data[0].totalQty;

            // ── Tax fields ────────────────────────────────────────────────────
            const taxname1 = Invoice_Data[0].tax_1;
            const taxname2 = Invoice_Data[0].tax_2;
            const taxname3 = Invoice_Data[0].tax_3;

            const taxper1  = Invoice_Data[0].tax1_per   ?? 0;
            const taxper2  = Invoice_Data[0].tax2_per   ?? 0;
            const taxper3  = Invoice_Data[0].tax3_per   ?? 0;

            const taxvalue1 = Invoice_Data[0].tax1_value;
            const taxvalue2 = Invoice_Data[0].tax2_value;
            const taxvalue3 = Invoice_Data[0].tax3_value;

            const taxvalueword1 = Invoice_Data[0].tax1_value_word;
            const taxvalueword2 = Invoice_Data[0].tax2_value_word;
            const taxvalueword3 = Invoice_Data[0].tax3_value_word;

            const grand_totals  = Invoice_Data[0].grand_total;
			const Service_Code = [
			    Invoice_Data[0]?.s_code_value,
			    Invoice_Data[0]?.h_code_value
			]
			.filter(v => v !== null && v !== undefined && String(v).trim() !== "" && String(v).trim().toLowerCase() !== "null")
			.join(" / ");
            //const Service_Code  = `${Invoice_Data[0].s_code_value} \\  ${Invoice_Data[0].h_code_value}`;

            const items       = json.QsPacking_Data || [];
            const InvoiceData = json.Invoice_Data   || [];
            const gstremarks  = InvoiceData.gst_remarks || '';

            // ── Product Table Rows ────────────────────────────────────────────
            const maxRows = 9;
            let tableRows = "";

            items.forEach((item, index) => {
                tableRows += `
                    <tr class="product-row">
                        <td colspan="1" style="text-align:right;">${index + 1}</td>
                        <td colspan="4" class="desc-col descri">${item.scrapNameTypeId || ''}</td>
                        <td colspan="1" style="text-align:right !important;">${Service_Code || ''}</td>
                        <td colspan="1" style="text-align:left !important;">${item.uom_name || ''}</td>
                        <td colspan="1" class="qtys">${item.quantities || ''}</td>
                        <td colspan="2" class="weits">${item.kgs || ''}</td>
                        <td colspan="1" class="prs">${formatAmount(item.unitPrice) || ''}</td>
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
                            <td colspan="1"></td><td colspan="1"></td><td colspan="1"></td>
                            <td colspan="2"></td><td colspan="1"></td><td colspan="2"></td>
                        </tr>`;
                } else {
                    tableRows += `
                        <tr class="empty-row">
                            <td colspan="1">&nbsp;</td>
                            <td colspan="4"></td>
                            <td colspan="1"></td><td colspan="1"></td><td colspan="1"></td>
                            <td colspan="2"></td><td colspan="1"></td><td colspan="2"></td>
                        </tr>`;
                }
            }

            // ── Date Formatting ───────────────────────────────────────────────
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

            // ── HTML Template ─────────────────────────────────────────────────
            const htmlContent = `
                <style>
                    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');
                    * { box-sizing: border-box; }

                    .watermark {
                        position: absolute; top: 50%; left: 50%;
                        transform: translate(-50%, -50%) rotate(-45deg);
                        font-size: 120px; font-weight: bold; opacity: 0.15;
                        pointer-events: none; z-index: 9999;
                        white-space: nowrap; letter-spacing: 10px;
                    }
                    .watermark.cancelled { color: #ff0000; }
                    .watermark.verified  { color: #4CAF50; }
                    .page { position: relative; }

                    html, body {
                        margin: 0; padding: 0;
                        font-family: "Times New Roman", Times, serif;
                        color: black !important; background-color: #fff !important;
                        font-size: 10px; line-height: 2;
                    }
                    .page {
                        width: 202mm; height: 297mm; overflow: visible;
                        page-break-after: avoid !important; margin: 0; padding: 0;
                    }
                    .page:last-child { page-break-after: avoid !important; }
                    .invoice-container {
                        width: 100%; height: auto; overflow: visible;
                        -webkit-font-smoothing: antialiased;
                        text-rendering: geometricPrecision;
                        page-break-inside: avoid; margin: 0; padding: 1mm;
                    }
                    table {
                        border-collapse: collapse !important; table-layout: fixed;
                        page-break-inside: avoid; width: 100%; margin: 0; padding: 0;
                    }
                    td, th {
                        border-right: 0.5px solid #000; border-bottom: 0.5px solid #000;
                        padding: 2px 4px; vertical-align: top;
                        font-size: 10px; line-height: 1.05; word-wrap: break-word;
                    }
                    tr { page-break-inside: avoid; }
                    tr:first-child th { border-top: 0.5px solid #000; }
                    td:first-child, th:first-child { border-left: 0.5px solid #000; }
                    .company-details-table { border-top: 0.5px solid #000 !important; }
                    .header, .footer { text-align: center; margin: 0; padding: 0; }
                    .invoice-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2mm; }
                    .gst-text { font-size: 15px; font-weight: 500; text-align: center; margin-left: 330px !important; }
                    .copy-label { font-size: 12px; font-weight: normal; }
                    td br, th br { display: block; margin: 0; line-height: 1; }
                    .company-details-table td { padding: 4px; font-size: 11px !important; }
                    .company-logo img { width: 60px; height: auto; display: block; margin-bottom: 2px; }
                    .product-row td:nth-child(n+4) { text-align: right !important; }
                    .product-row td, .empty-row td { height: 22px; }
                    .empty-row td { border-top: none !important; border-bottom: none !important; }
                    .last-product td { border-bottom: none !important; }
                    .product-table .desc-col { line-height: 1.5 !important; white-space: normal; word-break: break-word; }
                    .product-table .fright-row .fright-data { line-height: 1.6 !important; padding: 5px !important; }
                    .total-body .total-datatd  { line-height: 1.6 !important; padding: 5px !important; }
                    .total-body .total-datatds { line-height: 2.5 !important; text-align: right !important; }
                    .desc-col.descri { font-size: 7px !important; padding: 1px !important; }
                    .desc-col.tols { text-align: right !important; }
                    .desc-col.prs  { text-align: right !important; }
                    .desc-col.weits { text-align: right !important; }
                    .desc-col.qtys  { text-align: right !important; }
                    .product-table th, .product-table td { padding: 3px 5px; line-height: 1.2; }
                    .product-row td { border-bottom: none; }
                    .freight-vlaue { text-align: right !important; }
                    .fright-row { border: 0.5px solid #000 !important; }
                    .tax-row .tax-name { line-height: 0.8 !important; text-align: right !important; padding: 5px !important; }
                    .tax-row .tax-per  { text-align: right !important; vertical-align: middle !important; }
                    .total-word .total-words-des { line-height: 1.2 !important; font-size: 8px !important; padding: 0 0 5px 5px !important; }
                    .total-words-des.ss { vertical-align: middle !important; }
                    .total-word .total-words-val { text-align: right !important; vertical-align: middle !important; }
                    .td-body-tax { text-align: right !important; line-height: 2 !important; }
                    .Bank_details { line-height: 1.8 !important; font-size: 8px !important; }
                    .last-data td { line-height: 1.5 !important; font-size: 9px !important; padding-top: 6px !important; }
                    .last-data td:last-child { text-align: center !important; vertical-align: middle !important; }
                    .last-data td:last-child span { display: block; text-align: center; }
                    .footer { padding-top: 6px !important; }
                    .footer p { font-size: 9px; line-height: 1.2; margin: 0; padding: 0; }
                    .invoice-line { display: flex; justify-content: space-between; width: 80%; }
                    .fixed-8px td { font-size: 8px !important; line-height: 1.1 !important; }
                    .terms { margin-top: 2mm; }
                    .header, .footer, .gst-text, .copy-label { text-align: center; }
                    .fulladdress, .conaddress, .facotry_address {
                        white-space: pre-line; display: inline-block; line-height: 1.5;
                    }
                    b      { font-weight: 550 !important; }
                    strong { font-weight: 550 !important; }
                </style>

                <div class="invoice-container">
                    ${cancel === 'true' ? `<div class="watermark cancelled">CANCELLED</div>` : ''}

                    <div class="invoice-header">
                        <b>   </b>
                        <div class="gst-text">${gstLabel}</div>
                        <div class="gst-text1 copy-label">Original For Recipient</div>
                    </div>

                    <table class="company-details-table">
                        <tr>
                            <td colspan="6">
                                <div class="company-logo">
                                    <img src="img/logo/download.png" alt="Company Logo" style="width:100px;">
                                </div>
                                <strong>JSW Severfield Structures Limited</strong><br>
                                <span class="facotry_address"></span>
                                <p></p>
                                <b>State Code:</b> <span class="state_code"></span><br>
                                <b>GSTIN:</b> <span class="gst_code" style="margin-right:20px;"></span> <b>PAN:</b> AACCJ1473D<br>
                                <b>ICE No:</b> 0309033152 <b style="margin-left:50px;">CIN No:</b> U28112MH2009PLC191045<br>
                                <b>Email:</b> invoice@jssl.in <b style="margin-left:40px;">Website:</b> www.jssl.in
                            </td>
                            <td colspan="6">
                                <br>
                                <div class="invoice-line">
                                    <div style="font-size:12px;"><b>Invoice No: </b><span class="invoiceNumber"></span></div>
                                    <div><b>Date:</b> <span class="date"></span></div>
                                </div>
                                <br>
                                <b>Contract No Reference No:</b> <span class="contrefno"></span><br>
                                <b>Date &amp; Time of supply:</b> <span class="datetime"></span><br>
                                <br>
                                <b>Work/Purchase Order No:</b> <span class="workor"></span><br>
                                <b>Date of Order:</b> <span class="dateor"></span><br>
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
                                <b>Date of Notification</b><br>
                                <b>Exempted note under:</b><br>
                                <b>Tax is Payable on reverse charge (Yes/No):</b> <span class="taxpayre"></span><br>
                            </td>
                            <td colspan="3" style="font-size:7px;">
                                <b>Export Details:</b><br>
                                <b>ARE No:</b> <span class="areano"></span><br>
                                <b>LUT No:</b> <span class="lutno"></span><br>
                                <b>Container No:</b> <span class="contlo"></span><br>
                                <b>EPCG License No:</b> <span class="epoglo"></span><br>
                            </td>
                            <td colspan="3" style="font-size:7px;">
                                <b>Transporter:</b> <span class="trans"></span><br>
                                <b>Vehicle No:</b> <span class="vehino"></span><br>
                                <b>LR/DOCKET No:</b> <span class="lrdoc"></span><br>
                                <b>Date:</b> <span class="lrdate"></span><br>
                            </td>
                            <td colspan="3" style="font-size:7px;">
                                <b>Shipment Mode:</b> <span class="shipmo"></span><br>
                                <b>Delivery Condition:</b> <span class="delcon"></span><br>
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
                        <tbody id="product_table_data">${tableRows}</tbody>
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
                        <tbody>
                            <tr>
                                <td colspan="6"></td>
                                <td colspan="4" style="text-align:right;">
                                    <span class="hidetax1"><span id="tax1name"></span></span><br>
                                    <span class="hidetax2"><span id="tax2name"></span></span><br>
                                    <span class="hidetax3"><span id="tax3name"></span></span><br>
                                </td>
                                <td style="text-align:right;">
                                    <span class="hidetax1"><span id="tax1per"></span> %</span><br>
                                    <span class="hidetax2"><span id="tax2per"></span> %</span><br>
                                    <span class="hidetax3"><span id="tax3per"></span> %</span><br>
                                </td>
                                <td colspan="2" style="text-align:right;">
                                    <span class="hidetax1"><span id="tax1value"></span></span><br>
                                    <span class="hidetax2"><span id="tax2value"></span></span><br>
                                    <span class="hidetax3"><span id="tax3value"></span></span><br>
                                </td>
                            </tr>
                        </tbody>
                        <tbody>
                            <tr>
                                <td colspan="8">
                                    <b>Note:</b> <span>Identification Marks &amp; Serial No. of Goods: As per packing list attached</span><br>
                                    <span class="hidetax1"><b id="tax1namewo"></b>: <b id="word1"></b></span><br>
                                    <span class="hidetax2"><b id="tax2namewo"></b>: <b id="word2"></b></span><br>
                                    <span class="hidetax3"><b id="tax3namewo"></b>: <b id="word3"></b></span><br>
                                    <br>
                                    <b>Gross total in words:</b> <b id="grandwork"></b>
                                </td>
                                <td colspan="3"><b>TOTAL INVOICE VALUE:</b><br></td>
                                <td colspan="2" style="text-align:right;"><span id="grand"></span><br></td>
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
                            <tr>
                                <td colspan="3"><span>Total</span><br></td>
                                <td colspan="1"></td><td colspan="1"></td>
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

            // ── Fill Invoice Data into DOM ─────────────────────────────────────
            function fillInvoice(container) {

                const setContent = (selector, value) => {
                    const el = container.querySelector(selector);
                    if (el) el.textContent = value || '';
                };

                // Hide zero-value tax rows
                if (!taxvalue1 || Number(taxvalue1) === 0) container.querySelectorAll('.hidetax1').forEach(el => el.style.display = 'none');
                if (!taxvalue2 || Number(taxvalue2) === 0) container.querySelectorAll('.hidetax2').forEach(el => el.style.display = 'none');
                if (!taxvalue3 || Number(taxvalue3) === 0) container.querySelectorAll('.hidetax3').forEach(el => el.style.display = 'none');

                // FACTORY DETAILS
                setContent(".reg_add",    reg_addresss);
                setContent(".gst_code",   Gst_Code);
                setContent(".state_code", state_Code);
                container.querySelector('.facotry_address').textContent = factory_Address;

                // INVOICE HEADER
                setContent('.datetime',      formattedDateTime);
                setContent('.dateor',        work_date);
                setContent('.date',          currentDate);
                setContent('.invoiceNumber', invoiceno);

                // ── INVOICE TO — split by line breaks ────────────────────────
                const invoiceToValue = invoice_to_id_value || '';
                const invoiceLines   = invoiceToValue.split(/\r?\n/);

                setContent('.shipto11',     invoiceLines[0] || '');
                setContent('.shipto11add2', invoiceLines[1] || '');
                setContent('.shipto11add3', invoiceLines[2] || '');

                const districtAndPin = [
                    Invoice_Data[0].invoiceDistrict,
                    Invoice_Data[0].invoicePinNo
                ].filter(x => x && x.toString().trim() !== "").join("-");

                const invoiceAddress = [
                    Invoice_Data[0].addressLine1up,
                    Invoice_Data[0].addressLine2up,
                    Invoice_Data[0].addressLine3up,
                    districtAndPin
                ].filter(x => x && x.toString().trim() !== "").join("\n");

                container.querySelector('.fulladdress').textContent = invoiceAddress;

                setContent('.placeofsupply', Invoice_Data[0].supply_place || '');
                setContent('.statename',     invoiceStateName  || '');
                setContent('.stcode11',      invoiceStateCode  || '');
                setContent('.ingst',         invoiceGstNo      || '');
                setContent('.panin',         invoicePanNo      || '');

                // ── CONSIGNEE — split by line breaks ─────────────────────────
                const consigneeValue = consignee_id_value || '';
                const consigneeLines = consigneeValue.split(/\r?\n/);

                setContent('.conname',  consigneeLines[0] || '');
                setContent('.conname1', consigneeLines[1] || '');
                setContent('.conname2', consigneeLines[2] || '');

                const consigneeDistrictAndPin = [
                    Invoice_Data[0].consigneeDistrict,
                    Invoice_Data[0].consigneePinNo
                ].filter(x => x && x.toString().trim() !== "").join("-");

                const consigneeAddress = [
                    Invoice_Data[0].conaddressLine1,
                    Invoice_Data[0].conaddressLine2,
                    Invoice_Data[0].conaddressLine3,
                    consigneeDistrictAndPin
                ].filter(x => x && x.toString().trim() !== "").join("\n");

                container.querySelector('.conaddress').textContent = consigneeAddress;

                setContent('.state',   consigneeStateName || '');
                setContent('.stateco', consigneeStateCode || '');
                setContent('.congst',  consigneeGstNo     || '');
                setContent('.pancon',  consigneePanNo     || '');

                // TRANSPORT DETAILS
                setContent('.taxpayre',  tax_payable);
                setContent('.areano',    area_no            || '');
                setContent('.contlo',    containter_no      || '');
                setContent('.lutno',     lot_no             || '');
                setContent('.epoglo',    epcgno             || '');
                setContent('.trans',     transport_name     || '');
                setContent('.lrdoc',     lr_docketno        || '');
                setContent('.lrdate',    date_val           || '');
                setContent('.shipmo',    shipment_mode_id_value      || '');
                setContent('.delcon',    delivery_condition_id_value || '');
                setContent('.workor',    work_id_value      || '');
                setContent('.vehino',    vechile_no         || '');
                setContent('.contrefno', con_code_with_lot_no || '');

                // TOTALS — all formatted with Indian commas
                setContent('.freight',   formatAmount(freight));
                setContent('.qtytotal',  total_qty || '');
                setContent('.wiegtotal', total_kgs || '');
                setContent('.val11',     formatAmount(basic_value));

                // TAX FIELDS
                setContent('#tax1name',   taxname1 || '');
                setContent('#tax2name',   taxname2 || '');
                setContent('#tax3name',   taxname3 || '');
                setContent('#tax1namewo', taxname1 || '');
                setContent('#tax2namewo', taxname2 || '');
                setContent('#tax3namewo', taxname3 || '');
                setContent('#tax1value',  formatAmount(taxvalue1));
                setContent('#tax2value',  formatAmount(taxvalue2));
                setContent('#tax3value',  formatAmount(taxvalue3));
                setContent('#tax1per',    taxper1 || '');
                setContent('#tax2per',    taxper2 || '');
                setContent('#tax3per',    taxper3 || '');
                setContent('#word1',      taxvalueword1 || '');
                setContent('#word2',      taxvalueword2 || '');
                setContent('#word3',      taxvalueword3 || '');
                setContent('#grand',      formatAmount(grand_totals));
                setContent('#grandwork',  Invoice_Data[0].grand_total_words || '');

                // BANK DETAILS
                setContent('.bankname', bankaccountName || '');
                setContent('.acc',      account_number  || '');
                setContent('.bname',    branch_address  || '');
                setContent('.code',     branch_code     || '');
                setContent('.scode',    swift_code      || '');
                setContent('.ifsc',     ifsc_code       || '');
            }

            function downloadInvoicePDF(htmlContent, fillInvoice, hideLoader) {
                const prange = ["Original For Recipient", "Duplicate For Transporter", "Triplicate For Supplier"];
                const printWindow = window.open('', '_blank');
                if (!printWindow) { alert("Popup blocked! Please allow popups."); hideLoader(); return; }

                let fullHTML = `<html><head><title>Invoice PDF</title><style>
                    @page { size: A4; margin: 10mm; }
                    body { margin: 0; padding: 0; font-family: Calibri, Arial, sans-serif; }
                    .page { width: 100%; max-width: 210mm; margin: 0 auto; page-break-after: always; }
                    .page:last-child { page-break-after: avoid; }
                    @media print { body { margin: 0; } .page { page-break-after: always; } .page:last-child { page-break-after: avoid; } }
                </style></head><body>`;

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
                    setTimeout(() => { printWindow.focus(); printWindow.print(); printWindow.close(); hideLoader(); }, 500);
                };
            }

            downloadInvoicePDF(htmlContent, fillInvoice, hideLoader);

        } catch (error) {
            hideLoader();
            console.error('Error generating PDF:', error);
        }
    }
}


/*function cancelRecord(id) {
	$('#exampleModalCenter16').modal('show');

	// Store the id and pn_id in the modal's data attributes
	$('#exampleModalCenter16').attr('data-id', id);
	$('#exampleModalCenter16').attr('data-pn-id', pn_id);

	$.ajax({
	    url: new URL('/jssl/invoicedbtcrd/cancelbyidnew', baseUrl),   // cancel endpoint
	    type: 'POST',
	    dataType: 'json',
	    xhrFields: {
	        withCredentials: true
	    },
	    data: jQuery.param({
	        id: id,    
	        cancelled_by: createdById,  
			pn_id:pn_id
	    }),
	    success: function (data) {

	        var result = data.message;

	        if (result === "Success") {

	            const popup = $('<div class="popup"> Invoice Cancelled Successfully!</div>')
	                .appendTo('body')
	                .hide()
	                .fadeIn(400);

	            setTimeout(function () {
	                popup.fadeOut(400, function () {
	                    $(this).remove();
	                    window.location = 'DebitCreditInvoiceEntry.jsp';
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

}*/

function openModalcancel(id,dc_pn_id,con_id,note_type) {
		//  const allowed = window.allowedActions || [];

	if (!allowed.includes("Cancel")) {
	  alert(" You do not have permission to Cancel.");
	  $('#exampleModalCenter16').modal('hide');
	  return;
	}
    // Open the modal
    $('#exampleModalCenter16').modal('show');

    // Store the id and pn_id in the modal's data attributes
	$('#exampleModalCenter16').attr('data-conid', con_id);
    $('#exampleModalCenter16').attr('data-id', id);
	$('#exampleModalCenter16').attr('data-pn-id', dc_pn_id);
	$('#exampleModalCenter16').attr('data-note_type', note_type);
}

function cancelRecord() {
	$('#exampleModalCenter16').modal('hide');
	//const conId = sessionStorage.getItem("selectedConId");
	var conId =$('#exampleModalCenter16').attr('data-conid');
	var note_type =$('#exampleModalCenter16').attr('data-note_type');
	if(conId!="Scrap"){
	// Store the id and pn_id in the modal's data attributes
	var id =$('#exampleModalCenter16').attr('data-id');
	var pn_id=$('#exampleModalCenter16').attr('data-pn-id');
	$.ajax({
	    url: new URL('/jssl/invoicedbtcrd/cancelbyidnew', baseUrl),   // cancel endpoint
	    type: 'POST',
	    dataType: 'json',
	    xhrFields: {
	        withCredentials: true
	    },
	    data: jQuery.param({
	        id: id,    
	        cancelled_by: createdById,
			factory_id:selectedFactoryId,
			pn_id:pn_id,
			note_type: note_type
			
	    }),
	    success: function (data) {

	        var result = data.message;

	        if (result === "Success") {

	            const popup = $('<div class="popup"> Debit credit Invoice Cancelled Successfully!</div>')
	                .appendTo('body')
	                .hide()
	                .fadeIn(400);

	            setTimeout(function () {
	                popup.fadeOut(400, function () {
	                    $(this).remove();
	                    window.location = 'DebitCreditInvoiceEntry.jsp';
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
	else
		{
			var id =$('#exampleModalCenter16').attr('data-id');
			var pn_id=$('#exampleModalCenter16').attr('data-pn-id');
			$.ajax({
			    url: new URL('/jssl/invoicedbtcrd/cancelbyidnewscrap', baseUrl),   // cancel endpoint
			    type: 'POST',
			    dataType: 'json',
			    xhrFields: {
			        withCredentials: true
			    },
			    data: jQuery.param({
			        id: id,    
			        cancelled_by: createdById,
					factory_id:selectedFactoryId,
					pn_id:pn_id,
					note_type: note_type
			    }),
			    success: function (data) {

			        var result = data.message;

			        if (result === "Success") {

			            const popup = $('<div class="popup"> Debit credit Invoice Cancelled Successfully!</div>')
			                .appendTo('body')
			                .hide()
			                .fadeIn(400);

			            setTimeout(function () {
			                popup.fadeOut(400, function () {
			                    $(this).remove();
			                    window.location = 'DebitCreditInvoiceEntry.jsp';
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
	}
	
	
	function calculateTax(selectedTax, totalAmount) {
	    const tax = parseFloat(selectedTax) || 0;
	    const amount = parseFloat(totalAmount) || 0;

	    const taxValue = (tax / 100) * amount;
	    return taxValue.toFixed(2); // ALWAYS returns string like "0.00"
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
