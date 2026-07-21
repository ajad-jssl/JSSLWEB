<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
	pageEncoding="ISO-8859-1"%>
<%
  response.setHeader("Cache-Control", "no-cache, no-store, must-revalidate"); // HTTP 1.1
  response.setHeader("Pragma", "no-cache"); // HTTP 1.0
  response.setDateHeader("Expires", 0); // Proxies
%>
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport"
	content="width=device-width, initial-scale=1, shrink-to-fit=no">
<meta name="description" content="">
<meta name="author" content="">
<link href="img/logo/download.png" rel="icon">
<title>JSSL</title>
<style>
/* ---------- BODY ---------- */
body {
	min-height: 100vh;
	margin: 0;
	background: linear-gradient(135deg, #f8fafc, #eef2f7);
	display: flex;
	align-items: center;
	justify-content: center;
	font-family: "Segoe UI", Roboto, Arial, sans-serif;
	color: #1f2933;
}

/* ---------- FORM WRAPPER ---------- */
.form_container {
	width: 100%;
	max-width: 420px;
	background: #ffffff;
	border-radius: 12px;
	padding: 36px 28px;
	box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1); /* subtle shadow */
	border: 1px solid #e2e8f0; /* soft border */
	transition: transform 0.2s ease, box-shadow 0.2s ease;
}

/* .form_container:hover {
  transform: translateY(-3px);
  box-shadow: 0 16px 40px rgba(0,0,0,0.15);
}
 */
/* ---------- HEADER ---------- */
.form_container h2 {
	text-align: center;
	font-size: 26px;
	font-weight: 700;
	margin-bottom: 10px;
	color: #1f2933;
}

.form_desc {
	text-align: center;
	font-size: 14px;
	color: #64748b;
	margin-bottom: 28px;
}

/* ---------- INPUTS ---------- */
.input_container {
	margin-bottom: 18px;
}

.input_label {
	display: block;
	font-size: 14px;
	font-weight: 500;
	color: #334155;
	margin-bottom: 4px;
}

.input_field {
	width: 100%;
	height: 46px;
	padding: 12px 14px;
	font-size: 15px;
	border-radius: 8px;
	border: 1px solid #cbd5e1;
	background-color: #f9fafb;
	transition: all 0.25s ease;
}

.input_field:focus {
	outline: none;
	border-color: #38bdf8; /* soft blue focus */
	background-color: #ffffff;
	box-shadow: 0 0 0 3px rgba(56, 189, 248, 0.2);
}

/* ---------- ERROR MESSAGES ---------- */
.error-message {
	font-size: 12px;
	color: #ef4444; /* bright red for errors */
	margin-top: 4px;
	min-height: 16px;
}

