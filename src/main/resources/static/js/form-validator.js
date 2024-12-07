class FormValidator {
    static validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    static validatePassword(password) {
        return password.length >= 8;
    }

    static validateUsername(username) {
        return username.length >= 3 && username.length <= 30;
    }

    static showError(input, message) {
        const formGroup = input.closest('.form-group');
        if (formGroup) {
            input.classList.add('error');
            
            // Удаляем предыдущее сообщение об ошибке, если оно есть
            const existingError = formGroup.querySelector('.error-message');
            if (existingError) {
                existingError.remove();
            }

            // Создаем и добавляем новое сообщение об ошибке
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            errorDiv.textContent = message;
            formGroup.appendChild(errorDiv);
        }
    }

    static clearError(input) {
        const formGroup = input.closest('.form-group');
        if (formGroup) {
            input.classList.remove('error');
            const errorDiv = formGroup.querySelector('.error-message');
            if (errorDiv) {
                errorDiv.remove();
            }
        }
    }
}

// Добавляем FormValidator в глобальный объект ChefShare
window.ChefShare = window.ChefShare || {};
window.ChefShare.FormValidator = FormValidator;
