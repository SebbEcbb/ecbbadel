import { injectCopyright } from "/js/copyright.js";
import { productsData } from "/js/products.js";

// Logic to generate category cards on the homepage
function generateCategories() {
    const grid = document.getElementById('category-grid');
    if (!grid) return; // Exit if not on the homepage
    
    const categories = Object.keys(productsData);

    const html = categories.map(cat => {
        const items = productsData[cat];
        const activeCount = items.filter(i => i.active).length;

        if (activeCount === 0) return '';

        const imagePath = `${cat}.webp`;

        return `
        <a href="${cat}/index.html" class="category-card relative group block aspect-[4/5] overflow-hidden rounded-sm bg-stone-200 shadow-sm">
            <img 
                src="${imagePath}" 
                alt="${cat}" 
                class="category-image w-full h-full object-cover"
                onerror="this.src='https://placehold.co/600x800/e7e5e4/44403c?text=${cat.toUpperCase()}'"
            >
            <div class="overlay-gradient absolute inset-0 flex flex-col justify-end p-8 text-white">
                <span class="text-xs uppercase tracking-[0.3em] mb-2 opacity-80 font-medium">
                    ${activeCount} Pièce${activeCount > 1 ? 's' : ''}
                </span>
                <h2 class="font-serif text-3xl capitalize mb-4 tracking-wide group-hover:translate-x-2 transition-transform duration-500">
                    ${cat}
                </h2>
                <div class="flex items-center gap-2 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <span>Explorer la collection</span>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                </div>
            </div>
        </a>`;
    }).join('');

    grid.innerHTML = html;
}


function init() {
    const grid = document.getElementById('product-grid');
    const status = document.getElementById('status-message');
    const titleElem = document.getElementById('page-title');
    const breadcrumb = document.getElementById('breadcrumb-category');
    const countElem = document.getElementById('item-count');

    // Détection de la catégorie via l'URL
    const pathParts = window.location.pathname.split('/').filter(Boolean);
    const currentCategory = pathParts.length >= 1 ? pathParts[pathParts.length - 2] : "miroirs";

    // Récupération des données depuis l'import
    const list = productsData[currentCategory] || [];
    const activeItems = list.filter(item => item.active);

    // Mise à jour de l'interface
    if (titleElem) titleElem.textContent = currentCategory;
    if (breadcrumb) breadcrumb.textContent = currentCategory;
    if (countElem) countElem.textContent = `${activeItems.length} Article${activeItems.length > 1 ? 's' : ''}`;

    if (activeItems.length === 0) {
        if (status) status.innerHTML = `<p class="text-stone-400">Aucun produit actif.</p>`;
        return;
    }

    // Génération du HTML des cartes
    const cardsHtml = activeItems.map(item => {
        const displayPrice = item.price && item.price > 1 ? `${item.price}€` : "Prix sur demande";
        const imageSrc = `../${currentCategory}/${item.id}/1.jpg`;
        const cleanDesc = (item.description || "").replace(/<[^>]*>?/gm, '').trim() || "Détails sur demande";

        return `
        <div class="product-card bg-white rounded-lg border border-stone-200 overflow-hidden flex flex-col">
            <a href="${item.id}/index.html" class="block group overflow-hidden aspect-card relative">
                <img src="${imageSrc}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" onerror="this.src='https://placehold.co/400x500?text=Image+Indisponible'">
            </a>
            <div class="p-5 flex-grow flex flex-col">
                <h2 class="text-lg font-serif font-bold text-stone-800 mb-2">${item.name}</h2>
                <p class="text-stone-500 text-sm line-clamp-2 mb-4 italic">${cleanDesc}</p>
                <div class="mt-auto pt-4 border-t border-stone-100 flex justify-between">
                    <span class="font-bold">${displayPrice}</span>
                </div>
            </div>
        </div>`;
    }).join('');

    if (grid) {
        grid.innerHTML = cardsHtml;
        grid.classList.remove('opacity-0');
    }
    if (status) status.classList.add('hidden');
}

// Initialisation unique
window.addEventListener('DOMContentLoaded', () => {
    injectCopyright('footer-copyright');
    init(); // Appelle la logique d'affichage ici
});