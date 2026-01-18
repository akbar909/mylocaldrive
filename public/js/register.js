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
    const emailCheckIcon = document.getElementById('emailCheckIcon');

    const usernameError = document.getElementById('usernameError');
    const emailError = document.getElementById('emailError');
    const passwordError = document.getElementById('passwordError');

    const handleUsername = () => validateUsername(username, usernameError);
    const handleEmail = () => validateEmail(email, emailError);
    const handlePassword = () => validatePasswordStrong(password, passwordError);

    // Real-time email existence check
    let emailCheckTimeout;
    email.addEventListener('input', () => {
        clearTimeout(emailCheckTimeout);
        const emailValue = email.value.trim();
        
        if (!emailValue) {
            emailCheckIcon.style.display = 'none';
            emailCheckIcon.removeAttribute('data-status');
            emailCheckIcon.innerHTML = '';
            return;
        }

        emailCheckTimeout = setTimeout(async () => {
            try {
                const response = await fetch(`/user/check-email?email=${encodeURIComponent(emailValue)}`);
                const data = await response.json();
                
                if (data.exists) {
                    emailCheckIcon.innerHTML = '<i class="fas fa-times-circle" aria-hidden="true"></i>';
                    emailCheckIcon.style.color = '#ef4444';
                    emailCheckIcon.title = 'Email already registered';
                    emailCheckIcon.dataset.status = 'unavailable';
                } else {
                    emailCheckIcon.innerHTML = '<i class="fas fa-check-circle" aria-hidden="true"></i>';
                    emailCheckIcon.style.color = '#10b981';
                    emailCheckIcon.title = 'Email available';
                    emailCheckIcon.dataset.status = 'available';
                }
                emailCheckIcon.style.display = 'inline';
            } catch (err) {
                console.error('Error checking email:', err);
            }
        }, 500);
        
        handleEmail();
    });

    username.addEventListener('input', handleUsername);
    password.addEventListener('input', handlePassword);

    form.addEventListener('submit', function(e) {
        const isUsernameValid = handleUsername();
        const isEmailValid = handleEmail();
        const isPasswordValid = handlePassword();

        // Check if email already exists
        if (emailCheckIcon.dataset.status === 'unavailable') {
            emailError.textContent = 'This email is already registered';
            e.preventDefault();
            return false;
        }

        if (!isUsernameValid || !isEmailValid || !isPasswordValid) {
            e.preventDefault();
            return false;
        }
        // Let the form submit naturally if validation passes
    });
});
