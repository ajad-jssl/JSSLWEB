

window.onload = function () {
    loadAssetTypeCount();
    loadAssetModelCount();
    loadAssetStatusCount();
    loadOwnedByCount();
    loadMakerCount();
};


 async function loadAssetTypeCount() {
    const apiUrl = new URL('/api/ams/getall', baseUrl);

    try {
        const response = await fetch(apiUrl, {
            method: "GET",
            credentials: "include"
        });

        if (!response.ok) throw new Error("Failed to fetch");

        const data = await response.json();

        // ⭐ Set only the count
        document.getElementById("typecount").innerText = data.length;

    } catch (error) {
        console.error("Error loading asset type count:", error);
    }
}



async function loadAssetModelCount() {
    const apiUrl = `${baseUrl}/api/ams/model/getAll`;

    try {
        const response = await fetch(apiUrl, {
            method: "GET",
            credentials: "include"
        });

        if (!response.ok) throw new Error("Failed to fetch asset models");

        const data = await response.json();

        // ⭐ Set only the count
        document.getElementById("modelcount").innerText = data.length;

    } catch (error) {
        console.error("Error loading model count:", error);
    }
}

async function loadAssetStatusCount() {
    const apiUrl = `${baseUrl}/api/ams/status/getAll`;

    try {
        const response = await fetch(apiUrl, {
            method: "GET",
            credentials: "include"
        });

        if (!response.ok) throw new Error("Failed to fetch asset status");

        const data = await response.json();

        // ⭐ Update dashboard count
        document.getElementById("statuscount").innerText = data.length;

    } catch (error) {
        console.error("Error loading asset status count:", error);
    }
}
async function loadOwnedByCount() {
    const apiUrl = `${baseUrl}/api/ams/owned/getAll`;

    try {
        const response = await fetch(apiUrl, {
            method: "GET",
            credentials: "include"
        });

        if (!response.ok) throw new Error("Failed to fetch Owned By list");

        const data = await response.json();

        // ⭐ Set count in dashboard card
        document.getElementById("citycount").innerText = data.length;

    } catch (error) {
        console.error("Error loading Owned By count:", error);
    }
}
async function loadMakerCount() {
    const apiUrl = `${baseUrl}/api/ams/maker/getAll`;

    try {
        const response = await fetch(apiUrl, {
            method: "GET",
            credentials: "include"
        });

        if (!response.ok) throw new Error("Failed to fetch makers");

        const data = await response.json();

        // ⭐ Set count in dashboard
        document.getElementById("makecount").innerText = data.length;

    } catch (error) {
        console.error("Error loading maker count:", error);
    }
}
