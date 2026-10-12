document.addEventListener("DOMContentLoaded", async function () {
    await loadActions();

    
});


const MainPage = 'AmsMaster.jsp';
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


document.getElementById("modalScroll1").addEventListener("click", function () {
    // show custom message instead of opening modal
	  const allowed = allowedActions || [];

	if (!allowed.includes("Insert")) {
	  alert(" You do not have permission to Insert.");
	  $('#exampleModalScrollableIN').modal('hide');
	  return;
	}
	$('#exampleModalScrollableIN').modal('show');
})

document.getElementById("modalScroll1assetmod").addEventListener("click", function () {
    // show custom message instead of opening modal
	  const allowed = allowedActions || [];

	if (!allowed.includes("Insert")) {
	  alert(" You do not have permission to Insert.");
	  $('#exampleModalScrollableAssetModel').modal('hide');
	  return;
	}
	$('#exampleModalScrollableAssetModel').modal('show');
})

document.getElementById("modalScroll1assetsat").addEventListener("click", function () {
    // show custom message instead of opening modal
	  const allowed = allowedActions || [];

	if (!allowed.includes("Insert")) {
	  alert(" You do not have permission to Insert.");
	  $('#exampleModalScrollableStatus').modal('hide');
	  return;
	}
	$('#exampleModalScrollableStatus').modal('show');
})

document.getElementById("modalScroll1assetown").addEventListener("click", function () {
    // show custom message instead of opening modal
	  const allowed = allowedActions || [];

	if (!allowed.includes("Insert")) {
	  alert(" You do not have permission to Insert.");
	  $('#exampleModalScrollableLocation').modal('hide');
	  return;
	}
	$('#exampleModalScrollableLocation').modal('show');
})

document.getElementById("modalScroll1assetmake").addEventListener("click", function () {
    // show custom message instead of opening modal
	  const allowed =allowedActions || [];

	if (!allowed.includes("Insert")) {
	  alert(" You do not have permission to Insert.");
	  $('#exampleModalScrollableMaker').modal('hide');
	  return;
	}
	$('#exampleModalScrollableMaker').modal('show');
})

let selectTypeId = null;

let original_assetType = null;


function getIndianDateTimeFormat(date) {
    const options = {
        timeZone: 'Asia/Kolkata',
        hour12: false,
    };
    const istDate = new Date(date.toLocaleString('en-US', options));
    return `${istDate.getFullYear()}-${(istDate.getMonth() + 1).toString().padStart(2, '0')}-${istDate.getDate().toString().padStart(2, '0')}T${istDate.getHours().toString().padStart(2, '0')}:${istDate.getMinutes().toString().padStart(2, '0')}:${istDate.getSeconds().toString().padStart(2, '0')}`;
}


$(document).ready(function (){
	
	

	    const radio = sessionStorage.getItem("selectedAssetRadio");

	    if (radio) {
	        $("#" + radio).prop("checked", true).trigger("change");
	        sessionStorage.removeItem("selectedAssetRadio");
	    }


	
$("#createassettype").click(function(){
	
	
	console.log("create was cliked");
	
	let asset_type =$('#assettype').val().trim();
	
	if(!asset_type){
		$('#assettypeError').show();
		return ;
	}
	else{
		
		$('#assettypeError').hide();
		}
		console.log("Create clicked - Modal will show");
		$("#exampleModalCenter80").modal("show");
});


// Create - "No" button click
$(".btn-secondary[data-dismiss='modal']").click(function () {
       console.log("No clicked - Modal will hide");
       $("#exampleModalCenter80").modal("hide");
   });


   

   // Create - "Yes" button click
   $(document).on("click", "#confirmasset_typeYes", function () {
       console.log("Yes clicked - Proceeding with creation");
       $("#exampleModalCenter80").modal("hide");
	$('#exampleModalScrollableIN').modal("hide");
       handleAddAssetType();
   });


   



   
   
   
   
 	
	
});



function  handleAddAssetType(){
	
	let asset_type =$('#assettype').val().trim();
	// Check for duplicate Asset Type
	$.ajax({
		url: new URL(`/api/ams/check?asset_type=${encodeURIComponent(asset_type)}`, baseUrl).toString(),
	    type: 'GET',
	    xhrFields: {
	        withCredentials: true
	    },
	    success: function (response) {
	        if (response.exists) {
	            showModalPopup("Asset type already exists!");
	            // alert("Asset type already exists!");
	        } else {
	            insertAssetType(asset_type);
	        }
	    },
	    error: function (xhr, status, error) {
	        console.error("Check API Error:", error);
	        alert("An error occurred while checking: " + error);
	    }
	});

	
	
}

function insertAssetType(assetTypeName) {
	let currentDateTimeString = getIndianDateTimeFormat(new Date());

    // Prepare JSON request as per your backend requirement
    var requestData = {
        "type_id": null,                  // Let backend auto-generate (IDENTITY)
        "assetType": assetTypeName,      // asset type name from input
        "created_by":  sessionStorage.getItem('id'),
        "created_date": currentDateTimeString,
        "modified_by": null,
        "modified_date": null
    };
	const url = new URL('/api/ams', baseUrl); 
    $.ajax({
        url: url.toString(),   // ✅ Correct API endpoint
        type: "POST",
        xhrFields: {
            withCredentials: true
        },
        contentType: "application/json",
        data: JSON.stringify(requestData),
        dataType: "json",

        success: function (response) {
            if (response && response.status === "Success") {
                showPopup("Inserted Successfully", "AmsMasterRegister.jsp");
                fetchAssetTypes(); // reload list after insert
            } else {
                alert("Record not inserted. Please try again.");
            }
        },

        error: function (xhr, status, error) {
            console.error("Insert AJAX Error:", error);
            alert("An error occurred while inserting: " + error);
        }
    });
}


