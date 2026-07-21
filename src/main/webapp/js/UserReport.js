document.addEventListener("DOMContentLoaded", async function () {
    await loadActions();

    if (!allowedActions.includes("view")) {
        blockUI();   // 🔒 permanent block
        return;
    }

    
});


const MainPage = 'UserReport.jsp';
const UserId1 = sessionStorage.getItem('username');

let allowedActions = [];

async function loadActions() {
    try {
        const response = await fetch(
            `${baseUrl}/api/page/actions?userId=${encodeURIComponent(UserId1)}&pageName=${encodeURIComponent(MainPage)}`,
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


let username = null;
let departmentname = null;
async function loadUserAccess(userId) {
	
    try {
        const response = await fetch(`${baseUrl}/jssl/user-access?userId=${userId}`, {
            method: "GET",
            credentials: "include", // ✅ important
            headers: {
                "Content-Type": "application/json"
            }
        });

        const data = await response.json();
        console.log("API DATA:", data);

        bindUserAccessReport(data);

    } catch (error) {
        console.error("Error fetching user access:", error);
    }
}
 
 function groupData(data) {
    const grouped = {};

    data.forEach(item => {
        const module = item.moduleName;
        const page = item.subPageName || item.pageName; // ✅ important logic
        const actions = item.actions;

        if (!grouped[module]) {
            grouped[module] = [];
        }

        grouped[module].push({
            page: page,
            actions: actions
        });
    });

    return grouped;
}
function bindUserAccessReport(data) {
	

	
	
    const grouped = groupData(data);
	
	
	
	
	

    const tbody = document.querySelector(".report-table tbody");
    tbody.innerHTML = "";

    Object.keys(grouped).forEach(module => {
        const pages = grouped[module];

        let firstRow = true;

        pages.forEach((item, index) => {
            const tr = document.createElement("tr");

            // ✅ Module column with rowspan
            if (firstRow) {
                const tdModule = document.createElement("td");
                tdModule.className = "mod";
                tdModule.rowSpan = pages.length;
                tdModule.innerText = module;
                tr.appendChild(tdModule);
                firstRow = false;
            }

            // ✅ Page column
            const tdPage = document.createElement("td");
            tdPage.className = "pg";
            tdPage.innerText = item.page;
            tr.appendChild(tdPage);

            // ✅ Actions column
            const tdAction = document.createElement("td");
            tdAction.className = "perm";
            tdAction.innerText = item.actions;
            tr.appendChild(tdAction);

            tbody.appendChild(tr);
        });

        // ✅ ⭐ ADD SPACE AFTER EACH MODULE
        const spacerRow = document.createElement("tr");
        const spacerTd = document.createElement("td");

        spacerTd.colSpan = 2;
	
        spacerTd.style.height = "15px";  // 🔥 space size
        spacerTd.style.border = "none";  // remove border

        spacerRow.appendChild(spacerTd);
        tbody.appendChild(spacerRow);
    });
}
document.addEventListener("DOMContentLoaded", () => {
let userid1 = 	$("#UserId").val();
if(userid1 === ""){
	$("#deliveryChallanContainer").hide();
	$("#buttonprint")
					      .prop("disabled", true)
					      .removeClass("btn-secondary")
					      .addClass("btn-success");
}

    const userId = sessionStorage.getItem("user_id");
   loadUsers();
 /*  const userId = 'Ajad';*/

    if (userId) {
		
        loadUserAccess(userId);
    }
});
document.getElementById("UserId").addEventListener("change", function () {

    const selectedUser = this.value;
	
	$("#DateReport").text(formatDate($("#Daterep").val()));


    if (selectedUser) {

        $("#deliveryChallanContainer").show();

        $("#buttonprint")
            .prop("disabled", false)
            .removeClass("btn-secondary")
            .addClass("btn-success");

			
			document.getElementById("username").innerText = selectedUser;
			
        // ✅ find selected user details
        //const userData = allUsers.find(u => u.userId === selectedUser);
		
	/*	const userData = allUsers.find(u => u.userId === selectedUser);

        if (userData) {
            document.getElementById("username").innerText = selectedUser;
            //document.getElementById("department").innerText = userData.department;
			 			//document.getElementById("status").innerText = userData.status ? 'Active' : 'In Active';
			    
        }*/

        loadUserAccess(selectedUser);

    } else {

        $("#deliveryChallanContainer").hide();

        $("#buttonprint")
            .prop("disabled", true)
            .removeClass("btn-success")
            .addClass("btn-secondary");

        // clear header
        document.getElementById("reportName").innerText = "";
        document.getElementById("reportDept").innerText = "";
    }
});


function formatDate(dateStr) {

    if (!dateStr) return '';

    const date = new Date(dateStr);

    if (isNaN(date)) return '';

    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const yyyy = date.getFullYear();

    return `${dd}/${mm}/${yyyy}`;
}
function PrintDivContent(divId) {
    var printContent = document.getElementById(divId).innerHTML;

    var WinPrint = window.open('', '', 'width=900,height=650');

    WinPrint.document.write(`
        <html>
        <head>
            <title>User Access Report</title>
            <style>
                body {
                    font-family: Arial;
                    padding: 20px;
                }

                table {
                    width: 100%;
                    border-collapse: collapse;
                    font-size: 12px;
                }

                th, td {
                    border: 1px solid #000;
                    padding: 6px;
                    text-align: left;
                }

                th {
                    background-color: #f2f2f2;
                }

                .mod {
                    font-weight: bold;
                    text-align: center;
                    background: #fafafa;
                }

                .perm {
                    text-align: center;
                }

                .pg {
                    padding-left: 10px;
                }

                .spacer-row td {
                    border: none !important;
                    height: 15px;
                }

                .header {
                    text-align: center;
                    margin-bottom: 20px;
                }

                .header img {
                    height: 50px;
                }

                .user-info {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 20px;
                    font-size: 14px;
                }
				    .footer {
				    width: 100%;
				    margin-top: 200px;
				}

				.footer-table {
				    width: 100%;
				    border: none;
				}

				.footer-table td {
				    text-align: center;
				    vertical-align: bottom;
				    padding-top: 50px;
				}

				.sig-line {
				    border-top: 0px solid #000;
				    margin-top: 40px;
				}

            </style>
        </head>
        <body>
            ${printContent}
        </body>
        </html>
    `);

    WinPrint.document.close();
    WinPrint.focus();
    WinPrint.print();
}




let allUsers = []; // ✅ global

async function loadUsers() {

    try {

        const response = await fetch(`${baseUrl}/api/users`, {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            }
        });

        const users = await response.json();

        allUsers = users;

        const select = document.getElementById("UserId");
        const selectUserIdHist = document.getElementById("UserIdhis");

        // =========================
        // FIRST DROPDOWN
        // =========================
        select.innerHTML = '<option value="">Select</option>';

        // =========================
        // SECOND DROPDOWN
        // =========================
        selectUserIdHist.innerHTML =
            '<option value="">Select User</option>';

        // ADD ALL OPTION
        const allOption = document.createElement("option");

        allOption.value = "ALL";
        allOption.textContent = "ALL";

        selectUserIdHist.appendChild(allOption);

        users.forEach(user => {

            // FIRST DROPDOWN
            const option = document.createElement("option");

            option.value = user.username;
            option.textContent = user.username;

            select.appendChild(option);

            // SECOND DROPDOWN
            const option1 = document.createElement("option");

            option1.value = user.username;
            option1.textContent = user.username;

            selectUserIdHist.appendChild(option1);

        });

    } catch (error) {

        console.error("Error loading users:", error);

    }

}

async function fetchHistoryReport() {

    try {

        const userId =
            document.getElementById("UserIdhis").value;

        const fromDate =
            document.getElementById("fromDate").value;

        const toDate =
            document.getElementById("toDate").value;

        const response = await fetch(

            `${baseUrl}/jssl/getHistoryReport?userId=${userId}&fromDate=${fromDate}&toDate=${toDate}`,

            {
                method: "GET",
                credentials: "include"
            }
        );

        const data = await response.json();

        const tbody =
            document.querySelector("#Table_1 tbody");

        tbody.innerHTML = "";

        data.forEach((row, index) => {

            // =========================
            // PAGE NAME LOGIC
            // if PageID = 2 -> show SubPageName
            // =========================
            const pageDisplay =
                row[5] == 2
                    ? (row[11] ?? '')
                    : (row[6] ?? '');

            // =========================
            // DATE FORMAT
            // =========================
       /*     let transactionDate = '';

            if (row[1]) {

                transactionDate =
                    row[1]
                        .replace('T', ' ')
                        .split('.')[0];
            }
*/
            // =========================
            // FACTORY NAME
            // =========================
			let factoryName = '';

			if (row[22] == 1) {

			    factoryName = 'BELLARY';

			} else if (row[22] == 2) {

			    factoryName = 'GUJURAT';

			} else if (
			    row[22] === 'all' ||
			    row[22] === 'ALL'
			) {

			    factoryName = 'ALL';
			}

			let locationName = '';

			switch (row[23]) {

			    case 2:
			        locationName = 'Mumbai';
			        break;

			    case 3:
			        locationName = 'Bellary';
			        break;

			    case 4:
			        locationName = 'Project Site';
			        break;

			    case 5:
			        locationName = 'Bellary Contractors';
			        break;

			    default:
			        locationName = '';
			}
            const tr = document.createElement("tr");

            tr.innerHTML = `

                <td>${index + 1}</td>

                <td>${row[2] ?? ''}</td>

                <td>${row[16] ?? ''}</td>

                <td>${row[17] ?? ''}</td>

                <td>${row[18] ?? ''}</td>

                <td>${row[27] ?? ''}</td>

                <td>${locationName}</td>

                <td>${row[25] ?? ''}</td>

				<td>
				    ${row[19] == null
				        ? ''
				        : (row[19] == true ? 'ACTIVE' : 'INACTIVE')}
				</td>

				<td>
				    ${row[20] == null
				        ? ''
				        : (row[20] == true ? 'LOCKED' : 'UNLOCKED')}
				</td>

				<td>
				    ${row[21] == null
				        ? ''
				        : (row[21] == true ? 'YES' : 'NO')}
				</td>

                <td>${factoryName}</td>

                <td>${row[4] ?? ''}</td>

                <td>${pageDisplay}</td>

                <td>${row[12] ?? ''}</td>

                <td>${row[13] ?? ''}</td>

                <td>${row[14] ?? ''}</td>

                <td>${row[29] ?? ''}</td>

                <td>${formatDateTime(row[1]) ?? ''}</td>

                <td>${row[28] ?? ''}</td>

            `;

            tbody.appendChild(tr);

        });

    } catch (error) {

        console.error(
            "Error fetching report:",
            error
        );
    }
}


function formatDateTime(dateStr) {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    if (isNaN(date)) return '';

    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const yyyy = date.getFullYear();

    const hh = String(date.getHours()).padStart(2, '0');
    const mi = String(date.getMinutes()).padStart(2, '0');
    const ss = String(date.getSeconds()).padStart(2, '0');

    return `${dd}/${mm}/${yyyy} ${hh}:${mi}:${ss}`;
}



/*
function exportToExcelHistroy() {

    let table = document.getElementById("Table_1");

    if (!table) {
        alert("Table not found");
        return;
    }

    let htmlTable = table.outerHTML;

    // Excel file type
    let dataType = 'application/vnd.ms-excel';

    // Create download link
    let downloadLink = document.createElement("a");

    document.body.appendChild(downloadLink);

    // File name
    let fileName = "User_History_Report.xls";

    // Convert table to blob
    let blob = new Blob(['\ufeff', htmlTable], {
        type: dataType
    });

    // Create URL
    let url = URL.createObjectURL(blob);

    downloadLink.href = url;
    downloadLink.download = fileName;

    // Download file
    downloadLink.click();

    // Cleanup
    document.body.removeChild(downloadLink);
}*/

function exportToExcelHistroy() {

    var table = document.getElementById("Table_1");

    if (!table) {
        alert("Table not found");
        return;
    }

    // Create workbook
    var workbook = XLSX.utils.table_to_book(table, {
        sheet: "User History Report"
    });

    var worksheet = workbook.Sheets["User History Report"];

    // =========================
    // REPORT TITLE
    // =========================
    const title = "USER HISTORY REPORT";

    XLSX.utils.sheet_add_aoa(
        worksheet,
        [[title]],
        { origin: "A1" }
    );

    // =========================
    // GET TOTAL COLUMNS
    // =========================
    const range = XLSX.utils.decode_range(worksheet['!ref']);
    const lastCol = range.e.c;

    // =========================
    // MERGE TITLE ROW
    // =========================
    worksheet['!merges'] = worksheet['!merges'] || [];

    worksheet['!merges'].push({
        s: { r: 0, c: 0 },
        e: { r: 0, c: lastCol }
    });

    // =========================
    // TITLE STYLE
    // =========================
    if (worksheet["A1"]) {

        worksheet["A1"].s = {
            font: {
                bold: true,
                sz: 18
            },
            alignment: {
                horizontal: "center",
                vertical: "center"
            }
        };
    }

    // =========================
    // SHIFT TABLE DOWN
    // =========================
    const tableData = XLSX.utils.sheet_to_json(
        worksheet,
        {
            header: 1,
            raw: true
        }
    );

    XLSX.utils.sheet_add_aoa(
        worksheet,
        tableData,
        {
            origin: "A2"
        }
    );

    // =========================
    // FIX SL NO HEADER
    // =========================
    if (worksheet['A2']) {
        worksheet['A2'].v = "SL.No";
    }

    // =========================
    // AUTO COLUMN WIDTH
    // =========================
    const updatedRange = XLSX.utils.decode_range(worksheet['!ref']);

    worksheet['!cols'] = [];

    for (let C = updatedRange.s.c; C <= updatedRange.e.c; ++C) {

        let maxWidth = 10;

        for (let R = updatedRange.s.r; R <= updatedRange.e.r; ++R) {

            const cellAddress = XLSX.utils.encode_cell({
                r: R,
                c: C
            });

            const cell = worksheet[cellAddress];

            if (!cell || !cell.v) continue;

            const cellLength = cell.v.toString().length;

            if (cellLength > maxWidth) {
                maxWidth = cellLength;
            }
        }

        worksheet['!cols'][C] = {
            wch: maxWidth + 5
        };
    }

    // =========================
    // DOWNLOAD FILE
    // =========================
    XLSX.writeFile(
        workbook,
        "User_History_Report.xlsx"
    );
}


function blockUI() {

    const container = document.getElementById("container-wrapper");

    if (!container) return;

    // Disable interaction only inside main content
    container.style.pointerEvents = "none";
    container.style.userSelect = "none";
    container.style.opacity = "0.5";
    container.style.position = "relative";

    // Create overlay dynamically
    const overlay = document.createElement("div");
    overlay.id = "contentBlockOverlay";

    overlay.style.position = "absolute";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.background = "rgba(0,0,0,0.6)";
    overlay.style.zIndex = "999";
    overlay.style.display = "flex";
    overlay.style.justifyContent = "center";
    overlay.style.alignItems = "center";
    overlay.style.color = "white";
    overlay.style.fontSize = "22px";
    overlay.style.textAlign = "center";

    overlay.innerHTML = `
        <div>
             Access Denied <br>
            <small>You dont have permission to view this page</small>
        </div>
    `;

    container.appendChild(overlay);
}