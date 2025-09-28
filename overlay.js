// Set click-through on startup
window.overlay.setClickThrough(true);

const panel = document.getElementById('panel');
const toggleBtn = document.getElementById('toggleBtn');
const opacitySlider = document.getElementById('opacitySlider');
const opacityValue = document.getElementById('opacityValue');

// Handle mouse enter/leave for click-through behavior
panel.addEventListener('mouseenter', () => {
    window.overlay.setClickThrough(false);
    console.log('Mouse entered panel - disabling click-through');
});

panel.addEventListener('mouseleave', () => {
    window.overlay.setClickThrough(true);
    console.log('Mouse left panel - enabling click-through');
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