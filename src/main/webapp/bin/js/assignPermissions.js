

const MainPage =  window.location.pathname.split("/").pop()+'.jsp';
const UserId = sessionStorage.getItem('username');

let allowedActions = [];

async function loadActions() {
    try {
        const response = await fetch(
            `${baseUrl}/api/page/actions?userId=${encodeURIComponent(UserId)}&pageName=${encodeURIComponent(MainPage)}`,
            {
                method: "GET",
                credentials: "include", // 🔐 send cookies/session
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );

        if (!response.ok) {
            throw new Error("Failed to fetch actions");
        }

        allowedActions = await response.json();
		
		

    } catch (error) {
        console.error("Error:", error);
    }
}






let modulesData = [];

document.addEventListener("DOMContentLoaded", function() {
	loadActions();
    const userDropdown = document.getElementById("userDropdown");
    userDropdown.disabled = true;
   

    // Populate User Dropdown
    fetch(new URL('/api/users', baseUrl1), {
        credentials: "include"
    })
        .then(response => response.json())
        .then(data => {
			jimsUsersCache = data;
            data.forEach(user => {
                const option = document.createElement("option");
                option.value = user.user_id; // Match backend field
                option.textContent = user.username;
                userDropdown.appendChild(option);
            });
        })
        .catch(error => {
            console.error("Error fetching users:", error);
            alert("Failed to load users: " + error.message);
            userDropdown.disabled = false;
        });

    // Fetch modules

    fetch(new URL('/api/modules', baseUrl1), {
        credentials: "include"
    })
        .then(res => res.json())
        .then(modules => {
            modulesData = modules;
            console.log("Modules fetched:", modules);
            const tabList = document.getElementById("moduleTabs");
            const tabContent = document.getElementById("moduleTabContent");

            // Fetch pages for each module
            const pagePromises = modules.map(module =>
                fetch(new URL(`/api/pages?ModuleID=${module.moduleID}`, baseUrl1), {
                    credentials: "include"
                })
                    .then(res => res.json())
                    .then(pages => {
                        console.log(`Pages for module ${module.moduleID} (${module.moduleName}):`, pages);
                        return { module, pages };
                    })
            );

            Promise.all(pagePromises)
                .then(modulePages => {
                    console.log("Total modules processed:", modulePages.length);

                    modulePages.forEach(({ module, pages }, index) => {
                        // Create tab
                        const tabItem = document.createElement("li");
                        tabItem.className = "nav-item";
                        const tabLink = document.createElement("a");
                        tabLink.className = "nav-link" + (index === 0 ? " active" : "");
                        tabLink.id = `module-tab-${module.moduleID}`;
                        tabLink.setAttribute("data-toggle", "tab");
                        tabLink.href = `#module-${module.moduleID}`;
                        tabLink.setAttribute("role", "tab");
                        tabLink.setAttribute("aria-controls", `module-${module.moduleID}`);
                        tabLink.setAttribute("aria-selected", index === 0 ? "true" : "false");
                        tabLink.textContent = module.moduleName;
                        tabLink.addEventListener("click", function() {
                            if (module.moduleName.toUpperCase() === "SUBCON") {
                                loadSubconUsersIntoSameDropdown();
                            } else {
                                // Remove SUBCON users
                                loadJimsUsers();
                            }


                        });
                        tabItem.appendChild(tabLink);
                        tabList.appendChild(tabItem);

                        // Create tab pane
                        const tabPane = document.createElement("div");
                        tabPane.className = "tab-pane fade" + (index === 0 ? " show active" : "");
                        tabPane.id = `module-${module.moduleID}`;
                        tabPane.setAttribute("role", "tabpanel");
                        tabPane.setAttribute("aria-labelledby", `module-tab-${module.moduleID}`);

                        // Add page checkboxes
                        const pageContainer = document.createElement("div");
                        pageContainer.className = "page-checkboxes";

						
                        pages.forEach(page => {

                            const div = document.createElement("div");

                       
							const checkbox = document.createElement("input");
							checkbox.type = "checkbox";
							checkbox.name = `pageIds_${module.moduleID}`;
							checkbox.value = page.pageID;
							checkbox.setAttribute("data-module-id", module.moduleID);

							const label = document.createElement("label");
							label.textContent =page.displayName;
							label.className = "form-check-label ml-2";
							
							const isInvoicePage = page.pageID === 2;

						if (isInvoicePage) {
							    label.style.color = "#000";   // special page (Invoice)
							    label.style.fontWeight = "600";
							} else {
							    label.style.color = "blue";   // all other pages
							} 

							const pageActionContainer = document.createElement("div");
							pageActionContainer.style.marginLeft = "20px";
							pageActionContainer.style.marginTop = "4px";
							pageActionContainer.style.display = "none";
							pageActionContainer.style.flexWrap = "wrap";
							pageActionContainer.style.gap = "6px";
						

							//  FIX: Skip pageID = 2 (Invoice page)
							if (page.pageID !== 2) {
								
							    // Fetch actions
							    fetch(new URL(`/api/page-actions?pageId=${page.pageID}`, baseUrl1), {
							        credentials: "include"
							    })
							    .then(res => res.json())
							    .then(actions => {
							        actions.forEach(action => {
							           createStyledAction(action.actionName, page, module, pageActionContainer);
							        });
							    });

							    // Toggle actions
							    checkbox.addEventListener("change", function () {
							        if (checkbox.checked) {
							            pageActionContainer.style.display = "flex";
							        } else {
							            pageActionContainer.style.display = "none";
							            pageActionContainer
							                .querySelectorAll("input[type='checkbox']")
							                .forEach(cb => cb.checked = false);
							        }
							    });

							    // Append
							    div.appendChild(checkbox);
							    div.appendChild(label);
							    div.appendChild(pageActionContainer);
							} else {
							    // ✅ For pageID = 2 → only checkbox + label (NO actions)
							    div.appendChild(checkbox);
							    div.appendChild(label);
							}
                            // ✅ SHOW ACTIONS BESIDE "New Master" (ONLY for Invoice Module pageID=1)
     

                            pageContainer.appendChild(div);

                            //  SPECIAL CASE → Invoice Module (PageID = 2)
                            //  SPECIAL CASE → Invoice Module (PageID = 2)
							
							
							
                            if (page.pageID === 2) {

                                // Create container BELOW checkbox
                                const subContainer = document.createElement("div");
                                subContainer.style.marginLeft = "40px";
                                subContainer.style.marginTop = "8px";
                                subContainer.style.display = "none"; // hidden initially
                                subContainer.classList.add("invoice-tabs-container");
                                subContainer.style.flexDirection = "column";
                                subContainer.style.gap = "6px";

                                //  Fetch tabs dynamically from TabsMaster
                                fetch(new URL('/api/invoice-tabs', baseUrl1), { credentials: "include" })
                                    .then(res => res.json())
                                    .then(tabsData => {

                                        // Normalize keys to match API response exactly
                                        const cleanedTabs = tabsData.map(t => ({
                                            tabID: t.TabID,    //  capital T, capital I, capital D
                                            tabName: t.TabName   //  capital T, capital N
                                        }));

                                        console.log("Cleaned tabs:", cleanedTabs);

                                        const tabPagePromises = cleanedTabs.map(tabObj =>
                                            fetch(new URL(`/api/invoice-tab-pages?tabID=${tabObj.tabID}`, baseUrl1), {
                                                credentials: "include"
                                            })
                                                .then(res => res.json())
                                                .then(pages => {
                                                    console.log(`Pages for tabID ${tabObj.tabID}:`, pages);
                                                    return { tabObj, pages };
                                                })
                                        );

                                        return Promise.all(tabPagePromises);
                                    })
                                    .then(tabsWithPages => {

                                        tabsWithPages.forEach(({ tabObj, pages }) => {

                                            const tab = tabObj.tabName.toLowerCase();
                                            const tabID = tabObj.tabID;

                                            const subDiv = document.createElement("div");
                                            subDiv.className = "form-check";
                                            subDiv.style.marginBottom = "4px";

                                            const subCheckbox = document.createElement("input");
                                            subCheckbox.setAttribute("data-tab-key", tab);
                                            subCheckbox.type = "checkbox";
                                            subCheckbox.name = `invoiceTabs_${module.moduleID}`;
                                            /* subCheckbox.value = tab;*/
                                            subCheckbox.value = tabID;

                                            subCheckbox.setAttribute("data-module-id", module.moduleID);
                                            subCheckbox.setAttribute("data-tab-id", tabID);

                                            const subLabel = document.createElement("label");
                                            subLabel.textContent = tab.charAt(0).toUpperCase() + tab.slice(1);
                                            subLabel.className = "form-check-label ml-2";
                                            subLabel.style.fontWeight = "600";

                                            subDiv.appendChild(subCheckbox);
                                            subDiv.appendChild(subLabel);

                                            const parentActionRow = document.createElement("div");
                                            parentActionRow.style.marginLeft = "15px";
                                            parentActionRow.style.display = "inline-flex";
                                            parentActionRow.style.alignItems = "center";
                                            parentActionRow.style.flexWrap = "wrap";
                                            parentActionRow.style.gap = "0px";
                                            parentActionRow.style.border = "1px solid #aaa";
                                            parentActionRow.style.borderRadius = "4px";
                                            parentActionRow.style.padding = "2px 6px";
                                            parentActionRow.style.backgroundColor = "red";
                                            parentActionRow.style.fontSize = "11px";
                                            parentActionRow.style.display = "none";

                                            // ✅ Opening bracket label
                                            const openBracket = document.createElement("span");
                                            openBracket.textContent = "Actions: [";
                                            openBracket.style.color = "#555";
                                            openBracket.style.fontWeight = "600";
                                            openBracket.style.marginRight = "4px";
                                            openBracket.style.fontSize = "11px";
                                            parentActionRow.appendChild(openBracket);

                                            const pagesContainer = document.createElement("div");
                                            pagesContainer.style.marginLeft = "25px";
                                            pagesContainer.style.marginTop = "6px";
                                            pagesContainer.style.display = "none";
                                            pagesContainer.style.flexDirection = "column";
                                            pagesContainer.style.gap = "6px";

                                            //  Build sub-pages using correct API key names
                                            pages.forEach(pageRow => {
                                                const pageName = pageRow.Page_Name.replace(/\.jsp$/, ''); //  Page_Name
                                                const pageRowID = pageRow.page_ID;                         //  page_ID

                                                const subPageDiv = document.createElement("div");
                                                subPageDiv.style.marginBottom = "4px";

                                                const subPageCheckbox = document.createElement("input");
                                                subPageCheckbox.type = "checkbox";
                                                subPageCheckbox.name = `tabSubPages_${module.moduleID}`;
                                                subPageCheckbox.value = `${tab}|${pageName}`;
                                                subPageCheckbox.setAttribute("data-module-id", module.moduleID);
                                                subPageCheckbox.setAttribute("data-page-id", pageRowID);
                                                subPageCheckbox.setAttribute("data-tab-id", tabID);

                                                const subPageLabel = document.createElement("label");
                                                subPageLabel.textContent = pageName.toUpperCase();
                                                subPageLabel.style.fontWeight = "400";
                                                subPageLabel.className = "ml-2";
                                                subPageLabel.style.fontSize = "15px";
                                                subPageLabel.style.color = "blue";

                                                const headerDiv = document.createElement("div");
                                                headerDiv.appendChild(subPageCheckbox);
                                                headerDiv.appendChild(subPageLabel);

                                                const actionContainer = document.createElement("div");
                                                actionContainer.style.marginLeft = "20px";
                                                actionContainer.style.marginTop = "4px";
                                                actionContainer.style.display = "none";
                                                actionContainer.style.flexWrap = "wrap";
                                                actionContainer.style.gap = "4px";
                                                actionContainer.style.padding = "4px 8px";
                                                //actionContainer.style.backgroundColor = "red";
                                                /*actionContainer.style.border = "1px dashed #adb5bd";*/
                                                actionContainer.style.borderRadius = "4px";
                                                actionContainer.setAttribute("data-action-container", "true");

												
                                                //  Page-level label header
                                                const pageLevelLabel = document.createElement("span");
                                                pageLevelLabel.textContent = "";
                                                pageLevelLabel.style.fontSize = "7px";
                                                pageLevelLabel.style.color = "#888";
                                                pageLevelLabel.style.fontWeight = "400";
                                                pageLevelLabel.style.marginRight = "6px";
                                                pageLevelLabel.style.alignSelf = "center";
                                                pageLevelLabel.style.textTransform = "uppercase";
                                                pageLevelLabel.style.letterSpacing = "0.5px";
                                                actionContainer.appendChild(pageLevelLabel);

                                                // ✅ FETCH ACTIONS DYNAMICALLY BASED ON pageId (pageRowID)
                                                fetch(new URL(`/api/tabpage-actions?pageId=${pageRowID}`, baseUrl1), {
                                                    credentials: "include"
                                                })
                                                    .then(res => res.json())
                                                    .then(actionsData => {
                                                        console.log(`Actions for pageId ${pageRowID}:`, actionsData);
                                                        
                                                        // Extract action names from the fetched data
                                                        const actions = actionsData.map(item => item.actionName);
                                                        
                                                        // Create action checkboxes using the fetched actions
                                                        actions.forEach((action, idx) => {
                                                            const actionCheckbox = document.createElement("input");
                                                            actionCheckbox.type = "checkbox";
                                                            actionCheckbox.name = `tabActions_${module.moduleID}`;
                                                            actionCheckbox.value = `${tab}|${pageName}|${action}`;
                                                            actionCheckbox.setAttribute("data-module-id", module.moduleID);
                                                            actionCheckbox.setAttribute("data-tab-id", tabID);        // ✅ store tabID
                                                            actionCheckbox.setAttribute("data-page-id", pageRowID);   // ✅ store tabPageID
                                                            actionCheckbox.setAttribute("data-action", action);        // ✅ store action
                                                            actionCheckbox.style.cursor = "pointer";

                                                            const actionLabel = document.createElement("label");
                                                            actionLabel.textContent = action;
                                                            actionLabel.style.fontSize = "10px";
                                                            actionLabel.style.color = "#495057";
                                                            actionLabel.style.marginBottom = "0";
                                                            actionLabel.style.cursor = "pointer";
                                                            actionLabel.style.marginLeft = "2px";

                                                            //  Each action as a small pill-like badge
                                                            const wrapper = document.createElement("div");

                                                            wrapper.style.display = "flex";              // ✅ column layout
                                                            wrapper.style.alignItems = "center";
                                                            wrapper.style.gap = "6px";
                                                            wrapper.style.padding = "4px 8px";
                                                            wrapper.style.border = "1px solid #ced4da";
                                                            wrapper.style.borderRadius = "6px";          // less pill, more clean row
                                                            wrapper.style.fontSize = "12px";
                                                            wrapper.style.marginBottom = "5px";          // ✅ vertical spacing
                                                            wrapper.style.background = "#f8f9fa";        // optional clean bg

                                                            wrapper.appendChild(actionCheckbox);
                                                            wrapper.appendChild(actionLabel);

                                                            actionContainer.appendChild(wrapper);
                                                        });
                                                    })
                                                    .catch(err => {
                                                        console.error(`Error fetching actions for pageId ${pageRowID}:`, err);
                                                    });


                                                // ✅ Sub-page checkbox → show/hide actions for that page only
                                                subPageCheckbox.addEventListener("change", function() {
                                                    if (subPageCheckbox.checked) {
                                                        actionContainer.style.display = "flex";
                                                    } else {
                                                        actionContainer.style.display = "none";
                                                        actionContainer.querySelectorAll("input[type='checkbox']").forEach(cb => cb.checked = false);
                                                    }
                                                });

                                                subPageDiv.appendChild(headerDiv);
                                                subPageDiv.appendChild(actionContainer);
                                                pagesContainer.appendChild(subPageDiv);
                                            });

                                            //  Parent action checkboxes - ✅ FETCH FROM FIRST PAGE'S ACTIONS
                                            // Get the first page to fetch actions for parent checkboxes
                                            if (pages.length > 0) {
                                                const firstPageId = pages[0].page_ID;
                                                
                                                fetch(new URL(`/api/tabpage-actions?pageId=${firstPageId}`, baseUrl1), {
                                                    credentials: "include"
                                                })
                                                    .then(res => res.json())
                                                    .then(actionsData => {
                                                        console.log(`Parent actions for first page ${firstPageId}:`, actionsData);
                                                        
                                                        const actions = actionsData.map(item => item.actionName);
                                                        
                                                        //  Parent action checkboxes
                                                        actions.forEach((action, idx) => {
                                                            const wrapper = document.createElement("span");
                                                            wrapper.style.display = "inline-flex";
                                                            wrapper.style.alignItems = "center";
                                                            wrapper.style.gap = "3px";
                                                            wrapper.style.padding = "1px 4px";

                                                            const parentCb = document.createElement("input");
                                                            parentCb.type = "checkbox";
                                                            parentCb.name = `tabParentActions_${module.moduleID}`;
                                                            parentCb.value = `${tab}|parent|${action}`;
                                                            parentCb.setAttribute("data-action", action);
                                                            parentCb.setAttribute("data-module-id", module.moduleID);
                                                            parentCb.style.cursor = "pointer";

                                                            const parentLbl = document.createElement("label");
                                                            parentLbl.textContent = action;
                                                            parentLbl.style.fontSize = "11px";
                                                            parentLbl.style.marginBottom = "0";
                                                            parentLbl.style.cursor = "pointer";
                                                            parentLbl.style.color = "#1a3a6b";
                                                            parentLbl.style.fontWeight = "500";

                                                            parentCb.addEventListener("change", function() {
                                                                const isChecked = parentCb.checked;

                                                                pagesContainer.querySelectorAll("input[type='checkbox']").forEach(childCb => {

                                                                    const parts = childCb.value.split("|");

                                                                    // ✅ Only action checkboxes (tab|page|action)
                                                                    if (parts.length === 3 && parts[2] === action) {

                                                                        // 1. Check/uncheck action checkbox
                                                                        childCb.checked = isChecked;

                                                                        // 2. Get corresponding PAGE checkbox (tab|page)
                                                                        const pageKey = `${parts[0]}|${parts[1]}`;

                                                                        const pageCheckbox = pagesContainer.querySelector(
                                                                            `input[value="${pageKey}"]`
                                                                        );

                                                                        if (pageCheckbox) {
                                                                            pageCheckbox.checked = isChecked; // 🔥 CHECK PAGE ALSO
                                                                        }

                                                                        if (isChecked) {
                                                                            // 3. Expand action container
                                                                            const actionCont = childCb.closest("div[data-action-container='true']");
                                                                            if (actionCont) actionCont.style.display = "flex";

                                                                            // 4. Expand whole tab pages container
                                                                            pagesContainer.style.display = "flex";
                                                                        } else {
                                                                            // Optional: collapse action container if unchecked
                                                                            const actionCont = childCb.closest("div[data-action-container='true']");
                                                                            if (actionCont) actionCont.style.display = "none";
                                                                        }
                                                                    }
                                                                });
                                                            });
                                                            wrapper.appendChild(parentCb);
                                                            wrapper.appendChild(parentLbl);

                                                            //  Add pipe separator between actions (not after last)
                                                            if (idx < actions.length - 1) {
                                                                const pipe = document.createElement("span");
                                                                pipe.textContent = "|";
                                                                pipe.style.color = "#aaa";
                                                                pipe.style.marginLeft = "4px";
                                                                pipe.style.fontSize = "11px";
                                                                wrapper.appendChild(pipe);
                                                            }

                                                            parentActionRow.appendChild(wrapper);
                                                        });
                                                    })
                                                    .catch(err => {
                                                        console.error(`Error fetching parent actions for first page ${firstPageId}:`, err);
                                                    });
                                            }

                                            //  Closing bracket
                                            const closeBracket = document.createElement("span");
                                            closeBracket.textContent = "]";
                                            closeBracket.style.color = "#555";
                                            closeBracket.style.fontWeight = "600";
                                            closeBracket.style.marginLeft = "4px";
                                            closeBracket.style.fontSize = "11px";
                                            parentActionRow.appendChild(closeBracket);

                                            subDiv.appendChild(parentActionRow);
                                            subDiv.appendChild(pagesContainer);

                                            //  Toggle pages when tab checkbox clicked
                                            //  Toggle pages when tab checkbox clicked

                                            //  CORRECT ONE — Tab checkbox → show pages AND auto-check + expand all sub-pages
                                            subCheckbox.addEventListener("change", function() {
                                                if (subCheckbox.checked) {

                                                    //  Just show the pages list — don't check or expand anything
                                                    pagesContainer.style.display = "flex";

                                                } else {
                                                    pagesContainer.style.display = "none";

                                                    //  Reset everything when tab unchecked
                                                    pagesContainer.querySelectorAll("input[type='checkbox']").forEach(cb => cb.checked = false);
                                                    pagesContainer.querySelectorAll("div[data-action-container='true']").forEach(ac => {
                                                        ac.style.display = "none";
                                                    });
                                                    parentActionRow.querySelectorAll("input[type='checkbox']").forEach(cb => cb.checked = false);
                                                }
                                            });

                                            subContainer.appendChild(subDiv);
                                        });

                                        //  Toggle subContainer when Invoice page checkbox clicked
                                        checkbox.addEventListener("change", function() {
                                            if (checkbox.checked) {
                                                subContainer.style.display = "flex";
                                            } else {
                                                subContainer.style.display = "none";
                                                subContainer.querySelectorAll("input[type='checkbox']").forEach(cb => cb.checked = false);
                                            }
                                        });

                                    })
                                    .catch(err => console.error("Error loading invoice tabs from DB:", err));

                                //  Add subContainer BELOW the invoice page checkbox
                                pageContainer.appendChild(subContainer);
                            }
                        });

                        // styling
                        pageContainer.style.display = "flex";
                        pageContainer.style.flexDirection = "column";
                        pageContainer.style.gap = "6px";
                        // Add action checkboxes
                       /* const actions = module.moduleID === invoiceModuleId ? ["Insert", "Edit", "Print", "Verify", "Release", "view", "Cancel"] : ["Insert", "Edit", "Cancel", "Verify", "status", "Delete", "Unlock/Lock"];
                        const actionContainer = document.createElement("div");
                        actionContainer.className = "action-checkboxes";
                        actionContainer.innerHTML = "<h6>Module Actions</h6>";*/
                       

                        tabPane.appendChild(pageContainer);
                       /* tabPane.appendChild(actionContainer);*/
                        tabContent.appendChild(tabPane);
                    });
                    userDropdown.disabled = false;
                    if (userDropdown.value) {
                        fetchUserPermissions();
                    }
                })
                .catch(error => {
                    console.error("Error fetching pages:", error);
                    alert("Failed to load pages: " + error.message);
                    userDropdown.disabled = false;
                });
        })
        .catch(error => {
            console.error("Error fetching modules:", error);
            alert("Failed to load modules: " + error.message);
            userDropdown.disabled = false;
        });

    // Handle form submission
    document.getElementById("permissionForm").addEventListener("submit", function(e) {
        e.preventDefault();
        const userDropdown = document.getElementById("userDropdown");
        const selectedUserId = document.getElementById("selectedUserId");
        selectedUserId.value = userDropdown.value;
        const allowed = allowedActions || [];
		console.log("allwed are ",allowed);
        
  if (!allowed.includes("Insert")) {
                  alert(" You do not have permission to Insert.");
                  return;
                }
        savepermission();
    });
});
let oldPagePermissions = [];
//let oldActionPermissions = [];
let oldTabPermissions = [];
let oldPageActionPermissions = [];
let selectedPageActionPermissions = [];

function fetchUserPermissions() {
    const userId = document.getElementById("userDropdown").value;
    if (!userId) {
        document.querySelectorAll(".tick").forEach(tick => {
            tick.style.display = "none";
        });
        document.querySelectorAll("#moduleTabContent input[type='checkbox']").forEach(cb => {
            cb.checked = false;
        });
        return;
    }

    // Log available checkboxes
    const allCheckboxes = document.querySelectorAll("input[name^='pageIds_']");
    console.log("Available page checkboxes:", Array.from(allCheckboxes).map(cb => ({ moduleId: cb.getAttribute("data-module-id"), value: cb.value })));

    // Fetch permissions for all modules
    const moduleIds = modulesData.map(m => m.moduleID);
    const permissionPromises = moduleIds.map(moduleId =>
        fetch(new URL(`/api/user-permissions?userId=${userId}&moduleId=${moduleId}`, baseUrl1), {
            credentials: "include"
        })
            .then(res => res.json())
            .then(pageIds => {
                console.log(`Raw pageIds for module ${moduleId}:`, pageIds);
                return { moduleId, pageIds };
            })
            .catch(error => {
                console.error(`Error fetching permissions for module ${moduleId}:`, error);
                return { moduleId, pageIds: [] };
            })
    );



    const tabPromises = moduleIds.map(moduleId =>
        fetch(new URL(`/api/user-tab-permissions?userId=${userId}&moduleId=${moduleId}&pageId=2`, baseUrl1), {
            credentials: "include"
        })
            .then(res => res.json())
            .then(tabs => ({ moduleId, tabs }))
            .catch(error => {
                console.error(`Error fetching tab permissions for module ${moduleId}:`, error);
                return { moduleId, tabs: [] };
            })
    );
    const tabPageActionPromise = fetch(
        new URL(`/api/user-tab-page-actions?userId=${userId}`, baseUrl1),
        { credentials: "include" }
    )
        .then(res => res.json())
        .then(data => {
            oldTabPageActions = data;
            console.log("Tab Page Actions:", data);
            return data; // ✅🔥 VERY IMPORTANT
        })
        .catch(err => {
            console.error("Error fetching tab page actions:", err);
            oldTabPageActions = [];
            return []; // ✅ ALSO IMPORTANT
        });
		const pageActionPromise = fetch(
		    new URL(`/api/user-page-actions?userId=${userId}`, baseUrl1),
		    { credentials: "include" }
		)
		.then(res => res.json())
		.then(data => {
		    oldPageActionPermissions = data;
		    console.log("Old Page Actions:", data);
		    return data;
		})
		.catch(err => {
		    console.error("Error fetching page actions:", err);
		    oldPageActionPermissions = [];
		    return [];
		});

    Promise.all([Promise.all(permissionPromises), Promise.all(tabPromises), tabPageActionPromise,pageActionPromise])
        .then(([pagePermissions, tabPermissions, tabPageActions,pageActions]) => {
            oldPagePermissions = [];
         
            oldTabPermissions = [];
            console.log("Page Permissions:", pagePermissions);
           // console.log("Action Permissions:", actionPermissions);

            // Reset all checkboxes and ticks
            document.querySelectorAll("#moduleTabContent input[type='checkbox']").forEach(cb => {
                cb.checked = false;
                const tickId = cb.name.startsWith("pageIds_") ? `tick_page_${cb.getAttribute("data-module-id")}_${cb.value}` : `tick_action_${cb.getAttribute("data-module-id")}_${cb.value}`;
                const tick = document.getElementById(tickId);
                if (tick) tick.style.display = "none";
            });

            // Check page permissions
            pagePermissions.forEach(({ moduleId, pageIds }) => {
                pageIds.forEach(pageId => {

                    oldPagePermissions.push({
                        moduleId: moduleId,
                        pageId: pageId
                    });

                    const checkbox = document.querySelector(
                        `input[name="pageIds_${moduleId}"][value="${pageId}"]`
                    );

                    if (checkbox) {
						checkbox.checked = true;

						// ✅ Show action container automatically
						// except Invoice page (pageId = 2)
						if (pageId != 2) {

						    const parentDiv = checkbox.closest("div");

						    if (parentDiv) {

						        // find action container
						        const actionContainer = parentDiv.querySelector("div");

						        if (actionContainer) {
						            actionContainer.style.display = "flex";
						        }
						    }
						}


                        // ✅ IMPORTANT: If Invoice Page (pageId = 2)
                        if (pageId == 2) {
                            const tabPane = document.getElementById(`module-${moduleId}`);

                            const container = tabPane.querySelector(".invoice-tabs-container");

                            if (container) {
                                container.style.display = "flex"; // 🔥 FORCE EXPAND
                            }
                        }
                    }
                });
            });


            console.log("Tab Permissions:", tabPermissions);
            tabPermissions.forEach(({ moduleId, tabs }) => {
                tabs.forEach(tabId => {

                    const pageId = 2;

                    oldTabPermissions.push({
                        moduleId: moduleId,
                        pageId: pageId,
                        tabId: tabId
                    });

                    // ✅ Check the tab checkbox
                    const checkbox = document.querySelector(
                        `input[name="invoiceTabs_${moduleId}"][value="${tabId}"]`
                    );

                    if (checkbox) {
                        checkbox.checked = true;

                        // ✅ 1. Expand invoice-tabs-container
                        const mainContainer = checkbox.closest(".invoice-tabs-container");
                        if (mainContainer) mainContainer.style.display = "flex";

                        // ✅ 2. Ensure Invoice page checkbox is checked
                        const parentPageCheckbox = document.querySelector(
                            `input[name="pageIds_${moduleId}"][value="2"]`
                        );
                        if (parentPageCheckbox) parentPageCheckbox.checked = true;

                        // ✅ 3. Only expand pagesContainer — do NOT auto-check sub-pages or actions
                        const subDiv = checkbox.closest(".form-check");
                        if (subDiv) {
                            const pagesContainer = subDiv.querySelector("div[style*='flex-direction: column']");
                            if (pagesContainer) {
                                pagesContainer.style.display = "flex"; // just show, nothing else
                            }
                        }
                    }
                });
            });

            console.log("OLD PAGE PERMISSIONS:", oldPagePermissions);
            // Check action permissions
/*            actionPermissions.forEach(({ moduleId, actions }) => {
                actions.forEach(action => {
                    oldActionPermissions.push({
                        moduleId: moduleId,
                        action: action
                    });
                    const checkbox = document.querySelector(`input[name="actionPermissions_${moduleId}"][value="${action}"]`);
			
                    if (checkbox) {
                        checkbox.checked = true;
                        const tick = document.getElementById(`tick_action_${moduleId}_${action}`);
                        if (tick) tick.style.display = "inline";
                        else console.warn(`Tick element for action ${action} in module ${moduleId} not found`);
                    } else {
                        console.warn(`Checkbox for action ${action} in module ${moduleId} not found`);
                    }
                });
            });*/


            (tabPageActions || []).forEach(item => {

                // ✅ ACTION checkbox
                const cb = document.querySelector(
                    `input[name^="tabActions_"][data-tab-id="${item.tabId}"][data-page-id="${item.tabPageId}"][data-action="${item.action}"]`
                );

                if (cb) {
                    cb.checked = true;

                    // ✅ ACTION CONTAINER
                    const actionCont = cb.closest("div[data-action-container='true']");
                    if (actionCont) actionCont.style.display = "flex";
                }

                // ✅ SUB PAGE checkbox (🔥 FIXED)
                const subPageCb = document.querySelector(
                    `input[name^="tabSubPages_"][data-tab-id="${item.tabId}"][data-page-id="${item.tabPageId}"]`
                );

                if (subPageCb) {
                    subPageCb.checked = true;

                    // show actions
                    const actionCont = subPageCb.closest("div")?.querySelector("div[data-action-container='true']");
                    if (actionCont) actionCont.style.display = "flex";
                }

                // ✅ TAB checkbox
                const tabCheckbox = document.querySelector(
                    `input[name^="invoiceTabs_"][data-tab-id="${item.tabId}"]`
                );

                if (tabCheckbox) {
                    tabCheckbox.checked = true;

                    const tabContainer = tabCheckbox.closest(".invoice-tabs-container");
                    if (tabContainer) tabContainer.style.display = "flex";
                }

                // ✅ PAGE checkbox (Invoice page = 2)
                const pageCheckbox = document.querySelector(
                    `input[name^="pageIds_"][value="2"]`
                );

                if (pageCheckbox) pageCheckbox.checked = true;

            });
			(pageActions || []).forEach(item => {

			    const cb = document.querySelector(
			        `input[name^="pageActions_"][data-page-id="${item.pageId}"][data-action="${item.action}"]`
			    );

			    if (cb) {
			        cb.checked = true;

			        // show container
			        const container = cb.closest("div").parentElement;
			        if (container) container.style.display = "flex";

			        // also check page checkbox
			        const pageCheckbox = document.querySelector(
			            `input[name="pageIds_${item.moduleId}"][value="${item.pageId}"]`
			        );

			        if (pageCheckbox) pageCheckbox.checked = true;
			    }
			});

        })
        .catch(error => {
            console.error("Error fetching permissions:", error);
            alert("Failed to fetch permissions: " + error.message);
        });
}

let oldTabPageActions = [];
const selectedTabPageActions = [];
function savepermission() {
    const selectedUserId = document.getElementById("userDropdown").value;
   
	const saveBtn = document.getElementById("saveper");
	  saveBtn.disabled = true;
	  saveBtn.textContent = "Saving...";

    let createdby = sessionStorage.getItem('id');

    if (!selectedUserId) {
		
	
        alert("Please select a user.");
		saveBtn.disabled = false;
						       saveBtn.textContent = "Save Permissions";
        return;
    }

    const selectedPermissions = [];
   
    const selectedTabPermissions = [];
    const affectedModuleIds = new Set();

    const moduleTabs = document.querySelectorAll("#moduleTabContent .tab-pane");

    moduleTabs.forEach(tab => {
        const moduleId = parseInt(tab.id.replace("module-", ""));
        affectedModuleIds.add(moduleId);

        const pageCheckboxes = tab.querySelectorAll(`input[name="pageIds_${moduleId}"]:checked`);
  
        pageCheckboxes.forEach(cb => {
            selectedPermissions.push({
                moduleId: moduleId,
                pageId: parseInt(cb.value),
                userId: selectedUserId,
                createdBy: createdby
            });
        });



        const tabCheckboxes = tab.querySelectorAll(`input[name^="invoiceTabs_"]:checked`);

     
        tabCheckboxes.forEach(cb => {
            selectedTabPermissions.push({
                moduleId: moduleId,
                pageId: 2,
                tabId: cb.getAttribute("data-tab-id"), // ✅ USE THIS
                userId: selectedUserId,
                createdBy: createdby
            });
        });
        const tabActionCheckboxes = tab.querySelectorAll(`input[name="tabActions_${moduleId}"]:checked`);

        tabActionCheckboxes.forEach(cb => {
            selectedTabPageActions.push({
                moduleId: moduleId,
                tabId: parseInt(cb.getAttribute("data-tab-id")),
                tabPageId: parseInt(cb.getAttribute("data-page-id")),
                action: cb.getAttribute("data-action"),
                userId: selectedUserId,
                createdBy: createdby
            });
        });
		const pageActionCheckboxes = tab.querySelectorAll(
		    `input[name="pageActions_${moduleId}"]:checked`
		);
		pageActionCheckboxes.forEach(cb => {
		    selectedPageActionPermissions.push({
		        moduleId: moduleId,
		        pageId: parseInt(cb.getAttribute("data-page-id")),
		        action: cb.getAttribute("data-action"),
		        userId: selectedUserId,
		        createdBy: createdby
		    });
		});
    });



    const addedPermissions = selectedPermissions.filter(newPerm =>
        !oldPagePermissions.some(oldPerm =>
            oldPerm.moduleId === newPerm.moduleId &&
            oldPerm.pageId === newPerm.pageId
        )
    );

    const removedPermissions = oldPagePermissions.filter(oldPerm =>
        !selectedPermissions.some(newPerm =>
            newPerm.moduleId === oldPerm.moduleId &&
            newPerm.pageId === oldPerm.pageId
        )
    );


    console.log("the Removed permisnoss", removedPermissions);
    console.log("the selcted  permisnoss", addedPermissions);




    const addedTabs = selectedTabPermissions.filter(newTab =>
        !oldTabPermissions.some(oldTab =>
            oldTab.moduleId === newTab.moduleId &&
            oldTab.pageId === newTab.pageId &&
            oldTab.tabId === newTab.tabId
        )
    );

    const removedTabs = oldTabPermissions.filter(oldTab =>
        !selectedTabPermissions.some(newTab =>
            oldTab.moduleId === newTab.moduleId &&
            oldTab.pageId === newTab.pageId &&
            oldTab.tabId === newTab.tabId
        )
    );

    console.log("the added tap", addedTabs);
    console.log("the removede  tap", removedTabs);
    const addedTabPageActions = selectedTabPageActions.filter(newAct =>
        !oldTabPageActions.some(oldAct =>
            oldAct.tabId === newAct.tabId &&
            oldAct.tabPageId === newAct.tabPageId &&
            oldAct.action === newAct.action
        )
    );

    const removedTabPageActions = oldTabPageActions.filter(oldAct =>
        !selectedTabPageActions.some(newAct =>
            newAct.tabId === oldAct.tabId &&
            newAct.tabPageId === oldAct.tabPageId &&
            newAct.action === oldAct.action
        )
    );

    console.log("Added tab page actions:", addedTabPageActions);
    console.log("Removed tab page actions:", removedTabPageActions);
	
	
	
	const addedPageActions = selectedPageActionPermissions.filter(newAct =>
	    !oldPageActionPermissions.some(oldAct =>
	        oldAct.pageId === newAct.pageId &&
	        oldAct.action === newAct.action
	    )
	);

	const removedPageActions = oldPageActionPermissions.filter(oldAct =>
	    !selectedPageActionPermissions.some(newAct =>
	        newAct.pageId === oldAct.pageId &&
	        newAct.action === oldAct.action
	    )
	);

	console.log("Added Page Actions:", addedPageActions);
	console.log("Removed Page Actions:", removedPageActions);

    const promises = [];


    const isPageChanged = addedPermissions.length || removedPermissions.length;
  //  const isActionChanged = addedActions.length || removedActions.length;
    const isTabChanged = addedTabs.length || removedTabs.length;


    const isTabPageActionChanged = addedTabPageActions.length || removedTabPageActions.length;
	const isPageActionChanged = addedPageActions.length || removedPageActions.length;

    // ✅ Add to the no-change check
	if (!isPageChanged && !isTabChanged && !isTabPageActionChanged && !isPageActionChanged) {
		
		
	    showPopup("No Fields Changes", "useraccess.jsp");
	    return;
	}

    // ✅ Save tab page actions
    if (isTabPageActionChanged) {
        promises.push(
            fetch(new URL('/api/save-tab-page-actions', baseUrl1), {
                method: 'POST',
                credentials: "include",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    newActions: addedTabPageActions,
                    oldActions: removedTabPageActions,
                    userId: selectedUserId,
                    createdBy: createdby
                })
            })
        );
    }


    if (isPageChanged) {
        promises.push(
            fetch(new URL('/api/save-permissions', baseUrl1), {
                method: 'POST',
                credentials: "include",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    newPermissions: addedPermissions,
                    oldPermissions: removedPermissions,
                    userId: selectedUserId,
                    createdBy: createdby
                })
            })
        );
    }

    if (isTabChanged) {
        promises.push(
            fetch(new URL('/api/save-tab-permissions', baseUrl1), {
                method: 'POST',
                credentials: "include",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    newTabs: addedTabs,
                    oldTabs: removedTabs,
                    userId: selectedUserId,
                    createdBy: createdby
                })
            })
        );
    }
	if (isPageActionChanged) {
	    promises.push(
	        fetch(new URL('/api/save-page-actions', baseUrl1), {
	            method: 'POST',
	            credentials: "include",
	            headers: { 'Content-Type': 'application/json' },
	            body: JSON.stringify({
	                newActions: addedPageActions,
	                oldActions: removedPageActions,
	                userId: selectedUserId,
	                createdBy: createdby
	            })
	        })
	    );
	}


    Promise.all(promises)
        .then(responses => {

            const allSuccess = responses.every(res => res.ok);

            if (allSuccess) {
                $("#loadingSpinner").hide();

                showPopup("Permission is saved Successfully", "useraccess.jsp");

                setTimeout(() => {
                    popup.fadeOut(400, function() {
                        $(this).remove();
                        // optional redirect
                        // window.location = 'useraccess.jsp';
                    });
                }, 800);

            } else {
				saveBtn.disabled = false;
				       saveBtn.textContent = "Save Permissions";

                Promise.all(
                    responses.map(res => res.ok ? null : res.json())
                ).then(errors => {

                    const errorMessage =
                        errors.find(e => e)?.message || "Failed to save permissions.";

                    const popup = $(`<div class="popup" style="background-color:#f8d7da;color:#842029;">
						                    Error: ${errorMessage}
						                </div>`).appendTo('body').hide().fadeIn(400);

                    setTimeout(() => {
                        popup.fadeOut(400, function() {
                            $(this).remove();
                        });
                    }, 2000);
                });
            }
        })
        .catch(error => {
            console.error("Request failed:", error);
			saveBtn.disabled = false;
			       saveBtn.textContent = "Save Permissions";

            const popup = $('<div class="popup" style="background-color:#f8d7da;color:#842029;">An error occurred while saving permissions.</div>')
                .appendTo('body').hide().fadeIn(400);

            setTimeout(() => {
                popup.fadeOut(400, function() {
                    $(this).remove();
                });
            }, 2000);
        });

}


