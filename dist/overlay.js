// Start with click-through disabled for interaction
window.overlay.setClickThrough(false);

const panel = document.getElementById('panel');
const toggleBtn = document.getElementById('toggleBtn');
const opacitySlider = document.getElementById('opacitySlider');
const opacityValue = document.getElementById('opacityValue');

// Handle click-through toggle via button
let clickThroughEnabled = false;
const clickThroughBtn = document.createElement('button');
clickThroughBtn.textContent = '🔓';
clickThroughBtn.title = 'Enable Click-through';
clickThroughBtn.style.cssText = 'background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); border-radius: 4px; color: white; padding: 4px 8px; cursor: pointer; font-size: 12px; margin-left: 8px;';
document.querySelector('.header').appendChild(clickThroughBtn);

clickThroughBtn.addEventListener('click', () => {
    clickThroughEnabled = !clickThroughEnabled;
    window.overlay.setClickThrough(clickThroughEnabled);
    clickThroughBtn.textContent = clickThroughEnabled ? '🔒' : '🔓';
    clickThroughBtn.title = clickThroughEnabled ? 'Disable Click-through' : 'Enable Click-through';
    console.log('Click-through toggled:', clickThroughEnabled);
});

// Handle hide/show button
toggleBtn.addEventListener('click', () => {
    window.overlay.toggle();
    console.log('Overlay toggled via button');
});

// Handle opacity slider
opacitySlider.addEventListener('input', (e) => {
    const value = parseFloat(e.target.value);
    window.overlay.setOpacity(value);
    opacityValue.textContent = Math.round(value * 100) + '%';
    console.log('Opacity changed to:', value);
});

// Initialize opacity display
opacityValue.textContent = Math.round(opacitySlider.value * 100) + '%';

console.log('Overlay script loaded successfully');