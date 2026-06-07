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

// ---------- ПРОДВИНУТЫЕ ЧЕК-ЛИСТЫ ----------
const platformTotals = { fb: 15, ig: 14, tw: 13, vk: 18, ok: 14 };
const categoryTotals = {
    fb_b: 6, fb_a: 5, fb_e: 4, ig_b: 5, ig_a: 5, ig_e: 4, tw_b: 5, tw_a: 4, tw_e: 4,
    vk_b: 7, vk_a: 6, vk_e: 5, ok_b: 5, ok_a: 5, ok_e: 4
};

function countChecked(prefix) {
    return document.querySelectorAll(`input[data-key^="${prefix}"]:checked`).length;
}

function updateProgress(platform, total) {
    const checked = countChecked(platform);
    const percent = Math.round((checked / total) * 100);
    const fill = document.getElementById(`${platform}-progress`);
    const text = document.getElementById(`${platform}-total`);
    if (fill) fill.style.width = `${percent}%`;
    if (text) text.textContent = `${checked}/${total}`;
}

// Нерабочая функция, очки в чек-листах не обновлялись.

// function updateCategory(prefix, total) {
//     const checked = countChecked(prefix);
//     const countEl = document.getElementById(`${prefix}-count`);
//     const totalEl = document.getElementById(`${prefix}-total`);
//     if (countEl) countEl.textContent = `${checked}/${total}`;
//     if (totalEl) totalEl.textContent = `${checked}/${total}`;
// }

//Фикс проблемы с обновлением очков
function updateCategory(prefix, total) {
    const checked = countChecked(prefix);

    // Расшифровываем префикс (например, из "fb_b" делаем "fb-basic")
    const parts = prefix.split('_');
    const platform = parts[0];
    const catLetter = parts[1];

    const catNames = {
        'b': 'basic',
        'a': 'advanced',
        'e': 'expert'
    };

    const htmlPrefix = `${platform}-${catNames[catLetter]}`;

    // Теперь скрипт ищет правильные ID из оригинальной HTML-разметки
    const countEl = document.getElementById(`${htmlPrefix}-count`);
    const totalEl = document.getElementById(`${htmlPrefix}-total`);

    if (countEl) countEl.textContent = `${checked}/${total}`;
    if (totalEl) totalEl.textContent = `${checked}/${total}`;
}

document.querySelectorAll('input[type="checkbox"][data-key]').forEach(cb => {
    const saved = localStorage.getItem(cb.dataset.key);
    if (saved === 'true') { cb.checked = true; cb.closest('li')?.classList.add('completed'); }

    cb.addEventListener('change', () => {
        localStorage.setItem(cb.dataset.key, cb.checked);
        const li = cb.closest('li');
        if (cb.checked) li?.classList.add('completed'); else li?.classList.remove('completed');

        const key = cb.dataset.key;
        const platform = key.split('_')[0];
        const category = key.split('_')[1]?.[0];

        if (platform && platformTotals[platform] !== undefined) updateProgress(platform, platformTotals[platform]);
        if (category) {
            const catKey = `${platform}_${category}`;
            if (categoryTotals[catKey] !== undefined) updateCategory(catKey, categoryTotals[catKey]);
        }
    });
});

// Инициализация при загрузке
Object.keys(platformTotals).forEach(pf => updateProgress(pf, platformTotals[pf]));
Object.keys(categoryTotals).forEach(cat => updateCategory(cat, categoryTotals[cat]));

