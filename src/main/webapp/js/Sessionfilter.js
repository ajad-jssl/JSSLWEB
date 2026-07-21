/*console.log("Idle script loaded on page:", window.location.pathname);

var sessionTimeoutMs = 10 * 60 * 1000;  // 10 minutes
var warningTimeMs = 9 * 60 * 1000;   

var timeoutTimer;
var warningTimer;

var warningDiv = document.createElement("div");
warningDiv.id = "sessionWarning";
warningDiv.style.display = "none";
warningDiv.style.position = "fixed";
warningDiv.style.top = "20px";
warningDiv.style.left = "50%";
warningDiv.style.transform = "translateX(-50%)";
warningDiv.style.background = "#ffcc00";
warningDiv.style.padding = "15px";
warningDiv.style.borderRadius = "5px";
warningDiv.style.boxShadow = "0 0 10px #000";
warningDiv.style.zIndex = "9999";
warningDiv.innerText = "Your session will expire in 1 Minutes";

document.body.appendChild(warningDiv);

function resetIdleTimer(event) {

    console.log("User activity detected:", event ? event.type : "initial load");

    warningDiv.style.display = "none";

    clearTimeout(timeoutTimer);
    clearTimeout(warningTimer);

    warningTimer = setTimeout(function() {
        console.log("Warning timer triggered");
        warningDiv.style.display = "block";
    }, warningTimeMs);

    timeoutTimer = setTimeout(function() {
        console.log("Logout triggered after idle");
        if (typeof logoutUser === "function") {
            logoutUser({ preventDefault: function() {} });
        } else {
            console.error("logoutUser function NOT found!");
        }
    }, sessionTimeoutMs);
}

window.addEventListener("load", function() {
    console.log("Window fully loaded");
    resetIdleTimer();
});

document.addEventListener("mousemove", resetIdleTimer);
document.addEventListener("keypress", resetIdleTimer);
document.addEventListener("click", resetIdleTimer);
document.addEventListener("scroll", resetIdleTimer);
document.addEventListener("keydown", resetIdleTimer);*/





console.log("Session filter loaded on page:", window.location.pathname);

// ════════════════════════════════════════════════════
// SESSION GUARD — runs immediately on page load
// Calls checkSession API to verify JWT cookie
// ════════════════════════════════════════════════════
/*(function sessionGuard() {

    // ── Public pages — skip check ─────────────────────
    var publicPages = [
        "newlogin",
        "forgotpass",
        "reset",
        "otpvalidation",
        "verifyotp",
		"Landingpage"
    ];

    var currentPage = window.location.pathname
                           .split("/")
                           .filter(Boolean)
                           .pop() || "";

    for (var i = 0; i < publicPages.length; i++) {
        if (currentPage.toLowerCase()
                       .indexOf(publicPages[i].toLowerCase()) !== -1) {
            console.log("Public page — skipping session guard:", currentPage);
            return;
        }
    }

    // ── Step 1: Quick check sessionStorage ───────────
    var userId     = sessionStorage.getItem("user_id");
    var isLoggedIn = sessionStorage.getItem("isLoggedIn");

    if (!userId || isLoggedIn !== "true") {
        console.warn("sessionStorage empty → redirecting to login");
        sessionStorage.clear();
        localStorage.clear();
        window.location.href = "newlogin";
        return;
    }

    // ── Step 2: Verify with backend ───────────────────
    // Calls checkSession which checks JWT cookie
    // Your interceptor also auto-refreshes access token
    // if refresh token is still valid
    if (typeof baseUrl !== "undefined" && baseUrl) {

        console.log("Calling checkSession for user:", userId);

        fetch(baseUrl + "/jssl/user/checkSession", {
            method:      "GET",
            credentials: "include"  // sends JWT cookie automatically
        })
        .then(function(res) {
            console.log("checkSession HTTP status:", res.status);

            // 401 — both tokens expired — must login
            if (res.status === 401) {
                console.warn("401 from checkSession → session expired");
                sessionStorage.clear();
                localStorage.clear();
                window.location.href = "newlogin";
                return null;
            }
            return res.json();
        })
        .then(function(data) {
            if (!data) return; // already redirected

            console.log("checkSession response:", data);

            if (data.status === "yes") {
                // Session valid — stay on page
                console.log("Session valid for user:", data.user_id);

            } else {
                // Session invalid — redirect to login
                console.warn("Session invalid:", data.message);
                sessionStorage.clear();
                localStorage.clear();
                window.location.href = "newlogin";
            }
        })
        .catch(function(err) {
            // Network error — do not redirect
            // Let user continue, interceptor will catch invalid calls
            console.error("checkSession network error:", err);
        });

    } else {
        console.warn("baseUrl not defined — skipping backend check");
    }

})();
*/
// ════════════════════════════════════════════════════
// IDLE TIMEOUT — auto logout after inactivity
// ════════════════════════════════════════════════════

