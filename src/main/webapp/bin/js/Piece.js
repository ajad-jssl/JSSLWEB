//Contract Fetching
function getcontractlist() {
    const supplierId = '168'; // Replace dynamically if needed
    const url = new URL(`/api/contractlists?supplierId=${supplierId}`,baseUrl1);

	fetch(url, { credentials: "include" })
	        .then(response => {
	            if (!response.ok) {
	                throw new Error(`HTTP error! Status: ${response.status}`);
	            }
	            return response.json();
	        })                                                        
	        .then(data => {
	            console.log("API Response:", data);

	            if (Array.isArray(data)) {
	                const contractSelect = document.getElementById("contract");

	                // Clear existing options
	                contractSelect.innerHTML = ''; 

	                // Add placeholder option
	                let optionsHTML = '<option value="" selected>Select contract</option>';

	                data.forEach(contract => {
	                    const contractName = contract.contractName || "Unnamed Contract";
	                    const contractId = contract.contractId || '';

	                    optionsHTML += `<option value="${contractId}">${contractName}</option>`;
	                });

	                // Append all options to the dropdown
	                contractSelect.innerHTML = optionsHTML;
					// Reinitialize Select2 after the dropdown is populated
					            $('#contract').select2({
					                placeholder: "Select contract", // Placeholder text
					                allowClear: true, // Option to clear the selection
					                width: '100%' // Ensure Select2 takes full width of the container
					            });
	            } else {
	                console.error("Error: Data is not an array.", data);
	            }
	        })
	        .catch(error => {
	            console.error("Error fetching contract details:", error);
	        });
	}
  //End

  //Load Fetching
	function getload(contractId, supId) {
	    const url = new URL('/api/listload',baseUrl1);
	    url.searchParams.append('contractId', contractId);
	    url.searchParams.append('supId', supId);

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
	                const loadSelect = $("#load");
	                loadSelect.empty(); // Clear existing options
	                loadSelect.append('<option value="0" selected>Select load</option>'); // Default select option
	                data.forEach(load => {
	                    const loadName = load.pload || "Unnamed load";
	                    const loadId = load.loadId || '';
	                    loadSelect.append(`<option value="${loadId}">${loadName}</option>`);
	                });
				/*	// Reinitialize Select2 after the dropdown is populated
										            $('#load').select2({
										                placeholder: "Select Load", // Placeholder text
										                allowClear: true, // Option to clear the selection
										                width: '100%' // Ensure Select2 takes full width of the container
										            });*/
	            } else { 
	                console.error("Error: Data is not an array.", data); 
	            }
	        })
	        .catch(error => {
	            console.error("Error fetching load details:", error);
	        });
	}
 
	// Event listener for contract dropdown change
	$(document).ready(function () {
	    getcontractlist();  // Assume this is a function that loads contracts

	    $("#contract").change(function () {
	        const contractId = $(this).val();
	        const supId = '168'; // Replace dynamically if needed
	        
	        if (contractId) {
	            getload(contractId, supId); // Fetch loads for the selected contractor
	        }
	    });	 
	});
 //End	
	
 //Weight Fetching	
 function getWeight(Load_Id) {  
 	    const url = new URL(`/api/Weight?load_id=${Load_Id}`,baseUrl1);
 	    console.log('Request URL:', url.toString()); // Log the URL for debugging


 		fetch(url, { credentials: "include" })
 		    .then(response => {
 		        console.log('Response status:', response.status); // Log response status
 		        if (!response.ok) {
 		            throw new Error(`HTTP error! Status: ${response.status}`);
 		        }
 		        return response.json(); // Parse the response as JSON
 		    })
 		    .then(data => {
 		        console.log('API Response:', data); // Log the full response for inspection

 		        // Check if data has the 'weight' property
 		        if (data &&  data[0].weight) {
 		            const weight = data[0].weight; // Assuming the weight is directly in the 'weight' field
 		            console.log('Weight:', weight); // Log the weight to verify it's correctly fetched

 		            // Using jQuery to set the value of the input with ID 'weight'
 		            $("#weight").val(weight); 
 		        } else {
 		            console.log('No weight found in the response');
 		            // Set a default value using jQuery if no weight is found
 		            $("#weight").val("No weight found");
 		        }
 		    })
 		    .catch(error => {
 		        console.error("There was a problem with the fetch operation:", error.message);
 		        // Set a default value using jQuery in case of error
 		        $("#weight").val("No weight found");
 		    });
 	}
   //End
 
  //Piece Monitoring Entry
	function updatePieceMonitoringEntry(Load_Id, Sup_Id) {
	    const url =new URL(`/getAssemblyStagesForLoadSubcon?Load_Id=${Load_Id}&Sup_Id=${Sup_Id}`,baseUrl1);
	    console.log("Fetching data from URL:", url);

	 fetch(url, { credentials: "include" })
	        .then(response => {
	            console.log("Response status:", response.status);
	            if (!response.ok) {
	                throw new Error(`HTTP error! Status: ${response.status}`);
	            }
	            return response.json();
	        })
	        .then(data => {
	            console.log("API Response for Piece Monitoring Entry:", data);
	            const tableBody = $("#TableID tbody");
	            tableBody.empty();  // Clear existing table data

	            // Show container1 (the table) when data is fetched
	            $("#container1").show();
	            $("#TableID").show(); // Show the table inside container1

	            // Hide container2 when Load_Id is selected (we are dealing with table view)
	            $("#container2").hide();

	            if (Array.isArray(data) && data.length > 0) {
	                data.forEach(item => {
	                    const row = `
	                        <tr>
								<td class="hide-column">${item.pieces_id|| ''}</td> <!-- Hidden Column -->
	                            <td>${item.qty || ''}</td>
	                            <td>${item.assembled || ''}</td>
	                            <td>${item.welded || ''}</td>
	                            <td>${item.treated || ''}</td>
	                            <td>
	                                <a href="#" class="mark-link" 
	                                   data-mark="${item.mark || ''}"
	                                   data-qty="${item.qty || ''}"
	                                   data-assembled="${item.assembled || ''}"
	                                   data-welded="${item.welded || ''}"
									   data-pieces_id="${item.pieces_id || ''}"
	                                   data-treated="${item.treated || ''}">
	                                   ${item.mark || ''}
	                                </a>
	                            </td>
	                            <td>${item.descr || ''}</td>
	                            <td>${item.ssize || ''}</td>
	                        </tr>`;
	                    tableBody.append(row);
	                });
	            } else {
	                console.error("No data available or response is not an array.");
	                tableBody.append('<tr><td colspan="7" class="text-center">No data available</td></tr>');
	            }
	        })
	        .catch(error => {
	            console.error("Error fetching Piece Monitoring Entry:", error);
	            const tableBody = $("#TableID tbody");
	            tableBody.empty();  // Clear existing table data

	            // Hide container1 and show a message in case of error
	            $("#container1").hide();
	            $("#TableID").hide();

	            tableBody.append('<tr><td colspan="7" class="text-center text-danger">Failed to load data. Please try again.</td></tr>');
	        });
	} 
	


	$(document).ready(function () {
	    // Declare global variables to store assembled, welded, and treated values
	    var globalAssembled = 0;
	    var globalWelded = 0;
	    var globalTreated = 0;
	    var globalQty = 0;  // Store the initial qty

	    // Event delegation for clicking mark links
	    $(document).on("click", ".mark-link", function (e) {
	        e.preventDefault();  // Prevent default link behavior

	        var selectedMark = $(this).data("mark"); // Get the mark number from the data attribute
	        globalQty = parseFloat($(this).data("qty")) || 0; // Get qty from data attribute
	        globalAssembled = parseFloat($(this).data("assembled")) || 0; // Get assembled from data attribute
	        globalWelded = parseFloat($(this).data("welded")) || 0;     // Get welded from data attribute
	        globalTreated = parseFloat($(this).data("treated")) || 0;   // Get treated from data attribute
	        
	        window.selectedMarkData = { // Store data globally
	            assembled: globalAssembled,
	            welded: globalWelded,
	            treated: globalTreated,
	            qty: globalQty
	        };
	        
	        // Store selected mark and pieces id globally
	        window.selectedMark = selectedMark;
	        const piecesId = $(this).data('pieces_id');
	        window.selectedPiecesId = piecesId;

	        // Debugging: Check if 'assembled' data is being set correctly
	        console.log("Data for assembled:", globalAssembled);

	        // Reset form fields with data from the clicked mark
	        $("#assembled").val(globalAssembled || "0");  // Default to 0 if not provided
	        $("#welded").val(globalWelded || "0");
	        $("#treated").val(globalTreated || "0");

	        // Set the initial qty value when mark is clicked
	        $("#qty").val(globalQty);

	        // Adjust qty based on selected stage
	        var stage = $("#stage").val();  // Get the selected stage value (1, 2, or 3)
	        
	        // Update qty based on stage
	        updateQtyBasedOnStage(stage);

	        // Highlight the clicked link
	        $(".mark-link").removeClass("highlight");
	        $(this).addClass("highlight");

	        // Show the selected mark number in container2
	        $("#selectedMarkNumber").text(selectedMark); // Display the selected mark number in container2
	        $("#container2").show(); // Show container2 with the selected mark

	        // Show container1 (optional, depending on your design)
	        $("#container1").show();

	        console.log("Selected Mark: " + selectedMark); // Debug log
	    });

	    // Update qty when stage dropdown is changed
	    $("#stage").on("change", function() {
	        // Get the current qty and the values from the form fields
	        var stage = $(this).val(); // Get the selected stage value (1, 2, or 3)

	        // Debugging: Check the value of 'assembled' when the stage changes
	        console.log("Assembled value on stage change:", globalAssembled);

	        // Update qty based on stage
	        updateQtyBasedOnStage(stage);
	    });

	    // Function to update qty based on the selected stage
	    function updateQtyBasedOnStage(stage) {
	        var updatedQty = globalQty; // Initialize with the base qty value

	        // Ensure the treated quantity is only shown after welding is complete
	        if (stage === "3") { // Treated selected
	            if (globalWelded < globalAssembled) {
	                console.log("Welding is not completed yet. Treated quantity cannot be shown.");
	                return; // Prevent showing treated qty if welding is not completed
	            }
	            updatedQty = globalWelded - globalTreated; // Show treated qty only after welding is complete
	        } else if (stage === "2") { // Welded selected
	            updatedQty = globalAssembled - globalWelded;
	        } else if (stage === "1") { // Assembled selected
	            updatedQty = globalQty - globalAssembled;
	        }

	        // Update the qty field with the updated value after subtraction
	        $("#qty").val(updatedQty);

	        // Debugging: Log the updated qty value
	        console.log("Updated qty after stage change:", updatedQty);
	    }
	});
	    // Reset button functionality
	    $("#resetButton").click(function () {
	        $("#stage").val("1"); // Reset to default stage
	        $("#qty").val(""); // Clear the quantity field
	        $("#assembled").val(""); // Clear assembled field
	        $("#welded").val(""); // Clear welded field
	        $("#treated").val(""); // Clear treated field
	        $(".mark-link").removeClass("highlight"); // Remove highlight from all mark links
	        window.selectedMark = null; // Clear the selected mark
	        $("#container2").hide(); // Hide container2 when reset
	        $("#container1").show(); // Show container1 (table) again
	    });

	    // Fetch loads when a contractor is selected
	    $("#contract").change(function () {
	        const contractId = $(this).val();
	        const supId = '168'; // Replace dynamically if needed
	        if (contractId) {
	            getload(contractId, supId);
	        }
	    });

	    // Update monitoring entry when a load is selected
	    $("#load").change(function () {
	        const sup_Id = '168'; // Replace dynamically if needed
	        const Load_Id = $("#load option:selected").val();

	        // Hide container2 when Load_Id is selected
	        $("#container2").hide();

	        if (Load_Id) {
	            // Show container1 (the table) when a load is selected
	            $("#container1").show();
	            updatePieceMonitoringEntry(Load_Id, sup_Id);
				getWeight(Load_Id);
	        } else {
	            // Hide container1 if no Load_Id is selected
	            $("#container1").hide();
	        }
			
	    });
	// Optionally, handle contract selection change (if necessary)
	$("#contract").change(function () {
	    // Uncomment below line to dynamically fetch and update data based on contract selection
	    // const Load_Id = $("#LoadIdInput").val(); 
	    // const Sup_Id = $("#SupIdInput").val(); 
	    // updatePieceMonitoringEntry(Load_Id, Sup_Id);
	});
  //End
  
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

        const stageId = $("#stage option:selected").val();
        const Load_Id = $("#load option:selected").val();
        const pieces_id = window.selectedPiecesId;
        const selectedpieces_id = `${pieces_id}`;

        // Call the function to fetch data and proceed with creation
        GetPiecesNotDoneForStageRequest(selectedpieces_id, Load_Id, stageId);
    });
});

