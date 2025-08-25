/**
 * Page Enhancer - Main Performance Coordinator
 */

(function() {
    'use strict';

    const CONFIG = {
        enablePerformanceMonitoring: true,
        enableLazyLoading: true,
        enableExternalLinkOptimization: true
    };

    let metrics = {
        fontLoadTime: 0,
        cssOptimizeTime: 0,
        totalOptimizeTime: 0,
        externalFontsRemoved: 0
    };

    function enhancePagePerformance() {
        const startTime = performance.now();
        
        console.log('Starting page optimizations...');

        // Load font optimization
        return window.FontLoader.init()
            .then(fontMetrics => {
                metrics.fontLoadTime = fontMetrics.fontLoadTime;
                metrics.externalFontsRemoved = fontMetrics.removedFonts || 0;
                
                // Load CSS optimization
                const cssMetrics = window.CSSOptimizer.init();
                metrics.cssOptimizeTime = cssMetrics.cssOptimizeTime;
                
                // Load image optimization
                const imageMetrics = window.ImageOptimizer.init();
                metrics.imageOptimizeTime = imageMetrics.optimizeTime;
                
                // Additional performance enhancements
                if (CONFIG.enableLazyLoading) {
                    optimizeImages();
                }
                
                if (CONFIG.enableExternalLinkOptimization) {
                    optimizeExternalLinks();
                }
                
                metrics.totalOptimizeTime = performance.now() - startTime;
                
                console.log(`Page optimizations completed in ${metrics.totalOptimizeTime.toFixed(2)}ms`);
                
                // Dispatch completion event
                window.dispatchEvent(new CustomEvent('pageOptimizationsComplete', {
                    detail: metrics
                }));
                
                return metrics;
            })
            .catch(error => {
                console.error('Page optimization failed:', error);
                metrics.totalOptimizeTime = performance.now() - startTime;
                return metrics;
            });
    }

    function optimizeImages() {
        const images = document.querySelectorAll('img:not([loading])');
        images.forEach(img => {
            if (!img.hasAttribute('loading')) {
                img.setAttribute('loading', 'lazy');
            }
        });
    }

    function optimizeExternalLinks() {
        const externalLinks = document.querySelectorAll('a[href^="http"]:not([rel])');
        externalLinks.forEach(link => {
            link.setAttribute('rel', 'noopener noreferrer');
        });
    }

    function initPageEnhancer() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', enhancePagePerformance);
        } else {
            enhancePagePerformance();
        }
    }

    window.PageEnhancer = {
        init: initPageEnhancer,
        enhance: enhancePagePerformance,
        config: CONFIG,
        metrics: metrics
    };

    // Auto-initialize
    initPageEnhancer();

})();
