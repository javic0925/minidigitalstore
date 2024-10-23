// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

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
const blogForm = document.getElementById('blogForm');
const authSection = document.getElementById('auth-section');
const newPostSection = document.getElementById('new-post');
const postsDiv = document.getElementById('posts');
const logoutButton = document.getElementById('logout');

// Sign Up (Register) with Email/Password
signupForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('signupEmail').value;
  const password = document.getElementById('signupPassword').value;

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    alert('User signed up successfully');
    authSection.style.display = 'none';
    newPostSection.style.display = 'block'; // Show blog post form for authenticated user
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
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    alert('User logged in successfully');
    authSection.style.display = 'none'; // Hide login form
    newPostSection.style.display = 'block'; // Show blog post form for authenticated user
  } catch (error) {
    alert('Login failed: ' + error.message);
  }
});

// Log Out
logoutButton.addEventListener('click', async () => {
  try {
    await signOut(auth);
    alert('User logged out');
    authSection.style.display = 'block'; // Show login form
    newPostSection.style.display = 'none'; // Hide blog post form
  } catch (error) {
    alert('Error logging out: ' + error.message);
  }
});

// Posting a New Blog (Markdown support added)
blogForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const title = document.getElementById('title').value;
  const content = document.getElementById('content').value; // This is the Markdown content

  try {
    await addDoc(collection(db, 'posts'), {
      title: title,
      content: content, // Save the raw Markdown
      timestamp: new Date()  // Add timestamp
    });
    alert('Blog post added');
    blogForm.reset();
    loadPosts(); // Refresh blog posts after submission
  } catch (error) {
    alert('Error posting blog: ' + error.message);
  }
});

// Fetch and Display Blog Posts (Markdown converted to HTML)
async function loadPosts() {
  postsDiv.innerHTML = ''; // Clear previous posts
  try {
    const q = query(collection(db, 'posts'), orderBy('timestamp', 'desc'));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      const post = doc.data();
      const postElement = document.createElement('div');
      postElement.classList.add('post');
      
      // Convert Markdown to HTML using marked.parse() for the latest version
      const postContent = marked.parse(post.content);

      // Render the post with converted HTML content
      postElement.innerHTML = `<h3>${post.title}</h3><div>${postContent}</div>`;
      postsDiv.appendChild(postElement);
    });
  } catch (error) {
    alert('Error fetching posts: ' + error.message);
  }
}

// Load posts on page load
window.onload = loadPosts;