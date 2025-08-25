/**
 * Image Optimizer - Handle responsive images and format optimization
 * Supports WebP, AVIF, and fallback formats
 */

(function() {
    'use strict';

    // Image optimization configuration
    const IMAGE_CONFIG = {
        formats: ['avif', 'webp', 'jpg'],
        sizes: {
            hero: {
                mobile: '400w',
                tablet: '800w',
                desktop: '1200w'
            },
            gallery: {
                mobile: '300w',
                tablet: '600w',
                desktop: '900w'
            },
            thumbnail: {
                mobile: '150w',
                tablet: '300w',
                desktop: '450w'
            }
        },
        quality: {
            avif: 80,
            webp: 85,
            jpg: 90
        }
    };

    // Check browser support for modern image formats
    function checkFormatSupport() {
        return {
            avif: false, // Will be detected dynamically
            webp: false, // Will be detected dynamically
            jpg: true,   // Always supported
            png: true    // Always supported
        };
    }

    // Detect WebP support
    function detectWebPSupport() {
        return new Promise((resolve) => {
            const webP = new Image();
            webP.onload = webP.onerror = function() {
                resolve(webP.height === 2);
            };
            webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
        });
    }

    // Detect AVIF support
    function detectAVIFSupport() {
        return new Promise((resolve) => {
            const avif = new Image();
            avif.onload = avif.onerror = function() {
                resolve(avif.height === 2);
            };
            avif.src = 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAEAAAABAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgABogQEAwgMg8f8D///8WfhwB8+ErK42A=';
        });
    }

    // Generate optimized image URLs
    function generateImageUrls(baseUrl, imageName, size = 'hero') {
        const urls = {};
        const sizes = IMAGE_CONFIG.sizes[size];
        
        IMAGE_CONFIG.formats.forEach(format => {
            urls[format] = {
                mobile: `${baseUrl}/images/${imageName}-${sizes.mobile}.${format}`,
                tablet: `${baseUrl}/images/${imageName}-${sizes.tablet}.${format}`,
                desktop: `${baseUrl}/images/${imageName}-${sizes.desktop}.${format}`
            };
        });
        
        return urls;
    }

    // Create responsive picture element
    function createResponsivePicture(imageUrls, alt, className = '') {
        const picture = document.createElement('picture');
        picture.className = className;
        
        // Add AVIF source if supported
        if (window.imageSupport && window.imageSupport.avif) {
            const avifSource = document.createElement('source');
            avifSource.type = 'image/avif';
            avifSource.sizes = '(max-width: 768px) 400px, (max-width: 1024px) 800px, 1200px';
            avifSource.srcset = `${imageUrls.avif.mobile} 400w, ${imageUrls.avif.tablet} 800w, ${imageUrls.avif.desktop} 1200w`;
            picture.appendChild(avifSource);
        }
        
        // Add WebP source if supported
        if (window.imageSupport && window.imageSupport.webp) {
            const webpSource = document.createElement('source');
            webpSource.type = 'image/webp';
            webpSource.sizes = '(max-width: 768px) 400px, (max-width: 1024px) 800px, 1200px';
            webpSource.srcset = `${imageUrls.webp.mobile} 400w, ${imageUrls.webp.tablet} 800w, ${imageUrls.webp.desktop} 1200w`;
            picture.appendChild(webpSource);
        }
        
        // Add fallback image
        const img = document.createElement('img');
        img.src = imageUrls.jpg.desktop;
        img.alt = alt;
        img.loading = 'lazy';
        img.sizes = '(max-width: 768px) 400px, (max-width: 1024px) 800px, 1200px';
        img.srcset = `${imageUrls.jpg.mobile} 400w, ${imageUrls.jpg.tablet} 800w, ${imageUrls.jpg.desktop} 1200w`;
        
        picture.appendChild(img);
        return picture;
    }

    // Optimize existing images on the page
    function optimizeExistingImages() {
        const images = document.querySelectorAll('img[src*="bea-professional-nail-technician-toronto.png"]');
        
        images.forEach(img => {
            const parent = img.parentElement;
            const alt = img.alt || 'Bea - Professional Nail Technician Toronto';
            const className = img.className;
            
            // Generate optimized URLs
            const imageUrls = generateImageUrls('', 'bea-hero', 'hero');
            
            // Create responsive picture element
            const picture = createResponsivePicture(imageUrls, alt, className);
            
            // Replace the image with the picture element
            parent.replaceChild(picture, img);
        });
    }

    // Initialize image optimization
    async function initImageOptimization() {
        console.log('Initializing image optimization...');
        
        // Detect format support
        const [webpSupport, avifSupport] = await Promise.all([
            detectWebPSupport(),
            detectAVIFSupport()
        ]);
        
        // Store support info globally
        window.imageSupport = {
            webp: webpSupport,
            avif: avifSupport,
            jpg: true,
            png: true
        };
        
        console.log('Image format support:', window.imageSupport);
        
        // Optimize existing images
        optimizeExistingImages();
        
        // Add intersection observer for lazy loading
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.removeAttribute('data-src');
                            observer.unobserve(img);
                        }
                    }
                });
            });
            
            // Observe all images with data-src
            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }
    }

    // Export for external use
    window.ImageOptimizer = {
        init: initImageOptimization,
        createResponsivePicture: createResponsivePicture,
        generateImageUrls: generateImageUrls,
        checkFormatSupport: checkFormatSupport
    };

    // Auto-initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initImageOptimization);
    } else {
        initImageOptimization();
    }

})();
