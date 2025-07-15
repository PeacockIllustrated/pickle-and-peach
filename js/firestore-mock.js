// This function simulates fetching a collection from Firestore.
// It returns a Promise that resolves with an array of menu items.

export function fetchMenuItems() {
    console.log("Fetching data from mock Firestore...");

    const menuData = [
        {
            name: "The P&P Sourdough",
            description: "Toasted sourdough with smashed avocado, pickled onions, and a sprinkle of chilli flakes.",
            tag: "Brunch",
            image: "https://sdmntprukwest.oaiusercontent.com/files/00000000-1fa8-6243-92fc-b59dee1216ef/raw?se=2025-07-15T20%3A23%3A09Z&sp=r&sv=2024-08-04&sr=b&scid=f942b556-80bd-58fe-9919-8d959435e4da&skoid=82a3371f-2f6c-4f81-8a78-2701b362559b&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-07-15T07%3A48%3A20Z&ske=2025-07-16T07%3A48%3A20Z&sks=b&skv=2024-08-04&sig=K2RvxF50YLry2GKYqguYLFcdjcRVOIyt7NXrhY5ARB4%3D" // Avocado
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
            image: "https://sdmntprukwest.oaiusercontent.com/files/00000000-8288-6243-8b11-66c95fe00ca4/raw?se=2025-07-15T20%3A23%3A41Z&sp=r&sv=2024-08-04&sr=b&scid=8424a027-52e7-5f54-9977-7316853f0131&skoid=82a3371f-2f6c-4f81-8a78-2701b362559b&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-07-15T09%3A58%3A04Z&ske=2025-07-16T09%3A58%3A04Z&sks=b&skv=2024-08-04&sig=T16wzk2bh3EQ4Gfzr/bxq1%2B95avXxMWiy1sQ21pdIZE%3D" // Peach
        },
        {
            name: "The Shields Special",
            description: "A hearty sandwich with local ham, pease pudding, and a sweet pickle relish on a stottie.",
            tag: "Lunch",
            image: "https://sdmntprpolandcentral.oaiusercontent.com/files/00000000-3434-620a-b87c-ab0ac2969a1a/raw?se=2025-07-15T20%3A24%3A43Z&sp=r&sv=2024-08-04&sr=b&scid=e464d592-1296-572b-8187-02cfda4a07ad&skoid=82a3371f-2f6c-4f81-8a78-2701b362559b&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-07-15T06%3A28%3A14Z&ske=2025-07-16T06%3A28%3A14Z&sks=b&skv=2024-08-04&sig=SyhcPNdWtzh091SJWNF1G8BHDsmUw5vKqAtNOFM5NIQ%3D" // Sandwich
        },
        {
            name: "Single Origin Pour-Over",
            description: "A clean, delicate brew showcasing the unique tasting notes of our guest coffee beans.",
            tag: "Coffee",
            image: "https://sdmntprpolandcentral.oaiusercontent.com/files/00000000-ce50-620a-b820-8881f4ab3ad2/raw?se=2025-07-15T20%3A24%3A16Z&sp=r&sv=2024-08-04&sr=b&scid=2d069dd3-d853-527b-bc73-3ea3225deabc&skoid=82a3371f-2f6c-4f81-8a78-2701b362559b&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-07-15T06%3A59%3A23Z&ske=2025-07-16T06%3A59%3A23Z&sks=b&skv=2024-08-04&sig=t/zogaAQ2T5hIRZ9GvmnVSTAmMVVD7Lik/YcwfPiHes%3D" // Coffee Pot
        },
        {
            name: "Vegan Sausage Roll",
            description: "Our homemade flaky pastry filled with a savoury herb and sausage-style filling.",
            tag: "Bakery",
            image: "https://sdmntpritalynorth.oaiusercontent.com/files/00000000-9d24-6246-84b2-e6440cca9261/raw?se=2025-07-15T20%3A25%3A05Z&sp=r&sv=2024-08-04&sr=b&scid=468ed556-7c4a-5eba-9d56-88f7ce9db6c3&skoid=82a3371f-2f6c-4f81-8a78-2701b362559b&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-07-15T05%3A52%3A21Z&ske=2025-07-16T05%3A52%3A21Z&sks=b&skv=2024-08-04&sig=0lDWYUEzx%2B3dGXUg6rr4ooyYULthntUqYDUlJbmlUew%3D" // Wheat/Pastry
        },
    ];

    // We wrap the data in a Promise to simulate a network request.
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(menuData);
        }, 500); // Simulate a 0.5 second network delay
    });
}
