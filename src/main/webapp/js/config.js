

/*const baseUrl = 'https://jims.jssl.in';
const baseUrl1 = 'https://jims.jssl.in';*/




const baseUrl = 'http://localhost:8004';
const baseUrl1 = 'http://localhost:8004';

/*(function () {
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

})();*/



(function () {
  const API_ORIGIN = new URL(baseUrl).origin;
  const LOGIN_PAGE = 'newlogin';
  let loggingOut = false;   // prevents a redirect loop

  function isApiUrl(u) {
    try { return new URL(u, location.href).origin === API_ORIGIN; }
    catch (e) { return false; }
  }

  // Common handler: show message, clear the browser, go to login
  function forceLogout(message) {
    if (loggingOut) return;
    loggingOut = true;
    if (message) alert(message);
    sessionStorage.clear();
    location.href = LOGIN_PAGE;
  }

  $('#sidebarToggleTop').click(function () {
    $('#accordionSidebar').toggleClass('toggled');
  });

  // ---------- fetch wrapper ----------
  const originalFetch = window.fetch.bind(window);

  window.fetch = function (input, init = {}) {
    const rawUrl = (typeof input === 'string' || input instanceof URL) ? input : input.url;

    if (!isApiUrl(rawUrl)) {
      return originalFetch(input, init);
    }

    const headers = new Headers(init.headers || (input instanceof Request ? input.headers : undefined));
    const sid = sessionStorage.getItem('session_id');
    const uid = sessionStorage.getItem('username');
    if (sid) headers.set('X-Session-Id', sid);
    if (uid) headers.set('X-User-Id', uid);

    init = { ...init, headers, credentials: init.credentials || 'include' };

    return originalFetch(input, init).then(async (res) => {
      if (res.status === 403) {
        const body = await res.clone().json().catch(() => ({}));
        if (body.code === 'USER_MISMATCH') {
          forceLogout('You are not able to get the record');
        }
      }
      return res;
    });
  };

  // ---------- jQuery ajax ----------
  function attachAjaxHandlers() {
    if (!(window.$ && $.ajaxPrefilter)) return;

    $.ajaxPrefilter(function (options, originalOptions, jqXHR) {
      if (!isApiUrl(options.url)) return;

      const sid = sessionStorage.getItem('session_id');
      const uid = sessionStorage.getItem('username');
      if (sid) jqXHR.setRequestHeader('X-Session-Id', sid);
      if (uid) jqXHR.setRequestHeader('X-User-Id', uid);

      options.xhrFields = options.xhrFields || {};
      options.xhrFields.withCredentials = true;
    });

    $(document).ajaxError(function (e, xhr) {
      if (xhr.status === 403 && xhr.responseJSON && xhr.responseJSON.code === 'USER_MISMATCH') {
        forceLogout('You are not able to get the record');
      }
    });
  }

  if (window.$ && $.ajaxPrefilter) attachAjaxHandlers();
  else document.addEventListener('DOMContentLoaded', attachAjaxHandlers);

  // ---------- trusted identity from the server ----------
  window.loadCurrentUser = async function () {
    const res = await fetch(new URL('/api/me', baseUrl));
    if (!res.ok) {
      forceLogout();
      throw new Error('Not authenticated');
    }
    return res.json();   // { userId: "AJAD" } coming from the token
  };
})();