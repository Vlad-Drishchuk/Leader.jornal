import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getDatabase, ref, set, get, child } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-database.js";

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
const dbRef = ref(db);

document.addEventListener("DOMContentLoaded", () => {
    displeyId();
    loadUserData();
});

function displeyId() {
    document.getElementById('userid').textContent = userId;
}

function loadUserData() {
    getUserData(userId).then(userData => {
        if (userData) {
            document.getElementById('lastName').value = userData.lastName || "";
            document.getElementById('firstName').value = userData.firstName || "";
        }
    }).catch(error => {
        console.error("Error retrieving user data:", error);
    });
}

function getUserData(userId) {
    return get(child(dbRef, `Users/${userId}`))
        .then(snapshot => snapshot.exists() ? snapshot.val() : null);
}

let UserInfo = document.getElementById('UserInfo');

UserInfo.addEventListener('click', () => {
    const userRef = ref(db, `Users/${userId}`);

    set(userRef, {
        userId: userId,
        lastName: document.getElementById('lastName').value.trim(),
        firstName: document.getElementById('firstName').value.trim()
    })
    .then(() => {
        console.log('User fields updated/created successfully!');
        window.location.href = 'Jornal.html';
    })
    .catch((error) => {
        console.error('Error updating/creating user fields:', error);
    });
});
