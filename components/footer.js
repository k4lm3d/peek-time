class ChronoFooter extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    width: 100%;
                    margin-top: auto;
                }
                
                footer {
                    background: rgba(255, 255, 255, 0.6);
                    backdrop-filter: blur(8px);
                    border-top: 1px solid rgba(0, 0, 0, 0.05);
                    transition: all 0.3s ease;
                }
                
                :host(.dark) footer {
                    background: rgba(17, 24, 39, 0.6);
                    border-top: 1px solid rgba(255, 255, 255, 0.05);
                }
                
                .footer-link {
                    position: relative;
                    transition: color 0.3s ease;
                }
                
                .footer-link::after {
                    content: '';
                    position: absolute;
                    width: 0;
                    height: 2px;
                    bottom: -2px;
                    left: 0;
                    background: linear-gradient(90deg, #4f46e5, #f43f5e);
                    transition: width 0.3s ease;
                }
                
                .footer-link:hover::after {
                    width: 100%;
                }
                
                @media (max-width: 640px) {
                    .footer-content {
                        flex-direction: column;
                        gap: 1rem;
                        text-align: center;
                    }
                }
            </style>
            
            <footer class="w-full py-6 px-4 mt-12">
                <div class="footer-content max-w-7xl mx-auto flex justify-between items-center">
                    <div class="text-sm text-gray-600 dark:text-gray-400">
                        <span>© ${new Date().getFullYear()} ChronoFlux. Crafted with</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="#f43f5e" stroke="#f43f5e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display: inline; vertical-align: middle; margin: 0 4px;">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                        </svg>
                        <span>by Time Wizards</span>
                    </div>
                    
                    <div class="flex items-center gap-6 text-sm">
                        <a href="#" class="footer-link text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400">Privacy</a>
                        <a href="#" class="footer-link text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400">Terms</a>
                        <a href="#" class="footer-link text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400">Contact</a>
                    </div>
                </div>
            </footer>
        `;
        
        // Sync with theme
        this.syncTheme();
        
        // Listen for theme changes
        const observer = new MutationObserver(() => {
            this.syncTheme();
        });
        
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['class']
        });
    }
    
    syncTheme() {
        const isDark = document.documentElement.classList.contains('dark');
        if (isDark) {
            this.classList.add('dark');
        } else {
            this.classList.remove('dark');
        }
    }
}

customElements.define('chrono-footer', ChronoFooter);