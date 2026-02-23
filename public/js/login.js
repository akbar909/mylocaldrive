document.addEventListener('DOMContentLoaded', function() {
    // Initialize login form with client-side validation
    const form = document.getElementById('loginForm');
    if (!form || !window.validators) {
        return;
    }

    const { validateUsername, validatePasswordLength } = window.validators;

    const username = document.getElementById('username');
    const password = document.getElementById('password');

    const usernameError = document.getElementById('usernameError');
    const passwordError = document.getElementById('passwordError');

    const handleUsername = () => validateUsername(username, usernameError);
    const handlePassword = () => validatePasswordLength(password, passwordError);

    username.addEventListener('input', handleUsername);
    password.addEventListener('input', handlePassword);

    form.addEventListener('submit', function(e) {
        const isUsernameValid = handleUsername();
        const isPasswordValid = handlePassword();

        if (!isUsernameValid || !isPasswordValid) {
            e.preventDefault();
            return false;
        }
        // Let the form submit naturally if validation passes
    });
});
