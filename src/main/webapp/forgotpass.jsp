<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
	pageEncoding="ISO-8859-1"%>
<%
  response.setHeader("Cache-Control", "no-cache, no-store, must-revalidate"); // HTTP 1.1
  response.setHeader("Pragma", "no-cache"); // HTTP 1.0
  response.setDateHeader("Expires", 0); // Proxies
%>
<%@ include file="version.jsp" %>
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
* {
	margin: 0;
	padding: 0;
	box-sizing: border-box;
}

body {
	min-height: 100vh;
	display: flex;
	align-items: center;
	justify-content: center;
	font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
	background: linear-gradient(145deg, #f0f4f8, #e2e8f0, #f8fafc);
	padding: 20px;
}

/* ===== Card ===== */
.form_container {
	width: 100%;
	max-width: 400px;
	background: #ffffff;
	border-radius: 16px;
	padding: 36px 32px;
	border: 1px solid #e5e7eb;
	box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
}

/* ===== Header ===== */
.form_header {
	text-align: center;
	margin-bottom: 28px;
}

.form_icon {
	width: 60px;
	height: 60px;
	background: linear-gradient(135deg, #e0f2fe, #bae6fd);
	border-radius: 14px;
	margin: 0 auto 18px;
	display: flex;
	align-items: center;
	justify-content: center;
	border: 1px solid #7dd3fc;
}

.form_icon svg {
	width: 28px;
	height: 28px;
	fill: none;
	stroke: #0284c7;
	stroke-width: 2;
}

.form_header h2 {
	font-size: 22px;
	font-weight: 600;
	color: #1e293b;
}

.form_header p {
	font-size: 14px;
	color: #64748b;
}

/* ===== Inputs ===== */
.input_container {
	margin-bottom: 18px;
}

.input_label {
	font-size: 18px;
	font-weight: 600;
	color: #475569;
	margin-bottom: 6px;
	display: block;
}

.input_field {
	width: 100%;
	padding: 12px 14px;
	font-size: 14px;
	border-radius: 10px;
	border: 1.5px solid #d1d5db;
	background: #fafbfc;
	transition: 0.2s ease;
}

.input_field:focus {
	border-color: #0ea5e9;
	background: #ffffff;
	box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.15);
	outline: none;
}

/* ===== CAPTCHA ===== */
.captcha_box {
	display: flex;
	align-items: center;
	gap: 12px;
	border-radius: 10px;
	margin-bottom: 10px;
}

/* CAPTCHA image */
#captchaImage {
	width: 200px;
	height: 50px;
	border-radius: 6px;
	border: 1px solid #cbd5e1;
	cursor: pointer;
	object-fit: contains;
	transition: opacity 0.3s ease;
}

/* Refresh button */
.refresh_icon_btn {
	background: #e0f2fe;
	border: 1px solid #bae6fd;
	border-radius: 50%;
	width: 38px;
	height: 38px;
	display: flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;
	color: #0284c7;
}

/* Rotate animation */
.refresh_icon_btn.refreshing svg {
	animation: rotate 0.6s linear;
}

@
keyframes rotate {from { transform:rotate(0deg);
	
}

to {
	transform: rotate(360deg);
}

}

/* ===== Submit Button ===== */
.button_container {
	margin-top: 24px;
}

.submit_buttons {
	width: 100%;
	padding: 13px;
	font-size: 15px;
	font-weight: 600;
	color: #ffffff;
	background: linear-gradient(135deg, #34C924, #28A428);
	border: none;
	border-radius: 10px;
	cursor: pointer;
	transition: 0.2s ease;
}

.submit_buttons:hover {
	transform: translateY(-1px);
	box-shadow: 0 6px 18px rgba(40, 164, 40, 0.4);
}

/* ===== Error ===== */
.error-message {
	font-size: 12px;
	color: #dc2626;
	margin-top: 5px;
	display: none;
}

/* ===== Back Link ===== */
.back_link {
	text-align: center;
	margin-top: 20px;
}

.back_link a {
	font-size: 16px;
	color: #0284c7;
	text-decoration: none;
}

.back_link a:hover {
	text-decoration: underline;
}

#loadingSpinner {
	position: fixed;
	inset: 0;
	background: rgba(255, 255, 255, 0.35); /* lighter overlay */
	display: none;
	align-items: center;
	justify-content: center;
	z-index: 2000;
}

/* Smaller spinner */
.circular {
	width: 40px;
	height: 40px;
	animation: rotate 1.2s linear infinite;
}

.path {
	stroke: #0284c7;
	stroke-linecap: round;
	animation: dash 1.4s ease-in-out infinite;
}

