/**
 * Login page logic
 */
import { login } from '../services/auth.js';
import { showToast } from '../ui/components.js';

const loginForm = document.getElementById('login-form');
const errorMsg = document.getElementById('login-error');

const handleLogin = async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    errorMsg.style.display = 'none';

    try {
        await login(email, password);
        showToast('Successfully logged in!', 'success');

        // Redirect to previous page or home
        window.location.href = 'index.html';
    } catch (error) {
        errorMsg.textContent = error.message || 'Login failed. Please check your credentials.';
        errorMsg.style.display = 'block';
    }
};

if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
}
