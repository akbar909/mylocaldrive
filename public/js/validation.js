(function() {
    // Client-side form validation utilities for registration and login forms
    
    // Display error message and apply error styling to input field
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

    function validateEmail(input, errorElement) {
        const value = input.value.trim();
        if (value === '') {
            showError(input, errorElement, 'Email is required');
            return false;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            showError(input, errorElement, 'Please enter a valid email address');
            return false;
        }
        clearError(input, errorElement);
        return true;
    }

    function validatePasswordLength(input, errorElement, min = 8) {
        const value = input.value;
        if (value === '') {
            showError(input, errorElement, 'Password is required');
            return false;
        }
        if (value.length < min) {
            showError(input, errorElement, `Password must be at least ${min} characters`);
            return false;
        }
        clearError(input, errorElement);
        return true;
    }

    function validatePasswordStrong(input, errorElement) {
        const value = input.value;
        if (!validatePasswordLength(input, errorElement, 8)) {
            return false;
        }
        if (!/[A-Z]/.test(value)) {
            showError(input, errorElement, 'Password must contain at least one uppercase letter');
            return false;
        }
        if (!/[a-z]/.test(value)) {
            showError(input, errorElement, 'Password must contain at least one lowercase letter');
            return false;
        }
        if (!/[0-9]/.test(value)) {
            showError(input, errorElement, 'Password must contain at least one number');
            return false;
        }
        clearError(input, errorElement);
        return true;
    }

    function validateUsername(input, errorElement) {
        const value = input.value.trim();
        if (value === '') {
            showError(input, errorElement, 'Username is required');
            return false;
        }
        if (value.length < 3) {
            showError(input, errorElement, 'Username must be at least 3 characters');
            return false;
        }
        if (value.length > 20) {
            showError(input, errorElement, 'Username must be less than 20 characters');
            return false;
        }
        if (!/^[a-zA-Z0-9_]+$/.test(value)) {
            showError(input, errorElement, 'Username can only contain letters, numbers, and underscores');
            return false;
        }
        clearError(input, errorElement);
        return true;
    }

    window.validators = {
        showError,
        clearError,
        validateEmail,
        validatePasswordLength,
        validatePasswordStrong,
        validateUsername
    };
})();
