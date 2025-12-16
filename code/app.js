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

    
openImage(url) {
    const viewer = document.createElement("div");
    viewer.className = "image-viewer-overlay";
    viewer.innerHTML = `
        <div class="image-viewer-backdrop"></div>
        <div class="image-viewer-container">
            <img src="${url}" class="image-viewer-photo">
            <button class="image-viewer-close" onclick="app.closeImageViewer()">×</button>
        </div>
    `;

    document.body.appendChild(viewer);

    const img = viewer.querySelector(".image-viewer-photo");

    let scale = 1;
    let lastScale = 1;
    let startDistance = 0;

    let posX = 0, posY = 0;
    let lastPosX = 0, lastPosY = 0;
    let startX = 0, startY = 0;

    // ---- Pinch start ----
    img.addEventListener("touchstart", (e) => {
        if (e.touches.length === 2) {
            const dx = e.touches[0].clientX - e.touches[1].clientX;
            const dy = e.touches[0].clientY - e.touches[1].clientY;
            startDistance = Math.sqrt(dx * dx + dy * dy);
        } else if (e.touches.length === 1 && scale > 1) {
            startX = e.touches[0].clientX - lastPosX;
            startY = e.touches[0].clientY - lastPosY;
        }
    });

    // ---- Pinch + Pan ----
    img.addEventListener("touchmove", (e) => {
    if (e.touches.length === 2) {
        e.preventDefault(); // ✅ ТОЛЬКО ДЛЯ PINCH
        
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        let distance = Math.sqrt(dx * dx + dy * dy);

        scale = Math.min(4, Math.max(1, lastScale * (distance / startDistance)));

    } else if (e.touches.length === 1 && scale > 1) {
        posX = e.touches[0].clientX - startX;
        posY = e.touches[0].clientY - startY;
    }

    updateTransform();
}, { passive: false });


    // ---- Touch end ----
    img.addEventListener("touchend", () => {
        lastScale = scale;
        lastPosX = posX;
        lastPosY = posY;
    });

    // ---- Apply transforms ----
    function updateTransform() {
        img.style.transform = `translate(${posX}px, ${posY}px) scale(${scale})`;
    }
},

closeImageViewer() {
    const viewer = document.querySelector(".image-viewer-overlay");
    if (viewer) viewer.remove();
},

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

    // Заменяем текущую страницу, НЕ добавляя её в историю
    this.currentPage = { function: pageFunction, args };

    // Вызываем соответствующую функцию
    if (typeof this[pageFunction] === 'function') {
        this[pageFunction](...args);
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

    goHome() {
    this.navigationHistory = [];  // очищаем историю
    this.navigateReplace('showFullLibrary');
},

    getBackButton() {
    // ❗️ В ЭТОЙ статье вообще НЕТ кнопки "Назад"
    if (this.currentArticle?.id === 'miro_map_1') {
        return `
            <div class="nav-buttons">
                <button class="homereturn-btn" onclick="app.goHome()">
                    ⤹ На главную
                </button>
            </div>
        `;
    }

    // ✅ ВЕЗДЕ ОСТАЛЬНОЕ — как было
    return `
        <div class="nav-buttons">
            <button class="back-btn" onclick="app.navigateBack()">← Назад</button>
            <button class="homereturn-btn" onclick="app.goHome()">⤹ На главную</button>
        </div>
    `;
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
    if (document.querySelector('.settings-overlay')) return;

    const overlay = document.createElement('div');
    overlay.className = 'settings-overlay';
    overlay.innerHTML = `
        <div class="settings-panel" onclick="event.stopPropagation()">
            <div class="settings-header">
                <h3>Настройки</h3>
                <button class="close-btn" id="close-settings-btn">×</button>
            </div>
            <div class="setting-item">
                <span>Тема:</span>
                <button class="theme-toggle ${this.currentTheme === 'dark' ? 'active' : ''}" id="theme-toggle-btn">
                    ${this.currentTheme === 'dark' ? '☀️ Светлая' : '🌙 Тёмная'}
                </button>
            </div>
            <div class="setting-item">
                <span>Размер текста:</span>
                <div class="text-size-controls">
                    <button class="text-size-btn ${this.textSize === 'small' ? 'active' : ''}" id="text-small-btn">A</button>
                    <button class="text-size-btn ${this.textSize === 'medium' ? 'active' : ''}" id="text-medium-btn">A</button>
                    <button class="text-size-btn ${this.textSize === 'large' ? 'active' : ''}" id="text-large-btn">A</button>
                </div>
            </div>
            <div class="setting-item">
                <span>Цели развития:</span>
                <button class="settings-action-btn" id="change-goals-btn">
                    ${this.selectedGoals.length > 0 ? 'Изменить цели' : 'Выбрать цели'}
                </button>
            </div>
        </div>
    `;

    // Закрытие при клике вне панели
    overlay.addEventListener('click', () => this.hideSettingsMenu());

    document.body.appendChild(overlay);

    // Навешиваем обработчики
    document.getElementById('close-settings-btn').onclick = () => this.hideSettingsMenu();
    document.getElementById('theme-toggle-btn').onclick = () => this.toggleTheme();
    document.getElementById('text-small-btn').onclick = () => this.changeTextSize('small');
    document.getElementById('text-medium-btn').onclick = () => this.changeTextSize('medium');
    document.getElementById('text-large-btn').onclick = () => this.changeTextSize('large');

    document.getElementById('change-goals-btn').onclick = () => {
        // Сначала прячем overlay, затем навигируем на экран выбора целей.
        // hideSettingsMenu() удалит overlay из DOM, навигация отработает корректно.
        this.hideSettingsMenu();
        // Используем navigateReplace — заменяем текущую страницу (мы не хотим пушить overlay в историю)
        this.navigateReplace('showGoalSelection');
    };
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
    const idx = this.selectedGoals.indexOf(goalId);
    if (idx > -1) this.selectedGoals.splice(idx, 1);
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

    // сразу подхватываем новое значение
    this.selectedGoals = JSON.parse(localStorage.getItem('selectedGoals'));

    // перенаправляем на библиотеку
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
    if (categoryId === "personal") {
    const allSections = this.content.personal.subsections || [];
    const filtered = allSections.filter(sec => {
        const baseId = sec.id.replace(/_\d+$/, ''); // discipline_1 -> discipline
        return this.selectedGoals.includes(baseId);
    });
    // Если нужно, переиспользуй filtered вместо categoryContent.subsections
    // Ниже рендерим filtered
    // ...
}

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





    openArticle(articleId) {
    const article = this.findArticleById(articleId);
    if (!article) {
        console.warn("Статья не найдена:", articleId);
        return;
    }

    this.currentArticle = article;

    const appDiv = document.getElementById("app");
    appDiv.innerHTML = `
    ${this.getBackButton()}
    <h1>${article.title}</h1>
    <div class="article-content">${article.content}</div>
`;
},

findArticleById(id) {
    function search(obj) {
        if (!obj) return null;

        // Проверяем articles
        if (obj.articles) {
            for (let a of obj.articles) {
                if (a.id === id) return a;
            }
        }

        // Проверяем topics
        if (obj.topics) {
            for (let t of obj.topics) {
                const res = search(t);
                if (res) return res;
            }
        }

        // Проверяем subsections
        if (obj.subsections) {
            for (let s of obj.subsections) {
                const res = search(s);
                if (res) return res;
            }
        }

        return null;
    }

    for (let key in this.content) {
        const res = search(this.content[key]);
        if (res) return res;
    }

    return null;
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
