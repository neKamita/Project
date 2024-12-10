// Global managers
const ThemeManager = {
    themeKey: 'chefshare-theme',
    darkThemeClass: 'dark-theme',

    init() {
        console.log('ThemeManager: Initializing...');
        this.loadTheme();
        this.setupThemeToggle();
        this.setupSettingsToggle();
    },

    loadTheme() {
        console.log('ThemeManager: Loading theme...');
        const savedTheme = localStorage.getItem(this.themeKey);
        console.log('ThemeManager: Saved theme:', savedTheme);
        if (savedTheme === 'dark') {
            document.documentElement.classList.add(this.darkThemeClass);
            document.body.classList.add(this.darkThemeClass);
            const toggle = document.getElementById('darkThemeToggle');
            if (toggle) toggle.checked = true;
        }
    },

    toggleTheme() {
        console.log('ThemeManager: Toggling theme...');
        try {
            document.documentElement.classList.toggle(this.darkThemeClass);
            document.body.classList.toggle(this.darkThemeClass);
            const isDark = document.body.classList.contains(this.darkThemeClass);
            localStorage.setItem(this.themeKey, isDark ? 'dark' : 'light');
            window.ChefShare.Toast.show(`Тема ${isDark ? 'тёмная' : 'светлая'} включена`, 'info');
            console.log('ThemeManager: Theme toggled to:', isDark ? 'dark' : 'light');
            
            const toggle = document.getElementById('darkThemeToggle');
            if (toggle) toggle.checked = isDark;
        } catch (error) {
            console.error('ThemeManager: Error toggling theme:', error);
        }
    },

    setupThemeToggle() {
        console.log('ThemeManager: Setting up theme toggle...');
        const themeToggle = document.querySelector('.theme-toggle');
        console.log('ThemeManager: Theme toggle button found:', !!themeToggle);
        if (themeToggle) {
            themeToggle.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('ThemeManager: Theme toggle clicked');
                this.toggleTheme();
            });
        }
    },

    setupSettingsToggle() {
        const toggle = document.getElementById('darkThemeToggle');
        if (toggle) {
            console.log('ThemeManager: Found settings toggle');
            toggle.checked = document.body.classList.contains(this.darkThemeClass);
            toggle.addEventListener('change', () => {
                console.log('ThemeManager: Settings toggle changed');
                this.toggleTheme();
            });
        }
    }
};

const Toast = {
    show(message, type = 'info') {
        const icons = {
            success: '<i class="fas fa-check-circle"></i>',
            error: '<i class="fas fa-times-circle"></i>',
            warning: '<i class="fas fa-exclamation-triangle"></i>',
            info: '<i class="fas fa-info-circle"></i>'
        };

        const toast = document.createElement('div');
        toast.className = `toast toast-${type} fade-in`;
        toast.innerHTML = `
            ${icons[type] || icons.info}
            <span class="toast-message">${message}</span>
        `;
        
        const container = document.querySelector('.toast-container') || this.createContainer();
        container.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.remove('fade-in');
            toast.classList.add('fade-out');
            
            setTimeout(() => {
                if (toast && toast.parentElement) {
                    toast.remove();
                }
            }, 1000);
        }, 2500);
    },

    createContainer() {
        const container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
        return container;
    }
};

const LoaderManager = {
    show: function() {
        const loader = document.createElement('div');
        loader.className = 'custom-loader-overlay';
        loader.style.pointerEvents = 'all';
        loader.innerHTML = `
            <div class="custom-loader">
                <div class="loader-spinner"></div>
                <div class="loader-text">Пожалуйста, подождите...</div>
            </div>
        `;
        document.body.appendChild(loader);
        document.body.style.overflow = 'hidden';
    },

    hide: function() {
        const loader = document.querySelector('.custom-loader-overlay');
        if (loader) {
            setTimeout(() => {
                loader.classList.add('fade-out');
                setTimeout(() => {
                    loader.remove();
                    document.body.style.overflow = '';
                }, 500);
            }, 100);
        }
    }
};

// Export utilities globally
window.ChefShare = {
    ThemeManager,
    Toast,
    LoaderManager
};

// Initialize managers
document.addEventListener('DOMContentLoaded', () => {
    window.ChefShare.ThemeManager.init();
});