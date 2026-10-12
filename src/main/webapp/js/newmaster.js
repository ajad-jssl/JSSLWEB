let lengthContractList='';
let lengthShipmentDelivery='';

taxmaster();


// Retrieve the selected factory ID from sessionStorage
const selectedFactoryId = sessionStorage.getItem('selectedFactoryId');

// Ensure the ID is available before making the API call
if (selectedFactoryId) {
   // state();
   // shipmentdelivery();
   // typemaster();
   // workorder();
    //othertype();
   //milestone();
  // gstmaster();
  // uom();
  // servicecode();
    country();
     //organization();
     //bank();
    business();
   //openingbal();
   //vendor(selectedFactoryId);
gstseries(selectedFactoryId);
advanceseries();
debit();
challan();
payment();
self();
delivery();
//Contractorlist();
//shipmentdelivery();
user();
userroles();
//scrapitem();
//ScrapType();
//locations();
fetchUserList();
fetchVendor();
fetchItem();
fetchLocation();
fetchScraptype11();
fetchUOMtest();
fetchtaxtest();
fetchbustest();
fetchdel();
fetchtype();
fetchfactorynew();
fetchinadd();
fetchconadd();
fetchbgtype();
fetchintypemass();
fetchininnrem();
fetchasigncon(selectedFactoryId);
fetchexptitle();
satemasnew();
countrtnewtest();
scraptypetestnew();
workordernew();
othertypenew11test();
gstmastertestnew();
orgnew();
bankdelnew();
openingnew(selectedFactoryId);
milenewtest();
servicetestnew2();
} else {
    console.error('No factory ID found in sessionStorage.');
}

function Contractorlist(selectedFactoryId) {
    var url = new URL(`${baseUrl}/jssl/contract/listcontract/${selectedFactoryId}`);
   fetch(url, { credentials: "include" })
        .then(response => response.json())
        .then(json => {
            if (json.Data && Array.isArray(json.Data)) {
                 lengthContractList = json.Data.length;
				 document.getElementById('assigncontract').innerHTML = lengthContractList;
            } else {
                console.warn("No valid work order data found.");
            }
        })
        .catch(error => {
            console.error("Fetch error:", error);
        });
}


function shipmentdelivery(selectedFactoryId) {
    var url = new URL(`${baseUrl}/jssl/master/listshipmentdelivery/${selectedFactoryId}`);
  fetch(url, { credentials: "include" })
        .then(response => response.json())
        .then(json => {
            if (json.Data && Array.isArray(json.Data)) {
                 lengthShipmentDelivery = json.Data.length;
                document.getElementById('assignshipment').innerHTML = lengthShipmentDelivery;
            } else {
                console.warn("No valid shipment delivery data found.");
            }
        })
        .catch(error => {
            console.error("Fetch error:", error);
        });
}


function typemaster(selectedFactoryId) {
    var url = new URL(`${baseUrl}/jssl/master/listtypemaster/${selectedFactoryId}`);
  fetch(url, { credentials: "include" })
        .then(response => response.json())
        .then(json => {
            if (json.Data && Array.isArray(json.Data)) {
                const lengthTypeMaster = json.Data.length;
                document.getElementById('assigntypemaster').innerHTML = lengthTypeMaster;
            } else {
                console.warn("No valid type master data found.");
            }
        })
        .catch(error => {
            console.error("Fetch error:", error);
        });
}


function workorder(selectedFactoryId) {
    var url = new URL(`${baseUrl}/jssl/master/listworkordermaster/${selectedFactoryId}`);
  fetch(url, { credentials: "include" })
        .then(response => response.json())
        .then(json => {
            if (json.Data && Array.isArray(json.Data)) {
                const workorderlength = json.Data.length;
                document.getElementById('workoder').innerHTML = workorderlength;
            } else {
                console.warn("No valid type master data found.");
            }
        })
        .catch(error => {
            console.error("Fetch error:", error);
        });
}


function othertype(selectedFactoryId) {
    var url = new URL(`${baseUrl}/jssl/master/listothertypemaster/${selectedFactoryId}`);
  fetch(url, { credentials: "include" })
        .then(response => response.json())
        .then(json => {
            if (json.Data && Array.isArray(json.Data)) {
                const workorderlength = json.Data.length;
                document.getElementById('othertype').innerHTML = workorderlength;
            } else {
                console.warn("No valid type master data found.");
            }
        })
        .catch(error => {
            console.error("Fetch error:", error);
        });
}


function milestone(selectedFactoryId) {
    var url = new URL(`${baseUrl}/jssl/master/listmilestonemasternew/${selectedFactoryId}`);
  fetch(url, { credentials: "include" })
        .then(response => response.json())
        .then(json => {
            if (json.Data && Array.isArray(json.Data)) {
                const workorderlength = json.Data.length;
                document.getElementById('milestone').innerHTML = workorderlength;
            } else {
                console.warn("No valid type master data found.");
            }
        })
        .catch(error => {
            console.error("Fetch error:", error);
        });
}



