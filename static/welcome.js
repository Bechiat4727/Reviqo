document.addEventListener('DOMContentLoaded', function() {
    // Get type from URL first
    const urlParams = new URLSearchParams(window.location.search);
    const urlType = urlParams.get('type');
    
    // Get the account type from sessionStorage
    const storedType = sessionStorage.getItem('accountType');
    
    // Use URL type or stored type
    const type = urlType || storedType;
    
    if (!type) {
        console.error('No account type found');
        window.location.replace('login.html');
        return;
    }

    // Store the type if it came from URL
    if (urlType && !storedType) {
        sessionStorage.setItem('accountType', urlType);
    }

    // Update user interface if needed
    const welcomeButton = document.querySelector('.welcome');
    if (welcomeButton) {
        welcomeButton.textContent = `Discover ${type.charAt(0).toUpperCase() + type.slice(1)} Dashboard`;
    }

    // Load user data from localStorage
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (userData) {
        document.getElementById('profileName').textContent = userData.name;
        document.getElementById('profileEmail').textContent = userData.email;
    }
});