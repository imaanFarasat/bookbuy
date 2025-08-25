/**
 * Font Loader - Optimize Font Loading Performance
 * This script handles font loading optimization and caching
 */

(function() {
    'use strict';

    // Font loading configuration
    const FONT_CONFIG = {
        cacheKey: 'bookbuy_fonts_loaded',
        cacheExpiry: 24 * 60 * 60 * 1000, // 24 hours
        fallbackCSS: '/fonts/font-fallback.css'
    };

    // Check if fonts are already cached
    function checkFontCache() {
        try {
            const cached = localStorage.getItem(FONT_CONFIG.cacheKey);
            if (cached) {
                const data = JSON.parse(cached);
                if (Date.now() - data.timestamp < FONT_CONFIG.cacheExpiry) {
                    return true;
                }
            }
        } catch (e) {
            console.warn('Font cache check failed:', e);
        }
        return false;
    }

    // Cache font loading status
    function cacheFontStatus() {
        try {
            const data = {
                loaded: true,
                timestamp: Date.now()
            };
            localStorage.setItem(FONT_CONFIG.cacheKey, JSON.stringify(data));
        } catch (e) {
            console.warn('Font cache save failed:', e);
        }
    }

    // Load font fallback CSS
    function loadFontFallbackCSS() {
        return new Promise((resolve, reject) => {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = FONT_CONFIG.fallbackCSS;
            link.onload = () => {
                console.log('Font fallback CSS loaded successfully');
                resolve();
            };
            link.onerror = () => {
                console.warn('Failed to load font fallback CSS, using inline fallback');
                injectInlineFontFaces();
                resolve();
            };
            document.head.appendChild(link);
        });
    }

    // Inject inline font faces as fallback
    function injectInlineFontFaces() {
        const style = document.createElement('style');
        style.textContent = `
            /* Font Fallback System - Inline Fallback */
            :root {
                --font-primary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                --font-secondary: 'Poppins', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            }
            body {
                font-family: var(--font-primary);
                font-display: swap;
                text-rendering: optimizeSpeed;
                -webkit-font-smoothing: antialiased;
                -moz-osx-font-smoothing: grayscale;
            }
            .hero-title, .subtitle, .cta-button, .collection-title, .service-title {
                font-family: var(--font-secondary);
            }
        `;
        document.head.appendChild(style);
    }

    // Remove external font links
    function removeExternalFonts() {
        const externalFonts = document.querySelectorAll('link[href*="fonts.googleapis.com"], link[href*="font-awesome"]');
        externalFonts.forEach(link => {
            console.log('Removing external font:', link.href);
            link.remove();
        });
        return externalFonts.length;
    }

    // Preload critical resources
    function preloadCriticalResources() {
        const criticalResources = [
            { href: '/css/styles.min.css', as: 'style' },
            { href: '/fonts/font-fallback.css', as: 'style' }
        ];

        criticalResources.forEach(resource => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = resource.href;
            link.as = resource.as;
            document.head.appendChild(link);
        });
    }

    // Initialize font optimization
    function initFontOptimization() {
        const startTime = performance.now();
        
        console.log('Starting font optimization...');

        // Check cache first
        if (checkFontCache()) {
            console.log('Fonts already cached, skipping optimization');
            return Promise.resolve({ fontLoadTime: 0, cached: true });
        }

        // Remove external fonts
        const removedFonts = removeExternalFonts();
        console.log(`Removed ${removedFonts} external font links`);

        // Preload critical resources
        preloadCriticalResources();

        // Load font fallback CSS
        return loadFontFallbackCSS()
            .then(() => {
                // Wait for fonts to be ready
                return document.fonts.ready;
            })
            .then(() => {
                const fontLoadTime = performance.now() - startTime;
                console.log(`Font optimization completed in ${fontLoadTime.toFixed(2)}ms`);
                
                // Cache the result
                cacheFontStatus();
                
                return {
                    fontLoadTime,
                    removedFonts,
                    cached: false
                };
            })
            .catch(error => {
                console.error('Font optimization failed:', error);
                return {
                    fontLoadTime: performance.now() - startTime,
                    error: error.message,
                    cached: false
                };
            });
    }

    // Export for external use
    window.FontLoader = {
        init: initFontOptimization,
        checkCache: checkFontCache,
        cacheStatus: cacheFontStatus,
        removeExternalFonts: removeExternalFonts
    };

})();