async function fetchAssetTypes() {
	const apiUrl = new URL('/api/ams/getall', baseUrl);



    try {
        const response = await fetch(apiUrl, {
            method: "GET",
            credentials: "include"
        });

        if (!response.ok) throw new Error("Failed to fetch asset types");

        const assetTypes = await response.json();
        const table = $('#assetTableID').DataTable();
        table.clear();

        // Loop all types and check if used
        for (const [index, item] of assetTypes.entries()) {

			const checkUrl = `${baseUrl}/api/ams/entry/asset_type/${item.type_id}`;

            let typeUsed = false; // store API result

            try {
				let checkResponse = await fetch(checkUrl, {
				    method: "GET",
				    credentials: "include"
				});
                if (checkResponse.ok) {
                    typeUsed = await checkResponse.json(); // true/false
                }
            } catch (e) {
                console.error("Check failed", e);
            }

          
            const editIcon = typeUsed
                ? `<i class="fa fa-pen text-secondary" title="Already in use" style="cursor:not-allowed; opacity:0.3;"></i>`
                : `<i class="fa fa-pen text-muted cursor-pointer" onclick="editAssetType(${item.type_id})" title="Edit"></i>`;

            table.row.add([
                index + 1,
             
             item.code +" - "+ item.assetType || "",
                editIcon
            ]);
        }

        table.draw();

    } catch (error) {
        console.error('Error fetching asset types:', error);
    }
}



async function editAssetType(type_id) {
			  const allowed = allowedActions || [];

	if (!allowed.includes("Edit")) {
	  alert(" You do not have permission to edit.");
	  return;
	}
    console.log("Edit clicked for ID:", type_id);

	const apiUrl = new URL(`/api/ams/${type_id}`, baseUrl).toString();

    try {
        const response = await fetch(apiUrl, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
			credentials :"include"
        });

        if (!response.ok) throw new Error("Failed to fetch asset type details");

        const data = await response.json();
        console.log("Fetched data:", data);

		original_assetType =  data.assetType;
        // ✅ Prefill input and store ID
        $('#uptassettype').val(data.assetType || "");
        $('#uptassettype').attr('data-type-id', data.type_id);

        // ✅ Show update modal
        $('#exampleModalScrollableConUp').modal('show');

    } catch (error) {
        console.error("Error fetching asset type:", error);
        alert("Failed to load asset type details. Please try again.");
    }
}


$(document).on('click', '#assettypeupd', function () {
    console.log("Update clicked - Validating before opening confirmation modal");

    const updatedAssetType = $('#uptassettype').val().trim();

    if (!updatedAssetType) {
        
        $('#uptassettypeError').show();
        return;
    } else {
        $('#uptassettypeError').hide();
   
        $('#exampleModalCenter360').modal('show');
    }
});


$(document).on('click', '#confirmassetypeupd', function () {
    console.log("YES clicked — checking for duplicates before update");
    $('#exampleModalCenter360').modal('hide');
	checkDuplicateBeforeUpdate();
});




// ❌ NO — cancel update
$(document).on('click', '#cancelassetype', function () {
    console.log("NO clicked — closing confirmation modal");
    $('#exampleModalCenter360').modal('hide');
});



 // Check this Duplication Operation  before sending the data to updated 
 
 
 
 async function checkDuplicateBeforeUpdate() {

	let updatedAssetType = $('#uptassettype').val().trim();
	  let selectedAssetTypeId = $('#uptassettype').attr('data-type-id');

	  console.log("Entered checkDuplicateBeforeUpdate");
	  console.log("Updated Value:", updatedAssetType);
	  console.log("Selected Type ID:", selectedAssetTypeId);

	  $.ajax({
		url :`${baseUrl}/api/ams/check?asset_type=${encodeURIComponent(updatedAssetType)}`,
	      type: 'GET',
	      xhrFields: { withCredentials: true },
	      success: function (response) {
	          console.log("Duplicate check response:", response);

	          // ✅ If it exists and it’s NOT the same record → duplicate
	          if (response.exists && Number(response.type_id) !== Number(selectedAssetTypeId)) {
	              console.log("Duplicate found — blocking update");
	              showModalPopup("Asset type already exists!");
	          } else {
	              console.log("No duplicate found — proceeding with update");
	              updateAssetType(); // safe to update
	          }
	      },
	      error: function (xhr, status, error) {
	          console.error("Check API Error:", error);
	          alert("An error occurred while checking: " + error);
	      }
	  });
 }





// ✅ Perform PUT update
async function updateAssetType() {
    const updatedAssetType = $('#uptassettype').val().trim();
    const selectedAssetTypeId = $('#uptassettype').attr('data-type-id');
	

	if (original_assetType.trim() === updatedAssetType.trim()) {
		showModalPopup("Asset type already exists!");
            return;
	}

	const apiUrl = `${baseUrl}/api/ams/${selectedAssetTypeId}`;
    const payload = {
        assetType: updatedAssetType,
        modifiedBy:sessionStorage.getItem("id"),
        modifiedDate: getIndianDateTimeFormat(new Date())
    };

    try {
        const response = await fetch(apiUrl, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
			credentials :"include",
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            showPopup("Asset Type updated successfully!", "AmsMasterRegister.jsp");
            $('#exampleModalScrollableConUp').modal('hide');
            fetchAssetTypes(); // refresh table
        } else {
            alert("Failed to update asset type.");
        }

    } catch (error) {
        console.error("Error updating asset type:", error);
        alert("Error updating asset type.");
    }
}



















// AssetMOdel js 

