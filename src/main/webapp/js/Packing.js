
const MainPage =  window.location.pathname.split("/").pop()+'.jsp';
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


document.addEventListener("DOMContentLoaded", function () {
	
	loadActions();

    document.getElementById("entry1").addEventListener("click", function () {

        // safe check
        const allowed = typeof allowedActions !== "undefined"
            ? allowedActions
            : [];

        if (!allowed.includes("Insert")) {
            alert("You do not have permission to Insert.");
            $('#exampleModalScrollable123').modal('hide');
            return;
        }

        $('#exampleModalScrollable123').modal('show');
    });

});

const selectedFactoryId = localStorage.getItem('selectedFactoryId');
const selecteduserId = sessionStorage.getItem('id');

function loadContractors() {
    getSupplierId()
        .then(supplierId => {
            console.log("Supplier ID resolved:", supplierId);
            getContractorList(supplierId);
        })
        .catch(err => {
            console.error("Unable to load contractors:", err);
        });
}
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
        return data[0].supid; // assuming one supplier per user
    }
    throw new Error("Supplier ID not found");
}



function getContractorList(supplierId) {
	 localStorage.setItem("selectedSupplierId", supplierId);
/*    const supplierId = '168'; // Replace dynamically if needed*/
    const url = new URL(`api/subconlistcontracts?supplierId=${supplierId}&factory_id=${selectedFactoryId}`,baseUrl1);

  fetch(url, { credentials: "include" })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log("API Response for Contractors:", data);
            if (Array.isArray(data)) {
                const contractorSelect = $("#contractor");
                contractorSelect.empty();
                contractorSelect.append('<option value="" selected>Select Contractor</option>');
                data.forEach(contractor => {
                    const contractorName = contractor.contractName || "Unnamed Contract";
                    const contractId = contractor.contractId || '';
                    contractorSelect.append(`<option value="${contractId}">${contractorName}</option>`);
                });
				
            } else {
                console.error("Error: Data is not an array.", data);
            }
		
        })
        .catch(error => {
            console.error("Error fetching contractor details:", error);
        });
}

function getLotnumber(contractId, supId) {
    const url = new URL('api/loads/by-contract-supplier',baseUrl1);
    url.searchParams.append('contractId', contractId);
    url.searchParams.append('supId', supId);
	url.searchParams.append('factory_id', selectedFactoryId)

  fetch(url, { credentials: "include" })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log("API Response for Lots:", data);
            if (Array.isArray(data)) {
                const lotSelect = $("#Lotnumber");
                lotSelect.empty();
                lotSelect.append('<option value="" selected>Select Lotnumber</option>');
                data.forEach(Lotnumber => {
                    const lotName = Lotnumber.loadno || "Unnamed Lotnumber";
                    const lotId = Lotnumber.tload_id || '';
                    lotSelect.append(`<option value="${lotId}">${lotName}</option>`);
                });
            } else {
                console.error("Error: Data is not an array.", data);
            }
        })
        .catch(error => {
            console.error("Error fetching lot details:", error);
        });
}


$('#Show').on('click', function() {
       $('#container4').show();
       $('#container-wrapper5').hide();
	   
	   
	   const contractId = $("#contractor").val();
	      let loadno = $("#Lotnumber option:selected").text().trim();

	      console.log("SHOW CLICK → contract:", contractId, "load:", loadno);

	      // ✅ If "Select Lotnumber" → send empty
	      if (loadno === "Select Lotnumber") {
	          loadno = "";
	      }

	      // ✅ Call API ONLY HERE
	      if (contractId) {
	          updatePackingNoteTable(contractId, loadno);
	      } else {
	          alert("Please select contract");
			    $('#container4').hide();
	
	      }// Toggles the visibility of the div
   });
$(document).ready(function () {
    // Populate contractors on page load
	loadContractors();
  /*  getContractorList();*/

  const contractId = $(this).val();
  	
  	if(contractId ===""){
  		$('#Packing')
  		            .prop("disabled", true)
  		            .removeClass("btn-success")
  		            .addClass("btn-secondary");
  		        
  		       
  	}
    // Fetch lots when a contractor is selected
    $("#contractor").change(function () {
		$('#container4').hide();
		$("#container-wrapper5").hide();
		$("#container-wrapper1").hide();
		$("#container-wrapper2").hide();
        const contractId = $(this).val();
     /*   const supId = '168'; // Replace dynamically if needed*/
	 const supplierId = localStorage.getItem("selectedSupplierId");
        if (contractId) {
            getLotnumber(contractId, supplierId);
			getLoadNumber(contractId,supplierId);
			getHauilerdetail();
			getdelsitesdetail();
			getstatedetail();
			getphasesdetail(contractId,supplierId);
        }
    });
});



$("#Lotnumber").change(function () {
	$('#container4').hide();
	$("#container-wrapper5").hide();
	$("#container-wrapper1").hide();
	$("#container-wrapper2").hide();
	

	
	});




