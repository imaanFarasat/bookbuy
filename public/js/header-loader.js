// Header Component Loader
document.addEventListener('DOMContentLoaded', function() {
    // Create header container if it doesn't exist
    let headerContainer = document.getElementById('header-container');
    if (!headerContainer) {
        headerContainer = document.createElement('div');
        headerContainer.id = 'header-container';
        // Insert header at the beginning of body, after background-image if it exists
        const backgroundImage = document.querySelector('.background-image');
        if (backgroundImage) {
            backgroundImage.insertAdjacentElement('afterend', headerContainer);
        } else {
            document.body.insertBefore(headerContainer, document.body.firstChild);
        }
    }

    // Load header component
    fetch('../components/header.html')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to load header component');
            }
            return response.text();
        })
        .then(html => {
            headerContainer.innerHTML = html;
            
            // Initialize mobile menu functionality after header is loaded
            initializeMobileMenu();
        })
        .catch(error => {
            console.error('Error loading header:', error);
            // Fallback: create a basic header
            headerContainer.innerHTML = `
                <header class="header">
                    <a href="../index.html" class="logo">BOOKBUY</a>
                    <nav class="nav-menu">
                        <ul class="nav-list">
                            <li><a href="../index.html" class="nav-link">Home</a></li>
                            <li><a href="https://bea-nails.bookbuy.ca/" class="nav-link">Services</a></li>
                        </ul>
                    </nav>
                    <button class="mobile-menu-icon">
                        <div class="menu-line"></div>
                        <div class="menu-line"></div>
                        <div class="menu-line"></div>
                    </button>
                </header>
            `;
            initializeMobileMenu();
        });
});

// Mobile menu functionality
function initializeMobileMenu() {
    const mobileMenuIcon = document.querySelector('.mobile-menu-icon');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileMenuIcon && navMenu) {
        mobileMenuIcon.addEventListener('click', function() {
            navMenu.classList.toggle('mobile-active');
            mobileMenuIcon.classList.toggle('active');
        });

        // Close mobile menu when clicking on nav links
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('mobile-active');
                mobileMenuIcon.classList.remove('active');
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!event.target.closest('.header')) {
                navMenu.classList.remove('mobile-active');
                mobileMenuIcon.classList.remove('active');
            }
        });
    }
}
