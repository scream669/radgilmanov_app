// Система целей и навигации
const app = {
    currentScreen: 'goal-selection',
    selectedGoals: [],
    currentArticle: null,
    currentTheme: 'dark',
    textSize: 'medium',

    goals: [
        { id: 'discipline', name: 'Прокачать дисциплину', emoji: '💪' },
        { id: 'business', name: 'Запустить бизнес', emoji: '🚀' },
        { id: 'purpose', name: 'Найти предназначение', emoji: '✨' },
        { id: 'energy', name: 'Вернуть энергию', emoji: '⚡️' },
        { id: 'mindset', name: 'Прокачать мышление', emoji: '🧠' },
        { id: 'phone', name: 'Освободиться от телефона', emoji: '📵' },
        { id: 'health', name: 'Улучшить здоровье', emoji: '❤️' },
        { id: 'learning', name: 'Научиться учиться', emoji: '📚' },
        { id: 'happiness', name: 'Найти счастье', emoji: '😊' },
        { id: 'tech', name: 'Освоить технологии', emoji: '🤖' }
    ],

    // Категории для базы знаний
    categories: [
        { id: 'navigation', name: 'Навигация по карте', emoji: '🗺️' },
        { id: 'core', name: 'Ядро', emoji: '⭐️' },
        { id: 'system', name: 'Система', emoji: '⚙️' },
        { id: 'energy', name: 'Энергия', emoji: '⚡️' },
        { id: 'business', name: 'Бизнес', emoji: '💼' },
        { id: 'development', name: 'Развитие', emoji: '🌱' },
        { id: 'health', name: 'Здоровье', emoji: '❤️' },
        { id: 'reading', name: 'Чтение и знания', emoji: '📖' },
        { id: 'happiness', name: 'Счастье и баланс', emoji: '😊' },
        { id: 'motivation', name: 'Мотивация и послание', emoji: '🎯' },
        { id: 'technology', name: 'Технологии', emoji: '🤖' },
        { id: 'books', name: 'Книги, меняющие сознание', emoji: '📚' },
        { id: 'library', name: 'Библиотека РАД', emoji: '🏛️' }
    ],

    // Контент будет загружаться из content-data.js
    content: window.contentData || {},
    
    init() {
        // Загружаем сохраненные цели
        const savedGoals = JSON.parse(localStorage.getItem('selectedGoals') || '[]');
        this.selectedGoals = savedGoals;
        
        // Загружаем настройки темы и текста
        const savedTheme = localStorage.getItem('appTheme') || 'dark';
        const savedTextSize = localStorage.getItem('textSize') || 'medium';
        this.currentTheme = savedTheme;
        this.textSize = savedTextSize;
        this.applySettings();
        
        // === НОВАЯ ЛОГИКА СТАРТОВОЙ СТРАНИЦЫ ===
        if (this.selectedGoals.length > 0) {
            // ЕСТЬ выбранные цели → База знаний
            this.showFullLibrary();
        } else {
            // НЕТ целей → Выбор целей
            this.showGoalSelection();
        }

        // Инициализация Telegram Web App
        if (window.Telegram?.WebApp) {
            window.Telegram.WebApp.ready();
            window.Telegram.WebApp.expand();
        }
    },
    
        // === ДОБАВИТЬ ЭТИ ФУНКЦИИ ===
    applySettings() {
        // Применяем тему
        document.body.className = this.currentTheme + '-theme';
        // Применяем размер текста
        document.body.classList.add('text-size-' + this.textSize);
    },
    
        // === ДОБАВИТЬ ЭТУ ФУНКЦИЮ ===
    showSettingsMenu() {
        const html = `
            <div class="settings-overlay" onclick="app.hideSettingsMenu()">
                <div class="settings-panel" onclick="event.stopPropagation()">
                    <div class="settings-header">
                        <h3>Настройки</h3>
                        <button class="close-btn" onclick="app.hideSettingsMenu()">×</button>
                    </div>
                    <div class="setting-item">
                        <span>Тема:</span>
                        <button class="theme-toggle ${this.currentTheme === 'dark' ? 'active' : ''}" 
                                onclick="app.toggleTheme()">
                            ${this.currentTheme === 'dark' ? '☀️ Светлая' : '🌙 Тёмная'}
                        </button>
                    </div>
                    <div class="setting-item">
                        <span>Размер текста:</span>
                        <div class="text-size-controls">
                            <button class="text-size-btn ${this.textSize === 'small' ? 'active' : ''}" 
                                    onclick="app.changeTextSize('small')">A</button>
                            <button class="text-size-btn ${this.textSize === 'medium' ? 'active' : ''}" 
                                    onclick="app.changeTextSize('medium')">A</button>
                            <button class="text-size-btn ${this.textSize === 'large' ? 'active' : ''}" 
                                    onclick="app.changeTextSize('large')">A</button>
                        </div>
                    </div>
                    <div class="setting-item">
                        <span>Цели развития:</span>
                        <button class="settings-action-btn" onclick="app.showGoalSelection(); app.hideSettingsMenu()">
                            ${this.selectedGoals.length > 0 ? 'Изменить цели' : 'Выбрать цели'}
                        </button>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', html);
    },
    
    hideSettingsMenu() {
        const overlay = document.querySelector('.settings-overlay');
        if (overlay) {
            overlay.remove();
        }
    },
    // === КОНЕЦ ДОБАВЛЕНИЯ ===

    toggleTheme() {
        this.currentTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        localStorage.setItem('appTheme', this.currentTheme);
        this.applySettings();
    },
    
    changeTextSize(size) {
        this.textSize = size;
        localStorage.setItem('textSize', size);
        // Удаляем старые классы размера
        document.body.classList.remove('text-size-small', 'text-size-medium', 'text-size-large');
        // Добавляем новый
        document.body.classList.add('text-size-' + size);
    },
    // === КОНЕЦ ДОБАВЛЕНИЯ ===


    showGoalSelection() {
        this.currentScreen = 'goal-selection';
        
        const html = `
            <div class="header">
                <div class="logo">🚀</div>
                <h1>Расскажите, что для вас актуально прямо сейчас?</h1>
                <div class="subtitle">Выберите до 3-х целей</div>
            </div>
            
            <div class="counter" id="counter">Выбрано: ${this.selectedGoals.length}/3</div>
            
            <div id="goals-list">
                ${this.goals.map(goal => {
                    const isSelected = this.selectedGoals.includes(goal.id);
                    return `
                        <button class="goal-btn ${isSelected ? 'selected' : ''}" 
                                onclick="app.toggleGoal('${goal.id}')" 
                                id="goal-${goal.id}">
                            <span class="emoji">${goal.emoji}</span>
                            ${goal.name}
                            <span class="check">✓</span>
                        </button>
                    `;
                }).join('')}
            </div>
            
            <button class="action-btn" id="create-btn" onclick="app.showRouteReady()" 
                    ${this.selectedGoals.length === 0 ? 'disabled' : ''}>
                Выбрать
            </button>
        `;
        
        document.getElementById('app').innerHTML = html;
    },
    
    toggleGoal(goalId) {
        const index = this.selectedGoals.indexOf(goalId);
        const button = document.getElementById(`goal-${goalId}`);
        
        if (index > -1) {
            this.selectedGoals.splice(index, 1);
            button.classList.remove('selected');
        } else {
            if (this.selectedGoals.length < 3) {
                this.selectedGoals.push(goalId);
                button.classList.add('selected');
            }
        }
        
        this.updateCounter();
    },
    
    updateCounter() {
        const counter = document.getElementById('counter');
        const createBtn = document.getElementById('create-btn');
        
        if (counter) {
            counter.textContent = `Выбрано: ${this.selectedGoals.length}/3`;
        }
        
        if (createBtn) {
            createBtn.disabled = this.selectedGoals.length === 0;
        }
    },
    
    showRouteReady() {
        localStorage.setItem('selectedGoals', JSON.stringify(this.selectedGoals));
        this.currentScreen = 'route-ready';
        
        const html = `
            <div class="header">
                <div class="logo">🗺️</div>
                <h1>Ваш маршрут готов!</h1>
                <div class="subtitle">
                    На основе твоих целей мы собрали персональную подборку материалов. 
                    Здесь только то, что решает твои задачи.<br><br>
                    Ты всегда можешь изменить цели в настройках или исследовать всю базу знаний целиком.
                </div>
            </div>
            
            <button class="route-btn" onclick="app.showPersonalRoute()">
                Исследовать мой маршрут
            </button>
            
            <button class="route-btn" onclick="app.showFullLibrary()">
                Посмотреть всю базу знаний
            </button>
            
            <button class="back-btn" onclick="app.showGoalSelection()">
                ← Изменить цели
            </button>
        `;
        
        document.getElementById('app').innerHTML = html;
    },
    
    showPersonalRoute() {
        const selectedGoalsData = this.selectedGoals.map(id => 
            this.goals.find(goal => goal.id === id)
        );
        
        const html = `
            <button class="back-btn" onclick="app.showFullLibrary()">
                ← Назад
            </button>
            
            <div class="header">
                <h1>Ваша подборка</h1>
                <div class="subtitle">Материалы по вашим целям</div>
            </div>
            
            ${selectedGoalsData.map(goal => `
                <button class="goal-btn" onclick="app.showGoalDetail('${goal.id}')">
                    <span class="emoji">${goal.emoji}</span>
                    ${goal.name}
                    <span class="arrow">›</span>
                </button>
            `).join('')}
        `;
        
        document.getElementById('app').innerHTML = html;
    },
    
    showGoalDetail(goalId) {
        const goal = this.goals.find(g => g.id === goalId);
        const goalContent = this.content[goalId];
        
        if (!goalContent) {
            this.showPersonalRoute();
            return;
        }
        
        const html = `
            <button class="back-btn" onclick="app.showPersonalRoute()">
                ← Назад к подборке
            </button>
            
            <div class="header text-left">
                <h1>${goal.emoji} ${goal.name}</h1>
                <div class="goal-description">
                    ${goalContent.description || 'Описание цели'}
                </div>
            </div>
            
            ${goalContent.stages ? goalContent.stages.map((stage, index) => `
                <div class="stage-title">Этап ${index + 1}: ${stage.title}</div>
                ${stage.articles.map(article => `
                    <a class="article-link" onclick="app.showArticle('${goalId}', ${index}, ${stage.articles.indexOf(article)})">
                        ${article.title}
                    </a>
                `).join('')}
            `).join('') : '<div class="subtitle">Материалы скоро появятся</div>'}
        `;
        
        document.getElementById('app').innerHTML = html;
    },
    
    showArticle(goalId, stageIndex, articleIndex) {
        const goalContent = this.content[goalId];
        const article = goalContent.stages[stageIndex].articles[articleIndex];
        const goal = this.goals.find(g => g.id === goalId);
        
        this.currentArticle = { goalId, stageIndex, articleIndex };
        
        const html = `
            <button class="back-btn" onclick="app.showGoalDetail('${goalId}')">
                ← Назад к этапам
            </button>
            
            <div class="header text-left">
                <h1>${article.title}</h1>
                <div class="subtitle text-left">${goal.emoji} ${goal.name}</div>
            </div>
            
            <div class="article-content">
                ${article.content || 'Содержание статьи скоро появится...'}
            </div>
        `;
        
        document.getElementById('app').innerHTML = html;
    },
    
        showFullLibrary() {
        const html = `
            <!-- === ЗАМЕНИТЬ КНОПКУ НАЗАД НА МЕНЮ === -->
            <button class="menu-btn" onclick="app.showSettingsMenu()">
                ☰
            </button>
            
            <div class="header">
                <h1>Вся база знаний</h1>
                <div class="subtitle">Все доступные материалы по категориям</div>
            </div>
            
            <!-- === УБРАТЬ БЛОК НАСТРОЕК ОТСЮДА === -->
            
            <button class="category-btn" onclick="app.showPersonalRoute()">
                <span class="emoji">📋</span>
                Ваша подборка
                <span class="arrow">›</span>
            </button>
            
            ${this.categories.map(category => `
                <button class="category-btn" onclick="app.showCategory('${category.id}')">
                    <span class="emoji">${category.emoji}</span>
                    ${category.name}
                    <span class="arrow">›</span>
                </button>
            `).join('')}
        `;
        
        document.getElementById('app').innerHTML = html;
    },
    
    showCategory(categoryId) {
        const category = this.categories.find(c => c.id === categoryId);
        const categoryContent = this.content[categoryId];
        
        const html = `
            <button class="back-btn" onclick="app.showFullLibrary()">
                ← Назад к базе знаний
            </button>
            
            <div class="header text-left">
                <h1>${category.emoji} ${category.name}</h1>
                <div class="goal-description">
                    ${categoryContent?.description || 'Материалы этой категории'}
                </div>
            </div>
            
            ${categoryContent?.articles ? categoryContent.articles.map(article => `
                <a class="article-link" onclick="app.showCategoryArticle('${categoryId}', '${article.id}')">
                    ${article.title}
                </a>
            `).join('') : '<div class="subtitle">Материалы скоро появятся</div>'}
        `;
        
        document.getElementById('app').innerHTML = html;
    },
    
    showCategoryArticle(categoryId, articleId) {
        const category = this.categories.find(c => c.id === categoryId);
        const categoryContent = this.content[categoryId];
        const article = categoryContent?.articles?.find(a => a.id === articleId);
        
        const html = `
            <button class="back-btn" onclick="app.showCategory('${categoryId}')">
                ← Назад к категории
            </button>
            
            <div class="header text-left">
                <h1>${article?.title || 'Статья'}</h1>
                <div class="subtitle text-left">${category.emoji} ${category.name}</div>
            </div>
            
            <div class="article-content">
                ${article?.content || 'Содержание статьи скоро появится...'}
            </div>
        `;
        
        document.getElementById('app').innerHTML = html;
    }
};

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', function() {
    app.init();
});
