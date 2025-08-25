/**
 * CSS Optimizer - Optimize CSS and Replace Font Awesome Icons
 */

(function() {
    'use strict';

    const CSS_OPTIMIZATIONS = `
        :root {
            --font-primary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            --font-secondary: 'Poppins', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        body { font-family: var(--font-primary) !important; }
        h1, h2, h3, h4, h5, h6 { font-family: var(--font-secondary) !important; }
        .hero-title, .subtitle, .cta-button { font-family: var(--font-secondary) !important; }
        .icon-phone::before { content: "📞"; }
        .icon-envelope::before { content: "✉"; }
        .icon-location::before { content: "📍"; }
        .icon-calendar::before { content: "📅"; }
        .icon-clock::before { content: "🕒"; }
        .icon-star::before { content: "★"; }
        .icon-heart::before { content: "♥"; }
        .icon-check::before { content: "✓"; }
        .icon-plus::before { content: "+"; }
        .icon-minus::before { content: "−"; }
        .icon-times::before { content: "×"; }
        .icon-bars::before { content: "☰"; }
        .icon-search::before { content: "🔍"; }
        .icon-user::before { content: "👤"; }
        .icon-cart::before { content: "🛒"; }
        .icon-home::before { content: "🏠"; }
        .icon-info::before { content: "ℹ"; }
        .icon-warning::before { content: "⚠"; }
        .icon-error::before { content: "✗"; }
        .icon-success::before { content: "✓"; }
    `;

    function injectOptimizedCSS() {
        const style = document.createElement('style');
        style.textContent = CSS_OPTIMIZATIONS;
        document.head.appendChild(style);
    }

    function replaceFontAwesomeIcons() {
        const iconMappings = {
            'fa-phone': '📞',
            'fa-envelope': '✉',
            'fa-map-marker-alt': '📍',
            'fa-calendar': '📅',
            'fa-clock': '🕒',
            'fa-star': '★',
            'fa-heart': '♥',
            'fa-check': '✓',
            'fa-plus': '+',
            'fa-minus': '−',
            'fa-times': '×',
            'fa-bars': '☰',
            'fa-search': '🔍',
            'fa-user': '👤',
            'fa-shopping-cart': '🛒',
            'fa-home': '🏠',
            'fa-info-circle': 'ℹ',
            'fa-exclamation-triangle': '⚠',
            'fa-times-circle': '✗',
            'fa-check-circle': '✓'
        };

        Object.entries(iconMappings).forEach(([faClass, replacement]) => {
            const icons = document.querySelectorAll(`.${faClass}`);
            icons.forEach(icon => {
                icon.textContent = replacement;
                icon.className = icon.className.replace(faClass, `icon-${faClass.replace('fa-', '')}`);
            });
        });
    }

    function initCSSOptimization() {
        const startTime = performance.now();
        
        console.log('Starting CSS optimization...');
        
        injectOptimizedCSS();
        replaceFontAwesomeIcons();
        
        const cssOptimizeTime = performance.now() - startTime;
        console.log(`CSS optimization completed in ${cssOptimizeTime.toFixed(2)}ms`);
        
        return { cssOptimizeTime };
    }

    window.CSSOptimizer = {
        init: initCSSOptimization,
        injectCSS: injectOptimizedCSS,
        replaceIcons: replaceFontAwesomeIcons
    };

})();
