// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

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
const productDiv = document.getElementById('product');

// Get product ID from URL
const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get('id');

// Fetch and Display the Full Product Post
async function loadProduct() {
  try {
    const docRef = doc(db, 'posts', productId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const post = docSnap.data();
      const postContent = marked.parse(post.content);

      productDiv.innerHTML = `
        <h2>${post.title}</h2>
        <p><strong>Category:</strong> ${post.category

}</p>
        <div>${postContent}</div>
      `;
    } else {
      productDiv.innerHTML = `<p>Product not found.</p>`;
    }
  } catch (error) {
    productDiv.innerHTML = `<p>Error fetching product details: ${error.message}</p>`;
  }
}

// Load the product on page load
window.onload = loadProduct;