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
// Get a reference to the database
const db = getDatabase(app);
const loggedInUserId = localStorage.getItem('loggedInUserId');

const dbRef = ref(getDatabase());
addNewUser();

function addNewUser(){
    console.log(loggedInUserId);

    get(child(dbRef, `users/${loggedInUserId}`))
    .then((snapshot) => {
    if (snapshot.exists()) {
        console.log("User exists:", snapshot.val());
    } else {
        console.log("User does not exist. Creating new user...");
        // Create a new user object (you'll need to define the structure)
        
        // Write the new user data to the database
        set(child(dbRef, "Users/" + loggedInUserId), {
        userId: loggedInUserId
        })
        .then(() => {
            console.log("New user created successfully!");
        })
        .catch((error) => {
            console.error("Error creating user:", error);
        });
    }
    })
    .catch((error) => {
    console.error("Error retrieving user data:", error);
    });

}
function displeyId(){
    document.getElementById('userid').textContent = loggedInUserId;
}
window.onload = displeyId();



let UserInfo = document.getElementById('UserInfo');

UserInfo.addEventListener('click', ()=>{
    const userRef = ref(db, `Users/${loggedInUserId}`);

    set(userRef, {
        userId: loggedInUserId,
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
})