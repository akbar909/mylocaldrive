document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('loginForm');
    if (!form || !window.validators) {
        return;
    }

    const { validateEmail, validatePasswordLength } = window.validators;

    const email = document.getElementById('email');
    const password = document.getElementById('password');

    const emailError = document.getElementById('emailError');
    const passwordError = document.getElementById('passwordError');

    const handleEmail = () => validateEmail(email, emailError);
    const handlePassword = () => validatePasswordLength(password, passwordError);

    email.addEventListener('input', handleEmail);
    password.addEventListener('input', handlePassword);

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const isEmailValid = handleEmail();
        const isPasswordValid = handlePassword();

        if (isEmailValid && isPasswordValid) {
            form.submit();
        }
    });
});
