document.addEventListener('DOMContentLoaded', function() {
    // Setup registration form with comprehensive validation
    const form = document.getElementById('registerForm');
    if (!form || !window.validators) {
        return;
    }

    const { validateUsername, validateEmail, validatePasswordStrong } = window.validators;

    const username = document.getElementById('username');
    const email = document.getElementById('email');
    const password = document.getElementById('password');

    const usernameError = document.getElementById('usernameError');
    const emailError = document.getElementById('emailError');
    const passwordError = document.getElementById('passwordError');

    const handleUsername = () => validateUsername(username, usernameError);
    const handleEmail = () => validateEmail(email, emailError);
    const handlePassword = () => validatePasswordStrong(password, passwordError);

    username.addEventListener('input', handleUsername);
    email.addEventListener('input', handleEmail);
    password.addEventListener('input', handlePassword);

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const isUsernameValid = handleUsername();
        const isEmailValid = handleEmail();
        const isPasswordValid = handlePassword();

        if (isUsernameValid && isEmailValid && isPasswordValid) {
            form.submit();
        }
    });
});
