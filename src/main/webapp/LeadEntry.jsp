<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>

<%
response.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
response.setHeader("Pragma", "no-cache");
response.setDateHeader("Expires", 0);
%>

<!DOCTYPE html>
<html>

<head>
<meta charset="UTF-8">
<link href="img/logo/download.png" rel="icon">
<title>Lead Entry</title>

<!-- Bootstrap -->
<link href="vendor/bootstrap/css/bootstrap.min.css" rel="stylesheet"
	type="text/css">

<!-- Bootstrap Icons -->
<link
	href="externalLibrary/cdnjs.cloudflare.com/ajax/libs/bootstrap-icons/1.5.0/font/bootstrap-icons.min.css"
	rel="stylesheet">

<!-- Font Awesome -->
<link href="vendor/fontawesome-free/css/all.min.css" rel="stylesheet"
	type="text/css">

<!-- Ruang Admin -->
<link href="css/ruang-admin.min.css" rel="stylesheet">

<!-- Main CSS -->
<link rel="stylesheet" href="css/main.css">

	<link rel="stylesheet"
	href="externalLibrary/cdn.datatables.net/buttons/2.4.1/css/buttons.dataTables.min.css" />
<link rel="stylesheet" href="css/main.css">




<style>
.error-message {
	color: red;
	display: none;
}
/* Add some basic styling to the button */
button {
	padding: 5px 15px;
	font-size: 13px;
	background-color: #4CAF50; /* Green background color */
	color: white; /* White text color */
	border: none; /* Remove border */
	border-radius: 5px; /* Optional: Rounded corners */
	cursor: pointer;
}

/* Change button color on hover */
button:hover {
	background-color: #45a049; /* Darker green */
}

button.close {
	padding: 0;
	background-color: transparent;
	border: 0;
	-webkit-appearance: none;
	-moz-appearance: none;
	appearance: none;
}

/* Add custom styles for the modal */
.modal-content {
	border-radius: 10px;
}

/* Add custom styles for the modal header */
.modal-header {
	/* background-color: #007bff;  */ /* Primary color */
	color: black; /* Text color */
	border-bottom: 1px solid #dee2e6;
	border-top-left-radius: 10px;
	border-top-right-radius: 10px;
	height: 45px; /* Adjust the height as needed */
}

.modal-header1 {
	background-color: #007bff; /* Primary color */
	color: black; /* Text color */
	border-bottom: 1px solid #dee2e6;
	border-top-left-radius: 10px;
	border-top-right-radius: 10px;
	height: 20px; /* Adjust the height as needed */
}

.modal-title {
	line-height: 20px; /* Center the text vertically within the header */
}

.modal-body {
	padding: 20px;
}

.modal-footer {
	border-top: 1px solid #dee2e6;
	border-bottom-left-radius: 10px;
	border-bottom-right-radius: 10px;
}

/* Style the buttons */
.btn-outline-primary {
	color: #007bff;
	border-color: #007bff;
}

.btn-outline-primary:hover {
	background-color: #007bff;
	color: #fff;
}

.btn-primary {
	background-color: #007bff;
	border-color: #007bff;
}

.btn-primary:hover {
	background-color: #0056b3;
	border-color: #0056b3;
}

.white-button {
	background-color: white;
	color: black;
}

.increased-height {
	height: 100px; /* Adjust the height value as needed */
}

.input-group-prepend .input-group-text {
	font-size: 12px;
	color: black;
}

.input-group-append .input-group-text {
	font-size: 12px;
	color: black;
}

.input-group-prepend span {
	color: black;
	background-color: #dcdce6;
	border-color: #dcdce6;
}

