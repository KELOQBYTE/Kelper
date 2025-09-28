"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const node_path_1 = __importDefault(require("node:path"));
// Configure Electron for headless/server environment
electron_1.app.commandLine.appendSwitch('no-sandbox');
electron_1.app.commandLine.appendSwitch('disable-setuid-sandbox');
electron_1.app.commandLine.appendSwitch('disable-gpu');
electron_1.app.commandLine.appendSwitch('disable-gpu-sandbox');
electron_1.app.commandLine.appendSwitch('disable-software-rasterizer');
electron_1.app.commandLine.appendSwitch('disable-dev-shm-usage');
electron_1.app.commandLine.appendSwitch('disable-audio-output');
electron_1.app.commandLine.appendSwitch('disable-audio-input');
electron_1.app.commandLine.appendSwitch('mute-audio');
electron_1.app.commandLine.appendSwitch('disable-web-security');
electron_1.app.commandLine.appendSwitch('ignore-certificate-errors');
electron_1.app.commandLine.appendSwitch('disable-background-networking');
// Sandbox disabled via command line switches above
let overlay = null;
let settings = null;
let tray = null;
function calcPresetBounds(preset, size = { w: 420, h: 160 }) {
    const { width, height } = electron_1.screen.getPrimaryDisplay().workAreaSize;
    const margin = 16;
    const positions = {
        'top-right': { x: width - size.w - margin, y: margin },
        'bottom-right': { x: width - size.w - margin, y: height - size.h - margin },
        'top-left': { x: margin, y: margin },
        'bottom-left': { x: margin, y: height - size.h - margin },
    };
    return positions[preset];
}
function createWindows() {
    try {
        console.log('Creating overlay window...');
        overlay = new electron_1.BrowserWindow({
            width: 420,
            height: 160,
            frame: false,
            transparent: true,
            resizable: false,
            movable: true,
            focusable: false,
            alwaysOnTop: true,
            hasShadow: false,
            skipTaskbar: true,
            webPreferences: {
                preload: node_path_1.default.join(__dirname, 'preload.js'),
                contextIsolation: true,
                nodeIntegration: false,
            },
        });
        overlay.setVisibleOnAllWorkspaces(true, {
            visibleOnFullScreen: true,
            skipTransformProcessType: true
        });
        overlay.setAlwaysOnTop(true, 'screen-saver');
        // Start with click-through disabled for UI interaction
        overlay.setIgnoreMouseEvents(false, { forward: true });
        overlay.loadFile(node_path_1.default.join(__dirname, 'overlay.html'));
        console.log('Overlay window created successfully');
        console.log('Creating settings window...');
        settings = new electron_1.BrowserWindow({
            width: 720,
            height: 520,
            title: 'Coach Settings',
            webPreferences: {
                preload: node_path_1.default.join(__dirname, 'preload.js'),
                contextIsolation: true,
                nodeIntegration: false,
            },
        });
        settings.loadFile(node_path_1.default.join(__dirname, 'settings.html'));
        console.log('Settings window created successfully');
        // Create simple tray icon (using a base64 encoded 16x16 icon)
        const iconData = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAAdgAAAHYBTnsmCAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAFYSURBVDiNpZM9SwNBEIafgxCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLa0sLCwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLGwGHN==';
        try {
            console.log('Creating system tray...');
            const trayIcon = electron_1.nativeImage.createFromDataURL(iconData);
            tray = new electron_1.Tray(trayIcon);
            const menu = electron_1.Menu.buildFromTemplate([
                {
                    label: 'Show/Hide Overlay',
                    click: () => {
                        if (overlay) {
                            overlay.isVisible() ? overlay.hide() : overlay.show();
                            console.log('Overlay toggled via tray');
                        }
                    }
                },
                {
                    label: 'Settings',
                    click: () => {
                        if (settings) {
                            settings.show();
                            settings.focus();
                            console.log('Settings window opened via tray');
                        }
                    }
                },
                {
                    label: 'Quit',
                    click: () => {
                        console.log('Quitting application via tray');
                        electron_1.app.quit();
                    }
                },
            ]);
            tray.setToolTip('Interview Coach');
            tray.setContextMenu(menu);
            console.log('System tray created successfully');
        }
        catch (trayError) {
            console.error('Failed to create system tray:', trayError);
        }
    }
    catch (error) {
        console.error('Error creating windows:', error);
    }
}
electron_1.app.whenReady().then(() => {
    try {
        console.log('App ready, creating windows...');
        createWindows();
        // Register global shortcut
        const shortcutRegistered = electron_1.globalShortcut.register('CommandOrControl+Shift+K', () => {
            if (!overlay)
                return;
            overlay.isVisible() ? overlay.hide() : overlay.show();
            console.log('Overlay toggled via global shortcut');
        });
        if (shortcutRegistered) {
            console.log('Global shortcut CommandOrControl+Shift+K registered successfully');
        }
        else {
            console.error('Failed to register global shortcut');
        }
    }
    catch (error) {
        console.error('Error during app startup:', error);
    }
});
// IPC handlers
electron_1.ipcMain.handle('overlay:setClickThrough', (_evt, ignore) => {
    try {
        overlay?.setIgnoreMouseEvents(ignore, { forward: true });
        console.log('Click-through set to:', ignore);
    }
    catch (error) {
        console.error('Error setting click-through:', error);
    }
});
electron_1.ipcMain.handle('overlay:setOpacity', (_evt, alpha) => {
    try {
        overlay?.setOpacity(alpha);
        console.log('Opacity set to:', alpha);
    }
    catch (error) {
        console.error('Error setting opacity:', error);
    }
});
electron_1.ipcMain.handle('overlay:toggle', () => {
    try {
        if (!overlay)
            return;
        overlay.isVisible() ? overlay.hide() : overlay.show();
        console.log('Overlay toggled via IPC');
    }
    catch (error) {
        console.error('Error toggling overlay:', error);
    }
});
electron_1.ipcMain.handle('overlay:setPositionPreset', (_evt, preset) => {
    try {
        if (!overlay)
            return;
        const pos = calcPresetBounds(preset, { w: 420, h: 160 });
        overlay.setBounds({ x: pos.x, y: pos.y, width: 420, height: 160 });
        console.log('Position preset set to:', preset, pos);
    }
    catch (error) {
        console.error('Error setting position preset:', error);
    }
});
electron_1.app.on('will-quit', () => {
    try {
        electron_1.globalShortcut.unregisterAll();
        console.log('Global shortcuts unregistered');
    }
    catch (error) {
        console.error('Error unregistering shortcuts:', error);
    }
});
electron_1.app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        console.log('All windows closed, quitting app');
        electron_1.app.quit();
    }
});
