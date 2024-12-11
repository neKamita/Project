// Функции для отображения/скрытия индикатора загрузки
function showLoader() {
    window.ChefShare.LoaderManager.show();
}

function hideLoader() {
    window.ChefShare.LoaderManager.hide();
}



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
                showNotification('Рецепт добавлен в избранное');
            });
        }

        // Save button
        const saveBtn = card.querySelector('.save-btn');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => {
                showNotification('Рецепт сохранен в коллекцию');
            });
        }

        // Share button
        const shareBtn = card.querySelector('.share-btn');
        if (shareBtn) {
            shareBtn.addEventListener('click', () => {
                showNotification('Ссылка скопирована в буфер обмена');
            });
        }
    });
}

// Инициализация страницы
document.addEventListener('DOMContentLoaded', () => {
    setupProfileModal();
    setupProfileNavigation();
    setupBecomeChef();
    setupAvatarChange();
    setupCoverChange();
    setupNotifications();
    setupNavigation();
    setupThemeToggle();
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
        showNotification('Ошибка при загрузке рецептов');
        grid.innerHTML = '<div class="error-message">Не удалось загрузить рецепты. Пожалуйста, попробуйте позже.</div>';
    }
}

// Функции для работы с рецептами
function editRecipe(recipeId) {
    const recipe = userRecipes.find(r => r.id === recipeId);
    if (recipe) {
        showNotification('Редактирование рецепта будет доступно в ближайшее время');
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
                showNotification('Рецепт успешно удален');
            }
        } catch (error) {
            console.error('Error deleting recipe:', error);
            showNotification('Ошибка при удалении рецепта');
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
            showNotification('Спасибо за вашу оценку!');
        }
    } catch (error) {
        console.error('Error toggling like:', error);
        showNotification('Не удалось поставить лайк');
    }
}

function showComments(recipeId) {
    const recipe = userRecipes.find(r => r.id === recipeId);
    if (recipe) {
        showNotification('Комментарии будут доступны в ближайшее время');
    }
}

// Настройка обработчиков событий


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
    console.log('Handling image upload:', type);
    
    // Проверка типа и размера файла
    const validImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
    const maxSize = 5 * 1024 * 1024; // 5MB
    const maxGifSize = 10 * 1024 * 1024; // 10MB для GIF

    if (!validImageTypes.includes(file.type)) {
        showNotification('Пожалуйста, выберите изображение в формате JPEG, PNG или GIF', 'error');
        return;
    }

    // Проверка размера в зависимости от типа файла
    if (file.type === 'image/gif') {
        if (file.size > maxGifSize) {
            showNotification('Размер GIF файла не должен превышать 10MB', 'error');
            return;
        }
    } else if (file.size > maxSize) {
        showNotification('Размер файла не должен превышать 5MB', 'error');
        return;
    }

    const reader = new FileReader();
    
    reader.onload = function(e) {
        // Проверяем, что файл действительно изображение
        const img = new Image();
        img.onload = function() {
            if (type === 'avatar') {
                // Проверяем минимальные размеры для аватара
                if (img.width < 200 || img.height < 200) {
                    showNotification('Изображение должно быть не менее 200x200 пикселей', 'error');
                    return;
                }
                const avatarImg = document.querySelector('.profile-avatar img');
                if (avatarImg) {
                    avatarImg.src = e.target.result;
                    showNotification('Аватар успешно обновлен!', 'success');
                }
            } else if (type === 'cover') {
                const coverEl = document.querySelector('.profile-cover');
                if (coverEl) {
                    coverEl.style.backgroundImage = `url(${e.target.result})`;
                    showNotification('Обложка профиля успешно обновлена!', 'success');
                }
            }
        };
        
        img.onerror = function() {
            showNotification('Выбранный файл не является изображением', 'error');
        };
        
        img.src = e.target.result;
    };

    reader.onerror = function() {
        console.error('Error loading image');
        showNotification('Произошла ошибка при загрузке изображения', 'error');
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
    const becomeChefBtn = document.querySelector('.become-chef-btn');
    if (!becomeChefBtn) return;

    becomeChefBtn.addEventListener('click', () => {
        showConfirmation('Вы уверены, что хотите изменить свою роль?', () => {
            toggleChefRole();
        });
    });

    function toggleChefRole() {
        showLoader();
        fetch('/api/user/toggle-role', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showNotification(data.message);
                setTimeout(() => {
                    window.location.href = '/profile';
                }, 1000);
            } else {
                hideLoader();
                showNotification('Произошла ошибка при смене роли');
            }
        })
        .catch(error => {
            hideLoader();
            console.error('Error:', error);
            showNotification('Произошла ошибка при смене роли');
        });
    }
}

