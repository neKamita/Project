// Authentication page specific functionality
class AuthPage {
    constructor() {
        this.form = document.querySelector('.auth-form');
        this.passwordInputs = document.querySelectorAll('input[type="password"]');
        this.emailInput = document.querySelector('input[type="email"]');
        
        this.init();
    }

    init() {
        this.setupFormValidation();
        this.setupPasswordToggles();
        this.setupPasswordStrength();
        this.setupSocialAuth();
    }

    setupFormValidation() {
        if (!this.form) return;

        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            if (this.validateForm()) {
                // Если валидация прошла успешно, отправляем форму
                this.form.submit();
            }
        });

        // Real-time validation
        this.form.querySelectorAll('input').forEach(input => {
            if (input.type === 'password' && input.id === 'password') {
                // Для поля пароля используем только setupPasswordStrength
                input.addEventListener('input', () => ChefShare.FormValidator.clearError(input));
            } else {
                // Для остальных полей оставляем проверку при потере фокуса
                input.addEventListener('blur', () => this.validateField(input));
                input.addEventListener('input', () => ChefShare.FormValidator.clearError(input));
            }
        });
    }

    validateForm() {
        let isValid = true;
        const inputs = this.form.querySelectorAll('input');

        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });

        return isValid;
    }

    validateField(input) {
        const { FormValidator } = ChefShare;
        let isValid = true;
        let errorMessage = '';

        // Пропускаем проверку силы пароля здесь, так как она обрабатывается в setupPasswordStrength
        if (input.type === 'password' && input.id === 'password') {
            return true;
        }

        switch(input.type) {
            case 'email':
                if (!FormValidator.validateEmail(input.value)) {
                    errorMessage = 'Пожалуйста, введите корректный email';
                    FormValidator.showError(input, errorMessage);
                    isValid = false;
                }
                break;
            case 'password':
                if (!FormValidator.validatePassword(input.value)) {
                    errorMessage = 'Пароль должен содержать минимум 8 символов';
                    FormValidator.showError(input, errorMessage);
                    isValid = false;
                }
                break;
            case 'text':
                if (input.id === 'username' && !FormValidator.validateUsername(input.value)) {
                    errorMessage = 'Имя пользователя должно содержать от 3 до 30 символов';
                    FormValidator.showError(input, errorMessage);
                    isValid = false;
                }
                break;
        }

        // Check password confirmation
        if (input.id === 'confirmPassword') {
            const password = document.getElementById('password');
            if (password && input.value !== password.value) {
                errorMessage = 'Пароли не совпадают';
                FormValidator.showError(input, errorMessage);
                isValid = false;
            }
        }

        if (!isValid && errorMessage) {
            NotificationManager.show(errorMessage, 'error');
        }

        return isValid;
    }

    setupPasswordToggles() {
        this.passwordInputs.forEach(input => {
            const toggleBtn = document.createElement('i');
            toggleBtn.className = 'fas fa-eye password-toggle';
            input.parentElement.appendChild(toggleBtn);

            toggleBtn.addEventListener('click', () => {
                const type = input.type === 'password' ? 'text' : 'password';
                input.type = type;
                toggleBtn.className = `fas fa-eye${type === 'password' ? '' : '-slash'} password-toggle`;
            });
        });
    }

    setupPasswordStrength() {
        const passwordInput = document.getElementById('password');
        if (!passwordInput) return;

        let lastNotification = null;
        let notificationTimeout = null;

        passwordInput.addEventListener('input', (e) => {
            const password = e.target.value;
            
            // Очищаем предыдущий таймаут
            if (notificationTimeout) {
                clearTimeout(notificationTimeout);
            }

            // Ждем 500мс после последнего ввода, прежде чем показать уведомление
            notificationTimeout = setTimeout(() => {
                if (password.length === 0) {
                    lastNotification = null;
                    return;
                }

                const strength = this.calculatePasswordStrength(password);
                let message = '';
                let type = 'info';

                if (strength < 30) {
                    message = 'Слабый пароль. Добавьте цифры и специальные символы.';
                    type = 'error';
                } else if (strength < 60) {
                    message = 'Средний пароль. Добавьте больше разных символов для усиления.';
                    type = 'warning';
                } else if (strength >= 60) {
                    message = 'Сильный пароль!';
                    type = 'success';
                }

                // Проверяем, изменилось ли сообщение
                if (lastNotification !== message) {
                    NotificationManager.show(message, type);
                    lastNotification = message;
                }
            }, 500);
        });
    }

    calculatePasswordStrength(password) {
        let strength = 0;
        
        // Минимальная длина
        if (password.length >= 8) {
            strength += 20;
        } else {
            return 0; // Если пароль короче 8 символов, сразу возвращаем 0
        }

        // Дополнительные баллы за длину
        if (password.length >= 12) {
            strength += 10;
        }

        // Проверяем наличие разных типов символов
        const hasNumbers = /[0-9]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasUpperCase = /[A-Z]/.test(password);
        const hasSpecial = /[^A-Za-z0-9]/.test(password);

        // Начисляем баллы за каждый тип символов
        if (hasNumbers) strength += 15;
        if (hasLowerCase) strength += 15;
        if (hasUpperCase) strength += 20;
        if (hasSpecial) strength += 20;

        // Бонус за комбинацию разных типов символов
        let typesCount = [hasNumbers, hasLowerCase, hasUpperCase, hasSpecial].filter(Boolean).length;
        if (typesCount >= 3) {
            strength += 10;
        }

        return Math.min(strength, 100);
    }

    setupSocialAuth() {
        const socialButtons = document.querySelectorAll('.social-button');
        socialButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const provider = button.getAttribute('data-provider');
                NotificationManager.show(`${provider} authentication is not available yet`, 'info');
            });
        });
    }
}

// Initialize auth page functionality
document.addEventListener('DOMContentLoaded', () => {
    new AuthPage();
});
