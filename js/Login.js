
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import{getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";
import { getFirestore, setDoc, doc } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";


const firebaseConfig = {
  apiKey: "AIzaSyDb-qNN05Es9jRrmIb7R37LM-NH6XDZfYs",
  authDomain: "journal-for-bible.firebaseapp.com",
  databaseURL: "https://journal-for-bible-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "journal-for-bible",
  storageBucket: "journal-for-bible.appspot.com",
  messagingSenderId: "996381846371",
  appId: "1:996381846371:web:efc2dab5666f07d2644156"
};
// Initialize Firebase app
initializeApp(firebaseConfig);

// Get references to authentication and database

function showMessage(message, divId){
   var messageDiv=document.getElementById(divId);
   messageDiv.style.display="block";
   messageDiv.innerHTML=message;
   messageDiv.style.opacity=1;
   setTimeout(function(){
       messageDiv.style.opacity=0;
   },5000);
}

const signIn=document.getElementById('logIn');

signIn.addEventListener('click', (event)=>{
    event.preventDefault();
    console.log("Signing...")
    const email = document.getElementById('emailIN').value;
    const password = document.getElementById('passwordIN').value;
    const auth = getAuth();
 
    signInWithEmailAndPassword(auth, email, password)
.then((userCredential) => {
    console.log('User signed in:', userCredential);
    showMessage('Login is successful', 'signInMessage');
    const user = userCredential.user;
    localStorage.setItem('loggedInUserId', user.uid);
    window.location.href = 'Jornal.html';
})
.catch((error) => {
    console.error('Error during sign in:', error);
    const errorCode = error.code;
    const errorMessage = error.message;

    if (errorCode === 'auth/wrong-password') {
        showMessage('Incorrect Email or Password', 'signInMessage');
    } else if (errorCode === 'auth/user-not-found') {
        showMessage('Account does not exist', 'signInMessage');
    } else if (errorCode === 'auth/too-many-requests') {
        showMessage('Too many unsuccessful login attempts. Please try again later.', 'signInMessage');
    } else {
        showMessage(`An error occurred: ${errorMessage}`, 'signInMessage');
    }
});

 });
 