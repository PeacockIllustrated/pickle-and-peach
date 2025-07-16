// Import the simulated Firestore function
import { fetchMenuItems } from './firestore-mock.js';

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. COUNTDOWN TIMER ---
    function initCountdown() {
        const targetDate = new Date('August 24, 2025 09:00:00').getTime();
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

    // --- 2. STORY SLIDER ---
    function initStorySlider() {
        const container = document.querySelector('.story-slider-container');
        if (!container) return;

        const slides = Array.from(container.querySelectorAll('.story-slide'));
        const nextButton = container.querySelector('.arrow-right');
        const prevButton = container.querySelector('.arrow-left');
        let currentIndex = 0;

        const showSlide = (index) => {
            slides.forEach(slide => slide.classList.remove('is-active'));
            slides[index].classList.add('is-active');
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
                        <div class="card-image">
                           <img src="${item.image}" alt="" loading="lazy">
                        </div>
                        <div class="card-content">
                            <h3>${item.name}</h3>
                            <p>${item.description}</p>
                            <span class="tag">${item.category}</span> 
                        </div>
                    </div>
                `;
            });

            menuGrid.innerHTML = menuHTML;
        } catch (error) {
            console.error("Could not load menu:", error);
            menuGrid.innerHTML = `<p>Our menu is being perfected... Check back soon!</p>`;
        }
    }

    // --- 4. TOUCH INTERACTION FOR MENU CARDS ---
    function initMenuCardTouch() {
        // This function adds a click-to-hover behavior on touch devices.
        const isTouchDevice = () => 'ontouchstart' in window || navigator.maxTouchPoints > 0;

        if (isTouchDevice()) {
            const menuCards = document.querySelectorAll('.menu-item-card');
            
            menuCards.forEach(card => {
                card.addEventListener('click', function(e) {
                    // Prevent interfering with other clicks if needed
                    e.stopPropagation();

                    // Remove the hover state from all other cards
                    menuCards.forEach(c => {
                        if (c !== this) {
                            c.classList.remove('is-hovered');
                        }
                    });
                    
                    // Toggle the hover state on the clicked card
                    this.classList.toggle('is-hovered');
                });
            });

            // Add a listener to the document to close the "hover" state when clicking away
            document.addEventListener('click', function() {
                 menuCards.forEach(c => c.classList.remove('is-hovered'));
            });
        }
    }

    // --- 5. GLIMPSE INSIDE EFFECT (REWORKED) ---
    function initGlimpseEffect() {
        const glimpseContainers = document.querySelectorAll('.glimpse-container');
        const overlay = document.querySelector('.glimpse-overlay');
        
        if (!glimpseContainers.length || !overlay) return;
        
        const toggleScrollLock = (isLocked) => {
            document.body.style.overflow = isLocked ? 'hidden' : '';
            document.documentElement.style.scrollSnapType = isLocked ? 'none' : '';
        };

        const zoomIn = (container) => {
            toggleScrollLock(true);
            overlay.classList.add('is-active');

            const rect = container.getBoundingClientRect();
            
            // 1. Pin the element in place with fixed positioning
            container.style.position = 'fixed';
            container.style.top = `${rect.top}px`;
            container.style.left = `${rect.left}px`;
            container.style.width = `${rect.width}px`;
            container.style.height = `${rect.height}px`;

            // 2. Calculate the transform to scale it to full screen
            const scaleX = window.innerWidth / rect.width;
            const scaleY = window.innerHeight / rect.height;
            const translateX = (window.innerWidth / 2) - (rect.left + rect.width / 2);
            const translateY = (window.innerHeight / 2) - (rect.top + rect.height / 2);

            // 3. Add classes and apply the transform to trigger the animation
            requestAnimationFrame(() => {
                container.classList.add('is-zoomed', 'is-animating');
                container.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scaleX}, ${scaleY})`;
            });
        };

        const zoomOut = (container) => {
            toggleScrollLock(false);
            overlay.classList.remove('is-active');
            
            // Remove the transform to animate back to the pinned position
            container.style.transform = '';

            // Listen for the animation to end, then clean up all styles
            container.addEventListener('transitionend', () => {
                container.classList.remove('is-zoomed', 'is-animating');
                container.removeAttribute('style');
            }, { once: true });
        };
        
        glimpseContainers.forEach(container => {
            container.addEventListener('click', () => {
                if (!container.classList.contains('is-zoomed')) {
                    zoomIn(container);
                }
            });
        });

        overlay.addEventListener('click', () => {
            const zoomedContainer = document.querySelector('.glimpse-container.is-zoomed');
            if (zoomedContainer) {
                zoomOut(zoomedContainer);
            }
        });
    }


    // --- INITIALIZE ALL FUNCTIONS ---
    initCountdown();
    initStorySlider();
    // Populate menu and *then* add interaction listeners
    populateMenu().then(() => {
        initMenuCardTouch();
    });
    initGlimpseEffect(); // Initialize the new glimpse effect
});