function gstmaster(selectedFactoryId) {
    var url = new URL(`${baseUrl}/jssl/master/listgstmaster/${selectedFactoryId}`);
   fetch(url, { credentials: "include" })
        .then(response => response.json())
        .then(json => {
            if (json.Data && Array.isArray(json.Data)) {
                const workorderlength = json.Data.length;
                document.getElementById('gstmaster').innerHTML = workorderlength;
            } else {
                console.warn("No valid type master data found.");
            }
        })
        .catch(error => {
            console.error("Fetch error:", error);
        });
}


function servicecode(selectedFactoryId) {
    var url = new URL(`${baseUrl}/jssl/master/listservicecodemasternew/${selectedFactoryId}`);
  fetch(url, { credentials: "include" })
        .then(response => response.json())
        .then(json => {
            if (json.Data && Array.isArray(json.Data)) {
                const workorderlength = json.Data.length;
                document.getElementById('servicecode').innerHTML = workorderlength;
            } else {
                console.warn("No valid type master data found.");
            }
        })
        .catch(error => {
            console.error("Fetch error:", error);
        });
}


function taxmaster() {
    var url = new URL(`${baseUrl}/jssl/taxmasters/list`);
   fetch(url, { credentials: "include" })
        .then(response => response.json())
        .then(json => {
            if (json.Data && Array.isArray(json.Data)) {
                const workorderlength = json.Data.length;
                document.getElementById('taxmaster').innerHTML = workorderlength;
            } else {
                console.warn("No valid type master data found.");
            }
        })
        .catch(error => {
            console.error("Fetch error:", error);
        });
}


function uom(selectedFactoryId) {
    var url = new URL(`${baseUrl}/jssl/master/listunitmeasurementmaster/${selectedFactoryId}`);
  fetch(url, { credentials: "include" })
        .then(response => response.json())
        .then(json => {
            if (json.Data && Array.isArray(json.Data)) {
                const workorderlength = json.Data.length;
                document.getElementById('uom').innerHTML = workorderlength;
            } else {
                console.warn("No valid type master data found.");
            }
        })
        .catch(error => {
            console.error("Fetch error:", error);
        });
}


function organization(selectedFactoryId) {
    var url = new URL(`${baseUrl}/jssl/listorganization/${selectedFactoryId}`);
  fetch(url, { credentials: "include" })
        .then(response => response.json())
        .then(json => {
            if (json.Data && Array.isArray(json.Data)) {
                const workorderlength = json.Data.length;
                document.getElementById('organisation123').innerHTML = workorderlength;
            } else {
                console.warn("No valid type master data found.");
            }
        })
        .catch(error => {
            console.error("Fetch error:", error);
        });
}

function bank(selectedFactoryId) {
    var url = new URL(`${baseUrl}/jssl/listbankaccount/${selectedFactoryId}`);
 fetch(url, { credentials: "include" })
        .then(response => response.json())
        .then(json => {
            if (json.Data && Array.isArray(json.Data)) {
                const workorderlength = json.Data.length;
                document.getElementById('bank12').innerHTML = workorderlength;
            } else {
                console.warn("No valid type master data found.");
            }
        })
        .catch(error => {
            console.error("Fetch error:", error);
        });
}


function business(selectedFactoryId) {
    var url = new URL(`${baseUrl}/jssl/listbusinessunits/${selectedFactoryId}`);
  fetch(url, { credentials: "include" })
        .then(response => response.json())
        .then(json => {
            if (json.Data && Array.isArray(json.Data)) {
                const workorderlength = json.Data.length;
                document.getElementById('businesslentgh').innerHTML = workorderlength;
            } else {
                console.warn("No valid type master data found.");
            }
        })
        .catch(error => {
            console.error("Fetch error:", error);
        });
}

function user() {
    var url = new URL(`${baseUrl}/jssl/user/listuser`);
 fetch(url, { credentials: "include" })
        .then(response => response.json())
        .then(json => {
            if (json.Data && Array.isArray(json.Data)) {
                const workorderlength = json.Data.length;
                document.getElementById('userlength').innerHTML = workorderlength;
            } else {
                console.warn("No valid type master data found.");
            }
        })
        .catch(error => {
            console.error("Fetch error:", error);
        });
}

function userroles() {
    var url = new URL(`${baseUrl}/jssl/role/getAllRoles`);
  fetch(url, { credentials: "include" })
        .then(response => response.json())
        .then(json => {
            if (json.DistrictDetails && Array.isArray(json.DistrictDetails)) {
                const rolesLength = json.DistrictDetails.length; 
                document.getElementById('userrolelength').innerHTML = rolesLength;
                console.log("Number of roles:", rolesLength);
            } else {
                console.warn("No valid role data found.");
            }
        })
        .catch(error => {
            console.error("Fetch error:", error);
        });
}

