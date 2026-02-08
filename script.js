// Theme Management
const themeManager = {
    init() {
        // Check for saved theme preference or default to 'light'
        const savedTheme = localStorage.getItem('theme') || 'light';
        this.setTheme(savedTheme);
        
        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem('theme')) {
                this.setTheme(e.matches ? 'dark' : 'light');
            }
        });
    },

    setTheme(theme) {
        const html = document.documentElement;
        if (theme === 'dark') {
            html.classList.add('dark');
        } else {
            html.classList.remove('dark');
        }
        localStorage.setItem('theme', theme);
        this.updateThemeIcon(theme);
    },

    toggle() {
        const isDark = document.documentElement.classList.contains('dark');
        this.setTheme(isDark ? 'light' : 'dark');
    },

    updateThemeIcon(theme) {
        const icon = document.getElementById('theme-icon');
        if (icon) {
            icon.setAttribute('data-feather', theme === 'dark' ? 'sun' : 'moon');
            feather.replace();
        }
    },

    getCurrentTheme() {
        return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
    }
};

// Tab Management
function switchTab(tab) {
    const dateToDurationSection = document.getElementById('section-date-to-duration');
    const durationToDateSection = document.getElementById('section-duration-to-date');
    const dateToDurationBtn = document.getElementById('tab-date-to-duration');
    const durationToDateBtn = document.getElementById('tab-duration-to-date');

    if (tab === 'date-to-duration') {
        dateToDurationSection.classList.remove('hidden');
        durationToDateSection.classList.add('hidden');
        
        dateToDurationBtn.classList.add('bg-primary-600', 'text-white', 'shadow-md');
        dateToDurationBtn.classList.remove('text-gray-600', 'dark:text-gray-400');
        
        durationToDateBtn.classList.remove('bg-secondary-500', 'text-white', 'shadow-md');
        durationToDateBtn.classList.add('text-gray-600', 'dark:text-gray-400');
    } else {
        dateToDurationSection.classList.add('hidden');
        durationToDateSection.classList.remove('hidden');
        
        durationToDateBtn.classList.add('bg-secondary-500', 'text-white', 'shadow-md');
        durationToDateBtn.classList.remove('text-gray-600', 'dark:text-gray-400');
        
        dateToDurationBtn.classList.remove('bg-primary-600', 'text-white', 'shadow-md');
        dateToDurationBtn.classList.add('text-gray-600', 'dark:text-gray-400');
    }
    
    // Re-render icons
    feather.replace();
}

// Date to Duration Logic
function setNow() {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    document.getElementById('date-input').value = now.toISOString().slice(0, 16);
}

