// Main JavaScript file for Alexey Kostin's Portfolio

// Initialize AOS (Animate On Scroll)
document.addEventListener('DOMContentLoaded', function() {
    AOS.init({
        duration: 1000,
        easing: 'ease-in-out',
        once: true,
        mirror: false
    });
});

// Navbar functionality
class Navigation {
    constructor() {
        this.navbar = document.getElementById('navbar');
        this.navToggle = document.getElementById('nav-toggle');
        this.navMenu = document.getElementById('nav-menu');
        this.navLinks = document.querySelectorAll('.nav-link');
        
        this.init();
    }

    init() {
        // Mobile menu toggle
        this.navToggle.addEventListener('click', () => this.toggleMobileMenu());
        
        // Close mobile menu when clicking on links
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => this.closeMobileMenu());
        });

        // Navbar scroll effect
        window.addEventListener('scroll', () => this.handleScroll());

        // Smooth scrolling
        this.setupSmoothScrolling();

        // Active link highlighting
        this.setupActiveLinks();
    }

    toggleMobileMenu() {
        this.navMenu.classList.toggle('active');
        this.navToggle.classList.toggle('active');
        
        // Prevent body scroll when menu is open
        document.body.style.overflow = this.navMenu.classList.contains('active') ? 'hidden' : '';
    }

    closeMobileMenu() {
        this.navMenu.classList.remove('active');
        this.navToggle.classList.remove('active');
        document.body.style.overflow = '';
    }

    handleScroll() {
        const scrollTop = window.pageYOffset;
        
        // Add/remove scrolled class for navbar styling
        if (scrollTop > 100) {
            this.navbar.classList.add('scrolled');
        } else {
            this.navbar.classList.remove('scrolled');
        }
    }

    setupSmoothScrolling() {
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    const offsetTop = targetElement.offsetTop - 80; // Account for fixed navbar
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });

        // Smooth scroll for hero scroll button
        const heroScrollBtn = document.querySelector('.scroll-link');
        if (heroScrollBtn) {
            heroScrollBtn.addEventListener('click', (e) => {
                e.preventDefault();
                const targetElement = document.querySelector('#about');
                if (targetElement) {
                    const offsetTop = targetElement.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        }
    }

    setupActiveLinks() {
        const sections = document.querySelectorAll('section[id]');
        
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset + 100;
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                const sectionId = section.getAttribute('id');
                
                if (scrollTop >= sectionTop && scrollTop < sectionTop + sectionHeight) {
                    // Remove active class from all links
                    this.navLinks.forEach(link => link.classList.remove('active'));
                    
                    // Add active class to current section link
                    const activeLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
                    if (activeLink) {
                        activeLink.classList.add('active');
                    }
                }
            });
        });
    }
}

// Skills animation
class SkillsAnimation {
    constructor() {
        this.skillsSection = document.getElementById('skills');
        this.animated = false;
        this.init();
    }

    init() {
        if (this.skillsSection) {
            window.addEventListener('scroll', () => this.checkIfInView());
        }
    }

    checkIfInView() {
        if (this.animated) return;

        const rect = this.skillsSection.getBoundingClientRect();
        const isInView = rect.top < window.innerHeight && rect.bottom > 0;

        if (isInView) {
            this.animateSkills();
            this.animated = true;
        }
    }

    animateSkills() {
        const skillCategories = document.querySelectorAll('.skill-category');
        
        skillCategories.forEach((category, index) => {
            setTimeout(() => {
                category.classList.add('animate');
                
                // Animate skill items
                const skillItems = category.querySelectorAll('.skill-item');
                skillItems.forEach((item, itemIndex) => {
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                    }, itemIndex * 100);
                });
            }, index * 200);
        });
    }
}

// Typing effect for hero title
class TypingEffect {
    constructor() {
        this.titleElement = document.querySelector('.title-main');
        this.originalText = 'Алексей Костин';
        this.typeSpeed = 100;
        this.deleteSpeed = 50;
        this.pauseTime = 2000;
        
        this.init();
    }

    init() {
        if (this.titleElement) {
            // Start typing effect after a short delay
            setTimeout(() => {
                this.startTyping();
            }, 500);
        }
    }

    startTyping() {
        this.titleElement.textContent = '';
        this.typeText(0);
    }