$("#submitassetModel").click(function () {
      console.log("Create Asset Model button clicked");

      let asset_model = $('#assetModel').val().trim();

      if (!asset_model) {
          $('#assetModelError').show();
          return;
      } else {
          $('#assetModelError').hide();
      }

      console.log("Validation passed — showing confirmation modal");
      $("#exampleModalCenter85").modal("show"); // show confirmation modal
  });


  
  // 🔴 "NO" button click — close confirmation modal
  $(".btn-secondary[data-dismiss='modal']").click(function () {
      console.log("No clicked — hiding confirmation modal");
      $("#exampleModalCenter85").modal("hide");
  });

  // 🟢 "YES" button click — proceed with actual creation
  $("#confirmassetmodel").click(function () {
      console.log("Yes clicked — proceeding with Asset Model creation");

      // hide both modals
      $("#exampleModalCenter85").modal("hide");
      $("#exampleModalScrollableAssetModel").modal("hide");

      // ✅ your function to insert record (implement this)
      handleAddAssetModel();
  });
  
  
  function handleAddAssetModel() {
      const assetModel = $('#assetModel').val().trim();

      console.log("Checking if Asset Model already exists...");

      // 🔹 AJAX call to backend to check existence
      $.ajax({
		url: `${baseUrl}/api/ams/model/check?asset_model=${encodeURIComponent(assetModel)}`,
          type: "GET",
		  xhrFields: {
		      withCredentials: true   // 🔥 Added as you requested
		  },
          success: function (response) {
              console.log("Check response:", response);

              if (response.exists) {
                  // ⚠️ Already exists — show alert and stop
				  showModalPopup("Asset Model already exists!");
              } else {
                  // ✅ Not exists — proceed to insert
                  insertAssetModel(assetModel);
              }
          },
          error: function (xhr, status, error) {
              console.error("❌ Error checking Asset Model:", error);
              alert("Error checking Asset Model. Please try again.");
          }
      });
  }




  
  function insertAssetModel(assetModelName) {
      let currentDateTimeString = getIndianDateTimeFormat(new Date());

      // Prepare JSON request as per backend requirements
      var requestData = {
          "model_id": null,                // Let backend auto-generate IDENTITY
          "assetModel": assetModelName,    // Asset Model name from input
          "created_by": sessionStorage.getItem("id"),
          "created_date": currentDateTimeString,
          "modified_by": null,
          "modified_date": null
      };

      $.ajax({
       url: `${baseUrl}/api/ams/model`, // ✅ Correct API endpoint for models
          type: "POST",
          xhrFields: {
              withCredentials: true
          },
          contentType: "application/json",
          data: JSON.stringify(requestData),
          dataType: "json",

          success: function (response) {
              if (response && response.status === "Success") {
                  showPopup("Inserted Successfully", "AmsMasterRegister.jsp");
                  fetchAssetModels(); // reload list after insert (similar to fetchAssetTypes)
              } else {
                  alert("Record not inserted. Please try again.");
              }
          },

          error: function (xhr, status, error) {
              console.error("Insert AJAX Error:", error);
              alert("An error occurred while inserting Asset Model: " + error);
          }
      });
  }
  
  
  
  let orginalAssetModel = null;
  
  async function editAssetModel(model_id) {
		  const allowed = allowedActions || [];

	if (!allowed.includes("Edit")) {
	  alert(" You do not have permission to edit.");
	  return;
	}
      console.log("Edit clicked for Model ID:", model_id);

	  const apiUrl = `${baseUrl}/api/ams/model/get/${model_id}`;


      try {
          const response = await fetch(apiUrl, {
              method: "GET",
			  credentials:"include",
              headers: { "Content-Type": "application/json" }
          });

          if (!response.ok) throw new Error("Failed to fetch asset model details");

          const data = await response.json();
          console.log("Fetched Asset Model Data:", data);
		  orginalAssetModel  = data.assetModel;

          // ✅ Prefill input field in the update modal
          $('#uptassetmodel').val(data.assetModel || "");
          $('#uptassetmodel').attr('data-model-id', data.model_id);

          // ✅ Show update modal for Asset Model
          $('#exampleModalScrollableAssetModelUpdate').modal('show');

      } catch (error) {
          console.error("Error fetching asset model:", error);
          alert("Failed to load asset model details. Please try again.");
      }
  }

  

  async function fetchAssetModels() {
     const apiUrl = `${baseUrl}/api/ams/model/getAll`;// Backend GET endpoint

      try {
          const response = await fetch(apiUrl, {
              method: "GET",
              credentials: "include"
          });

          if (!response.ok) throw new Error("Failed to fetch asset models");

          const assetModels = await response.json(); 
          const table = $('#tableID1').DataTable();
          table.clear();

          // Loop & check each model usage
          for (const [index, item] of assetModels.entries()) {

			const checkUrl = `${baseUrl}/api/ams/entry/asset_model/${item.model_id}`;
              let modelUsed = false;  // store API result

              try {
                  let checkResponse = await fetch(checkUrl,{
					method:"GET",
					credentials:"include"
				  });
				  
                  if (checkResponse.ok) {
                      modelUsed = await checkResponse.json(); // API returns true/false
                  }
              } catch (error) {
                  console.error("Check failed", error);
              }

              // 🔁 Logic: true = disable, false = enable
              const editIcon = modelUsed
                  ? `<i class="fa fa-pen text-secondary" title="Already in use" style="cursor:not-allowed; opacity:0.3;"></i>`
                  : `<i class="fa fa-pen text-muted cursor-pointer" onclick="editAssetModel(${item.model_id})" title="Edit"></i>`;

              // Add row
              table.row.add([
                  index + 1,
                  (item.code + " - " + item.assetModel) || "",
                  editIcon
              ]);
          }

          table.draw();

      } catch (error) {
          console.error('Error fetching asset models:', error);
      }
  }


  
  $("#assetmodelupd").click(function () {
      const updatedAssetModel = $('#uptassetmodel').val().trim();

      if (!updatedAssetModel) {
          // ❌ Show validation error before confirmation
          $('#uptassetmodelError').show();
          return;
      } else {
          $('#uptassetmodelError').hide();
          // ✅ Show confirmation modal only if valid
          $('#exampleModalCenter17').modal('show');
      }
  });

  // ✅ "YES" button in confirmation modal
  $(document).on('click', '#confirmassetmodelupd', function () {
      console.log("YES clicked — checking for duplicate model before update");
      $('#exampleModalCenter17').modal('hide');
      checkDuplicateBeforeModelUpdate();
  });

  // ✅ "NO" button closes confirmation modal
  $(document).on('click', ".btn-secondary[data-dismiss='modal']", function () {
      $('#exampleModalCenter17').modal('hide');
  });


  // 🔍 Step 1: Check for duplicate before update
  function checkDuplicateBeforeModelUpdate() {
      const updatedAssetModel = $('#uptassetmodel').val().trim();
      const selectedModelId = $('#uptassetmodel').attr('data-model-id');

      console.log("Entered checkDuplicateBeforeModelUpdate");
      console.log("Updated Value:", updatedAssetModel);
      console.log("Selected Model ID:", selectedModelId);

      $.ajax({
		url: `${baseUrl}/api/ams/model/check?asset_model=${encodeURIComponent(updatedAssetModel)}`,

          type: 'GET',
          xhrFields: { withCredentials: true },
          success: function (response) {
              console.log("Duplicate check response:", response);

              // ✅ If record exists and is NOT the same one — block update
              if (response.exists && Number(response.model_id) !== Number(selectedModelId)) {
                  console.log("Duplicate found — blocking update");
                  showModalPopup("Asset Model already exists!");
              } else {
                  console.log("No duplicate found — proceeding with update");
                  updateAssetModel(); // safe to update
              }
          },
          error: function (xhr, status, error) {
              console.error("Check API Error:", error);
              alert("An error occurred while checking: " + error);
          }
      });
  }


  // ⚙️ Step 2: Perform the actual update (PUT)
  async function updateAssetModel() {
      const updatedAssetModel = $('#uptassetmodel').val().trim();
      const selectedModelId = $('#uptassetmodel').attr('data-model-id');

	  const apiUrl = `${baseUrl}/api/ams/model/${selectedModelId}`;
	  
	  
	  if(orginalAssetModel.toLowerCase() === updateAssetModel.toLowerCase()){
		showPopup("Nothing has Changed to Updated...!", "AmsMasterRegister.jsp");
		          $('#exampleModalScrollableAssetModelUpdate').modal('hide');
		return;
	  }
	  

      const payload = {
          assetModel: updatedAssetModel,
          modifiedBy: sessionStorage.getItem("id"),
          modifiedDate: getIndianDateTimeFormat(new Date())
      };

      try {
          const response = await fetch(apiUrl, {
              method: "PUT",
			  credentials:"include",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload)
          });

          if (response.ok) {
              showPopup("Asset Model updated successfully!", "AmsMasterRegister.jsp");
              $('#exampleModalScrollableAssetModelUpdate').modal('hide');
              fetchAssetModels(); // refresh table
          } else {
              alert("Failed to update Asset Model.");
          }

      } catch (error) {
          console.error("Error updating Asset Model:", error);
          alert("Error updating Asset Model.");
      }
  }
  
  
  
  
  
  
  
  // Asset Status Js 
  


  $("#createassetstatus").click(function () {
     
	
	let asset_status = $("#assetstatus").val().trim();
	
	
	if(!asset_status){
		$("#statusError").modal("show");
		return;
	}
	else{
		$("#stausError").modal("hide");
	}
	console.log("the validation is done continue with creation confirmation");
	$("#exampleModalCenter99").modal("show");
	
  });
  
  
  
