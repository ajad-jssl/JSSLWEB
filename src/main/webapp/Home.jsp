<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>JSSL</title>
<style>
        /* =========================
           RESET & BASE
        ========================= */
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        @import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400..700;1,400..700&display=swap');

/* body {
  font-family: 'Libre Baskerville', serif;
} */

        :root {
            --accent: #0f172a;
            --header-height: 100px;
            --footer-height: 60px;
             --bg-color: #f0f4f8; /* Soft industrial light blue/grey */
            --primary-gradient: linear-gradient(135deg, #005bea, #00c6fb);
        }
              

        html, body {
            width: 100%;
            height: 100%;
            font-family: "Inter", sans-serif;
            background: #ffffff;
            color: var(--accent);
            overflow: hidden; /* Prevent scrolling */
        }

        /* =========================
           HEADER
        ========================= */
        header {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: var(--header-height);
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 60px;
          background-color: var(--bg-color);
            backdrop-filter: blur(10px);
            z-index: 1000;
            box-shadow: 0 4px 20px rgba(0,0,0,0.08);
            border-bottom: 1px solid rgba(0,0,0,0.05);
        }

/* LOGO */
.header-logo img {
    height: 200px;
    width: 120px
}

/* TITLE */
header h1 {
    margin: 0 auto;
    font-size: 44px;
    letter-spacing: 5px;
    font-weight: 600;
    color: #000000;
    font-family: 'Libre Baskerville', serif;
    animation: headerSlide 1.6s ease-out;
}

     .login-btn {
    padding: 12px 34px;
    font-size: 16px;
    font-weight: 600;
    border-radius: 28px;
    border: none;
    cursor: pointer;
    color: #fff;
    background: linear-gradient(135deg, #005bea, #00c6fb);
    box-shadow: 0 10px 24px rgba(0,0,0,0.25);
    transition: all 0.3s ease;
}

.login-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 14px 30px rgba(0,0,0,0.35);
}


        /* =========================
           MAIN LAYOUT
        ========================= */
           main {
            padding-top: calc(var(--header-height) + 30px);
            height: calc(100% - var(--footer-height));
            padding-left: 30px;
            padding-right: 30px;
            padding-bottom: 30px;
            display: flex;
            background-color: var(--bg-color);
        }

        .layout-grid {
            display: flex;
            width: 100%;
            height: 100%;
            gap: 30px;
        }

        .stages-left {
            flex: 1.4;
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            grid-template-rows: repeat(2, 1fr);
            gap: 30px;
        }

        .stage-right {
            flex: 1;
        }

        /* =========================
           STAGE CARD
        ========================= */
        .stage {
            position: relative;
            width: 100%;
            height: 100%;
            border-radius: 20px;
            overflow: hidden;
            background: #fff;
            box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.08);
            border: 1px solid rgba(15, 23, 42, 0.08);
            cursor: pointer;
            transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease, border-color 0.4s ease;
        }

        .stage:hover {
            transform: translateY(-10px);
            box-shadow: 0 30px 60px -15px rgba(0, 0, 0, 0.12);
            border-color: var(--accent);
        }

        .stage-img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            filter: saturate(1.1) brightness(1.02);
            transition: transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }
   /*       .stage-img  .des{
             width: 100% !important;
            height: 90% !important;
            object-fit: image !important;
            filter: saturate(1.1) brightness(1.02) !important;
            transition: transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) !important;
         
         }
 */
        .stage:hover .stage-img {
            transform: scale(1.08);
        }

        .content {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            padding: 30px;
            background: linear-gradient(transparent, rgba(255, 255, 255, 0.98) 75%);
            color: var(--accent);
        }

        .content span {
            display: block;
            font-size: 12px;
            font-weight: 800;
            letter-spacing: 4px;
           /*  text-transform: uppercase; */
            margin-bottom: 8px;
        color: #1e2d6b; 
        }

        .stage h3 {
            font-size: 24px;
            font-weight: 900;
         /*    text-transform: uppercase; */
            letter-spacing: 2px;
            
             color: #1e2d6b;
        }

        .stage-right .stage h3 {
            font-size: 24px;
            letter-spacing: 4px;
        }

        /* =========================
           FOOTER
        ========================= */
        footer {
            height: var(--footer-height);
            display: flex;
            align-items: center;
            justify-content: center;
            background: #313131;
            border-top: 1px solid rgba(15, 23, 42, 0.08);
            font-size: 14px;
            letter-spacing: 3px;
            color: #fff;
            font-weight: 500;
            z-index: 100;
           
        }

        /* =========================
           RESPONSIVE
        ========================= */
        @media (max-width: 1280px) {
            .stage-right .stage h3 { font-size: 36px; }
            .stage h3 { font-size: 20px; }
        }

        @media (max-width: 1024px) {
            .layout-grid { flex-direction: column; overflow-y: auto; }
            main { height: auto; overflow-y: auto; padding-top: calc(var(--header-height) + 30px); }
            .stages-left { grid-template-columns: 1fr; flex: none; gap: 20px; }
            .stage { height: 400px; }
            .stage-right { height: 500px; flex: none; }
            body { overflow: auto; }
        }






        .logo_img{
	display: flex;
  flex-direction: row;
  justify-content:flex-start;
        }
	
    </style>
</head>

<body>
<header>
    <div class="header-logo"><img src="img/logo/jssl_logo_transparent.png" alt="JSSL"></div>
    <h1>JSSL INTRANET SYSTEM</h1>
    <button type="button" class="login-btn"
        onclick="window.location.href='newlogin'">
    Login
</button> 

<%-- <button type="button" class="login-btn"
        onclick="window.location.href='${pageContext.request.contextPath}/newlogin'">
    Login
</button> --%>
</header>

<main>
    <div class="layout-grid">
        <div class="stages-left">
            <div class="stage">
                <img src="img/home_images/final_design3.png" class="stage-img des" alt="Phase 01">
                <div class="content"><span>Phase 01</span><h3>Design</h3></div>
            </div>
            <div class="stage">
                <img src="img/home_images/2.jpg" class="stage-img" alt="Phase 02">
                <div class="content"><span>Phase 02</span><h3>Fabrication</h3></div>
            </div>
            <div class="stage">
                <img src="img/home_images/8.jpg" class="stage-img" alt="Phase 03">
                <div class="content"><span>Phase 03</span><h3>Dispatch</h3></div>
            </div>
            <div class="stage">
                <img src="img/home_images/errection.jpg" class="stage-img" alt="Phase 04">
                <div class="content"><span>Phase 04</span><h3>Erection</h3></div>
            </div>
        </div>
        <div class="stage-right">
            <div class="stage">
                <img src="img/home_images/final_Building1.png" class="stage-img" alt="Phase 05">
                <div class="content"><span>Phase 05</span><h3>Final Building</h3></div>
            </div>
        </div>
    </div>
</main>

<footer>&copy; 2026 . JSW Severfield Structures Limited, All Rights Reserved.</footer>
</body>
</html>