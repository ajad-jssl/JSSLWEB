<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
	pageEncoding="ISO-8859-1"%>
<%
  response.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
  response.setHeader("Pragma", "no-cache");
  response.setDateHeader("Expires", 0);
%>
<%@ include file="version.jsp" %>
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport"
	content="width=device-width, initial-scale=1, shrink-to-fit=no">
<link href="img/logo/download.png" rel="icon">
<title>JSSL - OTP Validation</title>
<style>
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

.form_container {
	width: 100%;
	max-width: 420px;
	background: #ffffff;
	border-radius: 14px;
	padding: 32px 28px;
	box-shadow: 0 18px 35px rgba(0, 0, 0, 0.12);
}

.header_icon {
	width: 60px;
	height: 60px;
	border-radius: 50%;
	margin: 0 auto 16px;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 28px;
	color: #22c55e;
	box-shadow: 0 2px 6px rgba(0, 0, 0, 0.12);
}

.form_container h2 {
	text-align: center;
	font-size: 24px;
	font-weight: 700;
	margin-bottom: 6px;
	color: #1f2933;
}

.form_desc {
	text-align: center;
	font-size: 14px;
	color: #64748b;
	margin-bottom: 26px;
}

.input_container {
	margin-bottom: 18px;
}

.input_label {
	display: block;
	font-size: 14px;
	font-weight: 600;
	color: #334155;
	margin-bottom: 6px;
}

.input_field {
	width: 100%;
	height: 44px;
	padding: 10px 12px;
	border-radius: 8px;
	border: 1px solid #cbd5e1;
	font-size: 15px;
	background: #f8fafc;
	transition: all 0.2s ease;
	box-sizing: border-box;
}

.input_field:focus {
	outline: none;
	background: #ffffff;
	border-color: #22c55e;
	box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.25);
}

.input_field:disabled {
	background: #f1f5f9;
	color: #94a3b8;
	cursor: not-allowed;
}

.error-message {
	font-size: 12px;
	color: #dc2626;
	margin-top: 4px;
	min-height: 16px;
	display: block;
}

#otpTimer {
	text-align: center;
	font-weight: 600;
	color: #22c55e;
	margin-top: 8px;
	font-size: 14px;
}

.button_container {
	margin-top: 18px;
}

.submit_button {
	width: 100%;
	height: 44px;
	border-radius: 8px;
	border: none;
	background: linear-gradient(135deg, #22c55e, #16a34a);
	color: #ffffff;
	font-size: 15px;
	font-weight: 600;
	cursor: pointer;
	transition: all 0.2s ease;
}

.submit_button:hover:not(:disabled) {
	transform: translateY(-1px);
	box-shadow: 0 12px 22px rgba(34, 197, 94, 0.4);
}

.submit_button:disabled {
	opacity: 0.6;
	cursor: not-allowed;
}

.otp-container {
	display: flex;
	justify-content: space-between;
	gap: 8px;
	margin: 10px 0;
}

.otp-input {
	width: 50px;
	height: 50px;
	text-align: center;
	font-size: 20px;
	font-weight: 600;
	border-radius: 8px;
	border: 2px solid #cbd5e1;
	background: #f8fafc;
	transition: all 0.2s ease;
	color: #334155;
	box-sizing: border-box;
}

.otp-input:focus {
	outline: none;
	border-color: #22c55e;
	background: #ffffff;
	box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.1);
}

.otp-input:disabled {
	background: #f1f5f9;
	color: #94a3b8;
	cursor: not-allowed;
}

#passwordFields {
	display: none;
}

.modal-content {
	border-radius: 12px;
	border: none;
	box-shadow: 0 20px 25px rgba(0, 0, 0, 0.15);
}

.modal-body {
	padding: 24px;
	text-align: center;
	font-size: 15px;
	color: #334155;
}

.modal-footer {
	justify-content: center;
	padding: 16px;
}

.password-wrapper {
	position: relative;
}

.password-input {
	padding-right: 45px; /* space for eye */
}

.toggle-eye {
	position: absolute;
	right: 12px;
	top: 50%;
	transform: translateY(-50%);
	cursor: pointer;
	color: #6c757d;
	font-size: 16px;
}