.input-group-append span {
	color: black;
	background-color: #dcdce6;
	border-color: #dcdce6;
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

div.dt-buttons>.dt-button:first-child, div.dt-buttons>div.dt-button-split .dt-button:first-child
	{
	margin-left: 0;
	background-color: #336699 !important;
	color: white;
	padding: 4px 10px;
}

.small-input {
	width: 120px; /* Adjust width as needed */
	height: 30px; /* Adjust height as needed */
	padding: 2px;
	font-size: 12px;
}

.small-label {
	font-size: 15px;
	display: block;
	margin-bottom: 2px;
}

.small-input1 {
	width: 215px; /* Adjust width as needed */
	height: 30px; /* Adjust height as needed */
	padding: 2px;
	font-size: 12px;
}

.small-label1 {
	font-size: 15px;
	display: block;
	margin-bottom: 2px;
}

.pdf-loader {
	position: fixed;
	inset: 0;
	background: rgba(255, 255, 255, 0.65);
	backdrop-filter: blur(3px);
	display: none;
	align-items: center;
	justify-content: center;
	z-index: 999999;
	animation: fadeIn 0.2s ease-out;
}

.loader-card {
	background: #ffffff;
	padding: 28px 36px;
	border-radius: 14px;
	box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
	text-align: center;
	font-family: "Segoe UI", Arial, sans-serif;
	min-width: 220px;
}

.spinner {
	width: 200px;
	height: 200px;
	border: 10px solid #e5e5e5;
	border-top: 10px solid #111;
	border-radius: 50%;
	animation: spin 0.7s linear infinite;
	margin: 0 auto 14px auto;
}

.loader-text {
	font-size: 14px;
	color: #333;
	font-weight: 500;
	letter-spacing: 0.3px;
}

/* animated dots */
.dots::after {
	content: "";
	animation: dots 1.5s steps(4, end) infinite;
}

@
keyframes dots { 0% {
	content: "";
}

25






%
{
content:".";
}
50%
{
content:"..";
}
75






%
{
content






:






"...";
}
}
@
keyframes spin {to { transform:rotate(360deg);
	
}

}
@
keyframes fadeIn {from { opacity:0;
	
}

to {
	opacity: 1;
}

}

/* ===== ENQUIRY MODAL — MODERN DESIGN ===== */
.enquiry-modal-content {
	border-radius: 14px;
	border: none;
	overflow: hidden;
	box-shadow: 0 20px 50px rgba(0, 0, 0, 0.15);
}

.enquiry-modal-header {
	background: linear-gradient(135deg, #37499A 0%, #4a5cc4 100%);
	padding: 20px 28px;
	border-bottom: none;
	height: auto;
}

.enquiry-modal-header .modal-title {
	color: #ffffff;
	font-size: 18px;
	font-weight: 600;
}

.enquiry-subtitle {
	color: #dbe1f7;
	font-size: 12.5px;
	margin-top: 2px;
}

.enquiry-modal-body {
	background-color: #fafbfe;
	padding: 26px 28px;
}

.enquiry-field {
	margin-bottom: 14px;
}

.enquiry-field label {
	font-size: 12.5px;
	font-weight: 600;
	color: #4b5563;
	margin-bottom: 6px;
	display: flex;
	align-items: center;
}

.enquiry-icon {
	color: #37499A;
	margin-right: 6px;
	font-size: 12px;
	width: 14px;
}

.enquiry-input {
	border: 1px solid #e2e5ec;
	border-radius: 8px;
	background-color: #ffffff;
	font-size: 13px;
	padding: 8px 12px;
	height: auto;
	transition: all 0.15s ease-in-out;
	box-shadow: none;
}

.enquiry-input:focus {
	border-color: #37499A;
	box-shadow: 0 0 0 3px rgba(55, 73, 154, 0.12);
	outline: none;
}

.enquiry-readonly {
	background-color: #f3f4f6 !important;
	color: #6b7280;
	cursor: not-allowed;
}

textarea.enquiry-input {
	resize: none;
}

.enquiry-modal-footer {
	background-color: #ffffff;
	border-top: 1px solid #eef0f5;
	padding: 16px 28px;
}

.enquiry-btn-secondary {
	background-color: #ff3f3f;
	color: #f9f9f9;
	border: 1px solid #e5e7eb;
	border-radius: 7px;
	padding: 7px 20px;
	font-weight: 500;
}

.enquiry-btn-secondary:hover {
	background-color: #ff3f3f;
	color: #f9f9f9;
}

.enquiry-btn-primary {
	background: #098709;
	color: #ffffff;
	border: none;
	border-radius: 7px;
	padding: 7px 22px;
	font-weight: 500;
	box-shadow: 0 4px 10px rgba(55, 73, 154, 0.25);
}

.enquiry-btn-primary:hover {
	background: #098709;
	color: #ffffff;
}

/* Responsive: stack to 2 columns on tablets, 1 column on phones */
@media ( max-width : 991px) {
	.enquiry-field.col-md-4, .enquiry-field.col-md-3 {
		flex: 0 0 50%;
		max-width: 50%;
	}
}

@media ( max-width : 575px) {
	.enquiry-field.col-md-4, .enquiry-field.col-md-3 {
		flex: 0 0 100%;
		max-width: 100%;
	}
	.enquiry-modal-body {
		padding: 18px;
	}
	.enquiry-modal-header {
		padding: 16px 18px;
	}
}

.required {
	color: red;
	font-weight: bold;
}

@
keyframes dots { 0% {
	content: "";
}

25


%
{
content


:


".";
}
50


%
{
content


:


"..";
}
75


%
{
content


:


"...";
}
}
@
keyframes spin {to { transform:rotate(360deg);
	
}

}
@
keyframes fadeIn {from { opacity:0;
	
}

to {
	opacity: 1;
}

}

/* ===== SHARED MODAL (Create + Update) ===== */
.enquiry-field label {
	align-items: flex-start;
	line-height: 1.3;
}

.enquiry-icon {
	margin-top: 2px;
	flex-shrink: 0;
}

.enquiry-input {
	width: 100%;
	min-height: 36px;
}

select.enquiry-input {
	padding-right: 24px;
}

.enquiry-modal-header .close {
	opacity: 1;
	text-shadow: none;
}

.enquiry-modal-footer .btn {
	min-width: 90px;
}

/* ===== MOBILE ===== */
@media ( max-width : 575px) {
	.modal-dialog {
		margin: 8px;
		max-width: calc(100% - 16px) !important;
	}
	.enquiry-modal-header .modal-title {
		font-size: 16px;
	}
	.enquiry-subtitle {
		font-size: 11.5px;
	}
	.enquiry-field {
		margin-bottom: 10px;
	}
	.enquiry-field label {
		font-size: 12px;
		margin-bottom: 4px;
	}
	/* 16px stops iOS from zooming in when a field is focused */
	.enquiry-input {
		font-size: 16px;
		padding: 8px 10px;
	}
	.enquiry-modal-footer {
		padding: 12px 16px;
	}
	.enquiry-modal-footer .btn {
		flex: 1;
		font-size: 14px;
		padding: 8px 10px;
	}
	#exampleModalActivity .table {
		font-size: 12px;
	}
}

@media ( min-width : 576px) and (max-width: 991px) {
	.enquiry-input {
		font-size: 14px;
	}
}



.enquiry-field.has-error .enquiry-input {
	border-color: #dc3545;

	box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.12);
}

.field-error-msg {
	color: #dc3545;
	font-size: 11.5px;
	margin-top: 4px;
	line-height: 1.3;
}

#exampleModalActivity .table th,
#exampleModalActivity .table td {
	vertical-align: middle;
	font-size: 12.5px;
}

#exampleModalActivity .table th {
	white-space: nowrap;
}

#exampleModalActivity .table td:last-child {
	white-space: nowrap;
}

/* =====================================================================
   LEAD ENTRY PAGE - MOBILE
   Add this as a NEW <style> block right before </head>
   (a new block, so it can't be affected by the broken CSS in your big style block).

   Everything in the media query below only applies under 768px,
   so laptop / desktop is unchanged.
   Needs lead-entry-mobile.js so the table cards show column names.
   ===================================================================== */

html, body {
	max-width: 100%;
	overflow-x: hidden;                 /* no sideways page scroll on phones */
}

