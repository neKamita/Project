// Theme management
const ThemeManager = {
    themeKey: 'chefshare-theme',
    darkThemeClass: 'dark-theme',

    init() {
        this.loadTheme();
        this.setupThemeToggle();
    },

    loadTheme() {
        // Применяем тему сразу, не дожидаясь загрузки DOM
        const savedTheme = localStorage.getItem(this.themeKey);
        if (savedTheme === 'dark') {
            document.documentElement.classList.add(this.darkThemeClass);
            document.body.classList.add(this.darkThemeClass);
        }
    },

    toggleTheme() {
        document.documentElement.classList.toggle(this.darkThemeClass);
        document.body.classList.toggle(this.darkThemeClass);
        const isDark = document.body.classList.contains(this.darkThemeClass);
        localStorage.setItem(this.themeKey, isDark ? 'dark' : 'light');
    },

    setupThemeToggle() {
        const themeToggle = document.querySelector('.theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }
    }
};

// Инициализируем тему сразу
ThemeManager.loadTheme();

// Form validation utilities
const FormValidator = {
    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email.toLowerCase());
    },

    validatePassword(password) {
        return password.length >= 8;
    },

    validateUsername(username) {
        return username.length >= 3 && username.length <= 30;
    },

    showError(element, message) {
        const formGroup = element.closest('.form-group');
        const errorDiv = formGroup.querySelector('.error-message') || document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.style.color = 'var(--primary-color)';
        errorDiv.style.fontSize = '0.8rem';
        errorDiv.style.marginTop = '0.5rem';
        errorDiv.textContent = message;
        
        if (!formGroup.querySelector('.error-message')) {
            formGroup.appendChild(errorDiv);
        }
        
        element.classList.add('error');
    },

    clearError(element) {
        const formGroup = element.closest('.form-group');
        const errorDiv = formGroup.querySelector('.error-message');
        if (errorDiv) {
            errorDiv.remove();
        }
        element.classList.remove('error');
    }
};

// Toast notifications
const Toast = {
    show(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type} fade-in`;
        toast.textContent = message;
        
        const container = document.querySelector('.toast-container') || this.createContainer();
        container.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.add('fade-out');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    },

    createContainer() {
        const container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
        return container;
    }
};

// Loading spinner
const LoadingSpinner = {
    show(container = document.body) {
        const spinner = document.createElement('div');
        spinner.className = 'loading-spinner';
        spinner.innerHTML = '<div class="spinner"></div>';
        container.appendChild(spinner);
    },

    hide() {
        const spinner = document.querySelector('.loading-spinner');
        if (spinner) {
            spinner.remove();
        }
    }
};

// Initialize common functionality
document.addEventListener('DOMContentLoaded', () => {
    ThemeManager.setupThemeToggle();
});

// Export utilities for use in other files
window.ChefShare = {
    ThemeManager,
    FormValidator,
    Toast,
    LoadingSpinner
};
