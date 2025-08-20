// ===== COMPONENT LOADER =====
async function loadComponent(componentName, targetId) {
    try {
        const response = await fetch(`../components/${componentName}.html`);
        if (response.ok) {
            const html = await response.text();
            const target = document.getElementById(targetId);
            if (target) {
                target.innerHTML = html;
            }
        }
    } catch (error) {
        console.error(`Error loading ${componentName} component:`, error);
    }
}

// ===== UTILITY FUNCTIONS =====
const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

// ===== CONTENT TOGGLE FUNCTION =====
function toggleContent(cardId) {
    const card = document.querySelector(`[data-card-id="${cardId}"]`);
    if (!card) return;
    
    const preview = card.querySelector('.content-preview');
    const full = card.querySelector('.content-full');
    const button = card.querySelector('.read-more-btn');
    
    if (full.classList.contains('expanded')) {
        // Collapse content
        full.classList.remove('expanded');
        preview.style.display = 'block';
        button.textContent = 'Read More';
    } else {
        // Expand content
        full.classList.add('expanded');
        preview.style.display = 'none';
        button.textContent = 'Read Less';
    }
}

// ===== GRID MANAGEMENT =====
// Removed GridManager class - elements don't exist in HTML

// ===== MOBILE MENU MANAGEMENT =====
class MobileMenuManager {
    constructor() {
        this.mobileMenuIcon = document.querySelector('.mobile-menu-icon');
        this.navMenu = document.querySelector('.nav-menu');
        this.init();
    }

    init() {
        if (this.mobileMenuIcon) {
            this.mobileMenuIcon.addEventListener('click', () => this.toggleMenu());
        }
    }

    toggleMenu() {
        const isExpanded = this.mobileMenuIcon.getAttribute('aria-expanded') === 'true';
        this.mobileMenuIcon.setAttribute('aria-expanded', !isExpanded);
        
        this.animateMenuLines(!isExpanded);
        this.toggleNavVisibility(!isExpanded);
    }

    animateMenuLines(expand) {
        const lines = this.mobileMenuIcon.querySelectorAll('.menu-line');
        lines.forEach((line, index) => {
            if (expand) {
                if (index === 0) line.style.transform = 'rotate(45deg) translate(6px, 6px)';
                if (index === 1) line.style.opacity = '0';
                if (index === 2) line.style.transform = 'rotate(-45deg) translate(8px, -8px)';
            } else {
                line.style.transform = '';
                line.style.opacity = '';
            }
        });
    }

    toggleNavVisibility(show) {
        if (this.navMenu) {
            if (show) {
                this.navMenu.classList.add('mobile-active');
            } else {
                this.navMenu.classList.remove('mobile-active');
            }
        }
    }

    resetMenu() {
        if (this.mobileMenuIcon) {
            this.mobileMenuIcon.setAttribute('aria-expanded', 'false');
            const lines = this.mobileMenuIcon.querySelectorAll('.menu-line');
            lines.forEach(line => {
                line.style.transform = '';
                line.style.opacity = '';
            });
        }
        
        if (this.navMenu) {
            this.navMenu.classList.remove('mobile-active');
        }
    }
}

// ===== INTERACTION MANAGER =====
class InteractionManager {
    constructor() {
        // Cache DOM queries for better performance
        this.navLinks = document.querySelectorAll('.nav-link');
        this.ctaButton = document.querySelector('.cta-button');
        this.mobileMenuManager = null;
        this.init();
    }

    init() {
        this.setupCTAButton();
        this.setupNavigationLinks();
        this.setupMainContentCards();
        this.setupReadMore();
        this.setupFAQInteraction();
        this.setupSEOAnalytics();
    }

    setupCTAButton() {
        if (!this.ctaButton) return;

        // Store handlers for cleanup
        this._ctaClickHandler = (e) => {
            e.preventDefault();
            this.handleCTAClick();
        };

        this._ctaKeydownHandler = (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.handleCTAClick();
            }
        };

