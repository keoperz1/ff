// Free Fire Portfolio Application - React-style Component Management
class FreeFireApp {
    constructor() {
        this.currentSection = 'home';
        this.isMobileMenuOpen = false;
        this.init();
    }

    init() {
        // Initialize components
        this.setupLoadingScreen();
        this.setupNavigation();
        this.setupAnimations();
        this.setupEventListeners();
        this.setupStatsCounter();
        this.setupLiveUpdates();
        
        // Show app after loading
        setTimeout(() => {
            this.showApp();
        }, 2000);
    }

    setupLoadingScreen() {
        const loadingScreen = document.getElementById('loadingScreen');
        const progressBar = document.querySelector('.progress-bar');
        
        // Simulate loading progress
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 20;
            if (progress > 100) {
                progress = 100;
                clearInterval(interval);
            }
            progressBar.style.width = `${progress}%`;
        }, 100);
    }

    showApp() {
        const loadingScreen = document.getElementById('loadingScreen');
        const appContainer = document.getElementById('appContainer');
        
        // Hide loading screen
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
            appContainer.style.opacity = '1';
            
            // Trigger initial animations
            this.triggerAnimations('home');
        }, 500);
    }

    setupNavigation() {
        // Mobile menu toggle
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        const navLinks = document.getElementById('navLinks');
        
        mobileMenuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleMobileMenu();
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (this.isMobileMenuOpen && !navLinks.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                this.closeMobileMenu();
            }
        });

        // Handle section navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const sectionId = link.getAttribute('href').substring(1);
                this.showSection(sectionId);
                this.closeMobileMenu();
            });
        });

        // Footer links
        document.querySelectorAll('.footer-links a').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const sectionId = link.getAttribute('href').substring(1);
                this.showSection(sectionId);
            });
        });
    }

    toggleMobileMenu() {
        const navLinks = document.getElementById('navLinks');
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        
        this.isMobileMenuOpen = !this.isMobileMenuOpen;
        
        if (this.isMobileMenuOpen) {
            navLinks.classList.add('active');
            mobileMenuBtn.innerHTML = '<i class="fas fa-times"></i>';
            document.body.style.overflow = 'hidden';
        } else {
            this.closeMobileMenu();
        }
    }

    closeMobileMenu() {
        const navLinks = document.getElementById('navLinks');
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        
        this.isMobileMenuOpen = false;
        navLinks.classList.remove('active');
        mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
        document.body.style.overflow = '';
    }

    showSection(sectionId) {
        // Hide all sections
        document.querySelectorAll('.section').forEach(section => {
            section.classList.remove('active');
        });

        // Update active nav link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${sectionId}`) {
                link.classList.add('active');
            }
        });

        // Show selected section
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.add('active');
            
            // Scroll to top
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });

            // Trigger animations for the section
            this.triggerAnimations(sectionId);
        }

        this.currentSection = sectionId;
    }

    triggerAnimations(sectionId) {
        // Remove animation classes
        const animatedElements = document.querySelectorAll('.animate-slide-up, .animate-card-in, .animate-zoom-in');
        animatedElements.forEach(el => {
            el.classList.remove('animate-slide-up', 'animate-card-in', 'animate-zoom-in');
        });

        // Re-add animation classes after a delay
        setTimeout(() => {
            const elements = document.querySelectorAll(`#${sectionId} [class*="animate-"]`);
            elements.forEach(el => {
                const classes = el.className.split(' ');
                classes.forEach(className => {
                    if (className.startsWith('animate-')) {
                        el.classList.remove(className);
                        void el.offsetWidth; // Trigger reflow
                        el.classList.add(className);
                    }
                });
            });
        }, 100);
    }

    setupAnimations() {
        // Intersection Observer for scroll animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    
                    // Add animation based on class
                    if (element.classList.contains('animate-on-scroll')) {
                        element.classList.add('animate-slide-up');
                    }
                    
                    // Remove observer after animation
                    observer.unobserve(element);
                }
            });
        }, observerOptions);

        // Observe elements
        document.querySelectorAll('.animate-on-scroll').forEach(el => {
            observer.observe(el);
        });
    }

    setupStatsCounter() {
        const statValues = document.querySelectorAll('.stat-value[data-target]');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    const targetValue = parseFloat(element.getAttribute('data-target'));
                    this.animateCounter(element, targetValue);
                    observer.unobserve(element);
                }
            });
        }, { threshold: 0.5 });

        statValues.forEach(stat => observer.observe(stat));

        // Animate progress bars
        const progressBars = document.querySelectorAll('.stat-bar[data-width]');
        progressBars.forEach(bar => {
            const width = bar.getAttribute('data-width');
            setTimeout(() => {
                bar.style.width = `${width}%`;
            }, 500);
        });
    }

    animateCounter(element, targetValue) {
        let currentValue = 0;
        const increment = targetValue / 50; // 50 frames
        const isInteger = Number.isInteger(targetValue);
        
        const updateCounter = () => {
            currentValue += increment;
            
            if (currentValue >= targetValue) {
                currentValue = targetValue;
                element.textContent = isInteger ? Math.round(currentValue) : currentValue.toFixed(2);
                return;
            }
            
            element.textContent = isInteger ? Math.round(currentValue) : currentValue.toFixed(2);
            requestAnimationFrame(updateCounter);
        };
        
        requestAnimationFrame(updateCounter);
    }

    setupLiveUpdates() {
        // Update online status
        setInterval(() => {
            const statusElement = document.querySelector('.stat-value.online');
            if (statusElement) {
                const statuses = ['Playing Now', 'In Lobby', 'Streaming', 'In Match'];
                const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
                statusElement.textContent = randomStatus;
            }
        }, 10000);

        // Update squad status
        setInterval(() => {
            const squadElement = document.querySelector('.live-stat-card:nth-child(3) .stat-value');
            if (squadElement) {
                const onlineMembers = Math.floor(Math.random() * 4) + 1;
                squadElement.textContent = `${onlineMembers}/4 Online`;
                
                // Update member status dots
                document.querySelectorAll('.member-status').forEach((dot, index) => {
                    if (index < onlineMembers) {
                        dot.classList.remove('idle', 'offline');
                        dot.classList.add('online');
                    } else {
                        dot.classList.remove('online');
                        dot.classList.add('idle');
                    }
                });
            }
        }, 15000);

        // Update win streak
        setInterval(() => {
            const streakElement = document.querySelector('.live-stat-card:nth-child(2) .stat-value');
            if (streakElement) {
                const currentStreak = parseInt(streakElement.textContent);
                const change = Math.random() > 0.7 ? 1 : 0;
                streakElement.textContent = currentStreak + change;
            }
        }, 30000);
    }

    setupEventListeners() {
        // Back to top button
        const backToTopBtn = document.getElementById('backToTop');
        
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        });

        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });

        // Contact form
        const contactForm = document.getElementById('contactForm');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                
                // Get form data
                const formData = new FormData(contactForm);
                const data = Object.fromEntries(formData);
                
                // Simulate form submission
                const submitBtn = contactForm.querySelector('button[type="submit"]');
                const originalText = submitBtn.innerHTML;
                
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
                submitBtn.disabled = true;
                
                setTimeout(() => {
                    // Show success message
                    alert('Message sent successfully! I\'ll get back to you soon.');
                    
                    // Reset form
                    contactForm.reset();
                    
                    // Reset button
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                }, 1500);
            });
        }

        // Hero action buttons
        document.querySelectorAll('.hero-actions button').forEach(button => {
            button.addEventListener('click', () => {
                button.classList.add('clicked');
                setTimeout(() => {
                    button.classList.remove('clicked');
                }, 300);
            });
        });

        // Social card clicks
        document.querySelectorAll('.social-card').forEach(card => {
            card.addEventListener('click', (e) => {
                e.preventDefault();
                card.classList.add('pulse');
                setTimeout(() => {
                    card.classList.remove('pulse');
                }, 300);
                
                // In a real app, this would navigate to the social link
                console.log('Navigating to:', card.querySelector('span').textContent);
            });
        });

        // Gallery item clicks
        document.querySelectorAll('.gallery-item').forEach(item => {
            item.addEventListener('click', () => {
                const overlay = item.querySelector('.gallery-overlay');
                overlay.style.transform = 'translateY(0)';
                
                setTimeout(() => {
                    overlay.style.transform = 'translateY(100%)';
                }, 3000);
            });
        });

        // Prevent zoom on double tap (mobile)
        let lastTouchEnd = 0;
        document.addEventListener('touchend', (e) => {
            const now = Date.now();
            if (now - lastTouchEnd <= 300) {
                e.preventDefault();
            }
            lastTouchEnd = now;
        });

        // Handle orientation change
        window.addEventListener('orientationchange', () => {
            this.closeMobileMenu();
            
            // Re-trigger animations on orientation change
            setTimeout(() => {
                this.triggerAnimations(this.currentSection);
            }, 300);
        });
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Create global functions for HTML onclick handlers
    window.showSection = (sectionId) => {
        if (!window.app) window.app = new FreeFireApp();
        window.app.showSection(sectionId);
        return false;
    };

    window.toggleMobileMenu = () => {
        if (!window.app) window.app = new FreeFireApp();
        window.app.toggleMobileMenu();
        return false;
    };

    // Initialize the app
    window.app = new FreeFireApp();
});

// Performance optimizations
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // In a real app, you would register a service worker here
        console.log('Service Worker would be registered in production');
    });
}

// Handle offline/online status
window.addEventListener('online', () => {
    document.body.classList.remove('offline');
    console.log('Back online!');
});

window.addEventListener('offline', () => {
    document.body.classList.add('offline');
    console.log('You are offline. Some features may not work.');
});