    typeText(index) {
        if (index < this.originalText.length) {
            this.titleElement.textContent += this.originalText.charAt(index);
            setTimeout(() => this.typeText(index + 1), this.typeSpeed);
        } else {
            // Add cursor blink effect
            this.titleElement.classList.add('typing-complete');
        }
    }
}

// Counter animation for hero stats
class CounterAnimation {
    constructor() {
        this.counters = document.querySelectorAll('.stat-number');
        this.animated = false;
        this.init();
    }

    init() {
        if (this.counters.length > 0) {
            window.addEventListener('scroll', () => this.checkIfInView());
        }
    }

    checkIfInView() {
        if (this.animated) return;

        const heroSection = document.getElementById('hero');
        const rect = heroSection.getBoundingClientRect();
        const isInView = rect.bottom > window.innerHeight / 2;

        if (isInView) {
            this.animateCounters();
            this.animated = true;
        }
    }

    animateCounters() {
        this.counters.forEach(counter => {
            const target = counter.textContent;
            const isPercentage = target.includes('%');
            const isPlus = target.includes('+');
            const numericValue = parseInt(target.replace(/[%+]/g, ''));
            
            let current = 0;
            const increment = numericValue / 50;
            
            const updateCounter = () => {
                if (current < numericValue) {
                    current += increment;
                    let displayValue = Math.floor(current);
                    
                    if (isPercentage) {
                        counter.textContent = displayValue + '%';
                    } else if (isPlus) {
                        counter.textContent = displayValue + '+';
                    } else {
                        counter.textContent = displayValue;
                    }
                    
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target; // Ensure final value is exact
                }
            };
            
            updateCounter();
        });
    }
}

// Timeline animation
class TimelineAnimation {
    constructor() {
        this.timelineItems = document.querySelectorAll('.timeline-item');
        this.init();
    }

    init() {
        if (this.timelineItems.length > 0) {
            window.addEventListener('scroll', () => this.animateTimeline());
        }
    }

    animateTimeline() {
        this.timelineItems.forEach(item => {
            const rect = item.getBoundingClientRect();
            const isInView = rect.top < window.innerHeight * 0.8;
            
            if (isInView && !item.classList.contains('animated')) {
                item.classList.add('animated');
            }
        });
    }
}

// Project cards hover effect
class ProjectCards {
    constructor() {
        this.projectCards = document.querySelectorAll('.project-card');
        this.init();
    }

    init() {
        this.projectCards.forEach(card => {
            card.addEventListener('mouseenter', () => this.handleHover(card));
            card.addEventListener('mouseleave', () => this.handleLeave(card));
        });
    }

    handleHover(card) {
        card.style.transform = 'translateY(-10px) scale(1.02)';
        
        // Add subtle rotation to icon
        const icon = card.querySelector('.project-icon i');
        if (icon) {
            icon.style.transform = 'rotate(10deg) scale(1.1)';
        }
    }

    handleLeave(card) {
        card.style.transform = 'translateY(0) scale(1)';
        
        // Reset icon rotation
        const icon = card.querySelector('.project-icon i');
        if (icon) {
            icon.style.transform = 'rotate(0deg) scale(1)';
        }
    }
}

// Contact form functionality (if needed in future)
class ContactForm {
    constructor() {
        this.form = document.getElementById('contact-form');
        this.init();
    }

    init() {
        if (this.form) {
            this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        }
    }

    handleSubmit(e) {
        e.preventDefault();
        // Add form submission logic here
        console.log('Form submitted');
    }
}

// Performance optimizations
class PerformanceOptimizer {
    constructor() {
        this.init();
    }

    init() {
        // Lazy load images
        this.setupLazyLoading();
        
        // Debounce scroll events
        this.setupScrollDebouncing();
        
        // Preload critical resources
        this.preloadResources();
    }

    setupLazyLoading() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        observer.unobserve(img);
                    }
                });
            });

            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }
    }

    setupScrollDebouncing() {
        let ticking = false;
        
        const updateScrollEffects = () => {
            // All scroll-related animations happen here
            ticking = false;
        };

        const handleScroll = () => {
            if (!ticking) {
                requestAnimationFrame(updateScrollEffects);
                ticking = true;
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
    }

    preloadResources() {
        // Preload critical CSS
        const criticalStyles = [
            'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap',
            'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css'
        ];

        criticalStyles.forEach(href => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'style';
            link.href = href;
            document.head.appendChild(link);
        });
    }
}

