document.addEventListener('DOMContentLoaded', function() {
    // Form elements
    const form = document.getElementById('loginForm');
    const email = document.getElementById('email');
    const password = document.getElementById('password');

    const emailError = document.getElementById('emailError');
    const passwordError = document.getElementById('passwordError');

    email.addEventListener('input', validateEmail);
    password.addEventListener('input', validatePassword);

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

        clearError(password, passwordError);
        return true;
    }

        form.addEventListener('submit', function(e) {
            e.preventDefault();

            const isEmailValid = validateEmail();
            const isPasswordValid = validatePassword();

            if (isEmailValid && isPasswordValid) {
                form.submit();
            }
        });
    });

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
});
