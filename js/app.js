// --- app.js (SIMPLIFIED & CORRECTED) ---

// CORRECTED IMPORT: The config file is named 'config.js'
import { db } from './config.js'; 
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";
import { doc, getDoc, collection, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', () => {

    // --- ELEMENT SELECTORS (Updated to match your index.html) ---
    const welcomeMessage = document.getElementById('welcome-message');
    const popularItemsContainer = document.getElementById('popular-items-container');
    
    // --- APP STATE ---
    const auth = getAuth();
    let menuCache = []; // Cache for menu items

    // --- AUTHENTICATION GATEKEEPER ---
    onAuthStateChanged(auth, (user) => {
        if (user) {
            console.log("User is logged in:", user.uid);
            // Fetch user's profile to get their name
            fetchUserProfile(user);
        } else {
            console.log("No user logged in, redirecting to login.");
            // Assuming you have a login.html at the root level
            window.location.href = 'login.html'; 
        }
    });

    const fetchUserProfile = async (user) => {
        const userRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(userRef);

        let userName = 'friend'; // Default name
        if (docSnap.exists()) {
            userName = docSnap.data().name || 'friend';
        }
        
        // Once we have the name, initialize the UI
        initializeAppUI(userName);
    };
    
    // --- UI INITIALIZATION ---
    const initializeAppUI = async (userName) => {
        // Update the welcome message
        if (welcomeMessage) {
            welcomeMessage.textContent = `Welcome, ${userName}.`;
        }
        // Fetch and display the menu items
        await fetchAndPopulateMenus();
    };
    
    // --- MENU & CONTENT POPULATION ---
    const createMenuItemHTML = (item) => {
        // This function creates the HTML for a single popular item card
        // (You can style this further in your CSS if you wish)
        const entry = document.createElement('div');
        entry.className = 'popular-item-card'; // Add a class for styling
        entry.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="item-info">
                <h4>${item.name}</h4>
                <p>£${item.price.toFixed(2)}</p>
            </div>`;
        return entry;
    };

    const fetchAndPopulateMenus = async () => {
        if (menuCache.length > 0) {
            populateFromCache();
            return;
        }
        try {
            console.log("Fetching menu from Firestore...");
            // Assumes your menu collection is named 'menu'
            const menuCollection = collection(db, "menu"); 
            const q = query(menuCollection, orderBy("category"));
            const querySnapshot = await getDocs(q);
            
            querySnapshot.forEach((doc) => {
                menuCache.push({ id: doc.id, ...doc.data() });
            });

            console.log("Menu fetched and cached.", menuCache.length, "items.");
            populateFromCache();

        } catch (error) {
            console.error("Error fetching menu items:", error);
            if(popularItemsContainer) {
                popularItemsContainer.innerHTML = "<p>Could not load the menu at this time.</p>";
            }
        }
    };
    
    const populateFromCache = () => {
        if (!popularItemsContainer) return;
        popularItemsContainer.innerHTML = ''; // Clear "Loading..." message
        
        if (menuCache.length === 0) {
            popularItemsContainer.innerHTML = "<p>No menu items available right now.</p>";
            return;
        }
        
        // Display the first 4 items as "popular"
        const popular = menuCache.slice(0, 4);
        popular.forEach(item => popularItemsContainer.appendChild(createMenuItemHTML(item)));
    };
});
