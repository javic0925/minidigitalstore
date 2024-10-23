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

// DOM Elements
const thumbnailsDiv = document.getElementById('thumbnails');

// Fetch and Display Product Thumbnails
async function loadThumbnails(categoryFilter = 'all') {
  thumbnailsDiv.innerHTML = ''; // Clear previous posts
  try {
    const q = query(collection(db, 'posts'), orderBy('timestamp', 'desc'));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      const post = doc.data();

      // If a category filter is applied, check if the post matches the category
      if (categoryFilter === 'all' || post.category === categoryFilter) {
        const postElement = document.createElement('div');
        postElement.classList.add('thumbnail');

        // Extract a short snippet from the post content
        const postSnippet = post.content.split(' ').slice(0, 20).join(' ') + '...'; // First 20 words as snippet

        // Generate the thumbnail with image, title, and snippet, linking to the full post
        postElement.innerHTML = `
          <img src="${post.thumbnail || 'default-thumbnail.jpg'}" alt="${post.title}" width="200">
          <h3><a href="product.html?id=${doc.id}">${post.title}</a></h3>
          <p>${postSnippet}</p>
        `;

        thumbnailsDiv.appendChild(postElement);
      }
    });
  } catch (error) {
    alert('Error fetching products: ' + error.message);
  }
}

// Event listeners for filtering by category
const filterButtons = document.querySelectorAll('#filters button');
filterButtons.forEach(button => {
  button.addEventListener('click', (e) => {
    const filter = e.target.getAttribute('data-filter');
    loadThumbnails(filter); // Load thumbnails based on selected category
  });
});

// Load all thumbnails on page load
window.onload = () => loadThumbnails('all'); // Default to showing all posts