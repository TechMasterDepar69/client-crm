const authForm = document.getElementById('auth-form');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const toggleText = document.getElementById('toggle-mode');
const formTitle = document.getElementById('form-title');
const submitBtn = document.getElementById('submit-btn');
const errorMsg = document.getElementById('error-message');

let isLoginMode = true; // Start in Login mode

// 1. Toggle between Login and Register
toggleText.addEventListener('click', () => {
    isLoginMode = !isLoginMode;
    if (isLoginMode) {
        formTitle.innerText = 'Login';
        submitBtn.innerText = 'Login';
        toggleText.innerText = 'Need an account? Register here';
    } else {
        formTitle.innerText = 'Register';
        submitBtn.innerText = 'Register';
        toggleText.innerText = 'Already have an account? Login here';
    }
    errorMsg.style.display = 'none';
});

// 2. Handle Submit
authForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const endpoint = isLoginMode ? '/api/auth/login' : '/api/auth/register';

    const userCredentials = {
        email: emailInput.value,
        password: passwordInput.value
    };

    try {
        const res = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userCredentials)
        });

        const data = await res.json();

        if (data.success) {
            // SAVE THE KEY! This is the "VIP Pass"
            localStorage.setItem('token', data.token);

            // Redirect to the main dashboard
            window.location.href = 'index.html';
        } else {
            showError(data.error || 'Something went wrong');
        }
    } catch (error) {
        showError('Server error. Please try again.');
    }
});

function showError(msg) {
    errorMsg.innerText = msg;
    errorMsg.style.display = 'block';
}