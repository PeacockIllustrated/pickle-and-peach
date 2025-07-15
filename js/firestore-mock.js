// This function simulates fetching a collection from Firestore.
// It returns a Promise that resolves with an array of menu items.

export function fetchMenuItems() {
    console.log("Fetching data from mock Firestore...");

    const menuData = [
        {
            name: "The P&P Sourdough",
            description: "Toasted sourdough with smashed avocado, pickled onions, and a sprinkle of chilli flakes.",
            tag: "Brunch",
            image: "https://cdn.icon-icons.com/icons2/2070/PNG/512/avocado_icon_126322.png" // Avocado
        },
        {
            name: "Artisan Flat White",
            description: "Expertly pulled espresso shot with perfectly steamed, velvety milk. Our signature coffee.",
            tag: "Coffee",
            image: "https://github.com/PeacockIllustrated/pickle-and-peach/blob/main/assets/Flat%20White%20Artisan.png?raw=true" // Coffee cup
        },
        {
            name: "Peach Crumble Cake",
            description: "A slice of heaven. Soft sponge with juicy peach pieces and a crunchy crumble topping.",
            tag: "Bakery",
            image: "https://cdn.icon-icons.com/icons2/2070/PNG/512/peach_icon_126325.png" // Peach
        },
        {
            name: "The Shields Special",
            description: "A hearty sandwich with local ham, pease pudding, and a sweet pickle relish on a stottie.",
            tag: "Lunch",
            image: "https://cdn.icon-icons.com/icons2/1301/PNG/512/if-food-c230-2427869_85675.png" // Sandwich
        },
        {
            name: "Single Origin Pour-Over",
            description: "A clean, delicate brew showcasing the unique tasting notes of our guest coffee beans.",
            tag: "Coffee",
            image: "https://cdn.icon-icons.com/icons2/2382/PNG/512/coffee_pot_icon_144180.png" // Coffee Pot
        },
        {
            name: "Vegan Sausage Roll",
            description: "Our homemade flaky pastry filled with a savoury herb and sausage-style filling.",
            tag: "Bakery",
            image: "https://cdn.icon-icons.com/icons2/2157/PNG/512/wheat_icon_132203.png" // Wheat/Pastry
        },
    ];

    // We wrap the data in a Promise to simulate a network request.
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(menuData);
        }, 500); // Simulate a 0.5 second network delay
    });
}
