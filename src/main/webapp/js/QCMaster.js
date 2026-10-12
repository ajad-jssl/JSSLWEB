// Retrieve the selected factory ID fromsessionStorage
const selectedFactoryId =sessionStorage.getItem('selectedFactoryId');
if (selectedFactoryId) {
    fetchFabricatorMasterCount();
	fetchwelderMasterCount();
	fetchRevisionMasterCount();
	fetchpositionMasterCount();
	fetchprocessMasterCount();
} else {
    console.error('No factory ID found insessionStorage.');
}

function fetchFabricatorMasterCount() {
    fetch(new URL('/api/qc/weld/counts', baseUrl1), {
        method: 'GET',
        credentials: 'include',  // Sends cookies if needed
    })
    .then(response => response.json())
    .then(data => {
        // Access the 'fabricatorCount' property directly
        document.getElementById("fabricatorCount").textContent = data.fabricatorCount ?? 0;
    })
    .catch(error => {
        console.error("Error fetching counts:", error);
        document.getElementById("fabricatorCount").textContent = 0;
    });
}

function fetchwelderMasterCount() {
    fetch(new URL('/api/qc/weld/counts', baseUrl1), {
        method: 'GET',
        credentials: 'include',  // Sends cookies if needed
    })
    .then(response => response.json())
    .then(data => {
        // Access the 'fabricatorCount' property directly
        document.getElementById("welderCount").textContent = data.welderCount ?? 0;
    })
    .catch(error => {
        console.error("Error fetching counts:", error);
        document.getElementById("welderCount").textContent = 0;
    });
}

function fetchRevisionMasterCount() {
    fetch(new URL('/api/qc/weld/counts', baseUrl1), {
        method: 'GET',
        credentials: 'include',  // Sends cookies if needed
    })
    .then(response => response.json())
    .then(data => {
        // Access the 'fabricatorCount' property directly
        document.getElementById("revisionCount").textContent = data.revisionCount ?? 0;
    })
    .catch(error => {
        console.error("Error fetching counts:", error);
        document.getElementById("revisionCount").textContent = 0;
    });
}

function fetchpositionMasterCount() {
    fetch(new URL('/api/qc/weld/counts', baseUrl1), {
        method: 'GET',
        credentials: 'include',  // Sends cookies if needed
    })
    .then(response => response.json())
    .then(data => {
        // Access the 'fabricatorCount' property directly
        document.getElementById("positionCount").textContent = data.positionCount ?? 0;
    })
    .catch(error => {
        console.error("Error fetching counts:", error);
        document.getElementById("positionCount").textContent = 0;
    });
}

function fetchprocessMasterCount() {
    fetch(new URL('/api/qc/weld/counts', baseUrl1), {
        method: 'GET',
        credentials: 'include',  // Sends cookies if needed
    })
    .then(response => response.json())
    .then(data => {
        // Access the 'fabricatorCount' property directly
        document.getElementById("processCount").textContent = data.processCount ?? 0;
    })
    .catch(error => {
        console.error("Error fetching counts:", error);
        document.getElementById("processCount").textContent = 0;
    });
}

