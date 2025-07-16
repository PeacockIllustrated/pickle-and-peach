// Firebase SDK imports
import { db } from './firestore-config.js';
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";
import { doc, getDoc, setDoc, updateDoc, increment, collection, addDoc, serverTimestamp, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";
// NO LONGER NEEDED: import { fetchMenuItems } from './firestore-mock.js';

document.addEventListener('DOMContentLoaded', () => {

    // --- ELEMENT SELECTORS ---
    const navButtons = document.querySelectorAll('.nav-button');
    const appViews = document.querySelectorAll('.app-view');
    const bottomNav = document.querySelector('.bottom-nav');
    
    const profileView = document.getElementById('profile-view');
    const loyaltyStampsContainer = document.getElementById('loyalty-stamps');
    const loyaltyCountSpan = document.getElementById('loyalty-count');
    const cardsCompletedSpan = document.getElementById('cards-completed-count');
    const loyaltyProgressBar = document.getElementById('loyalty-progress-bar');
    const addStampBtn = document.getElementById('add-stamp-btn');
    const redeemBtn = document.getElementById('redeem-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const navOrderBtn = document.getElementById('nav-order-btn');
    
    const popularItemsList = document.getElementById('popular-items-list');
    const fullMenuList = document.getElementById('full-menu-list');
    const orderMenuList = document.getElementById('order-menu-list');

    const modalContainer = document.getElementById('modal-container');
    const modalForm = document.getElementById('modal-form');
    
    // --- APP STATE ---
    const auth = getAuth();
    let currentUser = null; 
    let userProfile = null;
    let menuCache = []; // Cache for menu items

    // --- AUTHENTICATION GATEKEEPER ---
    onAuthStateChanged(auth, (user) => {
        if (user) {
            currentUser = user;
            console.log("User is logged in:", currentUser.uid);
            fetchOrCreateUserProfile(currentUser);
        } else {
            console.log("No user logged in, redirecting to login.");
            window.location.href = 'login.html';
        }
    });

    const fetchOrCreateUserProfile = async (user) => {
        const userRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(userRef);

        if (docSnap.exists()) {
            userProfile = docSnap.data();
        } else {
            const newProfile = {
                email: user.email,
                name: user.displayName || 'New User',
                joinedAt: serverTimestamp(),
                loyalty: { currentStamps: 0, cardsCompleted: 0 }
            };
            await setDoc(userRef, newProfile);
            userProfile = newProfile;
        }
        initializeAppUI();
    };
    
    // --- UI INITIALIZATION (RUNS AFTER PROFILE IS LOADED) ---
    const initializeAppUI = async () => {
        document.getElementById('user-greeting').textContent = `Welcome, ${userProfile.name || 'friend'}.`;
        renderLoyaltyCard();
        updateUIVisibility();
        await fetchAndPopulateMenus(); // Fetch real menu data
    };
    
    // --- UI VISIBILITY (SHOW/HIDE ORDER TAB) ---
    const updateUIVisibility = () => {
        if (userProfile.loyalty.cardsCompleted >= 2) {
            navOrderBtn.style.display = 'flex';
            bottomNav.style.gridTemplateColumns = 'repeat(4, 1fr)';
        } else {
            navOrderBtn.style.display = 'none';
            bottomNav.style.gridTemplateColumns = 'repeat(3, 1fr)';
        }
    };
    
    // --- VIEW NAVIGATION ---
    const switchView = (targetId) => {
        appViews.forEach(view => view.classList.remove('is-active'));
        navButtons.forEach(button => button.classList.remove('is-active'));
        const targetView = document.getElementById(targetId);
        const targetButton = document.querySelector(`[data-target="${targetId}"]`);
        if (targetView) targetView.classList.add('is-active');
        if (targetButton) targetButton.classList.add('is-active');
    };
    navButtons.forEach(button => button.addEventListener('click', () => switchView(button.dataset.target)));

    // --- LOYALTY CARD LOGIC ---
    const renderLoyaltyCard = () => {
        const { currentStamps, cardsCompleted } = userProfile.loyalty;
        loyaltyStampsContainer.innerHTML = '';
        for (let i = 1; i <= 8; i++) {
            const stamp = document.createElement('div');
            stamp.className = 'stamp';
            if (i <= currentStamps) {
                stamp.classList.add('filled');
                stamp.innerHTML = `<svg class="stamp-icon"><use xlink:href="#icon-stamp"></use></svg>`;
            }
            loyaltyStampsContainer.appendChild(stamp);
        }
        loyaltyCountSpan.textContent = currentStamps;
        cardsCompletedSpan.textContent = cardsCompleted;
        loyaltyProgressBar.value = currentStamps;
        
        profileView.classList.toggle('is-redeemable', currentStamps >= 8);
    };

    addStampBtn.addEventListener('click', async () => {
        if (userProfile.loyalty.currentStamps < 8) {
            const userRef = doc(db, "users", currentUser.uid);
            await updateDoc(userRef, { "loyalty.currentStamps": increment(1) });
            userProfile.loyalty.currentStamps++;
            renderLoyaltyCard();
        }
    });

    logoutBtn.addEventListener('click', () => {
        signOut(auth).catch(error => console.error("Logout Error:", error));
    });

    // --- MODAL & ORDERING LOGIC ---
    const openModal = (config) => {
        document.getElementById('modal-title').textContent = config.title;
        document.getElementById('modal-subtitle').textContent = config.subtitle;
        document.getElementById('modal-submit-btn').textContent = config.submitText;
        modalForm.innerHTML = config.formHTML + modalForm.lastElementChild.outerHTML;
        modalContainer.classList.add('is-active');
        modalForm.onsubmit = config.onSubmit;
    };
    
    const closeModal = () => modalContainer.classList.remove('is-active');
    document.getElementById('close-modal-btn').addEventListener('click', closeModal);
    modalContainer.addEventListener('click', (e) => {
        if (e.target === modalContainer) closeModal();
    });

    // Redemption Modal
    redeemBtn.addEventListener('click', () => {
        openModal({
            title: "Claim Your Reward", subtitle: "Choose your coffee and we'll have it ready.", submitText: "Place Order",
            formHTML: `<div class="form-group">
                    <label>Your Name for the Order</label>
                    <input type="text" id="customer-name-input" value="${userProfile.name || ''}" required>
                </div>
                <div class="form-group">
                     <label>Select Your Coffee</label>
                     <div class="radio-group">
                         <label><input type="radio" name="coffee" value="Latte" checked><span>Latte</span></label>
                         <label><input type="radio" name="coffee" value="Cappuccino"><span>Cappuccino</span></label>
                         <label><input type="radio" name="coffee" value="Americano"><span>Americano</span></label>
                         <label><input type="radio" name="coffee" value="Flat White"><span>Flat White</span></label>
                     </div>
                </div>`,
            onSubmit: handleRedemptionSubmit
        });
    });

    // Pickup Order Modal
    const handlePickupOrderClick = (item) => {
        openModal({
            title: `Order: ${item.name}`, subtitle: `Schedule your pickup for today. Price: £${item.price.toFixed(2)}`, submitText: "Place Pickup Order",
            formHTML: `<div class="form-group">
                    <label>Your Name for the Order</label>
                    <input type="text" id="customer-name-input" value="${userProfile.name || ''}" required>
                </div>
                <div class="form-group">
                     <label>Requested Pickup Time</label>
                     <select id="pickup-time" class="pickup-time-select"></select>
                </div>`,
            onSubmit: (e) => handlePickupSubmit(e, item)
        });
        generateTimeSlots();
    };

    // --- FORM SUBMISSION HANDLERS ---
    const handleRedemptionSubmit = async (e) => {
        e.preventDefault();
        const orderData = {
            customerName: e.target.querySelector('#customer-name-input').value, item: e.target.querySelector('input[name="coffee"]:checked').value,
            isRedemption: true, status: "pending", createdAt: serverTimestamp(), userId: currentUser.uid
        };
        await addDoc(collection(db, "orders"), orderData);
        const userRef = doc(db, "users", currentUser.uid);
        await updateDoc(userRef, { "loyalty.currentStamps": 0, "loyalty.cardsCompleted": increment(1) });
        userProfile.loyalty.currentStamps = 0;
        userProfile.loyalty.cardsCompleted++;
        renderLoyaltyCard();
        updateUIVisibility();
        closeModal();
    };
    
    const handlePickupSubmit = async (e, item) => {
        e.preventDefault();
        const orderData = {
            customerName: e.target.querySelector('#customer-name-input').value, item: item.name, price: item.price,
            pickupTime: e.target.querySelector('#pickup-time').value, isRedemption: false, status: "pending",
            createdAt: serverTimestamp(), userId: currentUser.uid
        };
        await addDoc(collection(db, "orders"), orderData);
        alert("Order placed! See you at your selected time.");
        closeModal();
    };
    
    // --- MENU & CONTENT POPULATION (NOW FROM FIRESTORE) ---
    const createMenuItemHTML = (item, isOrderable = false) => {
        const entry = document.createElement('div');
        entry.className = 'menu-item-list-entry';
        entry.innerHTML = `<img src="${item.image}" alt="${item.name}">
            <div class="menu-item-info">
                <h4>${item.name}</h4>
                <p>${item.description}</p>
                <div class="price">£${item.price.toFixed(2)}</div>
            </div>`;
        if (isOrderable) {
            entry.classList.add('is-orderable');
            entry.onclick = () => handlePickupOrderClick(item);
        }
        return entry;
    };

    const fetchAndPopulateMenus = async () => {
        if (menuCache.length > 0) {
            populateFromCache();
            return;
        }
        try {
            console.log("Fetching menu from Firestore...");
            const menuCollection = collection(db, "menu_items");
            const q = query(menuCollection, orderBy("category")); // Optional: order by category
            const querySnapshot = await getDocs(q);
            
            menuCache = [];
            querySnapshot.forEach((doc) => {
                menuCache.push({ id: doc.id, ...doc.data() });
            });
            console.log("Menu fetched and cached.", menuCache.length, "items.");
            populateFromCache();
        } catch (error) {
            console.error("Error fetching menu items:", error);
            fullMenuList.innerHTML = "<p>Could not load the menu at this time.</p>";
        }
    };
    
    const populateFromCache = () => {
        popularItemsList.innerHTML = '';
        fullMenuList.innerHTML = '';
        orderMenuList.innerHTML = '';
        
        // Example: make first 4 items popular
        const popular = menuCache.slice(0, 4);
        popular.forEach(item => popularItemsList.appendChild(createMenuItemHTML(item)));

        // Create categorized full menu
        let currentCategory = "";
        menuCache.forEach(item => {
            if (item.category !== currentCategory) {
                currentCategory = item.category;
                const heading = document.createElement('h2');
                heading.className = 'section-heading';
                heading.textContent = currentCategory;
                fullMenuList.appendChild(heading);
                orderMenuList.appendChild(heading.cloneNode(true));
            }
            fullMenuList.appendChild(createMenuItemHTML(item));
            orderMenuList.appendChild(createMenuItemHTML(item, true)); // Make these orderable
        });
    };
    
    const generateTimeSlots = () => {
        const select = document.getElementById('pickup-time');
        select.innerHTML = '';
        const now = new Date();
        let startHour = Math.max(9, now.getHours() + 1);
        const endHour = 17;

        for (let h = startHour; h < endHour; h++) {
            for (let m = 0; m < 60; m += 15) {
                const time = new Date(now.getFullYear(), now.getMonth(), now.getDate(), h, m);
                if (time > now) {
                    const option = document.createElement('option');
                    option.value = time.toISOString();
                    option.textContent = time.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
                    select.appendChild(option);
                }
            }
        }
    };
});
