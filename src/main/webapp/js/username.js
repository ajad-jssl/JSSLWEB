document.addEventListener('DOMContentLoaded', function () {

    const username = sessionStorage.getItem('username');

    if (username) {
        document.getElementById('usernameDisplay').textContent = username;
    }

    
    const factoryId = sessionStorage.getItem('selectedFactoryId');
    const factoryName = getFactoryName(factoryId);

    if (factoryName) {
        document.getElementById('selectedFactoryId').textContent = `(${factoryName})`;
    } else {
        document.getElementById('selectedFactoryId').textContent = `(No Factory Selected)`;
    }
});


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
