// Enhanced Theme Management
class ThemeManager {
    constructor() {
        this.themeToggle = document.getElementById('themeToggle');
        this.themeIcon = document.getElementById('themeIcon');
        this.currentTheme = localStorage.getItem('theme') || 'light';
        
        this.init();
    }
    
    init() {
        console.log('ThemeManager initializing...'); // Debug log
        console.log('Current theme:', this.currentTheme); // Debug log
        console.log('Theme toggle element:', this.themeToggle); // Debug log
        
        // Set initial theme
        this.setTheme(this.currentTheme);
        
        // Add event listeners
        if (this.themeToggle) {
            this.themeToggle.addEventListener('click', (e) => {
                console.log('Theme toggle clicked!'); // Debug log
                e.preventDefault();
                e.stopPropagation();
                // Toggle between day and night mode on click
                this.toggleTheme();
                this.createThemeRipple();
            });
        } else {
            console.error('Theme toggle button not found!');
        }
        
        // Listen for system theme changes
        this.initSystemThemeDetection();
        
        // Add smooth transitions to all elements
        this.addTransitions();
        
        // Initialize theme-aware components
        this.initThemeAwareComponents();
        
        console.log('ThemeManager initialized successfully'); // Debug log
    }
    
    initSystemThemeDetection() {
        if (window.matchMedia) {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            
            // Set initial theme based on system preference if no user preference
            if (!localStorage.getItem('theme')) {
                this.setTheme(mediaQuery.matches ? 'dark' : 'light');
            }
            
            // Listen for system theme changes
            mediaQuery.addListener((e) => {
                if (!localStorage.getItem('theme')) {
                    this.setTheme(e.matches ? 'dark' : 'light');
                }
            });
        }
    }
    
    initThemeAwareComponents() {
        // Update components that need theme awareness
        this.updateThemeAwareComponents();
        
        // Listen for theme changes
        document.addEventListener('themeChanged', () => {
            this.updateThemeAwareComponents();
        });
    }
    
    updateThemeAwareComponents() {
        // Update any components that need theme-specific behavior
        const isDark = this.currentTheme === 'dark';
        
        // Update scrollbar colors
        this.updateScrollbarColors(isDark);
        
        // Update any other theme-dependent components
        this.updateChartColors(isDark);
    }
    
    updateScrollbarColors(isDark) {
        const style = document.createElement('style');
        style.id = 'theme-scrollbar';
        style.textContent = `
            ::-webkit-scrollbar {
                width: 8px;
            }
            ::-webkit-scrollbar-track {
                background: ${isDark ? '#1f2937' : '#f3f4f6'};
            }
            ::-webkit-scrollbar-thumb {
                background: ${isDark ? '#4b5563' : '#d1d5db'};
                border-radius: 4px;
            }
            ::-webkit-scrollbar-thumb:hover {
                background: ${isDark ? '#6b7280' : '#9ca3af'};
            }
        `;
        
        // Remove existing scrollbar styles
        const existingStyle = document.getElementById('theme-scrollbar');
        if (existingStyle) {
            existingStyle.remove();
        }
        
        document.head.appendChild(style);
    }
    
    updateChartColors(isDark) {
        // Update any chart colors if charts are present
        const charts = document.querySelectorAll('.chart, .chart-container');
        charts.forEach(chart => {
            if (isDark) {
                chart.style.setProperty('--chart-bg', '#1f2937');
                chart.style.setProperty('--chart-text', '#d1d5db');
            } else {
                chart.style.setProperty('--chart-bg', '#ffffff');
                chart.style.setProperty('--chart-text', '#374151');
            }
        });
    }
    
    setTheme(theme) {
        console.log('Setting theme to:', theme); // Debug log
        
        // Add theme switch animation
        document.body.classList.add('theme-switch-animation');
        
        // Set theme with smooth transition
        document.documentElement.setAttribute('data-theme', theme);
        this.currentTheme = theme;
        localStorage.setItem('theme', theme);
        
        // Force apply theme styles
        this.applyThemeStyles(theme);
        
        // Update icon with smooth transition
        if (this.themeIcon) {
            if (theme === 'dark') {
                this.themeIcon.className = 'fas fa-moon';
            } else {
                this.themeIcon.className = 'fas fa-sun';
            }
        }
        
        // Update header background for scroll effect
        this.updateHeaderBackground();
        
        // Update meta theme color for mobile browsers
        this.updateMetaThemeColor(theme);
        
        // Trigger custom event for other components
        document.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme } }));
        
        // Remove animation class after transition
        setTimeout(() => {
            document.body.classList.remove('theme-switch-animation');
        }, 500);
    }
    
    applyThemeStyles(theme) {
        // Force apply theme-specific styles
        const root = document.documentElement;
        
        if (theme === 'dark') {
            root.style.setProperty('--bg-primary', '#111827');
            root.style.setProperty('--bg-secondary', '#1f2937');
            root.style.setProperty('--text-primary', '#f9fafb');
            root.style.setProperty('--text-secondary', '#d1d5db');
            root.style.setProperty('--border-color', '#374151');
            root.style.setProperty('--bg-card', '#1f2937');
            root.style.backgroundColor = '#111827';
            root.style.color = '#f9fafb';
        } else {
            root.style.setProperty('--bg-primary', '#ffffff');
            root.style.setProperty('--bg-secondary', '#f9fafb');
            root.style.setProperty('--text-primary', '#111827');
            root.style.setProperty('--text-secondary', '#374151');
            root.style.setProperty('--border-color', '#e5e7eb');
            root.style.setProperty('--bg-card', '#ffffff');
            root.style.backgroundColor = '#ffffff';
            root.style.color = '#111827';
        }
    }
    
    updateMetaThemeColor(theme) {
        let metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (!metaThemeColor) {
            metaThemeColor = document.createElement('meta');
            metaThemeColor.name = 'theme-color';
            document.head.appendChild(metaThemeColor);
        }
        
        if (theme === 'dark') {
            metaThemeColor.content = '#111827';
        } else {
            metaThemeColor.content = '#ffffff';
        }
    }
    
    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        console.log('Toggling theme from', this.currentTheme, 'to', newTheme); // Debug log
        
        // Add switching animation class
        if (this.themeToggle) {
            this.themeToggle.classList.add('switching');
            this.themeToggle.classList.add('loading');
        }
        
        // Create ripple effect
        this.createThemeRipple();
        
        // Add page transition effect
        document.body.style.transition = 'all 0.3s ease';
        
        // Set theme after a brief delay for animation
        setTimeout(() => {
            this.setTheme(newTheme);
            
            // Remove animation classes
            if (this.themeToggle) {
                this.themeToggle.classList.remove('switching');
                this.themeToggle.classList.remove('loading');
            }
            
            // Show theme change notification
            this.showThemeChangeNotification(newTheme);
            
            // Add visual test indicator
            this.addThemeTestIndicator(newTheme);
        }, 300);
    }
    
    addThemeTestIndicator(theme) {
        // Create a temporary indicator to show theme change
        const indicator = document.createElement('div');
        indicator.style.cssText = `
            position: fixed;
            top: 10px;
            left: 10px;
            background: ${theme === 'dark' ? '#1f2937' : '#ffffff'};
            color: ${theme === 'dark' ? '#ffffff' : '#000000'};
            padding: 10px;
            border-radius: 5px;
            z-index: 10000;
            font-size: 12px;
            border: 1px solid ${theme === 'dark' ? '#374151' : '#e5e7eb'};
        `;
        indicator.textContent = `Theme: ${theme.toUpperCase()}`;
        
        document.body.appendChild(indicator);
        
        // Remove after 2 seconds
        setTimeout(() => {
            if (indicator.parentNode) {
                indicator.parentNode.removeChild(indicator);
            }
        }, 2000);
    }
    
    forceDayMode() {
        // Add switching animation class
        if (this.themeToggle) {
            this.themeToggle.classList.add('switching');
            this.themeToggle.classList.add('loading');
        }
        
        // Create ripple effect
        this.createThemeRipple();
        
        // Add page transition effect
        document.body.style.transition = 'all 0.3s ease';
        
        // Force set to day mode
        setTimeout(() => {
            this.setTheme('light');
            
            // Remove animation classes
            if (this.themeToggle) {
                this.themeToggle.classList.remove('switching');
                this.themeToggle.classList.remove('loading');
            }
            
            // Show theme change notification
            this.showThemeChangeNotification('light');
        }, 300);
    }
    
    showThemeChangeNotification(theme) {
        const notification = document.createElement('div');
        notification.className = 'theme-notification';
        notification.innerHTML = `
            <i class="fas fa-${theme === 'dark' ? 'moon' : 'sun'}"></i>
            <span>Switched to ${theme === 'dark' ? 'Dark' : 'Light'} Mode</span>
        `;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${theme === 'dark' ? 'rgba(31, 41, 55, 0.95)' : 'rgba(255, 255, 255, 0.95)'};
            color: ${theme === 'dark' ? '#d1d5db' : '#374151'};
            padding: 12px 20px;
            border-radius: 8px;
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
            z-index: 10000;
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 14px;
            font-weight: 500;
            backdrop-filter: blur(10px);
            border: 1px solid ${theme === 'dark' ? 'rgba(55, 65, 81, 0.3)' : 'rgba(229, 231, 235, 0.3)'};
            transform: translateX(100%);
            opacity: 0;
            transition: all 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
            notification.style.opacity = '1';
        }, 100);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            notification.style.opacity = '0';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
    
    addTransitions() {
        const style = document.createElement('style');
        style.textContent = `
            * {
                transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease !important;
            }
        `;
        document.head.appendChild(style);
    }
    
    updateHeaderBackground() {
        const header = document.querySelector('.header');
        if (header) {
            const scrollY = window.scrollY;
            if (scrollY > 100) {
                if (this.currentTheme === 'dark') {
                    header.style.background = 'rgba(17, 24, 39, 0.98)';
                } else {
                    header.style.background = 'rgba(255, 255, 255, 0.98)';
                }
            }
        }
    }
    
    createThemeRipple() {
        if (!this.themeToggle) return;
        
        const rect = this.themeToggle.getBoundingClientRect();
        const ripple = document.createElement('div');
        ripple.className = 'ripple';
        
        ripple.style.cssText = `
            position: absolute;
            top: ${rect.height / 2}px;
            left: ${rect.width / 2}px;
            width: 20px;
            height: 20px;
            background: rgba(255, 255, 255, 0.6);
            border-radius: 50%;
            transform: translate(-50%, -50%) scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
            z-index: 1;
        `;
        
        this.themeToggle.appendChild(ripple);
        
        // Remove ripple element after animation
        setTimeout(() => {
            if (ripple.parentNode) {
                ripple.parentNode.removeChild(ripple);
            }
        }, 600);
    }
}