@media screen and ( max-width : 767.98px) {

	/* ---------- Page layout ---------- */
	#content {
		min-width: 0;
	}
	.topbar {
		padding: 0 .75rem;
	}

	/* the title / breadcrumb sit outside any container, so they touch the screen edge */
	#content>.d-sm-flex {
		padding: 0 12px;
	}
	#content>.d-sm-flex .h3 {
		font-size: 1.25rem;
	}
	#content>.d-sm-flex .breadcrumb {
		width: 100%;
		flex-wrap: wrap;
		font-size: 13px;
		padding: .5rem .75rem;
		margin: .5rem 0 0;
	}

	/* the .row's negative margins push the page wider than the screen */
	#content>.row.mb-3 {
		margin-left: 0;
		margin-right: 0;
	}
	#content>.row.mb-3>[class*="col-"] {
		padding-left: 12px;
		padding-right: 12px;
	}

	/* box around the Create button */
	.card.mb-4>div[style*="box-shadow"] {
		padding: 8px !important;
	}
	.card-header {
		padding: .6rem .75rem !important;
	}
	#modalScroll1 {
		width: 100%;
		min-height: 42px;
		font-size: 14px;
	}
	.table-responsive.p-3 {
		padding: .5rem !important;
		-webkit-overflow-scrolling: touch;
	}

	/* ---------- Tables -> cards (Lead list + Follow-up history) ---------- */
	#LeadTableID, #LeadTableID tbody, #LeadTableID tr, #LeadTableID td,
		#exampleModalActivity .table.table-sm,
		#exampleModalActivity .table.table-sm tbody,
		#exampleModalActivity .table.table-sm tr,
		#exampleModalActivity .table.table-sm td {
		display: block;
		width: 100%;
	}

	/* column headings become labels inside each card */
	#LeadTableID thead, #exampleModalActivity .table.table-sm thead {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
	}

	#LeadTableID tbody tr, #exampleModalActivity .table.table-sm tbody tr {
		background: #fff;
		border: 1px solid #e3e6f0;
		border-radius: 10px;
		margin-bottom: .75rem;
		overflow: hidden;
		box-shadow: 0 2px 6px rgba(0, 0, 0, .06);
	}

	#LeadTableID tbody td, #exampleModalActivity .table.table-sm tbody td {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: .75rem;
		padding: .55rem .85rem;
		border: 0;
		border-bottom: 1px solid #f0f1f6;
		font-size: 14px;
		text-align: right;
		white-space: normal;               /* long values wrap */
		word-break: break-word;
	}
	#LeadTableID tbody td:last-child, #exampleModalActivity .table.table-sm tbody td:last-child
		{
		border-bottom: 0;
	}
	#LeadTableID tbody td::before, #exampleModalActivity .table.table-sm tbody td::before
		{
		content: attr(data-label);
		flex: 0 0 40%;
		max-width: 40%;
		text-align: left;
		font-weight: 600;
		color: #37499A;
	}

	/* first cell (Sl. No. / Date) = card header */
	#LeadTableID tbody td:first-child, #exampleModalActivity .table.table-sm tbody td:first-child
		{
		background: #f8f9fc;
	}

	/* Edit / Follow-up / Action cells: buttons stay together and tappable */
	#LeadTableID tbody td[data-label="Edit"], #LeadTableID tbody td[data-label="Follow-up"],
		#exampleModalActivity .table.table-sm tbody td[data-label="Action"] {
		align-items: center;
		flex-wrap: wrap;
	}
	#LeadTableID tbody td .btn, #exampleModalActivity .table.table-sm tbody td .btn
		{
		min-height: 34px;
	}

	/* long text under its label */
	#exampleModalActivity .table.table-sm tbody td[data-label="Comments"] {
		flex-direction: column;
		text-align: left;
		gap: .15rem;
	}
	#exampleModalActivity .table.table-sm tbody td[data-label="Comments"]::before
		{
		flex: none;
		max-width: 100%;
	}

	/* DataTables "No data available" row: no label, centered */
	#LeadTableID tbody td[colspan], #LeadTableID tbody td.dataTables_empty,
		#exampleModalActivity .table.table-sm tbody td[colspan] {
		display: block;
		text-align: center;
	}
	#LeadTableID tbody td[colspan]::before, #LeadTableID tbody td.dataTables_empty::before,
		#exampleModalActivity .table.table-sm tbody td[colspan]::before {
		content: none;
	}

	/* cards don't need sideways scrolling */
	.table-responsive, .dataTables_wrapper .row>[class*="col-"] {
		overflow-x: visible;
	}

	/* ---------- DataTables controls (search / length / paging / buttons) ---------- */
	.dataTables_wrapper .row {
		margin-left: 0;
		margin-right: 0;
	}
	.dataTables_wrapper .row>[class*="col-"] {
		padding-left: 0;
		padding-right: 0;
	}
	.dataTables_wrapper .dataTables_length, .dataTables_wrapper .dataTables_filter,
		.dataTables_wrapper .dataTables_info, .dataTables_wrapper .dataTables_paginate
		{
		text-align: center !important;
		float: none;
		margin: .4rem 0;
	}
	.dataTables_wrapper .dataTables_filter input {
		width: 100%;
		max-width: 220px;
		margin-left: 0;
	}
	.dataTables_wrapper .pagination {
		justify-content: center;
		flex-wrap: wrap;
	}
	div.dt-buttons {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 6px;
		float: none;
		margin-bottom: .5rem;
	}

	/* ---------- Modals (Create / Update / Follow-up / Message) ---------- */
	.modal-dialog[style*="max-width"] {
		max-width: calc(100% - 1rem) !important;   /* beats the inline 900px / 750px */
		margin: .5rem auto;
	}
	.enquiry-modal-header {
		padding: 16px 18px;
	}
	.enquiry-modal-header .modal-title {
		font-size: 16px;
	}
	.enquiry-subtitle {
		font-size: 11.5px;
	}
	.enquiry-modal-body {
		padding: 18px;
	}
	.enquiry-modal-footer {
		padding: 12px 16px;
	}
	.enquiry-modal-footer .btn {
		flex: 1;
		font-size: 14px;
		padding: 8px 10px;
	}

	/* 16px stops iPhone auto-zoom on focus; date/month pickers get a proper height */
	.enquiry-input {
		font-size: 16px;
		padding: 8px 10px;
	}
	input[type="date"].enquiry-input, input[type="month"].enquiry-input {
		-webkit-appearance: none;
		appearance: none;
		min-height: 38px;
	}

	/* Lead No / Client / Project summary box in the Follow-up modal */
	#exampleModalActivity .p-2.mb-3 [class*="col-"] {
		margin-bottom: .5rem;
	}

	/* ---------- Loader + popup ---------- */
	.loader-card {
		min-width: 0;
		padding: 20px 24px;
	}
	.spinner {
		width: 120px;
		height: 120px;
		border-width: 8px;
	}
	.popup {
		left: 50%;
		right: auto;
		transform: translateX(-50%);
		max-width: 90vw;
		text-align: center;
	}
}

