// Import the simulated Firestore function
import { fetchMenuItems } from './firestore-mock.js';

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. COUNTDOWN TIMER ---
    function initCountdown() {
        const targetDate = new Date('August 24, 2024 09:00:00').getTime();
        const countdownElement = document.getElementById('countdown');
        if (!countdownElement) return;

        const daysEl = document.getElementById('days');
        const hoursEl = document.getElementById('hours');
        const minutesEl = document.getElementById('minutes');
        const secondsEl = document.getElementById('seconds');

        const timerInterval = setInterval(() => {
            const now = new Date().getTime();
            const distance = targetDate - now;

            if (distance < 0) {
                clearInterval(timerInterval);
                countdownElement.innerHTML = `<h2 class="section-title">We Are Open!</h2>`;
                countdownElement.style.textAlign = 'center';
                return;
            }

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);
            
            daysEl.textContent = days.toString().padStart(2, '0');
            hoursEl.textContent = hours.toString().padStart(2, '0');
            minutesEl.textContent = minutes.toString().padStart(2, '0');
            secondsEl.textContent = seconds.toString().padStart(2, '0');

        }, 1000);
    }

    // --- 2. STORY SLIDER (REWORKED) ---
    function initStorySlider() {
        const container = document.querySelector('.story-slider-container');
        if (!container) return;

        const slides = Array.from(container.querySelectorAll('.story-slide'));
        const nextButton = container.querySelector('.arrow-right');
        const prevButton = container.querySelector('.arrow-left');
        let currentIndex = 0;

        const showSlide = (index) => {
            // Remove 'is-active' from all slides
            slides.forEach(slide => slide.classList.remove('is-active'));
            
            // Add 'is-active' to the target slide
            slides[index].classList.add('is-active');
            
            // Update the state of the navigation arrows
            prevButton.disabled = index === 0;
            nextButton.disabled = index === slides.length - 1;
        };

        nextButton.addEventListener('click', () => {
            if (currentIndex < slides.length - 1) {
                currentIndex++;
                showSlide(currentIndex);
            }
        });

        prevButton.addEventListener('click', () => {
            if (currentIndex > 0) {
                currentIndex--;
                showSlide(currentIndex);
            }
        });

        // Show the first slide initially
        showSlide(currentIndex);
    }

    // --- 3. POPULATE MENU FROM (MOCK) FIRESTORE ---
    async function populateMenu() {
        const menuGrid = document.getElementById('menu-grid');
        if (!menuGrid) return;
        
        try {
            const menuItems = await fetchMenuItems();
            let menuHTML = '';

            menuItems.forEach(item => {
                menuHTML += `
                    <div class="menu-item-card">
                        <h3>${item.name}</h3>
                        <p>${item.description}</p>
                        <span class="tag">${item.tag}</span>
                    </div>
                `;
            });

            menuGrid.innerHTML = menuHTML;
        } catch (error) {
            console.error("Could not load menu:", error);
            menuGrid.innerHTML = `<p>Our menu is being perfected... Check back soon!</p>`;
        }
    }

    // --- INITIALIZE ALL FUNCTIONS ---
    initCountdown();
    initStorySlider();
    populateMenu();
});
