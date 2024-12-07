// Демо-данные для рецептов пользователя
const userRecipes = [
    {
        id: 1,
        title: "Паста Карбонара",
        description: "Классическая итальянская паста с беконом, сыром пармезан и яичным соусом. Время приготовления: 30 минут.",
        image: "https://images.unsplash.com/photo-1612874742237-6526221588e3?ixlib=rb-4.0.3",
        likes: 234,
        comments: 12
    },
    {
        id: 2,
        title: "Тирамису",
        description: "Нежный итальянский десерт с кофейным вкусом, маскарпоне и печеньем савоярди. Время приготовления: 1 час.",
        image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?ixlib=rb-4.0.3",
        likes: 456,
        comments: 28
    },
    {
        id: 3,
        title: "Ризотто с грибами",
        description: "Сливочное ризотто с белыми грибами и пармезаном. Время приготовления: 45 минут.",
        image: "https://images.unsplash.com/photo-1476124369491-e7addf5db371?ixlib=rb-4.0.3",
        likes: 189,
        comments: 15
    }
];

// Функция для обработки взаимодействий с рецептами
function setupRecipeInteractions() {
    document.querySelectorAll('.recipe-card').forEach(card => {
        // Like button
        const likeBtn = card.querySelector('.like-btn');
        if (likeBtn) {
            likeBtn.addEventListener('click', () => {
                NotificationManager.success('Рецепт добавлен в избранное');
            });
        }

        // Save button
        const saveBtn = card.querySelector('.save-btn');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => {
                NotificationManager.success('Рецепт сохранен в коллекцию');
            });
        }

        // Share button
        const shareBtn = card.querySelector('.share-btn');
        if (shareBtn) {
            shareBtn.addEventListener('click', () => {
                NotificationManager.info('Ссылка скопирована в буфер обмена');
            });
        }
    });
}

// Инициализация страницы
document.addEventListener('DOMContentLoaded', () => {
    // Core functionality
    setupModal();
    setupNavigation();
    setupSettings();
    setupNotifications();
    setupBecomeChef();
    setupEventListeners();
    renderRecipes();
    setupCoverChange();
    setupAvatarChange();
    setupImageUpload();
    
    // Apply gradients to elements that need them
    document.querySelectorAll('.gradient-bg').forEach(element => {
        applyGradient(element);
    });
    
    // Initialize AOS
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            once: true
        });
    }
    
    // Welcome notification
    setTimeout(() => {
        NotificationManager.success('Welcome to your profile!');
    }, 1000);
});