.header_icon {
	width: 50px;
	height: 50px;
	background: linear-gradient(135deg, #38bdf8, #0ea5e9);
	/* soft blue gradient */
	border-radius: 50%;
	margin: 0 auto 14px;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 22px;
	color: white; /* icon color */
	box-shadow: 0 6px 18px rgba(0, 0, 0, 0.12);
	transition: all 0.2s ease;
}

.header_icon:hover {
	transform: scale(1.1);
	box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
}

/* ---------- SUBMIT BUTTON ---------- */
.button_container {
	margin-top: 14px;
}

.submit_button {
	width: 100%;
	height: 46px;
	border-radius: 8px;
	border: none;
	background-color: #16a34a; /* solid green */
	background-image: linear-gradient(135deg, #22c55e, #16a34a);
	color: #ffffff;
	font-size: 15px;
	font-weight: 600;
	cursor: pointer;
	transition: all 0.25s ease;
}

.submit_button:hover {
	transform: translateY(-2px);
	box-shadow: 0 12px 22px rgba(34, 197, 94, 0.35);
}

/* ---------- INPUT ICONS (optional) ---------- */
.input_wrapper {
	position: relative;
}

.input_wrapper span {
	position: absolute;
	left: 12px;
	top: 50%;
	transform: translateY(-50%);
	font-size: 16px;
	color: #94a3b8;
}

.input_field {
	padding-left: 20px; /* leave space for icon if used */
}

/* ---------- OPTIONAL MODAL STYLE ---------- */
.modal-content {
	border-radius: 12px;
	border: none;
}

.modal-body {
	text-align: center;
	font-size: 15px;
	color: #334155;
}

.modal-footer {
	justify-content: center;
}

.password-wrapper {
    position: relative;
}

.password-input {
    padding-right: 45px;   /* Space for eye icon */
}

.toggle-password {
    position: absolute;
    right: 15px;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
    color: #6c757d;
    height: 44px;          /* Same as input height */
    display: flex;
    align-items: center;
}

.toggle-password i {
    font-size: 16px;
}
.popup {
	position: fixed;
	top: 20px;
	right: -3%;
	transform: translateX(-50%);
	background-color: #4CAF50; /* Green */
	color: white;
	padding: 16px;
	border-radius: 5px;
	z-index: 9999;
}
</style>
<link href="vendor/fontawesome-free/css/all.min.css" rel="stylesheet"
	type="text/css" />
<link href="vendor/bootstrap/css/bootstrap.min.css" rel="stylesheet"
	type="text/css" />
<link href="css/ruang-admin.min.css" rel="stylesheet" />
<link href="vendor/datatables/dataTables.bootstrap4.min.css"
	rel="stylesheet">
<!-- <link rel="stylesheet" href="https://cdn.datatables.net/1.13.6/css/jquery.dataTables.min.css" /> -->
<link rel="stylesheet"
	href="https://cdn.datatables.net/buttons/2.4.1/css/buttons.dataTables.min.css" />
<link rel="stylesheet" href="css/main.css">
<script src="js/config.js"></script>
<script src="vendor/jquery/jquery.min.js"></script>
<script src="vendor/bootstrap/js/bootstrap.bundle.min.js"></script>
<script src="vendor/jquery-easing/jquery.easing.min.js"></script>
<script src="js/ruang-admin.min.js"></script>
<!-- Page level plugins -->
<script src="vendor/datatables/jquery.dataTables.min.js"></script>
<script src="vendor/datatables/dataTables.bootstrap4.min.js"></script>
<!-- <script src="https://cdn.datatables.net/1.13.6/js/jquery.dataTables.min.js"></script> -->
<script
	src="https://cdn.datatables.net/buttons/2.4.1/js/dataTables.buttons.min.js"></script>
<script
	src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js"></script>
<script
	src="https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.53/pdfmake.min.js"></script>
<script
	src="https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.53/vfs_fonts.js"></script>
<script
	src="https://cdn.datatables.net/buttons/2.4.1/js/buttons.html5.min.js"></script>
<script
	src="https://cdn.datatables.net/buttons/2.4.1/js/buttons.print.min.js"></script>
<script src="js/reset.js"></script>
<script src="js/createdby.js"></script>
<script type="text/javascript">
	function noBack() {
		window.history.forward();
	}
</script>
<script>
	// Track user activity and logout after 2 minutes (120000 ms)
	let inactivityTime = function() {
		let timeout;

		// Reset timer on any user activity
		function resetTimer() {
			clearTimeout(timeout);
			timeout = setTimeout(triggerLogout, 900000); // 15 minutes
		}

		// Event listener for activity
		window.onload = resetTimer;
		document.onmousemove = resetTimer;
		document.onkeydown = resetTimer;
		document.onclick = resetTimer;
		document.onscroll = resetTimer;

		function triggerLogout() {
			// Create a dummy event to pass to logoutUser
			let dummyEvent = new Event('logout');
			logoutUser(dummyEvent);
		}
	};

	inactivityTime();

	function logoutUser(event) {
		if (event && event.preventDefault) {
			event.preventDefault();
		}

		var user_id = sessionStorage.getItem('user_id');
		if (!user_id) {
			alert("User ID not found. Please login first.");
			return;
		}

		if (typeof baseUrl === 'undefined' || !baseUrl) {
			console.error("baseUrl is not defined or is empty.");
			return;
		}

		const url = baseUrl.endsWith('/') ? baseUrl + 'jssl/user/userlogout'
				: baseUrl + '/jssl/user/userlogout';

		$
				.ajax({
					url : url,
					type : 'POST',
					data : $.param({
						user_id : user_id
					}),
					contentType : 'application/x-www-form-urlencoded',
					dataType : 'json',
					cache : false,
					success : function(data) {
						console.log("Server response:", data);

						if (data.status === "yes"
								&& data.message === "Logout Success") {
							sessionStorage.removeItem("user_id");
							sessionStorage.removeItem("username");
							sessionStorage.removeItem("isLoggedIn");
							localStorage.removeItem("selectedFactoryId");
							window.location = "newlogin.jsp";
						} else {
							console.error("Logout failed.");
						}
					},
					error : function(xhr, status, error) {
						console.error("AJAX error:", error);
						console.error("Response text:", xhr.responseText);
						alert("Error: "
								+ (xhr.responseText || "An error occurred."));
					}
				});
	}
</script>
</head>
<body>

	<div class="form_container">
		<div class="header_icon">
			<i class="fas fa-key"></i>
		</div>

		<h2>Reset Password</h2>
		<div class="form_desc">Enter your email and reset your password
			below.</div>

		<form id="resetPasswordForm">
			<div class="input_container">
				<label class="input_label" for="old_password">Email</label> <input
					type="email" id="email_password" name="email_password"
					class="input_field" required autocomplete="off"
					placeholder="Enter the Email">
				<div id="productCodeErrorcreditss4" class="error-message"></div>
			</div>
			<!-- OLD PASSWORD -->
			<div class="input_container password-wrapper">
				<label class="input_label" for="old_password">Old Password</label> <input
					type="password" id="old_password" name="old_password"
					class="input_field password-input" required autocomplete="off"
					placeholder="Enter old Password"> <span
					class="toggle-password"
					onclick="togglePassword('old_password', 'eyeIconOld')"> <i
					id="eyeIconOld" class="fa fa-eye"></i>
				</span>

				<div id="productCodeErrorcreditss" class="error-message"></div>
			</div>


			<!-- NEW PASSWORD -->
			<div class="input_container password-wrapper">
				<label class="input_label" for="new_password">New Password</label> <input
					type="password" id="new_password" name="new_password"
					class="input_field password-input" required autocomplete="off"
					placeholder="Enter New Password"> <span
					class="toggle-password"
					onclick="togglePassword('new_password', 'eyeIconNew')"> <i
					id="eyeIconNew" class="fa fa-eye"></i>
				</span>

				<div id="productCodeErrorcreditss1" class="error-message"></div>
			</div>


			<!-- CONFIRM PASSWORD -->
			<div class="input_container password-wrapper">
				<label class="input_label" for="confirm_password">Confirm
					Password</label> <input type="password" id="confirm_password"
					name="confirm_password" class="input_field password-input"
					autocomplete="off" placeholder="Enter Confirm Password"> <span
					class="toggle-password"
					onclick="togglePassword('confirm_password', 'eyeIconConfirm')">
					<i id="eyeIconConfirm" class="fa fa-eye"></i>
				</span>

				<div id="productCodeErrorcreditss3" class="error-message"></div>
			</div>

			<div class="button_container">
				<button type="button" class="submit_button"
					onclick="openModalEdit();">Submit</button>
			</div>
		</form>
	</div>
	<div class="modal fade" id="exampleModalCenterupdate" tabindex="-1"
		role="dialog" aria-labelledby="exampleModalCenterTitle"
		aria-hidden="true">
		<div class="modal-dialog modal-dialog-centered" role="document">
			<div class="modal-content"
				style="width: 54%; right: -22%; border-width: thick; border-color: #eaecf4;">
				<div class="modal-header1">
					<!-- <h5 class="modal-title" id="exampleModalCenterTitle">Modal Vertically Centered</h5> -->
					<!-- <button type="button" class="close" data-dismiss="modal" aria-label="Close" >
                    <span aria-hidden="true">&times;</span>
                  </button>  -->
				</div>
				<div class="modal-body">
					<b>Are You Sure You Want reset the password?</b>
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-secondary btn-sm"
						data-dismiss="modal">NO</button>
					<button type="button" class="btn btn-info btn-sm"
						onclick="editevent()">YES</button>
				</div>
			</div>
		</div>
	</div>
	<div class="modal fade" id="exampleModalCenterDupUP" tabindex="-1"
		role="dialog" aria-labelledby="exampleModalCenterTitle"
		aria-hidden="true">
		<div class="modal-dialog modal-dialog-centered" role="document">
			<div class="modal-content"
				style="width: 70%; right: -22%; border-width: thick; border-color: #eaecf4;">
				<div class="modal-header1">
					<!-- <h5 class="modal-title" id="exampleModalCenterTitle">Modal Vertically Centered</h5> -->
					<!-- <button type="button" class="close" data-dismiss="modal" aria-label="Close" >
                    <span aria-hidden="true">&times;</span>
                  </button>  -->
				</div>
				<div class="modal-body">
					<b id="errorMessageup"></b>
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-secondary btn-sm"
						data-dismiss="modal">OK</button>
				</div>
			</div>
		</div>
	</div>

</body>
</html>