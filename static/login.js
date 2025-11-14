async function handleLogin(event) {
    event.preventDefault();
    console.log('Login attempt started');
    
    const formData = new FormData(event.target);
    
    try {
        console.log('Sending request to /login');
        const response = await fetch('/login', {
            method: 'POST',
            body: formData
        });
        
        console.log('Response received:', response);
        const data = await response.json();
        console.log('Parsed data:', data);
        
        if (data.status === 'success') {
            // Extract the type from redirect URL
            const redirectUrl = new URL(data.redirect, window.location.origin);
            const type = redirectUrl.searchParams.get('type');
            
            // Store the account type in sessionStorage
            sessionStorage.setItem('accountType', type);
            
            // Store user data
            localStorage.setItem('userData', JSON.stringify({
                email: formData.get('email'),
                name: formData.get('email').split('@')[0] // Temporary name from email
            }));
            
            console.log('Login successful, redirecting to:', data.redirect);
            window.location.href = data.redirect;
        } else {
            console.error('Login failed:', data.message);
            alert('Login failed: ' + data.message);
        }
    } catch (error) {
        console.error('Login error:', error);
        alert('An error occurred during login');
    }
}

// Add this to verify the form is properly connected
console.log('Login script loaded');
document.getElementById('loginForm').addEventListener('submit', handleLogin);