function updatePackingNoteTable(contractId, loadno) {
  /*  const supId = '168'; // Fixed supplier ID*/
  const supplierId = localStorage.getItem("selectedSupplierId");
  
  
  console.log("the selected contract_id",contractId);
  console.log("the selected loadId",loadno);
  
  
    const url = new URL(`/api/traloads/summary-subcon?contractId=${contractId}&loadno=${loadno}&supid=${supplierId}&factory_id=${selectedFactoryId}`,baseUrl1);

    // Append parameters based on whether loadno is provided
/*    url.searchParams.append('contractId', contractId);
    url.searchParams.append('supId', supplierId);
	
    if (loadno) {
        url.searchParams.append('loadno', loadno);
    }
*/
  fetch(url, { credentials: "include" })
        .then(response => {
            console.log("Response status:", response.status);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log("API Response for Packing Notes:", data);
            const tableBody = $("#tableID1 tbody");
            tableBody.empty();

            if (Array.isArray(data) && data.length > 0) {
                data.forEach(item => {
                    const row = `
                        <tr>
							<td class="hide-column">${item.tloadId || ''}</td> <!-- Hidden Column -->
						    <td class="hide-column">${item.contractId || ''}</td> <!-- Hidden Column -->
                            <td><a href="#" class="loadno-link">${item.loadno || ''}</a></td> <!-- Clickable Link -->
                            <td>${item.description || ''}</td>
                            <td>${item.trailerRef || ''}</td>
                            <td>${item.trackingRef || ''}</td>
                            <td>${item.createdDate || ''}</td>
                            <td>${item.pieceWeight || ''}</td>
                            <td>${item.totalWeight || ''}</td>
                            <td>${item.fabLoads || ''}</td>
                        </tr>`;
                    tableBody.append(row);
                });
				$(".loadno-link").click(function (e) {
				    e.preventDefault();

				    $("#container4").show();

				    const selectedRow = $(this).closest("tr");

				    // ❗ Hide all rows
				    $("#tableID1 tbody tr").hide();

				    // ✅ Show only selected row
				    selectedRow.show();

				    // -----------------------------
				    // Existing logic (KEEP SAME)
				    // -----------------------------
				    var selectedLotNo = $(this).text();

				    const selectedDescription = selectedRow.find("td:nth-child(4)").text();
				    const selectedTloadId = selectedRow.find("td:nth-child(1)").text();

				    $("#lot_no").val(selectedLotNo);
				    $("#dlotNo").val(selectedLotNo);
				    $("#description").val(selectedDescription);
				    $("#lotddescription").val(selectedDescription);
				    $("#tloadIdInput").val(selectedTloadId);

				    window.selectedTloadId = selectedTloadId;

				    $("#lot_no").prop("readonly", true);
					$("#Packing")
					     .prop("disabled", true)
					     .removeClass("btn-success")
					     .addClass("btn-secondary");

				    $(".loadno-link").removeClass("highlight");
				    $(this).addClass("highlight");

				    $("#loadDetailsModal").modal('show');
				    $('#loadDetailsModal').modal('hide');

				    updatetranspoter();
				});
            } else {
                console.error("No data available or response is not an array.");
                tableBody.append('<tr><td colspan="10" class="text-center">No data available</td></tr>');
            }
        })
        .catch(error => {
            console.error("Error fetching packing note details:", error);
            const tableBody = $("#tableID1 tbody");
            tableBody.empty();
            tableBody.append('<tr><td colspan="10" class="text-center text-danger">Failed to load data. Please try again.</td></tr>');
			
        });
}
function onUnloadCancelClicked(){
	/*alert("the cancel is clicked");*/
	$("#container-wrapper5").hide();
	$("#Packing")
	      .prop("disabled", false)
	      .removeClass("btn-secondary")
	      .addClass("btn-success");
}

$("#closetransport").click(function (){
	$("#container-wrapper2").hide();
	$("#Packing")
	      .prop("disabled", false)
	      .removeClass("btn-secondary")
	      .addClass("btn-success");
})

$("#closethemodal").click(function (){
	$("#Packing")
	      .prop("disabled", false)
	      .removeClass("btn-secondary")
	      .addClass("btn-success");
})
$("#closetransinfor").click(function (){
	$("#container-wrapper1").hide();
	$("#Packing")
		      .prop("disabled", false)
		      .removeClass("btn-secondary")
		      .addClass("btn-success");
})

// Event handler for contract selection
$("#contractor").change(function () {
	
	const contractId = $(this).val();
		
		if(contractId ===""){
			$('#Packing')
			            .prop("disabled", true)
			            .removeClass("btn-success")
			            .addClass("btn-secondary");
			        
			       
		}
		else{
			$("#Packing")
					      .prop("disabled", false)
					      .removeClass("btn-secondary")
					      .addClass("btn-success");
		}
	
  
    const loadno = $("#Lotnumber").val(); // Assuming there's an input field for loadno
	const selectedContractorName = $("#contractor option:selected").text(); // Get the display text (contractor name)
	    
	    // Set the contractor name in the #contract and #lotcontract fields
	    $("#contract").val(selectedContractorName);
	    $("#lotcontract").val(selectedContractorName);
  /*  if (contractId) {
        updatePackingNoteTable(contractId, loadno);
    }*/
});
$("#phases").change(function () {
	const phaseId= $(this).val();
 	const contractId = $("#contractor option:selected").val();
	 const supplierId = localStorage.getItem("selectedSupplierId");
	if(phaseId)
		{
			getloads(contractId,phaseId,supplierId)
		}
	});
	
	$(document).ready(function () {
	    // Show confirmation modal when "Create" is clicked
	    $("#submit").click(function () {
	        console.log("Create clicked - Modal will show");
	        $("#exampleModalCenter66").modal("show"); // Show modal
	    });

	    // Handle "No" button click (close the modal without doing anything)
	    $(".btn-secondary[data-dismiss='modal']").click(function () {
	        console.log("No clicked - Modal will hide");
	        $("#exampleModalCenter66").modal("hide");
	    });

	    // Use event delegation for "Yes" button
	    // This ensures that even if the modal is dynamically rendered, it can capture the click event
	    $(document).on("click", "#confirmYes", function () {
	        console.log("Yes clicked - Proceeding with creation");

	        // Hide the modal before proceeding
	        $("#exampleModalCenter66").modal("hide");
			addevent()
	    });
	});

