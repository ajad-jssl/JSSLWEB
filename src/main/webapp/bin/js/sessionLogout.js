window.addEventListener("beforeunload", function () {
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
	            sessionStorage.removeItem("username");
	            sessionStorage.removeItem("isLoggedIn");
	            localStorage.removeItem("selectedFactoryId"); // Clear selected factory ID
	            
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
});

