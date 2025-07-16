// Firebase SDK imports
import { db } from 'js/firebase-config.js'; // CORRECTED PATH
import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";
// Mock data import
import { fetchMenuItems } from 'js/firestore-mock.js';

document.addEventListener('DOMContentLoaded', () => {

    // --- AUTHENTICATION CHECK ---
    if (localStorage.getItem('isLoggedIn') !== 'true') {
        window.location.href = 'login.html';
        return;
    }

    // --- ELEMENT SELECTORS ---
    const navButtons = document.querySelectorAll('.nav-button');
    const appViews = document.querySelectorAll('.app-view');
    
    // Loyalty Card Elements
    const profileView = document.getElementById('profile-view');
    const loyaltyStampsContainer = document.getElementById('loyalty-stamps');
    const loyaltyCountSpan = document.getElementById('loyalty-count');
    const loyaltyProgressBar = document.getElementById('loyalty-progress-bar');
    const addStampBtn = document.getElementById('add-stamp-btn');
    const resetStampsBtn = document.getElementById('reset-stamps-btn');
    const redeemBtn = document.getElementById('redeem-btn');

    // Menu Elements
    const popularItemsList = document.getElementById('popular-items-list');
    const fullMenuList = document.getElementById('full-menu-list');

    // Redemption Modal Elements
    const redemptionModal = document.getElementById('redemption-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const redemptionForm = document.getElementById('redemption-form');
    const customerNameInput = document.getElementById('customer-name-input');
    
    // --- APP STATE ---
    const totalStamps = 8;
    let currentStamps = 0;

    // --- VIEW NAVIGATION ---
    const switchView = (targetId) => {
        appViews.forEach(view => view.classList.remove('is-active'));
        navButtons.forEach(button => button.classList.remove('is-active'));
        
        const targetView = document.getElementById(targetId);
        const targetButton = document.querySelector(`[data-target="${targetId}"]`);
        
        if (targetView) targetView.classList.add('is-active');
        if (targetButton) targetButton.classList.add('is-active');
    };

    navButtons.forEach(button => {
        button.addEventListener('click', () => switchView(button.dataset.target));
    });
    
    document.addEventListener('click', (e) => {
        if (e.target.matches('[data-target]')) {
             switchView(e.target.dataset.target);
        }
    });

    // --- LOYALTY CARD LOGIC (STATE MANAGER) ---
    const saveStamps = () => localStorage.setItem('loyaltyStamps', currentStamps);
    const loadStamps = () => parseInt(localStorage.getItem('loyaltyStamps') || 0);

    const renderLoyaltyCard = () => {
        // Update UI for collecting state
        loyaltyStampsContainer.innerHTML = '';
        for (let i = 1; i <= totalStamps; i++) {
            const stamp = document.createElement('div');
            stamp.className = 'stamp';
            if (i <= currentStamps) {
                stamp.classList.add('filled');
                stamp.innerHTML = `<svg class="stamp-icon"><use xlink:href="#icon-stamp"></use></svg>`;
            }
            loyaltyStampsContainer.appendChild(stamp);
        }
        loyaltyCountSpan.textContent = currentStamps;
        loyaltyProgressBar.value = currentStamps;
        
        // Toggle between "collecting" and "redeemable" states
        if (currentStamps >= totalStamps) {
            profileView.classList.add('is-redeemable');
        } else {
            profileView.classList.remove('is-redeemable');
        }
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

    // --- REDEMPTION MODAL LOGIC ---
    const openRedemptionModal = () => redemptionModal.classList.add('is-active');
    const closeRedemptionModal = () => redemptionModal.classList.remove('is-active');
    
    redeemBtn.addEventListener('click', openRedemptionModal);
    closeModalBtn.addEventListener('click', closeRedemptionModal);
    redemptionModal.addEventListener('click', (e) => {
        if (e.target === redemptionModal) closeRedemptionModal();
    });

    // --- FIREBASE ORDER SUBMISSION ---
    redemptionForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const selectedCoffee = redemptionForm.querySelector('input[name="coffee"]:checked').value;
        const customerName = customerNameInput.value.trim();

        if (!customerName || !selectedCoffee) {
            alert("Please fill out all fields.");
            return;
        }

        const orderData = {
            customerName: customerName,
            item: selectedCoffee,
            isRedemption: true,
            status: "pending",
            createdAt: serverTimestamp()
        };

        try {
            console.log("Placing order:", orderData);
            // Add a new document with a generated ID to the 'orders' collection.
            const docRef = await addDoc(collection(db, "orders"), orderData);
            console.log("Order placed with ID: ", docRef.id);
            
            // Reset loyalty card after successful order
            currentStamps = 0;
            saveStamps();
            renderLoyaltyCard();
            closeRedemptionModal();
            customerNameInput.value = ''; // Clear form for next time
            
            // Optional: Show a success message
            // alert("Your order has been placed! We'll see you at the window.");

        } catch (error) {
            console.error("Error adding document: ", error);
            alert("Sorry, there was an issue placing your order. Please try again.");
        }
    });


    // --- MENU & HOME SCREEN LOGIC ---
    const createMenuItemHTML = (item) => `
        <div class="menu-item-list-entry" data-id="${item.id}">
            <img src="${item.image}" alt="${item.name}">
            <div class="menu-item-info">
                <h4>${item.name}</h4>
                <p>${item.description}</p>
                <div class="price">£${item.price.toFixed(2)}</div>
            </div>
        </div>
    `;

    const populateContent = async () => {
        try {
            const menuItems = await fetchMenuItems();
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
