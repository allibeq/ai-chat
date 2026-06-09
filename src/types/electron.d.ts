interface Window {
    electron: {
        saveToken:  (token: string) => Promise<void>
        loadToken:  () => Promise<string | null>
        clearToken: () => Promise<void>
        callAI:     (message: string) => Promise<string>
    }
}
