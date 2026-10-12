






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

