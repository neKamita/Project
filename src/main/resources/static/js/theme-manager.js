class ThemeManager {
    static init() {
        // Load saved theme on page load
        if (localStorage.getItem('darkTheme') === 'true') {
            document.body.classList.add('dark-theme');
            const themeToggle = document.getElementById('darkThemeToggle');
            if (themeToggle) themeToggle.checked = true;
        }

        // Set up theme toggles
        this.setupThemeToggles();
    }

    static setupThemeToggles() {
        // Checkbox toggle (profile page)
        const themeToggle = document.getElementById('darkThemeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('change', () => {
                this.toggleTheme();
                const isDark = document.body.classList.contains('dark-theme');
                NotificationManager.info(isDark ? 'Dark theme enabled' : 'Light theme enabled');
            });
        }

        // Nav toggle button (if exists)
        const navToggle = document.querySelector('.theme-toggle');
        if (navToggle) {
            navToggle.addEventListener('click', () => {
                this.toggleTheme();
            });
        }
    }

    static toggleTheme() {
        const isDark = !document.body.classList.contains('dark-theme');
        document.body.classList.toggle('dark-theme');
        localStorage.setItem('darkTheme', isDark);

        // Update any theme toggle checkboxes
        const themeToggle = document.getElementById('darkThemeToggle');
        if (themeToggle) {
            themeToggle.checked = isDark;
        }

        // Update any theme toggle buttons
        const navToggle = document.querySelector('.theme-toggle i');
        if (navToggle) {
            navToggle.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
        }
    }
}

// Initialize theme on page load
document.addEventListener('DOMContentLoaded', () => {
    ThemeManager.init();
});