function toggleCategory(catId) {
    const list = document.getElementById(catId);
    if (list) list.style.display = list.style.display === 'none' ? 'block' : 'none';
}

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

    // ---------- ИНТЕРАКТИВНЫЙ СЛАЙДЕР INSTAGRAM ----------
    document.querySelectorAll('.instagram-slider').forEach(slider => {
        const slides = slider.querySelectorAll('.insta-slide');
        const prevBtn = slider.querySelector('.prev-btn');
        const nextBtn = slider.querySelector('.next-btn');
        let currentSlideIdx = 0;

        function updateSlider() {
            slides.forEach((slide, idx) => {
                slide.classList.toggle('active', idx === currentSlideIdx);
            });
            prevBtn.disabled = (currentSlideIdx === 0);
            nextBtn.disabled = (currentSlideIdx === slides.length - 1);
        }

        prevBtn.addEventListener('click', () => {
            if (currentSlideIdx > 0) {
                currentSlideIdx--;
                updateSlider();
            }
        });

        nextBtn.addEventListener('click', () => {
            if (currentSlideIdx < slides.length - 1) {
                currentSlideIdx++;
                updateSlider();
            }
        });
    });

    // ---------- СЛАЙДЕР TWITTER/X ----------
    document.querySelectorAll('.twitter-slider').forEach(slider => {

        const slides = slider.querySelectorAll('.twitter-slide');
        const prevBtn = slider.querySelector('.prev-btn');
        const nextBtn = slider.querySelector('.next-btn');

        let currentSlideIdx = 0;

        function updateSlider() {

            slides.forEach((slide, idx) => {
                slide.classList.toggle('active', idx === currentSlideIdx);
            });

            prevBtn.disabled = currentSlideIdx === 0;
            nextBtn.disabled = currentSlideIdx === slides.length - 1;
        }

        prevBtn.addEventListener('click', () => {
            if (currentSlideIdx > 0) {
                currentSlideIdx--;
                updateSlider();
            }
        });

        nextBtn.addEventListener('click', () => {
            if (currentSlideIdx < slides.length - 1) {
                currentSlideIdx++;
                updateSlider();
            }
        });

        updateSlider();
    });

    // ---------- ФУНКЦИЯ УВЕЛИЧЕНИЯ СКРИНШОТОВ ----------
    document.addEventListener("DOMContentLoaded", () => {
        const modal = document.getElementById("imageModal");
        const modalImg = document.getElementById("fullImg");
        const closeModal = document.querySelector(".close-modal");

        // Проверяем, существуют ли элементы модального окна на странице
        if (!modal || !modalImg) {
            console.error("Ошибка: Модальное окно #imageModal или картинка #fullImg не найдены в HTML!");
            return;
        }

        // Находим все скриншоты в слайдерах и вешаем на них событие клика
        document.querySelectorAll('.slider-img, .insta-slide img').forEach(img => {
            img.addEventListener('click', function () {
                modal.style.display = "flex"; // Показываем модальное окно
                modalImg.src = this.src;     // Берем адрес картинки, на которую кликнули
            });
        });

        // Закрытие по клику на крестик
        if (closeModal) {
            closeModal.addEventListener('click', () => {
                modal.style.display = "none";
            });
        }

        // Закрытие по клику на фон (за пределами картинки)
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = "none";
            }
        });
    });
function toggleInfoCard(card) {
    card.classList.toggle('expanded');
}

document.addEventListener('DOMContentLoaded', () => {
    const sliderCheckboxes = document.querySelectorAll('input[data-sync]');

    // Функция синхронизации состояния
    function initSliderCheckboxes() {
        sliderCheckboxes.forEach(sliderCb => {
            const targetKey = sliderCb.getAttribute('data-sync');
            const mainCb = document.querySelector(`input[data-key="${targetKey}"]`);

            if (mainCb) {
                sliderCb.checked = mainCb.checked;
            }
        });
    }

    // Запускаем проверку сразу и чуть позже для надежности
    initSliderCheckboxes();
    setTimeout(initSliderCheckboxes, 100);

    // Настраиваем клики с принудительным вызовом пересчета очков
    sliderCheckboxes.forEach(sliderCb => {
        const targetKey = sliderCb.getAttribute('data-sync');
        const mainCb = document.querySelector(`input[data-key="${targetKey}"]`);

        if (!mainCb) return;

        sliderCb.addEventListener('change', () => {
            mainCb.checked = sliderCb.checked;

            // Добавляем класс completed родителю
            const li = mainCb.closest('li');
            if (mainCb.checked) {
                li?.classList.add('completed');
            } else {
                li?.classList.remove('completed');
            }

            // Записываем в localStorage, чтобы сохранилось при перезагрузке
            localStorage.setItem(targetKey, mainCb.checked);

            // Имитируем полноценное событие изменения для триггера всех счетчиков прогресса
            mainCb.dispatchEvent(new Event('change', { bubbles: true }));

            // Если функции привязаны жестко к клику, 
            // мы принудительно вызываем глобальные функции обновления, если они доступны
            if (typeof updateProgress === 'function') updateProgress('ig', 14);
            if (typeof updateCategory === 'function') {
                updateCategory('ig_b', 5);
                updateCategory('ig_a', 5);
                updateCategory('ig_e', 4);
            }
        });

        // Если пользователь кликает в самом нижнем чек-листе — обновляем слайдер
        mainCb.addEventListener('change', () => {
            sliderCb.checked = mainCb.checked;
        });
    });
});