        this.ctaButton.addEventListener('click', this._ctaClickHandler);
        this.ctaButton.addEventListener('keydown', this._ctaKeydownHandler);
    }

    handleCTAClick() {
        try {
            // Add visual feedback
            this.ctaButton.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.ctaButton.style.transform = '';
            }, 200);
            
            // Track CTA click for SEO analytics
            this.trackCTAClick();
            
            // Handle CTA action
            const target = this.ctaButton.getAttribute('href');
            if (target && target !== '#') {
                window.location.href = target;
            } else {
                // Fallback to booking page
                window.location.href = '/booking';
            }
        } catch (error) {
            console.error('Error handling CTA click:', error);
            // Fallback navigation
            window.location.href = '/booking';
        }
    }
    
    trackCTAClick() {
        try {
            // Analytics tracking for conversion optimization
            if (typeof gtag !== 'undefined') {
                gtag('event', 'cta_click', {
                    'event_category': 'engagement',
                    'event_label': 'book_now',
                    'value': 1
                });
            }
            
            // Track for internal analytics
            if (typeof dataLayer !== 'undefined') {
                dataLayer.push({
                    'event': 'cta_click',
                    'cta_type': 'book_now',
                    'page_location': window.location.pathname
                });
            }
        } catch (error) {
            console.error('Error tracking CTA click:', error);
            // Analytics errors shouldn't break user experience
        }
    }

    setupNavigationLinks() {
        // Use event delegation for better performance
        const navContainer = document.querySelector('.nav-list');
        if (navContainer) {
            // Store handlers for cleanup
            this._navClickHandler = (e) => {
                if (e.target.classList.contains('nav-link')) {
                    e.preventDefault();
                    this.handleNavClick(e.target);
                }
            };

            this._navKeydownHandler = (e) => {
                if (e.target.classList.contains('nav-link') && (e.key === 'Enter' || e.key === ' ')) {
                    e.preventDefault();
                    this.handleNavClick(e.target);
                }
            };

            navContainer.addEventListener('click', this._navClickHandler);
            navContainer.addEventListener('keydown', this._navKeydownHandler);
        }
    }

    handleNavClick(link) {
        try {
            // Add visual feedback
            link.style.color = '#CCCCCC';
            setTimeout(() => {
                link.style.color = '';
            }, 200);
            
            // Close mobile menu if open
            if (this.mobileMenuManager) {
                this.mobileMenuManager.resetMenu();
            }
            
            // Handle navigation action
            const target = link.getAttribute('href');
            if (target && target !== '#' && target !== '/') {
                // Track navigation for analytics
                this.trackNavigation(target);
                window.location.href = target;
            }
        } catch (error) {
            console.error('Error handling navigation click:', error);
            // Fallback navigation
            const target = link.getAttribute('href');
            if (target && target !== '#') {
                window.location.href = target;
            }
        }
    }
    
    trackNavigation(target) {
        try {
            // Analytics tracking for SEO insights
            if (typeof gtag !== 'undefined') {
                gtag('event', 'navigation_click', {
                    'event_category': 'navigation',
                    'event_label': target
                });
            }
            
            // Track for internal analytics
            if (typeof dataLayer !== 'undefined') {
                dataLayer.push({
                    'event': 'navigation_click',
                    'page': target
                });
            }
        } catch (error) {
            console.error('Error tracking navigation:', error);
            // Analytics errors shouldn't break user experience
        }
    }

    setupMainContentCards() {
        // Find all content cards using different possible selectors
        const cardSelectors = [
            '.main-content-card',
            '.content-card',
            '.card',
            '[class*="card"]',
            '.article-card'
        ];
        
        let allCards = [];
        cardSelectors.forEach(selector => {
            const cards = document.querySelectorAll(selector);
            cards.forEach(card => {
                if (!allCards.includes(card)) {
                    allCards.push(card);
                }
            });
        });
        
        allCards.forEach(card => {
            card.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleMainContentClick(card);
            });

            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.handleMainContentClick(card);
                } else if (e.key === 'Escape') {
                    // Handle escape key for accessibility
                    this.handleEscapeKey(card);
                }
            });
            
            // Add focus management
            card.addEventListener('focus', () => {
                this.handleCardFocus(card);
            });
            
            card.addEventListener('blur', () => {
                this.handleCardBlur(card);
            });
        });
    }
    
    handleEscapeKey(card) {
        // Close any open modal
        const cardIndex = Array.from(document.querySelectorAll('.main-content-card')).indexOf(card);
        if (cardIndex !== -1) {
            const modal = document.getElementById(`modal-${cardIndex}`);
            if (modal && modal.style.display === 'flex') {
                this.closeModal(`modal-${cardIndex}`);
                return;
            }
        }
        
        // Return focus to card
        card.focus();
    }
    
    handleCardFocus(card) {
        // Add focus indicator
        card.style.outline = '2px solid #f5a923';
        card.style.outlineOffset = '2px';
        
        // Announce to screen readers
        const cardTitle = card.querySelector('.main-content-title')?.textContent;
        if (cardTitle) {
            this.announceToScreenReader(`Card ${cardTitle} focused`);
        }
    }
    
    handleCardBlur(card) {
        // Remove focus indicator
        card.style.outline = '';
        card.style.outlineOffset = '';
    }

    handleMainContentClick(card) {
        const cardTitle = card.querySelector('.main-content-title')?.textContent;
        
        // Add visual feedback
        card.style.transform = 'translateY(-12px) scale(1.02)';
        setTimeout(() => {
            card.style.transform = '';
        }, 300);
        
        // Track card interaction for analytics
        this.trackCardClick(cardTitle);
    }
    
    trackCardClick(cardTitle) {
        try {
            if (typeof gtag !== 'undefined') {
                gtag('event', 'card_click', {
                    'event_category': 'engagement',
                    'event_label': cardTitle || 'main_content_card'
                });
            }
        } catch (error) {
            console.error('Error tracking card click:', error);
            // Analytics errors shouldn't break user experience
        }
    }

    setupReadMore() {
        // Find all content cards using different possible selectors
        const cardSelectors = [
            '.main-content-card',
            '.content-card',
            '.card',
            '[class*="card"]',
            '.article-card'
        ];
        
        let allCards = [];
        cardSelectors.forEach(selector => {
            const cards = document.querySelectorAll(selector);
            cards.forEach(card => {
                if (!allCards.includes(card)) {
                    allCards.push(card);
                }
            });
        });
        
        allCards.forEach((card, index) => {
            // Try different selectors for title and content
            const cardTitle = this.findCardTitle(card);
            const contentText = this.findCardContent(card);
            
            if (!contentText || !cardTitle) return;
            
            // Check if this content needs "read more" functionality
            if (this.shouldShowReadMore(contentText)) {
                this.createReadMoreFunctionality(card, index, cardTitle, contentText.innerHTML);
            }
        });
    }
    
    findCardTitle(card) {
        // Try different selectors for the title
        const selectors = [
            '.main-content-title',
            '.card-title',
            'h2',
            'h3',
            '[class*="title"]'
        ];
        
        for (const selector of selectors) {
            const title = card.querySelector(selector);
            if (title) {
                return title.textContent;
            }
        }
        
        return null;
    }
    
    findCardContent(card) {
        // Try different selectors for the content
        const selectors = [
            '.content-text',
            '.card-content',
            '.article-content',
            '.content',
            'p'
        ];
        
        for (const selector of selectors) {
            const content = card.querySelector(selector);
            if (content && content.textContent.trim().length > 50) {
                // Check if there's additional content in data attributes
                const fullContent = this.getCompleteContent(card, content);
                return fullContent;
            }
        }
        
        return null;
    }
    
    getCompleteContent(card, contentElement) {
        // Start with the content element
        let fullContent = contentElement.innerHTML;
        
        // Check for data attributes with full content
        const dataFullContent = card.getAttribute('data-full-content');
        if (dataFullContent) {
            fullContent = dataFullContent;
        }
        
        // Check for any hidden content elements
        const hiddenElements = card.querySelectorAll('[style*="display: none"], .hidden-content, [class*="hidden"]');
        hiddenElements.forEach(element => {
            if (element !== contentElement) {
                fullContent += element.innerHTML;
            }
        });
        
        // Check for any additional content containers
        const additionalSelectors = [
            '.additional-content',
            '.full-content',
            '.modal-content',
            '.expanded-content'
        ];
        
        additionalSelectors.forEach(selector => {
            const additional = card.querySelector(selector);
            if (additional && additional !== contentElement) {
                fullContent += additional.innerHTML;
            }
        });
        
        // Create a temporary element to return
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = fullContent;
        return tempDiv;
    }
    
    shouldShowReadMore(contentElement) {
        if (!contentElement) return false;
        
        const text = contentElement.textContent.trim();
        const html = contentElement.innerHTML;
        
        // Check if content is long enough to warrant a "read more" button
        if (text.length < 300) return false;
        
        // Check if there are multiple paragraphs
        const paragraphs = contentElement.querySelectorAll('p');
        if (paragraphs.length > 1) return true;
        
        // Check if there are lists or other complex content
        const lists = contentElement.querySelectorAll('ul, ol');
        if (lists.length > 0) return true;
        
        // Check if there are subheadings (h3, h4, etc.)
        const subheadings = contentElement.querySelectorAll('h3, h4, h5, h6');
        if (subheadings.length > 0) return true;
        
        // Check if content has multiple sentences (rough estimate)
        const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 10);
        if (sentences.length > 3) return true;
        
        return false;
    }
    
    createReadMoreFunctionality(card, index, cardTitle, fullContent) {
        // Store the original full content before creating preview
        const originalFullContent = fullContent;
        
        // Create a preview version of the content
        const previewContent = this.createPreviewContent(fullContent);
        
        // Update the card content to show preview
        const contentText = card.querySelector('.content-text');
        if (contentText) {
            contentText.innerHTML = previewContent;
        }
        
        // Create read more button if it doesn't exist
        let readMoreBtn = card.querySelector('.read-more-btn');
        if (!readMoreBtn) {
            readMoreBtn = document.createElement('button');
            readMoreBtn.className = 'read-more-btn';
            readMoreBtn.textContent = 'Read More';
            readMoreBtn.setAttribute('aria-label', `Read more about ${cardTitle}`);
            
            // Find the best place to add the button
            const buttonContainer = this.findButtonContainer(card);
            if (buttonContainer) {
                buttonContainer.appendChild(readMoreBtn);
            }
        }
        
        // Show the read more button
        readMoreBtn.style.display = 'block';
        
        // Check if there's already a modal for this card
        const cardId = card.getAttribute('data-card-id');
        let modalId = `modal-${index}`;
        
        // If card has a data-card-id, use that for modal ID
        if (cardId) {
            modalId = `modal-${cardId}`;
        }
        
        let modal = document.getElementById(modalId);
        
        // If no existing modal, create one with the ORIGINAL full content
        if (!modal) {
            modal = this.createModal(modalId, cardTitle, originalFullContent);
            document.body.appendChild(modal);
        } else {
            // If modal exists, make sure it has the full content
            const modalBody = modal.querySelector('.modal-body');
            if (modalBody) {
                modalBody.innerHTML = this.formatModalContent(originalFullContent);
            }
        }
        
        // Add event listeners
        const clickHandler = (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.openModal(modalId);
        };
        
        const keydownHandler = (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.openModal(modalId);
            }
        };
        
        // Store handlers for cleanup
        readMoreBtn._clickHandler = clickHandler;
        readMoreBtn._keydownHandler = keydownHandler;
        
        // Add event listeners
        readMoreBtn.addEventListener('click', clickHandler);
        readMoreBtn.addEventListener('keydown', keydownHandler);
    }
    
    findButtonContainer(card) {
        // Try different selectors for the button container
        const selectors = [
            '.article-content',
            '.card-content',
            '.content',
            '.main-content-preview'
        ];
        
        for (const selector of selectors) {
            const container = card.querySelector(selector);
            if (container) {
                return container;
            }
        }
        
        // Fallback: return the card itself
        return card;
    }
    
    createPreviewContent(fullContent) {
        // Create a temporary div to parse the HTML
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = fullContent;
        
        // Get all text content
        const text = tempDiv.textContent.trim();
        
        // If content is short, return as is
        if (text.length <= 300) {
            return fullContent;
        }
        
        // Check if there are multiple paragraphs, lists, or subheadings
        const paragraphs = tempDiv.querySelectorAll('p');
        const lists = tempDiv.querySelectorAll('ul, ol');
        const subheadings = tempDiv.querySelectorAll('h3, h4, h5, h6');
        
        // If there are multiple content elements, show first paragraph + "Read More"
        if (paragraphs.length > 1 || lists.length > 0 || subheadings.length > 0) {
            const firstParagraph = tempDiv.querySelector('p');
            if (firstParagraph) {
                const paragraphText = firstParagraph.textContent.trim();
                if (paragraphText.length > 200) {
                    // Truncate the first paragraph
                    const truncated = paragraphText.substring(0, 200) + '...';
                    return `<p class="content-text">${truncated}</p>`;
                } else {
                    return firstParagraph.outerHTML;
                }
            }
        }
        
        // Find the first paragraph or first significant text
        const firstParagraph = tempDiv.querySelector('p');
        if (firstParagraph) {
            const paragraphText = firstParagraph.textContent.trim();
            if (paragraphText.length > 200) {
                // Truncate the first paragraph
                const truncated = paragraphText.substring(0, 200) + '...';
                return `<p class="content-text">${truncated}</p>`;
            } else {
                return firstParagraph.outerHTML;
            }
        }
        
        // Fallback: truncate the entire text
        const truncated = text.substring(0, 200) + '...';
        return `<p class="content-text">${truncated}</p>`;
    }
    
    createModal(modalId, title, content) {
        const modal = document.createElement('div');
        modal.id = modalId;
        modal.className = 'content-modal';
        modal.style.display = 'none';
        
        // Ensure content is properly formatted
        const formattedContent = this.formatModalContent(content);
        
        modal.innerHTML = `
            <div class="modal-overlay"></div>
            <div class="modal-content">
                <div class="modal-header">
                    <h2 class="modal-title">${title}</h2>
                    <button class="modal-close-btn" aria-label="Close modal">×</button>
                </div>
                <div class="modal-body">
                    ${formattedContent}
                </div>
            </div>
        `;
        
        return modal;
    }
    
    formatModalContent(content) {
        // If content is a string, return it as is
        if (typeof content === 'string') {
            return content;
        }
        
        // If content is a DOM element, get its innerHTML
        if (content && content.innerHTML) {
            return content.innerHTML;
        }
        
        // Fallback
        return content || '';
    }
    
    openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (!modal) {
            console.error('Modal not found for modalId:', modalId);
            return;
        }
        
        console.log('Opening modal for modalId:', modalId);
        
        // Show modal
        modal.style.display = 'flex';
        modal.style.opacity = '1';
        modal.style.visibility = 'visible';
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
        document.body.classList.add('modal-open'); // Add class to body
        
        // Focus on close button for accessibility
        const closeBtn = modal.querySelector('.modal-close-btn');
        if (closeBtn) {
            closeBtn.focus();
        }
        
        // Add event listeners for closing
        this.setupModalCloseHandlers(modal, modalId);
        
        // Track modal open
        this.trackModalOpen(modalId);
        
        console.log('Modal opened successfully');
    }
    
    setupModalCloseHandlers(modal, modalId) {
        const closeBtn = modal.querySelector('.modal-close-btn');
        const overlay = modal.querySelector('.modal-overlay');
        
        // Close button click - add both click and touch events for mobile
        if (closeBtn) {
            closeBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.closeModal(modalId);
            });
            
            // Add touch events for better mobile support
            closeBtn.addEventListener('touchend', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.closeModal(modalId);
            });
        }
        
        // Overlay click
        if (overlay) {
            overlay.addEventListener('click', (e) => {
                // Only close if clicking directly on overlay, not on modal content
                if (e.target === overlay) {
                    this.closeModal(modalId);
                }
            });
            
            // Add touch events for overlay
            overlay.addEventListener('touchend', (e) => {
                if (e.target === overlay) {
                    e.preventDefault();
                    this.closeModal(modalId);
                }
            });
        }
        
        // Escape key
        const escapeHandler = (e) => {
            if (e.key === 'Escape') {
                this.closeModal(modalId);
                document.removeEventListener('keydown', escapeHandler);
            }
        };
        document.addEventListener('keydown', escapeHandler);
        
        // Store handler for cleanup
        modal._escapeHandler = escapeHandler;
    }
    
    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (!modal) return;
        
        // Hide modal
        modal.style.display = 'none';
        document.body.style.overflow = ''; // Restore scrolling
        document.body.classList.remove('modal-open'); // Remove class from body
        
        // Remove escape key handler
        if (modal._escapeHandler) {
            document.removeEventListener('keydown', modal._escapeHandler);
            delete modal._escapeHandler;
        }
        
        // Return focus to the card that opened this modal
        const cardIndex = modalId.replace('modal-', '');
        const card = document.querySelector(`.main-content-card:nth-child(${parseInt(cardIndex) * 2 + 1})`);
        if (card) {
            card.focus();
        }
        
        // Track modal close
        this.trackModalClose(modalId);
    }
    
    trackModalOpen(modalId) {
        try {
            if (typeof gtag !== 'undefined') {
                gtag('event', 'modal_open', {
                    'event_category': 'engagement',
                    'event_label': modalId
                });
            }
        } catch (error) {
            console.error('Error tracking modal open:', error);
        }
    }
    
    trackModalClose(modalId) {
        try {
            if (typeof gtag !== 'undefined') {
                gtag('event', 'modal_close', {
                    'event_category': 'engagement',
                    'event_label': modalId
                });
            }
        } catch (error) {
            console.error('Error tracking modal close:', error);
        }
    }


    
    announceToScreenReader(message) {
        // Create live region for screen reader announcements
        let liveRegion = document.getElementById('screen-reader-announcements');
        if (!liveRegion) {
            liveRegion = document.createElement('div');
            liveRegion.id = 'screen-reader-announcements';
            liveRegion.setAttribute('aria-live', 'polite');
            liveRegion.setAttribute('aria-atomic', 'true');
            liveRegion.style.position = 'absolute';
            liveRegion.style.left = '-10000px';
            liveRegion.style.width = '1px';
            liveRegion.style.height = '1px';
            liveRegion.style.overflow = 'hidden';
            document.body.appendChild(liveRegion);
        }
        
        liveRegion.textContent = message;
        
        // Clear message after announcement
        setTimeout(() => {
            liveRegion.textContent = '';
        }, 1000);
    }
    
    setupFAQInteraction() {
        const faqCards = document.querySelectorAll('.faq-card');
        
        faqCards.forEach(faqCard => {
            // Add click functionality
            faqCard.addEventListener('click', () => {
                // Visual feedback
                faqCard.style.transform = 'scale(0.98)';
                setTimeout(() => {
                    faqCard.style.transform = '';
                }, 150);
                
                // Track FAQ interaction
                this.trackFAQClick(faqCard);
            });
            
            // Add keyboard navigation support
            faqCard.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    faqCard.click();
                }
            });
            
            // Add focus indicator
            faqCard.addEventListener('focus', () => {
                faqCard.setAttribute('aria-label', 'FAQ question and answer - Click for more details');
            });
            
            faqCard.addEventListener('blur', () => {
                faqCard.setAttribute('aria-label', 'FAQ question and answer');
            });
        });
    }
    
    trackFAQClick(faqCard) {
        try {
            const question = faqCard.querySelector('.faq-question')?.textContent;
            if (typeof gtag !== 'undefined') {
                gtag('event', 'faq_click', {
                    'event_category': 'engagement',
                    'event_label': question || 'faq_interaction'
                });
            }
        } catch (error) {
            console.error('Error tracking FAQ click:', error);
        }
    }
    
    setupSEOAnalytics() {
        // Track page engagement for SEO
        this.trackPageEngagement();
        
        // Track scroll depth for content optimization
        this.trackScrollDepth();
        
        // Track time on page for SEO insights
        this.trackTimeOnPage();
    }
    
    trackPageEngagement() {
        try {
            // Track user engagement metrics
            if (typeof gtag !== 'undefined') {
                gtag('event', 'page_view', {
                    'page_title': document.title,
                    'page_location': window.location.href
                });
            }
        } catch (error) {
            console.error('Error tracking page engagement:', error);
            // Analytics errors shouldn't break user experience
        }
    }
    
    trackScrollDepth() {
        let maxScroll = 0;
        const trackScroll = () => {
            const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
            if (scrollPercent > maxScroll) {
                maxScroll = scrollPercent;
                
                // Track scroll milestones
                if (maxScroll >= 25 && maxScroll < 50) {
                    this.trackScrollEvent('25%');
                } else if (maxScroll >= 50 && maxScroll < 75) {
                    this.trackScrollEvent('50%');
                } else if (maxScroll >= 75 && maxScroll < 100) {
                    this.trackScrollEvent('75%');
                } else if (maxScroll >= 100) {
                    this.trackScrollEvent('100%');
                }
            }
        };
        
        // Store handler for cleanup
        this._scrollHandler = debounce(trackScroll, 100);
        window.addEventListener('scroll', this._scrollHandler);
    }
    
    trackScrollEvent(depth) {
        try {
            if (typeof gtag !== 'undefined') {
                gtag('event', 'scroll_depth', {
                    'event_category': 'engagement',
                    'event_label': depth,
                    'page_location': window.location.pathname
                });
            }
        } catch (error) {
            console.error('Error tracking scroll event:', error);
            // Analytics errors shouldn't break user experience
        }
    }
    
    trackTimeOnPage() {
        const startTime = Date.now();
        
        // Store handler for cleanup
        this._beforeunloadHandler = () => {
            try {
                const timeOnPage = Math.round((Date.now() - startTime) / 1000);
                
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'time_on_page', {
                        'event_category': 'engagement',
                        'event_label': timeOnPage + 's',
                        'value': timeOnPage
                    });
                }
            } catch (error) {
                console.error('Error tracking time on page:', error);
                // Analytics errors shouldn't break user experience
            }
        };
        
        window.addEventListener('beforeunload', this._beforeunloadHandler);
    }
    
    // Cleanup method to prevent memory leaks
    cleanup() {
        // Remove event listeners from read more buttons
        const readMoreBtns = document.querySelectorAll('.read-more-btn');
        readMoreBtns.forEach(btn => {
            if (btn._clickHandler) {
                btn.removeEventListener('click', btn._clickHandler);
                delete btn._clickHandler;
            }
            if (btn._keydownHandler) {
                btn.removeEventListener('keydown', btn._keydownHandler);
                delete btn._keydownHandler;
            }
        });
        
        // Remove dynamically created modals
        const dynamicModals = document.querySelectorAll('.content-modal');
        dynamicModals.forEach(modal => {
            if (modal._escapeHandler) {
                document.removeEventListener('keydown', modal._escapeHandler);
                delete modal._escapeHandler;
            }
            modal.remove();
        });
        
        // Remove navigation event listeners (using event delegation, so remove from container)
        const navContainer = document.querySelector('.nav-list');
        if (navContainer) {
            navContainer.removeEventListener('click', this._navClickHandler);
            navContainer.removeEventListener('keydown', this._navKeydownHandler);
        }
        
        // Remove CTA event listeners
        if (this.ctaButton) {
            this.ctaButton.removeEventListener('click', this._ctaClickHandler);
            this.ctaButton.removeEventListener('keydown', this._ctaKeydownHandler);
        }
        
        // Remove scroll event listener
        if (this._scrollHandler) {
            window.removeEventListener('scroll', this._scrollHandler);
        }
        
        // Remove beforeunload event listener
        if (this._beforeunloadHandler) {
            window.removeEventListener('beforeunload', this._beforeunloadHandler);
        }
    }
}

