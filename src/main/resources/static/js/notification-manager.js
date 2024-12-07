// Notification Manager
class NotificationManager {
    static #createToast(message, type) {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        // Add icon based on type
        const icon = document.createElement('i');
        icon.className = 'fas';
        switch(type) {
            case 'success':
                icon.className += ' fa-check-circle';
                break;
            case 'error':
                icon.className += ' fa-times-circle';
                break;
            case 'warning':
                icon.className += ' fa-exclamation-triangle';
                break;
            case 'info':
                icon.className += ' fa-info-circle';
                break;
        }
        
        const text = document.createElement('span');
        text.textContent = message;
        
        toast.appendChild(icon);
        toast.appendChild(text);
        
        // Get or create toast container
        let container = document.querySelector('.toast-container');
        if (!container) {
            container = document.createElement('div');
            container.className = 'toast-container';
            document.body.appendChild(container);
        }
        
        container.appendChild(toast);
        
        // Remove toast after delay
        setTimeout(() => {
            toast.classList.add('hiding');
            setTimeout(() => {
                toast.remove();
                // Remove container if empty
                if (container.children.length === 0) {
                    container.remove();
                }
            }, 300);
        }, 3000);
    }

    // Public method for showing notifications
    static show(message, type = 'info') {
        this.#createToast(message, type);
    }

    static success(message) {
        this.#createToast(message, 'success');
    }
    
    static error(message) {
        this.#createToast(message, 'error');
    }
    
    static warning(message) {
        this.#createToast(message, 'warning');
    }
    
    static info(message) {
        this.#createToast(message, 'info');
    }
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
    // No initialization needed
});
