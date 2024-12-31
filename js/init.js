
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

 const signUp = document.getElementById('reg');
 const logIn = document.getElementById('login');
 let UserID = '0';
 signUp.addEventListener('click', (event)=>{
  event.preventDefault();
  const Email = document.getElementById('email').value;
  const Password = document.getElementById('password').value;

  const auth = getAuth();
  const db = getFirestore();
  createUserWithEmailAndPassword(auth, Email, Password)
  .then((userCredential)=>{
    const user = userCredential.user;
    const userData = {
      email: Email
    }
    const docRef = (db, "users", user.uid);
    localStorage.setItem('loggedInUserId', user.uid);

    UserID = docRef;
    setDoc(docRef, userData)
    .then(()=>{
      window.location.href='../ʼsettings.html';
      showMessage('create User', 'signUpMessage');


      
    })
    .catch((error)=>{
      console.error("error writing document", error);

  });
  })
  .catch((error)=>{
    const errorCode=error.code;
    if(errorCode=='auth/email-already-in-use'){
        showMessage('Email Address Already Exists !!!', 'signUpMessage');
    }
    else{
        showMessage('unable to create User', 'signUpMessage');
        window.location.href='settings.html';

    }
})
 })
