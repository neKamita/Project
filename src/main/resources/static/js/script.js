// Данные для демонстрации (в реальном приложении будут получены с сервера)
const mockData = {
    topChefs: [
        { 
            id: 1, 
            name: "Гордон Рамзи", 
            specialty: "Высокая кухня", 
            avatar: "https://cdn-icons-png.flaticon.com/512/1946/1946429.png",
            verified: true
        },
        { 
            id: 2, 
            name: "Алена Иванова", 
            specialty: "Русская кухня", 
            avatar: "https://cdn-icons-png.flaticon.com/512/1946/1946429.png",
            verified: true
        },
        { 
            id: 3, 
            name: "Массимо Боттура", 
            specialty: "Итальянская кухня", 
            avatar: "https://cdn-icons-png.flaticon.com/512/1946/1946429.png",
            verified: true
        }
    ],
    recipes: [
        {
            id: 1,
            author: {
                name: "Гордон Рамзи",
                avatar: "https://cdn-icons-png.flaticon.com/512/1946/1946429.png",
                verified: true
            },
            title: "Идеальный стейк",
            image: "https://images.unsplash.com/photo-1600891964092-4316c288032e?ixlib=rb-4.0.3",
            likes: 1234,
            isSaved: true,
            description: "Секрет идеального стейка в правильной прожарке...",
            ingredients: ["Говядина", "Соль", "Перец", "Масло"],
            steps: ["Достаньте мясо за час до готовки", "Разогрейте сковороду..."]
        },
        {
            id: 2,
            author: {
                name: "Алена Иванова",
                avatar: "https://cdn-icons-png.flaticon.com/512/1946/1946429.png",
                verified: true
            },
            title: "Борщ по-домашнему",
            image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?ixlib=rb-4.0.3",
            likes: 892,
            isSaved: false,
            description: "Классический рецепт борща с секретными ингредиентами...",
            ingredients: ["Свекла", "Капуста", "Морковь", "Мясо"],
            steps: ["Сварите бульон", "Подготовьте овощи..."]
        }
    ]
};

let modal, addRecipeBtn, closeModalBtn, recipeForm, postsContainer, topChefsContainer;

function showConfirmation(message, onConfirm, onCancel) {
    const modal = document.createElement('div');
    modal.className = 'custom-confirm-modal';
    modal.innerHTML = `
        <div class="custom-confirm-content">
            <div class="custom-confirm-header">
                <h2><i class="fas fa-utensils"></i> Стать поваром</h2>
            </div>
            <div class="custom-confirm-body">
                <p>${message}</p>
            </div>
            <div class="custom-confirm-footer">
                <button class="cancel-btn">Остаться</button>
                <button class="confirm-btn">Перейти в профиль</button>
            </div>
        </div>
    `;

    modal.style.opacity = '0';
    document.body.appendChild(modal);
    setTimeout(() => modal.style.opacity = '1', 50);

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

// Проверка и установка темы при загрузке
function setupTheme() {
    const savedTheme = localStorage.getItem('darkTheme');
    if (savedTheme === 'true') {
        document.body.classList.add('dark-theme');
    } else if (savedTheme === null) {
        // Проверяем системные настройки темы
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
        if (prefersDark.matches) {
            document.body.classList.add('dark-theme');
            localStorage.setItem('darkTheme', 'true');
        }
    }
}

// Category Selection
function initializeCategorySelection() {
    const categoryLinks = document.querySelectorAll('.categories li a');
    
    categoryLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links
            categoryLinks.forEach(l => l.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
        });
    });
}

// Инициализация страницы
document.addEventListener('DOMContentLoaded', () => {
    setupTheme();
    initializeCategorySelection();
    // Инициализация DOM элементов
    modal = document.getElementById('createRecipeModal');
    
    // Проверяем, находимся ли мы на главной странице
    if (modal) {
        addRecipeBtn = document.querySelector('.nav-btn[title="Добавить рецепт"]');
        closeModalBtn = modal.querySelector('.close');
        recipeForm = document.getElementById('recipeForm');
        postsContainer = document.querySelector('.posts-container');
        topChefsContainer = document.querySelector('.top-chefs');

        renderTopChefs();
        renderRecipes();
        renderFavoriteChefs();
        initializeEventListeners();
        initMobileMenu();
        
        // Добавляем обработчик для загрузки изображений
        const recipeImage = document.getElementById('recipeImage');
        if (recipeImage) {
            recipeImage.addEventListener('change', handleImageUpload);
        }
    }
});

