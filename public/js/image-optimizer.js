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
            tablet: 'w_600,q_80,f_auto', 
            desktop: 'w_800,q_80,f_auto',
            // Hero images (above fold) - More aggressive optimization
            hero: 'w_600,q_75,f_auto',
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
        // Force HTTPS for all Cloudinary URLs
        if (url.startsWith('http://')) {
            url = url.replace('http://', 'https://');
        }
        
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
            if (index < 1) { // Preload only the first image (hero) for fastest LCP
                const optimizedSrc = addCloudinaryTransformations(img.src, img);
                
                // Add multiple preload strategies
                const link = document.createElement('link');
                link.rel = 'preload';
                link.as = 'image';
                link.href = optimizedSrc;
                link.fetchPriority = 'high';
                document.head.appendChild(link);
                
                // Also add DNS prefetch for Cloudinary
                const dnsPrefetch = document.createElement('link');
                dnsPrefetch.rel = 'dns-prefetch';
                dnsPrefetch.href = 'https://res.cloudinary.com';
                document.head.appendChild(dnsPrefetch);
                
                console.log('Preloading hero image:', optimizedSrc);
            }
        });
    }

    // Add image dimensions to prevent layout shift
    function addImageDimensions() {
        const images = document.querySelectorAll('img[src*="cloudinary.com"]:not([width]):not([height])');
        
        images.forEach(img => {
            // Set aspect ratio to prevent layout shift
            img.style.aspectRatio = '16/9'; // Default aspect ratio
            img.style.width = '100%';
            img.style.height = 'auto';
            
            // Add loading placeholder
            img.style.backgroundColor = '#f0f0f0';
            img.style.transition = 'opacity 0.3s ease';
            
            // Show image when loaded
            img.onload = function() {
                this.style.opacity = '1';
                this.style.backgroundColor = 'transparent';
            };
            
            // Set initial opacity
            img.style.opacity = '0';
        });
    }

    // Initialize image optimization
    function initImageOptimization() {
        const startTime = performance.now();
        
        console.log('Starting image optimization...');
        
        // Fix SSL issues first
        fixSSLIssues();
        
        // Prioritize hero image optimization first
        optimizeHeroImages();
        
        // Then optimize everything else
        optimizeCloudinaryURLs();
        addResponsiveImages();
        preloadCriticalImages();
        addImageDimensions();
        
        const optimizeTime = performance.now() - startTime;
        console.log(`Image optimization completed in ${optimizeTime.toFixed(2)}ms`);
        
        return { optimizeTime };
    }

    // Fix SSL issues by converting HTTP to HTTPS
    function fixSSLIssues() {
        // Remove external font dependencies that cause SSL issues
        removeExternalFontDependencies();
        
        // Fix all image URLs
        const images = document.querySelectorAll('img[src^="http://"]');
        images.forEach(img => {
            img.src = img.src.replace('http://', 'https://');
            console.log('Fixed SSL for image:', img.src);
        });
        
        // Fix all link URLs
        const links = document.querySelectorAll('a[href^="http://"]');
        links.forEach(link => {
            link.href = link.href.replace('http://', 'https://');
            console.log('Fixed SSL for link:', link.href);
        });
        
        // Fix all script URLs
        const scripts = document.querySelectorAll('script[src^="http://"]');
        scripts.forEach(script => {
            script.src = script.src.replace('http://', 'https://');
            console.log('Fixed SSL for script:', script.src);
        });
        
        // Fix all link rel="stylesheet" URLs
        const stylesheets = document.querySelectorAll('link[rel="stylesheet"][href^="http://"]');
        stylesheets.forEach(link => {
            link.href = link.href.replace('http://', 'https://');
            console.log('Fixed SSL for stylesheet:', link.href);
        });
    }

    // Remove external font dependencies that cause SSL issues
    function removeExternalFontDependencies() {
        // Remove Font Awesome CDN links
        const fontAwesomeLinks = document.querySelectorAll('link[href*="font-awesome"], link[href*="cdnjs.cloudflare.com"]');
        fontAwesomeLinks.forEach(link => {
            link.remove();
            console.log('Removed Font Awesome CDN link');
        });
        
        // Remove Google Fonts links
        const googleFontsLinks = document.querySelectorAll('link[href*="fonts.googleapis.com"], link[href*="fonts.gstatic.com"]');
        googleFontsLinks.forEach(link => {
            link.remove();
            console.log('Removed Google Fonts link');
        });
        
        // Remove external stylesheets with @import
        const styleSheets = document.querySelectorAll('style');
        styleSheets.forEach(style => {
            if (style.textContent.includes('@import url(')) {
                style.textContent = style.textContent.replace(/@import url\([^)]+\);/g, '');
                console.log('Removed @import statements from inline styles');
            }
        });
    }

    // Optimize hero images first for faster LCP
    function optimizeHeroImages() {
        const heroImages = document.querySelectorAll('img[src*="cloudinary.com"]');
        
        heroImages.forEach((img, index) => {
            if (index === 0) { // Only the first image (hero)
                const originalSrc = img.src;
                const optimizedSrc = addCloudinaryTransformations(originalSrc, img);
                
                if (optimizedSrc !== originalSrc) {
                    img.src = optimizedSrc;
                    console.log('Optimized hero image:', originalSrc, '→', optimizedSrc);
                }
            }
        });
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
