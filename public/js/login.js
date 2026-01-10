document.addEventListener('DOMContentLoaded', function() {
    // Form elements
    const form = document.getElementById('loginForm');
    const email = document.getElementById('email');
    const password = document.getElementById('password');

    const emailError = document.getElementById('emailError');
    const passwordError = document.getElementById('passwordError');

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