/* =====================================================================
   OPTIONAL BUG FIX (all screen sizes): the @keyframes in your big <style>
   block were broken by auto-formatting ("@" and "keyframes" on separate lines,
   "25 %" etc.), so the browser ignores them and the loader spinner never spins.
   These are the correct versions. Delete this block if you don't want it.
   ===================================================================== */
@keyframes spin {
	to { transform: rotate(360deg); }
}
@keyframes fadeIn {
	from { opacity: 0; }
	to   { opacity: 1; }
}
@keyframes dots {
	0%   { content: ""; }
	25%  { content: "."; }
	50%  { content: ".."; }
	75%  { content: "..."; }
}
@media screen and ( max-width : 767.98px) {
 
	/* Visible screen height. 100vh is TOO TALL on phones (it ignores the browser address bar
	   and bottom toolbar), which is why the footer buttons used to fall off-screen.
	   100dvh = the real visible height; 100vh is only a fallback for very old browsers. */
	:root {
		--modal-h: calc(100vh - 1rem);
	}
	@supports (height: 100dvh) {
		:root {
			--modal-h: calc(100dvh - 1rem);
		}
	}
 
	/* ---------- Dialog size: always inside the screen ---------- */
	.modal {
		overscroll-behavior: contain;      /* scrolling the form doesn't scroll the page behind */
	}
	.modal-dialog {
		margin: .5rem auto;
		width: calc(100% - 1rem);
		max-width: calc(100% - 1rem) !important;   /* beats inline max-width:900px / 750px / 500px */
	}
	/* small "Are you sure?" / message dialogs don't need to stretch on bigger phones */
	.modal-dialog-centered:not(.modal-dialog-scrollable):not(.modal-lg) {
		max-width: min(420px, calc(100% - 1rem)) !important;
	}
 
	/* centered dialogs: centre inside the VISIBLE height */
	.modal-dialog-centered {
		min-height: var(--modal-h);
	}
	.modal-dialog-scrollable, .modal-dialog-centered.modal-dialog-scrollable {
		height: auto;
		max-height: var(--modal-h);
	}
 
	/* ---------- Header + footer stay visible, only the body scrolls ---------- */
	.modal-content {
		max-height: var(--modal-h) !important;
		overflow: hidden;
		/* BS4 already makes .modal-content a flex column; this keeps it that way */
		display: flex;
		flex-direction: column;
	}
	.modal-header, .modal-footer {
		flex: 0 0 auto;
	}
	.modal-body {
		flex: 1 1 auto;
		min-height: 0;                     /* required so the body can shrink and scroll */
		overflow-y: auto;
		-webkit-overflow-scrolling: touch;
		padding: 16px;
	}
 
	.modal-header {
		height: auto !important;           /* cancels the fixed height:45px */
		min-height: 45px;
		align-items: center;
		padding: .75rem 1rem;
	}
	.modal-title {
		line-height: 1.3 !important;
		word-break: break-word;
	}
 
	.modal-footer {
		flex-wrap: wrap;
		gap: .5rem;
		padding: .75rem 1rem;
		padding-bottom: calc(.75rem + env(safe-area-inset-bottom, 0px));
	}
	.modal-footer>.btn, .modal-footer>button {
		flex: 1 1 0;                       /* Close / Create buttons share the width, easy to tap */
		min-width: 0;
		margin: 0;
		min-height: 40px;
	}
 
	/* ---------- Form fields never wider than the dialog ---------- */
	.modal .form-control, .modal select, .modal textarea, .modal input:not([type="checkbox"]):not([type="radio"])
		{
		max-width: 100%;
		font-size: 16px;                   /* stops iPhone auto-zoom when a field is tapped */
	}
	.modal select.form-control, .modal select {
		text-overflow: ellipsis;           /* long option text doesn't stretch the dialog */
	}
	.modal input[type="date"], .modal input[type="month"], .modal input[type="time"],
		.modal input[type="datetime-local"] {
		-webkit-appearance: none;
		appearance: none;
		width: 100%;
		min-width: 0;                      /* iPhone date inputs overflow without this */
		min-height: 38px;
	}
	.modal label {
		max-width: 100%;
		word-break: break-word;
	}
 
	/* old pages: confirm popups had inline  width:54%; right:-22%  which pushed them off-screen */
	.modal-content[style*="right"] {
		width: 100% !important;
		right: 0 !important;
	}
 
	/* custom dropdowns inside modals (fixed 300px wide before) */
	.modal [id$="DropdownMenu"], .modal [id$="DropdownMenuUp"] {
		width: 100% !important;
		max-width: 100%;
	}
	.modal .select2-container {
		width: 100% !important;
	}
}
 
/* Short screens (phone turned sideways): tighter header/footer so the form has room */
@media screen and ( max-width : 991.98px) and (max-height: 480px) {
	.modal-header {
		min-height: 0;
		padding: .4rem 1rem;
	}
	.modal-footer {
		padding-top: .4rem;
		padding-bottom: .4rem;
	}
	.modal-body {
		padding: 10px 16px;
	}
}
</style>
</head>

