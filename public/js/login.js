document.addEventListener('DOMContentLoaded', function() {
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
        e.preventDefault();

        const isUsernameValid = handleUsername();
        const isPasswordValid = handlePassword();

        if (isUsernameValid && isPasswordValid) {
            form.submit();
        }
    });
});
