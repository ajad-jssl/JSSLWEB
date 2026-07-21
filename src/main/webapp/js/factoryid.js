// Global variables to store factory data and selected factory ID
let factoryData = null;
let factoryById = null; // To store the selected factory id

// Function to fetch and populate the dropdown with factory data
function fetchFactoryList() {
    if (factoryData) {
        populateDropdown(factoryData);
        return;
    }

    const url = new URL('/jssl/factory/getAllFactoryList', baseUrl);

    fetch(url,	{
	        method: "GET",
	        credentials: "include"   // 🔑 send JSESSIONID cookie automatically
	    })
        .then(response => response.json())
        .then(data => {
            if (data.FactoryDetails && Array.isArray(data.FactoryDetails)) {
                factoryData = data.FactoryDetails;
                populateDropdown(factoryData);
            } else {
                console.error('Invalid data format: FactoryDetails not found or not an array');
            }
        })
        .catch(error => console.error('Error fetching factory list:', error));
}

// Function to populate the dropdown with factory names
function populateDropdown(factories) {
    const dropdownMenu = document.querySelector('.dropdown-menu');
    const dropdownButton = document.querySelector('.dropdown-toggle');

    dropdownMenu.innerHTML = ''; // Clear existing items

    factories.forEach(factory => {
        const listItem = document.createElement('div');
        listItem.classList.add('dropdown-item');
        listItem.textContent = factory.factory_name;

        // Store the factory ID when the item is clicked
        listItem.addEventListener('click', function() {
            factoryById = factory.id; // Store selected factory ID
            localStorage.setItem('selectedFactoryId', factory.id); // Save ID to localStorage
            dropdownButton.textContent = factory.factory_name; // Update button text
            dropdownMenu.style.display = 'none'; // Hide the dropdown menu

            // Call fetchEmployeeList1 with the selected factory ID
          //  fetchEmployeeList1(factory.id);

            // Optionally, redirect to another page
           // window.location.href = 'page2.html';
        });

        dropdownMenu.appendChild(listItem);
    });

    dropdownMenu.style.display = 'block'; // Show the dropdown menu
}

// Attach click event to dropdown button
document.querySelector('.dropdown-toggle').addEventListener('click', fetchFactoryList);

// Handle selected factory display
document.addEventListener('DOMContentLoaded', function() {
    const selectedFactoryId = localStorage.getItem('selectedFactoryId');

    const factoryIdElement = document.getElementById('selectedFactoryId');
    if (factoryIdElement) {
        if (selectedFactoryId) {
            factoryIdElement.textContent = `Selected Factory ID: ${selectedFactoryId}`;
        } else {
            factoryIdElement.textContent = 'No factory selected.';
        }
    } else {
        console.error('Element with ID "selectedFactoryId" not found.');
    }
});