<body id="page-top">
	<div id="wrapper">

		<!-- Sidebar -->
		<%@ include file="SaleSidebar.jsp"%>

		<!-- Content Wrapper -->
		<div id="content-wrapper" class="d-flex flex-column">
			<div id="content">

				<!-- Topbar -->
				<nav
					class="navbar navbar-expand navbar-light bg-navbar topbar mb-4 static-top"
					style="background-color: #37499A;">
					<button id="sidebarToggleTop"
						class="btn btn-link rounded-circle mr-3">
						<i class="fa fa-bars text-white"></i>
					</button>
					<ul class="navbar-nav ml-auto">
						<button class="btn btn-link"
							onclick="window.location.href='Landingpage.jsp'"
							style="background: transparent; border: none; color: white;">
							<i class="fa fa-home"></i>
						</button>
						<div class="topbar-divider d-none d-sm-block"></div>
						<li class="nav-item dropdown no-arrow"><a
							class="nav-link dropdown-toggle" href="#" id="userDropdown"
							role="button" data-toggle="dropdown"> <i
								class="fas fa-user text-white mr-2"></i> <span
								class="d-none d-lg-inline text-white small" id="usernameDisplay">Username</span>
						</a>
							<div
								class="dropdown-menu dropdown-menu-right shadow animated--grow-in">
								<a class="dropdown-item" href="#" onclick="logoutUser(event)">
									<i class="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400"></i>
									Logout
								</a>
							</div></li>
					</ul>
				</nav>
				
					<div
					class="d-sm-flex align-items-center justify-content-between mb-4">
					<h1 class="h3 mb-0 text-gray-800">CRM Lead Entry</h1>
					<ol class="breadcrumb">
						<li class="breadcrumb-item"><a href="SaleDashBoard.jsp">Home</a></li>
						<li class="breadcrumb-item active" aria-current="page">Lead
							Entry</li>

					</ol>
				</div>

				<div class="row mb-3">
					<div class="col-lg-12">
						<div class="card mb-4">
							<div
								style="border: 1px solid #ddd; border-radius: 5px; padding: 15px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
								<div
									class="card-header py-3 d-flex flex-row align-items-center justify-content-between"
									style="background-color: #f8f9fc;">
									<button data-toggle="modal" id="modalScroll1">
										<i class="fas fa-plus"></i> Create
									</button>
								</div>
							</div>


							<div class="table-responsive p-3">
								<table class="table table-striped table-bordered table-sm"
									id="LeadTableID" width="100%">
									<thead>
										<tr>
											<th>Sl. No.</th>
											<th>Lead No</th>
											<th>Project Name</th>
											<th>Client Name</th>
											<th>Stage</th>
											<th>Edit</th>
											<th>Follow-up</th>
										</tr>
									</thead>
									<tbody id="LeadTableBody">
									</tbody>
								</table>
							</div>
						</div>
					</div>
				</div>
				<div class="modal fade" id="exampleModalScrollable" tabindex="-1"
					role="dialog" aria-labelledby="exampleModalScrollableTitle123"
					aria-hidden="true">
					<div
						class="modal-dialog modal-dialog-scrollable modal-dialog-centered"
						style="max-width: 900px;" role="document">
						<div class="modal-content enquiry-modal-content">

							<!-- Header -->
							<div class="modal-header enquiry-modal-header">
								<div>
									<h5 class="modal-title mb-0"
										id="exampleModalScrollableTitle123">Lead Entry</h5>
									<p class="enquiry-subtitle mb-0 ">Fill in the details below
										to log a new Lead</p>

								</div>
								<button type="button" class="close text-white"
									data-dismiss="modal" aria-label="Close">
									<span aria-hidden="true">&times;</span>
								</button>
							</div>

							<!-- Body -->
							<div class="modal-body enquiry-modal-body">
								<div class="form-row">

									<div class="form-group col-md-4 enquiry-field" hidden="hidden">
										<label><i class="fas fa-hashtag enquiry-icon"></i> Enq
											No</label> <input type="text" id="enqNo"
											class="form-control form-control-sm enquiry-input enquiry-readonly"
											readonly placeholder="ENQ-1001">
									</div>

									<!-- Client Name -->

									<div class="form-group col-md-4 enquiry-field">
										<label> <i class="fas fa-user-check enquiry-icon"></i>
											Client Name <span class="text-danger">*</span>
										</label> <select id="clientName"
											class="form-control form-control-sm enquiry-input">
										</select>
									</div>


									<div class="form-group col-md-4 enquiry-field">
										<label><i class="fas fa-comment-dots enquiry-icon"></i>
											Project Name </label> <select id="projectName"
											class="form-control form-control-sm enquiry-input">
											<option value="">Select Client first</option>
										</select>
									</div>

									<div class="form-group col-md-4 enquiry-field">
										<label><i class="fas fa-comment-dots enquiry-icon"></i>
											site Location</label> <input type="text" id="site"
											class="form-control form-control-sm enquiry-input"
											readonly="readonly">
									</div>
									<div class="form-group col-md-4 enquiry-field">
										<label><i class="fas fa-comment-dots enquiry-icon"></i>
											Zone</label> <input type="text" id="Zone"
											class="form-control form-control-sm enquiry-input"
											readonly="readonly">
									</div>
									<div class="form-group col-md-4 enquiry-field">
										<label><i class="fas fa-user-check enquiry-icon"></i>General
											Consultant <span class="text-danger">*</span> </label> <select
											id="gnrlcon"
											class="form-control form-control-sm enquiry-input">
											<option value="">Select</option>
											<option value="1">YES</option>
											<option value="0">NO</option>
										</select>
									</div>



									<div class="form-group col-md-4 enquiry-field">
										<label> <i class="fas fa-building enquiry-icon"></i>
											Type <span class="text-danger">*</span>
										</label> <select id="invdevType"
											class="form-control form-control-sm enquiry-input">
											<option value="">Select</option>
											<option value="1">Investor</option>
											<option value="2">Developer</option>
										</select>
									</div>

									<div class="form-group col-md-4 enquiry-field">
										<label> <i class="fas fa-comment-dots enquiry-icon"></i>
											Sale Person Name
										</label> <input type="text" id="invdev"
											class="form-control form-control-sm enquiry-input">
									</div>

									<!-- KAM -->
									<div class="form-group col-md-4 enquiry-field" hidden="hidden">
										<label><i class="fas fa-user-check enquiry-icon"></i>
											KAM <span class="text-danger">*</span></label> <select id="kam"
											class="form-control form-control-sm enquiry-input">
											<option value="">Select KAM</option>
											<option value="KAM 1">KAM 1</option>
											<option value="KAM 2">KAM 2</option>
											<option value="KAM 3">KAM 3</option>
										</select>
									</div>

									<!-- Current Stage -->

									<!-- RFQ Date -->
									<div class="form-group col-md-4 enquiry-field">
										<label><i class="fas fa-calendar-alt enquiry-icon"></i>
											RFQ Date <span class="text-danger">*</span></label> <input
											type="date" id="rfqDate"
											class="form-control form-control-sm enquiry-input">
									</div>

									<!-- NDA Date -->
									<div class="form-group col-md-4 enquiry-field">
										<label><i class="fas fa-file-contract enquiry-icon"></i>
											NDA Date <span class="text-danger">*</span> </label> <input
											type="date" id="ndaDate"
											class="form-control form-control-sm enquiry-input">
									</div>

									<div class="form-group col-md-4 enquiry-field">
										<label><i class="fas fa-random enquiry-icon"></i>Industry
											Type <span class="text-danger">*</span> </label> <select id="indtyp"
											class="form-control form-control-sm enquiry-input">
										</select>
									</div>

									<div class="form-group col-md-4 enquiry-field">
										<label><i class="fas fa-comment-dots enquiry-icon"></i>
											Area/qty(MT) <span class="text-danger">*</span></label> <input
											type="number" id="qty"
											class="form-control form-control-sm enquiry-input">
									</div>

									<div class="form-group col-md-4 enquiry-field">
										<label><i class="fas fa-comment-dots enquiry-icon"></i>
											Suggested Bid Value(cr) <span class="text-danger">*</span></label> <input
											type="text" id="bidval"
											class="form-control form-control-sm enquiry-input">
									</div>
									<div class="form-group col-md-4 enquiry-field">
										<label> <i class="fas fa-random enquiry-icon"></i>Segment
											<span class="text-danger">*</span></label> <select id="segtype"
											class="form-control form-control-sm enquiry-input">
										</select>
									</div>

									<div class="form-group col-md-4 enquiry-field">
										<label><i class="fas fa-calendar-plus enquiry-icon"></i>
											Expected Project Start Month </label>
										<input type="date" id="exppromon"
											class="form-control form-control-sm enquiry-input">
									</div>
									<div class="form-group col-md-4 enquiry-field">
										<label><i class="fas fa-calendar-plus enquiry-icon"></i>
											Expected Award Month <span class="text-danger">*</span> </label> <input
											type="date" id="expawdmon"
											class="form-control form-control-sm enquiry-input">
									</div>



									<div class="form-group col-md-4 enquiry-field">
										<label><i class="fas fa-calendar-check enquiry-icon"></i>
											Tentative Closure Month</label> <input type="month"
											id="tentClosureMon"
											class="form-control form-control-sm enquiry-input">
									</div>

									<div class="form-group col-md-4 enquiry-field">
										<label><i class="fas fa-drafting-compass enquiry-icon"></i>
											Design Basis <span class="text-danger">*</span> </label> <select
											id="designBasis"
											class="form-control form-control-sm enquiry-input">
											<option value="">Select Design Basis</option>
										</select>
									</div>


									<!-- Bid Type -->
									<div class="form-group col-md-4 enquiry-field">
										<label><i class="fas fa-random enquiry-icon"></i> Bid
											Type Single Bid (Yes)/Multiple Bids (No) <span
											class="text-danger">*</span> </label> <select id="bidType"
											class="form-control form-control-sm enquiry-input">
											<option value="">Select Bid Type</option>
											<option value="Yes">Yes</option>
											<option value="No">No</option>
										</select>
									</div>


									<div class="form-group col-md-4 enquiry-field">
										<label><i class="fas fa-tasks enquiry-icon"></i>
											Current Stage</label> <select id="currentStage"
											class="form-control form-control-sm enquiry-input"
											disabled="disabled">
										</select>
									</div>

									<div class="form-group col-md-12 enquiry-field">
										<label> <i class="fas fa-comment-dots enquiry-icon"></i>
											Comments <span class="text-danger">*</span>
										</label>
										<textarea id="comments" rows="3"
											class="form-control form-control-sm enquiry-input"
											placeholder="Add any additional notes here..."></textarea>
									</div>

								</div>
							</div>

							<!-- Footer -->
							<div class="modal-footer enquiry-modal-footer">
								<button type="button" class="btn btn-sm enquiry-btn-secondary"
									data-dismiss="modal">Close</button>
								<button type="button" class="btn btn-sm enquiry-btn-primary"
									onclick="openModalAdd();">Create Lead</button>
							</div>

						</div>
					</div>
				</div>

			


				<div class="modal fade" id="exampleModalScrollableUp" tabindex="-1"
					role="dialog" aria-hidden="true">
					<div
						class="modal-dialog modal-dialog-scrollable modal-dialog-centered"
						style="max-width: 900px;" role="document">
						<div class="modal-content enquiry-modal-content">

							<div class="modal-header enquiry-modal-header">
								<div>
									<h5 class="modal-title mb-0">Update Lead</h5>
									<p class="enquiry-subtitle mb-0">Edit the details below to
										update this Lead</p>
								</div>
								<button type="button" class="close text-white"
									data-dismiss="modal" aria-label="Close">
									<span aria-hidden="true">&times;</span>
								</button>
							</div>

							<div class="modal-body enquiry-modal-body">
								<div class="form-row">

									<div class="form-group col-md-4 enquiry-field">
										<label><i class="fas fa-hashtag enquiry-icon"></i>
											Lead No</label> <input type="text" id="leadNo1"
											class="form-control form-control-sm enquiry-input enquiry-readonly"
											readonly>
									</div>

									<div class="form-group col-md-4 enquiry-field">
										<label><i class="fas fa-user-check enquiry-icon"></i>
											Client Name <span class="text-danger">*</span></label> <select
											id="clientName1"
											class="form-control form-control-sm enquiry-input"></select>
									</div>

									<div class="form-group col-md-4 enquiry-field">
										<label><i class="fas fa-comment-dots enquiry-icon"></i>
											Project Name <span class="text-danger">*</span></label> <select
											id="projectName1"
											class="form-control form-control-sm enquiry-input">
											<option value="">Select Client first</option>
										</select>
									</div>

									<div class="form-group col-md-4 enquiry-field">
										<label><i class="fas fa-user-check enquiry-icon"></i>
											General Consultant</label> <select id="gnrlcon1"
											class="form-control form-control-sm enquiry-input">
											<option value="">Select</option>
											<option value="1">YES</option>
											<option value="0">NO</option>
										</select>
									</div>

									<div class="form-group col-md-4 enquiry-field">
										<label><i class="fas fa-building enquiry-icon"></i>
											Type <span class="text-danger">*</span> </label> <select
											id="invdevType1"
											class="form-control form-control-sm enquiry-input">
											<option value="">Select</option>
											<option value="1">Investor</option>
											<option value="2">Developer</option>
										</select>
									</div>

									<div class="form-group col-md-4 enquiry-field">
										<label><i class="fas fa-comment-dots enquiry-icon"></i>
											Sale Person Name <span class="text-danger">*</span> </label> <input
											type="text" id="invdev1"
											class="form-control form-control-sm enquiry-input">
									</div>

									<div class="form-group col-md-4 enquiry-field">
										<label><i class="fas fa-calendar-alt enquiry-icon"></i>
											RFQ Date  <span class="text-danger">*</span> </label> <input
											type="date" id="rfqDate1"
											class="form-control form-control-sm enquiry-input">
									</div>

									<div class="form-group col-md-4 enquiry-field">
										<label><i class="fas fa-file-contract enquiry-icon"></i>
											NDA Date <span class="text-danger">*</span> </label> <input
											type="date" id="ndaDate1"
											class="form-control form-control-sm enquiry-input">
									</div>

									<div class="form-group col-md-4 enquiry-field">
										<label><i class="fas fa-random enquiry-icon"></i>
											Industry Type <span class="text-danger">*</span> </label> <select
											id="indtyp1"
											class="form-control form-control-sm enquiry-input"></select>
									</div>

									<div class="form-group col-md-4 enquiry-field">
										<label><i class="fas fa-comment-dots enquiry-icon"></i>
											Area/qty(MT) <span class="text-danger">*</span> </label> <input
											type="number" id="qty1"
											class="form-control form-control-sm enquiry-input">
									</div>

									<div class="form-group col-md-4 enquiry-field">
										<label><i class="fas fa-comment-dots enquiry-icon"></i>
											Suggested Bid Value(cr) <span class="text-danger">*</span> </label> <input
											type="number" step="any" id="bidval1"
											class="form-control form-control-sm enquiry-input">
									</div>

									<div class="form-group col-md-4 enquiry-field">
										<label><i class="fas fa-random enquiry-icon"></i>
											Segment <span class="text-danger">*</span> </label> <select
											id="segtype1"
											class="form-control form-control-sm enquiry-input"></select>
									</div>

									<div class="form-group col-md-4 enquiry-field">
										<label><i class="fas fa-calendar-plus enquiry-icon"></i>
											Expected Project Start Month </label> <input type="date"
											id="exppromon1"
											class="form-control form-control-sm enquiry-input">
									</div>

									<div class="form-group col-md-4 enquiry-field">
										<label><i class="fas fa-calendar-plus enquiry-icon"></i>
											Expected Award Month <span class="text-danger">*</span> </label> <input
											type="date" id="expawdmon1"
											class="form-control form-control-sm enquiry-input">
									</div>

									<div class="form-group col-md-4 enquiry-field">
										<label><i class="fas fa-calendar-check enquiry-icon"></i>
											Tentative Closure Month</label> <input type="month"
											id="tentClosureMon1"
											class="form-control form-control-sm enquiry-input">
									</div>

									<div class="form-group col-md-4 enquiry-field">
										<label><i class="fas fa-drafting-compass enquiry-icon"></i>
											Design Basis <span class="text-danger">*</span> </label> <select
											id="designBasis1"
											class="form-control form-control-sm enquiry-input">
											<option value="">Select Design Basis</option>
										</select>
									</div>

									<div class="form-group col-md-4 enquiry-field">
										<label><i class="fas fa-random enquiry-icon"></i> Bid
											Type Single Bid (Yes)/Multiple Bids (No) <span
											class="text-danger">*</span> </label> <select id="bidType1"
											class="form-control form-control-sm enquiry-input">
											<option value="">Select Bid Type</option>
											<option value="Yes">Yes</option>
											<option value="No">No</option>
										</select>
									</div>

									<div class="form-group col-md-4 enquiry-field">
										<label><i class="fas fa-tasks enquiry-icon"></i>
											Current Stage <span class="text-danger">*</span> </label> <select
											id="currentStage1"
											class="form-control form-control-sm enquiry-input"
											disabled="disabled"></select>
									</div>

									<div class="form-group col-md-12 enquiry-field">
										<label><i class="fas fa-comment-dots enquiry-icon"></i>
											Comments <span class="text-danger">*</span></label>
										<textarea id="comments1" rows="3"
											class="form-control form-control-sm enquiry-input"
											placeholder="Add any additional notes here..."></textarea>
									</div>

								</div>
							</div>

							<div class="modal-footer enquiry-modal-footer">
								<button type="button" class="btn btn-sm enquiry-btn-secondary"
									data-dismiss="modal">Close</button>
								<button type="button" class="btn btn-sm enquiry-btn-primary"
									onclick="updateLead()">Update</button>
							</div>

						</div>
					</div>
				</div>

				<div class="modal fade" id="exampleModalActivity" tabindex="-1"
					role="dialog" aria-labelledby="exampleModalActivityTitle"
					aria-hidden="true">
					<div
						class="modal-dialog modal-dialog-scrollable modal-dialog-centered"
						style="max-width: 750px;" role="document">
						<div class="modal-content">
							<div class="modal-header enquiry-modal-header">
								<h5 class="modal-title text-white"
									id="exampleModalActivityTitle">
									<b>Lead Follow-up</b>
								</h5>
								<button type="button" class="close text-white"
									data-dismiss="modal" aria-label="Close">
									<span aria-hidden="true">&times;</span>
								</button>
							</div>
							<div class="modal-body enquiry-modal-body">

								<!-- Read-only summary of the enquiry -->
								<div class="p-2 mb-3"
									style="background-color: #eef0fa; border-radius: 8px; border-left: 4px solid #37499A;">
									<div class="row">
										<div class="col-md-3">
											<small class="text-muted">Lead No</small><br> <b
												id="sqEnqNo">-</b>
										</div>
										<div class="col-md-4">
											<small class="text-muted">Client</small><br> <b
												id="sqClientName">-</b>
										</div>
										<div class="col-md-4">
											<small class="text-muted">ProjectName</small><br> <b
												id="sqProjectName">-</b>
										</div>

									</div>
								</div>

								<div class="form-row">

									<div class="form-group col-md-4 enquiry-field">
										<label><i class="fas fa-bullseye enquiry-icon"></i>
											Source <span class="text-danger">*</span> </label> <select id="activitySource"
											class="form-control form-control-sm enquiry-input">
											<option value="">Select Source</option>
										</select>
									</div>

									<div class="form-group col-md-4 enquiry-field">
										<label><i class="fas fa-calendar-day enquiry-icon"></i>
											Date <span class="text-danger">*</span> </label> <input type="date" id="activityDate"
											class="form-control form-control-sm enquiry-input">
									</div>

									<div class="form-group col-md-4 enquiry-field">
										<label><i class="fas fa-id-badge enquiry-icon"></i>
											Name (Attended By) <span class="text-danger">*</span> </label> <input type="text" id="activityAttendedBy"
											class="form-control form-control-sm enquiry-input enquiry-readonly"
											readonly>
									</div>


									<div class="form-group col-md-4 enquiry-field">
										<label><i class="fas fa-flag enquiry-icon"></i> Stage <span class="text-danger">*</span> </label>
										<select id="activityStage"
											class="form-control form-control-sm enquiry-input">
											<option value="">Select Stage</option>
										</select>
									</div>


									<div class="form-group col-md-4 enquiry-field">
										<label><i class="fas fa-user enquiry-icon"></i>
											Contact Person <span class="text-danger">*</span> </label> <select id="activityContactPerson"
											class="form-control form-control-sm enquiry-input">
											<option value="">Select Contact Person</option>
										</select>
									</div>

									<div class="form-group col-md-4 enquiry-field">
										<label><i class="fas fa-calendar-check enquiry-icon"></i>
											Next Follow-up Date <span class="text-danger">*</span> </label> <input type="date" id="nextFollowUpDate"
											class="form-control form-control-sm enquiry-input">
									</div>

									<div class="form-group col-md-12 enquiry-field">
										<label><i class="fas fa-comment-dots enquiry-icon"></i>
											Comments <span class="text-danger">*</span> </label>
										<textarea id="activityRemarks" rows="2"
											class="form-control form-control-sm enquiry-input"></textarea>
									</div>
								</div>

								<hr>

								<h6 class="mb-2">
									<b>Follow-up History</b>
								</h6>
								<div class="table-responsive">
									<table class="table table-sm table-bordered">
										<thead>
											<tr>
												<th>Date</th>
												<th>Source</th>
												<th>Attended By</th>
												<th>Stage</th>
												<th>Contact Person</th>
												<th>Next Follow-up</th>
												<th>Comments</th>
												<th>Action</th>
											</tr>
										</thead>
										<tbody id="activityHistoryBody">
										</tbody>
									</table>
								</div>

							</div>
							<button type="button" class="btn btn-sm enquiry-btn-secondary"
								id="cancelEditBtn" style="display: none;">Cancel Edit</button>
							<div class="modal-footer enquiry-modal-footer">
								<button type="button" class="btn btn-sm enquiry-btn-secondary"
									data-dismiss="modal">Close</button>
								<button type="button" class="btn btn-sm enquiry-btn-primary"
									id="saveActivityBtn">Save Follow-up</button>
							</div>
						</div>
					</div>
				</div>
				