function openingbal(selectedFactoryId) {
    var url = new URL(`${baseUrl}/jssl/listopeningbalance/${selectedFactoryId}`);
 fetch(url, { credentials: "include" })
        .then(response => response.json())
        .then(json => {
            if (json.Data && Array.isArray(json.Data)) {
                const workorderlength = json.Data.length;
                document.getElementById('openbal').innerHTML = workorderlength;
            } else {
                console.warn("No valid type master data found.");
            }
        })
        .catch(error => {
            console.error("Fetch error:", error);
        });
}

function state(selectedFactoryId) {
	
    const url = new URL(`${baseUrl}/jssl/state/getAllStates/${selectedFactoryId}`);
    
   fetch(url, { credentials: "include" })
        .then(response => response.json())
        .then(json => {
            // Check if StateCount exists and is a valid number
            if (json.StateCount) {
                const workorderlength = json.StateCount;
                document.getElementById('statelen').innerHTML = workorderlength;
              
            } else {
                console.warn("StateCount not found in the response.");
            }

            // Optionally process StateDetails if needed
            if (json.StateDetails && Array.isArray(json.StateDetails)) {
                // Example: Log each state's name
                json.StateDetails.forEach(state => {
                    console.log(`State Name: ${state.state_name}, State Code: ${state.state_code}`);
                });
            } else {
                console.warn("No valid StateDetails found.");
            }
        })
        .catch(error => {
            console.error("Fetch error:", error);
        });
}



function country(selectedFactoryId) {
    var url = new URL(`${baseUrl}/jssl/country/getAllCountryList/${selectedFactoryId}`);
   fetch(url, { credentials: "include" })
        .then(response => response.json())
        .then(json => {
            if (json.CountryDetails && Array.isArray(json.CountryDetails)) {
                const workorderlength = json.CountryDetails.length;
                document.getElementById('countrylen').innerHTML = workorderlength;
            } else {
                console.warn("No valid type master data found.");
            }
        })
        .catch(error => {
            console.error("Fetch error:", error);
        });
}



function gstseries() {
  $.ajax({
    url: new URL('jssl/seriesmaster/getGstMasterListNew', baseUrl),
    type: 'GET',
	xhrFields: {
		    withCredentials: true
		},
    dataType: 'json',
    success: function (res) {
      /* 1️⃣  Make sure we’re working with an object, even if the
             server returned a JSON string (rare but possible).   */
      if (typeof res === 'string') {
        try { res = JSON.parse(res); } catch (e) { console.error(e); }
      }

      /* 2️⃣  Get the array and its length safely. */
      const list = Array.isArray(res?.GstMasterList) ? res.GstMasterList : [];
      document.getElementById('gstlen').textContent = list.length;
    },
    error: function (jqXhr, textStatus, errorMessage) {
      console.error('Error:', errorMessage);
      document.getElementById('gstlen').textContent = 0;
    }
  });
}



function advanceseries() {
	$.ajax({
	   url: new URL('jssl/seriesmaster/getAdvanceMasterListNew', baseUrl),
	   type: 'GET',
	   xhrFields: {
	   	    withCredentials: true
	   	},
	   dataType: 'json',
	   success: function (res) {
	     /* 1️⃣  Make sure we’re working with an object, even if the
	            server returned a JSON string (rare but possible).   */
	     if (typeof res === 'string') {
	       try { res = JSON.parse(res); } catch (e) { console.error(e); }
	     }

	     /* 2️⃣  Get the array and its length safely. */
	     const list = Array.isArray(res?.AdvanceMasterList) ? res.AdvanceMasterList : [];
	     document.getElementById('advancelen').textContent = list.length;
	   },
	   error: function (jqXhr, textStatus, errorMessage) {
	     console.error('Error:', errorMessage);
	     document.getElementById('advancelen').textContent = 0;
	   }
	 });
}

function debit() {
	$.ajax({
		   url: new URL('jssl/seriesmaster/getDebitCreditListNew', baseUrl),
		   type: 'GET',
		   xhrFields: {
		   	    withCredentials: true
		   	},
		   dataType: 'json',
		   success: function (res) {
		     /* 1️⃣  Make sure we’re working with an object, even if the
		            server returned a JSON string (rare but possible).   */
		     if (typeof res === 'string') {
		       try { res = JSON.parse(res); } catch (e) { console.error(e); }
		     }

		     /* 2️⃣  Get the array and its length safely. */
		     const list = Array.isArray(res?.DebitCreditList) ? res.DebitCreditList : [];
		     document.getElementById('debitlen').textContent = list.length;
		   },
		   error: function (jqXhr, textStatus, errorMessage) {
		     console.error('Error:', errorMessage);
		     document.getElementById('debitlen').textContent = 0;
		   }
		 });
}

