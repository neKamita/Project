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
    // Модальное окно для создания рецепта
    const modal = document.getElementById('createRecipeModal');
    const addRecipeBtn = document.querySelector('.nav-btn[title="Добавить рецепт"]');
    const closeBtn = modal.querySelector('.close');

    // Открыть модальное окно
    addRecipeBtn.addEventListener('click', () => {
        modal.style.display = 'block';
    });

    // Закрыть модальное окно при клике на крестик
    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Закрыть модальное окно при клике вне его
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Обработка формы создания рецепта
    const recipeForm = document.getElementById('recipeForm');
    const ingredientsList = document.querySelector('.ingredients-list');
    const stepsList = document.querySelector('.steps-list');
    const addIngredientBtn = document.querySelector('.add-ingredient');
    const addStepBtn = document.querySelector('.add-step');

    // Добавить ингредиент
    addIngredientBtn.addEventListener('click', () => {
        const ingredientItem = document.createElement('div');
        ingredientItem.className = 'ingredient-item';
        ingredientItem.innerHTML = `
            <input type="text" placeholder="Ингредиент">
            <input type="text" placeholder="Количество">
            <button type="button" class="remove-ingredient"><i class="fas fa-minus"></i></button>
        `;
        ingredientsList.appendChild(ingredientItem);
    });

    // Добавить шаг
    addStepBtn.addEventListener('click', () => {
        const stepItem = document.createElement('div');
        stepItem.className = 'step-item';
        stepItem.innerHTML = `
            <textarea placeholder="Опишите шаг"></textarea>
            <button type="button" class="remove-step"><i class="fas fa-minus"></i></button>
        `;
        stepsList.appendChild(stepItem);
    });

    // Удаление ингредиентов и шагов
    document.addEventListener('click', (e) => {
        if (e.target.closest('.remove-ingredient')) {
            e.target.closest('.ingredient-item').remove();
        }
        if (e.target.closest('.remove-step')) {
            e.target.closest('.step-item').remove();
        }
    });

    // Предварительный просмотр изображения
    const imageInput = document.getElementById('recipeImage');
    const imagePreview = document.querySelector('.image-preview');

    imageInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                imagePreview.style.display = 'block';
                imagePreview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
            };
            reader.readAsDataURL(file);
        }
    });
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