// Функция для отображения уведомлений
function showNotification(message, type = 'success') {
    window.ChefShare.Toast.show(message, type);
}

// Функция для обработки ошибок
function handleError(error) {
    console.error('Error:', error);
    showNotification(error.message || 'An error occurred');
}

// Функция для обработки успеха
function handleSuccess(message) {
    showNotification(message);
}

// Настройка модального окна
function setupProfileModal() {
    const modal = document.getElementById('editProfileModal');
    const editProfileBtn = document.querySelector('.settings-btn i.fa-edit')?.parentElement;
    const form = document.getElementById('editProfileForm');
    
    if (!modal || !editProfileBtn || !form) return;

    // Добавляем обработчики для специальных полей
    const specializationsInput = form.querySelector('input[name="specializations"]');
    const experienceSelect = form.querySelector('select[name="experience"]');
    
    if (specializationsInput && experienceSelect) {
        const userRole = document.querySelector('input[name="userRole"]')?.value;
        const isChef = userRole === 'ROLE_CHEF';
        
        if (!isChef) {
            [specializationsInput, experienceSelect].forEach(element => {
                element.disabled = true;
                element.style.cursor = 'not-allowed';
                element.style.opacity = '0.7';
            });
        }
    }

    const closeBtn = modal.querySelector('.close-btn');
    const cancelBtn = modal.querySelector('.cancel-btn');
    const saveBtn = modal.querySelector('.save-btn');

    function openModal() {
        modal.style.display = 'flex';
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modal.classList.remove('show');
        document.body.style.overflow = '';
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
    }

    // Закрытие при клике вне модального окна
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    // Закрытие по клавише Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('show')) {
            closeModal();
        }
    });

    editProfileBtn.addEventListener('click', openModal);
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (cancelBtn) cancelBtn.addEventListener('click', closeModal);

    if (saveBtn) {
        saveBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            
            fetch('/api/user/update-profile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(Object.fromEntries(formData))
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    closeModal();
                    showNotification('Профиль успешно обновлен');
                    // Обновляем значения на странице без перезагрузки
                    document.querySelector('.profile-name h1').innerHTML = 
                        `<span>${data.firstName}</span> <span>${data.lastName}</span>`;
                    
                    // Обновляем значения в форме
                    form.querySelector('input[name="firstName"]').value = data.firstName;
                    form.querySelector('input[name="lastName"]').value = data.lastName;
                    form.querySelector('input[name="email"]').value = data.email;
                    if (data.specializations) {
                        form.querySelector('input[name="specializations"]').value = data.specializations;
                    }
                    if (data.experience) {
                        form.querySelector('select[name="experience"]').value = data.experience;
                    }
                    if (data.about) {
                        form.querySelector('textarea[name="about"]').value = data.about;
                    }
                } else {
                    showNotification(data.message || 'Не удалось обновить профиль');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showNotification('Произошла ошибка при обновлении профиля');
            });
        });
    }
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
    showNotification('Градиент успешно применен');
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
                showNotification('Размер файла не должен превышать 5MB');
                coverImageInput.value = '';
                return;
            }

            if (!file.type.startsWith('image/')) {
                showNotification('Пожалуйста, выберите изображение');
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
                showNotification('Обложка профиля успешно обновлена');
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
            showNotification('Градиент успешно применен');
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
    const profileAvatar = document.querySelector('.profile-avatar img');
    const editAvatarBtn = document.querySelector('.edit-avatar');
    const changeAvatarModal = document.getElementById('changeAvatarModal');
    const avatarInput = document.getElementById('avatarInput');
    const avatarPreview = document.getElementById('avatarPreview');
    const defaultAvatarUrl = 'https://cdn-icons-png.flaticon.com/512/1946/1946429.png';
    const uploadBtn = changeAvatarModal?.querySelector('.upload-btn');
    const resetBtn = changeAvatarModal?.querySelector('.reset-btn');
    const closeBtn = changeAvatarModal?.querySelector('.close-btn');

    if (!profileAvatar || !editAvatarBtn || !changeAvatarModal || !avatarInput) return;

    // Загружаем сохраненный аватар
    const savedAvatar = localStorage.getItem('profileAvatar');
    if (savedAvatar) {
        profileAvatar.src = savedAvatar;
        if (avatarPreview) avatarPreview.src = savedAvatar;
    }

    // Открытие модального окна
    editAvatarBtn.addEventListener('click', () => {
        changeAvatarModal.classList.add('active');
        if (avatarPreview) avatarPreview.src = profileAvatar.src;
    });

    // Обработчик кнопки загрузки
    if (uploadBtn) {
        uploadBtn.addEventListener('click', () => {
            avatarInput.click();
        });
    }

    // Обработчик кнопки сброса
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            resetAvatar();
        });
    }

    // Обработчик кнопки закрытия
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            changeAvatarModal.classList.remove('active');
            avatarInput.value = '';
        });
    }

    // Обработчик выбора файла
    avatarInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Проверка размера файла
        if (file.size > 5 * 1024 * 1024) {
            showNotification('Размер файла не должен превышать 5MB');
            avatarInput.value = '';
            return;
        }

        // Проверка типа файла
        if (!file.type.startsWith('image/')) {
            showNotification('Пожалуйста, выберите изображение');
            avatarInput.value = '';
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                if (img.width < 200 || img.height < 200) {
                    showNotification('Изображение должно быть не менее 200x200 пикселей');
                    avatarInput.value = '';
                    return;
                }

                if (avatarPreview) avatarPreview.src = event.target.result;
                profileAvatar.src = event.target.result;
                localStorage.setItem('profileAvatar', event.target.result);
                
                profileAvatar.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    profileAvatar.style.transform = 'scale(1)';
                }, 200);

                changeAvatarModal.classList.remove('active');
                showNotification('Фото профиля успешно обновлено');
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(file);
    });
}

