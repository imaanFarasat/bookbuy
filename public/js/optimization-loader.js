/**
 * Optimization Loader - Load All Optimization Scripts
 */

(function() {
    'use strict';

    function loadOptimizations() {
        const scripts = [
            '/js/font-loader.js',
            '/js/css-optimizer.js',
            '/js/image-optimizer.js',
            '/js/page-enhancer.js'
        ];

        let loadedCount = 0;
        const totalScripts = scripts.length;

        scripts.forEach(scriptSrc => {
            const script = document.createElement('script');
            script.src = scriptSrc;
            script.async = true;
            script.onload = () => {
                loadedCount++;
                if (loadedCount === totalScripts) {
                    console.log('All optimization scripts loaded successfully');
                }
            };
            script.onerror = () => {
                console.error('Failed to load optimization script:', scriptSrc);
            };
            document.head.appendChild(script);
        });
    }

    loadOptimizations();
})();
