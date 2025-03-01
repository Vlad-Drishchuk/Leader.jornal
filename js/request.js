import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-database.js";

// Firebase конфігурація
const firebaseConfig = {
    apiKey: "AIzaSyDb-qNN05Es9jRrmIb7R37LM-NH6XDZfYs",
    authDomain: "journal-for-bible.firebaseapp.com",
    databaseURL: "https://journal-for-bible-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "journal-for-bible",
    storageBucket: "journal-for-bible.appspot.com",
    messagingSenderId: "996381846371",
    appId: "1:996381846371:web:efc2dab5666f07d2644156"
};

// Ініціалізація Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const userId = localStorage.getItem('userId');

// Завантаження нотаток після завантаження сторінки
document.addEventListener('DOMContentLoaded', () => {
    const userNotesRef = ref(db, `Page_of_Journal/${userId}`);
    
    get(userNotesRef)
        .then((snapshot) => {
            const notesContainer = document.getElementById('notesContainer');
            notesContainer.innerHTML = ''; // Очищення контейнера

            if (snapshot.exists()) {
                // Відображення поточної дати
                const currentDate = new Date().toLocaleDateString();
                const dateHeader = document.createElement('h3');
                dateHeader.textContent = `Сьогодні: ${currentDate}`;
                notesContainer.appendChild(dateHeader);

                // Відображення нотаток
                const notesData = snapshot.val();
                Object.keys(notesData).sort().reverse().forEach(date => {
                    const noteData = notesData[date];
                    const noteElement = document.createElement('div');
                    noteElement.classList.add('note-item');
                
                    const noteContent = `
                        <h3 class="note-topic">${noteData.Topic}</h3>
                        <p class="note-bible-reference">${noteData.BibleReference}</p>
                        <p class="note-date">${noteData.Date}</p>
                        <div class="note-text">${renderMarkdown(noteData.Note)}</div>
                    `;
                
                    noteElement.innerHTML = noteContent;
                    notesContainer.appendChild(noteElement);
                });
                
            } else {
                notesContainer.innerHTML = "<p>У вас немає нотаток.</p>";
            }
        })
        .catch((error) => {
            console.error("Помилка при отриманні нотаток: ", error);
        });
});

function renderMarkdown(text) {
    if (typeof marked !== 'undefined') {
        // Якщо бібліотека Marked.js доступна
        return marked(text);
    } else {
        // Замінюємо Markdown-позначення на HTML
        return text
            // Заголовки (#, ##, ### тощо)
            .replace(/^######\s(.+)$/gm, '<h6>$1</h6>')
            .replace(/^#####\s(.+)$/gm, '<h5>$1</h5>')
            .replace(/^####\s(.+)$/gm, '<h4>$1</h4>')
            .replace(/^###\s(.+)$/gm, '<h3>$1</h3>')
            .replace(/^##\s(.+)$/gm, '<h2>$1</h2>')
            .replace(/^#\s(.+)$/gm, '<h1>$1</h1>')

            // Жирний текст (**текст** або __текст__)
            .replace(/\*\*(.+?)\*\*/g, '<b>$1</b>')
            .replace(/__(.+?)__/g, '<b>$1</b>')

            // Курсив (*текст* або _текст_)
            .replace(/\*(.+?)\*/g, '<i>$1</i>')
            .replace(/_(.+?)_/g, '<i>$1</i>')

            // Жирний + курсив (***текст*** або ___текст___)
            .replace(/\*\*\*(.+?)\*\*\*/g, '<b><i>$1</i></b>')
            .replace(/___(.+?)___/g, '<b><i>$1</i></b>')

            // Закреслений текст (~~текст~~)
            .replace(/~~(.+?)~~/g, '<s>$1</s>')

            // Цитати (>)
            .replace(/^>\s(.+)$/gm, '<blockquote>$1</blockquote>')

            // Нумеровані списки (1. текст)
            .replace(/^\d+\.\s(.+)$/gm, '<li>$1</li>') // Нумерований пункт
            .replace(/(<li>.*<\/li>)/g, '<ol>$1</ol>') // Обгортання списку

            // Марковані списки (- текст або * текст)
            .replace(/^[-*]\s(.+)$/gm, '<li>$1</li>') // Маркований пункт
            .replace(/(<li>.*<\/li>)/g, '<ul>$1</ul>') // Обгортання списку

            // Лінки ([текст](url))
            .replace(/\[(.+?)\]\((https?:\/\/.+?)\)/g, '<a href="$2">$1</a>')

            // Зображення (![alt](url))
            .replace(/!\[(.*?)\]\((https?:\/\/.+?)\)/g, '<img src="$2" alt="$1">')

            // Код у рядку (`код`)
            .replace(/`(.+?)`/g, '<code>$1</code>')

            // Блоки коду (```код```)
            .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')

            // Розриви рядків (\n)
            .replace(/\n/g, '<br>');
    }
}