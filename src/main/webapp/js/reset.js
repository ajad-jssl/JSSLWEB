function openModalEdit() {

    var old_password = document.getElementById('old_password').value.trim();
    var new_password = document.getElementById('new_password').value.trim();
    var confirm_password = document.getElementById('confirm_password').value.trim();
    var email_password = document.getElementById('email_password').value.trim();

    var showError = false;

    // Error elements
    const emailError = document.getElementById('productCodeErrorcreditss4');
    const oldPassError = document.getElementById('productCodeErrorcreditss');
    const newPassError = document.getElementById('productCodeErrorcreditss1');
    const confirmPassError = document.getElementById('productCodeErrorcreditss3');

    // Clear old messages
    emailError.innerText = "";
    oldPassError.innerText = "";
    newPassError.innerText = "";
    confirmPassError.innerText = "";

  
    if (!email_password) {
        emailError.innerText = "Please Enter user email.";
        showError = true;
    }


    if (!old_password) {
        oldPassError.innerText = "Please Enter old password.";
        showError = true;
    }

    // =========================
    // Strong New Password Validation
    // =========================
    const strongPasswordRegex =
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&^#()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;

    const weakPasswords = [
        "12345678",
        "password",
        "123456789",
        "qwerty",
        "abc123",
        "123abc"
    ];

    if (!new_password) {

        newPassError.innerText = "New password is required";
        showError = true;

    } else if (weakPasswords.includes(new_password.toLowerCase())) {

        newPassError.innerText =
            "Password is too weak. Please choose a stronger password.";
        showError = true;

    } else if (!strongPasswordRegex.test(new_password)) {

        newPassError.innerText =
            "Password must be at least 8 characters and include a letter, number, and special character.";
        showError = true;
    }

    if (!confirm_password) {

        confirmPassError.innerText = "Please confirm password";
        showError = true;

    } else if (new_password !== confirm_password) {

        confirmPassError.innerText = "Passwords do not match";
        showError = true;
    }


    if (!showError) {
        $('#exampleModalCenterupdate').modal('show');
    }
}

function editevent() {
    // Validate role code and role description
    $.ajax({
        url: new URL('/jssl/user/resetpassword', baseUrl), // Move 'const' to the correct place
        type: 'POST',
	
        dataType: 'json',
		data: jQuery.param({oldPassword:old_password.value,email_id:email_password.value,newPassword:new_password.value,
		confirmPassword:confirm_password.value}),
        success: function(data) {
            var result = data.message; // No need to stringify
            
            if (result === "Password Reset Successfully.") {
                // Store permissions in sessionStorage
                const popup = $('<div class="popup">Password Reset Successfully!</div>')
                    .appendTo('body').hide().fadeIn(400);

                setTimeout(function() {
                    popup.fadeOut(400, function() {
                        $(this).remove();
                        window.location = 'newlogin.jsp'; // Redirect to role list page
                    });
                }, 800);
            } else {
                const errorMessage = data.message || 'Failed to create country.';
                $('#errorMessageup').text(errorMessage); // Set the error message dynamically
                $('#exampleModalCenterDupUP').modal('show'); // Show the modal with the error message
                $('#exampleModalCenterupdate').modal('hide'); 
            }
        },
        error: function() {
            // Handle AJAX error
            console.error('Request failed.');
        }
    });
}




function togglePassword(inputId, iconId) {

    var input = document.getElementById(inputId);
    var icon = document.getElementById(iconId);

    if (input.type === "password") {
        input.type = "text";
        icon.classList.remove("fa-eye");
        icon.classList.add("fa-eye-slash");
    } else {
        input.type = "password";
        icon.classList.remove("fa-eye-slash");
        icon.classList.add("fa-eye");
    }
}