.popup {
	position: fixed;
	top: 20px;
	right: 20px;
	background-color: #22c55e;
	color: white;
	padding: 16px 24px;
	border-radius: 8px;
	box-shadow: 0 10px 25px rgba(34, 197, 94, 0.3);
	z-index: 9999;
	font-weight: 500;
	animation: slideIn 0.3s ease;
}

.popup-info {
	background-color: #3b82f6;
	box-shadow: 0 10px 25px rgba(59, 130, 246, 0.3);
}

@
keyframes slideIn {from { transform:translateX(400px);
	opacity: 0;
}

to {
	transform: translateX(0);
	opacity: 1;
}
}
</style>

<link href="vendor/fontawesome-free/css/all.min.css" rel="stylesheet"
	type="text/css" />
<link href="vendor/bootstrap/css/bootstrap.min.css" rel="stylesheet"
	type="text/css" />
<link href="css/ruang-admin.min.css" rel="stylesheet" />

 <script src="js/config.js?v=<%=ver(application, "/js/config.js")%>"></script>
<script src="vendor/jquery/jquery.min.js"></script>
<script src="vendor/bootstrap/js/bootstrap.bundle.min.js"></script>

</head>
<body class="auth-page">

	<div class="form_container">
		<div class="header_icon">
			<i class="fas fa-check-circle"></i>
		</div>
		<h2>OTP Validation</h2>
		<div class="form_desc">Enter the 6-digit OTP sent to your email
		</div>

		<form id="resetPasswordForm">
			<div class="input_container">
				<label class="input_label">Enter OTP</label>
				<div class="otp-container">
					<input type="text" maxlength="1" class="otp-input" id="otp1"
						inputmode="numeric"> <input type="text" maxlength="1"
						class="otp-input" id="otp2" inputmode="numeric"> <input
						type="text" maxlength="1" class="otp-input" id="otp3"
						inputmode="numeric"> <input type="text" maxlength="1"
						class="otp-input" id="otp4" inputmode="numeric"> <input
						type="text" maxlength="1" class="otp-input" id="otp5"
						inputmode="numeric"> <input type="text" maxlength="1"
						class="otp-input" id="otp6" inputmode="numeric">
				</div>
				<span id="otpError" class="error-message"></span>
				<div id="otpTimer"></div>
			</div>

			<div id="passwordFields">
				<div class="input_container">
					<label class="input_label">New Password</label>

					<div class="password-wrapper">
						<input type="password" id="new_password"
							class="input_field password-input" autocomplete="off"> <span
							class="toggle-eye" onclick="toggleNewPassword()"> <i
							id="eyeIconNew" class="fa fa-eye"></i>
						</span>
					</div>

					<span id="productCodeErrorcreditss1" class="error-message"></span>
				</div>

				<div class="input_container">
					<label class="input_label">Confirm Password</label>

					<div class="password-wrapper">
						<input type="password" id="confirm_password"
							class="input_field password-input" autocomplete="off"> <span
							class="toggle-eye" onclick="toggleConfirmPassword()"> <i
							id="eyeIconConfirm" class="fa fa-eye"></i>
						</span>
					</div>

					<span id="productCodeErrorcreditss3" class="error-message"></span>
				</div>
			</div>

			<div class="button_container">
				<button type="button" class="submit_button"
					onclick="openModalEdit();">Verify OTP</button>
			</div>
		</form>
	</div>

	<!-- CONFIRMATION MODAL -->
	<div class="modal fade" id="exampleModalCenterupdate" tabindex="-1"
		role="dialog">
		<div class="modal-dialog modal-dialog-centered" role="document">
			<div class="modal-content">
				<div class="modal-body">
					<i class="fas fa-question-circle"
						style="font-size: 24px; color: #fbbf24; margin-bottom: 12px;"></i>
					<p style="margin-bottom: 0;">
						<b>Are you sure you want to reset your password?</b>
					</p>
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-secondary btn-sm"
						data-dismiss="modal">NO</button>
					<button type="button" class="btn btn-success btn-sm"
						onclick="editevent()">YES</button>
				</div>
			</div>
		</div>
	</div>

	<!-- ERROR MODAL -->
	<div class="modal fade" id="exampleModalCenterDupUP" tabindex="-1"
		role="dialog">
		<div class="modal-dialog modal-dialog-centered" role="document">
			<div class="modal-content">
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

	<script src="js/otpval.js?v=<%=ver(application, "/js/otpval.js")%>"></script>
</body>
</html>