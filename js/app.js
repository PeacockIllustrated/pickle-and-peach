import { fetchMenuItems } from './firestore-mock.js';
// Uncomment the line below to switch to live Firebase data
// import { db } from './firebase-config.js';
// import { collection, getDocs } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', () => {

    // --- AUTHENTICATION CHECK ---
    if (localStorage.getItem('isLoggedIn') !== 'true') {
        window.location.href = 'login.html';
        return; // Stop further execution
    }

    // --- VIEW NAVIGATION ---
    const navButtons = document.querySelectorAll('.nav-button');
    const appViews = document.querySelectorAll('.app-view');

    const switchView = (targetId) => {
        appViews.forEach(view => view.classList.remove('is-active'));
        navButtons.forEach(button => button.classList.remove('is-active'));
        
        const targetView = document.getElementById(targetId);
        const targetButton = document.querySelector(`[data-target="${targetId}"]`);
        
        if (targetView) targetView.classList.add('is-active');
        if (targetButton) targetButton.classList.add('is-active');
    };

    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetId = button.dataset.target;
            switchView(targetId);
        });
    });
    
    // Allow other buttons to switch views, like from the empty cart
    document.addEventListener('click', (e) => {
        if (e.target.matches('[data-target]')) {
             const targetId = e.target.dataset.target;
             switchView(targetId);
        }
    });

    // --- LOYALTY CARD LOGIC ---
    const loyaltyStampsContainer = document.getElementById('loyalty-stamps');
    const loyaltyCountSpan = document.getElementById('loyalty-count');
    const loyaltyProgressBar = document.getElementById('loyalty-progress-bar');
    const addStampBtn = document.getElementById('add-stamp-btn');
    const resetStampsBtn = document.getElementById('reset-stamps-btn');
    const totalStamps = 8;
    let currentStamps = 0;

    const saveStamps = () => localStorage.setItem('loyaltyStamps', currentStamps);
    const loadStamps = () => parseInt(localStorage.getItem('loyaltyStamps') || 0);

    const renderLoyaltyCard = () => {
        loyaltyStampsContainer.innerHTML = '';
        for (let i = 1; i <= totalStamps; i++) {
            const stamp = document.createElement('div');
            stamp.className = 'stamp';
            if (i <= currentStamps) {
                stamp.classList.add('filled');
                stamp.innerHTML = `<img src="assets/home.svg" alt="Stamp">`; // Using a placeholder icon
            }
            loyaltyStampsContainer.appendChild(stamp);
        }
        loyaltyCountSpan.textContent = currentStamps;
        loyaltyProgressBar.value = currentStamps;
    };
    
    addStampBtn.addEventListener('click', () => {
        if (currentStamps < totalStamps) {
            currentStamps++;
            saveStamps();
            renderLoyaltyCard();
        }
    });
    
    resetStampsBtn.addEventListener('click', () => {
        currentStamps = 0;
        saveStamps();
        renderLoyaltyCard();
    });


    // --- MENU & HOME SCREEN LOGIC ---
    const popularItemsList = document.getElementById('popular-items-list');
    const fullMenuList = document.getElementById('full-menu-list');

    const createMenuItemHTML = (item) => `
        <div class="item-card" data-id="${item.id}">
            <img src="${item.image}" alt="${item.name}">
            <div class="item-info">
                <h4>${item.name}</h4>
                <p>${item.description}</p>
                <div class="price">£${item.price.toFixed(2)}</div>
            </div>
        </div>
    `;

    const populateContent = async () => {
        try {
            // Using the mock fetch for now.
            const menuItems = await fetchMenuItems();
            // To switch to live data, comment out the line above and uncomment the 3 lines below
            // const querySnapshot = await getDocs(collection(db, "menu_items"));
            // const menuItems = [];
            // querySnapshot.forEach((doc) => menuItems.push({ id: doc.id, ...doc.data() }));

            popularItemsList.innerHTML = menuItems.map(createMenuItemHTML).join('');
            fullMenuList.innerHTML = menuItems.map(createMenuItemHTML).join('');
        } catch (error) {
            console.error("Error fetching menu items:", error);
            popularItemsList.innerHTML = "<p>Could not load items.</p>";
            fullMenuList.innerHTML = "<p>Could not load menu.</p>";
        }
    };


    // --- INITIALIZE APP ---
    const init = () => {
        currentStamps = loadStamps();
        renderLoyaltyCard();
        populateContent();
    };

    init();
});