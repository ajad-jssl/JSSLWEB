/*function logoutUser(event) {
    event.preventDefault(); 

    var user_id = sessionStorage.getItem('user_id'); 
    if (!user_id) {
        alert("User ID not found. Please login first.");
        return;
    }

    if (typeof baseUrl === 'undefined' || !baseUrl) {
        console.error("baseUrl is not defined or is empty.");
        return;
    }

    const url = baseUrl.endsWith('/') ? baseUrl + 'jssl/user/userlogout' : baseUrl + '/jssl/user/userlogout';

    $.ajax({
        url: url,
        type: 'POST',
		xhrFields: {
			    withCredentials: true
			},
        data: $.param({ user_id: user_id }),
        contentType: 'application/x-www-form-urlencoded',
        dataType: 'json',
        cache: false,
        success: function(data) {
            console.log("Server response:", data);
            
            if (data.status === "yes" && data.message === "Logout Success") {
                // Clear session storage and local storage
                sessionStorage.removeItem("user_id");
				sessionStorage.removeItem("allowedPages");
				sessionStorage.removeItem("id");
				localStorage.removeItem("user_id");
                sessionStorage.removeItem("username");
                sessionStorage.removeItem("isLoggedIn");
                localStorage.removeItem("selectedFactoryId"); 
				sessionStorage.clear();
                
                window.location = "newlogin.jsp"; // Redirect to login page
            } else {
                console.error("Logout failed.");
            }
        },
        error: function(xhr, status, error) {
            console.error("AJAX error:", error);
            console.error("Response text:", xhr.responseText);
            alert("Error: " + (xhr.responseText || "An error occurred."));
        }
    });
}
*/


// Logout function
function logoutUser(event) {

    if (event && event.preventDefault) {
        event.preventDefault();
    }

    const user_id = sessionStorage.getItem("user_id");

    if (!user_id) {
        clearAndRedirect();
        return;
    }

    $.ajax({
        url: baseUrl + "/jssl/user/userlogout",
        type: "POST",
        xhrFields: {
            withCredentials: true
        },
        data: {
            user_id: user_id
        },
        complete: function () {
            clearAndRedirect();
        }
    });

    function clearAndRedirect() {

        sessionStorage.clear();
        localStorage.clear();

        window.location.href = "newlogin";
    }
}

// Page permission check
/*(function checkPagePermission() {
    const userId = sessionStorage.getItem("user_id");
    const allowedPages = JSON.parse(sessionStorage.getItem("allowedPages") || "[]");

    if (!userId) {
        logoutUser();
        return;
    }

    // Get current page path without query params or hash
    let currentPage = window.location.pathname.split("/").pop().split("?")[0].split("#")[0].toLowerCase();
    currentPage = currentPage.replace(".jsp", "");

    // ✅ Landing page bypass
    const landingPages = ["dashboard", "landing", ""]; // empty string handles root "/"
    if (landingPages.includes(currentPage)) {
        return; // skip permission check
    }

    if (!allowedPages || allowedPages.length === 0) {
        logoutUser();
        return;
    }

    // Check if current page exists in allowedPages
    const hasAccess = allowedPages.some(page => {
        return page.toLowerCase().replace(".jsp", "") === currentPage;
    });

    if (!hasAccess) {
        logoutUser();
    }
})();*/


/*
(function detectManualUrlChange() {
    let lastUrl = window.location.href;

    // Check URL periodically
    setInterval(() => {
        const currentUrl = window.location.href;

        if (currentUrl !== lastUrl) {
            // URL changed manually
            console.warn("URL changed manually → logging out");
            logoutUser({ preventDefault: function() {} });
        }

        lastUrl = currentUrl;
    }, 500); // check twice per second
})();*/