function loadSubconUsersIntoSameDropdown() {
    const userDropdown = document.getElementById("userDropdown");
    userDropdown.disabled = true;

    fetch(new URL('/api/subcontractor/subconusers', baseUrl1), {
        credentials: "include"
    })
        .then(res => res.json())
        .then(subconUsers => {

            // Existing users already loaded → collect IDs
            const existingIds = new Set(
                Array.from(userDropdown.options).map(o => o.value)
            );

            // Append only new SUBCON users
            subconUsers.forEach(user => {
                if (!existingIds.has(String(user.user_id))) {
                    const option = document.createElement("option");
                    option.value = user.user_name;
                    option.textContent = user.user_name || user.username;
                    option.dataset.subcon = "true";
                    userDropdown.appendChild(option);
                }
            });

            userDropdown.disabled = false;
        })
        .catch(err => {
            console.error("Error loading SUBCON users", err);
            userDropdown.disabled = false;
        });
}

function removeSubconUsersFromDropdown() {
    const userDropdown = document.getElementById("userDropdown");

    Array.from(userDropdown.options).forEach(option => {
        if (option.dataset.subcon === "true") {
            option.remove();
        }
    });
}
function createStyledAction(actionName, page, module, container) {
    const wrapper = document.createElement("div");

    wrapper.style.display = "inline-flex";
    wrapper.style.alignItems = "center";
    wrapper.style.gap = "6px";
    wrapper.style.padding = "4px 8px";
    wrapper.style.border = "1px solid #ced4da";
    wrapper.style.borderRadius = "6px";
    wrapper.style.background = "#f8f9fa";
    wrapper.style.marginBottom = "4px";
    wrapper.style.fontSize = "12px";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.name = `pageActions_${module.moduleID}`;
    checkbox.value = `${page.pageID}|${actionName}`;

    checkbox.setAttribute("data-module-id", module.moduleID);
    checkbox.setAttribute("data-page-id", page.pageID);
    checkbox.setAttribute("data-action", actionName);

    const label = document.createElement("label");
    label.textContent = actionName;
    label.style.fontSize = "12px";
    label.style.marginBottom = "0";

    wrapper.appendChild(checkbox);
    wrapper.appendChild(label);

    container.appendChild(wrapper);
}