function challan() {
	$.ajax({
			   url: new URL('jssl/seriesmaster/getChallansMasterListNew', baseUrl),
			   type: 'GET',
			   xhrFields: {
			   	    withCredentials: true
			   	},
			   dataType: 'json',
			   success: function (res) {
			     /* 1️⃣  Make sure we’re working with an object, even if the
			            server returned a JSON string (rare but possible).   */
			     if (typeof res === 'string') {
			       try { res = JSON.parse(res); } catch (e) { console.error(e); }
			     }

			     /* 2️⃣  Get the array and its length safely. */
			     const list = Array.isArray(res?.ChallansMasterList) ? res.ChallansMasterList : [];
			     document.getElementById('challanlen').textContent = list.length;
			   },
			   error: function (jqXhr, textStatus, errorMessage) {
			     console.error('Error:', errorMessage);
			     document.getElementById('challanlen').textContent = 0;
			   }
			 });
}


function payment() {
  $.ajax({
    url: new URL('jssl/seriesmaster/getPaymentVoucherMasterListNew', baseUrl),
    type: 'GET',
	xhrFields: {
		    withCredentials: true
		},
    dataType: 'json',
    success: function (res) {
      // (Optional-safe parse if server ever sends a raw string)
      if (typeof res === 'string') {
        try { res = JSON.parse(res); } catch (e) { console.error(e); }
      }

      // ✅ Use the real key from the response
      const list = Array.isArray(res?.PaymentVoucherList)
                 ? res.PaymentVoucherList
                 : [];

      document.getElementById('paymentlen').textContent = list.length; // ➜ 2
    },
    error: function () {
      document.getElementById('paymentlen').textContent = 0;
    }
  });
}

function self() {
  $.ajax({
    url: new URL('jssl/seriesmaster/getSelfInvoiceMasterListNew', baseUrl),
    dataType: 'json',
	xhrFields: {
		    withCredentials: true
		},
    success: function (res) {
      // jQuery already parsed JSON, so no need to JSON.parse again

      // ✅ replace with the key you just saw in the console
      const list = Array.isArray(res?.SelfInvoiceList)
                   ? res.SelfInvoiceList
                   : [];

      document.getElementById('selflen').textContent = list.length; // should now show >0
    },
    error: function () {
      document.getElementById('selflen').textContent = 0;
    }
  });
}

function delivery() {
	$.ajax({
					   url: new URL('jssl/seriesmaster/getDeliveryChallanMasterListNew', baseUrl),
					   type: 'GET',
					   dataType: 'json',
					   xhrFields: {
					   	    withCredentials: true
					   	},
					   success: function (res) {
					     /* 1️⃣  Make sure we’re working with an object, even if the
					            server returned a JSON string (rare but possible).   */
					     if (typeof res === 'string') {
					       try { res = JSON.parse(res); } catch (e) { console.error(e); }
					     }

					     /* 2️⃣  Get the array and its length safely. */
					     const list = Array.isArray(res?.DeliveryChallanList) ? res.DeliveryChallanList : [];
					     document.getElementById('deliverylen').textContent = list.length;
					   },
					   error: function (jqXhr, textStatus, errorMessage) {
					     console.error('Error:', errorMessage);
					     document.getElementById('deliverylen').textContent = 0;
					   }
					 });
}



function fetchFactoryList() {
 
    // Dynamically construct the URL using the base URL and the relative path
    const url = new URL('/jssl/factory/getAllFactoryList', baseUrl);  // Construct the full URL

  fetch(url, { credentials: "include" })
        .then(response => {
            if (!response.ok) {
                throw new Error("Server API error");
            }
            return response.json();
        })
        .then(json => {
            // Check if the response has 'Data' field and it's an array
            if (json.status === "yes" && json.FactoryDetails && Array.isArray(json.FactoryDetails)) {
                let li = '';  // Initialize HTML string for table rows
                const arr = json.FactoryDetails;

                // Loop through each milestone and build the table rows
                for (let i = 0; i < arr.length; i++) {
                    const data = arr[i];
                    const factory_name = data.factory_name || 'N/A';
                    const id = data.id || 'N/A';


                    // Append each row to the HTML string
                    li += `<tr id="${id}">
                        <td>${factory_name}</td>

                        <td style="display:none;">${id}</td>
                      
                    </tr>`;
                }

                // Inject rows into the table body
                document.querySelector("#tableID tbody").innerHTML = li;

                // Initialize DataTable if rows were added
                if (li) {
                    $('#tableID').DataTable({
                        dom: 'Bfrtip',
                        scrollX: true,
                        info: true,
                        paging: true,
                        buttons: [
                            {
                                extend: 'excel',
                                text: 'Export to Excel',
                                title: 'Milestone List',
                            },
                        ]
                    });
                } else {
                    //alert("No valid records to display.");
                }
            } else {
               // alert("No valid data found or data format is incorrect.");
            }
        })
        .catch(error => {
            console.error("Fetch error:", error);
           // alert("Error fetching data: " + error.message);
        });
}




