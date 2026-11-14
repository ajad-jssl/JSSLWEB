const MainPage =  window.location.pathname.split("/").pop()+'.jsp';
const UserId = sessionStorage.getItem('username');

let allowedActions = [];

async function loadActions() {
    try {
        const response = await fetch(
            `${baseUrl}/api/page/actions?userId=${encodeURIComponent(UserId)}&pageName=${encodeURIComponent(MainPage)}`,
            {
                method: "GET",
                credentials: "include", // send cookies/session
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

$(document).ready(function () {
	loadActions();

    // =============================
    // SELECT2 -> G2 UNLOCK USER DROPDOWN ONLY
    // =============================
    $('#g2UnlockUser').select2({
        theme: 'bootstrap4',
        placeholder: '-- Select User --',
        allowClear: true,
        width: '100%'
    });

    // hide validation message once a user is chosen
    $('#g2UnlockUser').on('change', function () {
        if ($(this).val()) {
            $("#g2UnlockError").hide();
        }
    });

    // Initially hide tabs
    $('#userTab').hide();
    $('#userTabContent').hide();

    // When user type is selected
    $('#userTypeSelect').change(function () {
        const userType = $(this).val();

        if (userType === 'JIMS') {

            loadInactiveUsers(); // for Inactive tab dropdown
            loadLockedUsers();   // for Unlock tab dropdown

            $('#userTab').show();
            $('#userTabContent').show();

			$("#g2UserTab").hide();
			$("#g2UserTabContent").hide();
            $('#inactive-tab').tab('show'); // DEFAULT TAB = INACTIVE
        }


		else if(userType ==='G2'){

			loadG2InactiveUsers()
			loadG2LockedUsers();
			$("#g2UserTab").show();
		    $("#g2UserTabContent").show();

			$('#userTab').hide();
			$('#userTabContent').hide();

		}

		else {
            $('#userTab').hide();
            $('#userTabContent').hide();
			$("#g2UserTab").hide();
		   $("#g2UserTabContent").hide();
        }
    });

      //=============================//
     //     INACTIVE USER SUBMIT   //
     // =============================//
    $("#inactivesubmit").click(async function () {

        let selected_id = $("#inactiveUser").val().trim();
        let reason = $("#inactiveReason").val().trim();

        if (!selected_id) {
           $("#inactiveError").show();
            return;
        }

        try {
           const response = await fetch(`${baseUrl}/api/inactive/activated/${selected_id}`,  {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ inactive_remarks: reason }),
                credentials: 'include'
            });

            if (!response.ok) throw new Error("Failed to inactivate user");

            showPopup("The User is Successfully Activated", "UserUnlockMenu.jsp");
            $("#inactiveReason").val('');

        } catch (error) {
            console.error(error);
            alert("Error inactivating user");
        }
    });

});

// =============================
// FETCH INACTIVE USERS FOR INACTIVE TAB
// =============================
async function loadInactiveUsers() {
    try {
       const response = await fetch(`${baseUrl}/api/inactive/is_inactive`, {
            credentials: "include"
        });

        if (!response.ok) throw new Error("Failed to fetch inactive users");

        const users = await response.json();
        let dropdown = document.getElementById("inactiveUser");
        dropdown.innerHTML = `<option value="">-- Select User --</option>`;

        users.forEach(user => {
            let option = document.createElement("option");
            option.value = user.id;
            option.textContent = user.username;
            dropdown.appendChild(option);
        });

    } catch (error) {
        console.error("Error loading inactive users:", error);
    }
}

// =============================
// FETCH LOCKED USERS FOR UNLOCK TAB
// =============================
async function loadLockedUsers() {
    try {
        const response = await fetch(`${baseUrl}/api/inactive/is_locked`, {
            credentials: "include"
        });

        if (!response.ok) throw new Error("Failed to fetch locked users");

        const users = await response.json();
        let dropdown = document.getElementById("unlockUser");
        dropdown.innerHTML = `<option value="">-- Select User --</option>`;

        users.forEach(user => {
            let option = document.createElement("option");
            option.value = user.id;
            option.textContent = user.username;
            dropdown.appendChild(option);
        });

    } catch (error) {
        console.error("Error loading locked users:", error);
    }
}

   //===========================//
   //  UNLOCK USER SUBMIT       //
   // =========================//


$("#unlocksubmit").click(async function () {
	  const allowed = allowedActions || [];

	if (!allowed.includes("Unlock/Lock")) {
	  alert(" You do not have permission to Unlock/Lock.");
	  return;
	}
    let selected_id = $("#unlockUser").val().trim();
    let reason = $("#unlockReason").val().trim();

    if (!selected_id) {
        $("#unlockError").show();
        return;
    }
	const ModifiedBy =sessionStorage.getItem("id");
	let currentDate = new Date();
let currentDateTimeString = getIndianDateTimeFormat(currentDate);


    try {
        const response = await fetch(`${baseUrl}/api/inactive/unlock/${selected_id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
			body: JSON.stringify({
			    unlockRemarks: reason,
			    modifiedBy: ModifiedBy,
			    modifiedDate: currentDateTimeString
			}),
            credentials: 'include'
        });

        if (!response.ok) throw new Error("Failed to unlock user");

        showPopup("The User is Successfully Unlocked", "UserUnlockMenu.jsp");
        $("#unlockReason").val('');

    } catch (error) {
        console.error(error);
        alert("Error unlocking user");
    }
});



async function loadG2InactiveUsers() {
    const apiUrl = `${baseUrl}/api/inactive/mis/is_inactive`;

    try {
        const response = await fetch(apiUrl,{credentials:"include"});
        const users = await response.json();

        const dropdown = document.getElementById("g2InactiveUser");
        // (the G2 inactive tab is commented out in the JSP, so guard against a missing element)
        if (!dropdown) return;
        dropdown.innerHTML = `<option value="">-- Select User --</option>`;

        users.forEach(user => {
            let cleanName = user.userName.trim();    // remove extra spaces

            dropdown.innerHTML += `
                <option value="${user.userId}">
                    ${cleanName}
                </option>
            `;
        });

    } catch (error) {
        console.error("Error loading G2 inactive users:", error);
    }
}

// =============================
// FETCH G2 LOCKED USERS (Select2 dropdown)
// =============================
async function loadG2LockedUsers() {
    const apiUrl = `${baseUrl}/api/inactive/mis/is_loced`;

    try {
        const response = await fetch(apiUrl,{credentials:"include"});
        const users = await response.json();

        const dropdown = document.getElementById("g2UnlockUser");
        dropdown.innerHTML = `<option value="">-- Select User --</option>`;

        users.forEach(user => {
            let option = document.createElement("option");
            option.value = user.userId;
            option.textContent = user.userName.trim(); // remove extra spaces
            dropdown.appendChild(option);
        });

        // refresh Select2 UI after the options were rebuilt
        $('#g2UnlockUser').val('').trigger('change');

    } catch (error) {
        console.error("Error loading G2 locked users:", error);
    }
}





$("#g2InactiveSubmit").click(async function (){
let g2inactiveuser =$("#g2InactiveUser").val().trim();
let getinactivereason = $("#g2InactiveReason").val().trim();

if (!g2inactiveuser) {
       $("#g2InactiveError").show();
       return;
   }

   try {
       const response = await fetch(`${baseUrl}/api/inactive/mis/activated/${g2inactiveuser}`, {
           method: 'PUT',
           headers: {
               'Content-Type': 'application/json'
           },
           body: JSON.stringify({ remarks:getinactivereason }),
           credentials: 'include'
       });

       if (!response.ok) throw new Error("Failed to unlock user");

       showPopup("The User is Successfully  Unlocked", "UserUnlockMenu.jsp");
       $("#g2InactiveReason").val('');

   } catch (error) {
       console.error(error);
       alert("Error unlocking user");
   }
});


$("#g2UnlockSubmit").click(async function(){
	  const allowed = allowedActions || [];

	if (!allowed.includes("Unlock/Lock")) {
	  alert(" You do not have permission to Unlock/Lock.");
	  return;
	}
	// val() can be null with Select2 when cleared, so guard before trim()
	let g2unlockid = ($("#g2UnlockUser").val() || "").trim();
	let g2unlockreason = $("#g2UnlockReason").val().trim();
	let releasedby =sessionStorage.getItem("id");

	if(!g2unlockid){
		$("#g2UnlockError").show();
		return;
	}

	try {
	    const response = await fetch(`${baseUrl}/api/inactive/mis/unlock/${g2unlockid}`, {
	        method: 'PUT',
	        headers: {
	            'Content-Type': 'application/json'
	        },
	        body: JSON.stringify({ remarks: g2unlockreason ,releasedby :releasedby}),
	        credentials: 'include'
	    });

	    if (!response.ok) throw new Error("Failed to unlock user");

	    showPopup("The User is Successfully Unlocked", "UserUnlockMenu.jsp");
	    $("#g2UnlockReason").val('');

	} catch (error) {
	    console.error(error);
	    alert("Error unlocking user");
	}

})


function getIndianDateTimeFormat(date) {
    const options = {
        timeZone: 'Asia/Kolkata',
        hour12: false,
    };
    const istDate = new Date(date.toLocaleString('en-US', options));
    return `${istDate.getFullYear()}-${(istDate.getMonth() + 1).toString().padStart(2, '0')}-${istDate.getDate().toString().padStart(2, '0')}T${istDate.getHours().toString().padStart(2, '0')}:${istDate.getMinutes().toString().padStart(2, '0')}:${istDate.getSeconds().toString().padStart(2, '0')}`;
}



// =============================
// Popup Message
// =============================
function showPopup(message, redirectUrl) {
    var popup = $('<div class="popup">' + message + '</div>')
        .appendTo('body')
        .hide()
        .fadeIn(400);

    setTimeout(function () {
        popup.fadeOut(400, function () {
            $(this).remove();
            window.location = redirectUrl;
        });
    }, 2000);
}