let jimsUsersCache = [];
let subconUsersCache = [];

function loadSubconUsersIntoSameDropdown() {

    const userDropdown = document.getElementById("userDropdown");
	clearAllPermissionsUI();

    // already loaded → use cache
    if (subconUsersCache.length > 0) {
        renderUsers(subconUsersCache, true);
        return;
    }

    userDropdown.disabled = true;

    fetch(new URL('/api/subcontractor/subconusers', baseUrl1), {
        credentials: "include"
    })
    .then(res => res.json())
    .then(subconUsers => {

        subconUsersCache = subconUsers;

        renderUsers(subconUsers, true);

        userDropdown.disabled = false;
    })
    .catch(err => {
        console.error("Error loading SUBCON users", err);
        userDropdown.disabled = false;
    });
}

function loadJimsUsers() {

    const userDropdown = document.getElementById("userDropdown");
	
	//clearAllPermissionsUI();
	//clearuserdrop();

    // already loaded → use cache
    if (jimsUsersCache.length > 0) {
        renderUsers(jimsUsersCache, false);
        return;
    }

    userDropdown.disabled = true;

    fetch(new URL('/api/users', baseUrl1), {
        credentials: "include"
    })
    .then(response => response.json())
    .then(data => {

        jimsUsersCache = data;

        renderUsers(data, false);

        userDropdown.disabled = false;
    })
    .catch(error => {
        console.error("Error fetching users:", error);
        userDropdown.disabled = false;
    });
}