// Функция для отображения понравившихся поваров
function renderFavoriteChefs() {
    const favoriteChefs = [
        {
            name: 'Анна Петрова',
            avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
            recipes: 25,
            followers: 1200
        },
        {
            name: 'Иван Смирнов',
            avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
            recipes: 18,
            followers: 850
        },
        {
            name: 'Мария Иванова',
            avatar: 'https://randomuser.me/api/portraits/women/3.jpg',
            recipes: 32,
            followers: 2100
        }
    ];

    const favoriteChefsList = document.querySelector('.favorite-chefs');
    if (!favoriteChefsList) return;

    favoriteChefsList.innerHTML = favoriteChefs.map(chef => `
        <div class="chef-card">
            <img src="${chef.avatar}" alt="${chef.name}" class="chef-avatar">
            <div class="chef-info">
                <div class="chef-name">${chef.name}</div>
                <div class="chef-stats">
                    <span><i class="fas fa-utensils"></i> ${chef.recipes} рецептов</span>
                    <span><i class="fas fa-users"></i> ${chef.followers} подписчиков</span>
                </div>
            </div>
        </div>
    `).join('');
}

// Функции для модального окна
function openModal() {
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Предотвращаем прокрутку фона
    }
}

function closeModal() {
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = ''; // Возвращаем прокрутку
    }
}

// Отображение топ шеф-поваров
function renderTopChefs() {
    if (!topChefsContainer) return;
    
    mockData.topChefs.forEach(chef => {
        const chefElement = document.createElement('div');
        chefElement.className = 'chef-item';
        chefElement.innerHTML = `
            <img src="${chef.avatar}" alt="${chef.name}" class="chef-avatar">
            <div class="chef-info">
                <div class="chef-name">
                    ${chef.name}
                    ${chef.verified ? '<i class="fas fa-check-circle" style="color: var(--primary-color)"></i>' : ''}
                </div>
                <div class="chef-specialty">${chef.specialty}</div>
            </div>
        `;
        topChefsContainer.appendChild(chefElement);
    });
}

// Отображение рецептов
function renderRecipes() {
    if (!postsContainer) return;
    
    mockData.recipes.forEach(recipe => {
        const postElement = document.createElement('div');
        postElement.className = 'post';
        postElement.innerHTML = `
            <div class="post-header">
                <img src="${recipe.author.avatar}" alt="${recipe.author.name}" class="author-avatar">
                <div class="author-info">
                    <div class="author-name">
                        ${recipe.author.name}
                        ${recipe.author.verified ? '<i class="fas fa-check-circle"></i>' : ''}
                    </div>
                    <div class="post-meta">Опубликовано сегодня</div>
                </div>
                <button class="more-options"><i class="fas fa-ellipsis-h"></i></button>
            </div>
            <div class="post-image">
                <img src="${recipe.image}" alt="${recipe.title}">
            </div>
            <div class="post-actions">
                <button class="action-btn ${recipe.isSaved ? 'active' : ''}">
                    <i class="fas fa-bookmark"></i>
                </button>
                <button class="action-btn">
                    <i class="fas fa-heart"></i>
                    <span>${recipe.likes}</span>
                </button>
                <button class="action-btn">
                    <i class="fas fa-comment"></i>
                </button>
                <button class="action-btn">
                    <i class="fas fa-share"></i>
                </button>
            </div>
            <div class="post-content">
                <h3>${recipe.title}</h3>
                <p>${recipe.description}</p>
            </div>
        `;
        postsContainer.appendChild(postElement);
    });
}

// Инициализация обработчиков событий
function initializeEventListeners() {
    // Находим модальное окно и кнопку добавления рецепта
    const modal = document.getElementById('createRecipeModal');
    const addRecipeBtn = document.querySelector('.add-recipe-btn');
    
    if (!modal || !addRecipeBtn) return;
    
    const closeBtn = modal.querySelector('.close');

    // Открыть модальное окно с проверкой роли
    addRecipeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const userRole = addRecipeBtn.getAttribute('data-user-role');
        
        if (userRole !== 'ROLE_CHEF') {
            showConfirmation(
                'Для публикации рецептов необходимо стать поваром. Хотите перейти в профиль и получить статус повара?',
                () => {
                    LoaderManager.show();
                    window.location.href = '/profile';
                },
                () => {
                    NotificationManager.info('Вы можете стать поваром в любое время в своем профиле');
                }
            );
        } else {
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden'; // Предотвращаем прокрутку фона
        }
    });

    // Закрыть модальное окно при клике на крестик
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
            document.body.style.overflow = ''; // Возвращаем прокрутку
        });
    }

    // Закрыть модальное окно при клике вне его
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = ''; // Возвращаем прокрутку
        }
    });

    // Обработка формы создания рецепта
    const recipeForm = document.getElementById('recipeForm');
    if (recipeForm) {
        recipeForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // Здесь будет логика отправки формы
            NotificationManager.success('Рецепт успешно создан!');
            modal.style.display = 'none';
            document.body.style.overflow = '';
        });
    }
}

// Mobile Menu Toggle
function toggleMobileMenu() {
    const mobileMenu = document.querySelector('.mobile-menu');
    mobileMenu.classList.toggle('active');
    
    // Prevent body scrolling when menu is open
    if (mobileMenu.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = '';
    }
}

