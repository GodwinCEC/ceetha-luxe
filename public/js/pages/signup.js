/**
 * Signup page logic
 */
import { register } from '../services/auth.js';
import { showToast } from '../ui/components.js';

const signupForm = document.getElementById('signup-form');
const errorMsg = document.getElementById('signup-error');

const handleSignup = async (e) => {
    e.preventDefault();

    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    errorMsg.style.display = 'none';

    try {
        await register(email, password, { firstName, lastName });
        showToast('Welcome to Ceetha Luxe!', 'success');

        // Redirect to home
        window.location.href = 'index.html';
    } catch (error) {
        errorMsg.textContent = error.message || 'Registration failed. Please try again.';
        errorMsg.style.display = 'block';
    }
};

if (signupForm) {
    signupForm.addEventListener('submit', handleSignup);
}