function calculateDuration() {
    const input = document.getElementById('date-input').value;
    if (!input) {
        showToast('Please select a date first!', 'error');
        return;
    }

    const targetDate = new Date(input);
    const now = new Date();
    const diffMs = now - targetDate;
    const isFuture = diffMs < 0;
    const absDiffMs = Math.abs(diffMs);

    // Calculations
    const seconds = Math.floor(absDiffMs / 1000);
    const minutes = Math.floor(absDiffMs / (1000 * 60));
    const hours = Math.floor(absDiffMs / (1000 * 60 * 60));
    const days = Math.floor(absDiffMs / (1000 * 60 * 60 * 24));
    const years = (absDiffMs / (1000 * 60 * 60 * 24 * 365.25)).toFixed(2);

    const direction = isFuture ? 'until' : 'since';
    const prefix = isFuture ? 'In' : '';

    const results = [
        { label: 'Years', value: years, icon: 'calendar', color: 'primary' },
        { label: 'Days', value: days.toLocaleString(), icon: 'sun', color: 'primary' },
        { label: 'Hours', value: hours.toLocaleString(), icon: 'clock', color: 'secondary' },
        { label: 'Minutes', value: minutes.toLocaleString(), icon: 'watch', color: 'secondary' },
        { label: 'Seconds', value: seconds.toLocaleString(), icon: 'activity', color: 'purple' }
    ];

    const container = document.getElementById('duration-results');
    container.innerHTML = results.map((result, index) => `
        <div class="result-card bg-gradient-to-br from-${result.color}-50 to-white dark:from-${result.color}-900/20 dark:to-gray-800 p-6 rounded-2xl border border-${result.color}-100 dark:border-${result.color}-800 relative group" style="animation-delay: ${index * 0.1}s">
            <button onclick="copyToClipboard('result-${result.label.toLowerCase()}')" class="absolute top-3 right-3 p-2 rounded-lg bg-white/50 dark:bg-gray-700/50 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-${result.color}-100 dark:hover:bg-${result.color}-800" title="Copy">
                <i data-feather="copy" class="w-4 h-4 text-${result.color}-600 dark:text-${result.color}-400"></i>
            </button>
            <div class="w-10 h-10 bg-${result.color}-100 dark:bg-${result.color}-800 rounded-xl flex items-center justify-center mb-3">
                <i data-feather="${result.icon}" class="w-5 h-5 text-${result.color}-600 dark:text-${result.color}-400"></i>
            </div>
            <p class="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wider font-semibold mb-1">${result.label}</p>
            <p id="result-${result.label.toLowerCase()}" class="text-2xl font-bold text-gray-800 dark:text-white font-mono">${result.value}</p>
            <p class="text-xs text-${result.color}-600 dark:text-${result.color}-400 mt-2 font-medium">${isFuture ? 'Future' : 'Past'}</p>
        </div>
    `).join('');

    container.classList.remove('hidden');
    feather.replace();
    
    // Animate cards
    const cards = container.querySelectorAll('.result-card');
    cards.forEach((card, i) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        setTimeout(() => {
            card.style.transition = 'all 0.5s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, i * 100);
    });
}

// Duration to Date Logic
let isFutureDirection = false;

function toggleDirection() {
    isFutureDirection = !isFutureDirection;
    const knob = document.getElementById('direction-knob');
    const toggle = document.getElementById('direction-toggle');
    const pastLabel = document.getElementById('direction-label-past');
    const futureLabel = document.getElementById('direction-label-future');
    
    if (isFutureDirection) {
        knob.style.transform = 'translateX(32px)';
        toggle.classList.remove('bg-secondary-500');
        toggle.classList.add('bg-green-500');
        pastLabel.classList.remove('text-gray-600', 'dark:text-gray-400');
        pastLabel.classList.add('text-gray-400', 'dark:text-gray-600');
        futureLabel.classList.remove('text-gray-400', 'dark:text-gray-600');
        futureLabel.classList.add('text-gray-600', 'dark:text-gray-400');
    } else {
        knob.style.transform = 'translateX(0)';
        toggle.classList.add('bg-secondary-500');
        toggle.classList.remove('bg-green-500');
        pastLabel.classList.add('text-gray-600', 'dark:text-gray-400');
        pastLabel.classList.remove('text-gray-400', 'dark:text-gray-600');
        futureLabel.classList.add('text-gray-400', 'dark:text-gray-600');
        futureLabel.classList.remove('text-gray-600', 'dark:text-gray-400');
    }
}

function calculateDate() {
    const amount = parseFloat(document.getElementById('duration-amount').value);
    if (!amount || amount <= 0) {
        showToast('Please enter a valid amount!', 'error');
        return;
    }

    const unit = document.querySelector('input[name="time-unit"]:checked')?.value;
    if (!unit) {
        showToast('Please select a time unit!', 'error');
        return;
    }

    const now = new Date();
    let targetDate = new Date(now);
    const multiplier = isFutureDirection ? 1 : -1;

    switch(unit) {
        case 'seconds':
            targetDate.setSeconds(targetDate.getSeconds() + (amount * multiplier));
            break;
        case 'minutes':
            targetDate.setMinutes(targetDate.getMinutes() + (amount * multiplier));
            break;
        case 'hours':
            targetDate.setHours(targetDate.getHours() + (amount * multiplier));
            break;
        case 'days':
            targetDate.setDate(targetDate.getDate() + (amount * multiplier));
            break;
        case 'weeks':
            targetDate.setDate(targetDate.getDate() + (amount * 7 * multiplier));
            break;
        case 'months':
            targetDate.setMonth(targetDate.getMonth() + (amount * multiplier));
            break;
        case 'years':
            targetDate.setFullYear(targetDate.getFullYear() + (amount * multiplier));
            break;
    }

    const formattedDate = targetDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });

    const isoString = targetDate.toISOString();
    const timestamp = targetDate.getTime();

    document.getElementById('result-date-text').textContent = formattedDate;
    document.getElementById('result-timestamp').textContent = timestamp;
    
    const resultContainer = document.getElementById('date-result');
    resultContainer.classList.remove('hidden');
    
    // Animate in
    resultContainer.style.opacity = '0';
    resultContainer.style.transform = 'translateY(10px)';
    setTimeout(() => {
        resultContainer.style.transition = 'all 0.5s ease';
        resultContainer.style.opacity = '1';
        resultContainer.style.transform = 'translateY(0)';
    }, 50);
}

// Clipboard functionality
async function copyToClipboard(elementId) {
    const element = document.getElementById(elementId);
    let textToCopy = element.textContent;
    
    // Clean up the text (remove any extra whitespace)
    textToCopy = textToCopy.trim();
    
    try {
        await navigator.clipboard.writeText(textToCopy);
        showToast('Copied to clipboard!');
    } catch (err) {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = textToCopy;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
            document.execCommand('copy');
            showToast('Copied to clipboard!');
        } catch (err) {
            showToast('Failed to copy', 'error');
        }
        
        document.body.removeChild(textArea);
    }
}

// Toast notification
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toast-message');
    const icon = toast.querySelector('i');
    
    toastMessage.textContent = message;
    
    if (type === 'error') {
        icon.setAttribute('data-feather', 'alert-circle');
        icon.classList.remove('text-green-400', 'dark:text-green-600');
        icon.classList.add('text-red-400', 'dark:text-red-600');
    } else {
        icon.setAttribute('data-feather', 'check-circle');
        icon.classList.remove('text-red-400', 'dark:text-red-600');
        icon.classList.add('text-green-400', 'dark:text-green-600');
    }
    
    feather.replace();
    
    toast.classList.remove('translate-y-20', 'opacity-0');
    
    setTimeout(() => {
        toast.classList.add('translate-y-20', 'opacity-0');
    }, 3000);
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    themeManager.init();
    
    // Set default date input to now
    setNow();
    
    // Add enter key support
    document.getElementById('date-input')?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') calculateDuration();
    });
    
    document.getElementById('duration-amount')?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') calculateDate();
    });
    
    // Prevent transitions on load
    document.body.classList.add('no-transitions');
    setTimeout(() => {
        document.body.classList.remove('no-transitions');
    }, 100);
});

// Expose theme toggle to window for navbar component
window.toggleTheme = () => themeManager.toggle();
window.getCurrentTheme = () => themeManager.getCurrentTheme();