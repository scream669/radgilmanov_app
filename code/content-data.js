const contentData = {
// ==================== ПЕРСОНАЛИЗИРОВАННЫЕ БЛОКИ ====================
    personal: {
        description: "Ваша подборка",
        subsections: []
    },

    map: {
        description: "Навигация по карте", 
        subsections: []
    },

// ==================== ОСНОВНЫЕ КАТЕГОРИИ КОНТЕНТА ====================
    // ==================== ЯДРО ====================
    core: {
        description: "Ядро - Философия и мышление",
        subsections: [
            {
                title: "Центральные концепции",
                topics: [
                    {
                        title: "Режим Бога",
                        articles: [
                            { id: 'godmode_1', title: '"Как родился Режим Бога"', content: `` },
                            { id: 'godmode_2', title: "РАДкаст №19", content: `` },
                            { id: 'godmode_3', title: "Убийство режима бога", content: `` }
                        ]
                    },
                    {
                        title: "Via-negativa",
                        articles: [
                            { id: 'vianegativa_1', title: "Via Negativa", content: `` },
                            { id: 'vianegativa_2', title: "РАДкаст №22", content: `` }
                        ]
                    },
                    {
                        title: "Диджитал-стоицизм", 
                        articles: [
                            { id: 'digitalstoicism_1', title: "Диджитал-стоицизм — твой единственный выход", content: `` },
                            { id: 'digitalstoicism_2', title: "Современный стоический мудрец", content: `` }
                        ]
                    },
                    {
                        title: "Ментальные модели",
                        articles: [
                            { id: 'mentalmodels_1', title: "Разрушающая человека ментальная модель №1", content: `` },
                            { id: 'mentalmodels_2', title: "РАДкаст №23", content: `` }
                        ]
                    },
                    {
                        title: "Современный стоический мудрец",
                        articles: [
                            { id: 'twotypes_1', title: "Современный стоический мудрец", content: `` }
                        ]
                    }
                ]
            },
            {
                title: "Кризисы и вызовы",
                topics: [
                    {
                        title: "Общество диджитал-потребления",
                        articles: [
                            { id: 'digitalconsumption_1', title: "РАДкаст №12", content: `` },
                            { id: 'digitalconsumption_2', title: "Общество диджитал потребления", content: `` }
                        ]
                    },
                    {
                        title: "Зависимость от телефона",
                        articles: [
                            { id: 'phoneaddiction_1', title: "Зависимость от телефона", content: `` }
                        ]
                    },
                    {
                        title: "Открытые петли", 
                        articles: [
                            { id: 'openloops_1', title: "Открытые петли", content: `` }
                        ]
                    },
                    {
                        title: '"Ты мешок"',
                        articles: [
                            { id: 'meshok_1', title: "Ты мешок", content: `` }
                        ]
                    },
                    {
                        title: '"Ты не странный"',
                        articles: [
                            { id: 'notweird_1', title: "Ты не странный", content: `` }
                        ]
                    },
                    {
                        title: '"Особый тип человека"',
                        articles: [
                            { id: 'specialtype_1', title: "Особый тип человека", content: `` }
                        ]
                    },
                    {
                        title: '"Интернет — умер?"',
                        articles: [
                            { id: 'internetdead_1', title: "Интернет — умер?", content: `` }
                        ]
                    },
                    {
                        title: "Есть два типа людей",
                        articles: [
                            { id: 'twotypes_2', title: "Интернет — умер?", content: `` }
                        ]
                    }
                ]
            }
        ]
    },
    // ==================== СИСТЕМА ====================
    system: {
        description: "Система - Дисциплина и процессы",
        subsections: [
            {
                title: "Фундамент",
                topics: [
                    {
                        title: "Дисциплина и тумблер",
                        articles: [
                            { id: 'discipline_1', title: "Как включить тумблер дисциплины", content: `` },
                            { id: 'discipline_2', title: "Топ-7 книг по дисциплине", content: `` },
                            { id: 'discipline_3', title: "От дисциплины к системе: как стать лучшей версией себя без насилия", content: `` }
                        ]
                    },
                    {
                        title: "Режим дня", 
                        articles: [
                            { id: 'routine_1', title: "Режим Дня. Бонус №1", content: `` },
                            { id: 'routine_2', title: "РАДкаст №2", content: `` },
                            { id: 'routine_3', title: "РАДкаст №11", content: `` },
                            { id: 'routine_4', title: "Режим дня с 0 до 2 млн руб/месяц", content: `` },
                            { id: 'routine_5', title: "Утренняя рутина современного Хомо Сапиенса", content: `` }
                        ]
                    },
                    {
                        title: "Магия утра",
                        articles: [
                            { id: 'morning_1', title: "РАДкаст №3", content: `` },
                            { id: 'morning_2', title: "Магия утра", content: `` }
                        ]
                    },
                    {
                        title: "Привычка заканчивать дела",
                        articles: [
                            { id: 'finish_1', title: "Привычка заканчивать дела", content: `` }
                        ]
                    },
                    {
                        title: "Делай по своему",
                        articles: [
                            { id: 'yourway_1', title: "РАДкаст №34", content: `` }
                        ]
                    },
                    {
                        title: "С чего начать если вообще не знаешь что делать?",
                        articles: [
                            { id: 'start_1', title: "С чего начать если вообще не знаешь что делать?", content: `` }
                        ]
                    }
                ]
            },
            {
                title: "Инструменты",
                topics: [
                    {
                        title: "Алгоритм обучения",
                        articles: [
                            { id: 'learning_1', title: "Алгоритм обучения", content: `` }
                        ]
                    },
                    {
                        title: "Тайм-менеджмент",
                        articles: [
                            { id: 'timemanagement_1', title: "Тайм-менеджмент — это абсолютный бред если нет энергии", content: `` },
                            { id: 'timemanagement_2', title: "Тайм-менеджмент — это абсолютный бред в 2026, если у тебя нет самого главного", content: `` }
                        ]
                    },
                    {
                        title: "Программирование главного процессора",
                        articles: [
                            { id: 'processor_1', title: "Запрограммируй главный процессор", content: `` },
                            { id: 'processor_2', title: "РАДкаст №20", content: `` }
                        ]
                    },
                    {
                        title: "Формула везения",
                        articles: [
                            { id: 'luck_1', title: "Формула везения", content: `` },
                            { id: 'luck_2', title: "РАДкаст №17", content: `` },
                            { id: 'luck_3', title: "Как стать везунчиком", content: `` }
                        ]
                    },
                    {
                        title: "Элемент случайности", 
                        articles: [
                            { id: 'randomness_1', title: "РАДкаст №10", content: `` }
                        ]
                    },
                    {
                        title: "Приоритет(ы)",
                        articles: [
                            { id: 'priority_1', title: "Приоритет(ы)", content: `` }
                        ]
                    },
                    {
                        title: "Метрика №1",
                        articles: [
                            { id: 'metric_1', title: "РАДкаст №35", content: `` }
                        ]
                    },
                    {
                        title: "Этот пост был запланирован за 33 дня",
                        articles: [
                            { id: 'planned_1', title: "Этот пост был запланирован за 33 дня", content: `` }
                        ]
                    }
                ]
            }
        ]
    },
    // ==================== ЭНЕРГИЯ ====================
    energy: {
        description: "Энергия - Энергия и ресурсное состояние",
        subsections: [
            {
                title: "Управление энергией",
                topics: [
                    {
                        title: "Твоя энергия — твоя валюта",
                        articles: [
                            { id: 'energycurrency_1', title: "Твоя энергия — твоя валюта", content: `` }
                        ]
                    },
                    {
                        title: "Как правильно отдыхать",
                        articles: [
                            { id: 'restproperly_1', title: "Как правильно отдыхать", content: `` },
                            { id: 'restproperly_2', title: "Как правильно отдыхать 2", content: `` }
                        ]
                    },
                    {
                        title: "Режим дикаря",
                        articles: [
                            { id: 'savagemode_1', title: "Режим дикаря", content: `` }
                        ]
                    },
                    {
                        title: "Занятие ерундой",
                        articles: [
                            { id: 'nonsense_1', title: "РАДкаст №8", content: `` }
                        ]
                    },
                    {
                        title: "Полнейшая скука", 
                        articles: [
                            { id: 'boredom_1', title: "Полнейшая скука", content: `` }
                        ]
                    },
                    {
                        title: "Что делать с эмоциями?",
                        articles: [
                            { id: 'emotions_1', title: "РАДкаст №27", content: `` }
                        ]
                    },
                    {
                        title: "Эксперименты со сном",
                        articles: [
                            { id: 'sleepexperiments_1', title: "Эксперименты со сном", content: `` }
                        ]
                    },
                    {
                        title: "Ты устал",
                        articles: [
                            { id: 'youtired_1', title: "Ты устал", content: `` }
                        ]
                    }
                ]
            },
            {
                title: "Продуктивность",
                topics: [
                    {
                        title: "Неочевидный элемент продуктивности",
                        articles: [
                            { id: 'productivityelement_1', title: "Неочевидный элемент продуктивности", content: `` }
                        ]
                    },
                    {
                        title: "Музыка для продуктивности",
                        articles: [
                            { id: 'musicproductivity_1', title: "Музыка для продуктивности", content: `` }
                        ]
                    },
                    {
                        title: "Фокус",
                        articles: [
                            { id: 'focus_1', title: "Фокус", content: `` }
                        ]
                    },
                    {
                        title: "Ходячая классная комната",
                        articles: [
                            { id: 'walkingclassroom_1', title: "РАДкаст №26", content: `` }
                        ]
                    },
                    {
                        title: "Выходные",
                        articles: [
                            { id: 'weekends_1', title: "Выходные", content: `` }
                        ]
                    }
                ]
            }
        ]
    },
    // ==================== БИЗНЕС ====================
    business: {
        description: "Бизнес - Бизнес и предпринимательство",
        subsections: [
            {
                title: "Предпринимательство",
                topics: [
                    {
                        title: "Основной урок бизнеса",
                        articles: [
                            { id: 'businesslesson_1', title: "РАДкаст №5", content: `` }
                        ]
                    },
                    {
                        title: "Машина по достижению целей",
                        articles: [
                            { id: 'goalmachine_1', title: "РАДкаст №6", content: `` }
                        ]
                    },
                    {
                        title: "Из записок предпринимателя",
                        articles: [
                            { id: 'entrepreneurnotes_1', title: "Из записок предпринимателя", content: `` }
                        ]
                    },
                    {
                        title: "Как продавать",
                        articles: [
                            { id: 'selling_1', title: "Как продавать", content: `` }
                        ]
                    },
                    {
                        title: "Искусство превращать буквы в деньги",
                        articles: [
                            { id: 'writingmoney_1', title: "РАДкаст №32", content: `` }
                        ]
                    },
                    {
                        title: "ТОП-14 перспективных профессий по РАД",
                        articles: [
                            { id: 'professions_1', title: "ТОП-14 перспективных профессий по РАД", content: `` }
                        ]
                    }
                ]
            },
            {
                title: "Подходы",
                topics: [
                    {
                        title: "Упорный труд vs Шарик в небо",
                        articles: [
                            { id: 'hardworkvsluck_1', title: "Упорный труд vs Шарик в небо", content: `` }
                        ]
                    },
                    {
                        title: "Правило Парето",
                        articles: [
                            { id: 'pareto_1', title: "Правило Парето", content: `` }
                        ]
                    },
                    {
                        title: "4 сезона в жизни/бизнесе",
                        articles: [
                            { id: 'seasons_1', title: "РАДкаст №7", content: `` }
                        ]
                    },
                    {
                        title: "Когда меньше - это лучше",
                        articles: [
                            { id: 'lessismore_1', title: "РАДкаст №21", content: `` }
                        ]
                    }
                ]
            }
        ]
    },
    // ==================== РАЗВИТИЕ ====================
    development: {
        description: "Развитие - Личностный рост",
        subsections: [
            {
                title: "Самоисследование",
                topics: [
                    {
                        title: "Кто твой герой?",
                        articles: [
                            { id: 'hero_1', title: "РАДкаст №18", content: `` }
                        ]
                    },
                    {
                        title: "52 вопроса самому себе",
                        articles: [
                            { id: '52questions_1', title: "52 вопроса самому себе", content: `` }
                        ]
                    },
                    {
                        title: "Найди дело жизни",
                        articles: [
                            { id: 'lifepurpose_1', title: "РАДкаст №28", content: `` }
                        ]
                    },
                    {
                        title: "Уроки за 2024",
                        articles: [
                            { id: 'lessons2024_1', title: "Урок №1", content: `` },
                            { id: 'lessons2024_2', title: "Урок №2", content: `` },
                            { id: 'lessons2024_3', title: "Урок №3", content: `` },
                            { id: 'lessons2024_4', title: "Урок №4", content: `` },
                            { id: 'lessons2024_5', title: "Урок №5", content: `` },
                            { id: 'lessons2024_6', title: "Урок №6", content: `` },
                            { id: 'lessons2024_7', title: "Урок №7", content: `` }
                        ]
                    },
                    {
                        title: "Внутренний ментор",
                        articles: [
                            { id: 'innermentor_1', title: "Внутренний ментор", content: `` }
                        ]
                    },
                    {
                        title: "Что значит быть успешным?",
                        articles: [
                            { id: 'success_1', title: "РАДкаст №13", content: `` },
                            { id: 'success_2', title: "Что значит быть успешным?", content: `` }
                        ]
                    },
                    {
                        title: "Новичок vs. Любитель vs. Профи",
                        articles: [
                            { id: 'levels_1', title: "РАДкаст №25", content: `` }
                        ]
                    },
                    {
                        title: "33 совета самому себе за 33 года",
                        articles: [
                            { id: '33advices_1', title: "33 совета самому себе за 33 года", content: `` }
                        ]
                    },
                    {
                        title: "Самое важное слово в русском языке",
                        articles: [
                            { id: 'importantword_1', title: "РАДкаст №24", content: `` }
                        ]
                    },
                    {
                        title: "Дедушка а как ты провел свою жизнь?",
                        articles: [
                            { id: 'grandpa_1', title: "Дедушка а как ты провел свою жизнь?", content: `` }
                        ]
                    },
                    {
                        title: "Арка Героя",
                        articles: [
                            { id: 'heroarc_1', title: "Арка Героя", content: `` }
                        ]
                    },
                    {
                        title: "Овладей свободой финансов, времени и местоположения",
                        articles: [
                            { id: 'freedom_1', title: "Овладей свободой финансов, времени и местоположения", content: `` }
                        ]
                    },
                    {
                        title: "Ожидания от жизни",
                        articles: [
                            { id: 'expectations_1', title: "РАДкаст №17", content: `` }
                        ]
                    },
                    {
                        title: "Как прожить антисимметричную жизнь?",
                        articles: [
                            { id: 'asymmetric_1', title: "Как прожить антисимметричную жизнь?", content: `` }
                        ]
                    },
                    {
                        title: "Диагностика интеллекта",
                        articles: [
                            { id: 'intelligence_1', title: "Диагностика интеллекта", content: `` }
                        ]
                    },
                    {
                        title: "Простейший совет самому себе",
                        articles: [
                            { id: 'simpleadvice_1', title: "Простейший совет самому себе", content: `` }
                        ]
                    },
                    {
                        title: "Эссе. Почему Зидан не альфач, а самая настоящая бич",
                        articles: [
                            { id: 'zidane_1', title: "Эссе. Почему Зидан не альфач, а самая настоящая бич", content: `` }
                        ]
                    }
                ]
            }
        ]
    },
    // ==================== ЗДОРОВЬЕ ====================
    health: {
        description: "Здоровье - Здоровье и самочувствие",
        subsections: [
            {
                title: "Физическая форма",
                topics: [
                    {
                        title: "Как накачаться, хихикая с другом",
                        articles: [
                            { id: 'trainingfun_1', title: "Как накачаться, хихикая с другом", content: `` }
                        ]
                    },
                    {
                        title: "Тренировка Демон",
                        articles: [
                            { id: 'demontraining_1', title: "Тренировка Демон", content: `` }
                        ]
                    },
                    {
                        title: "Побочки высокого уровня тестостерона",
                        articles: [
                            { id: 'testosterone_1', title: "Побочки высокого уровня тестостерона", content: `` }
                        ]
                    },
                    {
                        title: "Бонус к челленджу Тестостероновый Буст",
                        articles: [
                            { id: 'testosteroneboost_1', title: "Бонус к челленджу Тестостероновый Буст", content: `` }
                        ]
                    },
                    {
                        title: "Протокол БАДов для максимизации физической формы и энергии по РАД",
                        articles: [
                            { id: 'supplements_1', title: "Протокол БАДов для максимизации физической формы и энергии", content: `` }
                        ]
                    }
                ]
            }
        ]
    },
    // ==================== ЧТЕНИЕ И ЗНАНИЯ ====================
    reading: {
        description: "Чтение и знания",
        subsections: [
            {
                title: "Привычки чтения",
                topics: [
                    {
                        title: "Как начать много читать?",
                        articles: [
                            { id: 'startreading_1', title: "Как начать много читать?", content: `` }
                        ]
                    },
                    {
                        title: "Как влюбиться в книги?",
                        articles: [
                            { id: 'lovebooks_1', title: "Как влюбиться в книги?", content: `` }
                        ]
                    },
                    {
                        title: "Где найти время для чтения в современном мире?",
                        articles: [
                            { id: 'readingtime_1', title: "Где найти время для чтения в современном мире?", content: `` }
                        ]
                    },
                    {
                        title: "Как запоминать прочитанное?",
                        articles: [
                            { id: 'rememberreading_1', title: "Как запоминать прочитанное?", content: `` }
                        ]
                    },
                    {
                        title: "У тебя же есть книга, на которой ты застрял?",
                        articles: [
                            { id: 'stuckbook_1', title: "У тебя же есть книга, на которой ты застрял?", content: `` }
                        ]
                    }
                ]
            }
        ]
    },
    // ==================== СЧАСТЬЕ И БАЛАНС ====================
    happiness: {
        description: "Счастье и баланс",
        subsections: [
            {
                title: "Поиск счастья",
                topics: [
                    {
                        title: "Где местоположение счастья?",
                        articles: [
                            { id: 'happylocation_1', title: "Где местоположение счастья?", content: `` },
                            { id: 'happylocation_2', title: "РАДкаст №22", content: `` }
                        ]
                    },
                    {
                        title: "Деньги не приносят счастья",
                        articles: [
                            { id: 'moneynothappy_1', title: "Деньги не приносят счастья", content: `` }
                        ]
                    }
                ]
            }
        ]
    },
    // ==================== МОТИВАЦИЯ И ПОСЛАНИЕ ====================
    motivation: {
        description: "Мотивация и послание",
        subsections: [
            {
                title: "Личные вызовы",
                topics: [
                    {
                        title: "Послание для тех, кто не боится забрать СВОЕ в этой жизни",
                        articles: [
                            { id: 'takeyours_1', title: "Послание для тех, кто не боится забрать СВОЕ в этой жизни", content: `` }
                        ]
                    },
                    {
                        title: "Эй, парень, тебе 18-35 лет? Это послание для тебя",
                        articles: [
                            { id: 'youngman_1', title: "Эй, парень, тебе 18-35 лет? Это послание для тебя", content: `` }
                        ]
                    },
                    {
                        title: "Играешь в глупые игры - получаешь глупые призы",
                        articles: [
                            { id: 'stupidgames_1', title: "Играешь в глупые игры - получаешь глупые призы", content: `` }
                        ]
                    },
                    {
                        title: "Суперсила в 2025 году",
                        articles: [
                            { id: 'superpower_1', title: "Суперсила в 2025 году", content: `` }
                        ]
                    },
                    {
                        title: "Похулиганим?",
                        articles: [
                            { id: 'mischief_1', title: "Похулиганим?", content: `` }
                        ]
                    },
                    {
                        title: "Грант от РАД",
                        articles: [
                            { id: 'grant_1', title: "Грант от РАД", content: `` }
                        ]
                    },
                    {
                        title: "Помнишь я пропал со всех радаров на 2 месяца?",
                        articles: [
                            { id: 'disappeared_1', title: "Помнишь я пропал со всех радаров на 2 месяца?", content: `` }
                        ]
                    },
                    {
                        title: "GOD MODE - это не курс",
                        articles: [
                            { id: 'godmode_1', title: "GOD MODE - это не курс", content: `` }
                        ]
                    },
                    {
                        title: "Что делает историю интереснее?",
                        articles: [
                            { id: 'interestingstory_1', title: "Что делает историю интереснее?", content: `` }
                        ]
                    },
                    {
                        title: "Первое видео на YouTube",
                        articles: [
                            { id: 'firstvideo_1', title: "Первое видео на YouTube", content: `` }
                        ]
                    }
                ]
            }
        ]
    },
    // ==================== ТЕХНОЛОГИИ ====================
    technology: {
        description: "ТЕХНОЛОГИИ И СОВРЕМЕННЫЙ МИР",
        subsections: [
            {
                title: "Инструменты 2025",
                topics: [
                    {
                        title: "Как использовать нейросети для личного бренда в 2025",
                        articles: [
                            { id: 'ainetworks_1', title: "Как использовать нейросети для личного бренда в 2025", content: "" }
                        ]
                    },
                    {
                        title: "Как пользоваться телефоном и соцсетями с пользой",
                        articles: [
                            { id: 'phonesocial_1', title: "Как пользоваться телефоном и соцсетями с пользой", content: "" }
                        ]
                    },
                    {
                        title: "4 города для комфортной жизни за границей",
                        articles: [
                            { id: 'citiesabroad_1', title: "4 города для комфортной жизни за границей", content: "" }
                        ]
                    }
                ]
            }
        ]
    },
    // ==================== КНИГИ МЕНЯЮЩИЕ СОЗНАНИЕ ====================
    books: {
        description: "Книги, меняющие сознание",
        subsections: [
            {
                title: "Книги",
                topics: [
                    {
                        title: "ТОП-30 книг, делящих жизнь на «ДО» и «ПОСЛЕ»",
                        articles: [
                            { id: 'top30books_1', title: "ТОП-30 книг, делящих жизнь на «ДО» и «ПОСЛЕ»", content: "" }
                        ]
                    },
                    {
                        title: "Книги для предпринимателя",
                        articles: [
                            { id: 'entrepreneurbooks_1', title: "Книги для предпринимателя - 1 часть", content: "" },
                            { id: 'entrepreneurbooks_2', title: "Книги для предпринимателя - 2 часть", content: "" },
                            { id: 'entrepreneurbooks_3', title: "Книги для предпринимателя - 3 часть", content: "" }
                        ]
                    },
                    {
                        title: "РАДкаст № 0015",
                        articles: [
                            { id: 'radcast15_1', title: "РАДкаст № 0015 - Топ 10 книг к лучшей версии себя", content: "" }
                        ]
                    },
                    {
                        title: "Топ-7 книг по дисциплине",
                        articles: [
                            { id: 'disciplinebooks_1', title: "Топ-7 книг по дисциплине", content: "" }
                        ]
                    },
                    {
                        title: "2 книги, обязательные к прочтению в новой экономике",
                        articles: [
                            { id: 'neweconomybooks_1', title: "2 книги, обязательные к прочтению в новой экономике", content: "" }
                        ]
                    }
                ]
            }
        ]
    },
    // ==================== БИБЛИОТЕКА РАД ====================
    library: {
        description: "Библиотека РАД",
        subsections: []
    }
};

window.contentData = contentData;
