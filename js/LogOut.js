import { signOut, getAuth } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";

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
const auth = getAuth(app); // Ініціалізація Auth

document.getElementById('logoutButton').addEventListener('click', () => {
    signOut(auth)
        .then(() => {
            // Видаляємо локальні дані після виходу
            localStorage.removeItem('userId');
            window.location.href = './index.html'; // Перенаправлення на сторінку входу
        })
        .catch((error) => {
            console.error("Error during logout: ", error);
        });
});