function scrapitem(selectedFactoryId) {
    var url = new URL(`${baseUrl}/jssl/scrapsalescrapitems/list/${selectedFactoryId}`);
 fetch(url, { credentials: "include" })
        .then(response => response.json())
        .then(json => {
            if (json.status === 'yes' && json.Data && Array.isArray(json.Data)) {
                const gstRecords = json.Data.filter((record) => record.is_deliveryChallan === 'true');
                const gstRecordsLength = gstRecords.length;
                document.getElementById('ScrapTypeid').innerHTML = gstRecordsLength;   
            } else {
                console.warn("No valid GST data found.");
            }
        })
        .catch(error => {
            console.error("Fetch error:", error);
        });
}

function ScrapType(selectedFactoryId) {
    var url = new URL(`${baseUrl}/jssl/scraptypes/list/${selectedFactoryId}`);
fetch(url, { credentials: "include" })
        .then(response => response.json())
        .then(json => {
            if (json.status === 'yes' && json.Data && Array.isArray(json.Data)) {
                const gstRecords = json.Data.filter((record) => record.is_deliveryChallan === 'true');
                const gstRecordsLength = gstRecords.length;
                document.getElementById('ScrapTypeid').innerHTML = gstRecordsLength;   
            } else {
                console.warn("No valid GST data found.");
            }
        })
        .catch(error => {
            console.error("Fetch error:", error);
        });
}

function locations(selectedFactoryId) {
    var url = new URL(`${baseUrl}/jssl/scrapsalelocation/list/${selectedFactoryId}`);
 fetch(url, { credentials: "include" })
        .then(response => response.json())
        .then(json => {
            if (json.status === 'yes' && json.Data && Array.isArray(json.Data)) {
                const gstRecords = json.Data.filter((record) => record.is_deliveryChallan === 'true');
                const gstRecordsLength = gstRecords.length;
                document.getElementById('locationid').innerHTML = gstRecordsLength;   
            } else {
                console.warn("No valid GST data found.");
            }
        })
        .catch(error => {
            console.error("Fetch error:", error);
        });
}

function fetchUserList() {  // Use a different name here if required
    $.ajax({
        url: new URL(`/jssl/salesordertype/list`, baseUrl),
        type: "GET", // HTTP method
		xhrFields: {
			    withCredentials: true
			},
        dataType: "json",
        //data: { factory_id: selectedFactoryId }, // Passing the factoryId in the request
        success: function (data) {
            var arrays = data.SalesOrderTypeDetails;
            document.getElementById("Scraptypeid").textContent = arrays.length;
        },
        error: function (jqXhr, textStatus, errorMessage) {
            console.error("Error:", errorMessage);
        }
    });
}

function fetchVendor() {  // Use a different name here if required
    $.ajax({
        url: new URL(`/jssl/master/listvendorforscrapmaster`, baseUrl),
        type: "GET", // HTTP method
		xhrFields: {
			    withCredentials: true
			},
        dataType: "json",
        //data: { factory_id: selectedFactoryId }, // Passing the factoryId in the request
        success: function (data) {
            var arrays = data.Data;
            document.getElementById("vendorlenaa").textContent = arrays.length;
        },
        error: function (jqXhr, textStatus, errorMessage) {
            console.error("Error:", errorMessage);
        }
    });
}

function fetchItem() {  // Use a different name here if required
    $.ajax({
        url: new URL(`/jssl/scrapsalescrapitems/list`, baseUrl),
        type: "GET", // HTTP method
		xhrFields: {
			    withCredentials: true
			},
        dataType: "json",
        //data: { factory_id: selectedFactoryId }, // Passing the factoryId in the request
        success: function (data) {
            var arrays = data.ListScrapSaleScrapItems;
            document.getElementById("ScrapTypeidaa").textContent = arrays.length;
        },
        error: function (jqXhr, textStatus, errorMessage) {
            console.error("Error:", errorMessage);
        }
    });
}

function fetchLocation() {  // Use a different name here if required
    $.ajax({
        url: new URL(`/jssl/scrapsalelocation/list`, baseUrl),
        type: "GET", // HTTP method
        dataType: "json",
		xhrFields: {
			    withCredentials: true
			},
        //data: { factory_id: selectedFactoryId }, // Passing the factoryId in the request
        success: function (data) {
            var arrays = data.ListLocationTrack;
            document.getElementById("locationidaa").textContent = arrays.length;
        },
        error: function (jqXhr, textStatus, errorMessage) {
            console.error("Error:", errorMessage);
        }
    });
}

