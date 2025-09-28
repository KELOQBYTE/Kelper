import { app, BrowserWindow, ipcMain, globalShortcut, Tray, Menu, screen, nativeImage } from 'electron'
import path from 'node:path'

// Configure Electron for headless/server environment
app.commandLine.appendSwitch('no-sandbox')
app.commandLine.appendSwitch('disable-setuid-sandbox')
app.commandLine.appendSwitch('disable-gpu')
app.commandLine.appendSwitch('disable-gpu-sandbox')
app.commandLine.appendSwitch('disable-software-rasterizer')
app.commandLine.appendSwitch('disable-dev-shm-usage')
app.commandLine.appendSwitch('disable-audio-output')
app.commandLine.appendSwitch('disable-audio-input')
app.commandLine.appendSwitch('mute-audio')
app.commandLine.appendSwitch('disable-web-security')
app.commandLine.appendSwitch('ignore-certificate-errors')
app.commandLine.appendSwitch('disable-background-networking')

// Sandbox disabled via command line switches above

let overlay: BrowserWindow | null = null
let settings: BrowserWindow | null = null
let tray: Tray | null = null

function calcPresetBounds(preset: 'top-right'|'bottom-right'|'top-left'|'bottom-left', size = { w: 420, h: 160 }) {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize
  const margin = 16
  const positions = {
    'top-right': { x: width - size.w - margin, y: margin },
    'bottom-right': { x: width - size.w - margin, y: height - size.h - margin },
    'top-left': { x: margin, y: margin },
    'bottom-left': { x: margin, y: height - size.h - margin },
  }
  return positions[preset]
}

function createWindows() {
  try {
    console.log('Creating overlay window...')
    overlay = new BrowserWindow({
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
        preload: path.join(__dirname, 'preload.js'),
        contextIsolation: true,
        nodeIntegration: false,
      },
    })
    
    overlay.setVisibleOnAllWorkspaces(true, { 
      visibleOnFullScreen: true, 
      skipTransformProcessType: true 
    })
    overlay.setAlwaysOnTop(true, 'screen-saver')
    // Start with click-through disabled for UI interaction
    overlay.setIgnoreMouseEvents(false, { forward: true })
    overlay.loadFile(path.join(__dirname, 'overlay.html'))
    console.log('Overlay window created successfully')

    console.log('Creating settings window...')
    settings = new BrowserWindow({
      width: 720,
      height: 520,
      title: 'Coach Settings',
      webPreferences: {
        preload: path.join(__dirname, 'preload.js'),
        contextIsolation: true,
        nodeIntegration: false,
      },
    })
    settings.loadFile(path.join(__dirname, 'settings.html'))
    console.log('Settings window created successfully')

    // Create simple tray icon (using a base64 encoded 16x16 icon)
    const iconData = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAAdgAAAHYBTnsmCAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAFYSURBVDiNpZM9SwNBEIafgxCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLa0sLCwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLa0sLCwsLGwsLGwGHN=='
    
    try {
      console.log('Creating system tray...')
      const trayIcon = nativeImage.createFromDataURL(iconData)
      tray = new Tray(trayIcon)
      const menu = Menu.buildFromTemplate([
        { 
          label: 'Show/Hide Overlay', 
          click: () => {
            if (overlay) {
              overlay.isVisible() ? overlay.hide() : overlay.show()
              console.log('Overlay toggled via tray')
            }
          }
        },
        { 
          label: 'Settings',
          click: () => {
            if (settings) {
              settings.show()
              settings.focus()
              console.log('Settings window opened via tray')
            }
          }
        },
        { 
          label: 'Quit', 
          click: () => { 
            console.log('Quitting application via tray')
            app.quit() 
          } 
        },
      ])
      tray.setToolTip('Interview Coach')
      tray.setContextMenu(menu)
      console.log('System tray created successfully')
    } catch (trayError) {
      console.error('Failed to create system tray:', trayError)
    }

  } catch (error) {
    console.error('Error creating windows:', error)
  }
}

app.whenReady().then(() => {
  try {
    console.log('App ready, creating windows...')
    createWindows()
    
    // Register global shortcut
    const shortcutRegistered = globalShortcut.register('CommandOrControl+Shift+K', () => {
      if (!overlay) return
      overlay.isVisible() ? overlay.hide() : overlay.show()
      console.log('Overlay toggled via global shortcut')
    })
    
    if (shortcutRegistered) {
      console.log('Global shortcut CommandOrControl+Shift+K registered successfully')
    } else {
      console.error('Failed to register global shortcut')
    }
  } catch (error) {
    console.error('Error during app startup:', error)
  }
})

// IPC handlers
ipcMain.handle('overlay:setClickThrough', (_evt, ignore: boolean) => {
  try {
    overlay?.setIgnoreMouseEvents(ignore, { forward: true })
    console.log('Click-through set to:', ignore)
  } catch (error) {
    console.error('Error setting click-through:', error)
  }
})

ipcMain.handle('overlay:setOpacity', (_evt, alpha: number) => {
  try {
    overlay?.setOpacity(alpha)
    console.log('Opacity set to:', alpha)
  } catch (error) {
    console.error('Error setting opacity:', error)
  }
})

ipcMain.handle('overlay:toggle', () => {
  try {
    if (!overlay) return
    overlay.isVisible() ? overlay.hide() : overlay.show()
    console.log('Overlay toggled via IPC')
  } catch (error) {
    console.error('Error toggling overlay:', error)
  }
})

ipcMain.handle('overlay:setPositionPreset', (_evt, preset: 'top-right'|'bottom-right'|'top-left'|'bottom-left') => {
  try {
    if (!overlay) return
    const pos = calcPresetBounds(preset, { w: 420, h: 160 })
    overlay.setBounds({ x: pos.x, y: pos.y, width: 420, height: 160 })
    console.log('Position preset set to:', preset, pos)
  } catch (error) {
    console.error('Error setting position preset:', error)
  }
})

app.on('will-quit', () => { 
  try {
    globalShortcut.unregisterAll()
    console.log('Global shortcuts unregistered')
  } catch (error) {
    console.error('Error unregistering shortcuts:', error)
  }
})

app.on('window-all-closed', () => { 
  if (process.platform !== 'darwin') {
    console.log('All windows closed, quitting app')
    app.quit()
  }
})