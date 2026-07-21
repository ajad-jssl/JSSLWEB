// otpval.js

let otpTime = 60; // 10 seconds for testing
let timerInterval;
let isOtpVerified = false;

// -------------------- OTP Timer --------------------
function startOtpTimer() {
    const timerDisplay = document.getElementById('otpTimer');
    if (!timerDisplay) return;
    
    timerInterval = setInterval(() => {
        let minutes = Math.floor(otpTime / 60);
        let seconds = otpTime % 60;
        timerDisplay.innerText = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        otpTime--;
        
        if (otpTime < 0) {
            clearInterval(timerInterval);
            timerDisplay.innerText = "OTP expired. Please resend.";
            timerDisplay.style.color = "#dc2626";
            timerDisplay.style.fontWeight = "bold";
            disableOtpInputs();
            
            // Hide verify button and show resend button only if OTP is not verified
            if (!isOtpVerified) {
                hideVerifyButton();
                showResendButton();
            }
        }
    }, 1000);
}

function stopOtpTimer() {
    clearInterval(timerInterval);
}

function disableOtpInputs() {
    document.querySelectorAll('.otp-input').forEach(input => {
        input.disabled = true;
    });
}

function makeOtpReadonly() {
    document.querySelectorAll('.otp-input').forEach(input => {
        input.disabled = true;
        input.style.backgroundColor = "#e2e8f0";
        input.style.cursor = "default";
        input.style.borderColor = "#22c55e";
    });
}

function enableOtpInputs() {
    document.querySelectorAll('.otp-input').forEach(input => {
        input.disabled = false;
        input.style.backgroundColor = "#f8fafc";
        input.style.cursor = "text";
        input.style.borderColor = "#cbd5e1";
    });
}

function hideVerifyButton() {
    const verifyBtn = document.querySelector('.submit_button:not(#resendOtpBtn)');
    if (verifyBtn) {
        verifyBtn.style.display = 'none';
    }
}

function showVerifyButton() {
    const verifyBtn = document.querySelector('.submit_button:not(#resendOtpBtn)');
    if (verifyBtn) {
        verifyBtn.style.display = 'block';
    }
}

function showResendButton() {
    const existingBtn = document.getElementById('resendOtpBtn');
    if (existingBtn) return;
    
    const resendBtn = document.createElement('button');
    resendBtn.id = 'resendOtpBtn';
    resendBtn.type = 'button';
    resendBtn.innerText = "Resend OTP";
    resendBtn.className = "submit_button";
    resendBtn.style.marginTop = "10px";
    resendBtn.style.backgroundColor = "#f97316";
    resendBtn.onmouseover = function() {
        this.style.backgroundColor = "#ea580c";
    };
    resendBtn.onmouseout = function() {
        this.style.backgroundColor = "#f97316";
    };
    resendBtn.onclick = (e) => {
        e.preventDefault();
        resendOTP();
    };
    
    const timerElement = document.getElementById('otpTimer');
    if (timerElement && timerElement.parentNode) {
        timerElement.parentNode.insertBefore(resendBtn, timerElement.nextSibling);
    }
}

function removeResendButton() {
    const resendBtn = document.getElementById('resendOtpBtn');
    if (resendBtn) {
        resendBtn.remove();
    }
}


	function resendOTP() {
	    console.log("Resend clicked");

	    // Immediately redirect (remove loading for testing)
	    window.location.href = 'forgotpass.jsp';
	}


