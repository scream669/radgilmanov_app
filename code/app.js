// Система целей и навигации

const app = {
    currentScreen: 'goal-selection',
    selectedGoals: [],
    currentArticle: null,
    currentTheme: 'dark',
    textSize: 'medium',
    
    // === НАВИГАЦИЯ (нормальный способ) ===
    navigationHistory: [],
    currentPage: null,

    shouldSkipLevel(item) {
        // Если есть прямая ссылка - не пропускаем
        if (item.directLink) return false;
        
        // Проверяем статьи (самый глубокий уровень)
        if (item.articles) {
            // Если только одна статья - пропускаем уровень тем
            return item.articles.length === 1 ? 'all' : false;
        }
        
        // Проверяем темы
        if (item.topics) {
            if (item.topics.length === 1) {
                const singleTopic = item.topics[0];
                // Если в единственной теме только одна статья
                if (singleTopic.articles && singleTopic.articles.length === 1) {
                    return 'all'; // Пропускаем все до статьи
                }
                return true; // Пропускаем только уровень тем
            }
            return false;
        }
        
        // Проверяем подразделы
        if (item.subsections) {
            if (item.subsections.length === 1) {
                const singleSubsection = item.subsections[0];
                const skipSubsection = this.shouldSkipLevel(singleSubsection);
                if (skipSubsection === 'all') return 'all';
                return skipSubsection || true;
            }
            return false;
        }
        
        return false;
    },
    saveCurrentState() {
    if (this.currentPage && this.currentPage.function !== 'showFullLibrary') {
        const lastInHistory = this.navigationHistory[this.navigationHistory.length - 1];
        if (!lastInHistory || 
            lastInHistory.function !== this.currentPage.function ||
            JSON.stringify(lastInHistory.args) !== JSON.stringify(this.currentPage.args)) {
            this.navigationHistory.push({...this.currentPage});
        }
    }
},
    navigateTo(pageFunction, ...args) {
        // Сохраняем текущую страницу в историю
        if (this.currentPage) {
            this.navigationHistory.push(this.currentPage);
        }
        
        // Устанавливаем новую страницу
        this.currentPage = { function: pageFunction, args: args };
        
        // Вызываем целевую функцию
        this[pageFunction].apply(this, args);
    },

    navigateBack() {
    console.log('Назад. История:', this.navigationHistory.length);
    
    if (this.navigationHistory.length > 0) {
        const previousPage = this.navigationHistory.pop();
        this.currentPage = previousPage;
        this[previousPage.function].apply(this, previousPage.args);
    } else {
        this.navigateTo('showFullLibrary');
    }
},

    getBackButton() {
        return `<button class="back-btn" onclick="app.navigateBack()">← Назад</button>`;
    },

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
        // === ИНИЦИАЛИЗАЦИЯ НАВИГАЦИИ ===
        this.navigationHistory = [];
        this.currentPage = null;

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
            ${this.getBackButton()}
            
            <div class="header">
                <h1>Ваша подборка</h1>
                <div class="subtitle">Материалы по вашим целям</div>
            </div>
            
            ${selectedGoalsData.map(goal => `
                <button class="goal-btn" onclick="app.navigateTo('showGoalDetail', '${goal.id}')">
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
            ${this.getBackButton()}
            
            <div class="header text-left">
                <h1>${goal.emoji} ${goal.name}</h1>
                <div class="goal-description">
                    ${goalContent.description || 'Описание цели'}
                </div>
            </div>
            
            ${goalContent.stages ? goalContent.stages.map((stage, index) => `
                <div class="stage-title">Этап ${index + 1}: ${stage.title}</div>
                ${stage.articles.map(article => `
                    <a class="article-link" onclick="app.navigateTo('showArticle', '${goalId}', ${index}, ${stage.articles.indexOf(article)})">
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
            ${this.getBackButton()}
            
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
                <img src="https://static.tildacdn.com/tild6166-3737-4633-b339-633337633036/4.png" class="logo-image" alt="Логотип">
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
                <button class="category-btn" onclick="app.navigateTo('showCategory', '${category.id}')">
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
    
    if (!categoryContent || !categoryContent.subsections) {
        // Резервный вариант для старых структур
        const html = `
            ${this.getBackButton()}
            
            <div class="header text-left">
                <h1>${category.emoji} ${category.name}</h1>
                <div class="goal-description">
                    ${categoryContent?.description || 'Материалы категории'}
                </div>
            </div>
            
            ${categoryContent?.articles ? categoryContent.articles.map(article => `
                <a class="article-link" onclick="app.showArticleContent('${article.id}')">
                    ${article.title}
                </a>
            `).join('') : '<div class="subtitle">Материалы скоро появятся</div>'}
        `;
        document.getElementById('app').innerHTML = html;
        return;
    }
    
    // === ПРОВЕРЯЕМ, НУЖНО ЛИ ПРОПУСКАТЬ УРОВЕНЬ ===
    const skipInfo = this.shouldSkipLevel(categoryContent);
    
    // Если есть прямая ссылка (как для навигации по карте)
    if (categoryContent.directLink) {
        const html = `
            ${this.getBackButton()}
            
            <div class="header text-left">
                <h1>${category.emoji} ${category.name}</h1>
                <div class="goal-description">
                    ${categoryContent.description}
                </div>
            </div>
            
            <button class="direct-link-btn" onclick="window.open('${categoryContent.directLink}', '_blank')">
                <span class="emoji">🔗</span>
                Открыть карту Miro
                <span class="arrow">↗</span>
            </button>
        `;
        document.getElementById('app').innerHTML = html;
        return;
    }
    
    // Если пропускаем все уровни до статьи
    if (skipInfo === 'all') {
        const singleSubsection = categoryContent.subsections[0];
        const singleTopic = singleSubsection.topics[0];
        const singleArticle = singleTopic.articles[0];
        
        // Показываем статью сразу
        this.saveCurrentState(); // ← ДОБАВЬТЕ ЭТУ СТРОЧКУ
this.currentPage = { function: 'showCategory', args: [categoryId] };
this.showArticleContent(singleArticle.id);
        return;
    }
    
    // Если пропускаем уровень подраздела
    if (skipInfo === true) {
        const singleSubsection = categoryContent.subsections[0];
        const skipTopicInfo = this.shouldSkipLevel(singleSubsection);
        
        // Если нужно пропустить и уровень тем
        if (skipTopicInfo === 'all') {
            const singleTopic = singleSubsection.topics[0];
            const singleArticle = singleTopic.articles[0];
            
            this.saveCurrentState(); // ← ДОБАВЬТЕ ЭТУ СТРОЧКУ
this.currentPage = { function: 'showCategory', args: [categoryId] };
this.showArticleContent(singleArticle.id);
            return;
        }
        
        // Показываем темы сразу
        const html = `
            ${this.getBackButton()}
            
            <div class="header text-left">
                <h1>${category.emoji} ${category.name}</h1>
                <div class="goal-description">
                    ${categoryContent.description}
                </div>
            </div>
            
            ${singleSubsection.topics.map((topic, topicIndex) => {
                const topicSkipInfo = this.shouldSkipLevel(topic);
                
                if (topicSkipInfo === 'all') {
                    const singleArticle = topic.articles[0];
                    return `
                        <button class="goal-btn" onclick="app.showArticleContent('${singleArticle.id}')">
                            <span class="emoji">📄</span>
                            ${topic.title}
                            <span class="arrow">›</span>
                        </button>
                    `;
                } else {
                    return `
                        <button class="goal-btn" onclick="app.navigateTo('showTopic', '${categoryId}', 0, ${topicIndex})">
                            <span class="emoji">📄</span>
                            ${topic.title}
                            <span class="arrow">›</span>
                        </button>
                    `;
                }
            }).join('')}
        `;
        
        document.getElementById('app').innerHTML = html;
        return;
    }
        
        // Новая структура с подразделами
        const html = `
            ${this.getBackButton()}
            
            <div class="header text-left">
                <h1>${category.emoji} ${category.name}</h1>
                <div class="goal-description">
                    ${categoryContent.description}
                </div>
            </div>
            
            ${categoryContent.subsections.map((subsection, index) => `
                <button class="goal-btn" onclick="app.navigateTo('showSubsection', '${categoryId}', ${index})">
                    <span class="emoji">📁</span>
                    ${subsection.title}
                    <span class="arrow">›</span>
                </button>
            `).join('')}
        `;
        
        document.getElementById('app').innerHTML = html;
    },
    
        showSubsection(categoryId, subsectionIndex) {
    console.log('showSubsection работает!', categoryId, subsectionIndex);
    
    const category = this.categories.find(c => c.id === categoryId);
    const categoryContent = this.content[categoryId];
    
    if (!categoryContent || !categoryContent.subsections) {
        this.showCategory(categoryId);
        return;
    }
        
        const subsection = categoryContent.subsections[subsectionIndex];
        
        const html = `
            ${this.getBackButton()}
            
            <div class="header text-left">
                <h1>${subsection.title}</h1>
                <div class="goal-description">
                    ${categoryContent.description}
                </div>
            </div>
            
            ${subsection.topics.map((topic, topicIndex) => `
                <button class="goal-btn" onclick="app.navigateTo('showTopic', '${categoryId}', ${subsectionIndex}, ${topicIndex})">
                    <span class="emoji">📄</span>
                    ${topic.title}
                    <span class="arrow">›</span>
                </button>
            `).join('')}
        `;
        
        document.getElementById('app').innerHTML = html;
    },

        showTopic(categoryId, subsectionIndex, topicIndex) {
        console.log('showTopic работает!', categoryId, subsectionIndex, topicIndex);
        
        const category = this.categories.find(c => c.id === categoryId);
        const categoryContent = this.content[categoryId];
        
        if (!categoryContent || !categoryContent.subsections) {
            this.showCategory(categoryId);
            return;
        }
        
        const subsection = categoryContent.subsections[subsectionIndex];
        const topic = subsection.topics[topicIndex];
        
        // === ДОБАВЬ ЭТУ ПРОВЕРКУ ===
        // Если в теме только одна статья - открываем ее сразу
        if (topic.articles && topic.articles.length === 1) {
            this.showArticleContent(topic.articles[0].id);
            return;
        }
        // === КОНЕЦ ДОБАВЛЕНИЯ ===
        
        const html = `
            ${this.getBackButton()}
            
            <div class="header text-left">
                <h1>${topic.title}</h1>
                <div class="goal-description">
                    Материалы по теме
                </div>
            </div>
            
            ${topic.articles.map(article => `
                <a class="article-link" onclick="app.navigateTo('showArticleContent', '${article.id}')">
                    ${article.title}
                </a>
            `).join('')}
        `;
        
        document.getElementById('app').innerHTML = html;
    },

        showArticleContent(articleId) {
        if (this.currentPage && this.currentPage.function !== 'showArticleContent') {
            this.saveCurrentState();
        }
        console.log('showArticleContent работает!', articleId);
        
        // Универсальный поиск статьи
        let foundArticle = null;
        let articleCategory = null;
        
        for (const [categoryId, categoryContent] of Object.entries(this.content)) {
            if (categoryContent.subsections) {
                for (const subsection of categoryContent.subsections) {
                    for (const topic of subsection.topics) {
                        const article = topic.articles.find(a => a.id === articleId);
                        if (article) {
                            foundArticle = article;
                            articleCategory = this.categories.find(c => c.id === categoryId);
                            break;
                        }
                    }
                    if (foundArticle) break;
                }
            }
            if (foundArticle) break;
        }
        
        if (!foundArticle) {
            this.showFullLibrary();
            return;
        }
        
        
        const html = `
            ${this.getBackButton()}
            
            <div class="header text-left">
                <h1>${foundArticle.title}</h1>
                <div class="subtitle text-left">${articleCategory.emoji} ${articleCategory.name}</div>
            </div>
            
            <div class="article-content">
                ${foundArticle.content}
            </div>
        `;
        
        document.getElementById('app').innerHTML = html;
    },
    
    showCategoryArticle(categoryId, articleId) {
        const category = this.categories.find(c => c.id === categoryId);
        const categoryContent = this.content[categoryId];
        const article = categoryContent?.articles?.find(a => a.id === articleId);
        
        const html = `
            ${this.getBackButton()}
            
            <div class="header text-left">
                <h1>${article?.title || 'Статья'}</h1>
                <div class="subtitle text-left">${category.emoji} ${category.name}</div>
            </div>
            
            <div class="article-content">
                ${article?.content || 'Содержание статьи скоро появится...'}
            </div>
        `;
        
        document.getElementById('app').innerHTML = html;
    },
    // === ДОБАВЬ ЗДЕСЬ НОВУЮ ФУНКЦИЮ ===
        // === Функция просмотра фото (УЖЕ ЕСТЬ У ВАС - проверьте) ===
    // === Функция просмотра фото с зумом ===
showPhotoViewer(photoUrl, photoTitle) {
    // Сохраняем текущее состояние перед открытием фото
    if (this.currentPage && this.currentPage.function !== 'showPhotoViewer') {
        this.saveCurrentState();
    }
    
    const html = `
        <div id="photo-viewer" class="photo-viewer-overlay" onclick="app.closePhotoViewer()">
            <div class="photo-viewer-header">
                <button class="back-btn" onclick="app.closePhotoViewer()">← Назад</button>
                <div class="photo-title">${photoTitle || 'Фотография'}</div>
                <button class="zoom-btn" onclick="app.resetPhotoZoom()" style="background: none; border: none; color: white; font-size: 20px; padding: 5px 10px;">⎌</button>
            </div>
            
            <div class="photo-container" id="photo-container">
                <img src="${photoUrl}" 
                     alt="${photoTitle || 'Фото'}" 
                     class="zoomable-photo"
                     id="zoomable-photo"
                     onload="app.initPhotoZoom()">
            </div>
            
            <div class="photo-controls">
                <div class="zoom-hint">Двойное нажатие для зума • Движение для прокрутки</div>
            </div>
        </div>
    `;
    
    document.getElementById('app').innerHTML = html;
    this.currentPage = { 
        function: 'showPhotoViewer', 
        args: [photoUrl, photoTitle] 
    };
},

closePhotoViewer() {
    this.navigateBack();
},

resetPhotoZoom() {
    const photo = document.getElementById('zoomable-photo');
    if (photo) {
        photo.style.transform = 'scale(1) translate(0px, 0px)';
        photo.dataset.scale = '1';
        photo.dataset.translateX = '0';
        photo.dataset.translateY = '0';
    }
},

initPhotoZoom() {
    const photo = document.getElementById('zoomable-photo');
    const container = document.getElementById('photo-container');
    
    if (!photo || !container) return;
    
    let currentScale = 1;
    let currentTranslateX = 0;
    let currentTranslateY = 0;
    let isDragging = false;
    let startX, startY, initialTranslateX, initialTranslateY;
    let lastTapTime = 0;
    let doubleTapTimeout;
    
    // Сохраняем состояние в data-атрибутах
    photo.dataset.scale = '1';
    photo.dataset.translateX = '0';
    photo.dataset.translateY = '0';
    
    // Двойное нажатие для зума
    photo.addEventListener('click', (e) => {
        const currentTime = new Date().getTime();
        const tapLength = currentTime - lastTapTime;
        
        if (tapLength < 300 && tapLength > 0) {
            // Двойной тап
            e.preventDefault();
            e.stopPropagation();
            
            if (currentScale === 1) {
                // Увеличиваем
                currentScale = 2;
                
                // Центрируем на точке нажатия
                const rect = photo.getBoundingClientRect();
                const offsetX = e.clientX - rect.left;
                const offsetY = e.clientY - rect.top;
                
                // Смещаем так, чтобы точка нажатия стала центром
                const containerRect = container.getBoundingClientRect();
                currentTranslateX = (containerRect.width / 2 - offsetX) * (currentScale - 1);
                currentTranslateY = (containerRect.height / 2 - offsetY) * (currentScale - 1);
            } else {
                // Сбрасываем
                currentScale = 1;
                currentTranslateX = 0;
                currentTranslateY = 0;
            }
            
            applyTransform();
            lastTapTime = 0;
            
            if (doubleTapTimeout) {
                clearTimeout(doubleTapTimeout);
            }
        } else {
            // Одиночный тап - пока не делаем ничего
            lastTapTime = currentTime;
            
            doubleTapTimeout = setTimeout(() => {
                lastTapTime = 0;
            }, 300);
        }
    });
    
    // Драг для прокрутки при зуме
    photo.addEventListener('mousedown', startDrag);
    photo.addEventListener('touchstart', (e) => {
        e.preventDefault();
        startDrag({
            clientX: e.touches[0].clientX,
            clientY: e.touches[0].clientY
        });
    });
    
    function startDrag(e) {
        if (currentScale > 1) {
            isDragging = true;
            startX = e.clientX - currentTranslateX;
            startY = e.clientY - currentTranslateY;
            initialTranslateX = currentTranslateX;
            initialTranslateY = currentTranslateY;
            
            document.addEventListener('mousemove', drag);
            document.addEventListener('touchmove', touchDrag);
            document.addEventListener('mouseup', stopDrag);
            document.addEventListener('touchend', stopDrag);
        }
    }
    
    function drag(e) {
        if (isDragging) {
            e.preventDefault();
            currentTranslateX = e.clientX - startX;
            currentTranslateY = e.clientY - startY;
            applyTransform();
        }
    }
    
    function touchDrag(e) {
        if (isDragging) {
            e.preventDefault();
            currentTranslateX = e.touches[0].clientX - startX;
            currentTranslateY = e.touches[0].clientY - startY;
            applyTransform();
        }
    }
    
    function stopDrag() {
        isDragging = false;
        document.removeEventListener('mousemove', drag);
        document.removeEventListener('touchmove', touchDrag);
        document.removeEventListener('mouseup', stopDrag);
        document.removeEventListener('touchend', stopDrag);
        
        // Ограничиваем движение пределами контейнера
        const maxTranslate = calculateMaxTranslate();
        currentTranslateX = Math.max(Math.min(currentTranslateX, maxTranslate.maxX), maxTranslate.minX);
        currentTranslateY = Math.max(Math.min(currentTranslateY, maxTranslate.maxY), maxTranslate.minY);
        applyTransform();
    }
    
    function calculateMaxTranslate() {
        const photoRect = photo.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        
        const scaledWidth = photoRect.width;
        const scaledHeight = photoRect.height;
        
        const maxX = Math.max(0, (scaledWidth - containerRect.width) / 2);
        const minX = -maxX;
        const maxY = Math.max(0, (scaledHeight - containerRect.height) / 2);
        const minY = -maxY;
        
        return { maxX, minX, maxY, minY };
    }
    
    function applyTransform() {
        // Сохраняем состояние
        photo.dataset.scale = currentScale;
        photo.dataset.translateX = currentTranslateX;
        photo.dataset.translateY = currentTranslateY;
        
        // Применяем трансформацию
        photo.style.transform = `scale(${currentScale}) translate(${currentTranslateX}px, ${currentTranslateY}px)`;
        photo.style.transition = isDragging ? 'none' : 'transform 0.3s ease';
    }
    
    // Пинч-зум для тач-устройств
    let initialDistance = null;
    
    container.addEventListener('touchstart', (e) => {
        if (e.touches.length === 2) {
            e.preventDefault();
            initialDistance = getDistance(e.touches[0], e.touches[1]);
            initialScale = currentScale;
        }
    });
    
    container.addEventListener('touchmove', (e) => {
        if (e.touches.length === 2) {
            e.preventDefault();
            const currentDistance = getDistance(e.touches[0], e.touches[1]);
            if (initialDistance) {
                const scaleFactor = currentDistance / initialDistance;
                currentScale = initialScale * scaleFactor;
                // Ограничиваем масштаб
                currentScale = Math.max(1, Math.min(currentScale, 5));
                applyTransform();
            }
        }
    });
    
    container.addEventListener('touchend', () => {
        initialDistance = null;
    });
    
    function getDistance(touch1, touch2) {
        const dx = touch1.clientX - touch2.clientX;
        const dy = touch1.clientY - touch2.clientY;
        return Math.sqrt(dx * dx + dy * dy);
    }
}
    
    // === КОНЕЦ ДОБАВЛЕНИЯ ===
}; // <- Эта фигурная скобка закрывает объект app
// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', function() {
    app.init();
});
