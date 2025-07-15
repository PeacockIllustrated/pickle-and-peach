// This function simulates fetching a collection from Firestore.
// It returns a Promise that resolves with an array of menu items.

export function fetchMenuItems() {
    console.log("Fetching data from mock Firestore...");

    const menuData = [
        {
            name: "The P&P Sourdough",
            description: "Toasted sourdough with smashed avocado, pickled onions, and a sprinkle of chilli flakes.",
            tag: "Brunch"
        },
        {
            name: "Artisan Flat White",
            description: "Expertly pulled espresso shot with perfectly steamed, velvety milk. Our signature coffee.",
            tag: "Coffee"
        },
        {
            name: "Peach Crumble Cake",
            description: "A slice of heaven. Soft sponge with juicy peach pieces and a crunchy crumble topping.",
            tag: "Bakery"
        },
        {
            name: "The Shields Special",
            description: "A hearty sandwich with local ham, pease pudding, and a sweet pickle relish on a stottie.",
            tag: "Lunch"
        },
        {
            name: "Single Origin Pour-Over",
            description: "A clean, delicate brew showcasing the unique tasting notes of our guest coffee beans.",
            tag: "Coffee"
        },
        {
            name: "Vegan Sausage Roll",
            description: "Our homemade flaky pastry filled with a savoury herb and sausage-style filling.",
            tag: "Bakery"
        },
    ];

    // We wrap the data in a Promise to simulate a network request.
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(menuData);
        }, 500); // Simulate a 0.5 second network delay
    });
}