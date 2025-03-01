import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getDatabase, ref, get, child } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-database.js";

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

function getUserData(userId) {
    return get(child(ref(db), `Users/${userId}`))
        .then(snapshot => snapshot.exists() ? snapshot.val() : null);
}

document.addEventListener("DOMContentLoaded", () => {
    getUserData(userId).then(userData => {
        if (userData && userData.firstName) {
            document.querySelector("h1").textContent = `👋 Вітаємо, ${userData.firstName}!`;
        }
    }).catch(error => {
        console.error("Error retrieving user data:", error);
    });
});
