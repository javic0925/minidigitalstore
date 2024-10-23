// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
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
const db = getFirestore(app);

// DOM Elements for category sections
const samplePacksDiv = document.getElementById('sample-packs');
const mixesDiv = document.getElementById('mixes');
const remixesDiv = document.getElementById('remixes');

// Fetch and Display Blog Posts in Each Category Section
async function loadPosts() {
  samplePacksDiv.innerHTML = ''; // Clear previous Sample Packs
  mixesDiv.innerHTML = ''; // Clear previous Mixes
  remixesDiv.innerHTML = ''; // Clear previous Remixes

  try {
    const q = query(collection(db, 'posts'), orderBy('timestamp', 'desc'));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      const post = doc.data();

      // Create a clickable div for each post
      const postElement = document.createElement('div');
      postElement.classList.add('post');
      const postSnippet = post.content.split(' ').slice(0, 20).join(' ') + '...'; // Snippet for display

      postElement.innerHTML = `
        <h3><a href="product.html?id=${doc.id}">${post.title}</a></h3>
        <p>${postSnippet}</p>
      `;

      // Append the post to the correct category section
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

// Load posts on page load
window.onload = loadPosts;