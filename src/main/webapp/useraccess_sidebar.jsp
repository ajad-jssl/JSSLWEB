<ul class="navbar-nav sidebar sidebar-light accordion" id="accordionSidebar">
  <!-- Logo -->
  <a class="sidebar-brand d-flex align-items-center justify-content-center mb-3 mt-3" href="useraccess_Dashboard.jsp" style="background-color: white;">
    <div class="sidebar-brand-icon">
      <img src="img/logo/download.png" style="max-height: 4.3rem;">
    </div>
    <div class="sidebar-brand-text mx-3" id="dash"></div>
  </a>

  <hr class="sidebar-divider my-0">

  <li class="nav-item active">
    <a class="nav-link" href="useraccess_Dashboard.jsp">
      <i class="fas fa-home"></i>
      <span>Dashboard</span>
    </a>
  </li>

  <hr class="sidebar-divider">
</ul>

<script>
if (!window.sidebarInitialized) {
  window.sidebarInitialized = true;

  $(document).ready(function () {
    const userId = sessionStorage.getItem("user_id");
    const moduleName = sessionStorage.getItem("selectedModule");

    console.log("Sidebar: userId =", userId, ", moduleName =", moduleName);

    if (!userId || !moduleName) {
      console.warn("Missing user_id or selectedModule in storage");
      renderNoAccess();
      return;
    }

    const url = new URL("/api/user-permissions-module-details", baseUrl1);
    url.searchParams.append("userId", userId);
    url.searchParams.append("moduleName", moduleName);

    console.log("Sidebar: Fetching permissions from URL:", url.toString());

    fetch(url, { credentials: "include" })
      .then(res => res.json())
      .then(data => {
		let pages={};
        console.log("Sidebar: API data received:", data);
        if (!Array.isArray(data) || data.length === 0) {
          renderNoAccess();
          return;
        }
        if (data[0]?.moduleId) {
            localStorage.setItem("selectedModuleId", data[0].moduleId);
            console.log("Module ID stored in localStorage:", data[0].moduleId);
          }
        const uniquePages = [...new Set(
          data.map(item => (item.pageUrl || "").trim())
              .filter(pageUrl => pageUrl.length > 0)
        )];

        console.log("Sidebar: Unique pages:", uniquePages);
        const filteredPages = uniquePages.filter(pageUrl => pageUrl.length > 0);

        console.log("Unique pages after filter:", filteredPages);
        renderSidebarLinks(data);
      })
      .catch(err => {
        console.error("Sidebar fetch error:", err);
        renderNoAccess();
      });
  });
  function renderSidebarLinks(pages) {

	  if (!Array.isArray(pages)) {
	    console.warn("Invalid input, expected array:", pages);
	    return;
	  }

	  console.log("Rendering pages:", pages);

	  const sidebarUl = document.getElementById("accordionSidebar");
	  if (!sidebarUl) return;

	  // Remove old dynamic menu items
	  [...sidebarUl.querySelectorAll('li.dynamic-menu-item')]
	    .forEach(el => el.remove());

	  // Add heading
	  const heading = document.createElement("li");
	  heading.className = "sidebar-heading dynamic-menu-item";
	  heading.textContent = "Features";
	  sidebarUl.appendChild(heading);

	  // Remove duplicate pageUrls
	  const uniquePages = [
	    ...new Map(
	      pages.map(item => [item.pageUrl, item])
	    ).values()
	  ];

	  uniquePages.forEach(item => {

	    const pageUrl = item.pageUrl;
	    const displayName = item.displayName;

	    const li = document.createElement("li");
	    li.className = "nav-item dynamic-menu-item";

	    const a = document.createElement("a");
	    a.className = "nav-link";
	    a.href = pageUrl; // navigation still uses pageUrl

	    const icon = document.createElement("i");
	    icon.className = "fas fa-user-cog";
	    icon.style.color = "#007bff";

	    const span = document.createElement("span");
	    span.textContent = displayName; // display only displayName

	    a.appendChild(icon);
	    a.appendChild(span);

	    li.appendChild(a);

	    sidebarUl.appendChild(li);
	  });
	}

    function renderNoAccess() {
      const sidebarUl = document.getElementById("accordionSidebar");
      if (!sidebarUl) return;

      [...sidebarUl.querySelectorAll('li.dynamic-menu-item, li.sidebar-heading.dynamic-menu-item')].forEach(el => el.remove());

      const li = document.createElement("li");
      li.className = "nav-item dynamic-menu-item";
      li.innerHTML = `<span class="nav-link text-muted">No Access</span>`;
      sidebarUl.appendChild(li);
    }

    function generateLabel(url) {
    	  if (typeof url !== 'string' || url.trim() === '') return '';

    	  const fileName = url.trim().split('/').pop().split('.')[0];
    	  if (!fileName) return '';

    	  return fileName
    	    .replace(/([A-Z])/g, ' $1')
    	    .replace(/^./, str => str.toUpperCase())
    	    .trim();
    	}



}
</script>
