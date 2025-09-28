// Settings management
const SETTINGS_KEY = 'interviewCoachSettings';

// Default settings
const defaultSettings = {
    opacity: 0.8,
    clickThrough: true,
    position: 'top-right'
};

// Load settings from localStorage
function loadSettings() {
    const saved = localStorage.getItem(SETTINGS_KEY);
    return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
}

// Save settings to localStorage
function saveSettings(settings) {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

// Apply settings to overlay
function applySettings(settings) {
    if (window.overlay) {
        window.overlay.setOpacity(settings.opacity);
        window.overlay.setClickThrough(settings.clickThrough);
        window.overlay.setPositionPreset(settings.position);
    }
}

// Initialize settings UI
function initializeUI() {
    const settings = loadSettings();
    
    // Opacity slider
    const opacityRange = document.getElementById('opacityRange');
    const opacityDisplay = document.getElementById('opacityDisplay');
    
    opacityRange.value = settings.opacity;
    opacityDisplay.textContent = Math.round(settings.opacity * 100) + '%';
    
    opacityRange.addEventListener('input', (e) => {
        const value = parseFloat(e.target.value);
        opacityDisplay.textContent = Math.round(value * 100) + '%';
        
        const newSettings = { ...loadSettings(), opacity: value };
        saveSettings(newSettings);
        applySettings(newSettings);
    });
    
    // Click-through toggle
    const clickThroughToggle = document.getElementById('clickThroughToggle');
    clickThroughToggle.checked = settings.clickThrough;
    
    clickThroughToggle.addEventListener('change', (e) => {
        const newSettings = { ...loadSettings(), clickThrough: e.target.checked };
        saveSettings(newSettings);
        applySettings(newSettings);
    });
    
    // Position buttons
    const positionButtons = document.querySelectorAll('.position-btn');
    positionButtons.forEach(btn => {
        if (btn.dataset.position === settings.position) {
            btn.classList.add('active');
        }
        
        btn.addEventListener('click', () => {
            positionButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const position = btn.dataset.position;
            const newSettings = { ...loadSettings(), position };
            saveSettings(newSettings);
            applySettings(newSettings);
        });
    });
    
    // Toggle overlay button
    const toggleOverlay = document.getElementById('toggleOverlay');
    toggleOverlay.addEventListener('click', () => {
        if (window.overlay) {
            window.overlay.toggle();
        }
    });
    
    // Reset settings button
    const resetSettings = document.getElementById('resetSettings');
    resetSettings.addEventListener('click', () => {
        if (confirm('Reset all settings to defaults?')) {
            saveSettings(defaultSettings);
            location.reload();
        }
    });
    
    console.log('Settings UI initialized with:', settings);
}

// Apply saved settings on startup
document.addEventListener('DOMContentLoaded', () => {
    initializeUI();
    
    // Apply settings to overlay if available
    const settings = loadSettings();
    applySettings(settings);
    
    console.log('Settings script loaded successfully');
});