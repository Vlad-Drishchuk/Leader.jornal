// ADD.JS

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getDatabase, ref, set, onValue } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-database.js";

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
const loggedInUserId = localStorage.getItem('loggedInUserId');

document.getElementById('SaveNote').addEventListener('click', () => {
    const topic = document.getElementById('topic').value.trim();
    const bibleReference = document.getElementById('bibleReference').value.trim();
    const date = document.getElementById('date').value.trim();
    const note = document.getElementById('note').value.trim();

    if (!topic || !bibleReference || !date || !note) {
        alert("Будь ласка, заповніть всі поля.");
        return;
    }

    const refNote = ref(db, `Page_of_Journal/${loggedInUserId}/${date}`);

    set(refNote, {
        Topic: topic,
        BibleReference: bibleReference,
        Date: date,
        Note: note
    })
    .then(() => {
        console.log("Дані успішно збережено!");
        clearFormFields();
        displayNotes(); // Оновлюємо нотатки
    })
    .catch((error) => {
        alert("Помилка: " + error.message);
        console.error("Error:", error);
    });
});

function clearFormFields() {
    document.getElementById('topic').value = '';
    document.getElementById('bibleReference').value = '';
    document.getElementById('date').value = '';
    document.getElementById('note').value = '';
}