function getLoadNumber(contractId,callback) {
    // Initialize variable for load number
    let loadno = "";

    // Create the URL with contract_id as a query parameter
    const url = new URL(`/api/traloads/latest?contractId=${contractId}&factory_id=${selectedFactoryId}`,baseUrl1);

    // Make AJAX call to the server to get the latest load number
    $.ajax({
        url: url.toString(),  // Use the URL as it is
        method: "GET",
		xhrFields: {
			    withCredentials: true
			},
        success: function (data) {
            // Assuming the response contains an array of objects, and we want the latest loadno
            let loadnumber = "";
            if (data.length > 0) {
                loadnumber = data[0].loadno.trim(); // Remove any extra spaces
            }

            // Extract the numeric part of the loadno (assuming format is "LOT 490")
            let numericPart = loadnumber.replace(/[^\d]/g, ''); // Strip out non-numeric characters
            let lno = parseInt(numericPart);

            // Increment the numeric part
            if (lno) {
                lno += 1;
            } else {
                lno = 1; // Default to 1 if no valid numeric part is found
            }

            // Create new load number with padding
            if (lno.toString().length === 1) {
                loadno = "LOT 00" + lno;
            } else if (lno.toString().length === 2) {
                loadno = "LOT 0" + lno;
            } else {
                loadno = "LOT " + lno;
            }
			if (typeof callback === "function") {
			              callback(loadno); // Pass the loadno to the callback
			          }
        },
        error: function (error) {
            console.error("Error fetching load number:", error);
            alert("An error occurred while fetching the load number.");
        }
    });

    // Return statement outside the AJAX call will always execute before the async response, so no need for return here
}



function addevent() {
    // Get contract_id, trailerref, trackingref, wb_weight, exciseinvoice, descr, factory_id from form inputs
    var contract_id = $('#contractor').val(); // Contract ID field
    var trailerref = $('#trailerrefno').val(); // Trailer Reference No field
    var trackingref = $('#wighbridgerefno').val(); // Tracking Reference field
    var wb_weight = $('#weighbridgeton').val(); // Weight field
    var exciseinvoice = $('#exciseinvoice').val() || " "; // Excise Invoice field (default empty space if not provided)
    var descr = $('#desc').val(); // Description field
  /*  var factory_id = 1; // Factory ID field (set to 1 as in your example)*/
	var supid= 168
    // Get Load Number and then proceed with the form submission
    var contractId = contract_id; // We pass the contract ID to getLoadNumber
    getLoadNumber(contractId, function(loadno) {
        // Prepare the data to be sent (matching the Postman structure)
        var requestData = {
            loadno: loadno.trim(),             // Load number (trim extra spaces)
            contract_id: contract_id,         // Contract ID
            trailerref: trailerref.trim(),    // Trailer Reference
            trackingref: trackingref.trim(),  // Tracking Reference
            created: new Date().toISOString(), // Created timestamp
            wb_weight: wb_weight,              // Weight
            exciseinvoice: exciseinvoice.trim(), // Excise Invoice
            descr: descr,                      // Description
            factory_id: selectedFactoryId,   
			supid:supid,
			createddate:new Date().toISOString,
			createdby:selecteduserId         // Factory ID
        };

        // Log the requestData to verify
        console.log('Sending data:', requestData);

        // Make the AJAX request to submit the data
		$.ajax({
		    url: new URL(`/api/Tra_Loads/addTra_Loads?factory_id=${selectedFactoryId}`,baseUrl1),
		    type: 'POST',
			xhrFields: {
				    withCredentials: true
				},
		    contentType: 'application/json',
		    data: JSON.stringify(requestData),
		    dataType: 'json',
		    success: function(data) {
		        console.log("Response Data:", data);
		        var result = data.status;
		        if (result === "Success") {
		            console.log("Load Number:", loadno);
		            $('body').append('<div class="popup">Created Successfully! The load number is: ' + loadno + '</div>');
		            setTimeout(function() {
		                $('#popup').fadeOut(400, function() { $(this).remove(); });
		                window.location = "PackingNote.jsp";
		            }, 2500);
		        } else {
		            alert("Record not inserted, please try again.");
		        }
		    },
		    error: function(xhr, status, error) {
		        console.error('Error:', error);
		        alert("An error occurred while creating the record.");
		    }
			
        });
    });
}

