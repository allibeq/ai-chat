import { contextBridge, ipcRenderer } from 'electron'

export type ElectronBridge = typeof bridge

const bridge = {
    saveToken: (token: string): Promise<void> =>
        ipcRenderer.invoke('auth:save-token', token),
    loadToken: (): Promise<string | null> =>
        ipcRenderer.invoke('auth:load-token'),
    clearToken: (): Promise<void> =>
        ipcRenderer.invoke('auth:clear-token'),
    callAI: (message: string): Promise<string> =>
        ipcRenderer.invoke('ai:chat', message),
}

contextBridge.exposeInMainWorld('electron', bridge)

declare global {
    interface Window {
        electron: import('../electron/preload').ElectronBridge
    }
}