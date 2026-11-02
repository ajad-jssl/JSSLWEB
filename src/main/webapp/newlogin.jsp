<%@page import="com.JSSL2024.property.PropertyLink"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%
  response.setHeader("Cache-Control", "no-cache, no-store, must-revalidate"); // HTTP 1.1
  response.setHeader("Pragma", "no-cache"); // HTTP 1.0
  response.setDateHeader("Expires", 0); // Proxies
%>
<%@ include file="version.jsp" %>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<!-- REQUIRED for mobile: without this the phone renders the page at desktop width -->
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>JSSL</title>
<link rel="stylesheet" href="css/newlogin.css">

<!-- Bootstrap CSS -->
<link href="externalLibrary/stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" rel="stylesheet">
<link rel="stylesheet" href="externalLibrary/cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css"/>

<style>
:root {
  --accent: #0f172a;
  --header-height: 100px;
  --footer-height: 60px;
  --bg-color: #f0f4f8;
  --primary-gradient: linear-gradient(135deg, #005bea, #00c6fb);
}

*, *::before, *::after { box-sizing: border-box; }

html, body {
  max-width: 100%;
  overflow-x: hidden;           /* no sideways scroll on phones */
}

/* ---------- Header (desktop) ---------- */
header {
  position: fixed;
  top: -40px;
  left: -30px;
  width: 100%;
  height: var(--header-height);
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  padding: 0 60px;
  backdrop-filter: blur(10px);
  z-index: 1000;
  font-family: 'Libre Baskerville', serif;
}
.header-logo { grid-column: 1; }
.header-logo img {
  height: 250px;
  width: 150px;
  object-fit: contain;
}
header h1 {
  grid-column: 2;
  justify-self: center;
  text-align: center;
  font-size: 36px;
  letter-spacing: 5px;
  font-weight: 600;
  color: black;
  margin: 0;
  animation: headerSlide 1.6s ease-out;
}
.logo_container h2 { font-family: 'Libre Baskerville', serif; }

/* ---------- Error modal (works on all screens) ---------- */
/* Desktop / laptop: modal looks exactly like the original Bootstrap modal */
#loginErrorModal .modal-footer { display: none; }   /* OK button only on mobile */

/* disabled state for the login button while the request is running */
.submit_button:disabled { opacity: .7; cursor: not-allowed; }

/* ---------- Tablet / Mobile ---------- */
@media (max-width: 768px) {

  body {
    min-height: 100vh;
    min-height: 100dvh;         /* correct height when mobile browser bars show/hide */
    display: flex;
    flex-direction: column;
  }

  #parent {
    flex: 1 0 auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    width: 100%;
    padding: 0 16px 24px;
  }

  /* header goes into normal flow (no more fixed / negative offsets) */
  header {
    position: static;
    top: auto;
    left: auto;
    width: 100%;
    height: auto;
    grid-template-columns: 1fr;
    justify-items: center;
    padding: 16px 12px 8px;
    row-gap: 8px;
  }
  .header-logo { grid-column: 1; justify-self: center; }
  .header-logo img { height: 70px; width: 70px; }
  header h1 {
    grid-column: 1;
    font-size: 20px;
    letter-spacing: 2px;
    line-height: 1.3;
  }

  /* form card fits the screen */
  .form_container {
    position: relative !important;
    top: auto !important;
    left: auto !important;
    right: auto !important;
    bottom: auto !important;
    transform: none !important;
    width: 100% !important;
    max-width: 380px !important;
    min-width: 0 !important;
    margin: 12px auto 0 !important;
    padding: 24px 18px !important;
  }

  .input_container { width: 100%; }
  .input_field {
    width: 100% !important;
    min-width: 0;
    font-size: 16px !important;   /* stops iOS Safari auto-zoom on focus */
  }

  .button_container {
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: 100%;
  }
  .button_container button {
    width: 100% !important;
    min-height: 44px;             /* comfortable tap size */
    margin: 0 !important;
  }

  .forgot_password { text-align: center; margin-top: 12px; }

  /* ---- Error modal: mobile only ---- */
  #loginErrorModal .modal-dialog {
    display: flex;
    align-items: center;          /* vertically centered */
    min-height: calc(100% - 2rem);
    margin: 1rem auto;
    max-width: 420px;
    width: calc(100% - 2rem);
  }
  #loginErrorModal .modal-content { width: 100%; }
  #loginErrorModal .modal-title { word-break: break-word; }
  #loginErrorMessage {
    white-space: normal;
    word-wrap: break-word;
    overflow-wrap: anywhere;      /* long backend messages wrap */
    font-size: 1rem;
    line-height: 1.5;
    max-height: 60vh;
    overflow-y: auto;
  }
  #loginErrorModal .modal-footer { display: flex; justify-content: center; }

  .footer {
    position: static !important;  /* don't overlap the form on small screens */
    width: 100%;
    margin-top: auto;
    padding: 12px 16px calc(12px + env(safe-area-inset-bottom, 0px));
    font-size: 12px;
    line-height: 1.4;
    text-align: center;
  }
}