// ===== RESPONSIVE BEHAVIOR =====
class ResponsiveManager {
    constructor() {
        this.mobileMenuManager = null;
        this.init();
    }

    init() {
        window.addEventListener('resize', debounce(() => this.handleResize(), 250));
    }

    handleResize() {
        const isMobile = window.innerWidth <= 768;
        
        // Reset mobile menu state on desktop
        if (!isMobile && this.mobileMenuManager) {
            this.mobileMenuManager.resetMenu();
        }
    }
}

// ===== MAIN APPLICATION =====
class App {
    constructor() {
        this.mobileMenuManager = null;
        this.interactionManager = null;
        this.responsiveManager = null;
    }

    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }

    setup() {
        try {
            // Initialize managers with error handling
            this.mobileMenuManager = new MobileMenuManager();
            this.interactionManager = new InteractionManager();
            this.responsiveManager = new ResponsiveManager();
            
            // Store references
            this.responsiveManager.mobileMenuManager = this.mobileMenuManager;
            this.interactionManager.mobileMenuManager = this.mobileMenuManager;
            
            // Add page unload cleanup
            window.addEventListener('beforeunload', () => {
                this.cleanup();
            });
            
        } catch (error) {
            console.error('Error initializing app:', error);
            // Graceful degradation - ensure basic functionality still works
            this.setupFallback();
        }
    }
    
    setupFallback() {
        // Basic fallback functionality if initialization fails
        console.log('Running in fallback mode');
        
        // Ensure mobile menu still works
        const mobileMenuIcon = document.querySelector('.mobile-menu-icon');
        const navMenu = document.querySelector('.nav-menu');
        
        if (mobileMenuIcon && navMenu) {
            mobileMenuIcon.addEventListener('click', () => {
                navMenu.classList.toggle('mobile-active');
            });
        }
    }
    
    // Cleanup method for memory management
    cleanup() {
        if (this.interactionManager) {
            this.interactionManager.cleanup();
        }
        if (this.mobileMenuManager) {
            this.mobileMenuManager.resetMenu();
        }
    }
}

// ===== INITIALIZE APPLICATION =====
const app = new App();
app.init();

// ===== LOAD COMPONENTS =====
document.addEventListener('DOMContentLoaded', function() {
    loadComponent('footer', 'footer-component');
}); 