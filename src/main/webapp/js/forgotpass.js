
/*document.addEventListener("DOMContentLoaded", function () {
	document.getElementById("captchaImage").crossOrigin = "use-credentials";
  document.getElementById("captchaImage").src = baseUrl + "/captcha-image";
document.getElementById("captchaImage").src = "http://localhost:8004/captcha-image";
});*/
function loadCaptcha() {
	const captcha = document.getElementById('captchaImage');
	    const button = document.querySelector('.refresh_icon_btn');

	    // Add rotating animation
	    button.classList.add('refreshing');

	    // Update captcha image with a unique query param to prevent caching
	    captcha.src = 'captcha.php?rand=' + Date.now();

	    // Remove rotation after animation duration
	    setTimeout(() => {
	        button.classList.remove('refreshing');
	    }, 600);
  fetch(new URL("/api/captcha-image",baseUrl), {
    method: "GET",
      
  })
    .then(response => response.blob())
    .then(blob => {
      const url = URL.createObjectURL(blob);
      document.getElementById("captchaImage").src = url;
    });
}

document.addEventListener("DOMContentLoaded", loadCaptcha);
function refreshCaptcha() {
  loadCaptcha();
}
function openModalEdit() {
    var email_password = document.getElementById('email_password').value.trim();
	var captcha_input = document.getElementById('captcha_input').value.trim();
    //var old_password = document.getElementById('old_password').value.trim();
    var showError = false; // Initialize showError variable

    // Username Validation
    if (email_password === '') {
        document.getElementById('productCodeErrorcreditss4').innerText = "Please Enter user email.";
        document.getElementById('productCodeErrorcreditss4').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeErrorcreditss4').innerText = "";
        document.getElementById('productCodeErrorcreditss4').style.display = "none";
    }
	
	if (captcha_input === '') {
	     alert("Please enter the CAPTCHA.");
	     showError = true;
	 }
    /*if (old_password === '') {
        document.getElementById('productCodeErrorcreditss').innerText = "Please Enter username.";
        document.getElementById('productCodeErrorcreditss').style.display = "inline-block";
        showError = true;
    } else {
        document.getElementById('productCodeErrorcreditss').innerText = "";
        document.getElementById('productCodeErrorcreditss').style.display = "none";
    }*/
    
    // If no errors, proceed
    if (!showError) {
        $('#exampleModalCenterupdate').modal('show'); // Show the next modal (Ensure this modal exists)
    }
}
/*function refreshCaptcha() {
    document.getElementById("captchaImage").src =  baseUrl+"/captcha-image";
	document.getElementById("captchaImage").src = "http://localhost:8004/captcha-image";
}*/
/*function editevent() {
    // Validate role code and role description
	var email = $('#email_password').val().trim();
	var captcha = $('#captcha_input').val().trim();
	$('#loadingSpinner').show();
	$('#exampleModalCenterupdate .modal-content').append('<div class="modal-disabled"></div>');

    $.ajax({
        url: new URL('/jssl/user/forgotpassword', baseUrl), // Move 'const' to the correct place
		url: new URL('http://localhost:8004/jssl/user/forgotpassword'), // Move 'const' to the correct place
        type: 'POST',
		xhrFields: {
			    withCredentials: true
			},
        dataType: 'json',
		data: jQuery.param({
		        email_id: email,
		        captcha_input: captcha
		    }),
			
			xhrFields: {
			    withCredentials: true
			},
			crossDomain: true,

        success: function(data) {
			$('#loadingSpinner').hide();
			$('#exampleModalCenterupdate .modal-disabled').remove();
			$('#exampleModalCenterupdate').modal('hide');
            var result = data.message; // No need to stringify
            
            if (result === "Email sent successfully!") {
                // Store permissions in sessionStorage
                const popup = $('<div class="popup">Mail sent Successfully!</div>')
                    .appendTo('body').hide().fadeIn(400);

                setTimeout(function() {
                    popup.fadeOut(400, function() {
                        $(this).remove();
                        window.location = 'otpval.jsp'; // Redirect to role list page
                    });
                }, 800);
            } else {
                const errorMessage = data.message || 'Failed to complete try again.';
                $('#errorMessageup').text(errorMessage); // Set the error message dynamically
                $('#exampleModalCenterDupUP').modal('show'); // Show the modal with the error message
                $('#exampleModalCenterupdate').modal('hide'); 
				refreshCaptcha(); // Refresh CAPTCHA if failed
            }
        },
		error: function (xhr, status, error) {
			$('#loadingSpinner').hide();
		    console.error("AJAX Error Details:");
		    console.error("Status:", status);
		    console.error("Error:", error);
		    console.error("Response:", xhr.responseText);
		    alert("An error occurred: " + error);
			refreshCaptcha(); // Refresh CAPTCHA if failed
		}
    });
}

*/



function editevent() {

    var email = $('#email_password').val().trim();
    var captcha = $('#captcha_input').val().trim();

    // Show loader
    $('#loadingSpinner').css('display', 'flex');

    // Disable modal interaction
    $('#exampleModalCenterupdate .modal-content')
        .append('<div class="modal-disabled"></div>');

    $.ajax({
		url: new URL('/jssl/user/forgotpassword', baseUrl),
        type: 'POST',
        dataType: 'json',
        crossDomain: true,
       
        data: {
            email_id: email,
            captcha_input: captcha
        },

        success: function (data) {

            // Hide loader
            $('#loadingSpinner').hide();
            $('#exampleModalCenterupdate .modal-disabled').remove();
            $('#exampleModalCenterupdate').modal('hide');

            if (data.message === "Email sent successfully!") {

                const popup = $('<div class="popup">OTP sent successfully. Please check your email.</div>')
                    .appendTo('body')
                    .hide()
                    .fadeIn(300);

                setTimeout(function () {
                    popup.fadeOut(300, function () {
                        $(this).remove();
                        window.location = 'otpval.jsp';
                    });
                }, 1200);

            } else {
                $('#errorMessageup').text(data.message || 'Failed. Try again.');
                $('#exampleModalCenterDupUP').modal('show');
                refreshCaptcha();
            }
        },

        error: function (xhr, status, error) {
            $('#loadingSpinner').hide();
            $('#exampleModalCenterupdate .modal-disabled').remove();

            console.error("AJAX Error:", error);
            alert("Something went wrong. Please try again.");
            refreshCaptcha();
        }
    });
}


function showPopup(message, redirectUrl = null) {
  var popup = $('<div class="popup">' + message + '</div>')
    .appendTo('body')
    .hide()
    .fadeIn(300);

  setTimeout(function () {
    popup.fadeOut(300, function () {
      $(this).remove();

      // Redirect ONLY if URL is provided
      if (redirectUrl) {
        window.location.href = redirectUrl;
      }
    });
  }, 2000);
}