$("#confirmassetstatus").click(function (){
	
	console.log("the confirm is clicked proced with insertion");
	
	$("#exampleModalCenter99").modal("hide");
	
handleAddAssetStatus();
		
});
  



function handleAddAssetStatus() {

    let asset_status = $("#assetstatus").val().trim();

    $.ajax({
		url: `${baseUrl}/api/ams/status/check?asset_status=${encodeURIComponent(asset_status)}`,

        type: 'GET',
        xhrFields: {
            withCredentials: true
        },
        success: function (response) {
            if (response.exists) {

                showModalPopup("Asset status already exists!");
                // alert("Asset status already exists!");

            } else {

                insertAssetStatus(asset_status);  // your insert function

            }
        },
        error: function (xhr, status, error) {
            console.error("Check API Error:", error);
            alert("Error while checking: " + error);
        }
    });
}

  




function insertAssetStatus(assetStatusName) {

    let currentDateTimeString = getIndianDateTimeFormat(new Date());

    // Prepare request JSON exactly as backend expects
    var requestData = {
        "status_id": null,         // Let backend auto-generate IDENTITY
        "assetStatus": assetStatusName,
        "createdBy": sessionStorage.getItem("id"),
        "created_date": currentDateTimeString,
        "modifiedBy": null,
        "modified_date": null
    };

    $.ajax({
      url: `${baseUrl}/api/ams/status`, // ✅ Correct API endpoint
        type: "POST",
        xhrFields: {
            withCredentials: true
        },
        contentType: "application/json",
        data: JSON.stringify(requestData),
        dataType: "json",

        success: function (response) {
			if (response && response.status === "Success") 
				 {
                showPopup("Inserted Successfully", "AmsMasterRegister.jsp");
				$("#exampleModalScrollableStatus");
                fetchAssetStatus();   // reload table/list after insert
            } else {
                alert("Record not inserted. Please try again.");
            }
        },

        error: function (xhr, status, error) {
            console.error("Insert AJAX Error:", error);
            alert("An error occurred while inserting Asset Status: " + error);
        }
    });
}