// Navigation Management
class NavigationManager {
    constructor() {
        this.mobileMenuToggle = document.getElementById('mobileMenuToggle');
        this.mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
        this.navMenu = document.getElementById('navMenu');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.dropdowns = document.querySelectorAll('.nav-dropdown');
        
        this.init();
    }
    
    init() {
        // Mobile menu toggle
        this.mobileMenuToggle?.addEventListener('click', (e) => {
            this.toggleMobileMenu();
            this.createRippleEffect(e);
        });
        this.mobileMenuOverlay?.addEventListener('click', () => this.closeMobileMenu());
        
        // Smooth scrolling for navigation links
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    this.scrollToSection(targetSection);
                    this.closeMobileMenu();
                }
            });
        });
        
        // Dropdown functionality
        this.dropdowns.forEach(dropdown => {
            const toggle = dropdown.querySelector('.dropdown-toggle');
            const menu = dropdown.querySelector('.dropdown-menu');
            
            toggle?.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleDropdown(dropdown, menu);
            });
        });
        
        // Close dropdowns when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.nav-dropdown')) {
                this.closeAllDropdowns();
            }
        });
        
        // Header scroll effect
        this.initHeaderScroll();
    }
    
    toggleMobileMenu() {
        this.mobileMenuToggle.classList.toggle('active');
        this.navMenu.classList.toggle('active');
        this.mobileMenuOverlay.classList.toggle('active');
        document.body.classList.toggle('menu-open');
    }
    
    closeMobileMenu() {
        this.mobileMenuToggle.classList.remove('active');
        this.navMenu.classList.remove('active');
        this.mobileMenuOverlay.classList.remove('active');
        document.body.classList.remove('menu-open');
    }
    
    scrollToSection(section) {
        const headerHeight = document.querySelector('.header').offsetHeight;
        const targetPosition = section.offsetTop - headerHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
        });
    }
    
    toggleDropdown(dropdown, menu) {
        const isOpen = dropdown.classList.contains('open');
        
        // Close all other dropdowns
        this.closeAllDropdowns();
        
        if (!isOpen) {
            dropdown.classList.add('open');
            menu.style.display = 'block';
            setTimeout(() => {
                menu.style.opacity = '1';
                menu.style.transform = 'translateY(0)';
            }, 10);
        }
    }
    
    closeAllDropdowns() {
        this.dropdowns.forEach(dropdown => {
            const menu = dropdown.querySelector('.dropdown-menu');
            dropdown.classList.remove('open');
            if (menu) {
                menu.style.opacity = '0';
                menu.style.transform = 'translateY(-10px)';
                setTimeout(() => {
                    menu.style.display = 'none';
                }, 200);
            }
        });
    }
    
    createRippleEffect(event) {
        const button = event.currentTarget;
        const ripple = document.createElement('div');
        ripple.className = 'button-ripple';
        
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        
        button.appendChild(ripple);
        
        setTimeout(() => {
            if (ripple.parentNode) {
                ripple.parentNode.removeChild(ripple);
            }
        }, 600);
    }
    
    initHeaderScroll() {
        const header = document.querySelector('.header');
        let lastScrollY = window.scrollY;
        
        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;
            
            if (currentScrollY > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
            
            // Hide/show header on scroll
            if (currentScrollY > lastScrollY && currentScrollY > 200) {
                header.classList.add('header-hidden');
            } else {
                header.classList.remove('header-hidden');
            }
            
            lastScrollY = currentScrollY;
        });
    }
}

// Loading Screen Management
class LoadingManager {
    constructor() {
        this.loadingScreen = document.getElementById('loadingScreen');
        this.init();
    }
    
    init() {
        // Start typing animation
        this.startTypingAnimation();
        
        // Hide loading screen after page load
        window.addEventListener('load', () => {
            setTimeout(() => {
                this.hideLoadingScreen();
            }, 4000); // Increased to allow typing animation to complete
        });
        
        // Fallback: hide after 5 seconds
        setTimeout(() => {
            this.hideLoadingScreen();
        }, 5000);
    }
    
