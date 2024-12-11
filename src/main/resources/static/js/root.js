// Global managers
const ThemeManager = {
    themeKey: 'chefshare-theme',
    darkThemeClass: 'dark-theme',

    init() {
        console.log('ThemeManager: Initializing...');
        // Removed theme management from root.js
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
    // Removed theme management initialization
});

function showNotification(message, type = 'success') {
    const notificationsContainer = document.getElementById('notifications-container');
    if (!notificationsContainer) return;

    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas ${getIconForType(type)}"></i>
        <span>${message}</span>
    `;

    notificationsContainer.querySelector('.notifications-list').appendChild(notification);

    // Animation for showing the notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);

    // Auto-hide after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

function toggleNotifications() {
    const notificationsContainer = document.getElementById('notifications-container');
    if (notificationsContainer) {
        notificationsContainer.style.display = notificationsContainer.style.display === 'none' ? 'block' : 'none';
    }
}

function setupNotifications() {
    const notificationButton = document.querySelector('.notifications-button');
    const closeBtn = document.querySelector('.close');

    if (notificationButton) {
        notificationButton.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent event from bubbling up
            toggleNotifications(); // Toggle the notifications container
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent event from bubbling up
            toggleNotifications(); // Close the notifications container
        });
    }

    // Close notifications when clicking outside
    document.addEventListener('click', (e) => {
        if (notificationsContainer && notificationsContainer.style.display === 'block') {
            if (!notificationsContainer.contains(e.target) && !notificationButton.contains(e.target)) {
                notificationsContainer.style.display = 'none'; // Close the notifications container
            }
        }
    });
}

// Call the setup function when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', setupNotifications);

document.addEventListener('DOMContentLoaded', () => {
    const notificationsContainer = document.getElementById('notifications-container');
    
    // Check if notificationsContainer exists
    if (notificationsContainer) {
        const notificationButtons = document.querySelectorAll('.notifications-button');
        const closeBtn = notificationsContainer.querySelector('.close');

        // Setup event listeners for notification buttons
        notificationButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleNotifications(notificationsContainer);
            });
        });

        // Setup event listener for close button
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                toggleNotifications(notificationsContainer);
            });
        }

        // Close notifications when clicking outside
        document.addEventListener('click', (e) => {
            if (notificationsContainer.classList.contains('active')) {
                const isClickInside = notificationsContainer.contains(e.target) || 
                                      Array.from(notificationButtons).some(btn => btn.contains(e.target));
                if (!isClickInside) {
                    notificationsContainer.classList.remove('active');
                }
            }
        });
    }
});

// Function to toggle notifications
function toggleNotifications(notificationsContainer) {
    if (notificationsContainer) {
        notificationsContainer.classList.toggle('active');
    }
}

const notificationsContainer = document.getElementById('notifications-container');


function setupNotifications() {
    const notificationButtons = document.querySelectorAll('.notifications-button');
    
    // Ensure notificationsContainer is defined
    if (!notificationsContainer) {
        console.error('Notifications container not found');
        return;
    }

    // Your existing setup code...
    notificationButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleNotifications();
        });
    });

    const closeBtn = notificationsContainer.querySelector('.close');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            toggleNotifications();
        });
    }

    document.addEventListener('click', (e) => {
        if (notificationsContainer.classList.contains('active')) {
            const isClickInside = notificationsContainer.contains(e.target) || 
                                  Array.from(notificationButtons).some(btn => btn.contains(e.target));
            if (!isClickInside) {
                notificationsContainer.classList.remove('active');
            }
        }
    }); 

    

}