/*function validateForm() {
    var trailerRefNo = document.getElementById('trailerrefno');
    var weighbridgeRefNo = document.getElementById('wighbridgerefno');
    var weighbridgeTon = document.getElementById('weighbridgeton');

    // Clear previous red borders
    trailerRefNo.style.borderColor = '';
    weighbridgeRefNo.style.borderColor = '';
    weighbridgeTon.style.borderColor = '';

    // Check if any of the fields are empty and highlight them in red
    var isValid = true;
    
    if (trailerRefNo.value === "") {
        trailerRefNo.style.borderColor = '#f8d7da';
        isValid = false;
    }
    if (weighbridgeRefNo.value === "") {
        weighbridgeRefNo.style.borderColor = '#f8d7da';
        isValid = false;
    }
    if (weighbridgeTon.value === "") {
        weighbridgeTon.style.borderColor = '#f8d7da';
        isValid = false;
    }
    
    // Log or alert if form is not valid
    if (!isValid) {
        alert("Please fill in all the required fields.");
    }
    
    return isValid; // Return whether the form is valid or not
}

document.getElementById('resetButton').onclick = function() {
    if (validateForm()) {
        addevent();  // Only submit if validation passes
    }
}
*/



function getHauilerdetail() {
    const url = new URL('/api/hauliers',baseUrl1);

  fetch(url, { credentials: "include" })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log("API Response for Haulier:", data);
            if (Array.isArray(data)) {
                const Haulierselect = $("#Haulier");
                Haulierselect.empty();
                Haulierselect.append('<option value="" selected>Select Hauiler</option>');
                data.forEach(Haulier => {
                    const HauilerName = Haulier.company || "Unnamed Hauiler";
                    const HauilerId = Haulier.haulierid || '';
                    Haulierselect.append(`<option value="${HauilerId}">${HauilerName}</option>`);
					$("#Haulier").val(HauilerName);
                });
				 
            } else {
                console.error("Error: Data is not an array.", data);
            }
		
        })
        .catch(error => {
            console.error("Error fetching Haulier details:", error);
        });
		
}

function getdelsitesdetail() {
    const url = new URL('/api/deliverysites',baseUrl1);

   fetch(url, { credentials: "include" })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log("API Response for Destination:", data);
            if (Array.isArray(data)) {
                const Destinationselect = $("#Destination");
                Destinationselect.empty();
                Destinationselect.append('<option value="" selected>Select Destination</option>');
				const destinationData = data;
                data.forEach(Destination => {
                    const DestinationName = Destination.shortname || "Unnamed Destination";
                    const DestinationId = Destination.delsiteid || '';
                    Destinationselect.append(`<option value="${DestinationId}">${DestinationName}</option>`);
					$("#Destination").val(DestinationName);
                });
				
				Destinationselect.on("change", function() {
				                 const selectedDestinationId = $(this).val();

				                 // Find the selected destination from the data
				                 const selectedDestination = destinationData.find(item => item.delsiteid == selectedDestinationId);

				                 if (selectedDestination) {
				                     // Concatenate the details (del1, del2, del3, del4)
				                     const details = `${selectedDestination.del1 || ''} ${selectedDestination.del2 || ''} ${selectedDestination.del3 || ''} ${selectedDestination.del4 || ''}`;
				                     
				                     // Show the concatenated details in the #Details input field
				                     $("#Details").val(details.trim()); // Remove extra spaces if any
				                 }
				             });
				
            } else {
                console.error("Error: Data is not an array.", data);
            }
		
        })
        .catch(error => {
            console.error("Error fetching Destination details:", error);
        });
		
}

function getstatedetail() {
    const url = new URL('/api/trarates',baseUrl1);

  fetch(url, { credentials: "include" })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log("API Response for state:", data);
            if (Array.isArray(data)) {
                const stateselect = $("#State");
                stateselect.empty();
                stateselect.append('<option value="" selected>Select state</option>');
			
                data.forEach(state => {
                    const stateName = state.county || "Unnamed state";
                    const stateId = state.trateid || '';
                    stateselect.append(`<option value="${stateId}">${stateName}</option>`);
					$("#State").val(stateName);
                });
				
				
            } else {
                console.error("Error: Data is not an array.", data);
            }
		
        })
        .catch(error => {
            console.error("Error fetching state details:", error);
        });
		
}

$(document).ready(function() {
    // Show modal when Create button is clicked
    $("#transsubmit").click(function() {
        $("#exampleModalCenter67").modal("show");
    });

    // Call addtranspoter() when YES button is clicked
    $("#confirmYes1").click(function() {
        $("#exampleModalCenter67").modal("hide"); // Hide modal
        addtranspoter(); // Call function to create transport entry
    });
});