// Мобильное меню
function initMobileMenu() {
    const mobileMenu = document.querySelector('.mobile-menu');
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const menuClose = document.querySelector('.mobile-menu-close');
    
    if (menuToggle && mobileMenu && menuClose) {
        menuToggle.addEventListener('click', toggleMobileMenu);

        menuClose.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        });

        // Закрываем при клике вне меню
        mobileMenu.addEventListener('click', (e) => {
            if (e.target === mobileMenu) {
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
}

function handleFormSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    
    // Simulate form submission
    setTimeout(() => {
        Toast.show('Form submitted successfully', 'success');
        form.reset();
    }, 1000);
}

function handleError(error) {
    console.error('Error:', error);
    Toast.show(error.message || 'An error occurred', 'error');
}

function handleSuccess(message) {
    Toast.show(message, 'success');
}

function handleRecipeAction(action, recipeId) {
    switch(action) {
        case 'like':
            Toast.show('Recipe added to favorites', 'success');
            break;
        case 'save':
            Toast.show('Recipe saved to collection', 'success');
            break;
        case 'share':
            Toast.show('Share link copied to clipboard', 'info');
            break;
        default:
            Toast.show('Action completed', 'info');
    }
}

// Initialize AOS
document.addEventListener('DOMContentLoaded', function() {
    AOS.init({
        duration: 800,
        once: true
    });
});

// Функция для загрузки изображения
function handleImageUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const previewImage = document.getElementById('recipeImagePreview');
            if (previewImage) {
                previewImage.src = e.target.result;
                previewImage.style.display = 'block';
            }
        };
        reader.readAsDataURL(file);
    }
}

// Функция для переключения видимости sidebar
function toggleSidebar() {
  const sidebar = document.querySelector('.sidebar');
  sidebar.classList.toggle('active');
}

// Функции для отображения/скрытия индикатора загрузки
function showLoader() {
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
}

function hideLoader() {
    const loader = document.querySelector('.custom-loader-overlay');
    if (loader) {
        loader.classList.add('fade-out');
        setTimeout(() => {
            loader.remove();
            document.body.style.overflow = '';
        }, 300);
    }
}

// Обработка форм авторизации и регистрации
function setupAuthForms() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            showLoader();
            // Имитация задержки для демонстрации лоадера
            setTimeout(() => {
                loginForm.submit();
            }, 500);
        });
    }

    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            showLoader();
            // Имитация задержки для демонстрации лоадера
            setTimeout(() => {
                registerForm.submit();
            }, 500);
        });
    }
}

// Обновляем функцию setupNavigation
function setupNavigation() {
    const navButtons = document.querySelectorAll('.nav-buttons .nav-btn');
    
    navButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const title = button.getAttribute('title');
            
            if (title === 'Уведомления') {
                button.classList.toggle('active');
                e.stopPropagation();
                return;
            }

            e.preventDefault();
            showLoader();
            
            switch(title) {
                case 'Главная':
                    window.location.href = '/';
                    break;
                case 'Добавить рецепт':
                    const userRole = button.getAttribute('data-user-role');
                    if (userRole !== 'ROLE_CHEF') {
                        hideLoader();
                        showConfirmation(
                            'Для публикации рецептов необходимо стать поваром. Хотите перейти в профиль и получить статус повара?',
                            () => {
                                showLoader();
                                window.location.href = '/profile';
                            },
                            () => {
                                NotificationManager.info('Вы можете стать поваром в любое время в своем профиле');
                            }
                        );
                    } else {
                        window.location.href = '/create';
                    }
                    break;
                case 'Профиль':
                    window.location.href = '/profile';
                    break;
            }
        });
    });
}

// Добавляем глобальные обработчики навигации
document.addEventListener('DOMContentLoaded', () => {
    // Обработка всех ссылок
    document.addEventListener('click', (e) => {
        const link = e.target.closest('a');
        if (link && 
            !link.hasAttribute('data-no-loader') && 
            link.href && 
            link.href.startsWith(window.location.origin) &&
            !link.href.includes('#')) {
            e.preventDefault();
            showLoader();
            window.location.href = link.href;
        }
    });

    // Обработка форм
    document.addEventListener('submit', (e) => {
        const form = e.target;
        if (!form.hasAttribute('data-no-loader')) {
            showLoader();
        }
    });

    // Обработка навигации браузера
    window.addEventListener('popstate', () => {
        showLoader();
    });

    // Обработка логотипа
    const logo = document.querySelector('.logo');
    if (logo) {
        logo.addEventListener('click', (e) => {
            e.preventDefault();
            showLoader();
            window.location.href = '/';
        });
    }

    // Скрываем лоадер при полной загрузке страницы
    window.addEventListener('load', () => {
        hideLoader();
    });
});
