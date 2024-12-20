// Функция для отображения уведомлений
function showNotification(message, type = 'success') {
    const notificationsContainer = document.getElementById('notifications-container');
    if (!notificationsContainer) return;

    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas ${getIconForType(type)}"></i>
        <span>${message}</span>
    `;

    notificationsContainer.appendChild(notification);

    // Анимация появления
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);

    // Автоматическое скрытие через 3 секунды
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Вспомогательная функция для определения иконки уведомления
function getIconForType(type) {
    switch (type) {
        case 'success':
            return 'fa-check-circle';
        case 'error':
            return 'fa-exclamation-circle';
        case 'info':
            return 'fa-info-circle';
        default:
            return 'fa-info-circle';
    }
}

// Данные для демонстрации (в реальном приложении будут получены с сервера)
const mockData = window.mockData || {
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
    // Check if a modal is already present
    const existingModal = document.querySelector('.custom-confirm-modal');
    if (existingModal) {
        existingModal.remove(); // Remove the existing modal if it exists
    }

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

    const closeModal = () => {
        modal.style.opacity = '0';
        setTimeout(() => {
            modal.remove();
        }, 300);
    };

    confirmBtn.addEventListener('click', () => {
        closeModal();
        onConfirm?.();
    });

    cancelBtn.addEventListener('click', () => {
        closeModal();
        onCancel?.();
        showNotification('Вы остались на странице', 'info');
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
            onCancel?.();
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
    initializeEventListeners();
    renderRecipes();
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
    const recipesContainer = document.getElementById('recipes-container');
    if (!recipesContainer) return;

    fetch('/api/recipes')
        .then(response => response.json())
        .then(recipes => {
            recipesContainer.innerHTML = recipes.map(recipe => `
                <div class="recipe-card" data-recipe-id="${recipe.id}">
                    <div class="recipe-card-header">
                        <div class="recipe-card-options">
                            <button class="options-btn">
                                <i class="fas fa-ellipsis-v"></i>
                                <div class="options-dropdown">
                                    ${recipe.user.id === currentUserId ? `
                                        <a href="#" class="option-disable" onclick="handleRecipeAction('disable', ${recipe.id})">
                                            <i class="fas fa-eye-slash"></i> Скрыть рецепт
                                        </a>
                                    ` : ''}
                                </div>
                            </button>
                        </div>
                    </div>
                    <img src="${recipe.imagePath}" alt="${recipe.title}" class="recipe-image">
                    <div class="recipe-details">
                        <h3>${recipe.title}</h3>
                        <p>${recipe.description}</p>
                    </div>
                </div>
            `).join('');

            setupRecipeCardListeners();
        })
        .catch(error => {
            console.error('Error fetching recipes:', error);
            showNotification('Не удалось загрузить рецепты', 'error');
        });
}

function setupRecipeCardListeners() {
    const optionsBtns = document.querySelectorAll('.options-btn');
    optionsBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const dropdown = this.querySelector('.options-dropdown');
            dropdown.classList.toggle('show');
        });
    });

    document.addEventListener('click', () => {
        const dropdowns = document.querySelectorAll('.options-dropdown');
        dropdowns.forEach(dropdown => dropdown.classList.remove('show'));
    });
}

// Инициализация обработчиков событий
function initializeEventListeners() {
    const modal = document.getElementById('createRecipeModal');
    const addRecipeBtns = document.querySelectorAll('.add-recipe-btn');
    const closeBtn = modal?.querySelector('.close');
    const recipeForm = document.getElementById('recipeForm');
    
    if (!modal || !addRecipeBtns) return;

    // Открытие модального окна
    addRecipeBtns.forEach(addRecipeBtn => {
        addRecipeBtn.addEventListener('click', (e) => {
            console.log('Add recipe button clicked');
            e.preventDefault();
            const userRole = addRecipeBtn.getAttribute('data-user-role');
            
            if (userRole !== 'ROLE_CHEF') {
                showConfirmation(
                    'Для публикации рецептов необходимо стать поваром. Хотите перейти в профиль и получить статус повара?',
                    () => {
                        showLoader();
                        window.location.href = '/profile';
                    },
                    () => {
                        showNotification('Вы можете стать поваром в любое время в своем профиле', 'info');
                    }
                );
            } else {
                console.log('Opening modal');
                modal.style.display = 'block';
                document.body.style.overflow = 'hidden';
                console.log('Modal opened');
            }
            console.log('User Role:', userRole);
        });
    });

    // Закрытие модального окна
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
    }

    // Закрытие по клику вне модального окна
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });

    // Add event listener to the form submit event
    if (recipeForm) {
        recipeForm.addEventListener('submit', (e) => {
            concatenateIngredients();
            concatenateSteps();
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
        case 'disable':
            fetch(`/disable-recipe/${recipeId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => {
                if (response.ok) {
                    showNotification('Рецепт успешно скрыт', 'success');
                    renderRecipes();
                } else {
                    showNotification('Не удалось скрыть рецепт', 'error');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showNotification('Произошла ошибка', 'error');
            });
            break;
        // Other actions can be added here
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
   // Обновляем функцию setupNavigation
   function setupNavigation() {
       const navButtons = document.querySelectorAll('.nav-buttons .nav-btn');

       navButtons.forEach(button => {
           button.addEventListener('click', (e) => {
               const title = button.getAttribute('title');

               if (title === 'Добавить рецепт') {
                   const userRole = button.getAttribute('data-user-role');

                   if (userRole === 'ROLE_CHEF') {
                       // Open the recipe modal if the user is a chef
                       const modal = document.getElementById('createRecipeModal');
                       modal.style.display = 'block';
                       document.body.style.overflow = 'hidden'; // Prevent background scrolling
                   } else {
                       // Show confirmation notification if the user is not a chef
                       showConfirmation(
                           'Для публикации рецептов необходимо стать поваром. Хотите перейти в профиль и получить статус повара?',
                           () => {
                               showLoader();
                               window.location.href = '/profile';
                           },
                           () => {
                               showNotification('Вы можете стать поваром в любое время в своем профиле', 'info');
                           }
                       );
                   }
                   return; // Prevent further processing
               }

               // Handle other navigation cases
               e.preventDefault();
               showLoader();

               switch(title) {
                   case 'Главная':
                       window.location.href = '/';
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

// Function to initialize notification toggle
function setupNotificationToggle() {
    const notificationsButton = document.querySelector('.notifications-button');
    const notificationsContainer = document.getElementById('notifications-container');
    const closeBtn = notificationsContainer.querySelector('.close');

    // Toggle notifications container visibility
    notificationsButton.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent event from bubbling up
        notificationsContainer.style.display = notificationsContainer.style.display === 'none' ? 'block' : 'none';
    });

    // Close notifications container
    closeBtn.addEventListener('click', () => {
        notificationsContainer.style.display = 'none';
    });

    // Close notifications container when clicking outside of it
    window.addEventListener('click', (e) => {
        if (notificationsContainer.style.display === 'block' && !notificationsContainer.contains(e.target) && !notificationsButton.contains(e.target)) {
            notificationsContainer.style.display = 'none';
        }
    });
}

// Initialize the notification toggle when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    setupNotificationToggle();
});
