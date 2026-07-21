<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="ISO-8859-1">
<title>Vehicle Gate Pass</title>

<style>
    body {
        font-family: Arial, sans-serif;
        margin: 20px;
    }

    .header {
        text-align: right;
        font-size: 18px;
        font-weight: bold;
    }

    .vehicle-pass-box {
        border: 1px solid #000;
        width: 800px;
        margin: 0 auto;
        padding: 10px;
    }

    .company-name {
        text-align: center;
        font-weight: bold;
        font-size: 16px;
        text-transform: uppercase;
    }

    .instructions {
        font-size: 12px;
        border-right: 1px solid #000;
        width: 45%;
        padding-right: 10px;
        vertical-align: top;
    }

    .details {
        font-size: 13px;
        width: 55%;
        padding-left: 10px;
        vertical-align: top;
    }

    .instructions ul {
        margin: 0;
        padding-left: 18px;
    }

    .instructions li {
        margin-bottom: 5px;
    }

    .footer {
        font-size: 12px;
        margin-top: 10px;
    }

    .sign-row {
        display: flex;
        justify-content: space-between;
        font-size: 13px;
        margin-top: 15px;
    }

    .photo-box {
        width: 200px;
        height: 150px;
        border: 1px solid #000;
        margin-top: 5px;
    }

    .label {
        font-weight: bold;
    }

    .top-controls {
        margin-bottom: 10px;
    }

    .top-controls input {
        font-weight: bold;
        font-size: 14px;
        border: none;
        background: none;
    }

    @media print {
        button {
            display: none;
        }
    }
</style>
</head>
<body>

<div class="top-controls">
    <label>Vehicle Pass No:</label>
    <input type="text" value="VL0020171" readonly>
    <button onclick="window.print()">Print</button>
</div>

<div class="header">VEHICLE GATE PASS</div>

<div class="vehicle-pass-box">
    <div class="company-name">
        JSW SEVERFIELD STRUCTURES LIMITED<br>
        <small><u>SAFETY AND SECURITY INSTRUCTIONS</u></small>
    </div>

    <table width="100%" style="margin-top:10px;">
        <tr>
            <!-- Left side instructions -->
            <td class="instructions">
                <ul>
                    <li>Meet the concern JSSL employee.</li>
                    <li>Follow the instructions as instructed by JSSL staff and as displayed in the factory.</li>
                    <li>Do not work with visitor card and obtain the work permit before work starts.</li>
                    <li>Speed limit for vehicles within factory premises is 16 KMPH.</li>
                    <li>Smoking and photography is prohibited.</li>
                    <li>Do not touch any equipment or electrical points.</li>
                    <li>Use walkways wherever provided in the shop floor.</li>
                    <li>Be aware of shop floor hazards – trip hazard, hot surface, fumes etc.</li>
                    <li>Visitor is responsible for his own health and safety.</li>
                    <li>Return the JSSL gate pass to security while going back.</li>
                </ul>

                <br>
                <b>Emergency Contact Numbers:</b><br>
                Safety: +91 7760972163<br>
                OHC: +91 7760972153 / 08395-660108<br>
                Admin: +91 7760972158 / HR: +91 7760972147
            </td>

            <!-- Right side details -->
            <td class="details">
                <b>VehiclePass No:</b> VL0020171<br>
                <b>Name:</b> Madan Kumar Nil<br>
                <b>Contact No:</b> 7764011758<br>
                <b>DL No:</b> BR26 20130023192<br>
                <b>Company:</b> Naveen Orient<br>
                <b>DateTime:</b> 03-04-2025 07:05 P.M.<br><br>
                <div class="photo-box">
                    <!-- Placeholder for image -->
                    <img id="capturedImage" src="" alt="Photo" width="200" height="150">
                </div>
                <br>
                <b>Vehicle No:</b> KA35D3162<br>
                <b>Remarks:</b> Structure loading purpose<br>
                <b>Whom to meet:</b> Sunil Kumar Maurya<br>
                <b>Department:</b> Dispatch<br>
                <b>Security Sign:</b> ___________
            </td>
        </tr>
    </table>

    <div class="sign-row">
        <div><b>Visiting Officer Sign</b></div>
        <div><b>Visitor Sign</b></div>
    </div>
</div>

<script>
    // If image URL is stored in localStorage after capture
    const imagePath = localStorage.getItem("capturedImagePath");
    if (imagePath) {
        document.getElementById("capturedImage").src = imagePath;
    }
</script>

</body>
</html>
