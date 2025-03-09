import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getDatabase, ref, get, remove } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-database.js";

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
let DataMasive = [];
let DataCount = 0;

// Завантаження нотаток після завантаження сторінки
document.addEventListener('DOMContentLoaded', () => {
    const userNotesRef = ref(db, `Page_of_Journal/${userId}`);
    
    get(userNotesRef)
        .then((snapshot) => {
            const notesContainer = document.getElementById('notesContainer');
            notesContainer.innerHTML = ''; // Очищення контейнера

            if (snapshot.exists()) {
                const currentDate = new Date().toLocaleDateString();
                const dateHeader = document.createElement('h3');
                dateHeader.textContent = `Сьогодні: ${currentDate}`;
                notesContainer.appendChild(dateHeader);

                const notesData = snapshot.val();
                Object.keys(notesData).sort().reverse().forEach(date => {
                    const noteData = notesData[date];
                    const noteElement = document.createElement('div');
                    noteElement.classList.add('note-item');
                    noteElement.id = date; // Додаємо id для швидкого видалення
                
                    const noteContent = `
                        <h3 class="note-topic">${noteData.Topic}</h3>
                        <p class="note-bible-reference">${noteData.BibleReference}</p>
                        <p class="note-date">${noteData.Date}</p>
                        <div class="note-text">${renderMarkdown(noteData.Note)}</div>
                        <p class="delete-btn" data-note-id="${date}"><u>Видалити запис</u></p>
                    `;
                
                    noteElement.innerHTML = noteContent;
                    notesContainer.appendChild(noteElement);

                    DataMasive[DataCount] = date;
                    DataCount = DataCount + 1;
                    console.log(DataMasive);
                });

                document.body.addEventListener('click', (event) => {
                    const target = event.target.closest('.delete-btn');
                    console.log("Clicked element:", event.target); // Дивимося, на що натиснули
                    console.log("Closest delete button:", target); // Перевіряємо, чи правильно знайшло кнопку
                    
                    if (!target) return;
                
                    const noteId = target.getAttribute('data-note-id');
                    console.log("Extracted Note ID:", noteId); // Перевіряємо, що отримуємо ID
                
                    if (!noteId) {
                        console.error("data-note-id is missing or null");
                        return;
                    }
                
                    const isConfirmed = window.confirm("Ви дійсно хочете видалити цю нотатку?");
                    if (isConfirmed) {
                        deleteNote(noteId);
                    }
                });
                
                
            } else {
                notesContainer.innerHTML = "<p>У вас немає нотаток.</p>";
            }
        })
        .then(()=>{
            // Виклик функції та виведення результату
            const numberOfRecords = countRecordsInCurrentMonth(DataMasive);
            document.getElementById("numberOfRecords").textContent = `Кількість записів у місяці ${numberOfRecords.monthName}: ${numberOfRecords.count}`;
        })
        .catch((error) => {
            console.error("Помилка при отриманні нотаток: ", error);
        });

});
function countRecordsInCurrentMonth(DataMasive) {
    // Масив назв місяців у правильному відмінку
    const months = [
        'Січні', 'Лютому', 'Березні', 'Квітні', 'Травні', 'Червні',
        'Липні', 'Серпні', 'Вересні', 'Жовтні', 'Листопаді', 'Грудні'
    ];

    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    let count = 0;

    // Проходимо по всіх записах у масиві
    DataMasive.forEach(date => {
        const recordDate = new Date(date);

        // Перевіряємо, чи дата коректна
        if (!isNaN(recordDate)) {
            if (recordDate.getFullYear() === currentYear && recordDate.getMonth() === currentMonth) {
                count++;
            }
        }
    });

    // Виводимо у консоль
    console.log(`Записів у ${months[currentMonth]}: ${count}`);

    // Відображаємо в HTML
    document.getElementById("numberOfRecords").textContent = `Записів у ${months[currentMonth]}: ${count}`;

    return { count, monthName: months[currentMonth] };
}




function renderMarkdown(text) {
    if (typeof marked !== 'undefined') {
        return marked(text);
    } else {
        return text
            .replace(/^######\s(.+)$/gm, '<h6>$1</h6>')
            .replace(/^#####\s(.+)$/gm, '<h5>$1</h5>')
            .replace(/^####\s(.+)$/gm, '<h4>$1</h4>')
            .replace(/^###\s(.+)$/gm, '<h3>$1</h3>')
            .replace(/^##\s(.+)$/gm, '<h2>$1</h2>')
            .replace(/^#\s(.+)$/gm, '<h1>$1</h1>')
            .replace(/\*\*(.+?)\*\*/g, '<b>$1</b>')
            .replace(/__(.+?)__/g, '<b>$1</b>')
            .replace(/\*(.+?)\*/g, '<i>$1</i>')
            .replace(/_(.+?)_/g, '<i>$1</i>')
            .replace(/\*\*\*(.+?)\*\*\*/g, '<b><i>$1</i></b>')
            .replace(/___(.+?)___/g, '<b><i>$1</i></b>')
            .replace(/~~(.+?)~~/g, '<s>$1</s>')
            .replace(/^>\s+([\s\S]+?)(?=<[^>]|$)/gm, '<blockquote>$1</blockquote>')
            .replace(/^\d+\.\s(.+)$/gm, '<li>$1</li>')
            .replace(/(<li>.*<\/li>)/g, '<ol>$1</ol>')
            .replace(/^[-*]\s(.+)$/gm, '<li>$1</li>')
            .replace(/(<li>.*<\/li>)/g, '<ul>$1</ul>')
            .replace(/\[(.+?)\]\((https?:\/\/.+?)\)/g, '<a href="$2">$1</a>')
            .replace(/!\[(.*?)\]\((https?:\/\/.+?)\)/g, '<img src="$2" alt="$1">')
            .replace(/`(.+?)`/g, '<code>$1</code>')
            .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
            .replace(/\n/g, '<br>');
    }
}

function deleteNote(noteId) {
    console.log(noteId);
    const noteRef = ref(db, `Page_of_Journal/${userId}/${noteId}`);
    
    remove(noteRef)
        .then(() => {
            alert("Нотатку успішно видалено.");
            document.getElementById(noteId)?.remove(); // Видаляємо елемент без перезавантаження
        })
        .catch((error) => {
            console.error("Помилка при видаленні нотатки: ", error);
        });
}