/* Very small phones */
@media (max-width: 360px) {
  header h1 { font-size: 17px; letter-spacing: 1px; }
  .form_container { padding: 20px 14px !important; }
}

/* Short landscape phones */
@media (max-height: 480px) and (orientation: landscape) {
  header { padding-top: 8px; }
  .header-logo img { height: 45px; width: 45px; }
}
</style>

<script>
function checkLoggedIn() {
  if (sessionStorage.getItem("isLoggedIn") === "true") {
    window.location.href = "Landingpage";
  }
}
</script>

<script src="externalLibrary/code.jquery.com/jquery-3.6.0.min.js"></script>
<script src="js/sidebar.js?v=<%=ver(application, "/js/sidebar.js")%>"></script>

<script>
/* ---------- Error display helpers ---------- */

// Pick a clear title from the backend message
function getErrorTitle(message) {
  var m = (message || "").toLowerCase();
  if (m.indexOf("inactive") !== -1 || m.indexOf("deactivat") !== -1 || m.indexOf("disabled") !== -1 || m.indexOf("not active") !== -1) {
    return "Account Inactive";
  }
  if (m.indexOf("locked") !== -1 || m.indexOf("blocked") !== -1) {
    return "Account Locked";
  }
  if (m.indexOf("invalid") !== -1 || m.indexOf("incorrect") !== -1 || m.indexOf("wrong") !== -1 || m.indexOf("not found") !== -1) {
    return "Invalid Credentials";
  }
  if (m.indexOf("expired") !== -1) {
    return "Password Expired";
  }
  return "Login Failed";
}

// Show message in the modal (uses .text() so backend text can never inject HTML)
function showError(message) {
  var msg = (message && String(message).trim()) || "Login failed. Please check your credentials.";
  var isMobile = window.matchMedia("(max-width: 768px)").matches;
  // Desktop/laptop: original fixed title. Mobile: title based on the message.
  $('#loginErrorModalLabel').text(isMobile ? getErrorTitle(msg) : "Login Failed");
  $('#loginErrorMessage').text(msg);
  $('#loginErrorModal').modal('show');
}

// Lock / unlock the login button during the request
function setLoading(isLoading) {
  var $btn = $('.submit_button');
  $btn.prop('disabled', isLoading).text(isLoading ? 'Please wait...' : 'Login');
}

/* ---------- Login ---------- */
function loginUser(event) {
  event.preventDefault();

  var username = $('#username').val().trim();
  var password = $('#password').val();

  if (!username || !password) {
    showError("Please enter both username and password.");
    return;
  }

  var url = new URL('/jssl/user/userlogin', baseUrl);

  setLoading(true);

  $.ajax({
    url: url,
    type: 'POST',
    data: $.param({ username: username, password: password }),
    contentType: 'application/x-www-form-urlencoded',
    dataType: 'json',
    cache: false,
    timeout: 30000,
    xhrFields: { withCredentials: true },

    success: function (res) {
      if (res && res.message === "Success" && res.status === "yes") {
        sessionStorage.setItem("isLoggedIn", "true");
        sessionStorage.setItem("username",   res.username || username);
        sessionStorage.setItem("user_id",    res.user_id || username);
        sessionStorage.setItem("id",         res.id);
        sessionStorage.setItem("loction_id", res.loction_id || res.location || "");
        sessionStorage.setItem("factory_id", res.factory_id);
        sessionStorage.setItem("full_name",  res.full_name || "");
        sessionStorage.setItem("Empcode",    res.EmpCode || "");
        sessionStorage.setItem("session_id", res.session_id);

        window.location = "Landingpage.jsp";
      } else {
        // e.g. "Your account is inactive", "Invalid username or password"
        setLoading(false);
        showError((res && (res.message || res.error)) || "Login failed. Please check your credentials.");
      }
    },

    error: function (xhr, textStatus) {
      setLoading(false);

      var message = "";

      // Backend sent a JSON body with a message (401 / 403 / 400 etc.)
      try {
        var response = JSON.parse(xhr.responseText);
        if (response && (response.message || response.error)) {
          message = response.message || response.error;
        }
      } catch (e) { /* not JSON, fall through */ }

      if (!message) {
        if (textStatus === "timeout") {
          message = "The server is taking too long to respond. Please try again.";
        } else if (xhr.status === 0) {
          message = "Unable to reach the server. Please check your internet connection.";
        } else if (xhr.status === 401) {
          message = "Invalid username or password.";
        } else if (xhr.status === 403) {
          message = "Access denied. Your account may be inactive.";
        } else if (xhr.status >= 500) {
          message = "Server error. Please try again later.";
        } else {
          message = "Login failed. Please try again.";
        }
      }

      showError(message);
    }
  });
}