function addtranspoter() {
 	var tload_id= window.selectedTloadId;
    var haulier_id = $('#Haulier').val(); // Contract ID field
    var destination_id = $('#Destination').val(); // Trailer Reference No field
    var notes = $('#general_notes').val(); // Tracking Reference field
    var trate_id = $('#State').val(); // Weight field
    var Loadtype =document.getElementById('Loadtype').value || " "; // Excise Invoice field (default empty space if not provided)
    var invoiceno = $('#invoiceref').val(); // Description field
	if (haulier_id === null) {
	     document.getElementById('haulierError').innerText = "Hauiler is required.";
	     document.getElementById('haulierError').style.display = "inline-block";
	     showError = true;
		 return
	 } else {
	     document.getElementById('haulierError').innerText = "";
	     document.getElementById('haulierError').style.display = "none";
	 }
	 
	 if (trate_id === null) {
	      document.getElementById('DestinationError').innerText = "Destination state is required.";
	      document.getElementById('DestinationError').style.display = "inline-block";
	      showError = true;
	 	 return
	  } else {
	      document.getElementById('DestinationError').innerText = "";
	      document.getElementById('DestinationError').style.display = "none";
	  }
	  
	  if (destination_id === null) {
	       document.getElementById('Destination1Error').innerText = "Destination is required.";
	       document.getElementById('Destination1Error').style.display = "inline-block";
	       showError = true;
	  	 return
	   } else {
	       document.getElementById('Destination1Error').innerText = "";
	       document.getElementById('Destination1Error').style.display = "none";
	   }
	   
	   if (Loadtype === "1") {
	          document.getElementById('LoadtypeError').innerText = "Loadtype is required.";
	          document.getElementById('LoadtypeError').style.display = "inline-block";
	          showError = true;
	     	 return
	      } else {
	          document.getElementById('LoadtypeError').innerText = "";
	          document.getElementById('LoadtypeError').style.display = "none";
	      }
        var requestData = {
			created: new Date().toISOString(),
			   tload_id:tload_id,
			   haulier_id:haulier_id,
			   destination_id:destination_id,
			   reqddate: "1900-01-01T00:00:00.000",
			   reqdtime: "    ",
			   notes: notes,
			   trate_id: trate_id,
			   loadtype_id: Loadtype,
			   tablerate: 0.00,
			   adjustment: 0.00,
			   fuelpc: 0.00,
			   fuelcost: 0.00,
			   totalcost: 0.00,
			   invoiceno: invoiceno,
			   costnotes: "                                                                                                                                                                                                        ",
			   despatchdate: "1900-01-01T00:00:00.000",
			   arrivaldate: null,
			   despatchtime: "          ",
			   arrivaltime: "          ",
			   delaycost: 0.00,
			   length: "            ",
			   width: "            ",
			   runstatus_id: 1,
			   leftdestdate: null,
			   leftdesttime: "          ",
			   createdby:sessionStorage.getItem("user_id"),
			   createddate: null,
			   updatedby: null,
			   updateddate: null    
        };

        // Log the requestData to verify
        console.log('Sending data:', requestData);

        // Make the AJAX request to submit the data
        $.ajax({
            url: new URL(`/api/Tra_LoadRuns/addTra_LoadRuns?factory_id=${selectedFactoryId}`,baseUrl1), // API URL
            type: 'POST',
			xhrFields: {
				    withCredentials: true
				},
            contentType: 'application/json', // Set content type to JSON
            data: JSON.stringify(requestData), // Send data as a JSON string
            dataType: 'json',
			success: function(data) {
			    console.log("API Response:", data); // Log full response
			    var result = data.status; 
			    if (result === "Success") {
			        $('body').append('<div class="popup-transpoter">Transporter Created Successfully!</div>');
			        setTimeout(function() {
			            $('.popup-transpoter').fadeOut(400, function() { $(this).remove(); });
			            window.location = "PackingNote.jsp";
			            updatetranspoter();
			        }, 2500);
			    } 
				else 
				{
			        alert("Record not inserted, please try again.");
			    }
			}
		});
	}

	function updatetranspoter() {
	  const tloadid=window.selectedTloadId; 
	    const url = new URL(`/api/traloads/runs-subcon?tloadId=${tloadid}&factory_id=${selectedFactoryId}`,baseUrl1);

	 fetch(url, { credentials: "include" })
	        .then(response => {
	            console.log("Response status:", response.status);
	            if (!response.ok) {
	                throw new Error(`HTTP error! Status: ${response.status}`);
	            }
	            return response.json();
	        })
	        .then(data => {
	            console.log("API Response for transpoter details:", data);
	            const tableBody = $("#tableID2 tbody");
	            tableBody.empty();

	            if (Array.isArray(data) && data.length > 0) {
	                data.forEach(item => {
	                    const row = `
	                        <tr>
	                            <td>${item.haulier || ''}</td>
	                            <td>${item.destination || ''}</td>
	                            <td>${item.country || ''}</td>
	                            <td>${item.county || ''}</td>
	                            <td>${item.loadType || ''}</td>
	                            <td>${item.invoiceNo || ''}</td>
	                        </tr>`;
	                    tableBody.append(row);
	                });
				
	            } else {
	                console.error("No data available or response is not an array.");
	                tableBody.append('<tr><td colspan="10" class="text-center">No data available</td></tr>');
	            }
	        })
	        .catch(error => {
	            console.error("Error fetching packing note details:", error);
	            const tableBody = $("#tableID2 tbody");
	            tableBody.empty();
	            tableBody.append('<tr><td colspan="10" class="text-center text-danger">Failed to load data. Please try again.</td></tr>');
				
	        });
	}
	
	function getphasesdetail(contractId, supId) {
	    const url = new URL(`/api/contract/zones-subcon?contractId=${contractId}&supplierId=${supId}&factory_id=${selectedFactoryId}`,baseUrl1);

	 fetch(url, { credentials: "include" })
	        .then(response => {
	            if (!response.ok) {
	                throw new Error(`HTTP error! Status: ${response.status}`);
	            }
	            return response.json();
	        })
	        .then(data => {
	            console.log("API Response for phases:", data);
	            if (Array.isArray(data)) {
	                const phaseselect = $("#phases");
	                phaseselect.empty();
	                phaseselect.append('<option value="" selected>Select phases</option>');
	                data.forEach(phase => {
	                    const phasename = phase.descr || "Unnamed phases";
	                    const phaseId = phase.contract_Zone || '';
	                    phaseselect.append(`<option value="${phaseId}">${phasename}</option>`);
						$("#phases").val(phaseId);
	                });
					
	            } else {
	                console.error("Error: Data is not an array.", data);
	            }
			
	        })
	        .catch(error => {
	            console.error("Error fetching Haulier details:", error);
	        });
			
			$("#phases").change(function() {
			       const selectedPhaseName = $("#phases option:selected").text();  // Get the text of the selected option
			       $("#phase_Details").val(selectedPhaseName);  // Update the textbox with the selected phase name
			   });
			  
	}

	function getloads(contractId,phaseId,supId) {
	    const url = new URL(`/api/loads/loads-to-load-subcon?contractId=${contractId}&phase=${phaseId}&supid=${supId}&factory_id=${selectedFactoryId}`,baseUrl1);

	   fetch(url, { credentials: "include" })
	        .then(response => {
	            if (!response.ok) {
	                throw new Error(`HTTP error! Status: ${response.status}`);
	            }
	            return response.json();
	        })
	        .then(data => {
	            console.log("API Response for load:", data);
	            if (Array.isArray(data)) {
	                const loadselect = $("#load");
	                loadselect.empty();
	                loadselect.append('<option value="" selected>Select load</option>');
				
	                data.forEach(load => {
	                    const loadName = load.descr || "Unnamed load";
	                    const loadId = load.load_id || '';
	                    loadselect.append(`<option value="${loadId}">${loadName}</option>`);
						$("#load").val(loadName);
	                });
					
					
	            } else {
	                console.error("Error: Data is not an array.", data);
	            }
			
	        })
	        .catch(error => {
	            console.error("Error fetching state details:", error);
	        });
			
	}
	$("#load").change(function () {
		const loadId= $(this).val();
	 	const contractId = $("#contractor option:selected").val();
		const phaseId = $("#phases option:selected").val();
		 const supplierId = localStorage.getItem("selectedSupplierId");
		if(phaseId)
			{
				getloaddata(contractId,phaseId,supplierId,loadId)
			}
		});
	
	function getloaddata(contractId, phaseId, supId,loadId) {
	    const url = new URL(`/api/loads/pieces-to-load-subcon?contractId=${contractId}&phase=${phaseId}&supid=${supId}&loadid=${loadId}&factory_id=${selectedFactoryId}`,baseUrl1);

	 fetch(url, { credentials: "include" })
	        .then(response => {
	            if (!response.ok) {
	                throw new Error(`HTTP error! Status: ${response.status}`);
	            }
	            return response.json();
	        })
	        .then(data => {
	            console.log("API Response for load:", data);
	            if (Array.isArray(data)) {
	                const div3 = document.getElementById('div3');
	                
	                // Clear the existing radio buttons
	                div3.innerHTML = '';
	                // Iterate over the response data and create radio buttons dynamically
	                data.forEach((load, index) => {
	                    const loadName = load.descr || "Unnamed load";
	                    const loadId = load.pieces_id	 || '';
						const pqty = load.pqty;
	                    
	                    // Create a new radio button for each load item
	                    const radioButtonHtml = `
	                        <input type="radio" name="loadItem" id="item${index + 1}" value="${loadId}" onclick="onItemSelected('${loadId}', '${loadName}', ${pqty})"> ${loadName} <br>
	                    `;
						
	                    
	                    // Append the radio button HTML to the div
	                    div3.innerHTML += radioButtonHtml;
	                });
					const qtylabel=document.getElementById('lblQtyTitle');
					const qtyInput = document.getElementById('txtQtyEntry');
					 
							qtylabel.hidden=true	
					        qtyInput.hidden = true; // Show the qty input
							const tbody = document.getElementById('gvLoadedList');
									tbody.hidden=false;
					   
					
	            } else {
	                console.error("Error: Data is not an array.", data);
	            }
	        })
	        .catch(error => {
	            console.error("Error fetching load data:", error);
	        });
	}
	
	let selectedLoadId = '';
	let selectedLoadName = '';
	let selectedPqty = 0;

	function onItemSelected(loadId, loadName, pqty) {
	    // Store the selected load ID, name, and pqty
	    selectedLoadId = loadId;
	    selectedLoadName = loadName;
	    selectedPqty = pqty;

	    // Fill the qty input field with pqty
	    const qtyInput = document.getElementById('txtQtyEntry');
	    qtyInput.value = selectedPqty;  // Set the quantity input field to pqty

	    // Show the button and update its text
	    const loadButton = document.getElementById('btnItemLoad');
	    loadButton.hidden = false;  // Show the button

	    // Show the Qty input and label
	    const qtyLabel = document.getElementById('lblQtyTitle');
	    const qtyInputField = document.getElementById('txtQtyEntry');
	    qtyLabel.hidden = false;
	    qtyInputField.hidden = false;
	}
	
	function onItemLoadClicked() {
	    // Gather the data you need to send in the POST request
		const supplierId = localStorage.getItem("selectedSupplierId");
		const lblLoadId= window.selectedTloadId;
	 	const contractId = $("#contractor option:selected").val(); // Assuming you have an input with this ID
	    const phaseLoadId = $("#load option:selected").val(); // Same assumption for phaseLoadId
	    const chkLoadItemValue = document.querySelector('input[name="loadItem"]:checked').value;  // Assuming it's the selected radio button
	    const qty = document.getElementById('txtQtyEntry').value;  // Get the qty from the input field

	    // Prepare the payload (data to send)
	    const data = {
	        lblLoadId: lblLoadId,
	        contractId: contractId,
	        phaseLoadId: phaseLoadId,
	        chkLoadItemValue: chkLoadItemValue,
	        qty: qty  // Add the qty field to the payload
	    };

	/*	const url = new URL(`/api/piece-instance/update?qty=${qty}&lblLoadId=${lblLoadId}&contractId=${contractId}&phaseLoadId=${phaseLoadId}&chkLoadItemValue=${chkLoadItemValue}&factory_id=${selectedFactoryId}`,baseUrl1);
	    // Use the fetch API to send the POST request
		// Use the fetch API to send the POST request
		fetch(url, {  // Corrected here by moving the options object after the URL
		    method: 'POST',  // Use POST method
			xhrFields: {
				    withCredentials: true
				},
		    headers: {
		        'Content-Type': 'application/json'  // Specify the content type as JSON
		    },
		    body: JSON.stringify(data)  // Send the data as JSON string
		})
		.then(response => response.text()) // Parse the JSON response
		.then(text => {
		    // Handle the response here
		    console.log('Success:', text);
		    
		    // You can show a success message to the user, or update the UI
		    alert(text);  // Assuming the response contains a "message" field
			updatelotdetail();
			$("#load").change();
			getloaddata();
			const tbody = document.getElementById('gvLoadedList');
			tbody.hidden=false;
		})
		.catch((error) => {
		    // Handle errors here
		    console.error('Error:', error);
		    alert('Error while updating the piece instance.');
		});*/
		const url = `${baseUrl1}/api/piece-instance/update` +
		    `?qty=${qty}` +
		    `&lblLoadId=${lblLoadId}` +
		    `&contractId=${contractId}` +
		    `&phaseLoadId=${phaseLoadId}` +
		    `&chkLoadItemValue=${chkLoadItemValue}` +
		    `&factory_id=${selectedFactoryId}`;

		$.ajax({
		    url: url,
		    type: 'POST',
		    contentType: 'application/json',
		    data: JSON.stringify(data),
		    xhrFields: {
		        withCredentials: true
		    },
			contentType: 'application/json',
			   data: JSON.stringify(data),

			   success: function (text) {

			       console.log("Response:", text);

			       // SAME popup code pattern
			       $('body').append(
			           '<div id="popup" class="popup">' +
			           'Updated Successfully!' +
			           '</div>'
			       );

			       setTimeout(function () {
			           $('#popup').fadeOut(400, function () {
			               $(this).remove();
			           });
			       }, 2500);

			       updatelotdetail();
			       $("#load").change();
			       getloaddata(contractId,phaseLoadId,lblLoadId,supplierId);
			       document.getElementById('gvLoadedList').hidden = false;
			   },

			   error: function (xhr, status, error) {
			       console.error('Error:', error);
			       alert('Error while updating the piece instance.');
			   }
			   });
	}

	function updatelotdetail() {
		  const tloadid=window.selectedTloadId; 
		    const url = new URL(`/api/lotdetail/load/pieces-in-load?tLoadId=${tloadid}&factory_id=${selectedFactoryId}`,baseUrl1);

		fetch(url, { credentials: "include" })
		        .then(response => {
		            console.log("Response status:", response.status);
		            if (!response.ok) {
		                throw new Error(`HTTP error! Status: ${response.status}`);
		            }
		            return response.json();
		        })
		        .then(data => {
		            console.log("API Response for load details:", data);
		            const tableBody = $("#tableID3 tbody");
		            tableBody.empty();
					const tableBody2 = $("#gvLoadedList tbody");
					          tableBody2.empty();

		            if (Array.isArray(data) && data.length > 0) {
		                data.forEach(item => {
		                    const row = `
		                        <tr>
		                            <td>${item.qty || ''}</td>
		                            <td>${item.mark || ''}</td>
		                            <td>${item.descr || ''}</td>
		                            <td>${item.tweight || ''}</td>
		                            <td>${item.ssize || ''}</td>
		                            <td>${item.dims || ''}</td>
									<td>${item.pzone || ''}</td>
									<td>${item.pload || ''}</td>
									<td>${item.fab || ''}</td>
									<td>${item.finishedgoodslocation || ''}</td>
		                        </tr>`;
		                    tableBody.append(row);
							
							const row2 = `
							<tr> 
							                        <td><input type="radio" class="radio-item" name="radio-group" data-id="${item.id}" /></td> <!-- Radio Button -->
												   	  <td class="hide-column">${item.pieces_id || ''}</td> <!-- Hidden Column -->
													  <td class="hide-column">${item.load_id || ''}</td> <!-- Hidden Column -->
													  <td class="hide-column">${item.tload_id || ''}</td> <!-- Hidden Column -->
													  <td class="hide-column">${item.locfg_id || ''}</td> <!-- Hidden Column -->
							                           <td id="qty-${item.id}">${item.qty || ''}</td>
							                           <td>${item.mark || ''}</td>
							                           <td>${item.descr || ''}</td>
							                           <td>${item.tweight || ''}</td>
							                       </tr>`;
							                   tableBody2.append(row2);
		                });
						
					
		            } else {
		                console.error("No data available or response is not an array.");
		                tableBody.append('<tr><td colspan="10" class="text-center">No data available</td></tr>');
		            }
		        })
		        .catch(error => {
		            console.error("Error fetching packing note details:", error);
		            const tableBody = $("#tableID3 tbody");
		            tableBody.empty();
					
		            tableBody.append('<tr><td colspan="10" class="text-center text-danger">Failed to load data. Please try again.</td></tr>');
					const tableBody2 = $("#gvLoadedList tbody");
					          tableBody2.empty();
					          tableBody2.append('<tr><td colspan="4" class="text-center text-danger">Failed to load data. Please try again.</td></tr>');
		        });
		}
		

		
		let selectedPieceId, selectedLoad, selectedTloadId, selectedQty,selectedlogfgId;

		$(document).on('change', '.radio-item', function() {
		    const isChecked = $(this).prop('checked'); // Get the checked status of the radio button
		    const row = $(this).closest('tr'); // Get the row of the radio button
		    const itemId = $(this).data('id'); // Get the item ID
		    const piecesId = row.find('.hide-column').eq(0).text();  // Get pieces_id from the first hidden column
		    const loadId = row.find('.hide-column').eq(1).text();  // Get load_id from the second hidden column
		    const tloadId = row.find('.hide-column').eq(2).text(); // Get tload_id from the third hidden column
			const logfgId = row.find('.hide-column').eq(3).text(); // Get tload_id from the fourth hidden column
		    const qty = document.getElementById(`qty-${itemId}`).textContent; // Get qty from the table cell

		    if (isChecked) {
		        // Store the selected values
		        selectedPieceId = piecesId;
		        selectedLoad = loadId;
		        selectedTloadId = tloadId;
		        selectedQty = qty;
				selectedlogfgId=logfgId;

		        console.log('Radio selected! pieces_id:', piecesId);
		        console.log('load_id:', loadId);
		        console.log('tload_id:', tloadId);
		        console.log('qty:', qty);
				console.log('locfg_id',logfgId);
		    }
		});

		function onUnloadClicked(){
	/*	 const supplierId = localStorage.getItem("selectedSupplierId");
				const url = new URL(`/api/piecesunload/update?qty=${selectedQty}&tloadId=${selectedTloadId}&piecesId=${selectedPieceId}&loadId=${selectedLoad}&supplierId=${supplierId}&factory_id=${selectedFactoryId}`,baseUrl1);
			    // Use the fetch API to send the POST request
				// Use the fetch API to send the POST request
				fetch(url, {  // Corrected here by moving the options object after the URL
				    method: 'POST',  // Use POST method
					xhrFields: {
						    withCredentials: true
						},
				    headers: {
				        'Content-Type': 'application/json'  // Specify the content type as JSON
				    }
				})
				.then(response => response.text()) // Parse the JSON response
				.then(text => {
				    // Handle the response here
				    console.log('Success:', text);
				    
				    // You can show a success message to the user, or update the UI
				    alert(text);  // Assuming the response contains a "message" field
					updatelotdetail();
					$("#load").change();
					getloaddata();
					const tbody = document.getElementById('gvLoadedList');
					tbody.hidden=false;
				})
				.catch((error) => {
				    // Handle errors here
				    console.error('Error:', error);
				    alert('Error while updating the piece instance.');
				});*/
				const supplierId = localStorage.getItem("selectedSupplierId");

				const url = `${baseUrl1}/api/piecesunload/update` +
				    `?qty=${selectedQty}` +
				    `&tloadId=${selectedTloadId}` +
				    `&piecesId=${selectedPieceId}` +
				    `&loadId=${selectedLoad}` +
				    `&supplierId=${supplierId}` +
					`&locfgId=${selectedlogfgId}` +
				    `&factory_id=${selectedFactoryId}`;

				$.ajax({
				    url: url,
				    type: 'POST',
				    xhrFields: {
				        withCredentials: true
				    },
				    contentType: 'application/json',

				    success: function (text) {
				        console.log('Success:', text);

				        // SAME popup code you are using everywhere
				        $('body').append(
				            '<div id="popup" class="popup">' +
				            "UPDATE SUCCESSFULL" +
				            '</div>'
				        );

				        setTimeout(function () {
				            $('#popup').fadeOut(400, function () {
				                $(this).remove();
				            });
				        }, 2500);

				        updatelotdetail();
				        $("#load").change();
				        getloaddata(contractId,phaseId,selectedLoad,supplierId);
				        document.getElementById('gvLoadedList').hidden = false;
				    },

				    error: function (xhr, status, error) {
				        console.error('Error:', error);
				        alert('Error while updating the piece instance.');
				    }
				});
		}







