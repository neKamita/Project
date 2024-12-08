// Authentication page specific functionality
class AuthPage {
    constructor() {
        this.form = document.querySelector('.auth-form');
        this.signInForm = this.form; // Используем ту же форму для входа
        this.passwordInputs = document.querySelectorAll('input[type="password"]');
        this.emailInput = document.querySelector('input[type="email"]');
        
        this.init();
    }

    init() {
        // Проверяем текущую страницу
        this.checkCurrentPage();

        this.setupFormValidation();
        this.setupPasswordToggles();
        this.setupPasswordStrength();
        this.setupSocialAuth();
    }

    checkCurrentPage() {
        // Проверяем, какая страница загружена
        fetch('/auth/check-page')
            .then(response => response.json())
            .then(data => {
                console.log('Current page:', data.page);
                // Можно добавить дополнительную логику для разных страниц
            })
            .catch(error => {
                console.error('Error checking page:', error);
            });
    }

    setupFormValidation() {
        if (this.form) {
            this.form.addEventListener('submit', (event) => {
                event.preventDefault();
                
                if (this.validateForm()) {
                    const data = this.collectFormData();
                    
                    // Определяем URL в зависимости от текущей страницы
                    const url = this.form.getAttribute('action');
                    
                    this.submitForm(url, data);
                }
            });
        }
    }

    collectFormData() {
        const formData = {};
        const inputs = this.form.querySelectorAll('input');
        const url = this.form.getAttribute('action');
        
        // Determine if this is a sign-up or sign-in form based on the URL
        const isSignUpForm = url.includes('/signup');
        
        inputs.forEach(input => {
            if (input.name) {
                // Always include email and password
                if (input.name === 'email' || input.name === 'password') {
                    formData[input.name] = input.value;
                }
                
                // For sign-up, include additional fields
                if (isSignUpForm) {
                    const additionalSignUpFields = [
                        'username', 
                        'firstName', 
                        'lastName'  // Optional field
                    ];
                    
                    if (additionalSignUpFields.includes(input.name)) {
                        // Only add non-empty values
                        if (input.value.trim() !== '') {
                            formData[input.name] = input.value.trim();
                        }
                    }
                }
            }
        });
        
        return formData;
    }

