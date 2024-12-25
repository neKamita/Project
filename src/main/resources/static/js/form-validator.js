class FormValidator {
    // Enhanced email validation with more strict regex
    static validateEmail(email) {
        const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return re.test(email);
    }

    // Enhanced password validation with strength check
    static validatePassword(password) {
        const validations = [
            { regex: /.{8,}/, message: "Минимум 8 символов" },
            { regex: /[a-z]+/, message: "Строчные буквы" },
            { regex: /[A-Z]+/, message: "Заглавные буквы" },
            { regex: /[0-9]+/, message: "Цифры" },
            { regex: /[!@#$%^&*(),.?":{}|<>]/, message: "Спецсимволы" }
        ];

        const failedChecks = validations
            .filter(validation => !validation.regex.test(password))
            .map(validation => validation.message);

        return {
            isValid: failedChecks.length <= 1,
            failedChecks
        };
    }

    // Enhanced username validation with regex
    static validateUsername(username) {
        const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
        return usernameRegex.test(username);
    }

    // Enhanced error handling with more detailed error messages
    static showError(input, message) {
        const formGroup = input.closest('.form-group');
        if (formGroup) {
            // Add error styling
            input.classList.add('is-invalid');
            formGroup.classList.add('has-error');
            
            // Remove previous error messages
            const existingError = formGroup.querySelector('.error-message');
            if (existingError) {
                existingError.remove();
            }

            // Create and add new error message
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message text-danger';
            errorDiv.textContent = message;
            
            // Append error message after the input
            input.parentNode.insertBefore(errorDiv, input.nextSibling);

            // Optional: Accessibility improvements
            input.setAttribute('aria-invalid', 'true');
            input.setAttribute('aria-describedby', `error-${input.id}`);
            errorDiv.id = `error-${input.id}`;
        }
    }

    // Enhanced error clearing with more comprehensive reset
    static clearError(input) {
        const formGroup = input.closest('.form-group');
        if (formGroup) {
            // Remove error styling
            input.classList.remove('is-invalid');
            formGroup.classList.remove('has-error');

            // Remove error message
            const errorDiv = formGroup.querySelector('.error-message');
            if (errorDiv) {
                errorDiv.remove();
            }

            // Reset accessibility attributes
            input.removeAttribute('aria-invalid');
            input.removeAttribute('aria-describedby');
        }
    }

    // New method: Validate form fields
    static validateForm(form) {
        const inputs = form.querySelectorAll('input[required]');
        let isValid = true;

        inputs.forEach(input => {
            this.clearError(input);
            
            switch (input.type) {
                case 'email':
                    if (!this.validateEmail(input.value)) {
                        this.showError(input, 'Введите корректный email');
                        isValid = false;
                    }
                    break;
                case 'password':
                    const passwordValidation = this.validatePassword(input.value);
                    if (!passwordValidation.isValid) {
                        this.showError(input, 'Пароль не соответствует требованиям безопасности');
                        isValid = false;
                    }
                    break;
                default:
                    if (input.name === 'username') {
                        if (!this.validateUsername(input.value)) {
                            this.showError(input, 'Имя пользователя должно содержать 3-20 символов');
                            isValid = false;
                        }
                    } else if (input.value.trim() === '') {
                        this.showError(input, 'Это поле обязательно для заполнения');
                        isValid = false;
                    }
            }
        });

        return isValid;
    }
}

// Добавляем FormValidator в глобальный объект ChefShare
window.ChefShare = window.ChefShare || {};
window.ChefShare.FormValidator = FormValidator;
