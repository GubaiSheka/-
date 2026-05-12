
    // ---------- НАВИГАЦИЯ ----------
    const links = document.querySelectorAll('nav a');
    const sections = document.querySelectorAll('section');
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            sections.forEach(sec => sec.classList.remove('active'));
            const targetId = link.dataset.target;
            if (document.getElementById(targetId)) {
                document.getElementById(targetId).classList.add('active');
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    });

    // ---------- ЧЕК-ЛИСТЫ СОХРАНЕНИЕ (LocalStorage) ----------
    const checkboxes = document.querySelectorAll('input[type="checkbox"][data-key]');
    checkboxes.forEach(cb => {
        const saved = localStorage.getItem(cb.dataset.key);
        if (saved === 'true') {
            cb.checked = true;
            if (cb.parentElement) cb.parentElement.classList.add('completed');
        }
        cb.addEventListener('change', () => {
            localStorage.setItem(cb.dataset.key, cb.checked);
            if (cb.checked) {
                if (cb.parentElement) cb.parentElement.classList.add('completed');
            } else {
                if (cb.parentElement) cb.parentElement.classList.remove('completed');
            }
        });
    });

    // ---------- ГЕНЕРАЦИЯ 20 ВОПРОСОВ (массив) ----------
    const questionsBank = [
        { text: "1. Facebook: Какие действия повышают безопасность аккаунта?", type: "checkbox", options: ["Включить двухфакторную аутентификацию", "Использовать один и тот же пароль на всех сервисах", "Игнорировать уведомления о входе", "Регулярно проверять активные сессии"], correct: [0,3], multi: true },
        { text: "2. ВКонтакте: Что в первую очередь нужно сделать при подозрении на несанкционированный вход?", type: "radio", options: ["Написать друзьям о взломе", "Удалить все посты в стене", "Сменить пароль и проверить активные сессии", "Ничего, пройдет само"], correct: [2], multi: false },
        { text: "3. Что такое фишинг?", type: "radio", options: ["Легальный способ сбора данных", "Мошенническая попытка получить логин/пароль через поддельные сайты", "Новый метод шифрования", "Антивирусная программа"], correct: [1], multi: false },
        { text: "4. Какие признаки указывают на подозрительное сообщение в Instagram?", type: "checkbox", options: ["Срочная просьба перейти по ссылке и ввести пароль", "Сообщение от незнакомца с призом", "Сообщение от друга с обычным 'Привет' без ссылок", "Грамматические ошибки и странный адрес ссылки"], correct: [0,1,3], multi: true },
        { text: "5. Двухфакторная аутентификация (2FA) — это:", type: "radio", options: ["Два разных пароля", "Код из SMS или приложения + пароль", "Сканирование лица", "Подтверждение по email"], correct: [1], multi: false },
        { text: "6. Какой пароль считается наиболее надёжным?", type: "radio", options: ["qwerty123", "М@я_Тайн@я_Пар0ль_%$#", "password2024", "имя_кошки"], correct: [1], multi: false },
        { text: "7. Twitter/X: какие настройки защитят ваш аккаунт от нежелательного внимания?", type: "checkbox", options: ["Отключить возможность отмечать вас в фото", "Включить двухфакторку", "Сделать твиты защищёнными (только подписчики)", "Опубликовать номер телефона в био"], correct: [1,2], multi: true },
        { text: "8. Что такое подозрительная активная сессия?", type: "radio", options: ["Вход из другого города или с неизвестного устройства", "Ваш ноутбук дома", "Вход с рабочего ПК", "Мобильное приложение соцсети"], correct: [0], multi: false },
        { text: "9. В Одноклассниках вы получили ссылку от друга «смотри прикол». Как правильно поступить?", type: "radio", options: ["Немедленно перейти по ссылке", "Нажать и ввести логин", "Отправить ссылку всем контактам", "Спросить у друга в другом мессенджере, отправлял ли он ссылку"], correct: [3], multi: false },
        { text: "10. Какие данные НЕЛЬЗЯ публиковать в открытом профиле?", type: "checkbox", options: ["Номер телефона", "Адрес проживания", "Личные данные", "Пароль от аккаунта"], correct: [0,1,2,3], multi: true },
        { text: "11. Менеджеры паролей — это:", type: "radio", options: ["Программы для кражи паролей", "Плагины для браузера без пользы", "Сервисы для хранения и генерации сложных паролей", "То же самое что и антивирус"], correct: [2], multi: false },
        { text: "12. При входе в Facebook вас просят ввести код из SMS, хотя 2FA не включена. Что это?", type: "radio", options: ["Новая функция безопасности", "Фишинг / попытка перехвата", "Сбой системы", "Дружеское уведомление"], correct: [1], multi: false },
        { text: "13. В Instagram пришло письмо от 'support@instagrаm-security.com' с просьбой сменить пароль. Ваши действия:", type: "radio", options: ["Перейти по ссылке из письма", "Проигнорировать и перейти в настройки Instagram официально", "Отправить пароль обратно", "Ответить на письмо"], correct: [1], multi: false },
        { text: "14. Какие приложения могут угрожать вашему аккаунту ВК?", type: "checkbox", options: ["Официальное приложение ВК", "Неофициальные клиенты ВК", "Приложения, запрашивающие доступ к сообщениям без необходимости", "Официальный сайт ВК"], correct: [1,2], multi: true },
        { text: "15. Нужно ли использовать публичные Wi-Fi сети для входа в социальные сети без VPN?", type: "radio", options: ["Да, это безопасно", "Только если зайти на 5 минут", "Нет, данные могут перехватить злоумышленники", "Да, если пароль сложный"], correct: [2], multi: false },
        { text: "16. Что нужно сделать при утере телефона, где настроен вход без пароля?", type: "checkbox", options: ["Немедленно сменить пароли аккаунтов", "Заблокировать SIM-карту у оператора", "Ничего, куплю новый", "Удалить сессии через компьютер/другой девайс"], correct: [0,1,3], multi: true },
        { text: "17. Как часто рекомендуется проверять список активных устройств в настройках аккаунта?", type: "radio", options: ["Раз в год", "Раз в месяц или при подозрениях", "Никогда", "Только при взломе"], correct: [1], multi: false },
        { text: "18. В Twitter/X вы заметили подозрительный твит-бот, который начал писать вам в директ. Лучшая защита:", type: "radio", options: ["Ответить боту", "Игнорировать, но не блокировать", "Кликнуть по ссылке из сообщения", "Заблокировать и пожаловаться"], correct: [3], multi: false },
        { text: "19. Что такое социальная инженерия?", type: "radio", options: ["Метод обмана людей для получения доступа к данным", "Инженерная специальность", "Новый вид шифрования", "Система двухфакторки"], correct: [0], multi: false },
        { text: "20. Полезные привычки для защиты аккаунтов:", type: "checkbox", options: ["Регулярно обновлять пароли", "Пользоваться 2FA везде, где возможно", "Не использовать один пароль везде", "Сохранять пароли в заметках телефона без шифрования"], correct: [0,1,2], multi: true }
    ];

    // Функция рендеринга с вертикальным расположением ответов
    function renderFullTest() {
        const container = document.getElementById('questionsContainer');
        if (!container) return;
        let html = '';
        questionsBank.forEach((q, idx) => {
            const namePrefix = `q_${idx}`;
            if (q.type === 'radio') {
                html += `<div class="question" data-qid="${idx}"><h3>${q.text}</h3><div class="answers-vertical">`;
                q.options.forEach((opt, optIdx) => {
                    html += `<label><input type="radio" name="${namePrefix}" value="${optIdx}"> ${opt}</label>`;
                });
                html += `</div></div>`;
            } else {
                html += `<div class="question" data-qid="${idx}"><h3>${q.text} <span style="font-size:0.85rem; background:#f6f5c4; padding:2px 8px; border-radius:20px;">(возможно несколько ответов)</span></h3><div class="answers-vertical">`;
                q.options.forEach((opt, optIdx) => {
                    html += `<label><input type="checkbox" name="${namePrefix}_chk" value="${optIdx}"> ${opt}</label>`;
                });
                html += `</div></div>`;
            }
        });
        container.innerHTML = html;
    }
    renderFullTest();

    // Проверка теста
    function checkFullTest() {
        let totalScore = 0;
        for (let i = 0; i < questionsBank.length; i++) {
            const q = questionsBank[i];
            if (q.type === 'radio') {
                const selected = document.querySelector(`input[name="q_${i}"]:checked`);
                if (selected && q.correct.includes(parseInt(selected.value))) totalScore++;
            }
            else {
                const checkboxesGroup = document.querySelectorAll(`input[name="q_${i}_chk"]`);
                if (checkboxesGroup.length) {
                    const selectedValues = [];
                    checkboxesGroup.forEach(cb => { if (cb.checked) selectedValues.push(parseInt(cb.value)); });
                    const correctSorted = [...q.correct].sort((a,b)=>a-b);
                    const selectedSorted = [...selectedValues].sort((a,b)=>a-b);
                    if (correctSorted.length === selectedSorted.length && correctSorted.every((val, idx) => val === selectedSorted[idx])) totalScore++;
                }
            }
        }
        const maxPoints = questionsBank.length;
        const resultDiv = document.getElementById('result');
        const counterDiv = document.getElementById('testScoreCounter');
        if(counterDiv) counterDiv.innerHTML = `✅ ${totalScore} / ${maxPoints}`;

        let message = '';
        if (totalScore === maxPoints) message = '🎉 Поздравляем! Вы настоящий эксперт по безопасности аккаунтов! Так держать.';
        else if (totalScore >= 15) message = '⭐ Хороший результат! Вы знаете основные правила, но повторите чек-листы для максимальной защиты.';
        else if (totalScore >= 10) message = '⚠️ Неплохо, но есть пробелы. Пройдите чек-листы на вкладках соцсетей и пересдайте тест.';
        else message = '🔒 Важно! Вашим аккаунтам нужна срочная защита. Изучите инструкции, включите двухфакторку и повторите тест.';

        resultDiv.innerHTML = `<h3>📊 Ваш результат: ${totalScore} из ${maxPoints}</h3><p><strong>${message}</strong></p><p>🔍 Рекомендации: убедитесь, что двухфакторная аутентификация включена везде, пароли уникальны, а активные сессии проверены.</p>`;
        resultDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    window.checkFullTest = checkFullTest;
    const counterSpan = document.getElementById('testScoreCounter');
    if(counterSpan) counterSpan.innerHTML = `✅ 0 / ${questionsBank.length}`;