    startTypingAnimation() {
        const title = document.getElementById('typingTitle');
        const subtitle = document.getElementById('typingSubtitle');
        
        if (title && subtitle) {
            // Clear text initially
            title.textContent = '';
            subtitle.textContent = '';
            
            // Type the title
            this.typeText(title, 'Codediera EduPro', 100, () => {
                // After title is complete, type the subtitle
                setTimeout(() => {
                    this.typeText(subtitle, 'Professional School Management System', 80);
                }, 500);
            });
        }
    }
    
    typeText(element, text, speed = 100, callback = null) {
        let i = 0;
        element.style.borderRight = '2px solid var(--primary-color)';
        
        const typeWriter = () => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, speed);
            } else {
                // Remove cursor after typing is complete
                setTimeout(() => {
                    element.style.borderRight = 'none';
                    if (callback) callback();
                }, 1000);
            }
        };
        
        typeWriter();
    }
    
    hideLoadingScreen() {
        if (this.loadingScreen) {
            this.loadingScreen.style.opacity = '0';
            this.loadingScreen.style.visibility = 'hidden';
        setTimeout(() => {
                this.loadingScreen.style.display = 'none';
            }, 500);
        }
    }
}

// Scroll Progress Management
class ScrollProgressManager {
    constructor() {
        this.scrollProgress = document.getElementById('scrollProgress');
        this.init();
    }
    
    init() {
        window.addEventListener('scroll', () => {
            this.updateScrollProgress();
        });
    }
    
    updateScrollProgress() {
        const scrollTop = window.pageYOffset;
        const docHeight = document.body.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        
        if (this.scrollProgress) {
            this.scrollProgress.style.width = scrollPercent + '%';
        }
    }
}

// AI Chat Management
class AIChatManager {
    constructor() {
        this.chatToggle = document.getElementById('chat-toggle');
        this.chatWindow = document.getElementById('chat-window');
        this.chatClose = document.getElementById('chat-close');
        this.chatMinimize = document.getElementById('chat-minimize');
        this.chatInput = document.getElementById('chat-input');
        this.sendBtn = document.getElementById('send-btn');
        this.chatMessages = document.getElementById('chat-messages');
        this.typingIndicator = document.getElementById('typing-indicator');
        this.suggestionChips = document.querySelectorAll('.suggestion-chip');
        this.charCount = document.getElementById('char-count');
        
        this.isOpen = false;
        this.isMinimized = false;
        this.hasActiveChat = false; // Track if there's an active conversation
        
        // AI Configuration
        this.apiKey = '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';
        this.apiUrl = 'https://api.groq.com/openai/v1/chat/completions';
        this.model = 'openai/gpt-oss-20b';
        this.conversationHistory = [];
        
        // Rate limiting and status
        this.isProcessing = false;
        this.lastRequestTime = 0;
        this.requestCooldown = 1000; // 1 second between requests
        this.connectionStatus = 'connected'; // connected, disconnected, error
        
        // Create modern chat button
        this.createModernChatButton();
        
        // Ensure button exists after a short delay
        setTimeout(() => {
            if (!document.getElementById('aiChatToggle')) {
                console.log('Button not found, recreating...');
                this.createModernChatButton();
            }
        }, 100);
        
        this.init();
    }
    