function renderUsers(users, isSubcon) {

    const userDropdown = document.getElementById("userDropdown");

    const selectedValue = userDropdown.value;

    userDropdown.innerHTML = `<option value="">Select</option>`;

    users.forEach(user => {

        const option = document.createElement("option");

        option.value = user.user_id;

        option.textContent =
            isSubcon
                ? (user.user_name || user.username)
                : user.username;

        if (isSubcon) {
            option.dataset.subcon = "true";
        }

        userDropdown.appendChild(option);
    });

    // restore previous selection if exists
    if ([...userDropdown.options].some(o => o.value === selectedValue)) {
        userDropdown.value = selectedValue;
    }
}


function clearAllPermissionsUI() {

    // uncheck all checkboxes
    document.querySelectorAll("#moduleTabContent input[type='checkbox']")
        .forEach(cb => {
            cb.checked = false;
        });

    // hide all action containers
    document.querySelectorAll("div[data-action-container='true']")
        .forEach(container => {
            container.style.display = "none";
        });

    // hide normal page action containers
    document.querySelectorAll(".page-checkboxes > div > div")
        .forEach(container => {
            if (
                container.querySelector &&
                container.querySelector("input[type='checkbox']")
            ) {
                container.style.display = "none";
            }
        });

    // hide invoice tab containers
    document.querySelectorAll(".invoice-tabs-container")
        .forEach(container => {
            container.style.display = "none";
        });

    // clear old arrays also
    oldPagePermissions = [];
    oldTabPermissions = [];
    oldTabPageActions = [];
    oldPageActionPermissions = [];
    selectedTabPageActions.length = 0;
    selectedPageActionPermissions.length = 0;
}

function clearuserdrop(){
	$("#userDropdown").val("");
}

function showPopup(message, redirectUrl) {
    var popup = $('<div class="popup">' + message + '</div>').appendTo('body').hide().fadeIn(400);
    setTimeout(function() {
        popup.fadeOut(400, function() {
            $(this).remove();
            window.location = redirectUrl;
        });
    }, 2000);
}