// Отображение рецептов
function renderRecipes() {
    const grid = document.getElementById('recipesGrid');
    if (!grid) {
        console.error('Recipe grid element not found');
        return;
    }

    try {
        const recipeCards = userRecipes.map(recipe => `
            <div class="recipe-card" data-aos="fade-up" data-aos-delay="${recipe.id * 100}">
                <div class="recipe-image">
                    <img src="${recipe.image}" alt="${recipe.title}" 
                         onerror="this.src='https://via.placeholder.com/300x200?text=Recipe+Image'">
                    <div class="recipe-overlay">
                        <button class="edit-recipe" onclick="editRecipe(${recipe.id})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="delete-recipe" onclick="deleteRecipe(${recipe.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                <div class="recipe-content">
                    <h3 class="recipe-title">${recipe.title}</h3>
                    <p class="recipe-description">${recipe.description}</p>
                    <div class="recipe-stats">
                        <button class="stat-btn" onclick="toggleLike(${recipe.id})">
                            <i class="fas fa-heart"></i>
                            <span>${recipe.likes}</span>
                        </button>
                        <button class="stat-btn" onclick="showComments(${recipe.id})">
                            <i class="fas fa-comment"></i>
                            <span>${recipe.comments}</span>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');

        grid.innerHTML = recipeCards;

        // Refresh AOS animations
        if (typeof AOS !== 'undefined') {
            AOS.refresh();
        }
    } catch (error) {
        console.error('Error rendering recipes:', error);
        NotificationManager.error('Ошибка при загрузке рецептов');
        grid.innerHTML = '<div class="error-message">Не удалось загрузить рецепты. Пожалуйста, попробуйте позже.</div>';
    }
}

// Функции для работы с рецептами
function editRecipe(recipeId) {
    const recipe = userRecipes.find(r => r.id === recipeId);
    if (recipe) {
        NotificationManager.info('Редактирование рецепта будет доступно в ближайшее время');
    }
}

function deleteRecipe(recipeId) {
    if (confirm('Вы уверены, что хотите удалить этот рецепт?')) {
        try {
            // В реальном приложении здесь будет API-запрос
            const index = userRecipes.findIndex(r => r.id === recipeId);
            if (index !== -1) {
                userRecipes.splice(index, 1);
                renderRecipes();
                NotificationManager.success('Рецепт успешно удален');
            }
        } catch (error) {
            console.error('Error deleting recipe:', error);
            NotificationManager.error('Ошибка при удалении рецепта');
        }
    }
}

function toggleLike(recipeId) {
    try {
        const recipe = userRecipes.find(r => r.id === recipeId);
        if (recipe) {
            // В реальном приложении здесь будет API-запрос
            recipe.likes = recipe.likes + 1;
            renderRecipes();
            NotificationManager.success('Спасибо за вашу оценку!');
        }
    } catch (error) {
        console.error('Error toggling like:', error);
        NotificationManager.error('Не удалось поставить лайк');
    }
}

function showComments(recipeId) {
    const recipe = userRecipes.find(r => r.id === recipeId);
    if (recipe) {
        NotificationManager.info('Комментарии будут доступны в ближайшее время');
    }
}

// Настройка обработчиков событий
function setupEventListeners() {
    const editProfileModal = document.getElementById('editProfileModal');
    const editProfileBtn = document.querySelector('.edit-profile-btn');
    const editProfileForm = document.getElementById('editProfileForm');
    
    if (editProfileModal && editProfileBtn) {
        const closeBtn = editProfileModal.querySelector('.close-btn');
        const cancelBtn = editProfileModal.querySelector('.cancel-btn');
        const saveBtn = editProfileModal.querySelector('.save-btn');

        // Открытие модального окна
        editProfileBtn.addEventListener('click', () => {
            editProfileModal.classList.add('show');
            document.body.style.overflow = 'hidden'; // Prevent scrolling
        });

        // Закрытие модального окна
        const closeModal = () => {
            editProfileModal.classList.remove('show');
            document.body.style.overflow = ''; // Restore scrolling
        };

        // Обработчики для кнопок закрытия
        if (closeBtn) closeBtn.addEventListener('click', closeModal);
        if (cancelBtn) cancelBtn.addEventListener('click', closeModal);
        if (saveBtn) {
            saveBtn.addEventListener('click', (e) => {
                e.preventDefault();
                if (editProfileForm) {
                    const formData = new FormData(editProfileForm);
                    const data = Object.fromEntries(formData);
                    updateProfile(data);
                    closeModal();
                    NotificationManager.success('Профиль успешно обновлен');
                }
            });
        }

        // Закрытие при клике вне модального окна
        window.addEventListener('click', (e) => {
            if (e.target === editProfileModal) {
                closeModal();
            }
        });

        // Закрытие по клавише Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && editProfileModal.classList.contains('show')) {
                closeModal();
            }
        });
    }
}

// Настройка обработчиков для загрузки изображений
function setupImageUpload() {
    const editAvatarBtn = document.querySelector('.edit-avatar');
    
    if (!editAvatarBtn) return;

    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    document.body.appendChild(fileInput);
    fileInput.style.display = 'none';

    editAvatarBtn.addEventListener('click', () => {
        console.log('Avatar button clicked'); // Для отладки
        fileInput.dataset.type = 'avatar';
        fileInput.click();
    });

    fileInput.addEventListener('change', (e) => {
        console.log('File selected'); // Для отладки
        if (e.target.files && e.target.files[0]) {
            handleImageUpload(fileInput.dataset.type, e.target.files[0]);
        }
        fileInput.value = '';
    });
}

// Функция для обработки загрузки изображений
function handleImageUpload(type, file) {
    console.log('Handling image upload:', type); // Для отладки
    // Проверка типа и размера файла
    const validImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!validImageTypes.includes(file.type)) {
        NotificationManager.error('Пожалуйста, выберите изображение в формате JPEG, PNG или GIF');
        return;
    }

    if (file.size > maxSize) {
        NotificationManager.error('Размер файла не должен превышать 5MB');
        return;
    }

    const reader = new FileReader();
    
    reader.onload = function(e) {
        console.log('Image loaded:', type); // Для отладки
        if (type === 'avatar') {
            const avatarImg = document.querySelector('.profile-avatar img');
            avatarImg.src = e.target.result;
            NotificationManager.success('Аватар успешно обновлен!');
        } else if (type === 'cover') {
            const coverEl = document.querySelector('.profile-cover');
            coverEl.style.backgroundImage = `url(${e.target.result})`;
            NotificationManager.success('Обложка профиля успешно обновлена!');
        }
    };

    reader.onerror = function() {
        console.error('Error loading image'); // Для отладки
        NotificationManager.error('Произошла ошибка при загрузке изображения');
    };

    reader.readAsDataURL(file);
}

// Настройка навигации
function setupNavigation() {
    const navButtons = document.querySelectorAll('.nav-buttons .nav-btn');
    
    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            const title = button.getAttribute('title');
            
            switch(title) {
                case 'Главная':
                    window.location.href = '/';
                    break;
                case 'Добавить рецепт':
                    window.location.href = '/create';
                    break;
                case 'Уведомления':
                    // Переключаем видимость выпадающего меню
                    button.classList.toggle('active');
                    event.stopPropagation(); // Предотвращаем всплытие события
                    break;
                case 'Профиль':
                    window.location.href = '/profile';
                    break;
            }
        });
    });

    // Закрываем выпадающее меню при клике вне его
    document.addEventListener('click', (event) => {
        const notificationBtn = document.querySelector('.nav-btn[title="Уведомления"]');
        if (!notificationBtn.contains(event.target)) {
            notificationBtn.classList.remove('active');
        }
    });

    // Обработчик для кнопки "Отметить все как прочитанные"
    const markAllReadBtn = document.querySelector('.mark-all-read');
    if (markAllReadBtn) {
        markAllReadBtn.addEventListener('click', (event) => {
            event.stopPropagation();
            const unreadItems = document.querySelectorAll('.notification-item.unread');
            unreadItems.forEach(item => {
                item.classList.remove('unread');
            });
            updateNotificationBadge(0);
        });
    }

    // Обработчик для отдельных уведомлений
    const notificationItems = document.querySelectorAll('.notification-item');
    notificationItems.forEach(item => {
        item.addEventListener('click', () => {
            if (item.classList.contains('unread')) {
                item.classList.remove('unread');
                const currentCount = parseInt(document.querySelector('.notification-badge').textContent);
                updateNotificationBadge(currentCount - 1);
            }
        });
    });

    // Добавляем обработчик для логотипа
    const logo = document.querySelector('.logo');
    if (logo) {
        logo.addEventListener('click', () => {
            window.location.href = '/';
        });
        logo.style.cursor = 'pointer';
    }
}

// Настройка настроек профиля
function setupSettings() {
    const settingsBtn = document.querySelector('.profile-nav button:nth-child(4)');
    const settingsSection = document.getElementById('settingsSection');
    const recipesGrid = document.getElementById('recipesGrid');

    // Находим кнопки и модальное окно
    const editProfileBtn = document.querySelector('button.settings-btn i.fa-edit').parentElement;
    const changePasswordBtn = document.querySelector('button.settings-btn i.fa-key').parentElement;
    const editProfileModal = document.getElementById('editProfileModal');

    if (settingsBtn && settingsSection && recipesGrid) {
        // Настройка переключения на вкладку настроек
        settingsBtn.addEventListener('click', () => {
            document.querySelectorAll('.profile-nav button').forEach(btn => btn.classList.remove('active'));
            settingsBtn.classList.add('active');
            recipesGrid.style.display = 'none';
            settingsSection.style.display = 'block';
        });

        // Настройка кнопки редактирования профиля
        if (editProfileBtn && editProfileModal) {
            const closeBtn = editProfileModal.querySelector('.close');
            const cancelBtn = editProfileModal.querySelector('.cancel-btn');
            const form = editProfileModal.querySelector('form');

            // Открытие модального окна
            editProfileBtn.addEventListener('click', (e) => {
                e.preventDefault();
                editProfileModal.style.display = 'block';
                setTimeout(() => editProfileModal.classList.add('show'), 10);
            });

            // Закрытие модального окна
            const closeModal = () => {
                editProfileModal.classList.remove('show');
                setTimeout(() => editProfileModal.style.display = 'none', 300);
            };

            closeBtn?.addEventListener('click', closeModal);
            cancelBtn?.addEventListener('click', closeModal);
            editProfileModal.addEventListener('click', (e) => {
                if (e.target === editProfileModal) closeModal();
            });

            // Обработка формы
            form?.addEventListener('submit', (e) => {
                e.preventDefault();
                const formData = new FormData(form);
                const data = Object.fromEntries(formData);
                updateProfile(data);
                closeModal();
                NotificationManager.success('Профиль успешно обновлен');
            });
        }

        // Настройка кнопки изменения пароля
        if (changePasswordBtn) {
            changePasswordBtn.addEventListener('click', (e) => {
                e.preventDefault();
                NotificationManager.info('Функция изменения пароля находится в разработке');
            });
        }
    }

    // Обработчики для других кнопок навигации
    document.querySelectorAll('.profile-nav button:not(:nth-child(4))').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.profile-nav button').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            settingsSection.style.display = 'none';
            recipesGrid.style.display = 'grid';
        });
    });

    // Настройка переключателей
    const switches = {
        'emailNotifications': {
            'ru': 'Уведомления по email',
            'en': 'Email notifications'
        },
        'pushNotifications': {
            'ru': 'Push-уведомления',
            'en': 'Push notifications'
        },
        'soundNotifications': {
            'ru': 'Звуковые уведомления',
            'en': 'Sound notifications'
        },
        'privateProfile': {
            'ru': 'Приватный профиль',
            'en': 'Private profile'
        },
        'showRecipes': {
            'ru': 'Отображение рецептов',
            'en': 'Show recipes'
        },
        'allowComments': {
            'ru': 'Комментарии к рецептам',
            'en': 'Recipe comments'
        }
    };

    const statusText = {
        'ru': {
            'enabled': 'включены',
            'disabled': 'отключены'
        },
        'en': {
            'enabled': 'enabled',
            'disabled': 'disabled'
        }
    };

    Object.entries(switches).forEach(([id, labels]) => {
        const switchElement = document.getElementById(id);
        if (switchElement) {
            // Загружаем сохраненное состояние
            const savedState = localStorage.getItem(id) === 'true';
            switchElement.checked = savedState;

            switchElement.addEventListener('change', function() {
                const isEnabled = this.checked;
                localStorage.setItem(id, isEnabled);
                
                const currentLang = localStorage.getItem('language') || 'ru';
                const label = labels[currentLang];
                const status = statusText[currentLang][isEnabled ? 'enabled' : 'disabled'];
                
                NotificationManager.info(
                    `${label} ${status}`,
                    'info'
                );
            });
        }
    });

    // Настройка языка
    const languageSelect = document.getElementById('languageSelect');
    if (languageSelect) {
        // Загружаем сохраненный язык
        const savedLanguage = localStorage.getItem('language') || 'ru';
        languageSelect.value = savedLanguage;

        languageSelect.addEventListener('change', function() {
            const selectedLanguage = this.value;
            localStorage.setItem('language', selectedLanguage);
            
            const languageNames = {
                'ru': {
                    'ru': 'Русский язык',
                    'en': 'Russian language'
                },
                'en': {
                    'ru': 'Английский язык',
                    'en': 'English language'
                }
            };
            
            const currentLang = selectedLanguage;
            const langName = languageNames[selectedLanguage][currentLang];
            
            const messages = {
                'ru': 'Язык изменен на',
                'en': 'Language changed to'
            };
            
            NotificationManager.success(
                `${messages[currentLang]} ${langName}`,
                'success'
            );
        });
    }
}

// Обработка уведомлений
function setupNotifications() {
    const notificationButtons = document.querySelectorAll('.notifications-button');
    const notificationsContainer = document.querySelector('.notifications-container');
    const closeBtn = document.querySelector('.close-btn');

    // Обработчики для кнопок уведомлений
    notificationButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleNotifications();
        });
    });

    // Обработчик для кнопки закрытия
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            toggleNotifications();
        });
    }

    // Закрытие при клике вне контейнера
    document.addEventListener('click', (e) => {
        if (notificationsContainer && notificationsContainer.classList.contains('active')) {
            const isClickInside = notificationsContainer.contains(e.target) || 
                                Array.from(notificationButtons).some(btn => btn.contains(e.target));
            if (!isClickInside) {
                notificationsContainer.classList.remove('active');
            }
        }
    });
}

// Функция переключения уведомлений
function toggleNotifications() {
    const notificationsContainer = document.querySelector('.notifications-container');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    if (notificationsContainer) {
        notificationsContainer.classList.toggle('active');
        
        // Закрываем мобильное меню при открытии уведомлений
        if (mobileMenu && mobileMenu.classList.contains('active')) {
            mobileMenu.classList.remove('active');
        }
        
        // Обновляем AOS анимации при открытии
        if (notificationsContainer.classList.contains('active')) {
            AOS.refresh();
        }
    }
}

// Close notifications when clicking outside
document.addEventListener('click', function(event) {
    const notificationsContainer = document.querySelector('.notifications-container');
    const notificationButtons = document.querySelectorAll('.notifications-button');
    
    if (notificationsContainer && notificationsContainer.classList.contains('active')) {
        const clickedOnButton = Array.from(notificationButtons).some(button => button.contains(event.target));
        if (!notificationsContainer.contains(event.target) && !clickedOnButton) {
            notificationsContainer.classList.remove('active');
        }
    }
});

// Обработка кнопки "Стать поваром"
function setupBecomeChef() {
    const becomeChefBtn = document.getElementById('becomeChefBtn');
    const chefAgreementModal = document.getElementById('chefAgreementModal');
    const chefAgreementCheckbox = document.getElementById('chefAgreementCheckbox');
    const confirmChefBtn = document.getElementById('confirmChefBtn');
    
    if (!becomeChefBtn) return;

    let isChef = localStorage.getItem('isChef') === 'true';
    updateChefStatus(isChef);

    // Обработчик клика по кнопке "Стать поваром"
    becomeChefBtn.addEventListener('click', function() {
        if (!isChef) {
            chefAgreementModal.classList.add('active');
            if (chefAgreementCheckbox) {
                chefAgreementCheckbox.checked = false;
                confirmChefBtn.disabled = true;
            }
        } else {
            removeChefStatus();
        }
    });

    // Обработчик чекбокса соглашения
    if (chefAgreementCheckbox) {
        chefAgreementCheckbox.addEventListener('change', function() {
            if (confirmChefBtn) {
                confirmChefBtn.disabled = !this.checked;
            }
        });
    }

    // Обработчик подтверждения
    if (confirmChefBtn) {
        confirmChefBtn.disabled = true; // Изначально кнопка неактивна
        
        confirmChefBtn.addEventListener('click', function(e) {
            e.preventDefault(); // Предотвращаем стандартное поведение
            
            if (!chefAgreementCheckbox || !chefAgreementCheckbox.checked) {
                NotificationManager.warning('Необходимо принять условия соглашения');
                // Добавляем подсветку чекбокса
                const checkbox = document.getElementById('chefAgreementCheckbox');
                if (checkbox) {
                    checkbox.parentElement.style.border = '2px solid #FF9800';
                    setTimeout(() => {
                        checkbox.parentElement.style.border = '';
                    }, 2000);
                }
                return false;
            }
            
            becomeChef();
            closeChefModal();
        });
    }

    // Функция закрытия модального окна
    window.closeChefModal = function() {
        if (chefAgreementModal) {
            chefAgreementModal.classList.remove('active');
            if (chefAgreementCheckbox) {
                chefAgreementCheckbox.checked = false;
            }
            if (confirmChefBtn) {
                confirmChefBtn.disabled = true;
            }
        }
    };

    function updateChefStatus(isChefStatus) {
        isChef = isChefStatus;
        if (becomeChefBtn) {
            becomeChefBtn.innerHTML = isChef ? 
                '<i class="fas fa-user"></i> Отказаться от статуса повара' : 
                '<i class="fas fa-utensils"></i> Стать поваром';
            becomeChefBtn.classList.toggle('is-chef', isChef);
        }
    }

    function becomeChef() {
        localStorage.setItem('isChef', 'true');
        updateChefStatus(true);
        NotificationManager.success('Поздравляем! Вы стали поваром!');
    }

    function removeChefStatus() {
        localStorage.setItem('isChef', 'false');
        updateChefStatus(false);
        NotificationManager.info('Вы отказались от статуса повара');
    }
}

// Функция для отображения уведомлений
function showNotification(message, type = 'success') {
    NotificationManager.show(message, type);
}

// Функция для обработки ошибок
function handleError(error) {
    console.error('Error:', error);
    NotificationManager.error(error.message || 'An error occurred');
}

// Функция для обработки успеха
function handleSuccess(message) {
    NotificationManager.success(message);
}

// Настройка модального окна
function setupModal() {
    const modal = document.getElementById('editProfileModal');
    const editProfileBtn = document.querySelector('.edit-profile-btn');
    
    if (!modal || !editProfileBtn) return;

    const closeBtn = modal.querySelector('.close-btn');
    const cancelBtn = modal.querySelector('.cancel-btn');
    const saveBtn = modal.querySelector('.save-btn');

    function openModal() {
        modal.style.display = 'flex';
        setTimeout(() => {
            modal.classList.add('show');
            document.body.style.overflow = 'hidden'; // Prevent scrolling
        }, 10);
    }

    function closeModal() {
        modal.classList.remove('show');
        document.body.style.overflow = ''; // Restore scrolling
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300); // Match the CSS transition duration
    }

    // Open modal
    editProfileBtn.addEventListener('click', openModal);

    // Close modal with close button
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }

    // Close modal with cancel button
    if (cancelBtn) {
        cancelBtn.addEventListener('click', closeModal);
    }

    // Save changes
    if (saveBtn) {
        saveBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const form = modal.querySelector('form');
            if (form) {
                const formData = new FormData(form);
                const data = Object.fromEntries(formData);
                updateProfile(data);
                closeModal();
                NotificationManager.success('Профиль успешно обновлен');
            }
        });
    }

    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.style.display === 'flex') {
            closeModal();
        }
    });
}

// Функция генерации случайного градиента
function getRandomGradient() {
    const gradients = [
        'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'linear-gradient(135deg, #6B73FF 0%, #000DFF 100%)',
        'linear-gradient(135deg, #b721ff 0%, #21d4fd 100%)',
        'linear-gradient(135deg, #3B2667 0%, #BC78EC 100%)',
        'linear-gradient(135deg, #24C6DC 0%, #514A9D 100%)',
        'linear-gradient(135deg, #FC466B 0%, #3F5EFB 100%)',
        'linear-gradient(135deg, #0BA360 0%, #3CBA92 100%)',
        'linear-gradient(135deg, #FF3CAC 0%, #784BA0 50%, #2B86C5 100%)',
        'linear-gradient(135deg, #8BC6EC 0%, #9599E2 100%)',
        'linear-gradient(135deg, #A9C9FF 0%, #FFBBEC 100%)',
        'linear-gradient(135deg, #21D4FD 0%, #B721FF 100%)',
        'linear-gradient(135deg, #3EECAC 0%, #EE74E1 100%)'
    ];
    
    return gradients[Math.floor(Math.random() * gradients.length)];
}

// Функция применения градиента
function applyGradient(element) {
    const profileCover = document.querySelector('.profile-cover');
    const gradient = element.style.background;
    localStorage.removeItem('profileCoverImage');
    profileCover.style.background = gradient;
    localStorage.setItem('profileCoverGradient', gradient);
    document.getElementById('changeCoverModal').classList.remove('active');
    NotificationManager.success('Градиент успешно применен');
}

// Функция для изменения обложки профиля
function setupCoverChange() {
    console.log('Setting up cover change functionality...');
    
    const editCoverBtn = document.querySelector('.edit-cover');
    const profileCover = document.querySelector('.profile-cover');
    const changeCoverModal = document.getElementById('changeCoverModal');
    const gradientPreviews = document.querySelectorAll('.gradient-preview');
    const generateGradientBtn = document.querySelector('.generate-gradient-btn');
    const coverImageInput = document.getElementById('coverImageInput');
    const uploadBtn = document.querySelector('.upload-btn');
    
    console.log('Found elements:', {
        editCoverBtn: !!editCoverBtn,
        profileCover: !!profileCover,
        changeCoverModal: !!changeCoverModal,
        coverImageInput: !!coverImageInput,
        uploadBtn: !!uploadBtn
    });
    
    // Загружаем сохраненную обложку при загрузке страницы
    const savedCoverImage = localStorage.getItem('profileCoverImage');
    const savedCoverGradient = localStorage.getItem('profileCoverGradient');
    
    if (savedCoverImage) {
        profileCover.style.backgroundImage = `url(${savedCoverImage})`;
    } else if (savedCoverGradient) {
        profileCover.style.background = savedCoverGradient;
    } else {
        const gradient = getRandomGradient();
        profileCover.style.background = gradient;
        localStorage.setItem('profileCoverGradient', gradient);
    }
    
    // Инициализация градиентов
    function updateGradientPreviews() {
        gradientPreviews.forEach(preview => {
            const gradient = getRandomGradient();
            preview.style.background = gradient;
            preview.dataset.gradient = gradient;
        });
    }
    
    // Открытие модального окна при клике на "Изменить обложку"
    if (editCoverBtn) {
        console.log('Adding click listener to edit cover button');
        editCoverBtn.removeEventListener('click', null); // Удаляем все предыдущие обработчики
        editCoverBtn.addEventListener('click', (e) => {
            console.log('Edit cover button clicked');
            e.stopPropagation(); // Останавливаем всплытие события
            e.preventDefault(); // Предотвращаем действие по умолчанию
            changeCoverModal.classList.add('active');
            updateGradientPreviews();
        });
    }
    
    // Открытие окна выбора файла только при клике на кнопку "Выбрать файл"
    if (uploadBtn) {
        console.log('Adding click listener to upload button');
        uploadBtn.removeEventListener('click', null); // Удаляем все предыдущие обработчики
        uploadBtn.addEventListener('click', (e) => {
            console.log('Upload button clicked');
            e.stopPropagation(); // Останавливаем всплытие события
            e.preventDefault(); // Предотвращаем действие по умолчанию
            coverImageInput.click();
        });
    }
    
    // Обработчик выбора файла
    if (coverImageInput) {
        console.log('Adding change listener to cover image input');
        coverImageInput.removeEventListener('change', null); // Удаляем все предыдущие обработчики
        coverImageInput.addEventListener('change', (e) => {
            console.log('File input changed');
            const file = e.target.files[0];
            if (!file) return;

            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                NotificationManager.error('Размер файла не должен превышать 5MB');
                coverImageInput.value = '';
                return;
            }

            if (!file.type.startsWith('image/')) {
                NotificationManager.error('Пожалуйста, выберите изображение');
                coverImageInput.value = '';
                return;
            }

            const reader = new FileReader();
            reader.onload = (event) => {
                localStorage.setItem('profileCoverImage', event.target.result);
                localStorage.removeItem('profileCoverGradient');
                profileCover.style.background = 'none';
                profileCover.style.backgroundImage = `url(${event.target.result})`;
                changeCoverModal.classList.remove('active');
                NotificationManager.success('Обложка профиля успешно обновлена');
            };
            reader.readAsDataURL(file);
        });
    }
    
    // Обработчик клика по градиенту
    gradientPreviews.forEach(preview => {
        preview.addEventListener('click', () => {
            const gradient = preview.style.background;
            localStorage.setItem('profileCoverGradient', gradient);
            localStorage.removeItem('profileCoverImage');
            profileCover.style.background = gradient;
            changeCoverModal.classList.remove('active');
            NotificationManager.success('Градиент успешно применен');
        });
    });
    
    // Обработчик генерации новых градиентов
    if (generateGradientBtn) {
        generateGradientBtn.addEventListener('click', updateGradientPreviews);
    }
    
    // Закрытие модального окна при клике вне его
    changeCoverModal.addEventListener('click', (e) => {
        if (e.target === changeCoverModal) {
            changeCoverModal.classList.remove('active');
        }
    });

    // Закрытие модального окна по кнопке закрытия
    const closeBtn = changeCoverModal.querySelector('.close-btn');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            changeCoverModal.classList.remove('active');
        });
    }
}

// Функция для изменения аватара профиля
function setupAvatarChange() {
    const editAvatarBtn = document.querySelector('.edit-avatar');
    const avatarInput = document.getElementById('avatarInput');
    const avatarPreview = document.getElementById('avatarPreview');
    const changeAvatarModal = document.getElementById('changeAvatarModal');
    const profileAvatar = document.querySelector('.profile-avatar img');
    const defaultAvatarUrl = 'https://cdn-icons-png.flaticon.com/512/1946/1946429.png';

    // Загружаем сохраненный аватар
    const savedAvatar = localStorage.getItem('profileAvatar');
    if (savedAvatar) {
        profileAvatar.src = savedAvatar;
        if (avatarPreview) avatarPreview.src = savedAvatar;
    }

    // Открытие модального окна
    if (editAvatarBtn) {
        editAvatarBtn.addEventListener('click', () => {
            changeAvatarModal.classList.add('active');
            if (avatarPreview) avatarPreview.src = profileAvatar.src;
        });
    }

    // Обработчик выбора файла
    if (avatarInput) {
        avatarInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;

            // Проверка размера файла
            if (file.size > 5 * 1024 * 1024) {
                NotificationManager.error('Размер файла не должен превышать 5MB');
                avatarInput.value = ''; // Сброс input
                return;
            }

            // Проверка типа файла
            if (!file.type.startsWith('image/')) {
                NotificationManager.error('Пожалуйста, выберите изображение');
                avatarInput.value = '';
                return;
            }

            const reader = new FileReader();
            reader.onload = (event) => {
                // Создаем временное изображение для проверки размеров
                const img = new Image();
                img.onload = () => {
                    // Проверка минимальных размеров
                    if (img.width < 200 || img.height < 200) {
                        NotificationManager.error('Изображение должно быть не менее 200x200 пикселей');
                        avatarInput.value = '';
                        return;
                    }

                    // Если все проверки пройдены, обновляем аватар
                    if (avatarPreview) avatarPreview.src = event.target.result;
                    profileAvatar.src = event.target.result;
                    localStorage.setItem('profileAvatar', event.target.result);
                    
                    // Добавляем анимацию
                    profileAvatar.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        profileAvatar.style.transform = 'scale(1)';
                    }, 200);

                    changeAvatarModal.classList.remove('active');
                    NotificationManager.success('Фото профиля успешно обновлено');
                };
                img.src = event.target.result;
            };

            reader.onerror = () => {
                NotificationManager.error('Ошибка при чтении файла');
                avatarInput.value = '';
            };

            reader.readAsDataURL(file);
        });
    }

    // Сброс аватара
    window.resetAvatar = function() {
        if (avatarPreview) avatarPreview.src = defaultAvatarUrl;
        profileAvatar.src = defaultAvatarUrl;
        localStorage.removeItem('profileAvatar');
        
        // Добавляем анимацию
        profileAvatar.style.transform = 'scale(0.95)';
        setTimeout(() => {
            profileAvatar.style.transform = 'scale(1)';
        }, 200);

        changeAvatarModal.classList.remove('active');
        NotificationManager.info('Фото профиля сброшено');
        
        // Сброс input file
        if (avatarInput) avatarInput.value = '';
    };

    // Закрытие модального окна при клике вне его
    changeAvatarModal.addEventListener('click', (e) => {
        if (e.target === changeAvatarModal) {
            changeAvatarModal.classList.remove('active');
            // Сброс input file при закрытии
            if (avatarInput) avatarInput.value = '';
        }
    });

    // Закрытие по клавише Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && changeAvatarModal.classList.contains('active')) {
            changeAvatarModal.classList.remove('active');
            if (avatarInput) avatarInput.value = '';
        }
    });
}

// Обновление данных профиля
function updateProfile(data) {
    const profileName = document.querySelector('.profile-name h1');
    const profileBio = document.querySelector('.profile-bio');
    
    profileName.textContent = data.name;
    profileBio.textContent = data.bio;
    // Обновление других полей профиля
}