function resetAvatar() {
    const profileAvatar = document.querySelector('.profile-avatar img');
    const avatarPreview = document.getElementById('avatarPreview');
    const defaultAvatarUrl = 'https://cdn-icons-png.flaticon.com/512/1946/1946429.png';

    if (profileAvatar) {
        profileAvatar.src = defaultAvatarUrl;
    }
    if (avatarPreview) {
        avatarPreview.src = defaultAvatarUrl;
    }

    localStorage.removeItem('profileAvatar');
    showNotification('Фото профиля сброшено');
}

function updateProfile(data) {
    // Update profile name
    const profileName = document.querySelector('.profile-name h1');
    if (profileName) {
        profileName.innerHTML = `<span>${data.firstName}</span> <span>${data.lastName}</span>`;
    }

    // Update specializations
    const specializationsInput = document.querySelector('input[name="specializations"]');
    if (specializationsInput) {
        specializationsInput.value = data.specializations || '';
    }

    // Update about section
    const aboutTextarea = document.querySelector('textarea[name="about"]');
    if (aboutTextarea) {
        aboutTextarea.value = data.about || '';
    }

    // Update experience
    const experienceSelect = document.querySelector('select[name="experience"]');
    if (experienceSelect) {
        experienceSelect.value = data.experience || 'beginner';
    }

    // Update visible profile sections
    const profileBio = document.querySelector('.profile-bio');
    if (profileBio) {
        profileBio.textContent = data.about || '';
    }

    const specializationsElement = document.querySelector('.chef-specializations');
    if (specializationsElement) {
        specializationsElement.textContent = data.specializations || '';
    }
}

