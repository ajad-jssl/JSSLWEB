function logoutUser(event) {
    if (event && event.preventDefault) {
        event.preventDefault();
    }
    const user_id = sessionStorage.getItem("user_id");
    if (!user_id) {
        clearAndRedirect();
        return;
    }
    $.ajax({
        url: baseUrl + "/jssl/user/userlogout",
        type: "POST",
        xhrFields: {
            withCredentials: true
        },
        headers: {
            "X-Session-Id": sessionStorage.getItem("session_id") || ""
        },
        data: {
            user_id: user_id,
            session_id: sessionStorage.getItem("session_id") || ""
        },
        complete: function () {
            clearAndRedirect();
        }
    });
    function clearAndRedirect() {
        sessionStorage.clear();
        localStorage.clear();
        window.location.href = "newlogin";
    }
}

var sessionTimeoutMs = 10 * 60 * 1000; // 10 minutes
var warningTimeMs    =  9 * 60 * 1000; //  9 minutes
var timeoutTimer;
var warningTimer;
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

function resetIdleTimer(event) {
    warningDiv.style.display = "none";
    clearTimeout(timeoutTimer);
    clearTimeout(warningTimer);
    warningTimer = setTimeout(function() {
        warningDiv.style.display = "block";
    }, warningTimeMs);
    timeoutTimer = setTimeout(function() {
        warningDiv.style.display = "none";
        if (typeof logoutUser === "function") {
            logoutUser({ preventDefault: function() {} });
        } else {
            console.warn("logoutUser not found — manual redirect");
            var uid = sessionStorage.getItem("user_id");
            var sid = sessionStorage.getItem("session_id");
            if (uid && typeof baseUrl !== "undefined" && baseUrl) {
                var formData = new FormData();
                formData.append("user_id", uid);
                formData.append("session_id", sid || "");
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

window.addEventListener("load", function() {
    resetIdleTimer();
});
document.addEventListener("mousemove", resetIdleTimer);
document.addEventListener("keypress",  resetIdleTimer);
document.addEventListener("click",     resetIdleTimer);
document.addEventListener("scroll",    resetIdleTimer);
document.addEventListener("keydown",   resetIdleTimer);