var sessionTimeoutMs = 10 * 60 * 1000; // 10 minutes
var warningTimeMs    =  9 * 60 * 1000; //  9 minutes

var timeoutTimer;
var warningTimer;

// ── Warning banner ────────────────────────────────────
var warningDiv        = document.createElement("div");
warningDiv.id         = "sessionWarning";
warningDiv.style.cssText = [
    "display:none",
    "position:fixed",
    "top:20px",
    "left:50%",
    "transform:translateX(-50%)",
    "background:#ffcc00",
    "padding:15px 25px",
    "border-radius:5px",
    "box-shadow:0 0 10px #000",
    "z-index:9999",
    "font-weight:bold",
    "font-size:14px",
    "text-align:center"
].join(";");
warningDiv.innerText = " Your session will expire in 1 minute due to inactivity.";
document.body.appendChild(warningDiv);

// ── Reset idle timer on any user activity ─────────────
function resetIdleTimer(event) {
/*    console.log("User activity detected:",
        event ? event.type : "initial load");*/

    // Hide warning if showing
    warningDiv.style.display = "none";

    clearTimeout(timeoutTimer);
    clearTimeout(warningTimer);

    // Show warning at 9 minutes
    warningTimer = setTimeout(function() {
     /*   console.log("Warning timer triggered — 1 min left");*/
        warningDiv.style.display = "block";
    }, warningTimeMs);

    // Auto logout at 10 minutes
    timeoutTimer = setTimeout(function() {
     /*   console.log("Idle timeout — logging out");*/
        warningDiv.style.display = "none";

        if (typeof logoutUser === "function") {
            // Use existing logout function
            logoutUser({ preventDefault: function() {} });
        } else {
            // Fallback if logoutUser not loaded
            console.warn("logoutUser not found — manual redirect");
            var uid = sessionStorage.getItem("user_id");
            if (uid && typeof baseUrl !== "undefined" && baseUrl) {
                var formData = new FormData();
                formData.append("user_id", uid);
                navigator.sendBeacon(
                    baseUrl + "/jssl/user/userlogout",
                    formData
                );
            }
            sessionStorage.clear();
            localStorage.clear();
            window.location.href = "newlogin";
        }
    }, sessionTimeoutMs);
}

// ── Start timer when page fully loads ─────────────────
window.addEventListener("load", function() {
   /* console.log("Window loaded — idle timer started");*/
    resetIdleTimer();
});

// ── Reset on any user interaction ─────────────────────
document.addEventListener("mousemove", resetIdleTimer);
document.addEventListener("keypress",  resetIdleTimer);
document.addEventListener("click",     resetIdleTimer);
document.addEventListener("scroll",    resetIdleTimer);
document.addEventListener("keydown",   resetIdleTimer);


$(document).ready(function () {
/*
    const userId = sessionStorage.getItem("user_id");

    if (userId) {
        startHeartbeat();
    }*/

}); 



/*let heartbeatInterval;

function startHeartbeat() {

  

    heartbeatInterval = setInterval(function () {

        const userId = sessionStorage.getItem("username");

        if (!userId) return;

        $.ajax({
            url: baseUrl + "/jssl/heartbeat",
            type: "POST",
            data: { user_id: userId },
            xhrFields: { withCredentials: true },
            success: function () {
                console.log("Heartbeat sent");
            },
            error: function () {
                console.warn("Heartbeat failed");
            }
        });

    }, 2*60*1000);
}
*/