<div class="modal fade" id="messageModal" tabindex="-1" role="dialog"
	aria-hidden="true" data-backdrop="static" style="z-index: 1100;">
	<div class="modal-dialog modal-dialog-centered" style="max-width: 420px;" role="document">
		<div class="modal-content enquiry-modal-content">
			<div class="modal-body text-center" style="padding: 28px 24px; background: #fff;">
				<div id="messageModalIcon" style="font-size: 46px; margin-bottom: 10px;"></div>
				<h5 id="messageModalTitle" class="mb-2"></h5>
				<p id="messageModalText" class="mb-0" style="color: #4b5563; font-size: 14px; white-space: pre-line;"></p>
			</div>
			<div class="modal-footer enquiry-modal-footer justify-content-center">
				<button type="button" class="btn btn-sm enquiry-btn-secondary" id="messageModalCancel" style="display: none;">Cancel</button>
				<button type="button" class="btn btn-sm enquiry-btn-primary" id="messageModalOk">OK</button>
			</div>
		</div>
	</div>
</div>



	
				<script src="vendor/jquery/jquery.min.js"></script>
				<script src="vendor/bootstrap/js/bootstrap.bundle.min.js"></script>
				<script src="vendor/jquery-easing/jquery.easing.min.js"></script>
			
				<script src="vendor/datatables/jquery.dataTables.min.js"></script>
				<script src="vendor/datatables/dataTables.bootstrap4.min.js"></script>
				
							<script src="js/config.js?v=<%=ver(application, "/js/config.js")%>"></script>
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
				
				
			
				<script src="js/logout.js?v=<%=ver(application, "/js/logout.js")%>"></script>
				<script src="js/username.js?v=<%=ver(application, "/js/username.js")%>"></script>
				<script src="js/Sessionfilter.js?v=<%=ver(application, "/js/Sessionfilter.js")%>"></script>
				<script src="js/Leads.js?v=<%=ver(application, "/js/Leads.js")%>"></script>
				<script src="js/createdby.js?v=<%=ver(application, "/js/createdby.js")%>"></script>
</body>
</html>
