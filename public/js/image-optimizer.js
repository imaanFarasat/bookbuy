/**
 * Image Optimizer - Enhance Cloudinary URLs for Better Performance
 */

(function() {
    'use strict';

    // Cloudinary optimization configuration
    const CLOUDINARY_CONFIG = {
        cloudName: 'dvpoab5n3',
        transformations: {
            // Responsive breakpoints
            mobile: 'w_400,q_80,f_auto',
            tablet: 'w_800,q_80,f_auto', 
            desktop: 'w_1200,q_80,f_auto',
            // Hero images (above fold)
            hero: 'w_1200,q_85,f_auto',
            // Thumbnails
            thumbnail: 'w_300,h_200,c_fill,q_75,f_auto',
            // Gallery images
            gallery: 'w_600,h_400,c_fill,q_80,f_auto'
        }
    };

    // Optimize Cloudinary URLs with transformations
    function optimizeCloudinaryURLs() {
        const images = document.querySelectorAll('img[src*="cloudinary.com"]');
        
        images.forEach(img => {
            const originalSrc = img.src;
            const optimizedSrc = addCloudinaryTransformations(originalSrc, img);
            
            if (optimizedSrc !== originalSrc) {
                img.src = optimizedSrc;
                console.log('Optimized image:', originalSrc, '→', optimizedSrc);
            }
        });
    }

    // Add Cloudinary transformations to URL
    function addCloudinaryTransformations(url, imgElement) {
        // Skip if already has transformations
        if (url.includes('/upload/t_') || url.includes('/upload/c_')) {
            return url;
        }

        // Determine image type and size
        const imageType = getImageType(imgElement);
        const transformation = CLOUDINARY_CONFIG.transformations[imageType] || CLOUDINARY_CONFIG.transformations.desktop;

        // Add transformation to URL
        return url.replace('/upload/', `/upload/${transformation}/`);
    }

    // Determine image type based on context
    function getImageType(imgElement) {
        const src = imgElement.src.toLowerCase();
        const alt = imgElement.alt.toLowerCase();
        const className = imgElement.className.toLowerCase();
        
        // Hero images (above fold)
        if (src.includes('bea-professional') || className.includes('hero') || className.includes('main')) {
            return 'hero';
        }
        
        // Thumbnails
        if (className.includes('thumb') || className.includes('small')) {
            return 'thumbnail';
        }
        
        // Gallery images
        if (className.includes('gallery') || className.includes('related')) {
            return 'gallery';
        }
        
        // Default based on position
        const rect = imgElement.getBoundingClientRect();
        if (rect.top < window.innerHeight) {
            return 'hero'; // Above fold
        }
        
        return 'desktop'; // Default
    }

    // Add responsive images with srcset
    function addResponsiveImages() {
        const images = document.querySelectorAll('img[src*="cloudinary.com"]:not([srcset])');
        
        images.forEach(img => {
            const originalSrc = img.src;
            const srcset = generateSrcset(originalSrc);
            
            if (srcset) {
                img.srcset = srcset;
                img.sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw';
                console.log('Added responsive image:', img.src);
            }
        });
    }

    // Generate srcset for responsive images
    function generateSrcset(baseUrl) {
        if (!baseUrl.includes('cloudinary.com')) return null;
        
        const sizes = [
            { width: 400, suffix: 'w_400,q_80,f_auto' },
            { width: 800, suffix: 'w_800,q_80,f_auto' },
            { width: 1200, suffix: 'w_1200,q_80,f_auto' },
            { width: 1600, suffix: 'w_1600,q_80,f_auto' }
        ];
        
        return sizes.map(size => {
            const optimizedUrl = baseUrl.replace('/upload/', `/upload/${size.suffix}/`);
            return `${optimizedUrl} ${size.width}w`;
        }).join(', ');
    }

    // Preload critical images
    function preloadCriticalImages() {
        const criticalImages = document.querySelectorAll('img[src*="cloudinary.com"]');
        
        criticalImages.forEach((img, index) => {
            if (index < 3) { // Preload first 3 images
                const link = document.createElement('link');
                link.rel = 'preload';
                link.as = 'image';
                link.href = img.src;
                document.head.appendChild(link);
            }
        });
    }

    // Initialize image optimization
    function initImageOptimization() {
        const startTime = performance.now();
        
        console.log('Starting image optimization...');
        
        optimizeCloudinaryURLs();
        addResponsiveImages();
        preloadCriticalImages();
        
        const optimizeTime = performance.now() - startTime;
        console.log(`Image optimization completed in ${optimizeTime.toFixed(2)}ms`);
        
        return { optimizeTime };
    }

    // Export for external use
    window.ImageOptimizer = {
        init: initImageOptimization,
        optimizeURLs: optimizeCloudinaryURLs,
        addResponsive: addResponsiveImages,
        preloadCritical: preloadCriticalImages
    };

    // Auto-initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initImageOptimization);
    } else {
        initImageOptimization();
    }

})();