async function editAssetStatus(status_id) {
			  const allowed = allowedActions || [];

	if (!allowed.includes("Edit")) {
	  alert(" You do not have permission to edit.");
	  return;
	}
    console.log("Edit clicked for Status ID:", status_id);

	const apiUrl = `${baseUrl}/api/ams/status/get/${status_id}`;

    try {
        const response = await fetch(apiUrl, {
            method: "GET",
			credentials:"include",
            headers: { "Content-Type": "application/json" }
        });

        if (!response.ok) throw new Error("Failed to fetch asset status details");

        const data = await response.json();
        console.log("Fetched Asset Status Data:", data);

        // If your API returns Optional<Asset_Status>, unwrap it
        let statusData = data;
        if (data.hasOwnProperty("present") === false && data.assetStatus === undefined) {
            statusData = data;
        } else if (data.hasOwnProperty("present")) {
            // in case spring returns Optional
            statusData = data.value;
        }

        // ✅ Prefill the input field in UPDATE modal
        $('#assetstatusup').val(statusData.assetStatus || "");

        // Store status_id for update
        $('#assetstatusup').attr("data-status-id", statusData.status_id);

        // ✅ Show update confirmation modal (the main update modal)
        $('#exampleModalScrollableStatusUp').modal('show');

    } catch (error) {
        console.error("Error fetching asset status:", error);
        alert("Failed to load asset status details. Please try again.");
    }
}

async function fetchAssetStatus() {
	const apiUrl = `${baseUrl}/api/ams/status/getAll`;
 // Backend GET endpoint

    try {
        const response = await fetch(apiUrl, {
            method: "GET",
            credentials: "include"
        });

        if (!response.ok) throw new Error("Failed to fetch asset status");

        const assetStatusList = await response.json();
        const table = $('#statetableID').DataTable();
        table.clear();

        // Loop & check each status usage
        for (const [index, item] of assetStatusList.entries()) {

			const checkUrl = `${baseUrl}/api/ams/entry/asset_status/${item.status_id}`;

            let statusUsed = false;  // store true/false result

            try {
                const checkResponse = await fetch(checkUrl,{
					credentials:"include",
				});
                if (checkResponse.ok) {
                    statusUsed = await checkResponse.json(); // API response true/false
                }
            } catch (error) {
                console.error("Status check failed:", error);
            }

            // 🔁 Logic: true = disable | false = enable
            const editIcon = statusUsed
                ? `<i class="fa fa-pen text-secondary" title="Already in use" style="cursor:not-allowed; opacity:0.3;"></i>`
                : `<i class="fa fa-pen text-muted cursor-pointer" onclick="editAssetStatus(${item.status_id})" title="Edit"></i>`;

            // Add row
            table.row.add([
                index + 1,
                (item.code + " - " + item.assetStatus) || "",
                editIcon
            ]);
        }

        table.draw();

    } catch (error) {
        console.error("Error fetching asset status:", error);
    }
}








$("#updstatus").click(function () {

    let updatedStatus = $("#assetstatusup").val().trim();

    if (!updatedStatus) {
        $("#assetstatusupError").show();
        return;
    } else {
        $("#assetstatusupError").hide();
    }

    // Open confirmation modal
    $("#exampleModalCenter89").modal("show");
});




$("#cancelstatemodal").click(function () {
    $("#exampleModalCenter89").modal("hide");
});




$("#confirmstateupd").click(function () {
    $("#exampleModalCenter89").modal("hide");  // close confirm modal

  checkDuplicateAssetStatus()  ; // call update function
});




function checkDuplicateAssetStatus() {

    const updatedAssetStatus = $('#assetstatusup').val().trim();
    const selectedStatusId = $('#assetstatusup').attr('data-status-id');

    console.log("Entered checkDuplicateAssetStatus");
    console.log("Updated Value:", updatedAssetStatus);
    console.log("Selected Status ID:", selectedStatusId);

    $.ajax({
		url: `${baseUrl}/api/ams/status/check?asset_status=${encodeURIComponent(updatedAssetStatus)}`,

        type: 'GET',
        xhrFields: { withCredentials: true },

        success: function (response) {
            console.log("Duplicate check response:", response);

            // ✅ If exists AND not the same record → block update
            if (response.exists && Number(response.status_id) !== Number(selectedStatusId)) {

                console.log("Duplicate found — blocking update");
                showModalPopup("Asset status already exists!");

            } else {

                console.log("No duplicate found — proceeding with update");
                updateAssetStatus();  // safe to update

            }
        },

        error: function (xhr, status, error) {
            console.error("Check API Error:", error);
            alert("Error while checking: " + error);
        }
    });
}








