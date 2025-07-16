// This function simulates fetching a customer-facing menu from Firestore.
export function fetchMenuItems() {
    console.log("Fetching menu data from MOCK Firestore...");

    const menuData = [
        {
            id: "flat_white",
            name: "Artisan Flat White",
            description: "Expertly pulled espresso with velvety steamed milk.",
            price: 3.50,
            category: "Coffee",
            image: "https://i.imgur.com/JPlgplQ.png" // Realistic coffee cup
        },
        {
            id: "sourdough_toast",
            name: "P&P Sourdough",
            description: "Toasted sourdough, smashed avocado, pickled onions.",
            price: 7.20,
            category: "Brunch",
            image: "https://i.imgur.com/SjA57i8.png" // Realistic toast
        },
        {
            id: "peach_cake",
            name: "Peach Crumble Cake",
            description: "Soft sponge with juicy peach pieces and a crumble topping.",
            price: 4.00,
            category: "Bakery",
            image: "https://i.imgur.com/nL544b6.png" // Realistic cake
        },
        {
            id: "shields_special",
            name: "The Shields Special",
            description: "Local ham, pease pudding, and sweet pickle relish on a stottie.",
            price: 6.50,
            category: "Lunch",
            image: "https://i.imgur.com/e4u5CXY.png" // Realistic sandwich
        },
    ];

    return new Promise(resolve => {
        setTimeout(() => resolve(menuData), 300);
    });
}