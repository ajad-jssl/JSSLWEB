function forceLogoutAndRedirect() {

    const user_id = sessionStorage.getItem("user_id");
    if (!user_id) {
        sessionStorage.clear();
        window.location.replace("newlogin.jsp");
        return;
    }

    const url = baseUrl.endsWith('/')
        ? baseUrl + 'jssl/user/userlogout'
        : baseUrl + '/jssl/user/userlogout';

    $.ajax({
        url: url,
        type: 'POST',
        xhrFields: { withCredentials: true },
        data: $.param({ user_id: user_id }),
        contentType: 'application/x-www-form-urlencoded',
        dataType: 'json',
        cache: false,

        success: function (data) {
            console.log("Forced logout:", data);

            // Cleanup after backend confirms logout
            sessionStorage.clear();
            localStorage.removeItem("selectedFactoryId");

            window.location.replace("newlogin.jsp");
        },

        error: function (xhr) {
            console.error("Force logout failed:", xhr.responseText);

            // Even if backend fails, block UI access
            sessionStorage.clear();
            window.location.replace("newlogin.jsp");
        }
    });
}
 (function checkPagePermission() {

  const userId = sessionStorage.getItem("user_id");
  const allowedPages = JSON.parse(sessionStorage.getItem("allowedPages"));

  if (!userId || !allowedPages) {
    forceLogoutAndRedirect();
    return;
  }

  // Get current page name
  let currentPage = window.location.pathname.split("/").pop().toLowerCase();

  // Remove .jsp if present
  currentPage = currentPage.replace(".jsp", "");

  const hasAccess = allowedPages.some(page => {
      let normalizedPage = page.toLowerCase().replace(".jsp", "");
      return currentPage === normalizedPage;
  });

  if (!hasAccess) {
    forceLogoutAndRedirect();
  }

})();