/* Animations */
@
keyframes rotate { 100% {
	transform: rotate(360deg);
}

}
@
keyframes dash { 0% {
	stroke-dasharray: 1, 150;
	stroke-dashoffset: 0;
}

50
%
{
stroke-dasharray
:
70
,
150;
stroke-dashoffset
:
-30;
}
100
%
{
stroke-dasharray
:
70
,
150;
stroke-dashoffset
:
-90;
}
}
.popup {
	position: fixed;
	top: 20px;
	left: 80%;
	transform: translateX(-50%);
	background: linear-gradient(135deg, #34C924, #28A428);
	color: #ffffff;
	padding: 12px 22px;
	border-radius: 10px;
	font-size: 14px;
	font-weight: 600;
	z-index: 9999;
	box-shadow: 0 8px 20px rgba(0, 0, 0, 0.25);
}
</style>
<link href="vendor/fontawesome-free/css/all.min.css" rel="stylesheet"
	type="text/css" />
<link href="vendor/bootstrap/css/bootstrap.min.css" rel="stylesheet"
	type="text/css" />
<link href="css/ruang-admin.min.css" rel="stylesheet" />
<link href="vendor/datatables/dataTables.bootstrap4.min.css"
	rel="stylesheet">

<link rel="stylesheet"
	href="externalLibrary/cdn.datatables.net/buttons/2.4.1/css/buttons.dataTables.min.css" />
<link rel="stylesheet" href="css/main.css">

 <script src="js/config.js?v=<%=jsVersion%>"></script>
<script src="vendor/jquery/jquery.min.js"></script>
<script src="vendor/bootstrap/js/bootstrap.bundle.min.js"></script>
<script src="vendor/jquery-easing/jquery.easing.min.js"></script>


<script src="vendor/datatables/jquery.dataTables.min.js"></script>
<script src="vendor/datatables/dataTables.bootstrap4.min.js"></script>

<script
	src="externalLibrary/cdn.datatables.net/buttons/2.4.1/js/dataTables.buttons.min.js"></script>
<script
	src="externalLibrary/cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js"></script>
<script
	src="externalLibrary/cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.53/pdfmake.min.js"></script>
<script
	src="externalLibrary/cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.53/vfs_fonts.js"></script>
<script
	src="externalLibrary/cdn.datatables.net/buttons/2.4.1/js/buttons.html5.min.js"></script>
<script
	src="externalLibrary/cdn.datatables.net/buttons/2.4.1/js/buttons.print.min.js"></script>
<script src="js/forgotpass.js?v=<%=jsVersion%>"></script>

<script src="js/createdby.js"></script>
<script type="text/javascript">
 function noBack() {
     window.history.forward();
 }
 </script>

</head>
<body>

	<div class="form_container">
		<div class="form_header">
			<div class="form_icon">
				<svg viewBox="0 0 24 24">
        <rect x="3" y="11" width="18" height="11" rx="2"></rect>
        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
      </svg>
			</div>
			<h2>Forgot Password</h2>
			<p>Enter your email and we'll send you a reset link</p>
		</div>

		<form id="resetPasswordForm">
			<div class="input_container">
				<label class="input_label">Email</label> <input type="email"
					id="email_password" name="email_password" class="input_field"
					required autocomplete="off" placeholder="Enter Email">
				<div id="productCodeErrorcreditss4" class="error-message"></div>
			</div>

			<div class="captcha_box">
				<img id="captchaImage" title="Click to refresh CAPTCHA"
					 />

				<button type="button" class="refresh_icon_btn"
					onclick="refreshCaptcha()" title="Refresh CAPTCHA">
					<svg viewBox="0 0 24 24" width="20" height="20" fill="none"
						stroke="currentColor" stroke-width="2" stroke-linecap="round"
						stroke-linejoin="round">
      <path d="M21 12a9 9 0 1 1-3-6.7" />
      <polyline points="21 3 21 9 15 9" />
    </svg>
				</button>
			</div>



			<input type="text" id="captcha_input" name="captcha_input"
				class="input_field" placeholder="Enter CAPTCHA" required
				autocomplete="off">


			<div class="button_container">
				<button type="button" class="btn btn-success submit_buttons"
					onclick="openModalEdit()">Submit</button>
			</div>

			<div class="back_link">
				<a href="javascript:void(0)" onclick="location.href='newlogin.jsp'">
					<svg fill="#0284c7" xmlns="http://www.w3.org/2000/svg" width="12px"
						height="24px" viewBox="0 0 52 52"
						enable-background="new 0 0 52 52" xml:space="preserve">
  <path
							d="M48.6,23H15.4c-0.9,0-1.3-1.1-0.7-1.7l9.6-9.6c0.6-0.6,0.6-1.5,0-2.1l-2.2-2.2c-0.6-0.6-1.5-0.6-2.1,0
    L2.5,25c-0.6,0.6-0.6,1.5,0,2.1L20,44.6c0.6,0.6,1.5,0.6,2.1,0l2.1-2.1c0.6-0.6,0.6-1.5,0-2.1l-9.6-9.6
    C14,30.1,14.4,29,15.3,29h33.2c0.8,0,1.5-0.6,1.5-1.4v-3C50,23.8,49.4,23,48.6,23z" />
</svg> Back to Login
				</a>
			</div>
		</form>
	</div>
	<div class="modal fade" id="exampleModalCenterupdate" tabindex="-1">
		<div class="modal-dialog modal-dialog-centered">
			<div class="modal-content"
				style="width: 54%; right: -22%; border: 2px solid #eaecf4;">

				<div class="modal-body text-center">
					<b>Are You Sure You Want send email?</b>
				</div>

				<div class="modal-footer justify-content-center">
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
				<div class="modal-header1"></div>
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
	<div id="loadingSpinner" style="display: none;">
		<svg class="circular" viewBox="25 25 50 50">
    <circle class="path" cx="50" cy="50" r="20" fill="none"
				stroke-width="2" stroke-miterlimit="10" />
  </svg>
	</div>



</body>
</html>