function fetchScraptype11() {  // Use a different name here if required
    $.ajax({
        url: new URL(`/jssl/scraptypes/list`, baseUrl),
        type: "GET", // HTTP method
        dataType: "json",
		xhrFields: {
			    withCredentials: true
			},
        //data: { factory_id: selectedFactoryId }, // Passing the factoryId in the request
        success: function (data) {
            var arrays = data.Lists;
            document.getElementById("Scraptypeid11").textContent = arrays.length;
        },
        error: function (jqXhr, textStatus, errorMessage) {
            console.error("Error:", errorMessage);
        }
    });
}

function fetchUOMtest() {  // Use a different name here if required
    $.ajax({
        url: new URL(`/jssl/master/listunitmeasurementmasternew`, baseUrl),
        type: "GET", // HTTP method
        dataType: "json",
		xhrFields: {
			    withCredentials: true
			},
        //data: { factory_id: selectedFactoryId }, // Passing the factoryId in the request
        success: function (data) {
            var arrays = data.Data;
            document.getElementById("uomtest").textContent = arrays.length;
        },
        error: function (jqXhr, textStatus, errorMessage) {
            console.error("Error:", errorMessage);
        }
    });
}

function fetchtaxtest() {  // Use a different name here if required
    $.ajax({
        url: new URL(`/jssl/taxmasters/list`, baseUrl),
        type: "GET", // HTTP method
        dataType: "json",
		xhrFields: {
			    withCredentials: true
			},
        success: function (data) {
            var arrays = data.Data;
            document.getElementById("taxmastertest").textContent = arrays.length;
        },
        error: function (jqXhr, textStatus, errorMessage) {
            console.error("Error:", errorMessage);
        }
    });
}

function fetchbustest() {  // Use a different name here if required
    $.ajax({
        url: new URL(`/jssl/listbusinessunitsnew`, baseUrl),
        type: "GET", // HTTP method
        dataType: "json",
		xhrFields: {
			    withCredentials: true
			},
        //data: { factory_id: selectedFactoryId }, // Passing the factoryId in the request
        success: function (data) {
            var arrays = data.Data;
            document.getElementById("businesslentghtest").textContent = arrays.length;
        },
        error: function (jqXhr, textStatus, errorMessage) {
            console.error("Error:", errorMessage);
        }
    });
}

function fetchdel() {  // Use a different name here if required
    $.ajax({
        url: new URL(`/jssl/master/listshipmentdeliverynew`, baseUrl),
        type: "GET", // HTTP method
        dataType: "json",
		xhrFields: {
			    withCredentials: true
			},
        //data: { factory_id: selectedFactoryId }, // Passing the factoryId in the request
        success: function (data) {
            var arrays = data.Data;
            document.getElementById("delnew").textContent = arrays.length;
        },
        error: function (jqXhr, textStatus, errorMessage) {
            console.error("Error:", errorMessage);
        }
    });
}

function fetchtype() {  // Use a different name here if required
    $.ajax({
        url: new URL(`/jssl/master/listtypemasternew`, baseUrl),
        type: "GET", // HTTP method
		xhrFields: {
			    withCredentials: true
			},
        dataType: "json",
        //data: { factory_id: selectedFactoryId }, // Passing the factoryId in the request
        success: function (data) {
            var arrays = data.Data;
            document.getElementById("typenewmaster").textContent = arrays.length;
        },
        error: function (jqXhr, textStatus, errorMessage) {
            console.error("Error:", errorMessage);
        }
    });
}

function fetchfactorynew() {  // Use a different name here if required
    $.ajax({
        url: new URL(`/jssl/factory/getAllFactoryList`, baseUrl),
        type: "GET", // HTTP method
		xhrFields: {
			    withCredentials: true
			},
        dataType: "json",
        success: function (data) {
            var arrays = data.FactoryDetails;
            document.getElementById("Factorymasternew").textContent = arrays.length;
        },
        error: function (jqXhr, textStatus, errorMessage) {
            console.error("Error:", errorMessage);
        }
    });
}

function fetchinadd() {  // Use a different name here if required
    $.ajax({
        url: new URL(`/jssl/invoiceConsigneeAddress/getInvoiceAddress`, baseUrl),
        type: "GET", // HTTP method
		xhrFields: {
			    withCredentials: true
			},
        dataType: "json",
        //data: { factory_id: selectedFactoryId }, // Passing the factoryId in the request
        success: function (data) {
            var arrays = data.InvoiceAddress;
            document.getElementById("incount").textContent = arrays.length;
        },
        error: function (jqXhr, textStatus, errorMessage) {
            console.error("Error:", errorMessage);
        }
    });
}

function fetchconadd() {  // Use a different name here if required
    $.ajax({
        url: new URL(`/jssl/invoiceConsigneeAddress/getConsigneeAddressNew`, baseUrl),
        type: "GET", // HTTP method
		xhrFields: {
			    withCredentials: true
			},
        dataType: "json",
        //data: { factory_id: selectedFactoryId }, // Passing the factoryId in the request
        success: function (data) {
            var arrays = data.ConsigneeAddress;
            document.getElementById("concount").textContent = arrays.length;
        },
        error: function (jqXhr, textStatus, errorMessage) {
            console.error("Error:", errorMessage);
        }
    });
}