function togglePassword() {
  var passwordInput = document.getElementById("password");
  var eyeIcon = document.getElementById("eyeIcon");

  if (passwordInput.type === "password") {
    passwordInput.type = "text";
    eyeIcon.classList.remove("fa-eye");
    eyeIcon.classList.add("fa-eye-slash");
  } else {
    passwordInput.type = "password";
    eyeIcon.classList.remove("fa-eye-slash");
    eyeIcon.classList.add("fa-eye");
  }
}
</script>
</head>

<body onload="checkLoggedIn();">
<div id="parent">
  <header>
    <div class="header-logo"><img src="img/logo/jssl_logo_transparent.png" alt="JSSL"></div>
    <h1>JSSL INTRANET SYSTEM</h1>
  </header>

  <!-- onsubmit lets the keyboard "Go/Enter" key work on phones too -->
  <form class="form_container" onsubmit="loginUser(event)" autocomplete="on" novalidate>
    <div class="logo_container">
      <h2>Login</h2>
    </div>

    <div class="input_container">
      <label class="input_label" for="username">Username</label>
      <svg fill="none" viewBox="0 0 24 24" height="24" width="24" xmlns="http://www.w3.org/2000/svg" class="icon">
        <path stroke-linejoin="round" stroke-linecap="round" stroke-width="1.5" stroke="#141B34" d="M7 8.5L9.94202 10.2394C11.6572 11.2535 12.3428 11.2535 14.058 10.2394L17 8.5"></path>
        <path stroke-linejoin="round" stroke-width="1.5" stroke="#141B34" d="M2.01577 13.4756C2.08114 16.5412 2.11383 18.0739 3.24496 19.2094C4.37608 20.3448 5.95033 20.3843 9.09883 20.4634C11.0393 20.5122 12.9607 20.5122 14.9012 20.4634C18.0497 20.3843 19.6239 20.3448 20.7551 19.2094C21.8862 18.0739 21.9189 16.5412 21.9842 13.4756C22.0053 12.4899 22.0053 11.5101 21.9842 10.5244C21.9189 7.45886 21.8862 5.92609 20.7551 4.79066C19.6239 3.65523 18.0497 3.61568 14.9012 3.53657C12.9607 3.48781 11.0393 3.48781 9.09882 3.53656C5.95033 3.61566 4.37608 3.65521 3.24495 4.79065C2.11382 5.92608 2.08114 7.45885 2.01576 10.5244C1.99474 11.5101 1.99475 12.4899 2.01577 13.4756Z"></path>
      </svg>
      <input placeholder="Username" title="Username" name="username" type="text"
             class="input_field" id="username"
             autocomplete="username" autocapitalize="none" autocorrect="off" spellcheck="false">
    </div>

    <div class="input_container password_container">
      <label class="input_label" for="password">Password</label>

      <!-- Lock icon -->
      <svg fill="none" viewBox="0 0 24 24" height="24" width="24" xmlns="http://www.w3.org/2000/svg" class="icon">
        <path stroke-linecap="round" stroke-width="1.5" stroke="#141B34" d="M18 11.0041C17.4166 9.91704 16.273 9.15775 14.9519 9.0993C13.477 9.03404 11.9788 9 10.329 9C8.67911 9 7.18091 9.03404 5.70604 9.0993C3.95328 9.17685 2.51295 10.4881 2.27882 12.1618C2.12602 13.2541 2 14.3734 2 15.5134C2 16.6534 2.12602 17.7727 2.27882 18.865C2.51295 20.5387 3.95328 21.8499 5.70604 21.9275C6.42013 21.9591 7.26041 21.9834 8 22"></path>
        <path stroke-linejoin="round" stroke-linecap="round" stroke-width="1.5" stroke="#141B34" d="M6 9V6.5C6 4.01472 8.01472 2 10.5 2C12.9853 2 15 4.01472 15 6.5V9"></path>
        <path fill="#141B34" d="M21.2046 15.1045L20.6242 15.6956V15.6956L21.2046 15.1045ZM21.4196 16.4767C21.7461 16.7972 22.2706 16.7924 22.5911 16.466C22.9116 16.1395 22.9068 15.615 22.5804 15.2945L21.4196 16.4767ZM18.0228 15.1045L17.4424 14.5134V14.5134L18.0228 15.1045ZM18.2379 18.0387C18.5643 18.3593 19.0888 18.3545 19.4094 18.028C19.7299 17.7016 19.7251 17.1771 19.3987 16.8565L18.2379 18.0387ZM14.2603 20.7619C13.7039 21.3082 12.7957 21.3082 12.2394 20.7619L11.0786 21.9441C12.2794 23.1232 14.2202 23.1232 15.4211 21.9441L14.2603 20.7619ZM12.2394 20.7619C11.6914 20.2239 11.6914 19.358 12.2394 18.82L11.0786 17.6378C9.86927 18.8252 9.86927 20.7567 11.0786 21.9441L12.2394 20.7619ZM12.2394 18.82C12.7957 18.2737 13.7039 18.2737 14.2603 18.82L15.4211 17.6378C14.2202 16.4587 12.2794 16.4587 11.0786 17.6378L12.2394 18.82ZM14.2603 18.82C14.8082 19.358 14.8082 20.2239 14.2603 20.7619L15.4211 21.9441C16.6304 20.7567 16.6304 18.8252 15.4211 17.6378L14.2603 18.82ZM20.6242 15.6956L21.4196 16.4767L22.5804 15.2945L21.785 14.5134L20.6242 15.6956ZM15.4211 18.82L17.8078 16.4767L16.647 15.2944L14.2603 17.6377L15.4211 18.82ZM17.8078 16.4767L18.6032 15.6956L17.4424 14.5134L16.647 15.2945L17.8078 16.4767ZM16.647 16.4767L18.2379 18.0387L19.3987 16.8565L17.8078 15.2945L16.647 16.4767ZM21.785 14.5134C21.4266 14.1616 21.0998 13.8383 20.7993 13.6131C20.4791 13.3732 20.096 13.1716 19.6137 13.1716V14.8284C19.6145 14.8284 19.619 14.8273 19.6395 14.8357C19.6663 14.8466 19.7183 14.8735 19.806 14.9391C19.9969 15.0822 20.2326 15.3112 20.6242 15.6956L21.785 14.5134ZM18.6032 15.6956C18.9948 15.3112 19.2305 15.0822 19.4215 14.9391C19.5091 14.8735 19.5611 14.8466 19.5879 14.8357C19.6084 14.8273 19.6129 14.8284 19.6137 14.8284V13.1716C19.1314 13.1716 18.7483 13.3732 18.4281 13.6131C18.1276 13.8383 17.8008 14.1616 17.4424 14.5134L18.6032 15.6956Z"></path>
      </svg>

      <input placeholder="Password" type="password" class="input_field" id="password"
             name="password" autocomplete="current-password">

      <span class="toggle-password" onclick="togglePassword()" role="button" aria-label="Show or hide password">
        <i id="eyeIcon" class="fas fa-eye"></i>
      </span>
    </div>

    <div class="button_container">
      <button type="submit" class="submit_button">Login</button>
      <button type="button" class="reset_button" onclick="window.location.href='reset.jsp';">Reset Password</button>
    </div>

    <div class="forgot_password">
      <a href="forgotpass.jsp">Forgot Password?</a>
    </div>
  </form>
</div>

<footer class="footer">
  &copy; 2026 JSW Severfield Structures Limited, All Rights Reserved.
</footer>

<!-- Login Error Modal (centered, mobile friendly) -->
<div class="modal fade" id="loginErrorModal" tabindex="-1" role="dialog" aria-labelledby="loginErrorModalLabel" aria-hidden="true">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header bg-danger text-white">
        <h5 class="modal-title" id="loginErrorModalLabel">Login Failed</h5>
        <button type="button" class="close text-white" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body" id="loginErrorMessage"></div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">OK</button>
      </div>
    </div>
  </div>
</div>

<script src="js/config.js?v=<%=ver(application, "/js/config.js")%>"></script>

<!-- Popper + Bootstrap (loaded once; the duplicate bootstrap.bundle was removed) -->
<script src="externalLibrary/cdn.jsdelivr.net/npm/@popperjs/core@2.9.3/dist/umd/popper.min.js"></script>
<script src="externalLibrary/stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>

</body>
</html>