// Theme switcher (for future enhancement)
class ThemeSwitcher {
    constructor() {
        this.currentTheme = localStorage.getItem('theme') || 'light';
        this.init();
    }

    init() {
        // Apply saved theme
        document.documentElement.setAttribute('data-theme', this.currentTheme);
        
        // Add theme switcher button (if exists)
        const themeSwitcher = document.getElementById('theme-switcher');
        if (themeSwitcher) {
            themeSwitcher.addEventListener('click', () => this.toggleTheme());
        }
    }

    toggleTheme() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', this.currentTheme);
        localStorage.setItem('theme', this.currentTheme);
    }
}

// Cookie consent (for GDPR compliance)
class CookieConsent {
    constructor() {
        this.consentKey = 'cookie-consent';
        this.init();
    }

    init() {
        if (!localStorage.getItem(this.consentKey)) {
            this.showConsentBanner();
        }
    }

    showConsentBanner() {
        // Add cookie consent banner to page
        const banner = document.createElement('div');
        banner.className = 'cookie-consent';
        banner.innerHTML = `
            <div class="cookie-content">
                <p>Этот сайт использует куки для улучшения пользовательского опыта.</p>
                <button class="cookie-accept">Принять</button>
            </div>
        `;
        
        document.body.appendChild(banner);
        
        // Handle accept button
        banner.querySelector('.cookie-accept').addEventListener('click', () => {
            localStorage.setItem(this.consentKey, 'accepted');
            banner.remove();
        });
    }
}

// Initialize all components when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Core functionality
    new Navigation();
    new SkillsAnimation();
    new TypingEffect();
    new CounterAnimation();
    new TimelineAnimation();
    new ProjectCards();
    new ContactForm();
    
    // Performance optimizations
    new PerformanceOptimizer();
    
    // Additional features
    new ThemeSwitcher();
    new CookieConsent();
    
    // Add loading complete class to body
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 100);
});

// Handle page visibility change
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        // Page is hidden - pause animations
        document.body.classList.add('page-hidden');
    } else {
        // Page is visible - resume animations
        document.body.classList.remove('page-hidden');
    }
});

// Handle resize events
let resizeTimeout;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        // Recalculate layouts after resize
        AOS.refresh();
    }, 250);
});

// Service Worker registration (for PWA features)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('ServiceWorker registration successful');
            })
            .catch(function(err) {
                console.log('ServiceWorker registration failed');
            });
    });
}

// Add scroll-to-top functionality
function addScrollToTop() {
    const scrollBtn = document.createElement('button');
    scrollBtn.className = 'scroll-to-top';
    scrollBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
    scrollBtn.setAttribute('aria-label', 'Scroll to top');
    
    document.body.appendChild(scrollBtn);
    
    // Show/hide button based on scroll position
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollBtn.classList.add('visible');
        } else {
            scrollBtn.classList.remove('visible');
        }
    });
    
    // Handle click
    scrollBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Initialize scroll-to-top button
document.addEventListener('DOMContentLoaded', addScrollToTop);

// Analytics tracking (placeholder for future implementation)
function trackEvent(eventName, properties = {}) {
    // Placeholder for analytics tracking
    console.log('Event tracked:', eventName, properties);
}

// Track important user interactions
document.addEventListener('DOMContentLoaded', function() {
    // Track contact button clicks
    document.querySelectorAll('a[href^="mailto:"], a[href^="tel:"], a[href^="https://t.me/"]').forEach(link => {
        link.addEventListener('click', (e) => {
            const type = e.target.href.includes('mailto:') ? 'email' : 
                        e.target.href.includes('tel:') ? 'phone' : 'telegram';
            trackEvent('contact_click', { type });
        });
    });
    
    // Track section views
    const sections = document.querySelectorAll('section[id]');
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                trackEvent('section_view', { section: entry.target.id });
            }
        });
    }, { threshold: 0.5 });
    
    sections.forEach(section => sectionObserver.observe(section));
});

// Error handling
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
    // In production, you might want to send errors to an error tracking service
});

// Unhandled promise rejection handling
window.addEventListener('unhandledrejection', function(e) {
    console.error('Unhandled promise rejection:', e.reason);
    e.preventDefault();
});

// Export for testing purposes
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        Navigation,
        SkillsAnimation,
        TypingEffect,
        CounterAnimation,
        TimelineAnimation,
        ProjectCards,
        PerformanceOptimizer,
        ThemeSwitcher
    };
}