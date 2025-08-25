/**
 * Font Loader - Optimize Font Loading Performance
 * This script handles font loading optimization and caching
 * Completely removes external font dependencies
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
            @font-face {
                font-family: 'Inter';
                src: url('/fonts/inter-var.woff2') format('woff2-variations');
                font-weight: 100 900;
                font-style: normal;
                font-display: swap;
            }

            @font-face {
                font-family: 'Poppins';
                src: url('/fonts/poppins-var.woff2') format('woff2-variations');
                font-weight: 100 900;
                font-style: normal;
                font-display: swap;
            }

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

    // Remove ALL external font links aggressively
    function removeExternalFonts() {
        const externalFonts = document.querySelectorAll(`
            link[href*="fonts.googleapis.com"], 
            link[href*="font-awesome"], 
            link[href*="cdnjs.cloudflare.com"],
            link[href*="fonts.gstatic.com"],
            link[href*="fontawesome"],
            link[href*="googleapis"],
            link[href*="cloudflare"]
        `);
        
        let removedCount = 0;
        externalFonts.forEach(link => {
            console.log('Removing external font:', link.href);
            link.remove();
            removedCount++;
        });
        
        // Also remove any @import statements in style tags
        const styleTags = document.querySelectorAll('style');
        styleTags.forEach(style => {
            if (style.textContent.includes('@import') && 
                (style.textContent.includes('fonts.googleapis.com') || 
                 style.textContent.includes('font-awesome') ||
                 style.textContent.includes('cdnjs.cloudflare.com'))) {
                console.log('Removing external font import from style tag');
                style.remove();
                removedCount++;
            }
        });
        
        return removedCount;
    }

    // Preload critical resources
    function preloadCriticalResources() {
        const criticalResources = [
            { href: '/css/styles.min.css', as: 'style' },
            { href: '/fonts/font-fallback.css', as: 'style' },
            { href: '/fonts/inter-var.woff2', as: 'font', type: 'font/woff2' },
            { href: '/fonts/poppins-var.woff2', as: 'font', type: 'font/woff2' }
        ];

        criticalResources.forEach(resource => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = resource.href;
            link.as = resource.as;
            if (resource.type) {
                link.type = resource.type;
            }
            document.head.appendChild(link);
        });
    }

    // Add favicon links
    function addFaviconLinks() {
        const faviconLinks = [
            { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
            { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
            { rel: 'apple-touch-icon', href: '/favicon.svg' }
        ];

        faviconLinks.forEach(favicon => {
            const link = document.createElement('link');
            link.rel = favicon.rel;
            link.type = favicon.type;
            link.href = favicon.href;
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

        // Remove external fonts aggressively
        const removedFonts = removeExternalFonts();
        console.log(`Removed ${removedFonts} external font links`);

        // Add favicon links
        addFaviconLinks();

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