function fetchbgtype() {  // Use a different name here if required
    $.ajax({
        url: new URL(`/jssl/master/listbgtypenew`, baseUrl),
        type: "GET", // HTTP method
		xhrFields: {
			    withCredentials: true
			},
        dataType: "json",
        success: function (data) {
            var arrays = data.BGTYPE;
            document.getElementById("bgtype").textContent = arrays.length;
        },
        error: function (jqXhr, textStatus, errorMessage) {
            console.error("Error:", errorMessage);
        }
    });
}

function fetchintypemass() {  // Use a different name here if required
    $.ajax({
        url: new URL(`/jssl/master/listinvoicetypenew`, baseUrl),
        type: "GET", // HTTP method
		xhrFields: {
			    withCredentials: true
			},
        dataType: "json",
        //data: { factory_id: selectedFactoryId }, // Passing the factoryId in the request
        success: function (data) {
            var arrays = data.INVOICE_TYPE_LIST;
            document.getElementById("intypeew").textContent = arrays.length;
        },
        error: function (jqXhr, textStatus, errorMessage) {
            console.error("Error:", errorMessage);
        }
    });
}

function fetchininnrem() {  // Use a different name here if required
    $.ajax({
        url: new URL(`/jssl/master/listinvoicetyperemarksnew`, baseUrl),
        type: "GET", // HTTP method
		xhrFields: {
			    withCredentials: true
			},
        dataType: "json",
        //data: { factory_id: selectedFactoryId }, // Passing the factoryId in the request
        success: function (data) {
            var arrays = data.INVOICE_TYPE_LIST;
            document.getElementById("inremnew").textContent = arrays.length;
        },
        error: function (jqXhr, textStatus, errorMessage) {
            console.error("Error:", errorMessage);
        }
    });
}

function fetchasigncon(selectedFactoryId) {  // Use a different name here if required
    $.ajax({
        url: new URL(`/jssl/contract/listcontractnew`, baseUrl),
        type: "GET", // HTTP method
		xhrFields: {
			    withCredentials: true
			},
        dataType: "json",
        data: { factory_id: selectedFactoryId }, // Passing the factoryId in the request
        success: function (data) {
            var arrays = data.Data;
            document.getElementById("assigncontractnew").textContent = arrays.length;
        },
        error: function (jqXhr, textStatus, errorMessage) {
            console.error("Error:", errorMessage);
        }
    });
}

function fetchexptitle() {  // Use a different name here if required
    $.ajax({
        url: new URL(`/jssl/master/allExportTitleList`, baseUrl),
        type: "GET", // HTTP method
		xhrFields: {
			    withCredentials: true
			},
        dataType: "json",
        data: {}, // Passing the factoryId in the request
        success: function (data) {
            var arrays = data.ExportTitleDetails;
            document.getElementById("titext").textContent = arrays.length;
        },
        error: function (jqXhr, textStatus, errorMessage) {
            console.error("Error:", errorMessage);
        }
    });
}

function satemasnew() {  // Use a different name here if required
    $.ajax({
        url: new URL(`/jssl/state/getAllStatesNew`, baseUrl),
        type: "GET", // HTTP method
		xhrFields: {
			    withCredentials: true
			},
        dataType: "json",
        //data: { factory_id: selectedFactoryId }, // Passing the factoryId in the request
        success: function (data) {
            var arrays = data.StateDetailsNew;
            document.getElementById("satemasnew").textContent = arrays.length;
        },
        error: function (jqXhr, textStatus, errorMessage) {
            console.error("Error:", errorMessage);
        }
    });
}

function countrtnewtest() {  // Use a different name here if required
    $.ajax({
        url: new URL(`/jssl/country/getAllCountryListNew`, baseUrl),
        type: "GET", // HTTP method
		xhrFields: {
			    withCredentials: true
			},
        dataType: "json",
        //data: { factory_id: selectedFactoryId }, // Passing the factoryId in the request
        success: function (data) {
            var arrays = data.AllCountryDetailsNew;
            document.getElementById("countrtnewtest").textContent = arrays.length;
        },
        error: function (jqXhr, textStatus, errorMessage) {
            console.error("Error:", errorMessage);
        }
    });
}

function scraptypetestnew() {  // Use a different name here if required
    $.ajax({
        url: new URL(`/jssl/salesordertype/list`, baseUrl),
        type: "GET", // HTTP method
		xhrFields: {
			    withCredentials: true
			},
        dataType: "json",
        //data: { factory_id: selectedFactoryId }, // Passing the factoryId in the request
        success: function (data) {
            var arrays = data.SalesOrderTypeDetails;
            document.getElementById("scraptypetestnew").textContent = arrays.length;
        },
        error: function (jqXhr, textStatus, errorMessage) {
            console.error("Error:", errorMessage);
        }
    });
}

