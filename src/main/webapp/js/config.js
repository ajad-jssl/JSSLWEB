

const baseUrl = 'https://jims.jssl.in';
const baseUrl1 = 'https://jims.jssl.in';







(function () {
	$('#sidebarToggleTop').click(function () {
		     $('#accordionSidebar').toggleClass('toggled');
		 });

  
    const originalFetch = window.fetch;

    window.fetch = function (url, options = {}) {
        const sessionId = sessionStorage.getItem("session_id");

        options.headers = {
            ...options.headers,
            ...(sessionId ? { "X-Session-Id": sessionId } : {})
        };
        options.credentials = options.credentials || "include";

        return originalFetch(url, options);
    };

  
    function attachAjaxPrefilter() {
        if (window.$ && $.ajaxPrefilter) {
            $.ajaxPrefilter(function (options, originalOptions, jqXHR) {
                const sessionId = sessionStorage.getItem("session_id");
                if (sessionId) {
                    jqXHR.setRequestHeader("X-Session-Id", sessionId);
                }
                options.xhrFields = options.xhrFields || {};
                options.xhrFields.withCredentials = true;
            });
        }
    }

    if (window.$ && $.ajaxPrefilter) {
        attachAjaxPrefilter();
    } else {
       
        document.addEventListener("DOMContentLoaded", attachAjaxPrefilter);
    }

})();