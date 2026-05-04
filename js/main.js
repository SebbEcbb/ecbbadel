import { injectCopyright } from "/js/copyright.js";
import { productsData } from "/js/products.js";

// --- LOGIQUE PAGE ACCUEIL (Toutes les catégories) ---
function generateCategories() {
    const grid = document.getElementById('category-grid');
    if (!grid) return; // Sécurité : on n'est pas sur l'accueil

    const categories = Object.keys(productsData);
    const html = categories.map(cat => {
        const items = productsData[cat];
        const activeCount = items.filter(i => i.active).length;
        if (activeCount === 0) return '';

        return `
        <a href="${cat}/index.html" class="category-card relative group block aspect-[4/5] overflow-hidden rounded-sm bg-stone-200 shadow-sm">
            <img src="${cat}.webp" alt="${cat}" class="w-full h-full object-cover" 
                 onerror="this.src='https://placehold.co/600x800?text=${cat.toUpperCase()}'">
            <div class="overlay-gradient absolute inset-0 flex flex-col justify-end p-8 text-white">
                <span class="text-xs uppercase tracking-widest mb-2 opacity-80 font-medium">${activeCount} Pièces</span>
                <h2 class="font-serif text-3xl capitalize mb-4">${cat}</h2>
            </div>
        </a>`;
    }).join('');

    grid.innerHTML = html;
}

// --- LOGIQUE PAGE CATÉGORIE (Objets individuels) ---
function initCategoryPage() {
    const grid = document.getElementById('product-grid');
    if (!grid) return; // Sécurité : on n'est pas sur une page catégorie

    const status = document.getElementById('status-message');
    const titleElem = document.getElementById('page-title');

    // Détection de la catégorie via l'URL
    const pathParts = window.location.pathname.split('/').filter(Boolean);
    const currentCategory = pathParts.length >= 1 ? decodeURIComponent(pathParts[pathParts.length - 2]) : "";

    const list = productsData[currentCategory] || [];
    const activeItems = list.filter(item => item.active);

    if (titleElem) titleElem.textContent = currentCategory;

    if (activeItems.length === 0) {
        if (status) status.innerHTML = `<p class="text-stone-400">Aucun produit disponible dans cette catégorie.</p>`;
        return;
    }

    const cardsHtml = activeItems.map(item => {
        const displayPrice = item.price && item.price > 1 ? `${item.price}€` : "Prix sur demande";
        const cleanDesc = (item.description || "").replace(/<[^>]*>?/gm, '').trim();

        return `
        <div class="product-card bg-white border border-stone-200 flex flex-col">
            <a href="${item.id}/index.html" class="aspect-card overflow-hidden">
                <img src="../${currentCategory}/${item.id}/1.jpg" class="w-full h-full object-cover hover:scale-105 transition-transform" 
                     onerror="this.src='https://placehold.co/400x500?text=Image+Indisponible'">
            </a>
            <div class="p-5 flex-grow">
                <h2 class="text-lg font-bold">${item.name}</h2>
                <p class="text-stone-500 text-sm italic line-clamp-2">${cleanDesc}</p>
                <div class="mt-4 pt-4 border-t font-bold">${displayPrice}</div>
            </div>
        </div>`;
    }).join('');

    grid.innerHTML = cardsHtml;
    grid.classList.remove('opacity-0');
    if (status) status.classList.add('hidden');
}

// --- INITIALISATION UNIQUE ---
window.addEventListener('DOMContentLoaded', () => {
    // 1. Toujours injecter le copyright (présent sur toutes les pages)
    injectCopyright('footer-copyright');

    // 2. Tenter de charger l'accueil
    generateCategories();

    // 3. Tenter de charger une catégorie
    initCategoryPage();
});