function workordernew() {  // Use a different name here if required
    $.ajax({
        url: new URL(`/jssl/master/listworkordermasternew`, baseUrl),
        type: "GET", // HTTP method
		xhrFields: {
			    withCredentials: true
			},
        dataType: "json",
        //data: { factory_id: selectedFactoryId }, // Passing the factoryId in the request
        success: function (data) {
            var arrays = data.Data;
            document.getElementById("workordernew").textContent = arrays.length;
        },
        error: function (jqXhr, textStatus, errorMessage) {
            console.error("Error:", errorMessage);
        }
    });
}

function othertypenew11test() {  // Use a different name here if required
    $.ajax({
        url: new URL(`/jssl/master/listothertypemasternew`, baseUrl),
        type: "GET", // HTTP method
		xhrFields: {
			    withCredentials: true
			},
        dataType: "json",
        //data: { factory_id: selectedFactoryId }, // Passing the factoryId in the request
        success: function (data) {
            var arrays = data.Data;
            document.getElementById("othertypenew11test").textContent = arrays.length;
        },
        error: function (jqXhr, textStatus, errorMessage) {
            console.error("Error:", errorMessage);
        }
    });
}

function gstmastertestnew() {  // Use a different name here if required
    $.ajax({
        url: new URL(`/jssl/master/listgstmasternew`, baseUrl),
        type: "GET", // HTTP method
		xhrFields: {
			    withCredentials: true
			},
        dataType: "json",
        //data: { factory_id: selectedFactoryId }, // Passing the factoryId in the request
        success: function (data) {
            var arrays = data.Data;
            document.getElementById("gstmastertestnew").textContent = arrays.length;
        },
        error: function (jqXhr, textStatus, errorMessage) {
            console.error("Error:", errorMessage);
        }
    });
}

function orgnew() {  // Use a different name here if required
    $.ajax({
        url: new URL(`/jssl/organization/listorganization`, baseUrl),
        type: "GET", // HTTP method
		xhrFields: {
			    withCredentials: true
			},
        dataType: "json",
        //data: { factory_id: selectedFactoryId }, // Passing the factoryId in the request
        success: function (data) {
            var arrays = data.Data;
            document.getElementById("orgnew").textContent = arrays.length;
        },
        error: function (jqXhr, textStatus, errorMessage) {
            console.error("Error:", errorMessage);
        }
    });
}

function bankdelnew() {  // Use a different name here if required
    $.ajax({
        url: new URL(`/jssl/bank/listbankaccount`, baseUrl),
        type: "GET", // HTTP method
		xhrFields: {
			    withCredentials: true
			},
        dataType: "json",
        //data: { factory_id: selectedFactoryId }, // Passing the factoryId in the request
        success: function (data) {
            var arrays = data.Data;
            document.getElementById("bankdelnew").textContent = arrays.length;
        },
        error: function (jqXhr, textStatus, errorMessage) {
            console.error("Error:", errorMessage);
        }
    });
}

function openingnew(selectedFactoryId) {  // Use a different name here if required
    $.ajax({
        url: new URL(`/jssl/listopeningbalancenew`, baseUrl),
        type: "GET", // HTTP method
		xhrFields: {
			    withCredentials: true
			},
        dataType: "json",
        data: { factory_id: selectedFactoryId }, // Passing the factoryId in the request
        success: function (data) {
            var arrays = data.Data;
            document.getElementById("openingnew").textContent = arrays.length;
        },
        error: function (jqXhr, textStatus, errorMessage) {
            console.error("Error:", errorMessage);
        }
    });
}
function milenewtest() {  // Use a different name here if required
    $.ajax({
        url: new URL(`/jssl/master/listmilestonemasternew`, baseUrl),
        type: "GET", // HTTP method
		xhrFields: {
			    withCredentials: true
			},
        dataType: "json",
        //data: { factory_id: selectedFactoryId }, // Passing the factoryId in the request
        success: function (data) {
            var arrays = data.Data;
            document.getElementById("milenewtest").textContent = arrays.length;
        },
        error: function (jqXhr, textStatus, errorMessage) {
            console.error("Error:", errorMessage);
        }
    });
}
function servicetestnew2() {  // Use a different name here if required
    $.ajax({
        url: new URL(`/jssl/master/listbothhsnservicecodemasternew`, baseUrl),
        type: "GET", // HTTP method
		xhrFields: {
			    withCredentials: true
			},
        dataType: "json",
        //data: { factory_id: selectedFactoryId }, // Passing the factoryId in the request
        success: function (data) {
            var arrays = data.Data;
            document.getElementById("servicetestnew2").textContent = arrays.length;
        },
        error: function (jqXhr, textStatus, errorMessage) {
            console.error("Error:", errorMessage);
        }
    });
}