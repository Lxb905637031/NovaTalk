/// <reference types="@electron-forge/plugin-vite/forge-vite-env" />

interface ElectronAPI {
  openSettingsWindow: () => void;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}

export {}