function GetPiecesNotDoneForStageRequest(selectedpieces_id, Load_Id, stageId) {
    console.log("Fetching data for:", selectedpieces_id, Load_Id, stageId);

    const url = new URL(`/api/pieces/getPiecesNotDoneForStage?piecesId=${selectedpieces_id}&LoadId=${Load_Id}&PieceStagesId=${stageId}`,baseUrl1);
    
    // Fetch the data
  fetch(url, { credentials: "include" })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Network response was not ok');
            }
        })
        .then(data => {
            console.log('API Response:', data);  // Log the API response

            // Ensure the data contains valid pieceinstance_ids
            var pieceinstance_ids = data.map(item => item.instance_id);

            console.log('Piece instance IDs:', pieceinstance_ids);  // Log the pieceinstance_ids

            // If no valid piece instance IDs, show error and exit
            if (!Array.isArray(pieceinstance_ids) || pieceinstance_ids.length === 0) {
                alert("Quantity is not available.");
                return;  // Exit the function if no valid IDs are available
            }

            // Proceed to create the record after successful validation
            addevent(pieceinstance_ids, selectedpieces_id, stageId);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            alert('An error occurred while fetching the data.');
        });
}

function addevent(pieceinstance_ids, selectedpieces_id, stageId) {
    console.log('Processing to add event with pieceinstance_ids:', pieceinstance_ids);

    const globalAssembled = window.selectedMarkData?.assembled;
    const globalWelded = window.selectedMarkData?.welded;
    const qty = window.selectedMarkData?.qty;
    const batchSize = parseInt($("#qty").val(), 10);

    if (isNaN(batchSize) || batchSize <= 0) {
        alert("Please enter a valid quantity.");
        return;
    }

    if (!Array.isArray(pieceinstance_ids) || pieceinstance_ids.length === 0) {
        alert("No valid piece instance IDs available.");
        return;  // Exit early if the array is empty or invalid
    }

    let errorMessage = "";

    // Validation based on the selected stage
    if (stageId === "1" && batchSize > qty) {
        errorMessage = "You cannot enter a quantity greater than the available assembled quantity.";
    } else if (stageId === "2" && batchSize > globalAssembled) {
        errorMessage = "You cannot enter a quantity greater than the available welded quantity.";
    } else if (stageId === "3" && batchSize > globalWelded) {
        errorMessage = "You cannot enter a quantity greater than the available treated quantity.";
    }

    if (errorMessage) {
        alert(errorMessage);  // Show error if validation fails
        return;
    }

    const requestsToSend = Math.min(batchSize, pieceinstance_ids.length);

    updateKeyValue().then(() => {
        const batchId = window.keyvalue;

        for (let i = 0; i < requestsToSend; i++) {
            const pieceinstance_id = pieceinstance_ids[i];
            const requestData = {
                "pieces_id": selectedpieces_id,
                "pieceinstance_id": pieceinstance_id,
                "piecestages_id": stageId,
                "stagedatetime": new Date().toISOString(),
                "user_id": createdById,
                "created": new Date().toISOString(),
                "workby": "",
                "revision": null,
                "line_id": 0,
                "piecestagenotes_id": 0,
                "batch_id": batchId,
                "dft": null,
                "fabsupplier_id": 0,
                "userid": null,
                "udtm": null
            };

            console.log('Sending individual data:', i + 1, requestData);

            $.ajax({
                url: new URL('/api/piecestages',baseUrl1),
                type: 'POST',
				xhrFields: {
					    withCredentials: true
					},
                contentType: 'application/json',
                data: JSON.stringify(requestData),
                dataType: 'json',
                success: function (data, textStatus, xhr) {
                    console.log('Success response:', data);

                    if (xhr.status === 201) {
                        var popup = $('<div class="popup">Created Successfully!</div>').appendTo('body').hide().fadeIn(400);
                        setTimeout(function () {
                            popup.fadeOut(400, function () {
                                $(this).remove();
								//window.location.href = "PMonitoring.jsp"; 
                            });
                        }, 2000);
                        $('#load').trigger('change');
                    } else {
                        alert("Record not inserted. Please try again.");
                    }
                },
                error: function (xhr, status, error) {
                    console.error('Error:', error);
                    var popup1 = $('<div class="popup1">An error occurred while creating the record.</div>').appendTo('body').hide().fadeIn(400);
                    setTimeout(function () {
                        popup1.fadeOut(400, function () {
                            $(this).remove();
                        });
                    }, 2000);
                }
            });
        }
    });
}

function updateKeyValue() {
    return fetch(new URL('/updateKeyValue',baseUrl1), {
	    credentials: "include"
	})
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            window.keyvalue = data;
            return data;
        })
        .catch(error => {
            console.error('There was an error with the fetch operation:', error);
            alert('Error updating keyvalue');
        });
}

   // Function to display the popup with a custom error message
   function showPopup(message) {
       const popup = document.getElementById('popup-error');
       const popupMessage = document.getElementById('popup-message');
       
       // Set the error message in the popup
       popupMessage.textContent = message;

       // Add the 'show' class to trigger the fade-in animation
       popup.classList.add('show');

       // Optional: Auto-hide the popup after 3 seconds
       setTimeout(function() {
           hidePopup();
       }, 3000); // Adjust the time as needed
   }

   // Function to hide the popup
   function hidePopup() {
       const popup = document.getElementById('popup-error');
       
       // Add the fade-out animation class
       popup.classList.add('fade-out');

       // After the animation ends, hide the popup and reset animation
       setTimeout(function() {
           popup.classList.remove('show', 'fade-out');
       }, 500); // Time matching the animation duration
   }

   // Close button functionality
   document.getElementById('popup-close').addEventListener('click', hidePopup);

  