$(document).ready(function() {

    // -------------------- Disable Back Button --------------------
    disableBackButton();

    // -------------------- Start Timer --------------------
    startOtpTimer();

    // -------------------- Disable autocomplete for OTP --------------------
    $('.otp-input').attr('autocomplete', 'off');

    // -------------------- OTP Input Autofocus --------------------
    const otpInputs = document.querySelectorAll('.otp-input');
    otpInputs.forEach((input, index) => {
        // Only allow numbers
        input.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/[^0-9]/g, '');
            
            if (input.value.length === 1 && index < otpInputs.length - 1) {
                otpInputs[index + 1].focus();
            }
        });
        
        // Move back on backspace
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Backspace' && input.value === '' && index > 0) {
                otpInputs[index - 1].focus();
            }
        });
    });

    // -------------------- Verify OTP First --------------------
    window.openModalEdit = function() {
        const otp = Array.from(document.querySelectorAll('.otp-input')).map(i => i.value).join('');

        // Clear previous errors
        $('#otpError').text("");
        $('#productCodeErrorcreditss1').text("");
        $('#productCodeErrorcreditss3').text("");

        let showError = false;

        // Validate OTP
        if (!otp || otp.length !== 6) {
            $('#otpError').text("Please enter all 6 digits of OTP");
            showError = true;
            return;
        }

        // If password fields are visible, validate passwords
		if ($('#passwordFields').is(':visible')) {

		    const newPasswordInput = document.getElementById("new_password");
		    const confirmPasswordInput = document.getElementById("confirm_password");

		    const newPasswordError = document.getElementById("productCodeErrorcreditss1");
		    const confirmPasswordError = document.getElementById("productCodeErrorcreditss3");

		    // Clear previous messages
		    newPasswordError.innerText = "";
		    confirmPasswordError.innerText = "";

		    const new_password = newPasswordInput.value.trim();
		    const confirm_password = confirmPasswordInput.value.trim();

		    if (!new_password) {
		        newPasswordError.innerText = "New password is required";
		        showError = true;
		    } else {

		        // Same strong regex as your create password
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

		        if (weakPasswords.includes(new_password.toLowerCase())) {
		            newPasswordError.innerText =
		                "Password is too weak. Please choose a stronger password.";
		            showError = true;
		        }
		        else if (!strongPasswordRegex.test(new_password)) {
		            newPasswordError.innerText =
		                "Password must be at least 8 characters and include a letter, number, and special character.";
		            showError = true;
		        }
		    }

		    if (!confirm_password) {
		        confirmPasswordError.innerText = "Please confirm password";
		        showError = true;
		    }

		    if (new_password && confirm_password && new_password !== confirm_password) {
		        confirmPasswordError.innerText = "Passwords do not match";
		        showError = true;
		    }

		    if (!showError) {
		        $('#exampleModalCenterupdate').modal('show');
		    }

		} else {
		    verifyOTPWithBackend(otp);
		}
    };
	
	
	

    // -------------------- Verify OTP with Backend --------------------
    function verifyOTPWithBackend(otp) {
        showLoadingState(true, "Verifying OTP...");

        $.ajax({
            url: baseUrl + '/jssl/user/verifyotp',
            type: 'POST',
            dataType: 'json',
            data: $.param({
                otp: otp
            }),
            success: function(data) {
                showLoadingState(false);

                if (data.status === "yes") {
                    isOtpVerified = true;
                    $('#otpError').text("");
                    
                    // Stop the timer
                    stopOtpTimer();
                    
                    // Update timer display to show verification status
                    const timerDisplay = document.getElementById('otpTimer');
                    timerDisplay.innerText = "OTP Verified";
                    timerDisplay.style.color = "#22c55e";
                    timerDisplay.style.fontWeight = "bold";
                    
                    // Make OTP fields readonly
                    makeOtpReadonly();
                    
                    // Remove resend button if it exists
                    removeResendButton();
                    
                    // Show success message
                   /* showSuccessMessage("OTP Verified Successfully!");*/
				   
				   
				   showSuccessPopupsss("OTP Verified Successfully!");
                    
                    // Show password fields after a short delay
                    setTimeout(() => {
                        $('#passwordFields').slideDown(300);
                        document.querySelector('.submit_button').textContent = "Submit";
                        document.querySelector('.submit_button').style.display = 'block';
                        document.querySelector('.submit_button').onclick = function() {
                            openModalEdit(); // Call itself again to validate passwords
                        };
                        // Focus on first password field
                        $('#new_password').focus();
                    }, 1500);
                } else {
                    isOtpVerified = false;
                    $('#otpError').text(data.message || "OTP verification failed");
                    showErrorModal(data.message || "OTP verification failed");
                }
            },
            error: function(xhr) {
                showLoadingState(false);
                isOtpVerified = false;
                
                let errorMsg = 'Error verifying OTP. Please try again.';
                if (xhr.responseJSON && xhr.responseJSON.message) {
                    errorMsg = xhr.responseJSON.message;
                }
                
                $('#otpError').text(errorMsg);
                showErrorModal(errorMsg);
            }
        });
    }

    // -------------------- Submit Password Reset --------------------
    window.editevent = function() {
        if (!isOtpVerified) {
            showErrorModal("Please verify OTP first");
            return;
        }

        const otp = Array.from(document.querySelectorAll('.otp-input')).map(i => i.value).join('');
        const new_password = $('#new_password').val().trim();
        const confirm_password = $('#confirm_password').val().trim();

        // Show loading state
        showLoadingState(true, "Processing...");

        $.ajax({
            url: baseUrl + '/jssl/user/otpvalidation',
            type: 'POST',
            dataType: 'json',
            data: $.param({
                otp: otp,
                newPassword: new_password,
                confirmPassword: confirm_password
            }),
            success: function(data) {
                showLoadingState(false);
                $('#exampleModalCenterupdate').modal('hide');
                
                // Check for success messages (case-insensitive)
                const message = data.message || data.Message || '';
                const messageStr = message.toLowerCase();

                if (messageStr.includes("successfully") && messageStr.includes("password")) {
                    showSuccessPopup("Password Reset Successfully!");
                } else if (data.status === "yes") {
                    showSuccessPopup("Password Reset Successfully!");
                } else {
                    // Show error message
                    showErrorModal(message || 'Failed to reset password');
                    
                    // Clear form if error
                    if (messageStr.includes("password")) {
                        resetForm();
                    }
                }
            },
            error: function(xhr) {
                showLoadingState(false);
                $('#exampleModalCenterupdate').modal('hide');
                
                let errorMsg = 'An error occurred. Please try again.';
                if (xhr.responseJSON && xhr.responseJSON.message) {
                    errorMsg = xhr.responseJSON.message;
                }
                
                showErrorModal(errorMsg);
            }
        });
    };

    function showLoadingState(isLoading, text = "Processing...") {
        const submitBtn = document.querySelector('.submit_button:not(#resendOtpBtn)');
        if (!submitBtn) return;
        
        if (isLoading) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> ' + text;
            submitBtn.style.opacity = "0.6";
        } else {
            submitBtn.disabled = false;
            submitBtn.style.opacity = "1";
        }
    }

    function resetForm() {
        isOtpVerified = false;
        enableOtpInputs();
        document.querySelectorAll('.otp-input').forEach(input => {
            input.value = '';
        });
        $('#passwordFields').slideUp(300);
        document.querySelector('.submit_button').textContent = "Verify OTP";
        document.querySelector('.submit_button').onclick = openModalEdit;
        document.querySelector('.submit_button').style.display = 'block';
        otpTime = 10;
        clearInterval(timerInterval);
        
        const timerDisplay = document.getElementById('otpTimer');
        timerDisplay.style.color = "inherit";
        timerDisplay.style.fontWeight = "normal";
        
        removeResendButton();
        startOtpTimer();
    }

    function showSuccessPopup(message) {
        $('<div class="popup"><i class="fas fa-check-circle"></i> ' + message + '</div>')
            .appendTo('body')
            .hide()
            .fadeIn(400)
            .delay(2000)
            .fadeOut(400, function() {
                $(this).remove();
                window.location = 'newlogin.jsp';
            });
    }
	
	function showSuccessPopupsss(message) {
	    $('<div class="popup"><i class="fas fa-check-circle"></i> ' + message + '</div>')
	        .appendTo('body')
	        .hide()
	        .fadeIn(400)
	        .delay(2000)
	        .fadeOut(400, function() {
	          
	        });
	}