async function updateAssetStatus() {

    const updatedAssetStatus = $('#assetstatusup').val().trim();
    const selectedStatusId = $('#assetstatusup').attr('data-status-id');

    let currentDateTimeString = getIndianDateTimeFormat(new Date());

	const apiUrl = `${baseUrl}/api/ams/status/${selectedStatusId}`;


    const payload = {
        assetStatus: updatedAssetStatus,   // matches getAssetStatus()
        modifiedBy: sessionStorage.getItem("id"),                  // matches getModifiedBy()
        modifiedDate: currentDateTimeString // matches getModifiedDate()
    };

    try {
        const response = await fetch(apiUrl, {
            method: "PUT",
			credentials:"include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        if (response.ok) {

            showPopup("Asset Status updated successfully!", "AmsMasterRegister.jsp");

            $('#exampleModalScrollableStatusUp').modal('hide'); 
            fetchAssetStatus();

        } else {
            alert("Failed to update Asset Status.");
        }

    } catch (error) {
        console.error("Error updating Asset Status:", error);
        alert("Error updating Asset Status.");
    }
}
















//  Asset OwnedBy


// CREATE BUTTON CLICK
$("#createassetowned").click(function () {

    let assetOwned = $("#assetowned").val().trim();

    if (!assetOwned) {
        $("#assetownedError").show();
        return;
    } else {
        $("#assetownedError").hide();
    }

    console.log("Validation passed → showing confirmation modal");
    $("#exampleModalCenter100").modal("show");  // Confirmation Modal
});


// CONFIRM YES BUTTON CLICK
$("#confirmassetowned").click(function () {
    console.log("Confirmed → Proceed with insertion");

    $("#exampleModalCenter100").modal("hide");

    handleAddAssetOwned();
});



// CHECK IF OWNER EXISTS
function handleAddAssetOwned() {

    let assetOwned = $("#assetowned").val().trim();

    $.ajax({
		url: `${baseUrl}/api/ams/owned/check?ob_description=${encodeURIComponent(assetOwned)}`,

        type: 'GET',
        xhrFields: { withCredentials: true },

        success: function (response) {

            if (response.exists) {
                showModalPopup("Asset Owner already exists!");
            } else {
                insertAssetOwnedBy(assetOwned);
            }
        },

        error: function (xhr, status, error) {
            console.error("Check API Error:", error);
            alert("Error checking Asset Owner: " + error);
        }
    });
}



// INSERT OWNER
function insertAssetOwnedBy(assetOwnedName) {

    let currentDateTimeString = getIndianDateTimeFormat(new Date());

    var requestData = {
        "asserob_id": null,
        "ownedByDescription": assetOwnedName,
        "createdBy": sessionStorage.getItem("id"),
        "created_date": currentDateTimeString,
        "modifiedBy": null,
        "modifiedDate": null
    };

    $.ajax({
		url: `${baseUrl}/api/ams/owned`,

        type: "POST",
        contentType: "application/json",
        xhrFields: { withCredentials: true },
        data: JSON.stringify(requestData),

        success: function (response) {
            if (response && response.status === "Success") {
                showPopup("Inserted Successfully", "AmsMasterRegister.jsp");
               fetchAssetOwnedBy();  // refresh the table
            } else {
                alert("Record not inserted");
            }
        },

        error: function (xhr, status, error) {
            console.error(error);
            alert("Insert failed!");
        }
    });
}



let currentOwnerId = null;

async function editAssetOwned(ob_id) {
			  const allowed =allowedActions || [];

	if (!allowed.includes("Edit")) {
	  alert(" You do not have permission to edit.");
	  return;
	}
    console.log("Edit clicked for Asset Owner ID:", ob_id);

	
	
	const apiUrl = `${baseUrl}/api/ams/owned/get/${ob_id}`;

	currentOwnerId=ob_id;

    try {
        const response = await fetch(apiUrl, {
            method: "GET",
			credentials:"include",
            headers: { "Content-Type": "application/json" }
        });

        if (!response.ok) throw new Error("Failed to fetch asset owner details");

        const data = await response.json();
        console.log("Fetched Asset Owner Data:", data);

        // Handle Optional/standard response
        let ownerData = data;
        if (data.hasOwnProperty("present") === false && data.ownedByDescription === undefined) {
            ownerData = data;
        } else if (data.hasOwnProperty("present")) {
            // Optional returned by Spring
            ownerData = data.value;
        }

        // ✅ Prefill input field in UPDATE modal
        $('#assetOwnerupt').val(ownerData.ownedByDescription || "");

        // Store ob_id for later update
        $('#assetOwnerupt').attr("data-owned-id", ownerData.ob_id);

		

        // ✅ Show main update modal
        $('#exampleModalScrollableassetownedbyup').modal('show');

    } catch (error) {
        console.error("Error fetching asset owner:", error);
        alert("Failed to load asset owner details. Please try again.");
    }
}


async function fetchAssetOwnedBy() {

	const apiUrl = `${baseUrl}/api/ams/owned/getAll`;
 // backend list API

    try {
        const response = await fetch(apiUrl, {
            method: "GET",
            credentials: "include"
        });

        if (!response.ok) throw new Error("Failed to fetch Asset Owned By list");

        const ownedByList = await response.json(); 

        // Initialize DataTable if not initialized
        let table;
        if (!$.fn.DataTable.isDataTable('#locationTableID')) {
            table = $('#locationTableID').DataTable();
        } else {
            table = $('#locationTableID').DataTable();
            table.clear(); 
        }

        // Loop & check each "Owned By" usage
        for (const [index, item] of ownedByList.entries()) {

			const checkUrl = `${baseUrl}/api/ams/entry/asset_ownedBy/${item.asserob_id}`;

            let ownedUsed = false;  // store true/false

            try {
                const checkResponse = await fetch(checkUrl,{credentials:"include"});
                if (checkResponse.ok) {
                    ownedUsed = await checkResponse.json(); // API returns true/false
                }
            } catch (error) {
                console.error("OwnedBy check failed:", error);
            }

            // 🔁 Logic: true = disable | false = enable
            const editIcon = ownedUsed
                ? `<i class="fa fa-pen text-secondary" title="Already in use" style="cursor:not-allowed; opacity:0.3;"></i>`
                : `<i class="fa fa-pen text-muted cursor-pointer" title="Edit" onclick="editAssetOwned(${item.asserob_id})"></i>`;

            // Add row
            table.row.add([
                index + 1,
                (item.code + " - " + item.ownedByDescription) || "",
                editIcon
            ]);
        }

        table.draw();

        // Show the table container
        $("#AssetOwnedByTable").show();

    } catch (error) {
        console.error("Error fetching Asset Owned By:", error);
    }
}




$("#assetownedup").click(function () {
    let updatedOwner = $("#assetOwnerupt").val().trim();

    if (!updatedOwner) {
        // Show error if input is empty
        $("#assetownerupdateError").show();
        return;
    } else {
        $("#assetownerupdateError").hide();
    }

    // Open confirmation modal
    $("#exampleModalCenter101").modal("show");
});

// Click "NO" in confirmation modal
$("#cancelcitymodal").click(function () {
    $("#exampleModalCenter101").modal("hide");
});

// Click "YES" in confirmation modal
$("#confirmcityupd").click(function () {
    $("#exampleModalCenter101").modal("hide");  // close confirm modal
    checkDuplicateAssetOwned();                 // call duplicate check & update
});




function checkDuplicateAssetOwned() {
    const updatedOwner = $('#assetOwnerupt').val().trim();
    const selectedOwnerId = $('#assetOwnerupt').attr('data-owned-id');

    console.log("Entered checkDuplicateAssetOwned");
    console.log("Updated Value:", updatedOwner);
    console.log("Selected Owner ID:", selectedOwnerId);

    $.ajax({
		url: `${baseUrl}/api/ams/owned/check?ob_description=${encodeURIComponent(updatedOwner)}`,

        type: 'GET',
        xhrFields: { withCredentials: true },

        success: function (response) {
            console.log("Duplicate check response:", response);

            // If exists AND not the same record → block update
            if (response.exists && Number(response.ob_id) !== Number(selectedOwnerId)) {
                console.log("Duplicate found — blocking update");
                showModalPopup("Asset Owner already exists!");
            } else {
                console.log("No duplicate found — proceeding with update");
                updateAssetOwned(); // safe to update
            }
        },

        error: function (xhr, status, error) {
            console.error("Check API Error:", error);
            alert("Error while checking duplicates: " + error);
        }
    });
}

async function updateAssetOwned() {
    const updatedOwner = $('#assetOwnerupt').val().trim();

    // Safety check for ID
    if (!currentOwnerId) {
        alert("Cannot update: Owner ID missing!");
        return;
    }

    console.log("Updating Asset Owner:", updatedOwner, "ID:", currentOwnerId);

	const apiUrl = `${baseUrl}/api/ams/owned/${currentOwnerId}`;

    const payload = {
        ownedByDescription: updatedOwner,
        modifiedBy: sessionStorage.getItem("id"),
        modifiedDate: getIndianDateTimeFormat(new Date())
    };

    try {
        const response = await fetch(apiUrl, {
            method: "PUT",
			credentials:"include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        // Log full response for debugging
        console.log("Response status:", response.status, "OK?", response.ok);

        // Treat 200 and 204 as success
        if (response.status === 200 || response.status === 204) {
            showPopup("Asset Owner updated successfully!", "AmsMasterRegister.jsp");

            // Close the correct modal
            $('#exampleModalScrollableassetownedbyup').modal('hide');

            // Refresh the Asset Owned table
            fetchAssetOwnedBy();
        } else {
            // Try to read error message from backend
            let errorText = await response.text();
            console.error("Update failed:", response.status, errorText);
            alert("Failed to update Asset Owner: " + errorText);
        }

    } catch (error) {
        console.error("Error updating Asset Owner:", error);
        alert("Error updating Asset Owner. See console for details.");
    }
}








// asset Maker js







$("#createassetmaker").click(function (){
	
	let asset_maker = $("#assetmaker").val().trim();
	
	if(!asset_maker){
			$("#assetmakerError").modal("show");
			return;
		}
		else{
				$("#assetmakerError").modal("hide");
				$("#exampleModalCenter199").modal("show");
					
				}
	
	
	
	
})

$("#confirmassetmaker").click(function (){
	
	
	
		
		handleAddAssetMaker();
		

	
	
});





function handleAddAssetMaker() {
    let asset_maker = $("#assetmaker").val().trim();

    if (!asset_maker) {
        alert("Please enter an Asset Maker name");
        return;
    }

    $.ajax({
		url: `${baseUrl}/api/ams/maker/check?make_description=${encodeURIComponent(asset_maker)}`,

        type: 'GET',
        xhrFields: {
            withCredentials: true
        },
        success: function (response) {
            if (response.exists) {
				$("#exampleModalCenter199").modal("hide");
                showModalPopup("Asset Maker already exists!");
            } else {
                insertAssetMaker(asset_maker);  // call your insert function
            }
        },
        error: function (xhr, status, error) {
            console.error("Check API Error:", error);
            alert("Error while checking: " + error);
        }
    });
}










function insertAssetMaker(assetMakerName) {

    let currentDateTimeString = getIndianDateTimeFormat(new Date());

    var requestData = {
        "makeId": null,                 // Auto-generated in DB
        "makeDescription": assetMakerName,
        "createdBy": sessionStorage.getItem("id"),
        "createdDate": currentDateTimeString,
        "modifiedBy": null,
        "modifiedDate": null
    };

    $.ajax({
		url: `${baseUrl}/api/ams/maker`,

        type: "POST",
        contentType: "application/json",
        xhrFields: { withCredentials: true },
        data: JSON.stringify(requestData),

        success: function (response) {
            if (response && response.status === "Success") {
				$("#exampleModalCenter199").modal("hide");
                showPopup("Inserted Successfully", "AmsMasterRegister.jsp");
                fetchAssetMakers();  // refresh the table
            } else {
                alert("Record not inserted");
            }
        },

        error: function (xhr, status, error) {
            console.error("Insert failed:", error);
            alert("Insert failed!");
        }
    });
}



async function fetchAssetMakers() {
	const apiUrl = `${baseUrl}/api/ams/maker/getAll`;
 // Backend GET endpoint

    try {
        const response = await fetch(apiUrl, {
            method: "GET",
            credentials: "include"
        });

        if (!response.ok) throw new Error("Failed to fetch asset makers");

        const assetMakers = await response.json();
        const table = $('#companyTableID').DataTable();
        table.clear();

        // Loop & check each maker usage
        for (const [index, item] of assetMakers.entries()) {

			const checkUrl = `${baseUrl}/api/ams/entry/asset_maker/${item.makeId}`;

            let makerUsed = false; // API response value

            try {
                const checkResponse = await fetch(checkUrl,{
					credentials :"include"
				});
				
                if (checkResponse.ok) {
                    makerUsed = await checkResponse.json(); // true/false
                }
            } catch (error) {
                console.error("Maker usage check failed:", error);
            }

            // 🔁 Disable if true else enable
            const editIcon = makerUsed
                ? `<i class="fa fa-pen text-secondary" style="cursor:not-allowed; opacity:0.3;" title="Already in use"></i>`
                : `<i class="fa fa-pen text-muted cursor-pointer" onclick="editAssetMaker(${item.makeId})" title="Edit"></i>`;

            table.row.add([
                index + 1,
                (item.code + " - " + item.makeDescription) || "",
                editIcon
            ]);
        }

        table.draw();

    } catch (error) {
        console.error('Error fetching asset makers:', error);
    }
}





let currentMakerId = null; 

async function editAssetMaker(makeId) {
	
	
		  const allowed = allowedActions || [];

	if (!allowed.includes("Edit")) {
	  alert(" You do not have permission to edit.");
	  return;
	}
	
	
    console.log("Edit clicked for Asset Maker ID:", makeId);
    currentMakerId = makeId; // store for update

	const apiUrl = `${baseUrl}/api/ams/maker/get/${makeId}`;


    try {
        const response = await fetch(apiUrl, {
            method: "GET",
			credentials:"include",
            headers: { "Content-Type": "application/json" }
        });

        if (!response.ok) throw new Error("Failed to fetch Asset Maker details");

        const data = await response.json();
        console.log("Fetched Asset Maker Data:", data);

        // Prefill input field in the UPDATE modal
        $('#selecttype1').val(data.makeDescription || "");

        // Show the main update modal
        $('#exampleModalScrollableSelectUp').modal('show');

    } catch (error) {
        console.error("Error fetching asset maker:", error);
        alert("Failed to load asset maker details. Please try again.");
    }
}



$('#updselect').click(function () {
    let updatedMaker = $("#selecttype1").val().trim();

    if (!updatedMaker) {
        $("#selecttype1Error").show();
        return;
    } else {
        $("#selecttype1Error").hide();
    }

    $("#exampleModalCenter109").modal("show"); // open confirm modal
});

// Click "NO" in confirmation modal
$('#cancelselectmodal').click(function () {
    $("#exampleModalCenter109").modal("hide");
});

// Click "YES" in confirmation modal → call update function
$('#confirmselectupd').click(function () {
    $("#exampleModalCenter109").modal("hide");
   checkDuplicateAssetMaker()// function to actually update
});






function checkDuplicateAssetMaker() {
    const updatedMaker = $('#selecttype1').val().trim();

    if (!currentMakerId) {
        alert("Cannot update: Maker ID missing!");
        return;
    }

    console.log("Checking duplicate for:", updatedMaker, "ID:", currentMakerId);

    $.ajax({
		url: `${baseUrl}/api/ams/maker/check?make_description=${encodeURIComponent(updatedMaker)}`,

        type: 'GET',
        xhrFields: { withCredentials: true },
        success: function (response) {
            console.log("Duplicate check response:", response);

            if (response.exists && Number(response.makeId) !== Number(currentMakerId)) {
                console.log("Duplicate found — blocking update");
                showModalPopup("Asset Maker already exists!");
            } else {
                console.log("No duplicate found — proceeding with update");
                updateAssetMaker(); // call update
            }
        },
        error: function (xhr, status, error) {
            console.error("Check API Error:", error);
            alert("Error while checking duplicates: " + error);
        }
    });
}





async function updateAssetMaker() {
    const updatedMaker = $('#selecttype1').val().trim();

    if (!currentMakerId) {
        alert("Cannot update: Maker ID missing!");
        return;
    }

    console.log("Updating Maker:", updatedMaker, "ID:", currentMakerId);

    const currentDateTimeString = getIndianDateTimeFormat(new Date());

	const apiUrl = `${baseUrl}/api/ams/maker/${currentMakerId}`;

    const payload = {
        makeDescription: updatedMaker,  // match your backend field name
        modifiedBy: sessionStorage.getItem("id"),               // optional, can set actual user
        modifiedDate: currentDateTimeString
    };

    try {
        const response = await fetch(apiUrl, {
            method: "PUT",
			credentials:"include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            showPopup("Asset Maker updated successfully!", "AmsMasterRegister.jsp");

            // Close the update modal
            $('#exampleModalScrollableSelectUp').modal('hide');

            // Refresh the Maker table
            fetchAssetMakers();
        } else {
            alert("Failed to update Asset Maker.");
        }
    } catch (error) {
        console.error("Error updating Asset Maker:", error);
        alert("Error updating Asset Maker.");
    }
}





function showModalPopup(message) {
    // ✅ Match the ID in your modal <b id="errorMessageupcon">
    $('#errorMessageupcon').text(message);
    
    // ✅ Show the modal
    $('#exampleModalCenterDupUPcon').modal('show');
}











function showPopup(message, redirectUrl) {
    var popup = $('<div class="popup">' + message + '</div>').appendTo('body').hide().fadeIn(400);
    setTimeout(function () {
        popup.fadeOut(400, function () {
            $(this).remove();
			window.location = redirectUrl;
        });
    }, 2000);
}