document.addEventListener('DOMContentLoaded', function() {
    // Form validation
    const form = document.getElementById('registerForm');
    const username = document.getElementById('username');
    const email = document.getElementById('email');
    const password = document.getElementById('password');

    const usernameError = document.getElementById('usernameError');
    const emailError = document.getElementById('emailError');
    const passwordError = document.getElementById('passwordError');

    // Real-time validation
    username.addEventListener('input', validateUsername);
    email.addEventListener('input', validateEmail);
    password.addEventListener('input', validatePassword);

    function validateUsername() {
        const value = username.value.trim();
        
        if (value === '') {
            showError(username, usernameError, 'Username is required');
            return false;
        }
        
        if (value.length < 3) {
            showError(username, usernameError, 'Username must be at least 3 characters');
            return false;
        }
        
        if (value.length > 20) {
            showError(username, usernameError, 'Username must be less than 20 characters');
            return false;
        }
        
        if (!/^[a-zA-Z0-9_]+$/.test(value)) {
            showError(username, usernameError, 'Username can only contain letters, numbers, and underscores');
            return false;
        }
        
        clearError(username, usernameError);
        return true;
    }

    function validateEmail() {
        const value = email.value.trim();
        
        if (value === '') {
            showError(email, emailError, 'Email is required');
            return false;
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            showError(email, emailError, 'Please enter a valid email address');
            return false;
        }
        
        clearError(email, emailError);
        return true;
    }

    function validatePassword() {
        const value = password.value;
        
        if (value === '') {
            showError(password, passwordError, 'Password is required');
            return false;
        }
        
        if (value.length < 8) {
            showError(password, passwordError, 'Password must be at least 8 characters');
            return false;
        }
        
        if (!/[A-Z]/.test(value)) {
            showError(password, passwordError, 'Password must contain at least one uppercase letter');
            return false;
        }
        
        if (!/[a-z]/.test(value)) {
            showError(password, passwordError, 'Password must contain at least one lowercase letter');
            return false;
        }
        
        if (!/[0-9]/.test(value)) {
            showError(password, passwordError, 'Password must contain at least one number');
            return false;
        }
        
        clearError(password, passwordError);
        return true;
    }

    function showError(input, errorElement, message) {
        input.classList.add('input-error');
        input.classList.remove('input-success');
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }

    function clearError(input, errorElement) {
        input.classList.remove('input-error');
        input.classList.add('input-success');
        errorElement.textContent = '';
        errorElement.style.display = 'none';
    }

    // Form submission validation
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const isUsernameValid = validateUsername();
        const isEmailValid = validateEmail();
        const isPasswordValid = validatePassword();
        
        if (isUsernameValid && isEmailValid && isPasswordValid) {
            // Client-side validation passed, submit form to server
            form.submit();
        }
    });
});
