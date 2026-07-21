// Define modifiedById after ensuring user_id is retrieved
/*const modifiedById = user_id?.trim() || '1';*/
const modifiedById = sessionStorage.getItem("id")?.trim() || '1';
// Modify the global jQuery AJAX settings to automatically add `created_by` to all requests
/*$.ajaxSetup({
  beforeSend: function (xhr, settings) {
    // Check if the request is not a cross-origin request
    if (settings.url.indexOf(baseUrl) === 0) {
      // Add `created_by` parameter to query strings or headers based on API requirements
      if (settings.url.indexOf('?') === -1) {
        settings.url += `?created_by=${modifiedById}`;
      } else {
        settings.url += `&created_by=${modifiedById}`;
      }
    }
  }
});*/