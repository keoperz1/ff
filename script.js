// Free Fire Portfolio Application - Fixed Version
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

        // Social card clicks - FIXED VERSION
        document.querySelectorAll('.social-card').forEach(card => {
            card.addEventListener('click', (e) => {
                // Only prevent default for gamepad cards (UID copy)
                if (card.classList.contains('game')) {
                    e.preventDefault();
                    
                    // Copy UID function
                    this.copyUID();
                    
                    // Animation
                    card.classList.add('pulse');
                    setTimeout(() => {
                        card.classList.remove('pulse');
                    }, 300);
                }
                // For other social cards, let them open normally
            });
        });

        // Social links in squad section
        document.querySelectorAll('.member-social .social-link').forEach(link => {
            link.addEventListener('click', (e) => {
                // Only add animation, don't prevent default
                link.classList.add('pulse');
                setTimeout(() => {
                    link.classList.remove('pulse');
                }, 300);
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

        // View profile buttons in squad section
        document.querySelectorAll('.view-profile-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Animation
                btn.classList.add('clicked');
                setTimeout(() => {
                    btn.classList.remove('clicked');
                }, 300);
                
                // Show profile modal or redirect
                const memberName = btn.closest('.squad-member-card').querySelector('.member-name').textContent;
                alert(`Opening ${memberName}'s profile...`);
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

    // Copy UID function
    copyUID() {
        const uid = "1234567890";
        
        // Use modern clipboard API
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(uid).then(() => {
                this.showNotification(`UID ${uid} copied to clipboard!`);
            }).catch(err => {
                // Fallback method
                this.copyUIDFallback(uid);
            });
        } else {
            // Fallback for older browsers
            this.copyUIDFallback(uid);
        }
    }

    copyUIDFallback(uid) {
        const textArea = document.createElement('textarea');
        textArea.value = uid;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
            document.execCommand('copy');
            this.showNotification(`UID ${uid} copied to clipboard!`);
        } catch (err) {
            alert(`Please copy this UID manually: ${uid}`);
        } finally {
            textArea.remove();
        }
    }

    showNotification(message) {
        // Remove any existing notification
        const existingNotification = document.querySelector('.uid-notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'uid-notification';
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: linear-gradient(45deg, #ff0000, #ff6600);
            color: white;
            padding: 15px 25px;
            border-radius: 10px;
            z-index: 9999;
            font-family: 'Oxanium', sans-serif;
            font-weight: bold;
            box-shadow: 0 5px 20px rgba(255,0,0,0.5);
            animation: slideInRight 0.3s ease-out;
            border: 2px solid #ff0000;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }, 3000);
    }

    // New method to fix squad card layout issues
    fixSquadCardLayout() {
        // Add CSS for better spacing and overflow handling
        const style = document.createElement('style');
        style.textContent = `
            .member-name {
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                max-width: 200px;
                display: block;
            }
            
            .member-role {
                margin-top: 10px !important;
                display: block;
            }
            
            @media (max-width: 768px) {
                .member-name {
                    white-space: normal;
                    overflow: visible;
                    text-overflow: clip;
                    max-width: 100%;
                }
            }
        `;
        document.head.appendChild(style);
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

    window.copyUID = () => {
        if (!window.app) window.app = new FreeFireApp();
        window.app.copyUID();
        return false;
    };

    // Initialize the app
    window.app = new FreeFireApp();
    
    // Fix squad card layout
    setTimeout(() => {
        window.app.fixSquadCardLayout();
    }, 1000);
});

// Add CSS animations for notifications
document.addEventListener('DOMContentLoaded', () => {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes slideOutRight {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
        
        .clicked {
            animation: clickEffect 0.3s ease;
        }
        
        @keyframes clickEffect {
            0% { transform: scale(1); }
            50% { transform: scale(0.95); }
            100% { transform: scale(1); }
        }
        
        .pulse {
            animation: pulseEffect 0.3s ease;
        }
        
        @keyframes pulseEffect {
            0% { transform: scale(1); }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); }
        }
        
        /* Fix for social links */
        .social-card {
            cursor: pointer;
            position: relative;
            z-index: 1;
        }
        
        .social-card:hover {
            transform: translateY(-10px) !important;
        }
        
        /* Fix spacing between rank and role in squad cards */
        .member-rank {
            margin-bottom: 8px !important;
            display: inline-block !important;
        }
        
        .member-role {
            margin-top: 8px !important;
            display: block !important;
        }
    `;
    document.head.appendChild(style);
});

// Performance optimizations
if ('serviceWorker' in navigator && window.location.protocol === 'https:') {
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

// Error handling
window.addEventListener('error', (e) => {
    console.error('Application error:', e.error);
});

// Page visibility API
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        console.log('Page is hidden');
    } else {
        console.log('Page is visible');
    }
});
