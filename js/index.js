// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { getFirestore, collection, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAnVzqxKhWWwXLjeJmbjSTWm12KJsnEQfQ",
  authDomain: "djjaviblogs.firebaseapp.com",
  projectId: "djjaviblogs",
  storageBucket: "djjaviblogs.appspot.com",
  messagingSenderId: "856835505863",
  appId: "1:856835505863:web:6d11dfee917e175241c8e2",
  measurementId: "G-TLHQY3NPML"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// DOM Elements
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const newPostSection = document.getElementById('new-post');
const authSection = document.getElementById('auth-section');
const logoutButton = document.getElementById('logout');

// Toggle Forms Based on Auth State
onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is logged in, show new post section
    authSection.style.display = 'none';
    newPostSection.style.display = 'block';
  } else {
    // No user is logged in, show login/signup forms
    authSection.style.display = 'block';
    newPostSection.style.display = 'none';
  }
});

// Sign Up (Register) with Email/Password
signupForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('signupEmail').value;
  const password = document.getElementById('signupPassword').value;

  try {
    await createUserWithEmailAndPassword(auth, email, password);
    alert('User signed up successfully');
  } catch (error) {
    alert('Sign up failed: ' + error.message);
  }
});

// Log In with Email/Password
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;

  try {
    await signInWithEmailAndPassword(auth, email, password);
    alert('User logged in successfully');
  } catch (error) {
    alert('Login failed: ' + error.message);
  }
});

// Log Out
logoutButton.addEventListener('click', async () => {
  try {
    await signOut(auth);
    alert('User logged out');
  } catch (error) {
    alert('Error logging out: ' + error.message);
  }
});