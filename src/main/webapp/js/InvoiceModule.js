 document.addEventListener('DOMContentLoaded', () => {
	/*  TabPermission();*/
	  loadPermissions();
    const urlParams = new URLSearchParams(window.location.search);
    const tab = urlParams.get('tab'); // Example: "advance", "debitcredit", etc.

    // Default tab if 'tab' parameter is not specified
    /*const defaultTab = 'advance';*/

    // Map tab names to IDs
    const tabMapping = {
      advance: 'advance-tab',
      debitcredit: 'debitcredit-tab',
      deliverychallan: 'deliverychallan-tab',
      consolidated: 'consolidated-tab',
      Other: 'Other-tab',
    };

    const contentMapping = {
      advance: '#advance',
      debitcredit: '#debitcredit',
      deliverychallan: '#deliverychallan',
      consolidated: '#consolidated',
      Other: '#Other',
    };

    const tabId = tabMapping[tab] || tabMapping[defaultTab];
    const contentId = contentMapping[tab] || contentMapping[defaultTab];

    // Activate the tab from the URL
    if (tabId && contentId) {
      document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
      document.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('show', 'active'));

      const activeTab = document.getElementById(tabId);
      const activeContent = document.querySelector(contentId);

      if (activeTab) activeTab.classList.add('active');
      if (activeContent) activeContent.classList.add('show', 'active');
    }

    // Listen for tab clicks to update the URL
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', (event) => {
        const newTab = event.target.id.replace('-tab', '');
        const newUrl = new URL(window.location.href);
        newUrl.searchParams.set('tab', newTab);
        window.history.replaceState(null, '', newUrl); // Update the URL without reloading
      });
    });
  });
  
  
  
  /*function TabPermission() {
	    const userId = sessionStorage.getItem("user_id");
alert("user isd ",userId);
	    if (!userId) {
	        console.error("❌ userId is NULL or EMPTY");
	        return;
	    }

	    const finalUrl = `
	    	http://localhost:8004/api/user-tab-permissions/invoceModule?userId=${userId}&moduleId=1&pageId=2`;

	    fetch(finalUrl, { credentials: "include" })
	    .then(res => res.json())
	    .then(data => {

	        // data = ["advance","scrap","debitcredit","deliverychallan","steel"]
	        const allowedTabs = data.map(tab => tab.toLowerCase());

	        // Step 1: Hide ALL nav-items and tab-panes
	        document.querySelectorAll("#myTab .nav-item").forEach(item => {
	            item.style.display = "none";
	        });
	        document.querySelectorAll(".tab-pane").forEach(pane => {
	            pane.classList.remove("show", "active");
	            pane.style.removeProperty("display"); // ✅ remove inline style, let Bootstrap handle it
	        });

	        // Step 2: Show only allowed tabs
	        allowedTabs.forEach(tabName => {
	            // Try exact match first, then case-insensitive fallback
	            let tabLink = document.getElementById(`${tabName}-tab`);
	            let tabContent = document.getElementById(tabName);

	            // Fallback: case-insensitive search in case backend sends "other" but HTML has "Other"
	            if (!tabLink) {
	                document.querySelectorAll("#myTab .nav-link").forEach(link => {
	                    if (link.id.toLowerCase() === `${tabName}-tab`) {
	                        tabLink = link;
	                        tabContent = document.getElementById(link.getAttribute("href").replace("#", ""));
	                    }
	                });
	            }

	            if (tabLink) {
	                tabLink.closest(".nav-item").style.display = "block";
	            }
	            if (tabContent) {
	                tabContent.style.removeProperty("display"); // ✅ don't set display:block manually
	            }
	        });

	        // Step 3: Activate the first allowed tab
	        if (allowedTabs.length > 0) {
	            let firstTabLink = document.getElementById(`${allowedTabs[0]}-tab`);

	            // Fallback case-insensitive
	            if (!firstTabLink) {
	                document.querySelectorAll("#myTab .nav-link").forEach(link => {
	                    if (!firstTabLink && link.id.toLowerCase() === `${allowedTabs[0]}-tab`) {
	                        firstTabLink = link;
	                    }
	                });
	            }

	            if (firstTabLink) {
	                // Use Bootstrap's tab API to activate properly
	                const bsTab = new bootstrap.Tab(firstTabLink);
	                bsTab.show(); // ✅ Bootstrap handles show/active/display correctly
	            }
	        }
	    })
	    .catch(err => console.error("Error fetching tab permissions:", err));
	}*/
	
	
	function loadPermissions() {
	    const userId = sessionStorage.getItem("user_id");

	    fetch(`${baseUrl}/api/user-tab-pages-grouped?userId=${userId}`, {
	        method: "GET",
	        credentials: "include"
	    })
	    .then(res => res.json())
	    .then(data => {

	        //  RESET UI PROPERLY
	        document.querySelectorAll("#myTab .nav-item").forEach(t => t.style.display = "none");

	        document.querySelectorAll(".tab-pane").forEach(p => {
	            p.classList.remove("show", "active");
	        });

	        document.querySelectorAll("[data-page]").forEach(c => {
	            c.style.display = "none";
	        });

	        //  APPLY PERMISSIONS
	        data.forEach(tabObj => {

	            const tabName = tabObj.tabName.toLowerCase();

	            let tabLink = document.getElementById(`${tabName}-tab`);
	            let tabContent = document.getElementById(tabName);

	            // fallback for case mismatch
	            if (!tabLink) {
	                document.querySelectorAll("#myTab .nav-link").forEach(link => {
	                    if (link.id.toLowerCase() === `${tabName}-tab`) {
	                        tabLink = link;
	                        tabContent = document.getElementById(link.getAttribute("href").replace("#", ""));
	                    }
	                });
	            }

	            //  SHOW TAB
	            if (tabLink) {
	                tabLink.closest(".nav-item").style.display = "block";
	            }

	            //  DO NOT use display block for tab-pane
	            if (tabContent) {
	                tabContent.classList.remove("show", "active");
	            }

	            //  SHOW PAGES
	            tabObj.pages.forEach(page => {
	                const card = document.querySelector(`[data-page='${page.pageName}']`);
	                if (card) {
	                    card.style.display = "block";
	                }
	            });
	        });

	        //  ACTIVATE FIRST TAB PROPERLY
	        const firstTab = document.querySelector("#myTab .nav-item[style*='block'] .nav-link");

	        if (firstTab) {
	            new bootstrap.Tab(firstTab).show();
	        }
	    })
	    .catch(err => console.error("Error:", err));
	}