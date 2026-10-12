

(function () {
    const userId = sessionStorage.getItem("user_id");
    const moduleId = localStorage.getItem("selectedModuleId");
    const actionElementMap = window.actionElementMap;

  

    if (!userId || !moduleId || !actionElementMap) {
        console.warn("Permission system not initialized properly.");
        blockAllActions("Missing initialization data");
        return;
    }

    const apiUrl = new URL(`/api/user-action-permissions?userId=${userId}&moduleId=${moduleId}`, baseUrl1);

  fetch(apiUrl, { credentials: "include" })
        .then(res => res.json())
        .then(actions => {
            if (!Array.isArray(actions)) {
                console.error("Unexpected response from permission API:", actions);
                blockAllActions("Invalid permissions format");
                return;
            }
			window.allowedActions = actions;
            // First, disable all mapped buttons
     /*       blockAllActions("Resetting before applying allowed actions");*/

            if (actions.length === 0) {
                console.warn("No actions returned — user has no access");
                return; // Keep everything disabled
            }

/*            // Enable buttons for allowed actions
            actions.forEach(action => {
                const elId = actionElementMap[action];
                const el = document.getElementById(elId);
                if (el) el.disabled = false;
            });*/
			actions.forEach(action => {
			  const elId = actionElementMap[action];
			  const el = document.getElementById(elId);
			  if (el) {
			    // For buttons or form elements
			    if ('disabled' in el) {
			      el.disabled = false;
			    } else {
			      el.classList.remove("disabled-action"); // optional styling
			      el.style.pointerEvents = "auto";
			    }
			  }
			});

        })
        .catch(err => {
            console.error("Error fetching permissions:", err);
            blockAllActions("Error during fetch");
        });

		function blockAllActions(reason = "") {
		
		  Object.values(actionElementMap).forEach(id => {
		    const el = document.getElementById(id);
		    if (el) {
		      if ('disabled' in el) {
		        el.disabled = true;
		      } else {
		        el.onclick = null; // ✅ remove click handler for <i>
		        el.classList.add("disabled-action"); // optional styling
		        el.style.pointerEvents = "none";
		        el.style.opacity = "0.5"; // visual cue it's disabled
		      }
		    }
		  });
		}

})();
