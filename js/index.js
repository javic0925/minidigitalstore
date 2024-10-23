// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
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
const newPostSection = document.getElementById('new-post');
const authSection = document.getElementById('auth-section');
const logoutButton = document.getElementById('logout');
const blogForm = document.getElementById('blogForm');
const postsDiv = document.getElementById('posts');

// Toggle Forms Based on Auth State
onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is logged in, show new post section
    authSection.style.display = 'none';
    newPostSection.style.display = 'block';
    loadPosts(); // Load posts once logged in
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
    loadPosts(); // Load posts after login
  } catch (error) {
    alert('Login failed: ' + error.message);
  }
});

// Log Out
logoutButton.addEventListener('click', async () => {
  try {
    await signOut(auth);
    alert('User logged out');
    postsDiv.innerHTML = ''; // Clear posts after logout
  } catch (error) {
    alert('Error logging out: ' + error.message);
  }
});

// Posting a New Blog Post
blogForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const title = document.getElementById('title').value;
  const content = document.getElementById('content').value; // This is the Markdown content
  const category = document.getElementById('category').value; // Category selected from dropdown

  try {
    await addDoc(collection(db, 'posts'), {
      title: title,
      content: content, // Save the raw Markdown
      category: category, // Store category
      timestamp: new Date()  // Add timestamp
    });
    alert('Blog post added');
    blogForm.reset();
    loadPosts(); // Refresh blog posts after submission
  } catch (error) {
    alert('Error posting blog: ' + error.message);
  }
});

// Fetch and Display Blog Posts
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

      // Render the post with category, title, and converted HTML content
      postElement.innerHTML = `
        <h3>${post.title}</h3>
        <p><strong>Category:</strong> ${post.category}</p>
        <div>${postContent}</div>
      `;
      postsDiv.appendChild(postElement);
    });
  } catch (error) {
    alert('Error fetching posts: ' + error.message);
  }
}

// Load posts on page load if user is logged in
window.onload = () => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      loadPosts();
    }
  });
};