function setupProfileNavigation() {
    const profileNav = document.querySelector('.profile-nav');
    const recipesGrid = document.getElementById('recipesGrid');
    const settingsSection = document.getElementById('settingsSection');
    
    if (profileNav) {
        const buttons = profileNav.querySelectorAll('button');
        
        buttons.forEach(button => {
            button.addEventListener('click', () => {
                buttons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                const icon = button.querySelector('i');
                if (icon) {
                    if (icon.classList.contains('fa-cog')) {
                        recipesGrid.style.display = 'none';
                        settingsSection.style.display = 'block';
                        
                        // Add click handlers for settings buttons
                        const changePasswordBtn = settingsSection.querySelector('.settings-btn i.fa-key')?.parentElement;
                        const changeLangBtn = settingsSection.querySelector('.settings-btn i.fa-language')?.parentElement;
                        
                        if (changePasswordBtn) {
                            changePasswordBtn.addEventListener('click', () => {
                                showNotification('Функция изменения пароля будет доступна в ближайшее время');
                            });
                        }
                        
                        if (changeLangBtn) {
                            changeLangBtn.addEventListener('click', () => {
                                showNotification('Функция смены языка будет доступна в ближайшее время');
                            });
                        }
                    } else {
                        settingsSection.style.display = 'none';
                        recipesGrid.style.display = 'grid';
                    }
                }
            });
        });
    }
}

function showProfileSection(section) {
    // Hide all sections first
    const allSections = ['recipes', 'saved', 'liked', 'settings'];
    allSections.forEach(s => {
        const element = document.getElementById(`${s}Grid`);
        if (element) element.style.display = 'none';
    });
    
    // Show selected section
    const selectedSection = document.getElementById(`${section}Grid`);
    if (selectedSection) {
        selectedSection.style.display = 'grid';
        if (section === 'recipes') {
            renderRecipes();
        } else if (section === 'saved') {
            renderSavedRecipes();
        } else if (section === 'liked') {
            renderLikedRecipes();
        } else if (section === 'settings') {
            renderSettings();
        }
    }
}

function showConfirmation(message, onConfirm, onCancel) {
    // Создаем элементы модального окна
    const modal = document.createElement('div');
    modal.className = 'custom-confirm-modal';
    modal.innerHTML = `
        <div class="custom-confirm-content">
            <div class="custom-confirm-header">
                <h2><i class="fas fa-question-circle"></i> Подтверждение</h2>
            </div>
            <div class="custom-confirm-body">
                <p>${message}</p>
            </div>
            <div class="custom-confirm-footer">
                <button class="cancel-btn">Отмена</button>
                <button class="confirm-btn">Подтвердить</button>
            </div>
        </div>
    `;

    // Добавляем стили для анимации
    modal.style.opacity = '0';
    document.body.appendChild(modal);
    setTimeout(() => modal.style.opacity = '1', 50);

    // Обработчики кнопок
    const confirmBtn = modal.querySelector('.confirm-btn');
    const cancelBtn = modal.querySelector('.cancel-btn');

    confirmBtn.addEventListener('click', () => {
        modal.style.opacity = '0';
        setTimeout(() => {
            modal.remove();
            onConfirm?.();
        }, 300);
    });

    cancelBtn.addEventListener('click', () => {
        modal.style.opacity = '0';
        setTimeout(() => {
            modal.remove();
            onCancel?.();
        }, 300);
    });

    // Закрытие по клику вне окна
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.opacity = '0';
            setTimeout(() => {
                modal.remove();
                onCancel?.();
            }, 300);
        }
    });
}

// Add event listener for theme toggle switch to update theme preference
function setupThemeToggle() {
    const themeToggle = document.getElementById('darkThemeToggle');
    if (themeToggle) {
        themeToggle.checked = localStorage.getItem('chefshare-theme') === 'dark';
        themeToggle.addEventListener('change', () => {
            const isDark = themeToggle.checked;
            document.documentElement.classList.toggle('dark-theme', isDark);
            document.body.classList.toggle('dark-theme', isDark);
            localStorage.setItem('chefshare-theme', isDark ? 'dark' : 'light');
            console.log(`Theme set to: ${isDark ? 'dark' : 'light'}`);
        });
    }
}
