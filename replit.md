# Overview

This is an Electron-based desktop application that creates a transparent, always-on-top overlay for interview coaching. The application provides a floating window that can display prompts and guidance during video interviews or practice sessions. It features a main overlay window that stays visible across all workspaces and a separate settings window for configuration.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Desktop Application Framework
- **Electron**: Cross-platform desktop app framework using web technologies
- **TypeScript**: Main application logic with type safety
- **Multi-window Architecture**: Separate overlay and settings windows with different behaviors

## Window Management
- **Overlay Window**: Frameless, transparent, always-on-top with configurable click-through
- **Settings Window**: Standard window for configuration management
- **Global Shortcuts**: CommandOrControl+Shift+K for quick overlay toggle
- **System Tray Integration**: Tray menu for show/hide and quit functionality

## Inter-Process Communication (IPC)
- **Preload Script Security**: Context isolation with contextBridge API exposure
- **IPC Handlers**: Main process handlers for overlay control (opacity, click-through, positioning, toggle)
- **Renderer Communication**: Secure bridge between main and renderer processes

## UI Components
- **Overlay Interface**: Minimalist coach panel with opacity controls and toggle buttons
- **Settings Interface**: Configuration panel for appearance and positioning
- **Responsive Design**: CSS with backdrop blur effects and modern styling

## State Management
- **Local Storage**: Settings persistence using browser localStorage
- **Default Configuration**: Fallback settings for first-time usage
- **Real-time Updates**: Live preview of settings changes

## Build System
- **TypeScript Compilation**: Source-to-dist compilation workflow
- **Asset Copying**: Static file deployment for HTML/CSS/JS resources
- **Development Scripts**: Dev, build, and start commands for different workflows

# External Dependencies

## Core Framework
- **Electron v27.3.11**: Desktop application runtime and API access
- **TypeScript v5.9.2**: Type-safe JavaScript compilation
- **Node.js Types**: TypeScript definitions for Node.js APIs

## System Integration
- **Global Shortcuts**: Native OS hotkey registration
- **Screen API**: Display detection and positioning calculations
- **Workspace Management**: Cross-desktop visibility controls

## Development Tools
- **NPM**: Package management and script execution
- **TypeScript Compiler**: Build-time type checking and compilation

## Browser APIs
- **Local Storage**: Client-side settings persistence
- **DOM APIs**: UI manipulation and event handling
- **CSS Backdrop Filter**: Modern blur effects for overlay styling