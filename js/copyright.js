/**
 * Injects dynamic copyright text into a specified element.
 * Formats as: © 2020 - [Current Year] ECB BADEL. All rights reserved.
 * * @param {footer-copyright} elementId - The ID of the HTML element to inject into.
 */
function injectCopyright(elementId) {
    const startYear = 2020;
    const currentYear = new Date().getFullYear();
    const companyName = "ECB BADEL";
    
    // Logic to handle if we are still in the start year
    const dateRange = currentYear > startYear 
        ? `${startYear} - ${currentYear}` 
        : `${startYear}`;
    
    const copyrightText = `&copy; ${dateRange} ${companyName}. Tout droits réservés.`;
    
    const target = document.getElementById(elementId);
    if (target) {
        target.innerHTML = copyrightText;
    } else {
        console.error(`Element with ID "${elementId}" not found.`);
    }
}

// Initialize injection when the DOM is fully loaded
window.addEventListener('DOMContentLoaded', () => {
    injectCopyright('footer-copyright');
});