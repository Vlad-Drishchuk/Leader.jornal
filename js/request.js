import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-database.js";

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

// Fetch and display user notes on page load
document.addEventListener('DOMContentLoaded', () => {
    const userNotesRef = ref(db, `Page_of_Journal/${loggedInUserId}`);
    
    get(userNotesRef)
        .then((snapshot) => {
            if (snapshot.exists()) {
                const notesContainer = document.getElementById('notesContainer');
                notesContainer.innerHTML = ''; // Clear existing content

                // Display current date
                const currentDate = new Date().toLocaleDateString();
                const dateHeader = document.createElement('h3');
                dateHeader.textContent = `Сьогодні: ${currentDate}`;
                notesContainer.appendChild(dateHeader);

                // Loop through each note by date
                const notesData = snapshot.val();
                Object.keys(notesData).sort().forEach(date => {
                    const noteData = notesData[date];

                    const noteElement = document.createElement('div');
                    noteElement.classList.add('note-item');

                    const noteContent = `
                        <h3 class="note-topic">${noteData.Topic}</h3>
                        <p class="note-bible-reference">${noteData.BibleReference}</p>
                        <p class="note-date">${noteData.Date}</p>
                        <p class="note-text">${noteData.Note}</p>
                    `;

                    noteElement.innerHTML = noteContent;
                    notesContainer.appendChild(noteElement);
                });
            } else {
                console.log("No notes found for this user.");
            }
        })
        .catch((error) => {
            console.error("Error fetching notes: ", error);
        });
});