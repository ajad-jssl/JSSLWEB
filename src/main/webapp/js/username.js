document.addEventListener('DOMContentLoaded', function () {
    // Username
    const username = sessionStorage.getItem('username');

    if (username) {
        document.getElementById('usernameDisplay').textContent = username;
    }

    // Factory ID
    const factoryId = localStorage.getItem('selectedFactoryId');
    const factoryName = getFactoryName(factoryId);

    if (factoryName) {
        document.getElementById('selectedFactoryId').textContent = `(${factoryName})`;
    } else {
        document.getElementById('selectedFactoryId').textContent = `(No Factory Selected)`;
    }
});

// Map factory IDs to factory names
function getFactoryName(id) {
    switch (id) {
        case '1':
            return 'BELLARY';
        case '2':
            return 'GUJARAT';
        default:
            return null;
    }
}
