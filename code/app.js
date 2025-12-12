// app.js — исправленная версия (замени текущий файл целиком этим кодом)

const app = {
    currentScreen: 'goal-selection',
    selectedGoals: [],
    currentArticle: null,
    currentTheme: 'dark',
    textSize: 'medium',

    // Навигация
    navigationHistory: [],
    currentPage: null, // { function: 'showFullLibrary', args: [...] }

    shouldSkipLevel(item) {
        if (!item) return false;
        if (item.directLink) return false;

        if (item.articles) {
            return item.articles.length === 1 ? 'all' : false;
        }

        if (item.topics) {
            if (item.topics.length === 1) {
                const singleTopic = item.topics[0];
                if (singleTopic.articles && singleTopic.articles.length === 1) return 'all';
                return true;
            }
            return false;
        }

        if (item.subsections) {
            if (item.subsections.length === 1) {
                const singleSubsection = item.subsections[0];
                const skipSub = this.shouldSkipLevel(singleSubsection);
                if (skipSub === 'all') return 'all';
                return skipSub || true;
            }
            return false;
        }

        return false;
    },

    // Переход, который пушит текущую страницу в историю (если есть)
    navigateTo(pageFunction, ...args) {
    // Обновляем currentPage *сразу*
    const newPage = { function: pageFunction, args };
    
    // Сохраняем старую страницу в историю
    if (this.currentPage) {
        const last = this.navigationHistory[this.navigationHistory.length - 1];
        const sameAsLast = last && last.function === this.currentPage.function &&
                           JSON.stringify(last.args) === JSON.stringify(this.currentPage.args);
        if (!sameAsLast) this.navigationHistory.push({...this.currentPage});
    }
    
    this.currentPage = newPage;

    // Вызываем функцию рендера
    if (typeof this[pageFunction] === 'function') {
        this[pageFunction](...args);
    } else {
        console.error('Unknown page function:', pageFunction);
        this.showFullLibrary();
    }
},

    // Переход без добавления в историю (замена текущей страницы)
    navigateReplace(pageFunction, ...args) {
        console.log('NAVIGATE REPLACE', pageFunction, args);
        this.currentPage = { function: pageFunction, args };
        if (typeof this[pageFunction] === 'function') {
            this[pageFunction].apply(this, args);
        } else {
            console.error('Unknown page function:', pageFunction);
            this.showFullLibrary();
        }
    },

    // Назад: восстанавливаем предыдущую страницу из стека
    navigateBack() {
        console.log('NAVIGATE BACK');
        if (this.navigationHistory.length > 0) {
            const prev = this.navigationHistory.pop();
            console.log('POP ->', prev);
            this.currentPage = prev;
            if (typeof this[prev.function] === 'function') {
                this[prev.function].apply(this, prev.args);
            } else {
                console.error('Unknown previous page function:', prev.function);
                this.showFullLibrary();
            }
        } else {
            // Если истории нет — возвращаемся в библиотеку (заменой)
            this.navigateReplace('showFullLibrary');
        }
    },

    getBackButton() {
        return `<button class="back-btn" onclick="app.navigateBack()">← Назад</button>`;
    },

    categories: [
        { id: 'personal', name: 'Ваша подборка', emoji: '🎯' },
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

    personal: [
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

    content: window.contentData || {},

    init() {
        this.navigationHistory = [];
        this.currentPage = null;

        const savedGoals = JSON.parse(localStorage.getItem('selectedGoals') || '[]');
        this.selectedGoals = savedGoals;

        this.currentTheme = localStorage.getItem('appTheme') || 'dark';
        this.textSize = localStorage.getItem('textSize') || 'medium';
        this.applySettings();

        if (this.selectedGoals.length > 0) {
            // стартуем с библиотеки без записи в историю
            this.navigateReplace('showFullLibrary');
        } else {
            // показываем выбор целей — не добавляем в историю
            this.showGoalSelection();
        }

        if (window.Telegram?.WebApp) {
            window.Telegram.WebApp.ready();
            window.Telegram.WebApp.expand();
        }
    },

    applySettings() {
        document.body.className = this.currentTheme + '-theme';
        document.body.classList.add('text-size-' + this.textSize);
    },

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
        if (overlay) overlay.remove();
    },

    toggleTheme() {
        this.currentTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        localStorage.setItem('appTheme', this.currentTheme);
        this.applySettings();
    },

    changeTextSize(size) {
        this.textSize = size;
        localStorage.setItem('textSize', size);
        document.body.classList.remove('text-size-small', 'text-size-medium', 'text-size-large');
        document.body.classList.add('text-size-' + size);
    },

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

            <button class="action-btn" id="create-btn" onclick="app.saveGoalsAndContinue()" 
                    ${this.selectedGoals.length === 0 ? 'disabled' : ''}>
                Выбрать
            </button>
        `;

        document.getElementById('app').innerHTML = html;
    },

    toggleGoal(goalId) {
        const index = this.selectedGoals.indexOf(goalId);
        if (index > -1) this.selectedGoals.splice(index, 1);
        else if (this.selectedGoals.length < 3) this.selectedGoals.push(goalId);
        this.updateCounter();
    },

    updateCounter() {
        const counter = document.getElementById('counter');
        const createBtn = document.getElementById('create-btn');
        if (counter) counter.textContent = `Выбрано: ${this.selectedGoals.length}/3`;
        if (createBtn) createBtn.disabled = this.selectedGoals.length === 0;
    },

    saveGoalsAndContinue() {
        localStorage.setItem('selectedGoals', JSON.stringify(this.selectedGoals));
        this.navigateReplace('showFullLibrary');
    },

    showRouteReady() {
        this.currentScreen = 'route-ready';

        const html = `
            <div class="header">
                <div class="logo">🗺️</div>
                <h1>Ваш маршрут готов!</h1>
                <div class="subtitle">На основе твоих целей мы собрали персональную подборку материалов.</div>
            </div>

            <button class="route-btn" onclick="app.navigateTo('showPersonalRoute')">
                Исследовать мой маршрут
            </button>

            <button class="route-btn" onclick="app.navigateTo('showFullLibrary')">
                Посмотреть всю базу знаний
            </button>

            <button class="back-btn" onclick="app.showGoalSelection()">
                ← Изменить цели
            </button>
        `;

        document.getElementById('app').innerHTML = html;
    },

    showPersonalRoute() {
        const selectedGoalsData = this.selectedGoals.map(id => this.goals.find(goal => goal.id === id));

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
        if (!goalContent) { this.navigateBack(); return; }

        const html = `
            ${this.getBackButton()}

            <div class="header text-left">
                <h1>${goal.emoji} ${goal.name}</h1>
                <div class="goal-description">${goalContent.description || 'Описание цели'}</div>
            </div>

            ${goalContent.stages ? goalContent.stages.map((stage, index) => `
                <div class="stage-title">Этап ${index + 1}: ${stage.title}</div>
                ${stage.articles.map((article, artIndex) => `
                    <a class="article-link" onclick="app.navigateTo('showArticle', '${goalId}', ${index}, ${artIndex})">
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
            <button class="menu-btn" onclick="app.showSettingsMenu()">☰</button>

            <div class="header">
                <img src="https://static.tildacdn.com/tild6166-3737-4633-b339-633337633036/4.png" class="logo-image" alt="Логотип">
                <h1>Вся база знаний</h1>
                <div class="subtitle">Все доступные материалы по категориям</div>
            </div>


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
    console.log('showCategory', categoryId);

    const category = this.categories.find(c => c.id === categoryId);
    const categoryContent = this.content[categoryId];

    // ====== ФИЛЬТРАЦИЯ ПЕРСОНАЛЬНЫХ ЦЕЛЕЙ ======
    if (categoryId === "personal") {
        const allSections = categoryContent.subsections;

        const filtered = allSections.filter(sec => {
            const baseId = sec.id.replace("_1", "");
            return this.selectedGoals.includes(baseId);
        });

        categoryContent.subsections = filtered;
    }
    // ============================================

    // ====== Если категория — прямая ссылка (например Miro) ======
    if (categoryContent?.directLink) {
        const html = `
            ${this.getBackButton()}
            <div class="header text-left">
                <h1>${category.emoji} ${category.name}</h1>
                <div class="goal-description">${categoryContent.description}</div>
            </div>
            <div style="padding:20px;">
                <button class="miro-map-btn" onclick="window.open('${categoryContent.directLink}', '_blank')">
                    <span class="miro-icon">🗺️</span>
                    <span class="miro-text">Открыть карту Miro</span>
                    <span class="miro-arrow">↗</span>
                </button>
            </div>
        `;
        document.getElementById('app').innerHTML = html;
        return;
    }

    // ====== Автоматическое определение “пропустить уровень?” ======
    const skipInfo = this.shouldSkipLevel(categoryContent);
    console.log('skipInfo', skipInfo);

    // Если ВСЁ можно пропустить → сразу статья
    if (skipInfo === 'all') {
        const singleSubsection = categoryContent.subsections[0];
        const singleTopic = singleSubsection.topics[0];
        const singleArticle = singleTopic.articles[0];
        this.navigateTo('showArticleContent', singleArticle.id);
        return;
    }

    // Если подсекции одна → показываем темы сразу
    if (skipInfo === true) {
        const singleSubsection = categoryContent.subsections[0];
        const html = `
            ${this.getBackButton()}
            <div class="header text-left">
                <h1>${category.emoji} ${category.name}</h1>
                <div class="goal-description">${categoryContent.description}</div>
            </div>
            ${singleSubsection.topics.map((topic, topicIndex) => {
                const topicSkip = this.shouldSkipLevel(topic);

                if (topicSkip === 'all') {
                    const singleArticle = topic.articles[0];
                    return `
                        <button class="goal-btn" onclick="app.navigateTo('showArticleContent', '${singleArticle.id}')">
                            <span class="emoji">📄</span>
                            ${topic.title}
                            <span class="arrow">›</span>
                        </button>
                    `;
                }

                return `
                    <button class="goal-btn" onclick="app.navigateTo('showTopic', '${categoryId}', 0, ${topicIndex})">
                        <span class="emoji">📄</span>
                        ${topic.title}
                        <span class="arrow">›</span>
                    </button>
                `;
            }).join('')}
        `;
        document.getElementById('app').innerHTML = html;
        return;
    }

    // ====== Обычный режим — показываем список подсекций ======
    const html = `
        ${this.getBackButton()}
        <div class="header text-left">
            <h1>${category.emoji} ${category.name}</h1>
            <div class="goal-description">${categoryContent.description}</div>
        </div>
        ${categoryContent.subsections.map((subsection, index) => {
            const subsectionSkip = this.shouldSkipLevel(subsection);

            if (subsectionSkip === 'all') {
                const singleTopic = subsection.topics[0];
                const singleArticle = singleTopic.articles[0];
                return `
                    <button class="goal-btn" onclick="app.navigateTo('showArticleContent', '${singleArticle.id}')">
                        <span class="emoji">📁</span>
                        ${subsection.title}
                        <span class="arrow">›</span>
                    </button>
                `;
            }

            if (subsectionSkip === true) {
                return `
                    <button class="goal-btn" onclick="app.navigateTo('showTopic', '${categoryId}', ${index}, 0)">
                        <span class="emoji">📁</span>
                        ${subsection.title}
                        <span class="arrow">›</span>
                    </button>
                `;
            }

            return `
                <button class="goal-btn" onclick="app.navigateTo('showSubsection', '${categoryId}', ${index})">
                    <span class="emoji">📁</span>
                    ${subsection.title}
                    <span class="arrow">›</span>
                </button>
            `;
        }).join('')}
    `;

    document.getElementById('app').innerHTML = html;
},

    
    showSubsection(categoryId, subsectionIndex) {
        const categoryContent = this.content[categoryId];
        if (!categoryContent || !categoryContent.subsections) { this.navigateBack(); return; }
        const subsection = categoryContent.subsections[subsectionIndex];

        const html = `
            ${this.getBackButton()}
            <div class="header text-left">
                <h1>${subsection.title}</h1>
                <div class="goal-description">${categoryContent.description}</div>
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
    const categoryContent = this.content[categoryId];
    if (!categoryContent || !categoryContent.subsections) { this.navigateBack(); return; }
    const subsection = categoryContent.subsections[subsectionIndex];
    const topic = subsection.topics[topicIndex];

    // Автопропуск, если тема содержит только одну статью
    if (topic.articles && topic.articles.length === 1) {
        // Не добавляем тему в историю — сразу открываем статью
        const singleArticle = topic.articles[0];
        if (this.currentPage && this.currentPage.function === 'showSubsection') {
            // currentPage уже указывает на раздел, сохраняем это как шаг истории
            this.navigateTo('showArticleContent', singleArticle.id);
        } else {
            // Если currentPage некорректен, просто открываем статью
            this.navigateReplace('showArticleContent', singleArticle.id);
        }
        return;
    }

    // Обычный случай — показываем список статей в теме
    const html = `
        ${this.getBackButton()}
        <div class="header text-left">
            <h1>${topic.title}</h1>
            <div class="goal-description">Материалы по теме</div>
        </div>
        ${topic.articles.map(article => `
            <a class="article-link" onclick="app.navigateTo('showArticleContent', '${article.id}')">${article.title}</a>
        `).join('')}
    `;

    document.getElementById('app').innerHTML = html;
},


    showArticleContent(articleId) {
        console.log('showArticleContent', articleId);
        let found = null;
        let articleCategory = null;

        for (const [categoryId, categoryContent] of Object.entries(this.content)) {
            if (!categoryContent.subsections) continue;
            for (const subsection of categoryContent.subsections) {
                for (const topic of subsection.topics) {
                    const article = topic.articles.find(a => a.id === articleId);
                    if (article) { found = article; articleCategory = this.categories.find(c => c.id === categoryId); break; }
                }
                if (found) break;
            }
            if (found) break;
        }

        if (!found) { console.warn('Article not found', articleId); this.navigateReplace('showFullLibrary'); return; }

        const html = `
            ${this.getBackButton()}

            <div class="header text-left">
                <h1>${found.title}</h1>
                <div class="subtitle text-left">${articleCategory ? articleCategory.emoji + ' ' + articleCategory.name : ''}</div>
            </div>

            <div class="article-content">
                ${found.content}
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

    // Photo viewer как overlay — НЕ добавляется в историю
    showPhotoViewer(photoUrl, photoTitle) {
        if (document.getElementById('photo-viewer-overlay')) return;

        const overlay = document.createElement('div');
        overlay.id = 'photo-viewer-overlay';
        overlay.className = 'settings-overlay';
        overlay.innerHTML = `
            <div class="settings-panel" style="width:100%; max-width:800px; margin:auto; background:transparent; box-shadow:none;">
                <div style="padding:12px; display:flex; justify-content:space-between; align-items:center;">
                    <button class="back-btn" onclick="app.closePhotoViewer()">← Назад</button>
                    <div style="color:white; font-weight:600;">${photoTitle || ''}</div>
                    <button class="close-btn" onclick="app.closePhotoViewer()">×</button>
                </div>
                <div id="photo-container" style="padding:12px; text-align:center;">
                    <img id="zoomable-photo" src="${photoUrl}" alt="${photoTitle || 'Фото'}" style="max-width:100%; height:auto; border-radius:8px;" />
                </div>
            </div>
        `;

        document.body.appendChild(overlay);

        setTimeout(() => {
            try { this.initPhotoZoom(); } catch (e) { console.error('zoom init error', e); }
        }, 60);
    },

    closePhotoViewer() {
        const overlay = document.getElementById('photo-viewer-overlay');
        if (overlay) overlay.remove();
        // Не трогаем историю
    },

    resetPhotoZoom() { /* при необходимости */ },

    initPhotoZoom() { /* реализация зума/панинга — можно вставить прежнюю логику */ },

};

// Инициализация
document.addEventListener('DOMContentLoaded', function() { app.init(); });
