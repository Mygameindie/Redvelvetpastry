// Array of JSON file paths
const jsonFiles = [
    'bottomunderwear1.json', 'bottomunderwear2.json',
    'topunderwear1.json', 'topunderwear2.json',
    'boxers1.json', 'boxers2.json',
    'shoes1.json', 'shoes2.json',
    'top1.json', 'top2.json',
    'dress1.json', 'dress2.json',
    'pants1.json', 'pants2.json',  
    'skirt1.json', 'skirt2.json', 
    'jacket1.json', 'jacket2.json',
    'accessories1.json', 'accessories2.json',
    'sweatshirt1.json', 'sweatshirt2.json',
    'hat1.json', 'hat2.json', 
];

// Load each JSON file
async function loadItemFile(file) {
    try {
        const response = await fetch(file);
        if (!response.ok) throw new Error(`Error loading file: ${file}`);
        return await response.json();
    } catch (error) {
        console.error(`Failed to load ${file}:`, error);
        return [];
    }
}

// Load items in batches to reduce load time and improve responsiveness
async function loadItemsInBatches(batchSize = 5) {
    const baseContainer = document.querySelector('.base-container');
    const controlsContainer = document.querySelector('.controls');
    
    for (let i = 0; i < jsonFiles.length; i += batchSize) {
        const batch = jsonFiles.slice(i, i + batchSize);

        await Promise.all(batch.map(async file => {
            const data = await loadItemFile(file);
            const categoryName = file.replace('.json', '');
            const categoryContainer = document.createElement('div');
            categoryContainer.classList.add('category');

            const categoryHeading = document.createElement('h3');
            categoryHeading.textContent = categoryName;
            categoryContainer.appendChild(categoryHeading);

            data.forEach(item => {
                const itemId = item.id.endsWith('.png') ? item.id : `${item.id}.png`;

                const img = document.createElement('img');
                img.id = itemId;
                img.src = item.src;
                img.alt = item.alt;
                img.classList.add(categoryName);
                img.setAttribute('data-file', file);
                img.style.visibility = item.visibility === "visible" ? "visible" : "hidden";
                baseContainer.appendChild(img);

                const button = document.createElement('img');
                const buttonFile = item.src.replace('.png', 'b.png');
                button.src = buttonFile;
                button.alt = item.alt + ' Button';
                button.classList.add('item-button');
                button.onclick = () => toggleVisibility(itemId, categoryName);
                categoryContainer.appendChild(button);
            });

            controlsContainer.appendChild(categoryContainer);
        }));

        await new Promise(resolve => setTimeout(resolve, 50));
    }
}

// Toggle visibility of item images, ensuring mutually exclusive display with dress items
function toggleVisibility(itemId, categoryName) {
    const categoryItems = document.querySelectorAll(`.${categoryName}`);
    categoryItems.forEach(item => {
        if (item.id !== itemId) {
            item.style.visibility = 'hidden';
        }
    });

    const selectedItem = document.getElementById(itemId);
    selectedItem.style.visibility = selectedItem.style.visibility === 'visible' ? 'hidden' : 'visible';

    if (selectedItem.style.visibility === 'visible' && (categoryName.startsWith('top') || categoryName.startsWith('pants') || categoryName.startsWith('skirt') || categoryName.startsWith('sweatshirt'))) {
        hideCategoryItems('dress');
    } else if (selectedItem.style.visibility === 'visible' && categoryName.startsWith('dress')) {
        hideCategoryItems('top');
        hideCategoryItems('pants');
        hideCategoryItems('skirt');
        hideCategoryItems('sweatshirt');
    }
}

// Helper function to hide all items in a given category
function hideCategoryItems(categoryPrefix) {
    const items = document.querySelectorAll(`[class^="${categoryPrefix}"]`);
    items.forEach(item => {
        item.style.visibility = 'hidden';
    });
}

// Function to enter game mode
function enterGame() {
    document.querySelector('.main-menu').style.display = 'none';
    document.querySelector('.game-container').style.display = 'block';
}

// Adjust canvas layout dynamically for responsive design on smaller screens
function adjustCanvasLayout() {
    const baseContainer = document.querySelector('.base-container');
    const controlsContainer = document.querySelector('.controls');

    const screenWidth = window.innerWidth;

    // Adjust for smaller screens to show three characters side-by-side
    if (screenWidth <= 600) {
        baseContainer.style.display = 'flex';
        baseContainer.style.flexWrap = 'nowrap'; // Ensure side-by-side layout
        baseContainer.style.justifyContent = 'space-between'; // Distribute evenly
    } else {
        baseContainer.style.display = 'block';
        baseContainer.style.width = '500px';
        baseContainer.style.height = '400px';
        controlsContainer.style.marginTop = 'auto';
    }
}

// Apply layout adjustment on load and resize
window.onload = () => {
    loadItemsInBatches();
    adjustCanvasLayout();
};

window.addEventListener('resize', adjustCanvasLayout);