/*    function showSuccessMessage(message) {
        $('<div class="popup popup-info"><i class="fas fa-info-circle"></i> ' + message + '</div>')
            .appendTo('body')
            .hide()
            .fadeIn(400)
            .delay(2500)
            .fadeOut(400, function() {
                $(this).remove();
            });
    }
*/
    function showErrorModal(message) {
        $('#errorMessageup').html('<i class="fas fa-exclamation-circle"></i> ' + message);
        $('#exampleModalCenterDupUP').modal('show');
    }
});

// -------------------- Disable Back Button --------------------
function disableBackButton() {
    // Prevent back button from working
    window.history.pushState(null, null, window.location.href);
    window.onpopstate = function() {
        window.history.pushState(null, null, window.location.href);
    };
}

// -------------------- User Inactivity Logout --------------------
let inactivityTimer;

function resetInactivityTimer() {
    clearTimeout(inactivityTimer);
    inactivityTimer = setTimeout(() => {
        logoutUser();
    }, 900000); // 15 minutes
}

// Reset timer on user activity
window.addEventListener('mousemove', resetInactivityTimer);
window.addEventListener('keydown', resetInactivityTimer);
window.addEventListener('click', resetInactivityTimer);
window.addEventListener('scroll', resetInactivityTimer);

window.logoutUser = function() {
    const user_id = sessionStorage.getItem('user_id');
    
    if (!user_id) {
        window.location = 'newlogin.jsp';
        return;
    }
    
    if (typeof baseUrl === 'undefined' || !baseUrl) {
        console.error("baseUrl is not defined.");
        return;
    }

    const url = baseUrl.endsWith('/') ? baseUrl + 'jssl/user/userlogout' : baseUrl + '/jssl/user/userlogout';

    $.ajax({
        url: url,
        type: 'POST',
        data: $.param({ user_id: user_id }),
        contentType: 'application/x-www-form-urlencoded',
        dataType: 'json',
        cache: false,
        success: function(data) {
            if (data.status === "yes" || (data.message && data.message.includes("Success"))) {
                sessionStorage.clear();
                localStorage.removeItem("selectedFactoryId");
                window.location = "newlogin.jsp";
            }
        },
        error: function() {
            window.location = "newlogin.jsp";
        }
    });
};



function toggleNewPassword() {
    const input = document.getElementById("new_password");
    const icon = document.getElementById("eyeIconNew");

    if (input.type === "password") {
        input.type = "text";
        icon.classList.replace("fa-eye", "fa-eye-slash");
    } else {
        input.type = "password";
        icon.classList.replace("fa-eye-slash", "fa-eye");
    }
}


function toggleConfirmPassword() {
    const input = document.getElementById("confirm_password");
    const icon = document.getElementById("eyeIconConfirm");

    if (input.type === "password") {
        input.type = "text";
        icon.classList.replace("fa-eye", "fa-eye-slash");
    } else {
        input.type = "password";
        icon.classList.replace("fa-eye-slash", "fa-eye");
    }
}