    init() {
        // Chat controls (modern button is handled in createModernChatButton)
        this.chatClose?.addEventListener('click', (e) => {
            this.closeChat();
            this.createRippleEffect(e);
        });
        this.chatMinimize?.addEventListener('click', (e) => {
            this.minimizeChat();
            this.createRippleEffect(e);
        });
        
        // Input handling
        this.chatInput?.addEventListener('input', (e) => {
            this.handleInput(e.target.value);
        });
        
        this.chatInput?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });
        
        this.sendBtn?.addEventListener('click', () => this.sendMessage());
        
        // Suggestion chips
        this.suggestionChips.forEach(chip => {
            chip.addEventListener('click', () => {
                const message = chip.getAttribute('data-message');
                this.sendSuggestionMessage(message);
            });
        });
        
        // Auto-hide notification after 5 seconds
            setTimeout(() => {
            const notification = document.getElementById('chat-notification');
            if (notification) {
                notification.style.display = 'none';
            }
        }, 5000);
        
        // Add scroll event listener for smart scrolling
        this.chatMessages?.addEventListener('scroll', () => {
            this.handleScroll();
        });
        
        // Test AI connection
        this.testAIConnection();
    }
    
    handleScroll() {
        // Show/hide scroll to bottom button based on scroll position
        const scrollToBottomBtn = document.querySelector('.scroll-to-bottom-btn');
        if (scrollToBottomBtn) {
            if (this.isNearBottom()) {
                scrollToBottomBtn.style.opacity = '0';
                scrollToBottomBtn.style.pointerEvents = 'none';
            } else {
                scrollToBottomBtn.style.opacity = '1';
                scrollToBottomBtn.style.pointerEvents = 'auto';
            }
        }
    }
    
    createModernChatButton() {
        // Remove any existing modern chat button
        const existingButton = document.getElementById('aiChatToggle');
        if (existingButton) {
            existingButton.remove();
        }
        
        // Remove old chat toggle if it exists
        if (this.chatToggle && this.chatToggle.parentNode) {
            this.chatToggle.remove();
        }
        
        // Create new modern chat button
        const modernButton = document.createElement('button');
        modernButton.className = 'ai-chat-toggle';
        modernButton.id = 'aiChatToggle';
        modernButton.type = 'button'; // Ensure it's a button
        modernButton.innerHTML = `
            <svg class="icon" viewBox="0 0 24 24">
                <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4l4 4 4-4h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
            </svg>
            <svg class="close-icon" viewBox="0 0 24 24">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
            <div class="chat-indicator" id="chatIndicator">1</div>
        `;
        
        // Add tooltip
        modernButton.setAttribute('title', 'Have any questions?');
        
        // Create custom tooltip element
        const tooltip = document.createElement('div');
        tooltip.className = 'chat-tooltip';
        tooltip.textContent = 'Have any questions?';
        modernButton.appendChild(tooltip);
        
        // Add to body
        document.body.appendChild(modernButton);
        
        // Store reference
        this.modernChatToggle = modernButton;
        this.chatIndicator = document.getElementById('chatIndicator');
        
        // Add click event with ripple effect
        modernButton.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('Chat button clicked!'); // Debug log
            this.createRippleEffect(e);
            this.toggleChat();
        });
        
        // Also add mousedown for better touch support
        modernButton.addEventListener('mousedown', (e) => {
            e.preventDefault();
        });
        
        console.log('Modern chat button created and added to DOM'); // Debug log
    }
    
    createRippleEffect(event) {
        const button = event.currentTarget;
        const ripple = document.createElement('span');
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.className = 'ripple';
        
        button.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }
    
    updateChatIndicator() {
        if (this.chatIndicator) {
            if (this.hasActiveChat && !this.isOpen) {
                this.chatIndicator.classList.add('active', 'pulse');
            } else {
                this.chatIndicator.classList.remove('active', 'pulse');
            }
        }
    }
    
    updateButtonState() {
        if (this.modernChatToggle) {
            if (this.isOpen) {
                this.modernChatToggle.classList.add('chat-open');
            } else {
                this.modernChatToggle.classList.remove('chat-open');
            }
        }
    }

    async testAIConnection() {
        try {
            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: this.model,
                    messages: [{ role: 'user', content: 'Hello' }],
                    max_tokens: 10
                })
            });
            
            if (response.ok) {
                this.connectionStatus = 'connected';
                console.log('AI connection test successful');
            } else {
                this.connectionStatus = 'error';
                console.log('AI connection test failed:', response.status);
            }
        } catch (error) {
            this.connectionStatus = 'disconnected';
            console.log('AI connection test error:', error);
        }
        
        this.updateConnectionStatus();
    }
    
    toggleChat() {
        console.log('toggleChat called, isOpen:', this.isOpen); // Debug log
        if (this.isOpen) {
            this.closeChat();
        } else {
            this.openChat();
        }
        this.updateButtonState();
    }
    
    openChat() {
        this.isOpen = true;
        this.chatWindow.style.display = 'block';
        this.chatWindow.classList.add('slide-up');
        
        // Create scroll to bottom button if it doesn't exist
        this.createScrollToBottomButton();
            
            setTimeout(() => {
            this.chatWindow.classList.remove('slide-up');
            this.chatWindow.classList.add('slide-in');
            this.chatWindow.style.opacity = '1';
            this.chatWindow.style.transform = 'translateY(0)';
        }, 10);
        
        this.chatInput?.focus();
        this.updateChatIndicator();
    }
    
    createScrollToBottomButton() {
        // Remove existing button if any
        const existingBtn = document.querySelector('.scroll-to-bottom-btn');
        if (existingBtn) {
            existingBtn.remove();
        }
        
        // Create new scroll to bottom button
        const scrollBtn = document.createElement('button');
        scrollBtn.className = 'scroll-to-bottom-btn';
        scrollBtn.innerHTML = '<i class="fas fa-chevron-down"></i>';
        scrollBtn.title = 'Scroll to bottom';
        scrollBtn.addEventListener('click', () => {
            this.scrollToBottom();
        });
        
        // Add button to chat messages container
        if (this.chatMessages) {
            this.chatMessages.appendChild(scrollBtn);
        }
    }
    
    closeChat() {
        this.isOpen = false;
        this.chatWindow.classList.remove('slide-in');
        this.chatWindow.classList.add('slide-up');
        this.chatWindow.style.opacity = '0';
        this.chatWindow.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            this.chatWindow.style.display = 'none';
            this.chatWindow.classList.remove('slide-up');
        }, 300);
        this.updateChatIndicator();
    }
    
    createRippleEffect(event) {
        const button = event.currentTarget;
        const ripple = document.createElement('div');
        ripple.className = 'button-ripple';
        
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        
        button.appendChild(ripple);
        
        setTimeout(() => {
            if (ripple.parentNode) {
                ripple.parentNode.removeChild(ripple);
            }
        }, 600);
    }
    
    minimizeChat() {
        this.isMinimized = !this.isMinimized;
        if (this.isMinimized) {
            this.chatWindow.style.height = '60px';
            this.chatWindow.style.overflow = 'hidden';
        } else {
            this.chatWindow.style.height = '500px';
            this.chatWindow.style.overflow = 'auto';
        }
    }
    
    handleInput(value) {
        const isValid = value.trim().length > 0;
        this.sendBtn.disabled = !isValid;
        
        if (this.charCount) {
            this.charCount.textContent = value.length;
        }
    }
    
    async sendMessage() {
        const message = this.chatInput.value.trim();
        if (!message) return;
        
        // Mark as active chat
        this.hasActiveChat = true;
        this.updateChatIndicator();
        
        // Check rate limiting
        const now = Date.now();
        if (now - this.lastRequestTime < this.requestCooldown) {
            this.addAIResponse('Please wait a moment before sending another message.');
            return;
        }
        
        // Check if already processing
        if (this.isProcessing) {
            this.addAIResponse('I\'m still processing your previous message. Please wait.');
            return;
        }
        
        this.isProcessing = true;
        this.lastRequestTime = now;
        
        this.addUserMessage(message);
        this.chatInput.value = '';
        this.handleInput('');
        
        // Show typing indicator
        this.showTypingIndicator();
        
        try {
            // Get AI response
            const response = await this.getAIResponse(message);
            this.hideTypingIndicator();
            this.addAIResponse(response);
            this.connectionStatus = 'connected';
            this.updateConnectionStatus();
        } catch (error) {
            this.hideTypingIndicator();
            this.connectionStatus = 'error';
            this.updateConnectionStatus();
            
            let errorMessage = 'I apologize, but I\'m having trouble connecting to my AI service right now. Please try again in a moment or contact our support team for assistance.';
            
            if (error.message.includes('401')) {
                errorMessage = 'Authentication error. Please contact support.';
            } else if (error.message.includes('429')) {
                errorMessage = 'Too many requests. Please wait a moment before trying again.';
            } else if (error.message.includes('500')) {
                errorMessage = 'Server error. Please try again in a few moments.';
            }
            
            this.addAIResponse(errorMessage);
            console.error('AI API Error:', error);
        } finally {
            this.isProcessing = false;
        }
    }
    
    async sendSuggestionMessage(message) {
        // Mark as active chat
        this.hasActiveChat = true;
        this.updateChatIndicator();
        
        // Check rate limiting
        const now = Date.now();
        if (now - this.lastRequestTime < this.requestCooldown) {
            this.addAIResponse('Please wait a moment before sending another message.');
            return;
        }
        
        // Check if already processing
        if (this.isProcessing) {
            this.addAIResponse('I\'m still processing your previous message. Please wait.');
            return;
        }
        
        this.isProcessing = true;
        this.lastRequestTime = now;
        
        this.addUserMessage(message);
        this.showTypingIndicator();
        
        try {
            const response = await this.getAIResponse(message);
            this.hideTypingIndicator();
            this.addAIResponse(response);
            this.connectionStatus = 'connected';
            this.updateConnectionStatus();
        } catch (error) {
            this.hideTypingIndicator();
            this.connectionStatus = 'error';
            this.updateConnectionStatus();
            
            let errorMessage = 'I apologize, but I\'m having trouble connecting to my AI service right now. Please try again in a moment.';
            
            if (error.message.includes('401')) {
                errorMessage = 'Authentication error. Please contact support.';
            } else if (error.message.includes('429')) {
                errorMessage = 'Too many requests. Please wait a moment before trying again.';
            } else if (error.message.includes('500')) {
                errorMessage = 'Server error. Please try again in a few moments.';
            }
            
            this.addAIResponse(errorMessage);
            console.error('AI API Error:', error);
        } finally {
            this.isProcessing = false;
        }
    }
    
    addUserMessage(message) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message user-message slide-up';
        messageDiv.innerHTML = `
            <div class="message-content">
                <div class="message-bubble">
                    <p>${this.escapeHtml(message)}</p>
                </div>
                <div class="message-time">Just now</div>
            </div>
        `;
        this.chatMessages.appendChild(messageDiv);
        
        // Trigger slide-up animation with slight delay for staggered effect
        setTimeout(() => {
            messageDiv.classList.add('slide-in');
            // Scroll to show new message
            this.scrollToBottom();
        }, 50);
    }
    
    addAIResponse(response) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message ai-message slide-up';
        messageDiv.innerHTML = `
            <div class="message-avatar">
                <i class="fas fa-robot"></i>
            </div>
            <div class="message-content">
                <div class="message-bubble">
                    <p>${response}</p>
                </div>
                <div class="message-time">Just now</div>
            </div>
        `;
        this.chatMessages.appendChild(messageDiv);
        
        // Trigger slide-up animation with delay for smooth transition
        setTimeout(() => {
            messageDiv.classList.add('slide-in');
            // Always scroll to show AI response
            this.scrollToBottom();
        }, 100);
    }
    
    // Method to add multiple messages with staggered animation
    addStaggeredMessages(messages, isAI = false) {
        messages.forEach((message, index) => {
            setTimeout(() => {
                if (isAI) {
                    this.addAIResponse(message);
                } else {
                    this.addUserMessage(message);
                }
            }, index * 200); // 200ms delay between each message
        });
    }
    
    updateConnectionStatus() {
        const statusIndicator = document.querySelector('.ai-status .status-dot');
        if (statusIndicator) {
            statusIndicator.className = 'status-dot';
            
            switch (this.connectionStatus) {
                case 'connected':
                    statusIndicator.classList.add('connected');
                    break;
                case 'error':
                    statusIndicator.classList.add('error');
                    break;
                case 'disconnected':
                    statusIndicator.classList.add('disconnected');
                    break;
            }
        }
    }
    
    showTypingIndicator() {
        if (this.typingIndicator) {
            this.typingIndicator.style.display = 'flex';
            this.typingIndicator.style.opacity = '1';
            this.typingIndicator.style.transform = 'translateY(0)';
            
            // Scroll to show typing indicator
            setTimeout(() => {
                this.scrollToBottom();
            }, 50);
        }
    }
    
    hideTypingIndicator() {
        if (this.typingIndicator) {
            this.typingIndicator.style.opacity = '0';
            this.typingIndicator.style.transform = 'translateY(10px)';
            
            setTimeout(() => {
                this.typingIndicator.style.display = 'none';
            }, 300);
        }
    }
    
    scrollToBottom() {
        if (this.chatMessages) {
            // Smooth scroll to bottom with offset for better visibility
            const scrollHeight = this.chatMessages.scrollHeight;
            const clientHeight = this.chatMessages.clientHeight;
            const maxScrollTop = scrollHeight - clientHeight;
            
            this.chatMessages.scrollTo({
                top: maxScrollTop + 80, // Increased offset for new padding
                behavior: 'smooth'
            });
            
            // Ensure the scroll happens after DOM updates
            setTimeout(() => {
                this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
            }, 100);
        }
    }
    
    // Method to check if user is near bottom of chat
    isNearBottom() {
        if (!this.chatMessages) return true;
        
        const scrollTop = this.chatMessages.scrollTop;
        const scrollHeight = this.chatMessages.scrollHeight;
        const clientHeight = this.chatMessages.clientHeight;
        const threshold = 100; // 100px threshold
        
        return (scrollTop + clientHeight) >= (scrollHeight - threshold);
    }
    
    // Method to auto-scroll only if user is near bottom
    smartScrollToBottom() {
        if (this.isNearBottom()) {
            this.scrollToBottom();
        }
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    async getAIResponse(message) {
        // Add system context for school management
        const systemPrompt = `You are an AI assistant for Codediera EduPro, a comprehensive school management system. You help potential customers understand our features, pricing, and capabilities. 

Key Information:
- We offer school management software with features like student management, academic records, attendance tracking, grade management, parent portal, staff management, financial management, library system, communication hub, examination system, and advanced analytics.
- Pricing: Starter (₦500,000) for up to 200 students, Professional (₦1,200,000) for up to 1,000 students, Enterprise (₦2,500,000) for unlimited students. Scratch card options available with 90% discounts.
- Security: Enterprise-grade encryption, SSL certificates, multi-factor authentication, hosted on AWS (US) and Microsoft Azure (UK) with 99.9% uptime.
- Contact: +2349150524245, info@codediera.com, WhatsApp available for inquiries.
- Location: Owerri, Nigeria

Be helpful, professional, and concise. If asked about something not related to our school management system, politely redirect the conversation back to our services.`;

        // Prepare messages for API
        const messages = [
            { role: 'system', content: systemPrompt },
            ...this.conversationHistory,
            { role: 'user', content: message }
        ];

        try {
            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: this.model,
                    messages: messages,
                    max_tokens: 500,
                    temperature: 0.7,
                    stream: false
                })
            });

            if (!response.ok) {
                throw new Error(`API request failed: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            
            if (data.choices && data.choices[0] && data.choices[0].message) {
                const aiResponse = data.choices[0].message.content;
                
                // Update conversation history (keep last 10 messages to manage context)
                this.conversationHistory.push(
                    { role: 'user', content: message },
                    { role: 'assistant', content: aiResponse }
                );
                
                // Keep only last 10 messages to prevent context overflow
                if (this.conversationHistory.length > 10) {
                    this.conversationHistory = this.conversationHistory.slice(-10);
                }
                
                return aiResponse;
            } else {
                throw new Error('Invalid response format from AI API');
            }
        } catch (error) {
            console.error('AI API Error:', error);
            throw error;
        }
    }
}

// Pricing Management
class PricingManager {
    constructor() {
        this.pricingToggle = document.getElementById('pricingToggle');
        this.scratchCardSection = document.getElementById('scratchCardSection');
        this.whatsappButtons = document.querySelectorAll('.whatsapp-btn');
        
        this.init();
    }
    
    init() {
        // Pricing toggle
        this.pricingToggle?.addEventListener('change', () => this.togglePricing());
        
        // WhatsApp buttons
        this.whatsappButtons.forEach(btn => {
            btn.addEventListener('click', (e) => this.handleWhatsAppClick(e));
        });
    }
    
    togglePricing() {
        const isChecked = this.pricingToggle.checked;
        
        if (isChecked) {
            this.scratchCardSection.style.display = 'block';
            setTimeout(() => {
                this.scratchCardSection.style.opacity = '1';
                this.scratchCardSection.style.transform = 'translateY(0)';
            }, 10);
        } else {
            this.scratchCardSection.style.opacity = '0';
            this.scratchCardSection.style.transform = 'translateY(20px)';
            setTimeout(() => {
                this.scratchCardSection.style.display = 'none';
            }, 300);
        }
    }
    
    handleWhatsAppClick(e) {
        e.preventDefault();
        
        const plan = e.target.getAttribute('data-plan');
        const price = e.target.getAttribute('data-price');
        const students = e.target.getAttribute('data-students');
        
        const message = `Hi! I'm interested in the ${plan} plan for ${price} (${students}). Can you provide more details about this plan?`;
        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/2349150524245?text=${encodedMessage}`;
        
        window.open(whatsappUrl, '_blank');
    }
}

// Gallery Management
class GalleryManager {
    constructor() {
        this.filterButtons = document.querySelectorAll('.filter-btn');
        this.galleryItems = document.querySelectorAll('.gallery-item');
        
        this.init();
    }
    
    init() {
        this.filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const filter = btn.getAttribute('data-filter');
                this.filterGallery(filter);
                
                // Update active button
                this.filterButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });
    }
    
    filterGallery(filter) {
        this.galleryItems.forEach(item => {
            const category = item.getAttribute('data-category');
            
            if (filter === 'all' || category === filter) {
                item.style.display = 'block';
        setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'scale(1)';
                }, 10);
            } else {
                item.style.opacity = '0';
                item.style.transform = 'scale(0.8)';
                setTimeout(() => {
                    item.style.display = 'none';
                }, 300);
            }
        });
    }
}

// Coming Soon Modal Management
class ComingSoonModal {
    constructor() {
        this.modal = document.getElementById('comingSoonModal');
        this.overlay = document.getElementById('modalOverlay');
        this.closeBtn = document.getElementById('modalClose');
        this.liveDemoBtn = document.getElementById('liveDemoBtn');
        this.notifyMeBtn = document.getElementById('notifyMeBtn');
        
        this.init();
    }
    
    init() {
        // Event listeners
        this.liveDemoBtn?.addEventListener('click', (e) => {
            this.openModal();
            this.createRippleEffect(e);
        });
        this.closeBtn?.addEventListener('click', (e) => {
            this.closeModal();
            this.createRippleEffect(e);
        });
        this.overlay?.addEventListener('click', () => this.closeModal());
        this.notifyMeBtn?.addEventListener('click', (e) => {
            // The mailto link is handled by the onclick attribute in HTML
            this.createRippleEffect(e);
        });
        
        // Close modal on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal?.classList.contains('active')) {
                this.closeModal();
            }
        });
    }
    
    createRippleEffect(event) {
        const button = event.currentTarget;
        const ripple = document.createElement('div');
        ripple.className = 'button-ripple';
        
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        
        button.appendChild(ripple);
        
        setTimeout(() => {
            if (ripple.parentNode) {
                ripple.parentNode.removeChild(ripple);
            }
        }, 600);
    }
    
    openModal() {
        if (this.modal) {
            this.modal.classList.add('active');
            document.body.style.overflow = 'hidden';
            
            // Add entrance animation
            const container = this.modal.querySelector('.modal-container');
            if (container) {
                container.style.animation = 'slideInUp 0.4s ease';
            }
        }
    }
    
    closeModal() {
        if (this.modal) {
            const container = this.modal.querySelector('.modal-container');
            if (container) {
                container.style.animation = 'slideOutDown 0.3s ease';
            }
            
            setTimeout(() => {
                this.modal.classList.remove('active');
                document.body.style.overflow = '';
            }, 300);
        }
    }
    

}

// Main Application Class
class SchoolPortalApp {
    constructor() {
        this.themeManager = new ThemeManager();
        this.navigationManager = new NavigationManager();
        this.loadingManager = new LoadingManager();
        this.scrollProgressManager = new ScrollProgressManager();
        this.aiChatManager = new AIChatManager();
        this.pricingManager = new PricingManager();
        this.galleryManager = new GalleryManager();
        this.comingSoonModal = new ComingSoonModal();
        
        this.init();
    }
    
    init() {
        // Initialize all components
        console.log('Codediera EduPro School Portal initialized successfully!');
        
        // Add global event listeners
        this.addGlobalEventListeners();
        
        // Initialize smooth scrolling for all anchor links
        this.initSmoothScrolling();
        
        // Initialize form handling
        this.initFormHandling();
        
        // Initialize newsletter signup
        this.initNewsletterSignup();
        
        // Initialize AOS if available
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 800,
                easing: 'ease-in-out',
                once: true,
                offset: 100
            });
        }
    }
    
    addGlobalEventListeners() {
        // Handle window resize
        window.addEventListener('resize', () => {
            this.handleResize();
        });
        
        // Handle scroll events
        window.addEventListener('scroll', () => {
            this.handleScroll();
        });
        
        // Handle keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardShortcuts(e);
        });
    }
    
    handleResize() {
        // Close mobile menu on resize
        if (window.innerWidth > 768) {
            this.navigationManager.closeMobileMenu();
        }
    }
    
    handleScroll() {
        // Update scroll progress
        this.scrollProgressManager.updateScrollProgress();
        
        // Update header background
        this.themeManager.updateHeaderBackground();
    }
    
    handleKeyboardShortcuts(e) {
        // Ctrl/Cmd + K to toggle theme
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            this.themeManager.toggleTheme();
        }
        
        // Escape to close modals/dropdowns
        if (e.key === 'Escape') {
            this.navigationManager.closeAllDropdowns();
            this.aiChatManager.closeChat();
        }
    }
    
    initSmoothScrolling() {
        // Smooth scroll for all anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = anchor.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    const headerHeight = document.querySelector('.header').offsetHeight;
                    const targetPosition = targetElement.offsetTop - headerHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
    
    initFormHandling() {
        // Handle contact form
        const contactForm = document.querySelector('.contact-form form');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleContactForm(contactForm);
            });
        }
    }
    
    handleContactForm(form) {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        // Simulate form submission
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        
        setTimeout(() => {
            submitBtn.textContent = 'Message Sent!';
            submitBtn.style.background = 'var(--success-color)';
            
            setTimeout(() => {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                submitBtn.style.background = '';
                form.reset();
            }, 2000);
        }, 1500);
    }
    
    initNewsletterSignup() {
        const newsletterForm = document.querySelector('.newsletter-form');
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleNewsletterSignup(newsletterForm);
            });
        }
    }
    
    handleNewsletterSignup(form) {
        const email = form.querySelector('input[type="email"]').value;
        
        // Simulate newsletter signup
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalHTML = submitBtn.innerHTML;
        
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        submitBtn.disabled = true;
        
                    setTimeout(() => {
            submitBtn.innerHTML = '<i class="fas fa-check"></i>';
            submitBtn.style.background = 'var(--success-color)';
            
            setTimeout(() => {
                submitBtn.innerHTML = originalHTML;
                submitBtn.disabled = false;
                submitBtn.style.background = '';
                form.reset();
            }, 2000);
                    }, 1000);
                }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new SchoolPortalApp();
});

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes themeRipple {
        0% {
            transform: scale(0);
            opacity: 1;
        }
        100% {
            transform: scale(40);
            opacity: 0;
        }
    }
    
    @keyframes float-gentle {
        0%, 100% { transform: translateY(0px) rotate(0deg); }
        50% { transform: translateY(-20px) rotate(180deg); }
    }
    
    @keyframes pulse-glow {
        0%, 100% { box-shadow: 0 0 20px rgba(99, 102, 241, 0.3); }
        50% { box-shadow: 0 0 30px rgba(99, 102, 241, 0.6); }
    }
    
    @keyframes slideInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    .animate-in {
        animation: slideInUp 0.6s ease-out forwards;
    }
    
    .fade-in {
        animation: fadeIn 0.8s ease-out forwards;
    }
    
    .pulse-glow {
        animation: pulse-glow 2s ease-in-out infinite;
    }
    
    /* AI Chat Status Indicators */
    .status-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        display: inline-block;
        margin-right: 8px;
        transition: all 0.3s ease;
    }
    
    .status-dot.connected {
        background-color: #10b981;
        box-shadow: 0 0 8px rgba(16, 185, 129, 0.5);
        animation: pulse 2s infinite;
    }
    
    .status-dot.error {
        background-color: #ef4444;
        box-shadow: 0 0 8px rgba(239, 68, 68, 0.5);
        animation: pulse 1s infinite;
    }
    
    .status-dot.disconnected {
        background-color: #6b7280;
        box-shadow: 0 0 8px rgba(107, 114, 128, 0.3);
    }
    
    @keyframes pulse {
        0% {
            transform: scale(1);
            opacity: 1;
        }
        50% {
            transform: scale(1.2);
            opacity: 0.7;
        }
        100% {
            transform: scale(1);
            opacity: 1;
        }
    }
    
    /* AI Chat Enhancements */
    .ai-chat-container .chat-toggle {
        position: relative;
    }
    
    .ai-chat-container .chat-toggle::after {
        content: '';
        position: absolute;
        top: -2px;
        right: -2px;
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background: #10b981;
        border: 2px solid #fff;
        animation: pulse 2s infinite;
    }
    
    .ai-chat-container.offline .chat-toggle::after {
        background: #ef4444;
    }
    
    .ai-chat-container.error .chat-toggle::after {
        background: #f59e0b;
    }
    
    /* Enhanced typing indicator */
    .typing-indicator {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 12px;
        background: rgba(99, 102, 241, 0.1);
        border-radius: 12px;
        margin: 8px 0;
    }
    
    .typing-dots {
        display: flex;
        gap: 4px;
    }
    
    .typing-dots span {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: #6366f1;
        animation: typing 1.4s infinite ease-in-out, typingPulse 2s infinite ease-in-out;
        display: inline-block;
    }
    
    .typing-dots span:nth-child(1) { animation-delay: -0.32s, 0s; }
    .typing-dots span:nth-child(2) { animation-delay: -0.16s, 0.3s; }
    .typing-dots span:nth-child(3) { animation-delay: 0s, 0.6s; }
    
    /* Enhanced typing animation with pulse */
    @keyframes typing {
        0%, 80%, 100% {
            transform: scale(0.8);
            opacity: 0.5;
        }
        40% {
            transform: scale(1);
            opacity: 1;
        }
    }
    
    @keyframes typingPulse {
        0%, 100% {
            box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.4);
        }
        50% {
            box-shadow: 0 0 0 4px rgba(99, 102, 241, 0);
        }
    }
    
    /* Chat Message Slide-up Animations */
    .message.slide-up {
        opacity: 0;
        transform: translateY(20px);
        transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    }
    
    .message.slide-up.slide-in {
        opacity: 1;
        transform: translateY(0);
    }
    
    /* Enhanced message animations */
    .message.user-message.slide-up {
        animation: slideInFromRight 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
    }
    
    .message.ai-message.slide-up {
        animation: slideInFromLeft 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
    }
    
    @keyframes slideInFromRight {
        0% {
            opacity: 0;
            transform: translateX(30px) translateY(10px);
        }
        100% {
            opacity: 1;
            transform: translateX(0) translateY(0);
        }
    }
    
    @keyframes slideInFromLeft {
        0% {
            opacity: 0;
            transform: translateX(-30px) translateY(10px);
        }
        100% {
            opacity: 1;
            transform: translateX(0) translateY(0);
        }
    }
    
    /* Message bubble animations */
    .message-bubble {
        position: relative;
        overflow: hidden;
    }
    
    .message-bubble::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.1), transparent);
        transform: translateX(-100%);
        transition: transform 0.6s ease;
    }
    
    .message.slide-in .message-bubble::before {
        transform: translateX(100%);
    }
    
    /* Typing indicator slide-up */
    .typing-indicator {
        animation: slideInFromBottom 0.3s ease-out;
    }
    
    @keyframes slideInFromBottom {
        0% {
            opacity: 0;
            transform: translateY(20px);
        }
        100% {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    /* Chat window slide-up animation */
    .chat-window {
        transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    }
    
    .chat-window.slide-up {
        transform: translateY(20px);
        opacity: 0;
    }
    
    .chat-window.slide-in {
        transform: translateY(0);
        opacity: 1;
    }
    
    /* Enhanced chat animations */
    .chat-messages {
        overflow-y: auto;
        scroll-behavior: smooth;
        padding: 20px;
        padding-bottom: 80px; /* Add bottom padding for better spacing */
        max-height: 400px;
        position: relative;
    }
    
    /* Custom Scrollbar Styling */
    .chat-messages::-webkit-scrollbar {
        width: 8px;
    }
    
    .chat-messages::-webkit-scrollbar-track {
        background: rgba(0, 0, 0, 0.05);
        border-radius: 10px;
        margin: 5px 0;
    }
    
    .chat-messages::-webkit-scrollbar-thumb {
        background: linear-gradient(180deg, #6366f1, #8b5cf6);
        border-radius: 10px;
        border: 2px solid transparent;
        background-clip: content-box;
    }
    
    .chat-messages::-webkit-scrollbar-thumb:hover {
        background: linear-gradient(180deg, #4f46e5, #7c3aed);
    }
    
    .chat-messages::-webkit-scrollbar-corner {
        background: transparent;
    }
    
    /* Firefox scrollbar */
    .chat-messages {
        scrollbar-width: thin;
        scrollbar-color: #6366f1 rgba(0, 0, 0, 0.05);
    }
    
    /* Message container animations */
    .message {
        margin-bottom: 20px;
        transition: all 0.3s ease;
        position: relative;
        z-index: 1;
    }
    
    .message:hover {
        transform: translateX(2px);
    }
    
    /* Ensure messages are always visible */
    .message:last-child {
        margin-bottom: 20px; /* Increased bottom margin for last message */
    }
    
    /* Add extra spacing at the bottom of chat */
    .chat-messages::after {
        content: '';
        display: block;
        height: 20px; /* Extra space at bottom */
        width: 100%;
    }
    
    /* Message bubble improvements */
    .message-bubble {
        position: relative;
        overflow: hidden;
        word-wrap: break-word;
        max-width: 100%;
    }
    
    .message-bubble p {
        margin: 0;
        line-height: 1.5;
        white-space: pre-wrap;
    }
    
    /* Typing indicator improvements */
    .typing-indicator {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 8px 12px;
        background: rgba(99, 102, 241, 0.1);
        border-radius: 20px;
        margin: 8px 0 16px 0;
        transition: all 0.3s ease;
        position: relative;
        z-index: 2;
        animation: typingGrow 0.5s ease-out;
        width: auto;
        max-width: fit-content;
    }
    
    .typing-indicator.hidden {
        opacity: 0;
        transform: translateY(10px);
        pointer-events: none;
    }
    
    .typing-dots {
        display: flex;
        gap: 4px;
        align-items: center;
        flex-shrink: 0;
    }
    
    .typing-dots span {
        width: 5px;
        height: 5px;
        border-radius: 50%;
        background: #6366f1;
        animation: typing 1.4s infinite ease-in-out, typingPulse 2s infinite ease-in-out;
        display: inline-block;
        flex-shrink: 0;
    }
    
    .typing-dots span:nth-child(1) { animation-delay: -0.32s; }
    .typing-dots span:nth-child(2) { animation-delay: -0.16s; }
    .typing-dots span:nth-child(3) { animation-delay: 0s; }
    
    .typing-text {
        font-size: 12px;
        color: #6366f1;
        font-weight: 500;
        animation: typingTextGrow 0.5s ease-out;
        white-space: nowrap;
        margin: 0;
    }
    
    /* Growing animation for typing indicator */
    @keyframes typingGrow {
        0% {
            opacity: 0;
            transform: scale(0.8) translateY(10px);
        }
        50% {
            transform: scale(1.05) translateY(-2px);
        }
        100% {
            opacity: 1;
            transform: scale(1) translateY(0);
        }
    }
    
    /* Growing animation for typing text */
    @keyframes typingTextGrow {
        0% {
            opacity: 0;
            transform: scale(0.8);
        }
        100% {
            opacity: 1;
            transform: scale(1);
        }
    }
    
    /* Scroll to bottom button */
    .scroll-to-bottom-btn {
        position: absolute;
        bottom: 30px; /* Adjusted for new padding */
        right: 20px;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: linear-gradient(135deg, #6366f1, #8b5cf6);
        border: none;
        color: white;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 15px rgba(99, 102, 241, 0.3);
        transition: all 0.3s ease;
        opacity: 0;
        pointer-events: none;
        z-index: 10;
    }
    
    .scroll-to-bottom-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(99, 102, 241, 0.4);
    }
    
    .scroll-to-bottom-btn:active {
        transform: translateY(0);
    }
    
    .scroll-to-bottom-btn i {
        font-size: 16px;
    }
    
    /* Chat container improvements */
    .chat-window {
        position: relative;
        overflow: hidden;
    }
    
    .chat-messages {
        position: relative;
        overflow-y: auto;
        overflow-x: hidden;
    }
    
    /* Message visibility improvements */
    .message {
        opacity: 1;
        visibility: visible;
        transition: all 0.3s ease;
    }
    
    .message.slide-up {
        opacity: 0;
        transform: translateY(20px);
    }
    
    .message.slide-up.slide-in {
        opacity: 1;
        transform: translateY(0);
    }
    
    /* Ensure typing indicator doesn't hide messages */
    .typing-indicator {
        position: sticky;
        bottom: 0;
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(10px);
        border-top: 1px solid rgba(0, 0, 0, 0.05);
        margin-top: 10px;
    }
    
    /* Suggestion chips slide-up */
    .suggestion-chip {
        transition: all 0.3s ease;
        transform: translateY(10px);
        opacity: 0;
        animation: slideUpChip 0.4s ease forwards;
    }
    
    .suggestion-chip:nth-child(1) { animation-delay: 0.1s; }
    .suggestion-chip:nth-child(2) { animation-delay: 0.2s; }
    .suggestion-chip:nth-child(3) { animation-delay: 0.3s; }
    .suggestion-chip:nth-child(4) { animation-delay: 0.4s; }
    
    @keyframes slideUpChip {
        0% {
            opacity: 0;
            transform: translateY(10px);
        }
        100% {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    /* Chat toggle slide-up animation */
    .chat-toggle {
        transition: all 0.3s ease;
    }
    
    .chat-toggle:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(99, 102, 241, 0.3);
    }
    
    /* Notification slide-up */
    .chat-notification {
        animation: slideUpNotification 0.5s ease-out;
    }
    
    @keyframes slideUpNotification {
        0% {
            opacity: 0;
            transform: translateY(20px) scale(0.8);
        }
        50% {
            transform: translateY(-5px) scale(1.05);
        }
        100% {
            opacity: 1;
            transform: translateY(0) scale(1);
        }
    }

    /* AI Chat Button Redesign */
    .ai-chat-toggle {
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 60px;
        height: 60px;
        background: linear-gradient(135deg, #6366f1, #8b5cf6);
        border: none;
        border-radius: 50%;
        cursor: pointer;
        box-shadow: 0 8px 32px rgba(99, 102, 241, 0.3);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        z-index: 9999;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        pointer-events: auto;
        user-select: none;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
    }

    .ai-chat-toggle::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(135deg, #8b5cf6, #6366f1);
        border-radius: 50%;
        opacity: 0;
        transition: opacity 0.3s ease;
    }

    .ai-chat-toggle:hover::before {
        opacity: 1;
    }

    .ai-chat-toggle:hover {
        transform: translateY(-2px) scale(1.05);
        box-shadow: 0 12px 40px rgba(99, 102, 241, 0.4);
    }

    .ai-chat-toggle:active {
        transform: translateY(0) scale(0.95);
    }

    .ai-chat-toggle .icon {
        width: 24px;
        height: 24px;
        fill: white;
        transition: all 0.3s ease;
        position: relative;
        z-index: 2;
        pointer-events: none;
        user-select: none;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
    }

    .ai-chat-toggle .close-icon {
        display: none;
        width: 20px;
        height: 20px;
        fill: white;
        transition: all 0.3s ease;
        position: relative;
        z-index: 2;
        pointer-events: none;
        user-select: none;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
    }

    .ai-chat-toggle.chat-open .icon {
        display: none;
    }

    .ai-chat-toggle.chat-open .close-icon {
        display: block;
    }

    .ai-chat-toggle.chat-open {
        background: linear-gradient(135deg, #ef4444, #dc2626);
        box-shadow: 0 8px 32px rgba(239, 68, 68, 0.3);
    }

    .ai-chat-toggle.chat-open::before {
        background: linear-gradient(135deg, #dc2626, #ef4444);
    }

    .ai-chat-toggle.chat-open:hover {
        box-shadow: 0 12px 40px rgba(239, 68, 68, 0.4);
    }

    /* Chat Indicator Badge */
    .chat-indicator {
        position: absolute;
        top: -5px;
        right: -5px;
        width: 24px;
        height: 24px;
        background: #10b981;
        border: 2px solid white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        font-weight: 600;
        color: white;
        opacity: 0;
        transform: scale(0);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        z-index: 3;
        pointer-events: none;
        user-select: none;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
    }

    .chat-indicator.active {
        opacity: 1;
        transform: scale(1);
    }

    .chat-indicator.pulse {
        animation: indicatorPulse 2s infinite;
    }

    @keyframes indicatorPulse {
        0% {
            box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7);
        }
        70% {
            box-shadow: 0 0 0 10px rgba(16, 185, 129, 0);
        }
        100% {
            box-shadow: 0 0 0 0 rgba(16, 185, 129, 0);
        }
    }

    /* Ripple Effect */
    .ai-chat-toggle .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: scale(0);
        animation: ripple 0.6s linear;
        pointer-events: none;
    }

    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }

    /* Custom Tooltip */
    .chat-tooltip {
        position: absolute;
        right: 70px;
        top: 50%;
        transform: translateY(-50%);
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 8px 12px;
        border-radius: 6px;
        font-size: 12px;
        font-weight: 500;
        white-space: nowrap;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        pointer-events: none;
        z-index: 10000;
    }

    .chat-tooltip::after {
        content: '';
        position: absolute;
        right: -5px;
        top: 50%;
        transform: translateY(-50%);
        border: 5px solid transparent;
        border-left-color: rgba(0, 0, 0, 0.8);
    }

    .ai-chat-toggle:hover .chat-tooltip {
        opacity: 1;
        visibility: visible;
    }

    /* Dark mode tooltip */
    [data-theme="dark"] .chat-tooltip {
        background: rgba(255, 255, 255, 0.9);
        color: #1a1a1a;
    }

    [data-theme="dark"] .chat-tooltip::after {
        border-left-color: rgba(255, 255, 255, 0.9);
    }

    /* Pricing Table Feature Text Color */
    .comparison-table tbody td strong {
        color: #1e3a8a !important; /* Dark blue color */
        font-weight: 600;
    }

    /* Dark mode pricing table feature text */
    [data-theme="dark"] .comparison-table tbody td strong {
        color: #3b82f6 !important; /* Lighter blue for dark mode */
    }
`;
document.head.appendChild(style);