    submitForm(url, data) {
        // Validate data structure before sending
        const isSignUpForm = url.includes('/signup');
        
        if (isSignUpForm) {
            // Sign-up specific validation
            const requiredSignUpFields = ['email', 'password', 'username', 'firstName'];
            const missingFields = requiredSignUpFields.filter(field => !data[field]);
            
            if (missingFields.length > 0) {
                console.error('Invalid sign-up payload: Missing fields', missingFields);
                this.showError(`Пожалуйста, заполните обязательные поля: ${missingFields.join(', ')}`);
                return;
            }
        } else {
            // Sign-in validation
            if (!data || !data.email || !data.password) {
                console.error('Invalid sign-in payload: Missing email or password', data);
                this.showError('Пожалуйста, заполните email и пароль');
                return;
            }
        }

        // Detailed payload logging with sensitive information masked
        console.log('Sending authentication payload:', JSON.stringify({
            email: data.email,
            passwordLength: data.password ? `${data.password.length} characters` : 'null',
            ...(isSignUpForm ? { username: data.username } : {})
        }));

        // Prepare the fetch request with comprehensive error handling
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            console.log('Full response details:', {
                status: response.status,
                statusText: response.statusText,
                headers: Object.fromEntries(response.headers.entries())
            });
            
            const contentType = response.headers.get('content-type');
            console.log('Content-Type:', contentType);
            
            // Log the raw response text for debugging
            return response.text().then(text => {
                console.log('Raw response text:', text);
                
                // Try to parse the text as JSON
                try {
                    return text ? JSON.parse(text) : null;
                } catch (parseError) {
                    console.error('JSON parsing error:', parseError);
                    console.error('Unparseable response text:', text);
                    throw new Error('Invalid JSON response: ' + text);
                }
            });
        })
        .then(result => {
            console.log('Signin result:', result);
            
            // Comprehensive result handling
            if (!result) {
                throw new Error('Empty server response');
            }
            
            if (result.error) {
                // Handle different types of errors
                const errorMessage = result.message || 
                    result.details || 
                    'Неизвестная ошибка входа';
                
                this.showError(errorMessage);
                
                // Optional: log additional error details
                if (result.errors) {
                    console.warn('Validation errors:', result.errors);
                }
            } else {
                this.showSuccess(result.message || 'Успешный вход');
                setTimeout(() => {
                    window.location.href = result.redirect || '/';
                }, 1500);
            }
        })
        .catch(error => {
            console.error('Signin error details:', {
                name: error.name,
                message: error.message,
                stack: error.stack
            });
            
            // User-friendly error messages
            const userFriendlyMessage = 
                error.name === 'TypeError' ? 
                    'Проблема с подключением к серверу' :
                error.name === 'SyntaxError' ?  
                    'Получен некорректный ответ от сервера' :
                    'Произошла ошибка при входе';
            
            this.showError(userFriendlyMessage);
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
        // Remove any existing error messages
        const existingError = input.parentNode.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }

        const value = input.value.trim();
        const type = input.type;
        let isValid = true;

        // Check for required fields
        if (input.hasAttribute('required') && value === '') {
            this.showFieldError(input, 'Это поле обязательно для заполнения');
            isValid = false;
        }

        // Специфические проверки по типу
        switch (type) {
            case 'email':
                const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
                if (!emailRegex.test(value)) {
                    this.showFieldError(input, 'Введите корректный адрес электронной почты');
                    isValid = false;
                }
                break;
            case 'password':
                // Проверка сложности пароля
                const passwordValidations = [
                    { regex: /.{8,}/, message: 'Пароль должен содержать не менее 8 символов' },
                    { regex: /[A-Z]/, message: 'Пароль должен содержать заглавную букву' },
                    { regex: /[a-z]/, message: 'Пароль должен содержать строчную букву' },
                    { regex: /[0-9]/, message: 'Пароль должен содержать цифру' },
                    { regex: /[!@#$%^&*()]/, message: 'Пароль должен содержать специальный символ' }
                ];

                for (let validation of passwordValidations) {
                    if (!validation.regex.test(value)) {
                        this.showFieldError(input, validation.message);
                        isValid = false;
                        break;  // Show only the first validation error
                    }
                }
                break;
        }

        // Custom validation attributes
        if (input.hasAttribute('data-validate')) {
            const customValidation = input.getAttribute('data-validate');
            switch (customValidation) {
                case 'match':
                    const matchTarget = document.querySelector(input.getAttribute('data-match-target'));
                    if (matchTarget && value !== matchTarget.value) {
                        this.showFieldError(input, 'Значения не совпадают');
                        isValid = false;
                    }
                    break;
            }
        }

        // Add/remove invalid class for styling
        input.classList.toggle('is-invalid', !isValid);

        return isValid;
    }

    showFieldError(input, message) {
        const errorElement = document.createElement('div');
        errorElement.classList.add('error-message');
        errorElement.textContent = message;
        input.parentNode.insertBefore(errorElement, input.nextSibling);
    }

    setupPasswordToggles() {
        this.passwordInputs.forEach(input => {
            const toggleBtn = document.createElement('button');
            toggleBtn.type = 'button';
            toggleBtn.classList.add('password-toggle');
            toggleBtn.innerHTML = '<i class="fas fa-eye"></i>';
            
            toggleBtn.addEventListener('click', () => {
                const type = input.type === 'password' ? 'text' : 'password';
                input.type = type;
                toggleBtn.querySelector('i').classList.toggle('fa-eye');
                toggleBtn.querySelector('i').classList.toggle('fa-eye-slash');
            });
            
            input.parentNode.insertBefore(toggleBtn, input.nextSibling);
        });
    }

    setupPasswordStrength() {
        const passwordInput = document.querySelector('input[type="password"]');
        if (passwordInput) {
            passwordInput.addEventListener('input', () => {
                const strength = this.calculatePasswordStrength(passwordInput.value);
                this.updatePasswordStrengthIndicator(strength);
            });
        }
    }

    calculatePasswordStrength(password) {
        let strength = 0;
        if (password.length >= 8) strength++;
        if (password.match(/[a-z]+/)) strength++;
        if (password.match(/[A-Z]+/)) strength++;
        if (password.match(/[0-9]+/)) strength++;
        if (password.match(/[$@#&!]+/)) strength++;
        return strength;
    }

    updatePasswordStrengthIndicator(strength) {
        const indicator = document.querySelector('.password-strength');
        if (indicator) {
            indicator.innerHTML = '';
            for (let i = 0; i < 5; i++) {
                const bar = document.createElement('div');
                bar.classList.add('strength-bar');
                if (i < strength) bar.classList.add('active');
                indicator.appendChild(bar);
            }
        }
    }

    setupSocialAuth() {
        const socialButtons = document.querySelectorAll('.social-button');
        socialButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const provider = button.getAttribute('data-provider');
                this.initiateSocialLogin(provider);
            });
        });
    }

    initiateSocialLogin(provider) {
        // Заглушка для социальной авторизации
        console.log(`Initiating login with ${provider}`);
        NotificationManager.show(`Вход через ${provider} временно недоступен`, 'warning');
    }

    showError(message) {
        NotificationManager.show(message, 'error');
    }

    showSuccess(message) {
        NotificationManager.show(message, 'success');
    }
}

// Initialize auth page functionality
document.addEventListener('DOMContentLoaded', () => {
    new AuthPage();
});
