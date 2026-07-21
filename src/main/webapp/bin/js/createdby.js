// Set the global created_by ID (e.g., from a session or logged-in user)
/*const createdById = user_id?.trim() || '1';*/
const createdById = sessionStorage.getItem("id")?.trim() || '1';
// Modify the global jQuery AJAX settings to automatically add `created_by` to all requests
/*$.ajaxSetup({
	
  beforeSend: function (xhr, settings) {
    // Check if the request is not a cross-origin request
    if (settings.url.indexOf(baseUrl) === 0) {
      // Add `created_by` parameter to query strings or headers based on API requirements
      if (settings.url.indexOf('?') === -1) {
	
        settings.url += `?created_by=${createdById}`;
      } else {
        settings.url += `&created_by=${createdById}`;
      }
    }
  }
});*/