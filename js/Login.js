import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDb-qNN05Es9jRrmIb7R37LM-NH6XDZfYs",
  authDomain: "journal-for-bible.firebaseapp.com",
  databaseURL: "https://journal-for-bible-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "journal-for-bible",
  storageBucket: "journal-for-bible.appspot.com",
  messagingSenderId: "996381846371",
  appId: "1:996381846371:web:efc2dab5666f07d2644156"
};

// Initialize Firebase
initializeApp(firebaseConfig);

const auth = getAuth();

// Check if user is already logged in
onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is logged in, redirect to the main page
    localStorage.setItem('userId', user.uid);
    window.location.href = 'Jornal.html';
  }
});

// Function to show messages
function showMessage(message, divId) {
  const messageDiv = document.getElementById(divId);
  messageDiv.style.display = "block";
  messageDiv.innerHTML = message;
  messageDiv.style.opacity = 1;
  setTimeout(() => {
    messageDiv.style.opacity = 0;
  }, 5000);
}

// Login logic
document.getElementById('logIn').addEventListener('click', (event) => {
  event.preventDefault();
  const email = document.getElementById('emailIN').value;
  const password = document.getElementById('passwordIN').value;
  

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      console.log('User signed in:', userCredential);
      showMessage('Login is successful', 'signInMessage');
      const user = userCredential.user;
      localStorage.setItem('userId', user.uid);
      let firstName = userData ? userData.firstName : "";

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