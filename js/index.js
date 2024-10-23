// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

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
const db = getFirestore(app);
const auth = getAuth(app);

// DOM Elements
const newPostSection = document.getElementById('new-post');
const loginModal = document.getElementById('loginModal');
const loginButton = document.getElementById('loginButton');
const closeModal = document.querySelector('.close');
const logoutButton = document.getElementById('logout');

// Handle Modal Open and Close
loginButton.addEventListener('click', () => {
  loginModal.style.display = 'block';
});

closeModal.addEventListener('click', () => {
  loginModal.style.display = 'none';
});

window.onclick = (event) => {
  if (event.target === loginModal) {
    loginModal.style.display = 'none';
  }
};

// Log In functionality
const loginForm = document.getElementById('loginForm');
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;

  try {
    await signInWithEmailAndPassword(auth, email, password);
    alert('User logged in successfully');
    loginModal.style.display = 'none'; // Hide modal on successful login
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
    loadPosts(); // Reload posts after logout
  } catch (error) {
    alert('Error logging out: ' + error.message);
  }
});

// Posting a New Blog Post with Image URL
const blogForm = document.getElementById('blogForm');
blogForm.addEventListener('submit', async (e) => {
  e.preventDefault(); // Prevent form from refreshing the page

  const title = document.getElementById('title').value;
  const content = document.getElementById('content').value;
  const imageUrl = document.getElementById('imageUrl').value; // Get the image URL
  const category = document.getElementById('category').value;

  try {
    await addDoc(collection(db, 'posts'), {
      title: title,
      content: content, // Save the raw Markdown
      imageUrl: imageUrl, // Save the image URL
      category: category,
      timestamp: new Date()
    });

    // Show success message
    alert('Blog post added successfully!');

    // Reset the form
    blogForm.reset();

    // Load posts after submission to update the post list
    loadPosts();
  } catch (error) {
    alert('Error posting blog: ' + error.message);
  }
});

// Fetch and Display Blog Posts
async function loadPosts() {
  const samplePacksDiv = document.getElementById('sample-packs');
  const mixesDiv = document.getElementById('mixes');
  const remixesDiv = document.getElementById('remixes');

  samplePacksDiv.innerHTML = '';
  mixesDiv.innerHTML = '';
  remixesDiv.innerHTML = '';

  try {
    const q = query(collection(db, 'posts'), orderBy('timestamp', 'desc'));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      const post = doc.data();
      const postElement = document.createElement('div');
      postElement.classList.add('post');
      const postSnippet = post.content.split(' ').slice(0, 20).join(' ') + '...';
      const postImage = post.imageUrl ? `<img src="${post.imageUrl}" alt="${post.title}" width="300">` : '';

      postElement.innerHTML = `
        ${postImage}
        <h3><a href="product.html?id=${doc.id}">${post.title}</a></h3>
        <p>${postSnippet}</p>
      `;

      if (post.category === 'Sample Packs') {
        samplePacksDiv.appendChild(postElement);
      } else if (post.category === 'Mixes') {
        mixesDiv.appendChild(postElement);
      } else if (post.category === 'Remixes') {
        remixesDiv.appendChild(postElement);
      }
    });
  } catch (error) {
    alert('Error fetching posts: ' + error.message);
  }
}

// Toggle Forms Based on Auth State
onAuthStateChanged(auth, (user) => {
  if (user) {
    newPostSection.style.display = 'block';
    logoutButton.style.display = 'block';
  } else {
    newPostSection.style.display = 'none';
    logoutButton.style.display = 'none';
  }
});

// Load posts on page load
window.onload = loadPosts;