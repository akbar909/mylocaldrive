document.addEventListener('DOMContentLoaded', function() {
    // Setup registration form with comprehensive validation
    const form = document.getElementById('registerForm');
    if (!form || !window.validators) {
        return;
    }

    const { validateUsername, validateEmail, validatePasswordStrong, showError } = window.validators;

    const username = document.getElementById('username');
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    const emailCheckIcon = document.getElementById('emailCheckIcon');
    if (emailCheckIcon) {
        emailCheckIcon.style.display = 'none';
    }

    const usernameError = document.getElementById('usernameError');
    const emailError = document.getElementById('emailError');
    const passwordError = document.getElementById('passwordError');

    const handleUsername = () => validateUsername(username, usernameError);
    const handleEmail = () => validateEmail(email, emailError);
    const handlePassword = () => {
        const strongEnough = validatePasswordStrong(password, passwordError);
        if (!strongEnough) return false;

        const userVal = username.value.trim();
        const passVal = password.value.trim();
        if (userVal && passVal && userVal.toLowerCase() === passVal.toLowerCase()) {
            showError(password, passwordError, 'Password cannot be the same as username');
            return false;
        }
        return true;
    };

    // Simplified email input handling (no availability check, hide icon)
    email.addEventListener('input', () => {
        if (emailCheckIcon) {
            emailCheckIcon.style.display = 'none';
            emailCheckIcon.removeAttribute('data-status');
            emailCheckIcon.innerHTML = '';
        }
        handleEmail();
    });

    username.addEventListener('input', handleUsername);
    password.addEventListener('input', handlePassword);

    form.addEventListener('submit', function(e) {
        const isUsernameValid = handleUsername();
        const isEmailValid = handleEmail();
        const isPasswordValid = handlePassword();

        if (!isUsernameValid || !isEmailValid || !isPasswordValid) {
            e.preventDefault();
            return false;
        }
        // Let the form submit naturally if validation passes
    });
});
