// Initialize ChefShare namespace if it doesn't exist
window.ChefShare = window.ChefShare || {};

// Loading Spinner functionality
ChefShare.LoadingSpinner = {
    show() {
        const spinner = document.querySelector('.loading-spinner');
        if (spinner) {
            spinner.classList.add('active');
        }
    },

    hide() {
        const spinner = document.querySelector('.loading-spinner');
        if (spinner) {
            spinner.classList.remove('active');
        }
    }
};
