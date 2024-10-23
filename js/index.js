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

// DOM Elements for different category sections
const samplePacksDiv = document.getElementById('sample-packs-thumbnails');
const mixesDiv = document.getElementById('mixes-thumbnails');
const remixesDiv = document.getElementById('remixes-thumbnails');

// Fetch and Display Products in Their Respective Sections
async function loadProductsByCategory() {
  try {
    const q = query(collection(db, 'posts'), orderBy('timestamp', 'desc'));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      const post = doc.data();

      const postElement = document.createElement('div');
      postElement.classList.add('thumbnail');

      // Extract a short snippet from the post content
      const postSnippet = post.content.split(' ').slice(0, 20).join(' ') + '...'; // First 20 words as snippet

      // Generate the thumbnail with image, title, and snippet, linking to the full post
      postElement.innerHTML = `
        <img src="${post.thumbnail || 'default-thumbnail.jpg'}" alt="${post.title}">
        <h3><a href="product.html?id=${doc.id}">${post.title}</a></h3>
        <p>${postSnippet}</p>
      `;

      // Append the product to the correct section based on its category
      if (post.category === 'Sample Packs') {
        samplePacksDiv.appendChild(postElement);
      } else if (post.category === 'Mixes') {
        mixesDiv.appendChild(postElement);
      } else if (post.category === 'Remixes') {
        remixesDiv.appendChild(postElement);
      }
    });
  } catch (error) {
    alert('Error fetching products: ' + error.message);
  }
}

// Load products on page load
window.onload = loadProductsByCategory;