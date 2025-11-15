// Система целей и контента
const goalsSystem = {
    goals: [
        { id: 'career', emoji: '💼', name: 'Карьера и работа' },
        { id: 'finance', emoji: '💰', name: 'Финансы и инвестиции' },
        { id: 'health', emoji: '🏃‍♂️', name: 'Здоровье и спорт' },
        { id: 'learning', emoji: '🧠', name: 'Обучение и навыки' },
        { id: 'growth', emoji: '🎯', name: 'Личностный рост' },
        { id: 'creativity', emoji: '🎨', name: 'Творчество' },
        { id: 'travel', emoji: '🌎', name: 'Путешествия' },
        { id: 'relationships', emoji: '👥', name: 'Отношения' },
        { id: 'mindfulness', emoji: '🧘‍♂️', name: 'Осознанность' },
        { id: 'productivity', emoji: '⚡', name: 'Продуктивность' },
        { id: 'business', emoji: '🚀', name: 'Свой бизнес' }
    ],
    
    content: {
        career: [
            { title: '📝 Идеальное резюме', content: 'Как составить резюме, которое заметят...' },
            { title: '🎤 Собеседования', content: 'Подготовка к сложным вопросам...' },
            { title: '📈 Карьерный рост', content: 'Стратегии продвижения по карьерной лестнице...' }
        ],
        finance: [
            { title: '💸 Бюджетирование', content: 'Как вести бюджет и экономить...' },
            { title: '📊 Инвестиции', content: 'Основы инвестирования для начинающих...' },
            { title: '🛡️ Финансовая безопасность', content: 'Как защитить свои финансы...' }
        ],
        health: [
            { title: '🏋️ Тренировки дома', content: 'Эффективные упражнения без оборудования...' },
            { title: '🥗 Питание', content: 'Сбалансированный рацион на каждый день...' },
            { title: '💤 Сон и восстановление', content: 'Как улучшить качество сна...' }
        ]
        // ... остальные цели по аналогии
    },
    
    selectedGoals: [],
    
    showGoalSelection() {
        const html = `
            <div class="header">
                <div class="logo">📚</div>
                <h1>Выберите ваши цели</h1>
                <div class="subtitle">Выберите 3 сферы для персональной подборки</div>
            </div>
            
            <div class="counter" id="counter">Выбрано: 0/3</div>
            
            <div id="goals-list">
                ${this.goals.map(goal => `
                    <button class="goal-btn" onclick="goalsSystem.toggleGoal('${goal.id}')" id="goal-${goal.id}">
                        <span class="emoji">${goal.emoji}</span>
                        ${goal.name}
                        <span class="check">✓</span>
                    </button>
                `).join('')}
            </div>
            
            <button class="action-btn" id="create-btn" onclick="goalsSystem.createLibrary()" disabled>
                Создать мою библиотеку
            </button>
        `;
        
        document.getElementById('app').innerHTML = html;
        this.updateCounter();
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
            createBtn.disabled = this.selectedGoals.length !== 3;
        }
    },
    
    createLibrary() {
        if (this.selectedGoals.length === 3) {
            localStorage.setItem('userGoals', JSON.stringify(this.selectedGoals));
            this.showPersonalLibrary();
        }
    },
    
    showPersonalLibrary() {
        const selectedGoalData = this.selectedGoals.map(id => 
            this.goals.find(goal => goal.id === id)
        );
        
        const html = `
            <div class="header">
                <div class="logo">📖</div>
                <h1>Ваша библиотека</h1>
                <div class="subtitle">Персональная подборка материалов</div>
            </div>
            
            ${selectedGoalData.map(goal => `
                <button class="folder-btn" onclick="goalsSystem.openFolder('${goal.id}')">
                    <span class="icon">${goal.emoji}</span>
                    ${goal.name}
                    <span class="arrow">›</span>
                </button>
            `).join('')}
            
            <button class="back-btn" onclick="goalsSystem.showGoalSelection()">
                ← Выбрать другие цели
            </button>
        `;
        
        document.getElementById('app').innerHTML = html;
    },
    
    openFolder(goalId) {
        const goal = this.goals.find(g => g.id === goalId);
        const items = this.content[goalId] || [];
        
        const html = `
            <button class="back-btn" onclick="goalsSystem.showPersonalLibrary()">
                ← Назад к библиотеке
            </button>
            
            <div class="header">
                <h1>${goal.emoji} ${goal.name}</h1>
            </div>
            
            ${items.map(item => `
                <button class="folder-btn" onclick="goalsSystem.showContent('${item.title}', '${item.content}')">
                    <span class="icon">📄</span>
                    ${item.title}
                    <span class="arrow">›</span>
                </button>
            `).join('')}
        `;
        
        document.getElementById('app').innerHTML = html;
    },
    
    showContent(title, content) {
        const html = `
            <button class="back-btn" onclick="goalsSystem.openFolder('${this.selectedGoals[0]}')">
                ← Назад
            </button>
            
            <div class="header">
                <h1>${title}</h1>
            </div>
            
            <div class="content-card">
                <p>${content}</p>
            </div>
        `;
        
        document.getElementById('app').innerHTML = html;
    }
};

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', function() {
    // Инициализация Telegram Web App
    if (window.Telegram?.WebApp) {
        window.Telegram.WebApp.ready();
        window.Telegram.WebApp.expand();
    }
    
    // Проверяем, есть ли сохраненные цели
    const savedGoals = JSON.parse(localStorage.getItem('userGoals') || '[]');
    if (savedGoals.length > 0) {
        goalsSystem.selectedGoals = savedGoals;
        goalsSystem.showPersonalLibrary();
    } else {
        goalsSystem.showGoalSelection();
    }
});

