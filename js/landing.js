// --- landing.js (NEW FILE) ---

document.addEventListener('DOMContentLoaded', () => {

    // --- CONFIGURATION ---
    // IMPORTANT: Manually add the filenames of your images here.
    // The script will automatically build the carousel from this list.
    const imageFilenames = [
        "image1.jpg",
        "image2.jpg",
        "image3.jpg",
        "image4.png",
        "image5.jpg",
        "image6.jpg"
        // Add more image filenames as needed
    ];
    // --- END CONFIGURATION ---

    const track = document.querySelector('.glimpse-track');

    if (!track || imageFilenames.length === 0) {
        console.error('Carousel track not found or no images specified.');
        return;
    }

    // Function to populate the carousel track
    function populateCarousel() {
        // Clear any existing content
        track.innerHTML = '';

        // Create image elements from the list
        const imageElements = imageFilenames.map(filename => {
            const img = document.createElement('img');
            img.src = `assets/glimpse-carousel/${filename}`;
            img.alt = "A glimpse into the making of Pickle & Peach";
            return img;
        });

        // Append the original images
        imageElements.forEach(img => track.appendChild(img));

        // Append a duplicated set of images for the seamless desktop marquee effect
        imageElements.forEach(img => {
            const clone = img.cloneNode();
            clone.setAttribute('aria-hidden', 'true'); // Hide duplicates from screen readers
            track.appendChild(clone);
        });
    }

    // Function to set the animation duration based on the number of images
    function setAnimationDuration() {
        const imagesCount = imageFilenames.length;
        const duration = imagesCount * 5; // 5 seconds per image
        track.style.setProperty('--animation-duration', `${duration}s`);
    }

    populateCarousel();
    setAnimationDuration();
});
