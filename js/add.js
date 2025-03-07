// add.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyDb-qNN05Es9jRrmIb7R37LM-NH6XDZfYs",
    authDomain: "journal-for-bible.firebaseapp.com",
    databaseURL: "https://journal-for-bible-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "journal-for-bible",
    storageBucket: "journal-for-bible.appspot.com",
    messagingSenderId: "996381846371",
    appId: "1:996381846371:web:efc2dab5666f07d2644156"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const userId = localStorage.getItem('userId');

document.getElementById('SaveNote').addEventListener('click', async () => {
    const topic = document.getElementById('topic').value.trim();
    const bibleReference = document.getElementById('bibleReference').value.trim();
    const date = document.getElementById('date').value.trim();
    const note = document.getElementById('note').value.trim();

    if (!topic || !bibleReference || !date || !note) {
        alert("Будь ласка, заповніть всі поля.");
        return;
    }

    const refNote = ref(db, `Page_of_Journal/${userId}/${date}`);

    try {
        await set(refNote, {
            Topic: topic,
            BibleReference: bibleReference,
            Date: date,
            Note: note
        });

        console.log("Дані успішно збережено!");
        clearFormFields();

        // Перенаправлення після успішного збереження
        window.location.href = 'Jornal.html';

    } catch (error) {
        console.error("Помилка:", error);

        if (error.code === 'PERMISSION_DENIED' || error.message.includes('405')) {
            console.warn("Сервер заблокував запит. Перенаправлення...");
        }

        window.location.href = 'Jornal.html';  // Завжди перенаправляємо
    }
});

function clearFormFields() {
    document.getElementById('topic').value = '';
    document.getElementById('bibleReference').value = '';
    document.getElementById('date').value = '';
    document.getElementById('note').value = '';
}
